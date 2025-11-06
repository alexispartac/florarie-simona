"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react';
import { ProductImageProps } from "@/app/types/products";

const ProductImages: React.FC<{ folderName: string }> = ({ folderName }) => {
  const [images, setImages] = useState<ProductImageProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const thumbnailContainer = useRef<HTMLDivElement | null>(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/images/list?folder=${folderName}&limit=50`);
      setImages(res.data.images || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [folderName]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showModal) {
        // Modal navigation
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'Escape') closeModal();
      } else {
        // Gallery navigation when not in modal
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(currentImageIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showModal, images.length, currentImageIndex]);

  return (
    <div className="py-4">
      {images.length === 0 && !loading && (
        <p className="text-gray-500 text-center">Nu există imagini încărcate pentru acest produs.</p>
      )}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
          <p className="text-gray-600">Se încarcă imaginile...</p>
        </div>
      )}
      
      {/* Single Image Display with Navigation */}
      {images.length > 0 && (
        <div className="w-full">
          {/* Main Image Container */}
          <div className="relative w-full">
            {/* Current Image */}
            <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] relative bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={images[currentImageIndex]?.url}
                alt={`Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => openModal(currentImageIndex)}
                loading="lazy"
              />
              
              {/* Overlay on hover */}
              <div 
                className="absolute inset-0 bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center cursor-pointer"
                onClick={() => openModal(currentImageIndex)}
              >
                <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white bg-opacity-90 rounded-full p-3">
                    <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows - Only show if more than 1 image */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 md:p-3 transition-all duration-200 shadow-lg"
                >
                  <IconChevronLeft size={20} className="md:w-6 md:h-6" />
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 md:p-3 transition-all duration-200 shadow-lg"
                >
                  <IconChevronRight size={20} className="md:w-6 md:h-6" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-3 right-3 bg-opacity-70 text-white px-3 py-1 rounded-lg">
              <p className="text-sm font-light">
                {currentImageIndex + 1} / {images.length}
              </p>
            </div>
          </div>

          {/* Thumbnail Strip - Only show if more than 1 image */}
          {images.length > 1 && (
            <div className="mt-4">
              <div className="flex gap-2 overflow-x-auto pb-2" ref={thumbnailContainer}>
                {images.map((image, index) => (
                  <div
                    key={image.public_id || index}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                      index === currentImageIndex 
                        ? 'ring-2 ring-white scale-105' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal fullscreen - Responsive */}
      {showModal && images.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 lg:top-6 lg:right-6 z-100 bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-1.5 lg:p-3 transition-all duration-200"
          >
            <IconX size={18} className="lg:w-7 lg:h-7" />
          </button>

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center p-2 lg:p-8">
            <img
              src={images[currentImageIndex]?.url}
              alt={`Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image Counter */}
            <div className="absolute bottom-2 left-2 lg:bottom-8 lg:left-8 bg-black bg-opacity-70 text-white px-2 py-1 lg:px-3 lg:py-2 rounded-lg">
              <p className="text-xs lg:text-lg font-light">
                {currentImageIndex + 1} / {images.length}
              </p>
            </div>
          </div>

          {/* Navigation Arrows in Modal */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-1 lg:left-6 top-1/2 transform -translate-y-1/2 bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-1 lg:p-4 transition-all duration-200"
              >
                <IconChevronLeft size={14} className="lg:w-8 lg:h-8" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-1 lg:right-6 top-1/2 transform -translate-y-1/2 bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-1 lg:p-4 transition-all duration-200"
              >
                <IconChevronRight size={14} className="lg:w-8 lg:h-8" />
              </button>
            </>
          )}

          {/* Background Click to Close */}
          <div 
            className="absolute inset-0 -z-10"
            onClick={closeModal}
          />
        </div>
      )}
    </div>
  );
};

export default ProductImages;