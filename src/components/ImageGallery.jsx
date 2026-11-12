import React, { useState } from 'react';
import { Grid, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const ImageGallery = ({ images = [], title = 'Property Photos' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const displayImages = images.slice(0, 5);

  const handleOpenModal = (index = 0) => {
    setModalIndex(index);
    setIsModalOpen(true);
  };

  const handleNext = () => {
    setModalIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setModalIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* 5-Image Mosaic Grid */}
      <div className="relative rounded-3xl overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-4 gap-2.5 h-[340px] md:h-[460px]">
        {/* Main Hero Photo (Takes left 2 columns) */}
        <div
          onClick={() => handleOpenModal(0)}
          className="md:col-span-2 h-full cursor-pointer overflow-hidden group bg-gray-100 relative"
        >
          <img
            src={displayImages[0]}
            alt={`${title} - Photo 1`}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* 2nd & 3rd Photos (Column 3) */}
        <div className="hidden md:flex flex-col gap-2.5 h-full">
          {displayImages[1] && (
            <div
              onClick={() => handleOpenModal(1)}
              className="h-1/2 cursor-pointer overflow-hidden group bg-gray-100 relative"
            >
              <img
                src={displayImages[1]}
                alt={`${title} - Photo 2`}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          {displayImages[2] && (
            <div
              onClick={() => handleOpenModal(2)}
              className="h-1/2 cursor-pointer overflow-hidden group bg-gray-100 relative"
            >
              <img
                src={displayImages[2]}
                alt={`${title} - Photo 3`}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
        </div>

        {/* 4th & 5th Photos (Column 4) */}
        <div className="hidden md:flex flex-col gap-2.5 h-full">
          {displayImages[3] && (
            <div
              onClick={() => handleOpenModal(3)}
              className="h-1/2 cursor-pointer overflow-hidden group bg-gray-100 relative"
            >
              <img
                src={displayImages[3]}
                alt={`${title} - Photo 4`}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          {displayImages[4] && (
            <div
              onClick={() => handleOpenModal(4)}
              className="h-1/2 cursor-pointer overflow-hidden group bg-gray-100 relative"
            >
              <img
                src={displayImages[4]}
                alt={`${title} - Photo 5`}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
        </div>

        {/* Floating "Show All Photos" Button */}
        <button
          onClick={() => handleOpenModal(0)}
          className="absolute bottom-4 right-4 bg-white/95 hover:bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded-xl shadow-md flex items-center gap-2 transition hover:scale-105 active:scale-95"
        >
          <Grid size={15} />
          <span>Show all {images.length} photos</span>
        </button>
      </div>

      {/* Fullscreen Photo Viewer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fade-in text-white">
          {/* Top Bar */}
          <div className="flex items-center justify-between max-w-6xl mx-auto w-full py-2">
            <span className="text-sm font-semibold text-gray-400">
              {modalIndex + 1} / {images.length}
            </span>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-white transition"
              aria-label="Close photo viewer"
            >
              <X size={24} />
            </button>
          </div>

          {/* Central Image with Arrows */}
          <div className="relative flex-1 flex items-center justify-center max-w-5xl mx-auto w-full my-auto">
            {images.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition z-10"
                aria-label="Previous photo"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <div className="max-h-[75vh] max-w-full overflow-hidden rounded-2xl flex items-center justify-center">
              <img
                src={images[modalIndex]}
                alt={`${title} - Fullscreen ${modalIndex + 1}`}
                className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl transition-all"
              />
            </div>

            {images.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition z-10"
                aria-label="Next photo"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="max-w-4xl mx-auto w-full overflow-x-auto no-scrollbar py-2 flex items-center justify-center gap-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setModalIndex(idx)}
                className={`w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 transition border-2 ${
                  modalIndex === idx ? 'border-rose-500 scale-105' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;

