/**
 * ai.service.js
 * ------------------------------------------------------------------
 * Single entry point the rest of the backend talks to for the chatbot.
 * Routes and controllers only ever call `processComplaintMessage(...)`.
 * Supports "groq", "openai", and offline "mock" providers via AI_PROVIDER.
 * ------------------------------------------------------------------
 */

const BASE_FIELD_ORDER = ['incidentType', 'description', 'date', 'location'];
const TAIL_FIELD = 'accusedInfo';

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
// Mock NLU — kept as AI_PROVIDER=mock fallback / offline demo mode.
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

function applyTargetedAnswer(field, text, complaintData) {
  if (isResolved(complaintData, field)) return;

  if (isUnsure(text)) {
    if (field === 'accusedInfo') {
      complaintData._accusedResolved = true;
    } else if (field !== 'description') {
      complaintData[field] = null;
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

function mockProcessMessage({ message, conversationHistory = [], currentComplaintData, language }) {
  const complaintData = { ...emptyComplaintData(language), ...(currentComplaintData || {}) };

  const priorUserMessages = (conversationHistory || [])
    .filter((m) => m.role === 'user')
    .map((m) => m.content);
  const allMessages = [...priorUserMessages, message];

  allMessages.forEach((text, index) => {
    if (index === 0 && !currentComplaintData) {
      extractAll(text, complaintData);
      return;
    }
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
    missingFields: missingFields.filter((f) => f !== 'accusedInfo'),
  };
}

// ---------------------------------------------------------------------
// Real provider integration — OpenAI / Groq (Chat Completions JSON Mode)
// ---------------------------------------------------------------------

const LANGUAGE_NAMES = {
  en: 'English',
  hi: 'Hindi (Devanagari script)',
  'hi-en': 'Hinglish (Hindi written in Roman/English letters, casual mixed style)',
  bn: 'Bengali (Bengali script)',
  mr: 'Marathi (Devanagari script)',
  ta: 'Tamil (Tamil script)',
};

async function processWithRealAI({ message, conversationHistory, currentComplaintData, language }) {
  const provider = (process.env.AI_PROVIDER || 'groq').toLowerCase();

  const endpoint =
    provider === 'groq'
      ? (process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1/chat/completions')
      : (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/chat/completions');

  const apiKey = provider === 'groq' ? process.env.GROQ_API_KEY : process.env.OPENAI_API_KEY;
  const model =
    provider === 'groq'
      ? (process.env.GROQ_MODEL || 'llama-3.3-70b-versatile')
      : (process.env.OPENAI_MODEL || 'gpt-4o-mini');

  if (!apiKey) {
    throw new Error(`AI_PROVIDER="${provider}" is configured, but the API key is missing from environment.`);
  }

  const languageName = LANGUAGE_NAMES[language] || LANGUAGE_NAMES.en;

  const systemPrompt = `You are an information-extraction assistant for an Indian police
complaint system. The citizen may write in Hindi, English, Hinglish, or a mix of languages —
but the citizen has explicitly selected an assistant language, which you MUST follow.

RESPOND IN THIS LANGUAGE, ALWAYS: ${languageName}
(Follow this selection even if the citizen types their message in a different language.)

RULES:
- Extract only explicitly stated information. Never invent facts.
- The set of relevant fields depends on the incident (theft needs item/brand/IMEI,
  assault needs injury/safety info, fraud needs transaction details, etc.) —
  decide what matters per case. Do not force a fixed checklist onto every complaint.
- If immediate danger, serious injury, or a child is involved, prioritize a
  safety/medical question above everything else.
- Ask exactly ONE next question at a time, written in the language specified above.
- Never fabricate a value — use null for anything not yet known.
- Once you have enough information to file a complaint (not everything possible,
  just enough for police to act), set ready_for_confirmation to true.

Return ONLY valid JSON in exactly this shape, nothing else, no markdown fences:
{
  "facts": { "incidentType": string|null, "description": string|null, "date": string|null, "time": string|null, "location": string|null, "stolenItem": string|null },
  "missing_information": [{ "information": string, "priority": "critical"|"high"|"medium" }],
  "next_question": string,
  "ready_for_confirmation": boolean
}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...(conversationHistory || []).map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    })),
    { role: 'user', content: message },
  ];

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      response_format: { type: 'json_object' },
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`${provider} API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content || '{}';

  let parsed;
  try {
    const cleaned = rawContent.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    parsed = JSON.parse(cleaned);
  } catch (parseErr) {
    console.error('[ai.service] Failed to parse AI JSON response:', rawContent, parseErr);
    throw new Error('AI response format was invalid.');
  }

  return {
    reply: parsed.next_question || 'Could you please provide more details about what happened?',
    state: parsed.ready_for_confirmation ? 'READY_FOR_CONFIRMATION' : 'COLLECTING',
    complaintData: {
      ...(currentComplaintData || {}),
      ...(parsed.facts || {}),
      language,
    },
    missingFields: (parsed.missing_information || []).map((m) =>
      typeof m === 'string' ? m : m.information || ''
    ).filter(Boolean),
  };
}

/**
 * Public interface used by chat.controller.js.
 */
export async function processComplaintMessage({
  message,
  conversationHistory = [],
  currentComplaintData = null,
  language = 'en',
}) {
  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new Error('message is required');
  }

  const provider = (process.env.AI_PROVIDER || 'mock').toLowerCase();

  if (provider === 'mock') {
    return mockProcessMessage({
      message,
      conversationHistory,
      currentComplaintData,
      language,
    });
  }

  return processWithRealAI({
    message,
    conversationHistory,
    currentComplaintData,
    language,
  });
}