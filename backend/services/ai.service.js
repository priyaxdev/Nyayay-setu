import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-3.6-flash',
  generationConfig: { responseMimeType: 'application/json' },
});

/**
 * ai.service.js
 * ------------------------------------------------------------------
 * Single entry point the rest of the backend talks to for the chatbot.
 * Everything else (routes/controllers) only ever calls
 * `processComplaintMessage(...)` below — it has no idea whether the
 * reply came from the mock or a real model.
 *
 * >>> WHERE TO ADD YOUR REAL AI INTEGRATION <<<
 * Implement `processWithRealAI()` near the bottom of this file and
 * flip AI_PROVIDER in your .env away from "mock". Keep the same
 * input/output shape as the mock so nothing else has to change.
 * ------------------------------------------------------------------
 */

// Order in which we collect information. "stolenItem" is inserted
// dynamically once we know the incident involves theft.
const BASE_FIELD_ORDER = ['incidentType', 'description', 'date', 'location'];
const TAIL_FIELD = 'accusedInfo'; // always asked last, optional-answer

const QUESTIONS = {
  en: {
    incidentType: 'Can you tell me what happened?',
    description: 'Could you briefly describe what happened?',
    date: 'When did this happen?',
    location: 'Where did it happen?',
    stolenItem: 'What exactly was stolen?',
    accusedInfo: 'Do you know anything about the person involved?',
  },
  hi: {
    incidentType: 'क्या हुआ था, कृपया बताएं?',
    description: 'कृपया संक्षेप में बताएं कि क्या हुआ?',
    date: 'यह कब हुआ?',
    location: 'यह कहाँ हुआ?',
    stolenItem: 'क्या चोरी हुआ था?',
    accusedInfo: 'क्या आप उस व्यक्ति के बारे में कुछ जानते हैं?',
  },
};

const CLOSING_MESSAGE = {
  en: 'Thanks. Here is what I understood — please review it below and confirm, or edit anything that looks wrong.',
  hi: 'धन्यवाद। मैंने यह समझा है — कृपया नीचे समीक्षा करें और पुष्टि करें, या कुछ गलत लगे तो सुधारें।',
};

function t(language, key) {
  const lang = QUESTIONS[language] ? language : 'en';
  return QUESTIONS[lang][key];
}

// ---------------------------------------------------------------------
// Lightweight, dependency-free extraction helpers (mock NLU).
// These are intentionally simple keyword/regex heuristics — good enough
// to demonstrate the full flow end to end. Swap for real NLU/LLM output
// when you wire up processWithRealAI().
// ---------------------------------------------------------------------

function isUnsure(text) {
  return /^\s*(?:i\s*)?(?:don'?t\s*know|dont\s*know|not\s*sure|unsure|no\s*idea|nothing|none|no)\.?\s*$/i.test(
    (text || '').trim()
  );
}

function parseIncidentType(text) {
  const lower = text.toLowerCase();
  if (/stolen|steal|theft|robbed|robbery|pickpocket/.test(lower)) return 'theft';
  if (/assault|beaten|hit me|attacked|hurt me/.test(lower)) return 'assault';
  if (/harass|stalk|threaten/.test(lower)) return 'harassment';
  if (/fraud|cheated|scam|duped|fake call/.test(lower)) return 'fraud';
  if (/missing|lost my|can'?t find|misplaced/.test(lower)) return 'lost_property';
  if (/accident|crash|collision|hit by/.test(lower)) return 'accident';
  return null;
}

const ITEM_WORDS = [
  ['phone', 'mobile phone'],
  ['mobile', 'mobile phone'],
  ['wallet', 'wallet'],
  ['purse', 'purse'],
  ['bike', 'bike'],
  ['bicycle', 'bicycle'],
  ['motorcycle', 'motorcycle'],
  ['scooter', 'scooter'],
  ['car', 'car'],
  ['laptop', 'laptop'],
  ['bag', 'bag'],
  ['jewellery', 'jewellery'],
  ['jewelry', 'jewellery'],
  ['cash', 'cash'],
  ['money', 'cash'],
  ['watch', 'watch'],
  ['documents', 'documents'],
];

function parseStolenItem(text) {
  const lower = text.toLowerCase();
  for (const [needle, normalized] of ITEM_WORDS) {
    if (lower.includes(needle)) return normalized;
  }
  return null;
}

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

function parseDateAndTime(text) {
  const lower = text.toLowerCase();
  const now = new Date();
  let date = null;
  let time = null;

  if (/\byesterday\b/.test(lower)) {
    const d = new Date(now);
    d.setDate(d.getDate() - 1);
    date = isoDate(d);
  } else if (/\btoday\b|\btonight\b/.test(lower)) {
    date = isoDate(now);
  } else if (/last night/.test(lower)) {
    const d = new Date(now);
    d.setDate(d.getDate() - 1);
    date = isoDate(d);
    time = 'night';
  } else {
    const explicit = lower.match(/\b(\d{4}-\d{2}-\d{2})\b/) || lower.match(/\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b/);
    if (explicit) date = explicit[1];
  }

  if (!time) {
    if (/morning/.test(lower)) time = 'morning';
    else if (/afternoon|noon/.test(lower)) time = 'afternoon';
    else if (/evening/.test(lower)) time = 'evening';
    else if (/night/.test(lower)) time = 'night';
  }

  return { date, time };
}

function parseLocation(text) {
  const match = text.match(/(?:near|at|in front of|outside|inside|around)\s+([A-Za-z0-9][\w\s.,'-]{2,60}?)(?:[.,!?]|$)/i);
  return match ? match[1].trim() : null;
}

const GENERIC_DESCRIPTIONS = {
  theft: 'Theft reported',
  assault: 'Assault reported',
  harassment: 'Harassment reported',
  fraud: 'Fraud reported',
  lost_property: 'Lost property reported',
  accident: 'Accident reported',
  other: 'Incident reported',
};

// Fills `description` as soon as we know enough to say *something* useful,
// and upgrades it once more specific info (e.g. the stolen item) arrives.
// Must run inline during the replay loop, not only at the end — otherwise
// "description" never counts as resolved mid-loop and blocks every field
// that comes after it in the order.
function syncDescription(complaintData) {
  if (!complaintData.incidentType) return;

  if (complaintData.incidentType === 'theft' && complaintData.stolenItem) {
    complaintData.description = `${complaintData.stolenItem} was reported stolen`;
    return;
  }

  if (!complaintData.description) {
    complaintData.description =
      GENERIC_DESCRIPTIONS[complaintData.incidentType] || GENERIC_DESCRIPTIONS.other;
  }
}

function fieldOrderFor(complaintData) {
  const order = [...BASE_FIELD_ORDER];
  if (complaintData.incidentType === 'theft' || complaintData.incidentType === 'lost_property') {
    order.push('stolenItem');
  }
  order.push(TAIL_FIELD);
  return order;
}

function isResolved(complaintData, field) {
  if (field === 'accusedInfo') return complaintData._accusedResolved === true;
  if (field === 'description') return Boolean(complaintData.description);
  return complaintData[field] !== null && complaintData[field] !== undefined;
}

/**
 * Opportunistically pulls whatever it can out of a single message,
 * writing straight into `complaintData`. Safe to call on every message —
 * it only fills fields that are still empty.
 */
function extractAll(text, complaintData) {
  if (!complaintData.incidentType) {
    const incidentType = parseIncidentType(text);
    if (incidentType) complaintData.incidentType = incidentType;
  }
  if (!complaintData.stolenItem) {
    const item = parseStolenItem(text);
    if (item) complaintData.stolenItem = item;
  }
  if (!complaintData.date || !complaintData.time) {
    const { date, time } = parseDateAndTime(text);
    if (date && !complaintData.date) complaintData.date = date;
    if (time && !complaintData.time) complaintData.time = time;
  }
  if (!complaintData.location) {
    const location = parseLocation(text);
    if (location) complaintData.location = location;
  }
  syncDescription(complaintData);
}

/**
 * Targeted parse for whichever field is currently being asked about —
 * used when the opportunistic pass above didn't already resolve it.
 */
function applyTargetedAnswer(field, text, complaintData) {
  if (isResolved(complaintData, field)) return; // opportunistic pass already got it

  if (isUnsure(text)) {
    // Explicitly store "unknown" rather than inventing a value.
    if (field === 'accusedInfo') {
      complaintData._accusedResolved = true;
    } else if (field !== 'description') {
      complaintData[field] = null; // already null, but marks the turn as handled
    }
    return;
  }

  switch (field) {
    case 'incidentType':
      complaintData.incidentType = parseIncidentType(text) || 'other';
      syncDescription(complaintData);
      break;
    case 'date': {
      const { date, time } = parseDateAndTime(text);
      complaintData.date = date || text.trim();
      if (time && !complaintData.time) complaintData.time = time;
      break;
    }
    case 'location':
      complaintData.location = parseLocation(text) || text.trim();
      break;
    case 'stolenItem':
      complaintData.stolenItem = parseStolenItem(text) || text.trim();
      syncDescription(complaintData);
      break;
    case 'accusedInfo':
      complaintData.accused = { ...complaintData.accused, description: text.trim() };
      complaintData._accusedResolved = true;
      break;
    default:
      break;
  }
}

function emptyComplaintData(language) {
  return {
    incidentType: null,
    description: null,
    date: null,
    time: null,
    location: null,
    victim: {},
    accused: {},
    witnesses: [],
    evidence: [],
    stolenItem: null,
    language: language || 'en',
    _accusedResolved: false,
  };
}

function stripInternal(complaintData) {
  const { _accusedResolved, ...rest } = complaintData;
  return rest;
}

/**
 * Deterministically replays the whole conversation so the backend stays
 * stateless between requests (conversationHistory + the new message is
 * always enough to reconstruct where we are). See README for why.
 *
 * Deliberately ignores the *field values* inside currentComplaintData —
 * conversationHistory is replayed from scratch every time and is the
 * single source of truth. Seeding fields from currentComplaintData too
 * would let already-resolved fields "skip ahead" of where the replay
 * loop actually is, misaligning which message answers which question.
 * currentComplaintData is accepted (per the shared interface) but only
 * used for is-it-present bookkeeping, never merged in.
 */
function mockProcessMessage({ message, conversationHistory = [], language }) {
  const complaintData = emptyComplaintData(language);

  const priorUserMessages = (conversationHistory || [])
    .filter((m) => m.role === 'user')
    .map((m) => m.content);
  const allMessages = [...priorUserMessages, message];

  allMessages.forEach((text, index) => {
    if (index === 0) {
      // Opening message — nothing was "asked" yet, just extract freely.
      extractAll(text, complaintData);
      return;
    }
    // Figure out which field was actually being asked *before* this
    // message is processed, then answer that field specifically — only
    // then do we opportunistically mine the rest of the text for other
    // fields. Doing it in the other order lets a lucky opportunistic
    // match resolve the asked field and causes the same message to be
    // misapplied to whatever question comes next.
    const orderBefore = fieldOrderFor(complaintData);
    const currentField = orderBefore.find((f) => !isResolved(complaintData, f));
    if (currentField) applyTargetedAnswer(currentField, text, complaintData);
    extractAll(text, complaintData);
  });

  const order = fieldOrderFor(complaintData);
  const missingFields = order.filter((f) => !isResolved(complaintData, f));
  const nextField = missingFields[0];

  if (!nextField) {
    return {
      reply: CLOSING_MESSAGE[language] || CLOSING_MESSAGE.en,
      state: 'READY_FOR_CONFIRMATION',
      complaintData: stripInternal(complaintData),
      missingFields: [],
    };
  }

  return {
    reply: t(language, nextField),
    state: 'COLLECTING',
    complaintData: stripInternal(complaintData),
    // "accusedInfo" isn't a schema field itself (it feeds complaintData.accused),
    // so we don't surface it in missingFields — only real schema gaps are reported.
    missingFields: missingFields.filter((f) => f !== 'accusedInfo'),
  };
}

// ---------------------------------------------------------------------
// Real provider integration point (Gemini)
// ---------------------------------------------------------------------

const VALID_STATES = ['COLLECTING', 'READY_FOR_CONFIRMATION'];
const MAX_TURNS_BEFORE_FORCE_CLOSE = 10; // safety cap so a stuck bot can't loop forever

/**
 * Gemini sometimes wraps JSON in ```json ... ``` fences even when we ask
 * for pure JSON. Strip that before parsing, and never let a parse
 * failure crash the whole request.
 */
function safeParseAIResponse(rawText) {
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '');
  cleaned = cleaned.replace(/```\s*$/i, '');

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse AI response as JSON:', cleaned);
    return null; // caller decides the fallback behaviour
  }
}

/**
 * Detects if the bot is about to ask the EXACT same question it already
 * asked before — a sign the citizen's answer wasn't understood, or the
 * model is stuck. We look at the last "model" messages in history.
 */
function isRepeatingQuestion(nextQuestion, conversationHistory) {
  if (!nextQuestion) return false;
  const priorModelMessages = (conversationHistory || [])
    .filter((m) => m.role === 'assistant' || m.role === 'model')
    .map((m) => m.content || (m.parts && m.parts[0]?.text) || '');

  const repeatCount = priorModelMessages.filter(
    (q) => q.trim().toLowerCase() === nextQuestion.trim().toLowerCase()
  ).length;

  return repeatCount >= 2; // asked this exact question twice already
}

async function processWithRealAI({ message, conversationHistory, currentComplaintData, language }) {
  const totalTurns = (conversationHistory || []).length;

  const historyText = (conversationHistory || [])
    .map((m) => `${m.role === 'user' ? 'Citizen' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const prompt = `
You are an FIR (First Information Report) intake assistant for an Indian
police complaint system. The citizen may write in Hindi, English, or
Hinglish. ALWAYS reply in the same language/script the citizen is
currently using in their latest message — if they write in Hindi script,
reply in Hindi script; if Hinglish, reply in Hinglish; if English, reply
in English. Do not assume the language from earlier turns if it changed.

Conversation so far:
${historyText || '(none yet)'}

Citizen's latest message: "${message}"

Current known complaint data (JSON): ${JSON.stringify(currentComplaintData || {})}

TASK:
1. Extract facts only from what's explicitly stated. Never invent details.
2. Merge new information into the existing complaint data (keep old
   values if the new message doesn't mention them).
3. If the citizen's message is vague, uncertain, or says something like
   "I don't know" / "pata nahi" / "not sure" for the CURRENT question,
   accept that as a final answer (store null or "not specified") and
   move on to the next missing field. Do NOT ask the same question again.
4. Decide what important information is still missing for this specific
   type of incident — this varies by case type, decide based on what
   actually happened, don't apply a fixed checklist.
5. If information is missing, ask exactly ONE natural follow-up question
   targeting the single most important gap. Never repeat a question that
   was already asked earlier in this conversation.
6. If nothing important is missing, OR if enough information has been
   gathered to file a basic complaint even with some gaps, set state to
   "READY_FOR_CONFIRMATION" and write a short closing message asking the
   citizen to review the summary below.

Return ONLY valid JSON, no markdown fences, no extra text, in this exact shape:
{
  "complaintData": {
    "incidentType": string or null,
    "description": string or null,
    "date": string or null,
    "time": string or null,
    "location": string or null,
    "victim": object,
    "accused": object,
    "witnesses": array,
    "evidence": array,
    "stolenItem": string or null,
    "language": "${language}"
  },
  "missingFields": ["field_name", "..."],
  "reply": "the question or closing message, in the citizen's language",
  "state": "COLLECTING" or "READY_FOR_CONFIRMATION"
}
  `.trim();

  let parsed = null;

  try {
    const result = await geminiModel.generateContent(prompt);
    parsed = safeParseAIResponse(result.response.text());
  } catch (err) {
    console.error('Gemini API call failed:', err.message);
    // Graceful fallback instead of crashing the whole request —
    // the citizen sees a friendly retry message, not a stack trace.
    return {
      reply:
        language === 'hi'
          ? 'माफ़ कीजिए, अभी तकनीकी समस्या आ रही है। कृपया थोड़ी देर बाद दोबारा कोशिश करें।'
          : 'Sorry, something went wrong on our end. Please try again in a moment.',
      state: 'COLLECTING',
      complaintData: currentComplaintData || {},
      missingFields: [],
    };
  }

  // Parsing failed even after stripping markdown fences.
  if (!parsed) {
    return {
      reply:
        language === 'hi'
          ? 'माफ़ कीजिए, आपकी बात समझने में दिक्कत हुई। क्या आप दोबारा बता सकते हैं?'
          : "Sorry, I had trouble understanding that. Could you rephrase?",
      state: 'COLLECTING',
      complaintData: currentComplaintData || {},
      missingFields: [],
    };
  }

  // Validate state — never trust the model blindly on enum fields.
  let state = VALID_STATES.includes(parsed.state) ? parsed.state : 'COLLECTING';

  // Loop guard: if we're about to ask the same question a 3rd time,
  // force the conversation forward instead of frustrating the citizen.
  if (state === 'COLLECTING' && isRepeatingQuestion(parsed.reply, conversationHistory)) {
    state = 'READY_FOR_CONFIRMATION';
    parsed.reply =
      language === 'hi'
        ? 'ठीक है, जो जानकारी अभी तक मिली है उसकी समीक्षा कर लीजिए और आगे बढ़ें।'
        : "Okay, let's go with what we have so far — please review the summary below.";
  }

  // Safety cap — a runaway conversation shouldn't interrogate forever.
  if (state === 'COLLECTING' && totalTurns >= MAX_TURNS_BEFORE_FORCE_CLOSE) {
    state = 'READY_FOR_CONFIRMATION';
    parsed.reply =
      language === 'hi'
        ? 'धन्यवाद, अब तक जो जानकारी मिली है उसकी समीक्षा कर लीजिए।'
        : "Thanks — let's review what we've gathered so far.";
  }

  return {
    reply: parsed.reply || '',
    state,
    complaintData: parsed.complaintData || currentComplaintData || {},
    missingFields: Array.isArray(parsed.missingFields) ? parsed.missingFields : [],
  };
}
/**
 * Public interface used by chat.controller.js.
 */
export async function processComplaintMessage({ message, conversationHistory, currentComplaintData, language = 'en' }) {
  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new Error('message is required');
  }

  const provider = (process.env.AI_PROVIDER || 'mock').toLowerCase();

  if (provider === 'mock') {
    return mockProcessMessage({ message, conversationHistory, currentComplaintData, language });
  }

  return processWithRealAI({ message, conversationHistory, currentComplaintData, language });
}
