// /**
//  * ai.service.js
//  * ------------------------------------------------------------------
//  * Single entry point the rest of the backend talks to for the chatbot.
//  * Everything else (routes/controllers) only ever calls
//  * `processComplaintMessage(...)` below — it has no idea whether the
//  * reply came from the mock or a real model.
//  *
//  * >>> WHERE TO ADD YOUR REAL AI INTEGRATION <<<
//  * Implement `processWithRealAI()` near the bottom of this file and
//  * flip AI_PROVIDER in your .env away from "mock". Keep the same
//  * input/output shape as the mock so nothing else has to change.
//  * ------------------------------------------------------------------
//  */

// // Order in which we collect information. "stolenItem" is inserted
// // dynamically once we know the incident involves theft.
// const BASE_FIELD_ORDER = ['incidentType', 'description', 'date', 'location'];
// const TAIL_FIELD = 'accusedInfo'; // always asked last, optional-answer

// const QUESTIONS = {
//   en: {
//     incidentType: 'Can you tell me what happened?',
//     description: 'Could you briefly describe what happened?',
//     date: 'When did this happen?',
//     location: 'Where did it happen?',
//     stolenItem: 'What exactly was stolen?',
//     accusedInfo: 'Do you know anything about the person involved?',
//   },
//   hi: {
//     incidentType: 'क्या हुआ था, कृपया बताएं?',
//     description: 'कृपया संक्षेप में बताएं कि क्या हुआ?',
//     date: 'यह कब हुआ?',
//     location: 'यह कहाँ हुआ?',
//     stolenItem: 'क्या चोरी हुआ था?',
//     accusedInfo: 'क्या आप उस व्यक्ति के बारे में कुछ जानते हैं?',
//   },
// };

// const CLOSING_MESSAGE = {
//   en: 'Thanks. Here is what I understood — please review it below and confirm, or edit anything that looks wrong.',
//   hi: 'धन्यवाद। मैंने यह समझा है — कृपया नीचे समीक्षा करें और पुष्टि करें, या कुछ गलत लगे तो सुधारें।',
// };

// function t(language, key) {
//   const lang = QUESTIONS[language] ? language : 'en';
//   return QUESTIONS[lang][key];
// }

// // ---------------------------------------------------------------------
// // Lightweight, dependency-free extraction helpers (mock NLU).
// // These are intentionally simple keyword/regex heuristics — good enough
// // to demonstrate the full flow end to end. Swap for real NLU/LLM output
// // when you wire up processWithRealAI().
// // ---------------------------------------------------------------------

// function isUnsure(text) {
//   return /^\s*(?:i\s*)?(?:don'?t\s*know|dont\s*know|not\s*sure|unsure|no\s*idea|nothing|none|no)\.?\s*$/i.test(
//     (text || '').trim()
//   );
// }

// function parseIncidentType(text) {
//   const lower = text.toLowerCase();
//   if (/stolen|steal|theft|robbed|robbery|pickpocket/.test(lower)) return 'theft';
//   if (/assault|beaten|hit me|attacked|hurt me/.test(lower)) return 'assault';
//   if (/harass|stalk|threaten/.test(lower)) return 'harassment';
//   if (/fraud|cheated|scam|duped|fake call/.test(lower)) return 'fraud';
//   if (/missing|lost my|can'?t find|misplaced/.test(lower)) return 'lost_property';
//   if (/accident|crash|collision|hit by/.test(lower)) return 'accident';
//   return null;
// }

// const ITEM_WORDS = [
//   ['phone', 'mobile phone'],
//   ['mobile', 'mobile phone'],
//   ['wallet', 'wallet'],
//   ['purse', 'purse'],
//   ['bike', 'bike'],
//   ['bicycle', 'bicycle'],
//   ['motorcycle', 'motorcycle'],
//   ['scooter', 'scooter'],
//   ['car', 'car'],
//   ['laptop', 'laptop'],
//   ['bag', 'bag'],
//   ['jewellery', 'jewellery'],
//   ['jewelry', 'jewellery'],
//   ['cash', 'cash'],
//   ['money', 'cash'],
//   ['watch', 'watch'],
//   ['documents', 'documents'],
// ];

// function parseStolenItem(text) {
//   const lower = text.toLowerCase();
//   for (const [needle, normalized] of ITEM_WORDS) {
//     if (lower.includes(needle)) return normalized;
//   }
//   return null;
// }

// function isoDate(d) {
//   return d.toISOString().slice(0, 10);
// }

// function parseDateAndTime(text) {
//   const lower = text.toLowerCase();
//   const now = new Date();
//   let date = null;
//   let time = null;

//   if (/\byesterday\b/.test(lower)) {
//     const d = new Date(now);
//     d.setDate(d.getDate() - 1);
//     date = isoDate(d);
//   } else if (/\btoday\b|\btonight\b/.test(lower)) {
//     date = isoDate(now);
//   } else if (/last night/.test(lower)) {
//     const d = new Date(now);
//     d.setDate(d.getDate() - 1);
//     date = isoDate(d);
//     time = 'night';
//   } else {
//     const explicit = lower.match(/\b(\d{4}-\d{2}-\d{2})\b/) || lower.match(/\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b/);
//     if (explicit) date = explicit[1];
//   }

//   if (!time) {
//     if (/morning/.test(lower)) time = 'morning';
//     else if (/afternoon|noon/.test(lower)) time = 'afternoon';
//     else if (/evening/.test(lower)) time = 'evening';
//     else if (/night/.test(lower)) time = 'night';
//   }

//   return { date, time };
// }

// function parseLocation(text) {
//   const match = text.match(/(?:near|at|in front of|outside|inside|around)\s+([A-Za-z0-9][\w\s.,'-]{2,60}?)(?:[.,!?]|$)/i);
//   return match ? match[1].trim() : null;
// }

// const GENERIC_DESCRIPTIONS = {
//   theft: 'Theft reported',
//   assault: 'Assault reported',
//   harassment: 'Harassment reported',
//   fraud: 'Fraud reported',
//   lost_property: 'Lost property reported',
//   accident: 'Accident reported',
//   other: 'Incident reported',
// };

// // Fills `description` as soon as we know enough to say *something* useful,
// // and upgrades it once more specific info (e.g. the stolen item) arrives.
// // Must run inline during the replay loop, not only at the end — otherwise
// // "description" never counts as resolved mid-loop and blocks every field
// // that comes after it in the order.
// function syncDescription(complaintData) {
//   if (!complaintData.incidentType) return;

//   if (complaintData.incidentType === 'theft' && complaintData.stolenItem) {
//     complaintData.description = `${complaintData.stolenItem} was reported stolen`;
//     return;
//   }

//   if (!complaintData.description) {
//     complaintData.description =
//       GENERIC_DESCRIPTIONS[complaintData.incidentType] || GENERIC_DESCRIPTIONS.other;
//   }
// }

// function fieldOrderFor(complaintData) {
//   const order = [...BASE_FIELD_ORDER];
//   if (complaintData.incidentType === 'theft' || complaintData.incidentType === 'lost_property') {
//     order.push('stolenItem');
//   }
//   order.push(TAIL_FIELD);
//   return order;
// }

// function isResolved(complaintData, field) {
//   if (field === 'accusedInfo') return complaintData._accusedResolved === true;
//   if (field === 'description') return Boolean(complaintData.description);
//   return complaintData[field] !== null && complaintData[field] !== undefined;
// }

// /**
//  * Opportunistically pulls whatever it can out of a single message,
//  * writing straight into `complaintData`. Safe to call on every message —
//  * it only fills fields that are still empty.
//  */
// function extractAll(text, complaintData) {
//   if (!complaintData.incidentType) {
//     const incidentType = parseIncidentType(text);
//     if (incidentType) complaintData.incidentType = incidentType;
//   }
//   if (!complaintData.stolenItem) {
//     const item = parseStolenItem(text);
//     if (item) complaintData.stolenItem = item;
//   }
//   if (!complaintData.date || !complaintData.time) {
//     const { date, time } = parseDateAndTime(text);
//     if (date && !complaintData.date) complaintData.date = date;
//     if (time && !complaintData.time) complaintData.time = time;
//   }
//   if (!complaintData.location) {
//     const location = parseLocation(text);
//     if (location) complaintData.location = location;
//   }
//   syncDescription(complaintData);
// }

// /**
//  * Targeted parse for whichever field is currently being asked about —
//  * used when the opportunistic pass above didn't already resolve it.
//  */
// function applyTargetedAnswer(field, text, complaintData) {
//   if (isResolved(complaintData, field)) return; // opportunistic pass already got it

//   if (isUnsure(text)) {
//     // Explicitly store "unknown" rather than inventing a value.
//     if (field === 'accusedInfo') {
//       complaintData._accusedResolved = true;
//     } else if (field !== 'description') {
//       complaintData[field] = null; // already null, but marks the turn as handled
//     }
//     return;
//   }

//   switch (field) {
//     case 'incidentType':
//       complaintData.incidentType = parseIncidentType(text) || 'other';
//       syncDescription(complaintData);
//       break;
//     case 'date': {
//       const { date, time } = parseDateAndTime(text);
//       complaintData.date = date || text.trim();
//       if (time && !complaintData.time) complaintData.time = time;
//       break;
//     }
//     case 'location':
//       complaintData.location = parseLocation(text) || text.trim();
//       break;
//     case 'stolenItem':
//       complaintData.stolenItem = parseStolenItem(text) || text.trim();
//       syncDescription(complaintData);
//       break;
//     case 'accusedInfo':
//       complaintData.accused = { ...complaintData.accused, description: text.trim() };
//       complaintData._accusedResolved = true;
//       break;
//     default:
//       break;
//   }
// }

// function emptyComplaintData(language) {
//   return {
//     incidentType: null,
//     description: null,
//     date: null,
//     time: null,
//     location: null,
//     victim: {},
//     accused: {},
//     witnesses: [],
//     evidence: [],
//     stolenItem: null,
//     language: language || 'en',
//     _accusedResolved: false,
//   };
// }

// function stripInternal(complaintData) {
//   const { _accusedResolved, ...rest } = complaintData;
//   return rest;
// }

// /**
//  * Deterministically replays the whole conversation so the backend stays
//  * stateless between requests (conversationHistory + the new message is
//  * always enough to reconstruct where we are). See README for why.
//  *
//  * Deliberately ignores the *field values* inside currentComplaintData —
//  * conversationHistory is replayed from scratch every time and is the
//  * single source of truth. Seeding fields from currentComplaintData too
//  * would let already-resolved fields "skip ahead" of where the replay
//  * loop actually is, misaligning which message answers which question.
//  * currentComplaintData is accepted (per the shared interface) but only
//  * used for is-it-present bookkeeping, never merged in.
//  */
// function mockProcessMessage({ message, conversationHistory = [], language }) {
//   const complaintData = emptyComplaintData(language);

//   const priorUserMessages = (conversationHistory || [])
//     .filter((m) => m.role === 'user')
//     .map((m) => m.content);
//   const allMessages = [...priorUserMessages, message];

//   allMessages.forEach((text, index) => {
//     if (index === 0) {
//       // Opening message — nothing was "asked" yet, just extract freely.
//       extractAll(text, complaintData);
//       return;
//     }
//     // Figure out which field was actually being asked *before* this
//     // message is processed, then answer that field specifically — only
//     // then do we opportunistically mine the rest of the text for other
//     // fields. Doing it in the other order lets a lucky opportunistic
//     // match resolve the asked field and causes the same message to be
//     // misapplied to whatever question comes next.
//     const orderBefore = fieldOrderFor(complaintData);
//     const currentField = orderBefore.find((f) => !isResolved(complaintData, f));
//     if (currentField) applyTargetedAnswer(currentField, text, complaintData);
//     extractAll(text, complaintData);
//   });

//   const order = fieldOrderFor(complaintData);
//   const missingFields = order.filter((f) => !isResolved(complaintData, f));
//   const nextField = missingFields[0];

//   if (!nextField) {
//     return {
//       reply: CLOSING_MESSAGE[language] || CLOSING_MESSAGE.en,
//       state: 'READY_FOR_CONFIRMATION',
//       complaintData: stripInternal(complaintData),
//       missingFields: [],
//     };
//   }

//   return {
//     reply: t(language, nextField),
//     state: 'COLLECTING',
//     complaintData: stripInternal(complaintData),
//     // "accusedInfo" isn't a schema field itself (it feeds complaintData.accused),
//     // so we don't surface it in missingFields — only real schema gaps are reported.
//     missingFields: missingFields.filter((f) => f !== 'accusedInfo'),
//   };
// }

// // ---------------------------------------------------------------------
// // Real provider integration point
// // ---------------------------------------------------------------------

// /**
//  * TODO(you): implement this once you're ready to plug in a real model.
//  *
//  * Must resolve to the same shape the mock returns:
//  *   { reply, state, complaintData, missingFields }
//  *
//  * state must be one of: COLLECTING | READY_FOR_CONFIRMATION
//  * (CONFIRMED / SUBMITTED are set elsewhere, not by the AI layer).
//  *
//  * Do NOT read process.env.OPENAI_API_KEY (or any provider key) anywhere
//  * outside this function, and never return it or log it.
//  */
// // eslint-disable-next-line no-unused-vars
// async function processWithRealAI({ message, conversationHistory, currentComplaintData, language }) {
//   throw new Error(
//     `AI_PROVIDER="${process.env.AI_PROVIDER}" has no implementation yet. ` +
//       'Implement processWithRealAI() in server/services/ai.service.js.'
//   );
// }

// /**
//  * Public interface used by chat.controller.js.
//  */
// export async function processComplaintMessage({ message, conversationHistory, currentComplaintData, language = 'en' }) {
//   if (!message || typeof message !== 'string' || !message.trim()) {
//     throw new Error('message is required');
//   }

//   const provider = (process.env.AI_PROVIDER || 'mock').toLowerCase();

//   if (provider === 'mock') {
//     return mockProcessMessage({ message, conversationHistory, currentComplaintData, language });
//   }

//   return processWithRealAI({ message, conversationHistory, currentComplaintData, language });
// }
/**
 * ai.service.js
 * ------------------------------------------------------------------
 * Single entry point the rest of the backend talks to for the chatbot.
 * Everything else (routes/controllers) only ever calls
 * `processComplaintMessage(...)` below — it has no idea whether the
 * reply came from the mock or a real model.
 * ------------------------------------------------------------------
 */

// Order in which we collect information. "stolenItem" is inserted
// dynamically once we know the incident involves theft.
// const BASE_FIELD_ORDER = ['incidentType', 'description', 'date', 'location'];
// const TAIL_FIELD = 'accusedInfo'; // always asked last, optional-answer

// const QUESTIONS = {
//   en: {
//     incidentType: 'Can you tell me what happened?',
//     description: 'Could you briefly describe what happened?',
//     date: 'When did this happen?',
//     location: 'Where did it happen?',
//     stolenItem: 'What exactly was stolen?',
//     accusedInfo: 'Do you know anything about the person involved?',
//   },
//   hi: {
//     incidentType: 'क्या हुआ था, कृपया बताएं?',
//     description: 'कृपया संक्षेप में बताएं कि क्या हुआ?',
//     date: 'यह कब हुआ?',
//     location: 'यह कहाँ हुआ?',
//     stolenItem: 'क्या चोरी हुआ था?',
//     accusedInfo: 'क्या आप उस व्यक्ति के बारे में कुछ जानते हैं?',
//   },
// };

// const CLOSING_MESSAGE = {
//   en: 'Thanks. Here is what I understood — please review it below and confirm, or edit anything that looks wrong.',
//   hi: 'धन्यवाद। मैंने यह समझा है — कृपया नीचे समीक्षा करें और पुष्टि करें, या कुछ गलत लगे तो सुधारें।',
// };

// function t(language, key) {
//   const lang = QUESTIONS[language] ? language : 'en';
//   return QUESTIONS[lang][key];
// }

// // ---------------------------------------------------------------------
// // Lightweight, dependency-free extraction helpers (mock NLU).
// // Kept as AI_PROVIDER=mock fallback / offline demo mode.
// // ---------------------------------------------------------------------

// function isUnsure(text) {
//   return /^\s*(?:i\s*)?(?:don'?t\s*know|dont\s*know|not\s*sure|unsure|no\s*idea|nothing|none|no)\.?\s*$/i.test(
//     (text || '').trim()
//   );
// }

// function parseIncidentType(text) {
//   const lower = text.toLowerCase();
//   if (/stolen|steal|theft|robbed|robbery|pickpocket/.test(lower)) return 'theft';
//   if (/assault|beaten|hit me|attacked|hurt me/.test(lower)) return 'assault';
//   if (/harass|stalk|threaten/.test(lower)) return 'harassment';
//   if (/fraud|cheated|scam|duped|fake call/.test(lower)) return 'fraud';
//   if (/missing|lost my|can'?t find|misplaced/.test(lower)) return 'lost_property';
//   if (/accident|crash|collision|hit by/.test(lower)) return 'accident';
//   return null;
// }

// const ITEM_WORDS = [
//   ['phone', 'mobile phone'],
//   ['mobile', 'mobile phone'],
//   ['wallet', 'wallet'],
//   ['purse', 'purse'],
//   ['bike', 'bike'],
//   ['bicycle', 'bicycle'],
//   ['motorcycle', 'motorcycle'],
//   ['scooter', 'scooter'],
//   ['car', 'car'],
//   ['laptop', 'laptop'],
//   ['bag', 'bag'],
//   ['jewellery', 'jewellery'],
//   ['jewelry', 'jewellery'],
//   ['cash', 'cash'],
//   ['money', 'cash'],
//   ['watch', 'watch'],
//   ['documents', 'documents'],
// ];

// function parseStolenItem(text) {
//   const lower = text.toLowerCase();
//   for (const [needle, normalized] of ITEM_WORDS) {
//     if (lower.includes(needle)) return normalized;
//   }
//   return null;
// }

// function isoDate(d) {
//   return d.toISOString().slice(0, 10);
// }

// function parseDateAndTime(text) {
//   const lower = text.toLowerCase();
//   const now = new Date();
//   let date = null;
//   let time = null;

//   if (/\byesterday\b/.test(lower)) {
//     const d = new Date(now);
//     d.setDate(d.getDate() - 1);
//     date = isoDate(d);
//   } else if (/\btoday\b|\btonight\b/.test(lower)) {
//     date = isoDate(now);
//   } else if (/last night/.test(lower)) {
//     const d = new Date(now);
//     d.setDate(d.getDate() - 1);
//     date = isoDate(d);
//     time = 'night';
//   } else {
//     const explicit = lower.match(/\b(\d{4}-\d{2}-\d{2})\b/) || lower.match(/\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b/);
//     if (explicit) date = explicit[1];
//   }

//   if (!time) {
//     if (/morning/.test(lower)) time = 'morning';
//     else if (/afternoon|noon/.test(lower)) time = 'afternoon';
//     else if (/evening/.test(lower)) time = 'evening';
//     else if (/night/.test(lower)) time = 'night';
//   }

//   return { date, time };
// }

// function parseLocation(text) {
//   const match = text.match(/(?:near|at|in front of|outside|inside|around)\s+([A-Za-z0-9][\w\s.,'-]{2,60}?)(?:[.,!?]|$)/i);
//   return match ? match[1].trim() : null;
// }

// const GENERIC_DESCRIPTIONS = {
//   theft: 'Theft reported',
//   assault: 'Assault reported',
//   harassment: 'Harassment reported',
//   fraud: 'Fraud reported',
//   lost_property: 'Lost property reported',
//   accident: 'Accident reported',
//   other: 'Incident reported',
// };

// function syncDescription(complaintData) {
//   if (!complaintData.incidentType) return;

//   if (complaintData.incidentType === 'theft' && complaintData.stolenItem) {
//     complaintData.description = `${complaintData.stolenItem} was reported stolen`;
//     return;
//   }

//   if (!complaintData.description) {
//     complaintData.description =
//       GENERIC_DESCRIPTIONS[complaintData.incidentType] || GENERIC_DESCRIPTIONS.other;
//   }
// }

// function fieldOrderFor(complaintData) {
//   const order = [...BASE_FIELD_ORDER];
//   if (complaintData.incidentType === 'theft' || complaintData.incidentType === 'lost_property') {
//     order.push('stolenItem');
//   }
//   order.push(TAIL_FIELD);
//   return order;
// }

// function isResolved(complaintData, field) {
//   if (field === 'accusedInfo') return complaintData._accusedResolved === true;
//   if (field === 'description') return Boolean(complaintData.description);
//   return complaintData[field] !== null && complaintData[field] !== undefined;
// }

// function extractAll(text, complaintData) {
//   if (!complaintData.incidentType) {
//     const incidentType = parseIncidentType(text);
//     if (incidentType) complaintData.incidentType = incidentType;
//   }
//   if (!complaintData.stolenItem) {
//     const item = parseStolenItem(text);
//     if (item) complaintData.stolenItem = item;
//   }
//   if (!complaintData.date || !complaintData.time) {
//     const { date, time } = parseDateAndTime(text);
//     if (date && !complaintData.date) complaintData.date = date;
//     if (time && !complaintData.time) complaintData.time = time;
//   }
//   if (!complaintData.location) {
//     const location = parseLocation(text);
//     if (location) complaintData.location = location;
//   }
//   syncDescription(complaintData);
// }

// function applyTargetedAnswer(field, text, complaintData) {
//   if (isResolved(complaintData, field)) return;

//   if (isUnsure(text)) {
//     if (field === 'accusedInfo') {
//       complaintData._accusedResolved = true;
//     } else if (field !== 'description') {
//       complaintData[field] = null;
//     }
//     return;
//   }

//   switch (field) {
//     case 'incidentType':
//       complaintData.incidentType = parseIncidentType(text) || 'other';
//       syncDescription(complaintData);
//       break;
//     case 'date': {
//       const { date, time } = parseDateAndTime(text);
//       complaintData.date = date || text.trim();
//       if (time && !complaintData.time) complaintData.time = time;
//       break;
//     }
//     case 'location':
//       complaintData.location = parseLocation(text) || text.trim();
//       break;
//     case 'stolenItem':
//       complaintData.stolenItem = parseStolenItem(text) || text.trim();
//       syncDescription(complaintData);
//       break;
//     case 'accusedInfo':
//       complaintData.accused = { ...complaintData.accused, description: text.trim() };
//       complaintData._accusedResolved = true;
//       break;
//     default:
//       break;
//   }
// }

// function emptyComplaintData(language) {
//   return {
//     incidentType: null,
//     description: null,
//     date: null,
//     time: null,
//     location: null,
//     victim: {},
//     accused: {},
//     witnesses: [],
//     evidence: [],
//     stolenItem: null,
//     language: language || 'en',
//     _accusedResolved: false,
//   };
// }

// function stripInternal(complaintData) {
//   const { _accusedResolved, ...rest } = complaintData;
//   return rest;
// }

// function mockProcessMessage({ message, conversationHistory = [], language }) {
//   const complaintData = emptyComplaintData(language);

//   const priorUserMessages = (conversationHistory || [])
//     .filter((m) => m.role === 'user')
//     .map((m) => m.content);
//   const allMessages = [...priorUserMessages, message];

//   allMessages.forEach((text, index) => {
//     if (index === 0) {
//       extractAll(text, complaintData);
//       return;
//     }
//     const orderBefore = fieldOrderFor(complaintData);
//     const currentField = orderBefore.find((f) => !isResolved(complaintData, f));
//     if (currentField) applyTargetedAnswer(currentField, text, complaintData);
//     extractAll(text, complaintData);
//   });

//   const order = fieldOrderFor(complaintData);
//   const missingFields = order.filter((f) => !isResolved(complaintData, f));
//   const nextField = missingFields[0];

//   if (!nextField) {
//     return {
//       reply: CLOSING_MESSAGE[language] || CLOSING_MESSAGE.en,
//       state: 'READY_FOR_CONFIRMATION',
//       complaintData: stripInternal(complaintData),
//       missingFields: [],
//     };
//   }

//   return {
//     reply: t(language, nextField),
//     state: 'COLLECTING',
//     complaintData: stripInternal(complaintData),
//     missingFields: missingFields.filter((f) => f !== 'accusedInfo'),
//   };
// }

// // ---------------------------------------------------------------------
// // Real provider integration — this is the part that was previously a stub
// // ---------------------------------------------------------------------

// async function processWithRealAI({ message, conversationHistory, currentComplaintData, language }) {
//   const systemPrompt = `You are an information-extraction assistant for an Indian police
// complaint system. The citizen may write in Hindi, English, Hinglish, or a mix of languages.

// RULES:
// - Extract only explicitly stated information. Never invent facts.
// - The set of relevant fields depends on the incident (theft needs item/brand/IMEI,
//   assault needs injury/safety info, fraud needs transaction details, etc.) —
//   decide what matters per case. Do not force a fixed checklist onto every complaint.
// - If immediate danger, serious injury, or a child is involved, prioritize a
//   safety/medical question above everything else.
// - Ask exactly ONE next question at a time, written in the citizen's own language.
// - Never fabricate a value — use null for anything not yet known.
// - Once you have enough information to file a complaint (not everything possible,
//   just enough for police to act), set ready_for_confirmation to true.

// Return ONLY valid JSON in exactly this shape, nothing else, no markdown fences:
// {
//   "facts": { "incidentType": string|null, "description": string|null, "...": "any other relevant fields" },
//   "missing_information": [{ "information": string, "priority": "critical"|"high"|"medium" }],
//   "next_question": string,
//   "ready_for_confirmation": boolean
// }`;

//   const messages = [
//     { role: 'system', content: systemPrompt },
//     ...(conversationHistory || []).map((m) => ({
//       role: m.role === 'user' ? 'user' : 'assistant',
//       content: m.content,
//     })),
//     { role: 'user', content: message },
//   ];

//   const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       // Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//     },
//     body: JSON.stringify({
//       // model: 'gpt-4o-mini',
//       model: 'llama-3.3-70b-versatile',
//       messages,
//       response_format: { type: 'json_object' },
//       temperature: 0.2,
//     }),
//   });

//   if (!response.ok) {
//     const errText = await response.text();
//     throw new Error(`OpenAI API error: ${response.status} ${errText}`);
//   }

//   const data = await response.json();
//   const parsed = JSON.parse(data.choices[0].message.content);

//   return {
//     reply: parsed.next_question,
//     state: parsed.ready_for_confirmation ? 'READY_FOR_CONFIRMATION' : 'COLLECTING',
//     complaintData: { ...currentComplaintData, ...parsed.facts, language },
//     missingFields: (parsed.missing_information || []).map((m) => m.information),
//   };
// }

// /**
//  * Public interface used by chat.controller.js.
//  */
// export async function processComplaintMessage({ message, conversationHistory, currentComplaintData, language = 'en' }) {
//   if (!message || typeof message !== 'string' || !message.trim()) {
//     throw new Error('message is required');
//   }

//   // const provider = (process.env.AI_PROVIDER || 'mock').toLowerCase();

//   // if (provider === 'mock') {
//   //   return mockProcessMessage({ message, conversationHistory, currentComplaintData, language });
//   // }

//   // return processWithRealAI({ message, conversationHistory, currentComplaintData, language });
//      const provider = (process.env.AI_PROVIDER || 'mock').toLowerCase();
//    if (provider === 'mock') {
//      return mockProcessMessage({ message, conversationHistory, currentComplaintData, language });
//    }
//    return processWithRealAI({ message, conversationHistory, currentComplaintData, language }); // handles both 'openai' and 'groq' now
// }
/**
 * ai.service.js
 * ------------------------------------------------------------------
 * Single entry point the rest of the backend talks to for the chatbot.
 * Everything else (routes/controllers) only ever calls
 * `processComplaintMessage(...)` below — it has no idea whether the
 * reply came from the mock or a real model.
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

function mockProcessMessage({ message, conversationHistory = [], language }) {
  const complaintData = emptyComplaintData(language);

  const priorUserMessages = (conversationHistory || [])
    .filter((m) => m.role === 'user')
    .map((m) => m.content);
  const allMessages = [...priorUserMessages, message];

  allMessages.forEach((text, index) => {
    if (index === 0) {
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
// Real provider integration — works with OpenAI OR Groq (same API shape)
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
  const provider = (process.env.AI_PROVIDER || '').toLowerCase();

  const endpoint =
    provider === 'groq'
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';

  const apiKey = provider === 'groq' ? process.env.GROQ_API_KEY : process.env.OPENAI_API_KEY;
  // const model = provider === 'groq' ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini';
  const model = provider === 'groq' ? 'openai/gpt-oss-120b' : 'gpt-4o-mini';

  if (!apiKey) {
    throw new Error(`AI_PROVIDER="${provider}" is set but its API key is missing from .env`);
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
  "facts": { "incidentType": string|null, "description": string|null, "...": "any other relevant fields" },
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
    throw new Error(`${provider} API error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  const parsed = JSON.parse(data.choices[0].message.content);

  return {
    reply: parsed.next_question,
    state: parsed.ready_for_confirmation ? 'READY_FOR_CONFIRMATION' : 'COLLECTING',
    complaintData: { ...currentComplaintData, ...parsed.facts, language },
    missingFields: (parsed.missing_information || []).map((m) => m.information),
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