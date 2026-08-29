import mongoose from 'mongoose';

const { Schema } = mongoose;

export const COMPLAINT_STATUSES = [
  'SUBMITTED',
  'UNDER_REVIEW',
  'FIR_DRAFT_GENERATED',
  'OFFICER_VERIFICATION',
  'FIR_REGISTERED',
  'CLOSED',
  'ASSIGNED',
  'INVESTIGATING',
  'RESOLVED',
];

const PersonSchema = new Schema(
  {
    name: { type: String, default: null },
    contact: { type: String, default: null },
    description: { type: String, default: null },
  },
  { _id: false, strict: false }
);

const ComplaintSchema = new Schema(
  {
    complaintId: {
      type: String,
      required: [true, 'Complaint ID is required'],
      unique: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Complaint must belong to an authenticated user'],
      index: true,
    },
    conversationId: {
      type: String,
      default: null,
      index: true,
    },

    incidentType: { type: String, default: null },
    description: { type: String, default: null },
    date: { type: String, default: null },
    time: { type: String, default: null },
    location: { type: String, default: null },

    victimName: { type: String, default: null },
    accusedName: { type: String, default: null },
    victim: { type: PersonSchema, default: () => ({}) },
    accused: { type: PersonSchema, default: () => ({}) },
    witnesses: { type: [PersonSchema], default: [] },
    stolenItem: { type: String, default: null },
    evidence: { type: [String], default: [] },

    language: { type: String, default: 'en' },

    status: {
      type: String,
      enum: {
        values: COMPLAINT_STATUSES,
        message: 'Invalid complaint status',
      },
      default: 'SUBMITTED',
      index: true,
    },

    aiConversation: { type: [Schema.Types.Mixed], default: [] },
    structuredData: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model('Complaint', ComplaintSchema);
