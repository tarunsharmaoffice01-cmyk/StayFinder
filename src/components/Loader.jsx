import React from 'react';

export const PropertyCardSkeleton = () => {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="w-full aspect-square bg-gray-200 rounded-2xl mb-3" />
      <div className="flex justify-between items-center mb-1">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/6" />
      </div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/3 mt-1" />
    </div>
  );
};

export const PropertyGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <PropertyCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export const PropertyDetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/4" />
      <div className="w-full h-96 bg-gray-200 rounded-3xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
        <div className="md:col-span-2 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-20 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
        <div className="h-80 bg-gray-200 rounded-3xl" />
      </div>
    </div>
  );
};

export default { PropertyCardSkeleton, PropertyGridSkeleton, PropertyDetailSkeleton };

