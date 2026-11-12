import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, authError } = useAuth();

  const [email, setEmail] = useState('alex.rivera@stayfinder.edu');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = location.state?.from || '/';

  const handleLogin = async (credentials) => {
    setError('');
    setIsSubmitting(true);
    try {
      await login(credentials);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    await handleLogin({ email, password });
  };

  const handleQuickDemoLogin = async () => {
    setEmail('alex.rivera@stayfinder.edu');
    setPassword('demo1234');
    await handleLogin({
      email: 'alex.rivera@stayfinder.edu',
      password: 'demo1234'
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-card max-w-md w-full p-8 relative">
        {/* Header */}
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

        {/* Demo account shortcut */}
        <button
          type="button"
          onClick={handleQuickDemoLogin}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition transform active:scale-98 flex items-center justify-center gap-2 text-xs uppercase tracking-wider mb-5"
        >
          <Sparkles size={16} />
          <span>{isSubmitting ? 'Signing in…' : 'Sign in as demo host'}</span>
        </button>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-400 font-bold">Or sign in with email</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {(error || authError) && (
            <div className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-100">
              {error || authError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
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
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl shadow-sm transition text-xs uppercase tracking-wider"
          >
            {isSubmitting ? 'Signing In…' : 'Sign In'}
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
