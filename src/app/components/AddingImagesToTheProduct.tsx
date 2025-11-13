"use client";

import React, { useState, ChangeEvent } from "react";
import axios, { AxiosProgressEvent } from "axios";
import { IconX } from '@tabler/icons-react';
import { ComposedProductProps } from "@/app/types/products";
import { ProductImageProps } from "@/app/types/products";
import imageCompression from 'browser-image-compression';


const AddingProductImages: React.FC<{ product: ComposedProductProps, setProduct: (product: ComposedProductProps) => void }> = ({ product, setProduct }) => {
  const [imagesProduct, setImagesProduct] = useState<ProductImageProps[]>(product.images || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleDelete = async (imageUrl: string, index: number) => {
    try {
      setDeletingIndex(index);
      
      // Apelează API-ul pentru ștergere
      await axios.delete(`/api/images/delete-image`, {
        data: { imageUrl }
      });
      // Elimină imaginea din starea locală
      setImagesProduct(prev => prev.filter((_, i) => i !== index));
      const updated: ComposedProductProps = {...product, images: imagesProduct.filter((_, i) => i !== index)};
      setProduct(updated);
      setError(null);
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('Failed to delete image');
    } finally {
      setDeletingIndex(null);
    }
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const compressedFile = await imageCompression(file, {
      maxSizeMB: 5,
      maxWidthOrHeight: 2000,
      useWebWorker: true,
    });

    setError(null);
    setLoading(true);
    setUploadProgress(0);

    try {

      const res = await axios.post("/api/images/upload", {
        file: compressedFile,
        folder: product.id,
      }, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const percent = (progressEvent.loaded / progressEvent.total) * 100;
            setUploadProgress(percent);
          }
        }
      });

      const updated: ComposedProductProps = { ...product, images: [...imagesProduct, res.data] };
      setProduct(updated);
      setImagesProduct((prev) => [...prev, res.data]);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    } finally {
      setLoading(false);
      setUploadProgress(null);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  return (
    <div className="py-4">
      <h2 className="text-xl font-bold mb-4">Imagini produs</h2>
      {imagesProduct.length === 0 && !loading && (
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
      
      {loading ? (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
            <p>Se încarcă imaginea{typeof uploadProgress === 'number' ? ` — ${Math.round(uploadProgress)}%` : '...'}</p>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded">
            <div className="h-2 bg-pink-500 rounded" style={{ width: `${uploadProgress ?? 0}%` }}></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {imagesProduct.map((image: ProductImageProps, idx: number) => (
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
      )}
    </div>
  );
};

export default AddingProductImages;