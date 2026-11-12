import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

export const INITIAL_USERS = [
  {
    id: 'usr-student-01',
    name: 'Alex Rivera',
    email: 'alex.rivera@stayfinder.edu',
    password: bcrypt.hashSync('demo1234', salt),
    phone: '+1 (555) 489-2041',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    role: 'host',
    memberSince: 'October 2024',
    location: 'San Francisco, CA'
  },
  {
    id: 'usr-admin-01',
    name: 'StayFinder Admin',
    email: 'admin@stayfinder.edu',
    password: bcrypt.hashSync('admin1234', salt),
    phone: '+1 (555) 999-0000',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    role: 'admin',
    memberSince: 'January 2024',
    location: 'New York, NY'
  },
  {
    id: 'usr-traveler-01',
    name: 'Elena Rostova',
    email: 'traveler@stayfinder.edu',
    password: bcrypt.hashSync('traveler1234', salt),
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    role: 'traveler',
    memberSince: 'June 2025',
    location: 'Boston, MA'
  }
];

export default INITIAL_USERS;
