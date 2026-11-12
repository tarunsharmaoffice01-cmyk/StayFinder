import authService from '../services/authService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const signup = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token: result.token,
    user: result.user
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  res.status(200).json({
    success: true,
    message: 'Login successful',
    token: result.token,
    user: result.user
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const profile = await authService.getUserProfile(req.user.id);
  res.status(200).json({
    success: true,
    user: profile
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await authService.updateUserProfile(req.user.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: updatedUser
  });
});

export default {
  signup,
  login,
  logout,
  getMe,
  updateProfile
};
