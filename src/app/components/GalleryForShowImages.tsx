"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react';
import { ProductImageProps } from "../api/types";

const ProductImages: React.FC<{ folderName: string }> = ({ folderName }) => {
  const [images, setImages] = useState<ProductImageProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

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
      if (!showModal) return;
      
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeModal();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showModal, images.length]);

  // Unified brick pattern logic - same variety across all devices
  const getBrickPattern = (totalImages: number, screenType: 'mobile' | 'tablet' | 'desktop') => {
    const patterns = [];
    
    // Universal brick types - same for all devices, only grid size changes
    const universalBricks = [
      { width: 1, height: 1 }, // small square
      { width: 2, height: 1 }, // horizontal rectangle
      { width: 2, height: 1 }, // long horizontal rectangle
      { width: 1, height: 1 }, // small square
      { width: 1, height: 1 }, // small square
      { width: 2, height: 1 }, // horizontal rectangle
    ];
    
    for (let i = 0; i < totalImages; i++) {
      const brick = universalBricks[i % universalBricks.length];
      
      // Adapt brick sizes based on screen type
      if (screenType === 'mobile') {
        // Limit max spans for mobile (3 columns max)
        const adaptedBrick = {
          width: Math.min(brick.width, 3),
          height: Math.min(brick.height, 3)
        };
        patterns.push({
          width: `col-span-${adaptedBrick.width}`,
          height: `row-span-${adaptedBrick.height}`
        });
      } else if (screenType === 'tablet') {
        // Limit max spans for tablet (4 columns max)
        const adaptedBrick = {
          width: Math.min(brick.width, 4),
          height: Math.min(brick.height, 3)
        };
        patterns.push({
          width: `col-span-${adaptedBrick.width}`,
          height: `row-span-${adaptedBrick.height}`
        });
      } else {
        // Desktop - full variety
        patterns.push({
          width: `col-span-${brick.width}`,
          height: `row-span-${brick.height}`
        });
      }
    }
    
    return patterns;
  };

  // Get patterns for current images
  const mobilePatterns = getBrickPattern(images.length, 'mobile');
  const tabletPatterns = getBrickPattern(images.length, 'tablet');
  const desktopPatterns = getBrickPattern(images.length, 'desktop');

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
      
      {/* Gallery Brick Grid - Unified Design Across All Devices */}
      {images.length > 0 && (
        <div className="w-full">
          {/* Mobile: 3 columns - Desktop-like variety but optimized for mobile */}
          <div className="grid grid-cols-3 auto-rows-[100px] gap-1 sm:hidden">
            {images.map((image, index) => {
              const pattern = mobilePatterns[index];
              return (
                <div
                  key={image.public_id || index}
                  className={`group relative cursor-pointer ${pattern.width} ${pattern.height}`}
                  onClick={() => openModal(index)}
                >
                  <img
                    src={image.url}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-90 rounded-sm"
                    loading="lazy"
                  />
                  
                  {/* Mobile Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center rounded-sm">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white bg-opacity-90 rounded-full p-1">
                        <svg className="w-2.5 h-2.5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Image counter - very small */}
                  <div className="absolute bottom-0.5 right-0.5 bg-black bg-opacity-80 text-white text-xs px-0.5 py-0.5 rounded text-[8px]">
                    {index + 1}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tablet: 4 columns - Enhanced brick variety */}
          <div className="hidden sm:grid md:hidden grid-cols-4 auto-rows-[140px] gap-2">
            {images.map((image, index) => {
              const pattern = tabletPatterns[index];
              return (
                <div
                  key={image.public_id || index}
                  className={`group relative cursor-pointer ${pattern.width} ${pattern.height}`}
                  onClick={() => openModal(index)}
                >
                  <img
                    src={image.url}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-90 rounded-md"
                    loading="lazy"
                  />
                  
                  {/* Tablet Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center rounded-md">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white bg-opacity-90 rounded-full p-1.5">
                        <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Tablet Image counter */}
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded text-[9px]">
                    {index + 1}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: Multi-column grid - Full variety brick coverage */}
          <div className="hidden md:grid grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 auto-rows-[180px] gap-3">
            {images.map((image, index) => {
              const pattern = desktopPatterns[index];
              return (
                <div
                  key={image.public_id || index}
                  className={`group relative cursor-pointer ${pattern.width} ${pattern.height}`}
                  onClick={() => openModal(index)}
                >
                  <img
                    src={image.url}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:opacity-90 rounded-lg"
                    loading="lazy"
                  />
                  
                  {/* Desktop Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center rounded-lg">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white bg-opacity-90 rounded-full p-3">
                        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal fullscreen - Responsive */}
      {showModal && images.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 lg:top-6 lg:right-6 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-1.5 lg:p-3 transition-all duration-200"
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

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-1 lg:left-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-1 lg:p-4 transition-all duration-200"
              >
                <IconChevronLeft size={14} className="lg:w-8 lg:h-8" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-1 lg:right-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-1 lg:p-4 transition-all duration-200"
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