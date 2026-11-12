import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Trash2,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { formatCurrency } from '../utils/priceCalculator';
import { formatDate } from '../utils/dateUtils';

export const MyBookings = () => {
  const { bookings, cancelBooking, bookingsCount } = useBooking();
  const [cancellingId, setCancellingId] = useState(null);

  const handleConfirmCancel = (id) => {
    cancelBooking(id);
    setCancellingId(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-200 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <Calendar size={26} className="text-rose-500" />
            <span>My Bookings</span>
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            {bookingsCount} {bookingsCount === 1 ? 'active reservation' : 'active reservations'}
          </p>
        </div>

        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 transition"
        >
          <span>Find more stays</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {bookingsCount === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={36} className="stroke-[1.5]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No trips booked... yet!</h3>
          <p className="text-xs md:text-sm text-gray-500 mb-6">
            Time to dust off your bags and start planning your next vacation adventure.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-6 py-3.5 rounded-full shadow-md transition active:scale-95"
          >
            <span>Start Searching</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-3xl border border-gray-200 p-5 md:p-6 shadow-xs hover:shadow-subtle transition flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6"
            >
              {/* Property Image & Info */}
              <div className="flex items-start gap-4 flex-1">
                <Link
                  to={`/property/${booking.propertyId}`}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 group"
                >
                  <img
                    src={booking.propertyImage}
                    alt={booking.propertyTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 size={12} />
                      <span>{booking.status}</span>
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">
                      Ref: #{booking.id}
                    </span>
                  </div>

                  <Link
                    to={`/property/${booking.propertyId}`}
                    className="block font-bold text-base md:text-lg text-gray-900 hover:text-rose-500 transition truncate"
                  >
                    {booking.propertyTitle}
                  </Link>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin size={13} className="text-gray-400" />
                    <span className="truncate">{booking.propertyLocation}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600 pt-1">
                    <div className="flex items-center gap-1 font-semibold text-gray-800">
                      <Calendar size={13} className="text-rose-500" />
                      <span>{formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}</span>
                      <span className="text-gray-400 font-normal">({booking.nights} nights)</span>
                    </div>

                    <div className="flex items-center gap-1 text-gray-500">
                      <Users size={13} />
                      <span>{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Cancellation Actions */}
              <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-gray-100 flex-shrink-0">
                <div className="text-left md:text-right">
                  <div className="text-[11px] text-gray-400 font-semibold uppercase">Total Paid</div>
                  <div className="text-lg md:text-xl font-black text-gray-900">
                    {formatCurrency(booking.total)}
                  </div>
                </div>

                {cancellingId === booking.id ? (
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => handleConfirmCancel(booking.id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition"
                    >
                      Confirm Cancel
                    </button>
                    <button
                      onClick={() => setCancellingId(null)}
                      className="border border-gray-300 text-gray-600 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg hover:bg-gray-50"
                    >
                      Back
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setCancellingId(booking.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl transition md:mt-3"
                  >
                    <Trash2 size={14} />
                    <span>Cancel Stay</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;

