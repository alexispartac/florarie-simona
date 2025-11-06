"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { IconX } from '@tabler/icons-react';
import { ProductImageProps } from "@/app/types/products";

const ProductImages: React.FC<{ folderName: string }> = ({ folderName }) => {
  const [images, setImages] = useState<ProductImageProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  
  const URL= `/api/images/list?folder=${folderName}`;

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(URL);
      setImages(res.data.images);
      setError(null);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageUrl: string, index: number) => {
    try {
      setDeletingIndex(index);
      
      // Apelează API-ul pentru ștergere
      await axios.delete(`/api/images/delete-image`, {
        data: { imageUrl }
      });
      
      // Elimină imaginea din starea locală
      setImages(prev => prev.filter((_, i) => i !== index));
      setError(null);
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('Failed to delete image');
    } finally {
      setDeletingIndex(null);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const res = await axios.post("/api/images/upload", { 
          image: base64,
          folder: folderName 
        });
        setImages((prev) => [...prev, res.data]);
        setError(null);
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };
  console.log(images)
  return (
    <div className="py-4">
      <h2 className="text-xl font-bold mb-4">Imagini produs</h2>
      {images.length === 0 && !loading && (
        <p className="text-gray-500">
          Nu sunt imagini disponibile sau acest produs nu are încă imagini adăugate.
        </p>
      )}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <input 
        type="file" 
        onChange={handleUpload} 
        disabled={loading}
        className="mb-4 p-2 border border-gray-300 rounded cursor-pointer"
        accept="image/*"
      />
      
      {loading && (
        <div className="flex items-center gap-2 mb-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
          <p>Se încarcă...</p>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {images.map((image: ProductImageProps, idx: number) => (
          <div key={idx} className="relative group">
            <img
              src={image.url}
              alt={`image-${idx}`}
              className="w-full h-32 object-cover rounded-lg shadow-md transition-opacity duration-200 group-hover:opacity-75"
            />
            
            {/* Buton de ștergere */}
            <button
              onClick={() => handleDelete(image.url, idx)}
              disabled={deletingIndex === idx}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg disabled:opacity-50"
              title="Șterge imaginea"
            >
              {deletingIndex === idx ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <IconX size={16} />
              )}
            </button>
            
            {/* Overlay pentru loading la ștergere */}
            {deletingIndex === idx && (
              <div className="absolute inset-0 bg-red-500 bg-opacity-50 rounded-lg flex items-center justify-center">
                <div className="text-white font-medium">Se șterge...</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;