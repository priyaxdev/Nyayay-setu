import { Router } from 'express';
import { handleChat } from '../controllers/chat.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// POST /api/chat
router.post('/', asyncHandler(handleChat));

export default router;
