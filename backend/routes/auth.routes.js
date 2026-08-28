import { Router } from 'express';
import { signup, login, getMe } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// POST /api/auth/signup
router.post('/signup', asyncHandler(signup));

// POST /api/auth/login (Role optionally passed in body, defaults to CITIZEN)
router.post('/login', asyncHandler(login));

// POST /api/auth/police/login (Explicit police portal login)
router.post(
  '/police/login',
  asyncHandler((req, res, next) => {
    req.body.role = 'POLICE';
    return login(req, res, next);
  })
);

// POST /api/auth/citizen/login (Explicit citizen portal login)
router.post(
  '/citizen/login',
  asyncHandler((req, res, next) => {
    req.body.role = 'CITIZEN';
    return login(req, res, next);
  })
);

// GET /api/auth/me (Protected)
router.get('/me', authMiddleware, asyncHandler(getMe));

export default router;
