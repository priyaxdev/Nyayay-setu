import * as complaintService from '../services/complaint.service.js';
import { ApiError } from '../utils/ApiError.js';

export async function submitComplaint(req, res) {
  const { conversationId, complaintData, aiConversation } = req.body;

  const complaint = await complaintService.createComplaint({
    conversationId,
    complaintData,
    user: req.user,
    aiConversation,
  });

  res.status(201).json({ success: true, complaint });
}

export async function listMyComplaints(req, res) {
  const complaints = await complaintService.listComplaints({
    userId: req.user.id,
    role: req.user.role,
  });
  res.status(200).json({ success: true, complaints });
}

export async function getComplaint(req, res) {
  const { complaintId } = req.params;
  const complaint = await complaintService.getComplaintById(complaintId, {
    userId: req.user.id,
    role: req.user.role,
  });
  res.status(200).json({ success: true, complaint });
}

export async function patchComplaintStatus(req, res) {
  const { complaintId } = req.params;
  const { status } = req.body;
  if (!status) throw new ApiError(400, 'status is required.');

  const complaint = await complaintService.updateComplaintStatus(complaintId, status, {
    userId: req.user.id,
    role: req.user.role,
  });
  res.status(200).json({ success: true, complaint });
}
