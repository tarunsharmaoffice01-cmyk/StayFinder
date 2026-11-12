import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  PlusCircle,
  DollarSign,
  Calendar,
  Star,
  Trash2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { fetchUserListings, deleteUserListing } from '../services/listingService';
import { formatCurrency } from '../utils/priceCalculator';

export const HostDashboard = () => {
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadListings = async () => {
    setLoading(true);
    try {
      const res = await fetchUserListings();
      setUserListings(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      await deleteUserListing(id);
      loadListings();
    }
  };

  const totalEarningsEstimate = userListings.reduce((sum, item) => sum + (item.price * 14), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <Home size={26} className="text-rose-500" />
            <span>Host Dashboard</span>
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Manage your rental listings, availability, and earnings
          </p>
        </div>

        <Link
          to="/host/new"
          className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-5 py-3 rounded-full shadow-md transition transform active:scale-95"
        >
          <PlusCircle size={16} />
          <span>Create New Listing</span>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
            <Home size={20} />
          </div>
          <div className="text-2xl font-black text-gray-900">{userListings.length}</div>
          <div className="text-xs font-bold text-gray-500 mt-0.5">Active Hosted Properties</div>
          <p className="text-[11px] text-gray-400 mt-1">Live in StayFinder search</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <TrendingUp size={20} />
          </div>
          <div className="text-2xl font-black text-gray-900">{formatCurrency(totalEarningsEstimate)}</div>
          <div className="text-xs font-bold text-gray-500 mt-0.5">Estimated Monthly Value</div>
          <p className="text-[11px] text-gray-400 mt-1">Based on 14 nights average occupancy</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Star size={20} className="fill-current" />
          </div>
          <div className="text-2xl font-black text-gray-900">5.0 ★</div>
          <div className="text-xs font-bold text-gray-500 mt-0.5">Host Quality Rating</div>
          <p className="text-[11px] text-gray-400 mt-1">Superhost track enabled</p>
        </div>
      </div>

      {/* User Listings List */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs">
        <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
          Your Submitted Properties ({userListings.length})
        </h2>

        {userListings.length === 0 ? (
          <div className="py-16 text-center max-w-sm mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
              <Home size={30} />
            </div>
            <h3 className="font-bold text-base text-gray-800 mb-1">No listings yet</h3>
            <p className="text-xs text-gray-500 mb-5">
              You haven't added any custom property listings yet. Publish your first vacation stay now!
            </p>
            <Link
              to="/host/new"
              className="inline-flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-sm transition"
            >
              <PlusCircle size={15} />
              <span>Create Your First Listing</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {userListings.map((listing) => (
              <div
                key={listing.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={listing.images?.[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full uppercase">
                      {listing.propertyType}
                    </span>
                    <h3 className="font-bold text-sm md:text-base text-gray-900 mt-1">
                      {listing.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {listing.location}, {listing.country} • {listing.guests} guests
                    </p>
                    <p className="text-xs font-bold text-gray-900 mt-1">
                      {formatCurrency(listing.price)} <span className="text-gray-400 font-normal">night</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/property/${listing.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition"
                  >
                    <ExternalLink size={14} />
                    <span>View Stay</span>
                  </Link>

                  <button
                    onClick={() => handleDelete(listing.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostDashboard;

