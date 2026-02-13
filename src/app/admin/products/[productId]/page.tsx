'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProductForm } from '../new/components/ProductsForm';
import { Product } from '@/types/products';
import { useProduct } from '@/hooks/useProducts';
import { toast } from '@/components/hooks/use-toast';
import axios from 'axios';
import { Spinner } from '@/components/ui/Spinner';
import { AdminFormSkeleton } from '../../components/AdminFormSkeleton';


export default function ProductDetailPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const id = params.productId;

  const { data: product, isLoading, isError } = useProduct(id as string);

  if (isLoading) {
    return <AdminFormSkeleton title="Loading Product..." fields={12} withImageUpload={true} withRichText={true} />;
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <p className="text-[var(--muted-foreground)]">Error loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <p className="text-[var(--muted-foreground)]">Product not found</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (productData: Omit<Product, 'reviews' | 'rating' | 'reviewCount'>) => {
    try {
      setIsSubmitting(true);
      const response = await axios.put(`/api/products/${product?.productId}`, productData);

      if (response.status !== 200) {
        throw new Error('Failed to update product');
      }

      const data = response.data;
      console.log('Product updated:', data);
      
      toast({
        title: '✓ Product updated!',
        description: 'Product has been successfully updated',
      });
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product');
      toast({
        title: '✗ Update failed',
        description: 'Failed to update product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-6">
        <div className="bg-[var(--destructive)]/10 border-l-4 border-[var(--destructive)] p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-[var(--destructive)]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-[var(--destructive)]">
                {error || 'Product not found'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Edit Product</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-md shadow-sm hover:bg-[var(--accent)]"
        >
          Back to Products
        </button>
      </div>
      
      <div className="bg-[var(--card)] shadow overflow-hidden sm:rounded-lg border border-[var(--border)]">
        <div className="px-4 py-5 sm:p-6">
          {error && (
            <div className="mb-4 bg-[var(--destructive)]/10 border-l-4 border-[var(--destructive)] p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-[var(--destructive)]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-[var(--destructive)]">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <ProductForm 
            initialData={product}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
