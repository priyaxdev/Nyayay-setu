import * as authService from '../services/auth.service.js';

export async function signup(req, res) {
  const { name, email, phone, password, role } = req.body;
  const { user, token } = await authService.signupUser({
    name,
    email,
    phone,
    password,
    role,
  });

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    user,
    token,
  });
}

export async function login(req, res) {
  const { email, password, role } = req.body;
  const { user, token } = await authService.loginUser({
    email,
    password,
    role: role || req.role,
  });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    user,
    token,
  });
}

export async function getMe(req, res) {
  const user = await authService.getCurrentUser(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
}
