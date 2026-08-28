import { Router } from 'express';
import {
  submitComplaint,
  listMyComplaints,
  getComplaint,
  patchComplaintStatus,
} from '../controllers/complaint.controller.js';
import { authMiddleware, optionalAuthMiddleware, requireRole } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// POST /api/complaints - Allows both authenticated users & new/guest submissions
router.post('/', optionalAuthMiddleware, asyncHandler(submitComplaint));

// Protected routes (require JWT authentication)
router.get('/', authMiddleware, asyncHandler(listMyComplaints));
router.get('/:complaintId', authMiddleware, asyncHandler(getComplaint));
router.patch('/:complaintId/status', authMiddleware, requireRole('POLICE'), asyncHandler(patchComplaintStatus));

export default router;
