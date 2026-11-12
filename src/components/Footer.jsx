import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Heart, Shield, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-600 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top 4 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-gray-200 text-xs">
          {/* Support */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wider text-[11px]">
              Support
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/explore" className="hover:underline">Help Center</Link></li>
              <li><Link to="/explore" className="hover:underline">StayCover Protection</Link></li>
              <li><Link to="/explore" className="hover:underline">Anti-discrimination</Link></li>
              <li><Link to="/explore" className="hover:underline">Disability support</Link></li>
              <li><Link to="/explore" className="hover:underline">Cancellation options</Link></li>
            </ul>
          </div>

          {/* Hosting */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wider text-[11px]">
              Hosting
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/host/new" className="hover:underline">StayFinder your home</Link></li>
              <li><Link to="/host/dashboard" className="hover:underline">Host Dashboard</Link></li>
              <li><Link to="/host/new" className="hover:underline">StayCover for Hosts</Link></li>
              <li><Link to="/host/new" className="hover:underline">Hosting resources</Link></li>
              <li><Link to="/host/new" className="hover:underline">Community forum</Link></li>
            </ul>
          </div>

          {/* Discover */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wider text-[11px]">
              Discover
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/explore?category=skiing" className="hover:underline">Alpine Skiing Lodges</Link></li>
              <li><Link to="/explore?category=beachfront" className="hover:underline">Beachfront Sanctuaries</Link></li>
              <li><Link to="/explore?category=cabins" className="hover:underline">Cozy Forest Cabins</Link></li>
              <li><Link to="/explore?category=treehouses" className="hover:underline">Luxury Treehouses</Link></li>
              <li><Link to="/wishlist" className="hover:underline">Your Saved Wishlists</Link></li>
            </ul>
          </div>

          {/* StayFinder Platform */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wider text-[11px]">
              StayFinder Platform
            </h4>
            <ul className="space-y-2.5">
              <li><span className="text-gray-500">Student Group Capstone</span></li>
              <li><span className="text-gray-500">React + Vite + Tailwind CSS</span></li>
              <li><span className="text-gray-500">Interactive Booking Engine</span></li>
              <li><span className="text-gray-500">REST API Ready Architecture</span></li>
              <li><Link to="/profile" className="hover:underline">User Profile Management</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>© 2026 StayFinder, Inc.</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Privacy</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Terms</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Sitemap</span>
            <span>•</span>
            <span className="text-gray-400">Educational demonstration project</span>
          </div>

          <div className="flex items-center gap-6 font-semibold text-gray-700">
            <div className="flex items-center gap-1.5 cursor-pointer hover:underline">
              <Globe size={15} />
              <span>English (US)</span>
            </div>
            <div className="cursor-pointer hover:underline">
              <span>$ USD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

