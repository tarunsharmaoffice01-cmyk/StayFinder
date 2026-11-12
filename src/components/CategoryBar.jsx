import React, { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  Palmtree,
  Home,
  Castle,
  Trees,
  Flame,
  Waves,
  TreePine,
  Building2,
  Sun,
  Crown,
  Snowflake,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { fetchCategories } from '../services/listingService';

const ICON_MAP = {
  Sparkles,
  Palmtree,
  Home,
  Castle,
  Trees,
  Flame,
  Waves,
  TreePine,
  Building2,
  Sun,
  Crown,
  Snowflake
};

export const CategoryBar = ({ selectedCategory = 'all', onSelectCategory }) => {
  const scrollRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetchCategories()
      .then((result) => {
        if (active) setCategories(result.data || []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'Unable to load categories.');
      });

    return () => {
      active = false;
    };
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative border-b border-gray-100 bg-white sticky top-20 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex items-center">
        {error ? (
          <p role="alert" className="w-full py-4 text-center text-xs text-rose-700">{error}</p>
        ) : (
          <>
        {/* Left Scroll Arrow */}
        <button
          onClick={() => handleScroll('left')}
          aria-label="Scroll categories left"
          className="hidden md:flex w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 shadow-xs items-center justify-center text-gray-700 flex-shrink-0 mr-2 z-10 transition hover:scale-105"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Categories Scroller */}
        <div
          ref={scrollRef}
          className="flex items-center gap-7 overflow-x-auto no-scrollbar py-4 scroll-smooth w-full"
        >
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Sparkles;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center gap-2 flex-shrink-0 pb-2 border-b-2 transition group focus:outline-none ${
                  isSelected
                    ? 'border-gray-900 text-gray-900 font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300 font-medium'
                }`}
              >
                <Icon
                  size={22}
                  className={`transition-transform duration-200 group-hover:scale-110 ${
                    isSelected ? 'text-gray-900 stroke-[2.2]' : 'text-gray-500 stroke-[1.8]'
                  }`}
                />
                <span className="text-xs whitespace-nowrap">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Scroll Arrow */}
        <button
          onClick={() => handleScroll('right')}
          aria-label="Scroll categories right"
          className="hidden md:flex w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 shadow-xs items-center justify-center text-gray-700 flex-shrink-0 ml-2 z-10 transition hover:scale-105"
        >
          <ChevronRight size={16} />
        </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryBar;
