// import { useState, useCallback } from 'react';
// import {
//   sendChatMessage,
//   submitComplaint,
//   type ChatMessage,
//   type ChatState,
//   type ComplaintData,
//   type Complaint,
// } from '../services/api';

// function makeConversationId() {
//   return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
// }

// const INITIAL_PROMPT: Record<string, string> = {
//   English: 'Namaste! I am NyayaBot, your legal & complaint filing assistant. Please tell me what happened in your own words.',
//   Hindi: 'नमस्ते! मैं न्यायबॉट हूँ, आपका कानूनी व शिकायत दर्ज सहायक। कृपया मुझे बताएं कि क्या हुआ था।',
//   Hinglish: 'Namaste! Main NyayaBot hoon, aapka legal complaint assistant. Please batayein kya hua tha.',
// };

// export function useComplaintChat({ language = 'English' }: { language?: string } = {}) {
//   const [conversationId, setConversationId] = useState(makeConversationId);
//   const [messages, setMessages] = useState<ChatMessage[]>(() => [
//     {
//       role: 'assistant',
//       content: INITIAL_PROMPT[language] || INITIAL_PROMPT.English,
//       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//     },
//   ]);
//   const [complaintData, setComplaintData] = useState<ComplaintData | null>(null);
//   const [missingFields, setMissingFields] = useState<string[]>([]);
//   const [state, setState] = useState<ChatState>('COLLECTING');
//   const [isSending, setIsSending] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);

//   const sendMessage = useCallback(
//     async (text: string) => {
//       if (!text.trim() || isSending) return;
//       setError(null);
//       setIsSending(true);

//       const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//       const userMessage: ChatMessage = { role: 'user', content: text.trim(), timestamp: userTime };
      
//       // Keep running history for LLM (only user/assistant turns)
//       const historyForRequest = [...messages, userMessage].map((m) => ({
//         role: m.role,
//         content: m.content,
//       }));

//       setMessages((prev) => [...prev, userMessage]);

//       try {
//         const langCode = language.toLowerCase().includes('hin') ? 'hi' : 'en';
//         const res = await sendChatMessage({
//           conversationId,
//           message: text.trim(),
//           language: langCode,
//           conversationHistory: historyForRequest,
//           currentComplaintData: complaintData,
//         });

//         const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//         setMessages((prev) => [
//           ...prev,
//           { role: 'assistant', content: res.reply, timestamp: botTime },
//         ]);
//         setComplaintData(res.complaintData);
//         setMissingFields(res.missingFields || []);
//         setState(res.state);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
//       } finally {
//         setIsSending(false);
//       }
//     },
//     [conversationId, messages, complaintData, language, isSending]
//   );

//   const updateComplaintField = useCallback((field: keyof ComplaintData, value: unknown) => {
//     setComplaintData((prev) => (prev ? { ...prev, [field]: value } : null));
//   }, []);

//   const confirmAndSubmit = useCallback(
//     async (finalComplaintData?: ComplaintData) => {
//       const dataToSubmit = finalComplaintData || complaintData;
//       if (!dataToSubmit) {
//         setError('No complaint data available to submit.');
//         return null;
//       }

//       setError(null);
//       setIsSending(true);
//       try {
//         const res = await submitComplaint({
//           conversationId,
//           complaintData: dataToSubmit,
//         });
//         setSubmittedComplaint(res.complaint);
//         return res.complaint;
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Could not submit your complaint. Please try again.');
//         throw err;
//       } finally {
//         setIsSending(false);
//       }
//     },
//     [conversationId, complaintData]
//   );

//   const resetConversation = useCallback(() => {
//     const newId = makeConversationId();
//     setConversationId(newId);
//     setMessages([
//       {
//         role: 'assistant',
//         content: INITIAL_PROMPT[language] || INITIAL_PROMPT.English,
//         timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       },
//     ]);
//     setComplaintData(null);
//     setMissingFields([]);
//     setState('COLLECTING');
//     setError(null);
//     setSubmittedComplaint(null);
//   }, [language]);

//   return {
//     conversationId,
//     messages,
//     complaintData,
//     missingFields,
//     state,
//     isSending,
//     error,
//     submittedComplaint,
//     sendMessage,
//     updateComplaintField,
//     confirmAndSubmit,
//     resetConversation,
//   };
// }
// import { useState, useCallback } from 'react';
// import {
//   sendChatMessage,
//   submitComplaint,
//   type ChatMessage,
//   type ChatState,
//   type ComplaintData,
//   type Complaint,
// } from '../services/api';

// function makeConversationId() {
//   return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
// }

// const INITIAL_PROMPT: Record<string, string> = {
//   English: 'Namaste! I am NyayaBot, your legal & complaint filing assistant. Please tell me what happened in your own words.',
//   Hindi: 'नमस्ते! मैं न्यायबॉट हूँ, आपका कानूनी व शिकायत दर्ज सहायक। कृपया मुझे बताएं कि क्या हुआ था।',
//   Hinglish: 'Namaste! Main NyayaBot hoon, aapka legal complaint assistant. Please batayein kya hua tha.',
//   Bengali: 'নমস্কার! আমি ন্যায়বট, আপনার আইনি ও অভিযোগ দায়ের সহকারী। অনুগ্রহ করে কী ঘটেছে তা বলুন।',
//   Marathi: 'नमस्कार! मी न्यायबॉट आहे, तुमचा कायदेशीर व तक्रार नोंदणी सहाय्यक. कृपया काय घडले ते सांगा.',
//   Tamil: 'வணக்கம்! நான் நியாயபாட், உங்கள் சட்ட மற்றும் புகார் பதிவு உதவியாளர். என்ன நடந்தது என்று சொல்லுங்கள்.',
// };

// const LANGUAGE_CODE_MAP: Record<string, string> = {
//   English: 'en',
//   Hindi: 'hi',
//   Hinglish: 'hi-en',
//   Bengali: 'bn',
//   Marathi: 'mr',
//   Tamil: 'ta',
// };

// export function useComplaintChat({ language = 'English' }: { language?: string } = {}) {
//   const [conversationId, setConversationId] = useState(makeConversationId);
//   const [messages, setMessages] = useState<ChatMessage[]>(() => [
//     {
//       role: 'assistant',
//       content: INITIAL_PROMPT[language] || INITIAL_PROMPT.English,
//       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//     },
//   ]);
//   const [complaintData, setComplaintData] = useState<ComplaintData | null>(null);
//   const [missingFields, setMissingFields] = useState<string[]>([]);
//   const [state, setState] = useState<ChatState>('COLLECTING');
//   const [isSending, setIsSending] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);

//   const sendMessage = useCallback(
//     async (text: string) => {
//       if (!text.trim() || isSending) return;
//       setError(null);
//       setIsSending(true);

//       const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//       const userMessage: ChatMessage = { role: 'user', content: text.trim(), timestamp: userTime };

//       const historyForRequest = [...messages, userMessage].map((m) => ({
//         role: m.role,
//         content: m.content,
//       }));

//       setMessages((prev) => [...prev, userMessage]);

//       try {
//         const langCode = LANGUAGE_CODE_MAP[language] || 'en';
//         const res = await sendChatMessage({
//           conversationId,
//           message: text.trim(),
//           language: langCode,
//           conversationHistory: historyForRequest,
//           currentComplaintData: complaintData,
//         });

//         const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//         setMessages((prev) => [
//           ...prev,
//           { role: 'assistant', content: res.reply, timestamp: botTime },
//         ]);
//         setComplaintData(res.complaintData);
//         setMissingFields(res.missingFields || []);
//         setState(res.state);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
//       } finally {
//         setIsSending(false);
//       }
//     },
//     [conversationId, messages, complaintData, language, isSending]
//   );

//   const updateComplaintField = useCallback((field: keyof ComplaintData, value: unknown) => {
//     setComplaintData((prev) => (prev ? { ...prev, [field]: value } : null));
//   }, []);

//   const confirmAndSubmit = useCallback(
//     async (finalComplaintData?: ComplaintData) => {
//       const dataToSubmit = finalComplaintData || complaintData;
//       if (!dataToSubmit) {
//         setError('No complaint data available to submit.');
//         return null;
//       }

//       setError(null);
//       setIsSending(true);
//       try {
//         const res = await submitComplaint({
//           conversationId,
//           complaintData: dataToSubmit,
//         });
//         setSubmittedComplaint(res.complaint);
//         return res.complaint;
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Could not submit your complaint. Please try again.');
//         throw err;
//       } finally {
//         setIsSending(false);
//       }
//     },
//     [conversationId, complaintData]
//   );

//   const resetConversation = useCallback(() => {
//     const newId = makeConversationId();
//     setConversationId(newId);
//     setMessages([
//       {
//         role: 'assistant',
//         content: INITIAL_PROMPT[language] || INITIAL_PROMPT.English,
//         timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       },
//     ]);
//     setComplaintData(null);
//     setMissingFields([]);
//     setState('COLLECTING');
//     setError(null);
//     setSubmittedComplaint(null);
//   }, [language]);

//   return {
//     conversationId,
//     messages,
//     complaintData,
//     missingFields,
//     state,
//     isSending,
//     error,
//     submittedComplaint,
//     sendMessage,
//     updateComplaintField,
//     confirmAndSubmit,
//     resetConversation,
//   };
// }

// import { useState, useCallback } from "react";
// import {
//   sendChatMessage,
//   submitComplaint,
//   type ChatMessage,
//   type ChatState,
//   type ComplaintData,
//   type Complaint,
// } from "../services/api";

// function makeConversationId() {
//   return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
// }

// const INITIAL_PROMPT: Record<string, string> = {
//   en: "Namaste! I am NyayaBot, your legal & complaint filing assistant. Please tell me what happened in your own words.",

//   hi: "नमस्ते! मैं न्यायबॉट हूँ, आपका कानूनी व शिकायत दर्ज सहायक। कृपया मुझे बताएं कि क्या हुआ था।",

//   "hi-en":
//     "Namaste! Main NyayaBot hoon, aapka legal complaint assistant. Please batayein kya hua tha.",

//   bn: "নমস্কার! আমি ন্যায়বট, আপনার আইনি ও অভিযোগ দায়ের সহকারী। অনুগ্রহ করে কী ঘটেছে তা বলুন।",

//   mr: "नमस्कार! मी न्यायबॉट आहे, तुमचा कायदेशीर व तक्रार नोंदणी सहाय्यक. कृपया काय घडले ते सांगा.",

//   ta: "வணக்கம்! நான் நியாயபாட், உங்கள் சட்ட மற்றும் புகார் பதிவு உதவியாளர். என்ன நடந்தது என்று சொல்லுங்கள்.",
// };

// export function useComplaintChat({
//   language = "en",
// }: {
//   language?: string;
// } = {}) {
//   const [conversationId, setConversationId] = useState(
//     makeConversationId
//   );

//   const [messages, setMessages] = useState<ChatMessage[]>(() => [
//     {
//       role: "assistant",
//       content: INITIAL_PROMPT[language] || INITIAL_PROMPT.en,
//       timestamp: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     },
//   ]);

//   const [complaintData, setComplaintData] =
//     useState<ComplaintData | null>(null);

//   const [missingFields, setMissingFields] = useState<string[]>([]);

//   const [state, setState] =
//     useState<ChatState>("COLLECTING");

//   const [isSending, setIsSending] = useState(false);

//   const [error, setError] = useState<string | null>(null);

//   const [submittedComplaint, setSubmittedComplaint] =
//     useState<Complaint | null>(null);

//   const sendMessage = useCallback(
//     async (text: string) => {
//       if (!text.trim() || isSending) return;

//       setError(null);
//       setIsSending(true);

//       const userTime = new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       });

//       const userMessage: ChatMessage = {
//         role: "user",
//         content: text.trim(),
//         timestamp: userTime,
//       };

//       const historyForRequest = [...messages, userMessage].map((m) => ({
//         role: m.role,
//         content: m.content,
//       }));

//       setMessages((prev) => [...prev, userMessage]);

//       try {
//         const res = await sendChatMessage({
//           conversationId,
//           message: text.trim(),

//           // IMPORTANT:
//           // Send selected language to backend
//           language,

//           conversationHistory: historyForRequest,

//           currentComplaintData: complaintData,
//         });

//         const botTime = new Date().toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         });

//         setMessages((prev) => [
//           ...prev,
//           {
//             role: "assistant",
//             content: res.reply,
//             timestamp: botTime,
//           },
//         ]);

//         setComplaintData(res.complaintData);
//         setMissingFields(res.missingFields || []);
//         setState(res.state);
//       } catch (err) {
//         setError(
//           err instanceof Error
//             ? err.message
//             : "Something went wrong. Please try again."
//         );
//       } finally {
//         setIsSending(false);
//       }
//     },
//     [
//       conversationId,
//       messages,
//       complaintData,
//       language,
//       isSending,
//     ]
//   );

//   const updateComplaintField = useCallback(
//     (field: keyof ComplaintData, value: unknown) => {
//       setComplaintData((prev) =>
//         prev
//           ? {
//               ...prev,
//               [field]: value,
//             }
//           : null
//       );
//     },
//     []
//   );

//   const confirmAndSubmit = useCallback(
//     async (finalComplaintData?: ComplaintData) => {
//       const dataToSubmit =
//         finalComplaintData || complaintData;

//       if (!dataToSubmit) {
//         setError("No complaint data available to submit.");
//         return null;
//       }

//       setError(null);
//       setIsSending(true);

//       try {
//         const res = await submitComplaint({
//           conversationId,
//           complaintData: {
//             ...dataToSubmit,

//             // Store selected language
//             language,
//           },
//         });

//         setSubmittedComplaint(res.complaint);

//         return res.complaint;
//       } catch (err) {
//         setError(
//           err instanceof Error
//             ? err.message
//             : "Could not submit your complaint. Please try again."
//         );

//         throw err;
//       } finally {
//         setIsSending(false);
//       }
//     },
//     [conversationId, complaintData, language]
//   );

//   const resetConversation = useCallback(() => {
//     const newId = makeConversationId();

//     setConversationId(newId);

//     setMessages([
//       {
//         role: "assistant",
//         content:
//           INITIAL_PROMPT[language] || INITIAL_PROMPT.en,
//         timestamp: new Date().toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//       },
//     ]);

//     setComplaintData(null);
//     setMissingFields([]);
//     setState("COLLECTING");
//     setError(null);
//     setSubmittedComplaint(null);
//   }, [language]);

//   return {
//     conversationId,
//     messages,
//     complaintData,
//     missingFields,
//     state,
//     isSending,
//     error,
//     submittedComplaint,
//     sendMessage,
//     updateComplaintField,
//     confirmAndSubmit,
//     resetConversation,
//   };
// }
import { useState, useCallback } from "react";

import {
  sendChatMessage,
  submitComplaint,
  type ChatMessage,
  type ChatState,
  type ComplaintData,
  type Complaint,
} from "../services/api";

function makeConversationId() {
  return `conv_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

const INITIAL_PROMPT: Record<string, string> = {
  en: "Namaste! I am NyayaBot, your legal & complaint filing assistant. Please tell me what happened in your own words.",

  hi: "नमस्ते! मैं न्यायबॉट हूँ, आपका कानूनी और शिकायत दर्ज करने वाला सहायक। कृपया अपने शब्दों में बताएं कि क्या हुआ था।",

  "hi-en":
    "Namaste! Main NyayaBot hoon, aapka legal aur complaint filing assistant. Please apne words mein batayein ki kya hua tha.",

  bn: "নমস্কার! আমি ন্যায়বট, আপনার আইনি ও অভিযোগ দায়ের সহকারী। অনুগ্রহ করে নিজের ভাষায় বলুন কী ঘটেছিল।",

  mr: "नमस्कार! मी न्यायबॉट आहे, तुमचा कायदेशीर आणि तक्रार नोंदणी सहाय्यक. कृपया तुमच्या शब्दांत काय घडले ते सांगा.",

  ta: "வணக்கம்! நான் நியாயபாட், உங்கள் சட்ட மற்றும் புகார் பதிவு உதவியாளர். என்ன நடந்தது என்பதை உங்கள் சொந்த வார்த்தைகளில் சொல்லுங்கள்.",
};

export function useComplaintChat(
  { language = "en" }: { language?: string } = {}
) {
  const [conversationId, setConversationId] =
    useState(makeConversationId);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      role: "assistant",
      content:
        INITIAL_PROMPT[language] ||
        INITIAL_PROMPT.en,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [complaintData, setComplaintData] =
    useState<ComplaintData | null>(null);

  const [missingFields, setMissingFields] =
    useState<string[]>([]);

  const [state, setState] =
    useState<ChatState>("COLLECTING");

  const [isSending, setIsSending] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [submittedComplaint, setSubmittedComplaint] =
    useState<Complaint | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isSending) return;

      setError(null);
      setIsSending(true);

      const userTime =
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

      const userMessage: ChatMessage = {
        role: "user",
        content: text.trim(),
        timestamp: userTime,
      };

      const historyForRequest = [
        ...messages,
        userMessage,
      ].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      setMessages((prev) => [
        ...prev,
        userMessage,
      ]);

      try {
        const res = await sendChatMessage({
          conversationId,

          message: text.trim(),

          // IMPORTANT:
          // Send actual language code to backend.
          language,

          conversationHistory:
            historyForRequest,

          currentComplaintData:
            complaintData,
        });

        const botTime =
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: res.reply,
            timestamp: botTime,
          },
        ]);

        setComplaintData(res.complaintData);

        setMissingFields(
          res.missingFields || []
        );

        setState(res.state);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
      } finally {
        setIsSending(false);
      }
    },
    [
      conversationId,
      messages,
      complaintData,
      language,
      isSending,
    ]
  );

  const updateComplaintField = useCallback(
    (
      field: keyof ComplaintData,
      value: unknown
    ) => {
      setComplaintData((prev) =>
        prev
          ? {
              ...prev,
              [field]: value,
            }
          : null
      );
    },
    []
  );

  const confirmAndSubmit = useCallback(
    async (
      finalComplaintData?: ComplaintData
    ) => {
      const dataToSubmit =
        finalComplaintData || complaintData;

      if (!dataToSubmit) {
        setError(
          "No complaint data available to submit."
        );

        return null;
      }

      setError(null);
      setIsSending(true);

      try {
        const res = await submitComplaint({
          conversationId,
          complaintData: dataToSubmit,
        });

        setSubmittedComplaint(
          res.complaint
        );

        return res.complaint;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not submit your complaint. Please try again."
        );

        throw err;
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, complaintData]
  );

  const resetConversation = useCallback(() => {
    const newId = makeConversationId();

    setConversationId(newId);

    setMessages([
      {
        role: "assistant",
        content:
          INITIAL_PROMPT[language] ||
          INITIAL_PROMPT.en,
        timestamp:
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
      },
    ]);

    setComplaintData(null);
    setMissingFields([]);
    setState("COLLECTING");
    setError(null);
    setSubmittedComplaint(null);
  }, [language]);

  return {
    conversationId,
    messages,
    complaintData,
    missingFields,
    state,
    isSending,
    error,
    submittedComplaint,
    sendMessage,
    updateComplaintField,
    confirmAndSubmit,
    resetConversation,
  };
}