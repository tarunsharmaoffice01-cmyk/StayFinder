import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, Shield, HeartHandshake, Compass, ArrowRight } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { CategoryBar } from '../components/CategoryBar';
import { PropertyGrid } from '../components/PropertyGrid';
import { useListings } from '../hooks/useListings';
import { fetchDestinations } from '../services/listingService';

export const Home = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [destinations, setDestinations] = useState([]);
  const [destinationsError, setDestinationsError] = useState('');

  const { listings, loading, error } = useListings({
    category: selectedCategory
  });

  useEffect(() => {
    let active = true;
    fetchDestinations()
      .then((result) => {
        if (active) setDestinations(result.data || []);
      })
      .catch((requestError) => {
        if (active) setDestinationsError(requestError.message || 'Unable to load destinations.');
      });

    return () => {
      active = false;
    };
  }, []);

  const featuredListings = listings.filter(l => l.rating >= 4.95).slice(0, 4);

  return (
    <div>
      {/* Category Navigation Bar */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Hero Banner Section */}
      <section className="bg-gradient-to-b from-rose-50/50 via-white to-white py-10 md:py-14 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 bg-rose-100/80 text-rose-600 text-xs font-bold px-3.5 py-1.5 rounded-full mb-4">
            <Sparkles size={14} />
            <span>Discover your next dream getaway</span>
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight max-w-3xl mx-auto leading-tight mb-8">
            Find vacation stays, architectural gems & unique homes
          </h1>

          {/* Interactive Hero Search Bar */}
          <div className="mb-4">
            <SearchBar isHero={true} />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* Section 1: Main Property Grid (filtered by category if selected) */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                {selectedCategory === 'all' ? 'Explore World-Class Stays' : `${selectedCategory.toUpperCase()} Stays`}
              </h2>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                Handpicked vacation homes with verified guest reviews
              </p>
            </div>

            <Link
              to="/explore"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 transition"
            >
              <span>Explore all stays</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <PropertyGrid
            listings={listings}
            loading={loading}
            error={error}
            onResetFilters={() => setSelectedCategory('all')}
          />
        </section>

        {/* Section 2: Popular Destinations */}
        <section className="py-8 border-t border-gray-100">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              Popular Global Destinations
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Top curated locations for memorable international trips
            </p>
          </div>

          {destinationsError && (
            <p role="alert" className="mb-4 text-sm text-rose-700">{destinationsError}</p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {destinations.map((dest) => (
              <button
                key={dest.name}
                onClick={() => navigate(`/explore?destination=${encodeURIComponent(dest.name)}`)}
                className="group text-left rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-subtle transition-all transform hover:-translate-y-1 bg-white focus:outline-none"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-xs md:text-sm text-gray-900 group-hover:text-rose-500 transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-[11px] text-gray-400">{dest.country}</p>
                  <p className="text-[10px] text-rose-500 font-semibold mt-1">{dest.tag}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Section 3: Why Choose StayFinder (Trust Pillars) */}
        <section className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
              The StayFinder Guarantee
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-1">
              Travel with total peace of mind
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
                <Shield size={24} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1.5">StayCover Protection</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Every reservation includes comprehensive coverage against host cancellations and listing discrepancies.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
                <HeartHandshake size={24} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1.5">Verified Hosts</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Connect with passionate homeowners, Superhosts, and architects dedicated to memorable guest stays.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
                <Compass size={24} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1.5">Transparent Pricing</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                No hidden surprises at checkout. Complete fee breakdowns, cleaning details, and taxes calculated up front.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Become a Host CTA */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-gray-950 via-gray-900 to-black text-white p-8 md:p-14 shadow-card flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Host on StayFinder
            </span>
            <h2 className="text-2xl md:text-4xl font-black mt-2 leading-tight">
              Turn your home into extra income
            </h2>
            <p className="text-xs md:text-sm text-gray-300 mt-3 leading-relaxed">
              Join thousands of hosts welcoming travelers from across the world. Simple listing tools, complete reservation management, and full control over your calendar.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                to="/host/new"
                className="bg-rose-500 hover:bg-rose-600 text-white text-xs md:text-sm font-bold px-6 py-3.5 rounded-full shadow-md transition transform active:scale-95"
              >
                Start Hosting Today
              </Link>
              <Link
                to="/host/dashboard"
                className="bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm font-bold px-6 py-3.5 rounded-full transition"
              >
                Host Dashboard
              </Link>
            </div>
          </div>

          <div className="w-full md:w-80 aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 border-2 border-white/10">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80"
              alt="Cozy Interior"
              className="w-full h-full object-cover"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
