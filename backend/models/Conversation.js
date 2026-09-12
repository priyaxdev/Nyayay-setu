// import mongoose from 'mongoose';
// const { Schema } = mongoose;

// const MessageSchema = new Schema(
//   {
//     role: { type: String, enum: ['user', 'assistant'], required: true },
//     content: { type: String, required: true },
//     timestamp: { type: Date, default: Date.now },
//   },
//   { _id: false }
// );

// const ConversationSchema = new Schema(
//   {
//     conversationId: { type: String, required: true, unique: true, index: true },
//     user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
//     messages: { type: [MessageSchema], default: [] },
//     complaintData: { type: Schema.Types.Mixed, default: {} },
//     state: { type: String, default: 'COLLECTING' },
//   },
//   { timestamps: true }
// );

// export default mongoose.model('Conversation', ConversationSchema);
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

  let result;
  try {
    result = await processComplaintMessage({
      message,
      conversationHistory: conversationHistory || [],
      currentComplaintData,
      language: language || 'en',
    });
  } catch (err) {
    console.error('[chat] AI provider failed:', err.message);
    result = {
      reply:
        (language || 'en') === 'hi'
          ? 'क्षमा करें, अभी तकनीकी समस्या है। कृपया कुछ देर बाद फिर प्रयास करें।'
          : 'Sorry, I ran into a technical issue. Please try again in a moment.',
      state: 'COLLECTING',
      complaintData: currentComplaintData || {},
      missingFields: [],
    };
  }

  res.status(200).json({
    success: true,
    conversationId,
    reply: result.reply,
    state: result.state,
    complaintData: result.complaintData,
    missingFields: result.missingFields,
  });
}