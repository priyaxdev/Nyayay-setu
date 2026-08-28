import { Router } from 'express';
import { signup, login, getMe } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// POST /api/auth/signup
router.post('/signup', asyncHandler(signup));

// POST /api/auth/login
router.post('/login', asyncHandler(login));

// GET /api/auth/me (Protected)
router.get('/me', authMiddleware, asyncHandler(getMe));

export default router;
