import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Heart,
  User,
  Menu,
  X,
  PlusCircle,
  Calendar,
  LayoutDashboard,
  LogOut,
  Globe,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-rose-500">
              StayFinder
            </span>
            <span className="text-[9px] font-semibold tracking-wider text-gray-400 uppercase -mt-1 hidden sm:block">
              Vacation Stays
            </span>
          </div>
        </Link>

        {/* Center: Quick Search Bar Pill (visible on desktop/tablet) */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => navigate('/explore')}
            className="flex items-center divide-x divide-gray-200 border border-gray-200 hover:shadow-subtle rounded-full py-2 px-4 text-xs md:text-sm font-semibold text-gray-800 transition"
          >
            <span className="px-3 hover:text-rose-500 transition">Anywhere</span>
            <span className="px-3 hover:text-rose-500 transition">Any week</span>
            <span className="px-3 text-gray-500 font-normal hover:text-rose-500 transition">Add guests</span>
            <div className="pl-3">
              <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
                <Search size={14} className="stroke-[2.5]" />
              </div>
            </div>
          </button>
        </div>

        {/* Right: Actions, Wishlist & User Dropdown */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Become a Host Link */}
          <Link
            to="/host/new"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 px-3.5 py-2.5 rounded-full transition"
          >
            <PlusCircle size={15} className="text-rose-500" />
            <span>Become a Host</span>
          </Link>

          {/* Wishlist Link with Badge */}
          <Link
            to="/wishlist"
            className="relative p-2.5 rounded-full hover:bg-gray-100 text-gray-700 transition"
            title="Wishlist"
          >
            <Heart size={20} className={wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''} />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* User Profile Pill Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2.5 border border-gray-200 hover:shadow-subtle rounded-full p-1.5 pl-3 transition bg-white"
            >
              <Menu size={18} className="text-gray-600" />
              {isAuthenticated && user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gray-500 text-white flex items-center justify-center">
                  <User size={16} />
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-floating border border-gray-100 py-2 z-50 animate-fade-in"
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <div className="text-xs text-gray-400 font-semibold">Signed in as</div>
                      <div className="text-sm font-bold text-gray-900 truncate">{user.name}</div>
                    </div>

                    <Link
                      to="/bookings"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Calendar size={16} className="text-gray-500" />
                      <span>My Bookings</span>
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Heart size={16} className="text-gray-500" />
                      <span>Saved Wishlist ({wishlistCount})</span>
                    </Link>

                    <Link
                      to="/host/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                    >
                      <LayoutDashboard size={16} className="text-gray-500" />
                      <span>Host Dashboard</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                    >
                      <User size={16} className="text-gray-500" />
                      <span>Account Profile</span>
                    </Link>

                    <div className="border-t border-gray-100 my-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition text-left"
                      >
                        <LogOut size={16} />
                        <span>Log out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-xs font-bold text-gray-900 hover:bg-gray-50 transition"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
                    >
                      Sign up
                    </Link>
                    <div className="border-t border-gray-100 my-1 pt-1">
                      <Link
                        to="/host/new"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                      >
                        StayFinder your home
                      </Link>
                      <Link
                        to="/explore"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                      >
                        Explore all stays
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

