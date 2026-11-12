import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Heart,
  Home,
  Edit3,
  Check,
  LogOut,
  ShieldCheck,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useBooking } from '../context/BookingContext';

export const Profile = () => {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const { wishlistCount } = useWishlist();
  const { bookingsCount } = useBooking();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || 'San Francisco, CA'
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">You are logged out</h2>
        <p className="text-sm text-gray-500 mb-6">Please log in to view and edit your profile.</p>
        <Link
          to="/login"
          className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 py-3 rounded-full text-xs shadow-md transition"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      {/* Top Profile Summary Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-subtle mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
            alt={user.name}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-rose-100 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900">{user.name}</h1>
              <span className="bg-rose-100 text-rose-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                {user.role || 'Traveler'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
              <Mail size={13} className="text-rose-500" />
              <span>{user.email}</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
              <Calendar size={13} className="text-gray-400" />
              <span>Member since {user.memberSince || '2024'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl transition"
          >
            <Edit3 size={15} />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-4 py-2.5 rounded-xl transition"
          >
            <LogOut size={15} />
            <span>Log out</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs mb-8 space-y-4">
          <h3 className="font-bold text-gray-900 text-sm">Update Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Location / City</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition"
          >
            <Check size={16} />
            <span>Save Changes</span>
          </button>
        </form>
      )}

      {/* Stats & Quick Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/bookings"
          className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs hover:shadow-subtle transition group"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Calendar size={22} />
          </div>
          <div className="text-2xl font-black text-gray-900">{bookingsCount}</div>
          <div className="text-xs font-bold text-gray-500 mt-0.5">Trips Booked</div>
          <p className="text-[11px] text-gray-400 mt-2">View confirmed reservations and receipts</p>
        </Link>

        <Link
          to="/wishlist"
          className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs hover:shadow-subtle transition group"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Heart size={22} />
          </div>
          <div className="text-2xl font-black text-gray-900">{wishlistCount}</div>
          <div className="text-xs font-bold text-gray-500 mt-0.5">Saved Stays</div>
          <p className="text-[11px] text-gray-400 mt-2">Manage your favorite bucket list destinations</p>
        </Link>

        <Link
          to="/host/dashboard"
          className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs hover:shadow-subtle transition group"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Home size={22} />
          </div>
          <div className="text-2xl font-black text-gray-900">Hosting</div>
          <div className="text-xs font-bold text-gray-500 mt-0.5">Host Dashboard</div>
          <p className="text-[11px] text-gray-400 mt-2">Manage your submitted listings and earnings</p>
        </Link>
      </div>

      {/* Demo Student Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-gray-600">
        <ShieldCheck size={20} className="text-rose-500 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-gray-900">Student Group Architecture Note:</span> Your profile, reservations, and wishlist reside in your browser's persistent state. Refreshing or returning to the site will maintain your data.
        </div>
      </div>
    </div>
  );
};

export default Profile;

