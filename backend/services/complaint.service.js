import mongoose from 'mongoose';
import Complaint, { COMPLAINT_STATUSES } from '../models/Complaint.js';
import { generateComplaintId } from '../utils/complaintId.js';
import { ApiError } from '../utils/ApiError.js';

const MINIMUM_REQUIRED_FIELDS = ['incidentType', 'description'];

function validateComplaintData(complaintData) {
  if (!complaintData || typeof complaintData !== 'object') {
    throw new ApiError(400, 'complaintData is required.');
  }
  const missing = MINIMUM_REQUIRED_FIELDS.filter((f) => !complaintData[f]);
  if (missing.length) {
    throw new ApiError(400, `Missing required field(s): ${missing.join(', ')}`);
  }
}

export async function createComplaint({ conversationId, complaintData, user, aiConversation = [] }) {
  if (!user || !user.id) {
    throw new ApiError(401, 'Authenticated user context required to file a complaint.');
  }
  validateComplaintData(complaintData);

  const complaintId = await generateComplaintId();

  const victimDetails = complaintData.victim || {};
  const accusedDetails = complaintData.accused || {};

  const payload = {
    complaintId,
    user: user.id,
    conversationId: conversationId || null,
    incidentType: complaintData.incidentType ?? null,
    description: complaintData.description ?? null,
    date: complaintData.date ?? null,
    time: complaintData.time ?? null,
    location: complaintData.location ?? null,
    victimName: victimDetails.name || complaintData.victimName || user.name || null,
    accusedName: accusedDetails.name || complaintData.accusedName || null,
    victim: victimDetails,
    accused: accusedDetails,
    witnesses: complaintData.witnesses || [],
    stolenItem: complaintData.stolenItem ?? null,
    evidence: complaintData.evidence || [],
    language: complaintData.language ?? 'en',
    status: 'SUBMITTED',
    aiConversation: aiConversation.length > 0 ? aiConversation : complaintData.conversationHistory || [],
    structuredData: complaintData,
  };

  const complaint = await Complaint.create(payload);
  return complaint;
}

export async function listComplaints({ userId, role = 'CITIZEN' } = {}) {
  if (!userId && role !== 'POLICE') {
    throw new ApiError(401, 'Authentication required to view complaints.');
  }

  const query = role === 'POLICE' ? {} : { user: userId };
  return Complaint.find(query).sort({ createdAt: -1 });
}

export async function getComplaintById(complaintId, { userId, role = 'CITIZEN' } = {}) {
  if (!complaintId) {
    throw new ApiError(400, 'Complaint ID is required.');
  }

  // Case-insensitive complaintId query
  const query = {
    complaintId: { $regex: new RegExp(`^${complaintId}$`, 'i') },
  };

  if (role !== 'POLICE') {
    if (!userId) {
      throw new ApiError(401, 'Authentication required.');
    }
    query.user = userId;
  }

  const complaint = await Complaint.findOne(query).populate('user', 'name email phone role');
  if (!complaint) {
    throw new ApiError(404, `No complaint found with ID ${complaintId}`);
  }

  return complaint;
}

export async function updateComplaintStatus(complaintId, status, { userId, role = 'CITIZEN' } = {}) {
  if (!COMPLAINT_STATUSES.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${COMPLAINT_STATUSES.join(', ')}`);
  }

  const query = {
    complaintId: { $regex: new RegExp(`^${complaintId}$`, 'i') },
  };

  // Only police or the creator can modify status
  if (role !== 'POLICE') {
    query.user = userId;
  }

  const complaint = await Complaint.findOneAndUpdate(
    query,
    { status },
    { new: true }
  );

  if (!complaint) {
    throw new ApiError(404, `No complaint found with ID ${complaintId}`);
  }

  return complaint;
}
