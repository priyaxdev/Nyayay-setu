import { processComplaintMessage } from '../services/ai.service.js';
import { ApiError } from '../utils/ApiError.js';

export async function handleChat(req, res) {
  const { conversationId, message, language, conversationHistory, currentComplaintData } = req.body;

  if (!conversationId || typeof conversationId !== 'string') {
    throw new ApiError(400, 'conversationId is required.');
  }
  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new ApiError(400, 'message is required.');
  }
  if (conversationHistory !== undefined && !Array.isArray(conversationHistory)) {
    throw new ApiError(400, 'conversationHistory must be an array.');
  }

  const result = await processComplaintMessage({
    message,
    conversationHistory: conversationHistory || [],
    currentComplaintData,
    language: language || 'en',
  });

  res.status(200).json({
    success: true,
    conversationId,
    reply: result.reply,
    state: result.state,
    complaintData: result.complaintData,
    missingFields: result.missingFields,
  });
}
