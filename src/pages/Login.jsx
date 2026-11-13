
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, authError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectPath = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login({ email, password });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-card max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-black text-2xl mx-auto mb-3 shadow-md">
            S
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Welcome to StayFinder
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Sign in to manage your bookings and saved wishlists
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(error || authError) && (
            <div className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-100">
              {error || authError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-black disabled:opacity-60 text-white font-bold py-3.5 rounded-xl shadow-sm transition text-xs uppercase tracking-wider"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-xs text-center text-gray-500 mt-6">
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-rose-500 font-bold hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
