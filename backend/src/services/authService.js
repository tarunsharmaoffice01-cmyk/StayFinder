
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/appError.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );
};

const formatUser = (user) => {
  const { password, member_since, ...safeUser } = user;
  return { ...safeUser, memberSince: member_since };
};

export const registerUser = async ({
  name, email, password, role = 'traveler',
  phone, location, avatar
}) => {
  const normalizedEmail = email.trim().toLowerCase();

  const { data: existingUser, error: searchError } = await supabase
    .from('users')
    .select('id')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (searchError) {
    throw new AppError('Unable to check existing account.', 500);
  }

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
    member_since: new Date().toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    }),
    location: location || 'United States'
  };

  const { data, error } = await supabase
    .from('users')
    .insert(newUser)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new AppError('An account with this email address already exists.', 409);
    }
    throw new AppError('Unable to create account.', 500);
  }

  return { user: formatUser(data), token: generateToken(data) };
};

export const loginUser = async ({ email, password }) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle();

  if (error) {
    throw new AppError('Unable to login. Please try again.', 500);
  }

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid email or password.', 401);
  }

  return { user: formatUser(user), token: generateToken(user) };
};

export const getUserProfile = async (userId) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw new AppError('Unable to fetch user profile.', 500);
  if (!user) throw new AppError('User not found.', 404);

  return formatUser(user);
};

export const updateUserProfile = async (userId, updateData) => {
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (fetchError) throw new AppError('Unable to fetch user profile.', 500);
  if (!user) throw new AppError('User not found.', 404);

  const sanitizedUpdates = {
    ...(updateData.name && { name: updateData.name.trim() }),
    ...(updateData.email && { email: updateData.email.trim().toLowerCase() }),
    ...(updateData.phone && { phone: updateData.phone.trim() }),
    ...(updateData.location && { location: updateData.location.trim() }),
    ...(updateData.avatar && { avatar: updateData.avatar })
  };

  if (sanitizedUpdates.email) {
    const { data: existingUser, error: searchError } = await supabase
      .from('users')
      .select('id')
      .eq('email', sanitizedUpdates.email)
      .neq('id', userId)
      .maybeSingle();

    if (searchError) throw new AppError('Unable to check email address.', 500);
    if (existingUser) {
      throw new AppError('This email is already in use by another account.', 409);
    }
  }

  const { data: updatedUser, error } = await supabase
    .from('users')
    .update(sanitizedUpdates)
    .eq('id', userId)
    .select()
    .maybeSingle();

  if (error) throw new AppError('Unable to update profile.', 500);
  if (!updatedUser) throw new AppError('User not found.', 404);

  return formatUser(updatedUser);
};

export default {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};
