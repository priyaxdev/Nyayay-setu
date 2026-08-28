// Example hook showing how to wire your existing "Text Complaint" chat UI
// to the backend. This is intentionally UI-agnostic (no JSX) so you can
// plug it into your actual chat component once I have your real src/ files
// — I don't want to guess at your component structure and end up
// duplicating or fighting your existing UI.
//
// Usage sketch inside your existing chat component:
//
//   const chat = useComplaintChat({ language: 'en' });
//   chat.messages.map(...)          // render the transcript
//   chat.sendMessage(inputValue)    // call on submit
//   chat.state === 'READY_FOR_CONFIRMATION' && <Summary data={chat.complaintData} onConfirm={chat.confirmAndSubmit} />

import { useState, useCallback } from 'react';
import {
  sendChatMessage,
  submitComplaint,
  type ChatMessage,
  type ChatState,
  type ComplaintData,
} from './api';

function makeConversationId() {
  return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function useComplaintChat({ language = 'en' }: { language?: string } = {}) {
  const [conversationId] = useState(makeConversationId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [complaintData, setComplaintData] = useState<ComplaintData | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [state, setState] = useState<ChatState>('COLLECTING');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedComplaintId, setSubmittedComplaintId] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isSending) return;
      setError(null);
      setIsSending(true);

      const userMessage: ChatMessage = { role: 'user', content: text };
      const historyForRequest = messages;
      setMessages((prev) => [...prev, userMessage]);

      try {
        const res = await sendChatMessage({
          conversationId,
          message: text,
          language,
          conversationHistory: historyForRequest,
          currentComplaintData: complaintData,
        });

        setMessages((prev) => [...prev, { role: 'assistant', content: res.reply }]);
        setComplaintData(res.complaintData);
        setMissingFields(res.missingFields);
        setState(res.state);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, messages, complaintData, language, isSending]
  );

  // Call this only after the user reviews the summary and explicitly
  // confirms — never auto-submit just because state === READY_FOR_CONFIRMATION.
  const confirmAndSubmit = useCallback(
    async (finalComplaintData: ComplaintData) => {
      setError(null);
      try {
        const res = await submitComplaint({
          conversationId,
          complaintData: finalComplaintData,
        });
        setSubmittedComplaintId(res.complaint.complaintId);
        return res.complaint;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not submit your complaint. Please try again.');
        throw err;
      }
    },
    [conversationId]
  );

  return {
    conversationId,
    messages,
    complaintData,
    missingFields,
    state,
    isSending,
    error,
    submittedComplaintId,
    sendMessage,
    confirmAndSubmit,
  };
}
