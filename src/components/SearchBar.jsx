import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, X, Plus, Minus } from 'lucide-react';
import { getDefaultDates, getTodayString } from '../utils/dateUtils';

export const SearchBar = ({ initialDestination = '', initialGuests = 1, isHero = false }) => {
  const navigate = useNavigate();
  const defaultDates = getDefaultDates();

  const [destination, setDestination] = useState(initialDestination);
  const [checkIn, setCheckIn] = useState(defaultDates.checkIn);
  const [checkOut, setCheckOut] = useState(defaultDates.checkOut);
  const [guests, setGuests] = useState(initialGuests || 1);

  const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false);
  const [isDestSuggestionsOpen, setIsDestSuggestionsOpen] = useState(false);

  const popularLocations = ['Switzerland', 'Santorini, Greece', 'Kyoto, Japan', 'Bali, Indonesia', 'Paris, France', 'Sedona, United States', 'Amalfi, Italy'];

  const handleSearch = (e) => {
    e.preventDefault();
    setIsGuestPickerOpen(false);
    setIsDestSuggestionsOpen(false);

    const queryParams = new URLSearchParams();
    if (destination.trim()) queryParams.set('destination', destination.trim());
    if (checkIn) queryParams.set('checkIn', checkIn);
    if (checkOut) queryParams.set('checkOut', checkOut);
    if (guests > 1) queryParams.set('guests', guests.toString());

    navigate(`/explore?${queryParams.toString()}`);
  };

  return (
    <div className={`relative w-full ${isHero ? 'max-w-4xl mx-auto' : 'max-w-2xl'}`}>
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-full border border-gray-200 shadow-subtle hover:shadow-card transition-shadow duration-300 p-1.5 md:p-2 flex flex-col md:flex-row items-stretch md:items-center relative"
      >
        {/* Segment 1: Where */}
        <div className="relative flex-1 px-4 py-2 hover:bg-gray-50 rounded-full cursor-pointer transition">
          <label className="block text-[11px] font-extrabold text-gray-800 tracking-wider uppercase">
            Where
          </label>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onFocus={() => setIsDestSuggestionsOpen(true)}
              placeholder="Search destinations"
              className="w-full text-xs md:text-sm font-medium text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none"
            />
            {destination && (
              <button
                type="button"
                onClick={() => setDestination('')}
                className="text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Destination Quick Suggestions Dropdown */}
          {isDestSuggestionsOpen && (
            <div
              className="absolute top-full left-0 mt-3 w-72 bg-white rounded-3xl shadow-floating border border-gray-100 p-4 z-50 animate-fade-in"
              onMouseLeave={() => setIsDestSuggestionsOpen(false)}
            >
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Popular Stays
              </div>
              <div className="space-y-1">
                {popularLocations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      setDestination(loc);
                      setIsDestSuggestionsOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition text-left"
                  >
                    <MapPin size={15} className="text-rose-500 flex-shrink-0" />
                    <span>{loc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:block w-[1px] h-8 bg-gray-200" />

        {/* Segment 2: Check in */}
        <div className="flex-1 px-4 py-2 hover:bg-gray-50 rounded-full transition cursor-pointer">
          <label className="block text-[11px] font-extrabold text-gray-800 tracking-wider uppercase">
            Check in
          </label>
          <input
            type="date"
            min={getTodayString()}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full text-xs md:text-sm font-medium text-gray-700 bg-transparent focus:outline-none cursor-pointer"
          />
        </div>

        <div className="hidden md:block w-[1px] h-8 bg-gray-200" />

        {/* Segment 3: Check out */}
        <div className="flex-1 px-4 py-2 hover:bg-gray-50 rounded-full transition cursor-pointer">
          <label className="block text-[11px] font-extrabold text-gray-800 tracking-wider uppercase">
            Check out
          </label>
          <input
            type="date"
            min={checkIn || getTodayString()}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full text-xs md:text-sm font-medium text-gray-700 bg-transparent focus:outline-none cursor-pointer"
          />
        </div>

        <div className="hidden md:block w-[1px] h-8 bg-gray-200" />

        {/* Segment 4: Who */}
        <div className="relative flex-1 px-4 py-2 hover:bg-gray-50 rounded-full cursor-pointer transition">
          <div onClick={() => setIsGuestPickerOpen(!isGuestPickerOpen)}>
            <label className="block text-[11px] font-extrabold text-gray-800 tracking-wider uppercase">
              Who
            </label>
            <span className="block text-xs md:text-sm font-medium text-gray-700 truncate">
              {guests} {guests === 1 ? 'guest' : 'guests'}
            </span>
          </div>

          {/* Guests Popover */}
          {isGuestPickerOpen && (
            <div
              className="absolute top-full right-0 mt-3 w-64 bg-white rounded-3xl shadow-floating border border-gray-100 p-5 z-50 animate-fade-in"
              onMouseLeave={() => setIsGuestPickerOpen(false)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-gray-900">Guests</div>
                  <div className="text-xs text-gray-400">Ages 13 or above</div>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    disabled={guests <= 1}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-bold text-sm w-4 text-center">{guests}</span>
                  <button
                    type="button"
                    onClick={() => setGuests(Math.min(16, guests + 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-800 transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="p-1 md:pr-1">
          <button
            type="submit"
            className="w-full md:w-auto bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-3 md:py-3.5 rounded-full shadow-md flex items-center justify-center gap-2 transition active:scale-95"
          >
            <Search size={17} className="stroke-[2.5]" />
            <span className="md:hidden font-semibold text-sm">Search Stays</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;

