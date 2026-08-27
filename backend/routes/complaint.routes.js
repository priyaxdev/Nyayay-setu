import { Router } from 'express';
import {
  submitComplaint,
  listMyComplaints,
  getComplaint,
  patchComplaintStatus,
} from '../controllers/complaint.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// All complaint routes are protected by JWT auth
router.use(authMiddleware);

// POST /api/complaints
router.post('/', asyncHandler(submitComplaint));

// GET /api/complaints
router.get('/', asyncHandler(listMyComplaints));

// GET /api/complaints/:complaintId
router.get('/:complaintId', asyncHandler(getComplaint));

// PATCH /api/complaints/:complaintId/status
router.patch('/:complaintId/status', asyncHandler(patchComplaintStatus));

export default router;
