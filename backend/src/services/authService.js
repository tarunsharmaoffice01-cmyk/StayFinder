import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { memoryStore } from '../data/memoryStore.js';
import { AppError } from '../utils/appError.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );
};

export const registerUser = async ({ name, email, password, role = 'traveler', phone, location, avatar }) => {
  const existingUser = memoryStore.findUserByEmail(email);
  if (existingUser) {
    throw new AppError('An account with this email address already exists.', 409);
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newUser = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: hashedPassword,
    phone: phone || '+1 (555) 000-0000',
    avatar: avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    role: role.toLowerCase() === 'host' ? 'host' : 'traveler',
    memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    location: location || 'United States'
  };

  memoryStore.createUser(newUser);

  const token = generateToken(newUser);
  const { password: _, ...safeUser } = newUser;

  return { user: safeUser, token };
};

export const loginUser = async ({ email, password }) => {
  const user = memoryStore.findUserByEmail(email);
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = generateToken(user);
  const { password: _, ...safeUser } = user;

  return { user: safeUser, token };
};

export const getUserProfile = async (userId) => {
  const user = memoryStore.findUserById(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  const { password: _, ...safeUser } = user;
  return safeUser;
};

export const updateUserProfile = async (userId, updateData) => {
  const user = memoryStore.findUserById(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  // If email is changing, ensure it's not taken by another user
  if (updateData.email && updateData.email.toLowerCase() !== user.email.toLowerCase()) {
    const emailExists = memoryStore.findUserByEmail(updateData.email);
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

  const updatedUser = memoryStore.updateUser(userId, sanitizedUpdates);
  const { password: _, ...safeUser } = updatedUser;
  return safeUser;
};

export default {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};
