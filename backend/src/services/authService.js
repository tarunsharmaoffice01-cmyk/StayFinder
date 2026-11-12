import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { createUser, getUserByEmail, getUserById, updateUser } from '../../db/index.js';
import { AppError } from '../utils/appError.js';
import { unwrapDbResult } from '../utils/unwrapDbResult.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );
};

export const registerUser = async ({ name, email, password, role = 'traveler', phone, location, avatar }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = unwrapDbResult(
    await getUserByEmail(normalizedEmail),
    'checking whether the email is already registered'
  );
  if (existingUser) {
    throw new AppError('An account with this email address already exists.', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: `usr-${randomUUID()}`,
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    phone: phone || '+1 (555) 000-0000',
    avatar: avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    role: role.toLowerCase() === 'host' ? 'host' : 'traveler',
    memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    location: location || 'United States'
  };

  const savedUser = unwrapDbResult(await createUser(newUser), 'creating user');

  return { user: savedUser, token: generateToken(savedUser) };
};

export const loginUser = async ({ email, password }) => {
  const user = unwrapDbResult(await getUserByEmail(email), 'looking up user');
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password.', 401);
  }

  const { password: _, ...safeUser } = user;

  return { user: safeUser, token: generateToken(user) };
};

export const getUserProfile = async (userId) => {
  const user = unwrapDbResult(await getUserById(userId), 'looking up user profile');
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return user;
};

export const updateUserProfile = async (userId, updateData) => {
  const user = unwrapDbResult(await getUserById(userId), 'looking up user profile');
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  // If email is changing, ensure it's not taken by another user
  if (updateData.email && updateData.email.toLowerCase() !== user.email.toLowerCase()) {
    const emailExists = unwrapDbResult(
      await getUserByEmail(updateData.email),
      'checking whether the email is already registered'
    );
    if (emailExists) {
      throw new AppError('This email is already in use by another account.', 409);
    }
  }

  // Disallow direct role escalation or password changes through profile update
  const sanitizedUpdates = {
    ...(updateData.name && { name: updateData.name.trim() }),
    ...(updateData.email && { email: updateData.email.trim().toLowerCase() }),
    ...(updateData.phone && { phone: updateData.phone.trim() }),
    ...(updateData.location && { location: updateData.location.trim() }),
    ...(updateData.avatar && { avatar: updateData.avatar })
  };

  const updatedUser = unwrapDbResult(
    await updateUser(userId, sanitizedUpdates),
    'updating user profile'
  );
  if (!updatedUser) {
    throw new AppError('User not found.', 404);
  }

  return updatedUser;
};

export default {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};
