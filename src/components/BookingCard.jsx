import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronDown, Plus, Minus, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { calculateBookingPrice, formatCurrency } from '../utils/priceCalculator';
import { calculateNights, getDefaultDates, getTodayString } from '../utils/dateUtils';

export const BookingCard = ({ property }) => {
  const navigate = useNavigate();
  const { createBooking } = useBooking();
  const { user } = useAuth();

  const defaultDates = getDefaultDates();
  const [checkIn, setCheckIn] = useState(defaultDates.checkIn);
  const [checkOut, setCheckOut] = useState(defaultDates.checkOut);
  const [guests, setGuests] = useState(2);
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const [isConfirmedModalOpen, setIsConfirmedModalOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!property) return null;

  const nights = calculateNights(checkIn, checkOut);
  const pricing = calculateBookingPrice(property.price, nights, property.cleaningFee || 60);

  const handleGuestsChange = (increment) => {
    const nextVal = guests + increment;
    if (nextVal >= 1 && nextVal <= (property.guests || 10)) {
      setGuests(nextVal);
      setErrorMsg('');
    }
  };

  const handleReserve = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (new Date(checkOut) <= new Date(checkIn)) {
      setErrorMsg('Checkout date must be after check-in date.');
      return;
    }

    if (guests > (property.guests || 10)) {
      setErrorMsg(`Maximum guest capacity for this property is ${property.guests}.`);
      return;
    }

    const booking = createBooking({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyLocation: property.location,
      propertyImage: property.images?.[0] || '',
      propertyType: property.propertyType,
      checkIn,
      checkOut,
      nights,
      guests,
      pricePerNight: property.price,
      subtotal: pricing.subtotal,
      cleaningFee: pricing.cleaningFee,
      serviceFee: pricing.serviceFee,
      occupancyTaxes: pricing.occupancyTaxes,
      total: pricing.total,
      guestName: user?.name || 'Guest Traveler',
      guestEmail: user?.email || 'traveler@stayfinder.edu',
      hostName: property.hostName || 'Host'
    });

    setConfirmedBooking(booking);
    setIsConfirmedModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-card sticky top-24">
        {/* Header: Price & Rating */}
        <div className="flex items-baseline justify-between mb-5">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-gray-900">
              {formatCurrency(property.price)}
            </span>
            <span className="text-sm text-gray-500 font-medium">night</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-gray-800">
            <Star size={13} className="fill-current text-gray-900" />
            <span>{property.rating?.toFixed(2) || '4.95'}</span>
            <span className="text-gray-400 font-normal">({property.reviews || 80})</span>
          </div>
        </div>

        {/* Form Inputs: Dates & Guests */}
        <div className="border border-gray-300 rounded-2xl overflow-hidden mb-4 divide-y divide-gray-300 text-xs">
          {/* Check-in & Check-out row */}
          <div className="grid grid-cols-2 divide-x divide-gray-300">
            <div className="p-2.5 bg-gray-50/50">
              <label className="block text-[10px] font-extrabold uppercase text-gray-600">
                Check-in
              </label>
              <input
                type="date"
                min={getTodayString()}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full font-semibold text-gray-800 bg-transparent focus:outline-none cursor-pointer mt-0.5"
              />
            </div>
            <div className="p-2.5 bg-gray-50/50">
              <label className="block text-[10px] font-extrabold uppercase text-gray-600">
                Checkout
              </label>
              <input
                type="date"
                min={checkIn || getTodayString()}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full font-semibold text-gray-800 bg-transparent focus:outline-none cursor-pointer mt-0.5"
              />
            </div>
          </div>

          {/* Guests row */}
          <div className="relative p-2.5 bg-gray-50/50">
            <label className="block text-[10px] font-extrabold uppercase text-gray-600">
              Guests
            </label>
            <button
              type="button"
              onClick={() => setIsGuestOpen(!isGuestOpen)}
              className="w-full flex items-center justify-between text-gray-900 font-semibold mt-0.5 text-left"
            >
              <span>{guests} {guests === 1 ? 'guest' : 'guests'}</span>
              <ChevronDown size={14} className="text-gray-500" />
            </button>

            {/* Guests Popover */}
            {isGuestOpen && (
              <div
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-floating border border-gray-100 p-4 z-40 animate-fade-in"
                onMouseLeave={() => setIsGuestOpen(false)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-800 text-xs">Guests</div>
                    <div className="text-[10px] text-gray-400">Max {property.guests} guests</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleGuestsChange(-1)}
                      disabled={guests <= 1}
                      className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 disabled:opacity-30"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="font-bold text-xs w-4 text-center">{guests}</span>
                    <button
                      type="button"
                      onClick={() => handleGuestsChange(1)}
                      disabled={guests >= (property.guests || 10)}
                      className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 disabled:opacity-30"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Validation Error Message */}
        {errorMsg && (
          <div className="mb-3 text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-100">
            {errorMsg}
          </div>
        )}

        {/* Reserve Button */}
        <button
          onClick={handleReserve}
          className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-98 text-sm uppercase tracking-wider mb-3"
        >
          Reserve Stay
        </button>

        <p className="text-[11px] text-center text-gray-400 mb-5">
          You won't be charged yet • Demo student booking
        </p>

        {/* Dynamic Pricing Breakdown */}
        <div className="space-y-3 text-xs text-gray-600 pt-3 border-t border-gray-100">
          <div className="flex justify-between">
            <span className="underline cursor-pointer">{formatCurrency(property.price)} x {nights} {nights === 1 ? 'night' : 'nights'}</span>
            <span className="font-medium text-gray-800">{formatCurrency(pricing.subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span className="underline cursor-pointer">Cleaning fee</span>
            <span className="font-medium text-gray-800">{formatCurrency(pricing.cleaningFee)}</span>
          </div>

          <div className="flex justify-between">
            <span className="underline cursor-pointer">StayFinder service fee (12%)</span>
            <span className="font-medium text-gray-800">{formatCurrency(pricing.serviceFee)}</span>
          </div>

          <div className="flex justify-between">
            <span className="underline cursor-pointer">Occupancy taxes (8%)</span>
            <span className="font-medium text-gray-800">{formatCurrency(pricing.occupancyTaxes)}</span>
          </div>

          {/* Grand Total */}
          <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-3 border-t border-gray-200">
            <span>Total before taxes & fees</span>
            <span className="text-rose-600">{formatCurrency(pricing.total)}</span>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2 text-[11px] text-gray-500">
          <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
          <span>StayCover protection included with every reservation.</span>
        </div>
      </div>

      {/* Booking Confirmation Dialog Modal */}
      {isConfirmedModalOpen && confirmedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
              <CheckCircle2 size={36} className="stroke-[2.5]" />
            </div>

            <span className="bg-rose-100 text-rose-600 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider">
              Reservation Confirmed
            </span>

            <h3 className="text-2xl font-black text-gray-900 mt-2">
              Pack your bags!
            </h3>

            <p className="text-xs text-gray-500 mt-1 mb-5">
              Your stay at <strong className="text-gray-800">{property.title}</strong> has been booked.
            </p>

            <div className="bg-gray-50 rounded-2xl p-4 text-left text-xs space-y-2 mb-6 border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Booking ID:</span>
                <span className="font-mono font-bold text-gray-800">{confirmedBooking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dates:</span>
                <span className="font-semibold text-gray-800">{checkIn} to {checkOut} ({nights} nights)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Guests:</span>
                <span className="font-semibold text-gray-800">{guests} guests</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-bold">
                <span>Total Paid (Demo):</span>
                <span className="text-rose-600">{formatCurrency(pricing.total)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsConfirmedModalOpen(false);
                  navigate('/bookings');
                }}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl shadow-md transition text-xs uppercase"
              >
                View in My Bookings
              </button>
              <button
                onClick={() => setIsConfirmedModalOpen(false)}
                className="px-4 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-xl transition text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingCard;

