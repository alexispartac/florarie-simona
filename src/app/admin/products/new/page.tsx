'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductForm } from './components/ProductsForm';
import { Product } from '@/types/products';
import { toast } from '@/components/hooks/use-toast';
import axios from 'axios';

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (productData: Omit<Product, 'reviews' | 'rating' | 'reviewCount'>) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post('/api/products', productData);

      if (response.status !== 201) {
        throw new Error('Failed to create product');
      }

      const data = response.data;
      console.log('Product created:', data);
      
      toast({
        title: '✓ Product created!',
        description: 'Product has been successfully created',
      });
      
      router.push(`/admin/products/${data.productId}`);
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: '✗ Creation failed',
        description: 'Failed to create product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Add New Product</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Fill in the details below to add a new product to your store.
        </p>
      </div>
      
      <div className="bg-[var(--card)] shadow overflow-hidden sm:rounded-lg p-6 border border-[var(--border)]">
        <ProductForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
}