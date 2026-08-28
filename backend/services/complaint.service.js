import mongoose from 'mongoose';
import Complaint, { COMPLAINT_STATUSES } from '../models/Complaint.js';
import User from '../models/User.js';
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
  validateComplaintData(complaintData);

  const victimDetails = complaintData.victim || {};
  const accusedDetails = complaintData.accused || {};

  // Resolve or create user document
  let targetUserId = null;
  let userName = null;

  if (user && (user.id || user._id)) {
    targetUserId = user.id || user._id;
    userName = user.name;
  } else {
    // Check if email or contact information is available in user object or victim details
    const email = (user && user.email) || complaintData.email || victimDetails.email;
    const name = (user && user.name) || victimDetails.name || complaintData.victimName || 'Citizen Complainant';
    const phone = (user && user.phone) || victimDetails.contact || victimDetails.phone || null;

    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        targetUserId = existingUser._id;
        userName = existingUser.name;
      } else {
        // Create new citizen user for first-time filer
        const newUser = await User.create({
          name: name.trim(),
          email: normalizedEmail,
          phone: phone ? phone.trim() : null,
          password: `Pwd_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          role: 'CITIZEN',
        });
        targetUserId = newUser._id;
        userName = newUser.name;
      }
    } else {
      throw new ApiError(401, 'Authenticated user context or contact email required to file a complaint.');
    }
  }

  // Attempt creation with retry in case of concurrent sequence race condition
  for (let attempt = 0; attempt < 5; attempt++) {
    const complaintId = await generateComplaintId();

    const payload = {
      complaintId,
      user: targetUserId,
      conversationId: conversationId || null,
      incidentType: complaintData.incidentType ?? null,
      description: complaintData.description ?? null,
      date: complaintData.date ?? null,
      time: complaintData.time ?? null,
      location: complaintData.location ?? null,
      victimName: victimDetails.name || complaintData.victimName || userName || null,
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

    try {
      const complaint = await Complaint.create(payload);
      return complaint;
    } catch (err) {
      if (err.code === 11000 && err.keyPattern && err.keyPattern.complaintId && attempt < 4) {
        console.warn(`[complaint.service] Collision on complaintId ${complaintId}, retrying...`);
        continue;
      }
      throw err;
    }
  }
}

export function normalizeComplaintStatus(status) {
  if (!status || typeof status !== 'string') return null;
  const cleaned = status.trim().toUpperCase().replace(/[\s-]+/g, '_');

  const statusMap = {
    SUBMITTED: 'SUBMITTED',
    COMPLAINT_SUBMITTED: 'SUBMITTED',
    UNDER_REVIEW: 'UNDER_REVIEW',
    FIR_DRAFTED: 'FIR_DRAFT_GENERATED',
    FIR_DRAFT_GENERATED: 'FIR_DRAFT_GENERATED',
    OFFICER_VERIFICATION: 'OFFICER_VERIFICATION',
    FIR_REGISTERED: 'FIR_REGISTERED',
    CLOSED: 'CLOSED',
    RESOLVED: 'CLOSED',
    INVESTIGATING: 'UNDER_REVIEW',
    ASSIGNED: 'UNDER_REVIEW',
  };

  return statusMap[cleaned] || (COMPLAINT_STATUSES.includes(cleaned) ? cleaned : null);
}

export async function listComplaints({ userId, role = 'CITIZEN' } = {}) {
  if (!userId && role !== 'POLICE') {
    throw new ApiError(401, 'Authentication required to view complaints.');
  }

  const query = role === 'POLICE' ? {} : { user: userId };
  return Complaint.find(query).sort({ createdAt: -1 }).populate('user', 'name email phone role');
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
  // Only police officers are authorized to update complaint statuses
  if (role !== 'POLICE') {
    throw new ApiError(403, 'Access denied. Only police officers can update complaint status.');
  }

  const normalizedStatus = normalizeComplaintStatus(status);
  if (!normalizedStatus) {
    throw new ApiError(
      400,
      `Invalid status "${status}". Allowed values: SUBMITTED, UNDER_REVIEW, FIR_DRAFT_GENERATED, OFFICER_VERIFICATION, FIR_REGISTERED, CLOSED`
    );
  }

  const query = {
    complaintId: { $regex: new RegExp(`^${complaintId}$`, 'i') },
  };

  const complaint = await Complaint.findOneAndUpdate(
    query,
    { status: normalizedStatus },
    { new: true }
  ).populate('user', 'name email phone role');

  if (!complaint) {
    throw new ApiError(404, `No complaint found with ID ${complaintId}`);
  }

  return complaint;
}
