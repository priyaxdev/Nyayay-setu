import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

function generateToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ApiError(500, 'JWT_SECRET is not configured on server.');
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn }
  );
}

export async function signupUser({ name, email, phone, password, role = 'CITIZEN' }) {
  if (!name || !name.trim()) {
    throw new ApiError(400, 'Name is required.');
  }

  if (!email || !email.trim()) {
    throw new ApiError(400, 'Email is required.');
  }

  if (!password || password.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters long.');
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check duplicate email
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    phone: phone ? phone.trim() : null,
    password,
    role: role === 'POLICE' ? 'POLICE' : 'CITIZEN',
  });

  const token = generateToken(user);
  const safeUser = user.toJSON();

  return { user: safeUser, token };
}

export async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required.');
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Find user with password included for verification
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const token = generateToken(user);
  const safeUser = user.toJSON();

  return { user: safeUser, token };
}

export async function getCurrentUser(userId) {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }
  return user.toJSON();
}
