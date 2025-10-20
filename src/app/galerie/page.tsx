'use client';
import React, { useState, useEffect } from 'react';
import { IconUpload, IconTrash, IconX, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { Modal, Button, Group, FileInput, Alert } from '@mantine/core';
import { useUser } from '../components/context/ContextUser';
import { Footer } from '../components/Footer';
import axios from 'axios';

interface CloudinaryImage {
  url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  created_at: string;
}

const Gallery = () => {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const { user } = useUser();
  const isAdmin = user.userInfo.email === 'laurasimona97@yahoo.com';

  // Fetch images from Cloudinary
  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/images/list?folder=gallery&limit=100');
      setImages(res.data.images || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Upload image
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const res = await axios.post('/api/images/upload', { 
          image: base64,
          folder: 'gallery'
        });
        
        const newImage = {
          url: res.data.url,
          public_id: res.data.public_id,
          width: res.data.width,
          height: res.data.height,
          format: res.data.format,
          created_at: new Date().toISOString()
        };
        
        setImages(prev => [newImage, ...prev]);
        setShowUploadModal(false);
        setSelectedFile(null);
        setError(null);
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Delete image
  const handleDelete = async (imageData: CloudinaryImage) => {
    if (!isAdmin) return;
    
    try {
      setDeletingId(imageData.public_id);
      
      await axios.delete(`/api/images/delete-image`, {
        data: { imageUrl: imageData.url }
      });
      
      setImages(prev => prev.filter(img => img.public_id !== imageData.public_id));
      setError(null);
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('Failed to delete image');
    } finally {
      setDeletingId(null);
    }
  };

  // Modal navigation
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!showModal) return;
      
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') setShowModal(false);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showModal, images.length]);

  // Unified brick pattern logic - same variety across all devices
  const getBrickPattern = (totalImages: number, screenType: 'mobile' | 'tablet' | 'desktop') => {
    const patterns = [];
    
    // Universal brick types - max col-span-3, varied heights
    const universalBricks = [
      { width: 1, height: 1 }, // small square
      { width: 2, height: 1 }, // horizontal rectangle
      { width: 1, height: 2 }, // vertical rectangle
      { width: 2, height: 2 }, // large square
      { width: 3, height: 1 }, // wide horizontal
      { width: 1, height: 3 }, // tall vertical
      { width: 2, height: 3 }, // very tall
      { width: 3, height: 2 }, // very wide
      { width: 1, height: 1 }, // small square
      { width: 2, height: 1 }, // horizontal rectangle
      { width: 3, height: 1 }, // wide horizontal
      { width: 1, height: 2 }, // vertical rectangle
    ];
    
    for (let i = 0; i < totalImages; i++) {
      const brick = universalBricks[i % universalBricks.length];
      
      // Adapt brick sizes based on screen type
      if (screenType === 'mobile') {
        // Mobile: 3 columns max, limit heights for better mobile UX
        const adaptedBrick = {
          width: Math.min(brick.width, 3),
          height: Math.min(brick.height, 3)
        };
        patterns.push({
          width: `col-span-${adaptedBrick.width}`,
          height: `row-span-${adaptedBrick.height}`
        });
      } else if (screenType === 'tablet') {
        // Tablet: 3 columns max, limit heights
        const adaptedBrick = {
          width: Math.min(brick.width, 3),
          height: Math.min(brick.height, 3)
        };
        patterns.push({
          width: `col-span-${adaptedBrick.width}`,
          height: `row-span-${adaptedBrick.height}`
        });
      } else {
        // Desktop: 3 columns max, full height variety
        const adaptedBrick = {
          width: Math.min(brick.width, 3),
          height: brick.height
        };
        patterns.push({
          width: `col-span-${adaptedBrick.width}`,
          height: `row-span-${adaptedBrick.height}`
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-serif text-gray-900 mb-6 tracking-wide leading-tight">
              Galerie Foto
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto font-light italic tracking-wide leading-relaxed">
              Descoperiți poezia vizuală a florilor noastre
            </p>

            {/* Admin Upload Button */}
            {isAdmin && (
              <Button
                onClick={() => setShowUploadModal(true)}
                leftSection={<IconUpload size={20} />}
                size="lg"
                variant="outline"
                color="dark"
                className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
              >
                Adaugă Imagine
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <Alert color="red" title="Eroare" onClose={() => setError(null)}>
            {error}
          </Alert>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600 font-light">Se încarcă galeria...</p>
          </div>
        </div>
      )}

      {/* Gallery Brick Wall Grid - Responsive */}
      {!loading && images.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-16">
          {/* Mobile: 3 columns - Compact brick layout */}
          <div className="grid grid-cols-3 auto-rows-[100px] gap-1 sm:hidden">
            {images.map((image, index) => {
              const pattern = mobilePatterns[index];
              return (
                <div
                  key={image.public_id}
                  className={`group relative cursor-pointer ${pattern.width} ${pattern.height}`}
                  onClick={() => openModal(index)}
                >
                  <img
                    src={image.url}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-90 rounded-sm"
                    loading="lazy"
                  />
                  
                  {/* Mobile Overlay */}
                  <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center rounded-sm">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white bg-opacity-90 rounded-full p-1">
                        <svg className="w-2.5 h-2.5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Admin Delete Button */}
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image);
                      }}
                      disabled={deletingId === image.public_id}
                      className="absolute top-0.5 right-0.5 bg-white bg-opacity-90 hover:bg-red-500 hover:text-white text-gray-900 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-50"
                    >
                      {deletingId === image.public_id ? (
                        <div className="animate-spin rounded-full h-2.5 w-2.5 border-b-2 border-current"></div>
                      ) : (
                        <IconTrash size={10} />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Tablet: 3 columns - Medium brick layout */}
          <div className="hidden sm:grid md:hidden grid-cols-3 auto-rows-[140px] gap-2">
            {images.map((image, index) => {
              const pattern = tabletPatterns[index];
              return (
                <div
                  key={image.public_id}
                  className={`group relative cursor-pointer ${pattern.width} ${pattern.height}`}
                  onClick={() => openModal(index)}
                >
                  <img
                    src={image.url}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-90 rounded-md"
                    loading="lazy"
                  />
                  
                  {/* Tablet Overlay */}
                  <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center rounded-md">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white bg-opacity-90 rounded-full p-1.5">
                        <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Tablet Admin Delete Button */}
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image);
                      }}
                      disabled={deletingId === image.public_id}
                      className="absolute top-1 right-1 bg-white bg-opacity-90 hover:bg-red-500 hover:text-white text-gray-900 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-50"
                    >
                      {deletingId === image.public_id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                      ) : (
                        <IconTrash size={12} />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop: 3 columns - Full brick variety */}
          <div className="hidden md:grid grid-cols-3 auto-rows-[200px] gap-4">
            {images.map((image, index) => {
              const pattern = desktopPatterns[index];
              return (
                <div
                  key={image.public_id}
                  className={`group relative cursor-pointer ${pattern.width} ${pattern.height}`}
                  onClick={() => openModal(index)}
                >
                  <img
                    src={image.url}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:opacity-90 rounded-lg"
                    loading="lazy"
                  />
                  
                  {/* Desktop Overlay */}
                  <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center rounded-lg">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white bg-opacity-90 rounded-full p-3">
                        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Admin Delete Button */}
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image);
                      }}
                      disabled={deletingId === image.public_id}
                      className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-red-500 hover:text-white text-gray-900 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-50"
                    >
                      {deletingId === image.public_id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      ) : (
                        <IconTrash size={14} />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && images.length === 0 && (
        <div className="text-center py-32">
          <div className="text-8xl mb-8 opacity-30">🌸</div>
          <h2 className="text-3xl font-light text-gray-900 mb-4">Galeria este goală</h2>
          <p className="text-gray-600 font-light text-lg">
            {isAdmin ? 'Adaugă prima imagine pentru a începe galeria.' : 'În curând vor fi adăugate imagini noi.'}
          </p>
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        opened={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Adaugă imagine în galerie"
        centered
        size="md"
      >
        <div className="space-y-6">
          <FileInput
            label="Selectează imagine"
            placeholder="Apasă pentru a selecta"
            accept="image/*"
            value={selectedFile}
            onChange={setSelectedFile}
            size="md"
          />
          
          <Group justify="flex-end">
            <Button 
              variant="light" 
              onClick={() => setShowUploadModal(false)}
              color="gray"
            >
              Anulează
            </Button>
            <Button
              onClick={handleUpload}
              loading={uploading}
              disabled={!selectedFile}
              leftSection={<IconUpload size={16} />}
              color="dark"
            >
              {uploading ? 'Se încarcă...' : 'Încarcă'}
            </Button>
          </Group>
        </div>
      </Modal>

      {/* Fullscreen Modal - Responsive */}
      {showModal && images.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          {/* Close Button - Responsive */}
          <button
            onClick={() => setShowModal(false)}
            className="cursor-pointer absolute z-100 top-3 right-3 md:top-8 md:right-8 bg-opacity-10 hover:bg-opacity-20 text-white rounded-full p-2 md:p-3 transition-all duration-200"
          >
            <IconX size={20} className="md:w-7 md:h-7" />
          </button>

          {/* Main Image - Responsive padding */}
          <div className="relative w-full h-full flex items-center justify-center p-3 md:p-12">
            <img
              src={images[currentImageIndex]?.url}
              alt={`Gallery image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image Counter - Responsive positioning */}
            <div className="absolute bottom-3 left-3 md:bottom-8 md:left-8 bg-black bg-opacity-50 text-white px-2 py-1 md:px-4 md:py-2 rounded-lg">
              <p className="text-sm md:text-lg font-light">
                {currentImageIndex + 1} / {images.length}
              </p>
            </div>
          </div>

          {/* Navigation Arrows - Responsive */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="cursor-pointer absolute left-2 md:left-8 top-1/2 transform -translate-y-1/2 bg-opacity-10 hover:bg-opacity-20 text-white rounded-full p-2 md:p-4 transition-all duration-200"
              >
                <IconChevronLeft size={20} className="md:w-8 md:h-8" />
              </button>
              
              <button
                onClick={nextImage}
                className="cursor-pointer absolute right-2 md:right-8 top-1/2 transform -translate-y-1/2 bg-opacity-10 hover:bg-opacity-20 text-white rounded-full p-2 md:p-4 transition-all duration-200"
              >
                <IconChevronRight size={20} className="md:w-8 md:h-8" />
              </button>
            </>
          )}

          {/* Background Click to Close */}
          <div 
            className="absolute inset-0 -z-10"
            onClick={() => setShowModal(false)}
          />
        </div>
      )}

      <Footer />
    </div>
  );
};  

export default Gallery;

