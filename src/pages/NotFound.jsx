import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
        <Compass size={40} />
      </div>
      <h1 className="text-4xl font-black text-gray-900 mb-2">404</h1>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-xs md:text-sm text-gray-500 max-w-sm mb-6">
        We couldn't find the page you were looking for. It may have moved or no longer exists.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md transition"
      >
        <Home size={16} />
        <span>Back to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;

