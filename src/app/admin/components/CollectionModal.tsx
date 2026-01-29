'use client';

import { useState } from 'react';
import { Collection } from '@/types/collections';
import { X } from 'lucide-react';
import Image from 'next/image';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Collection>) => void;
  collection?: Collection | null;
  isSaving?: boolean;
}

const getInitialFormData = (collection?: Collection | null): Partial<Collection> => ({
  name: collection?.name || '',
  description: collection?.description || '',
  image: collection?.image || '',
  products: collection?.products || [],
  featured: collection?.featured || false,
});

function CollectionModalContent({
  onClose,
  onSave,
  collection,
  isSaving = false,
}: Omit<CollectionModalProps, 'isOpen'>) {
  const [formData, setFormData] = useState<Partial<Collection>>(
    getInitialFormData(collection)
  );

  const [productsInput, setProductsInput] = useState(
    collection?.products?.join(', ') || ''
  );

  const [imageError, setImageError] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleProductsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductsInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse product IDs from comma-separated string
    const productIds = productsInput
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id.length > 0);

    onSave({
      ...formData,
      products: productIds,
    });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="sm:flex sm:items-start">
      <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
        <h3 className="text-lg leading-6 font-medium text-[var(--foreground)] mb-4">
          {collection ? 'Edit Collection' : 'Add New Collection'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[var(--foreground)] mb-1"
            >
              Collection Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Summer Romance Collection"
              className="block w-full px-3 py-2 border border-[var(--border)] rounded-md shadow-sm text-[var(--foreground)] placeholder-gray-400 focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-[var(--foreground)] mb-1"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe this collection..."
              className="block w-full px-3 py-2 border border-[var(--border)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm"
            />
          </div>

          {/* Image URL */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-[var(--foreground)] mb-1"
            >
              Image URL
            </label>
            <input
              id="image"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="block w-full px-3 py-2 border border-[var(--border)] rounded-md shadow-sm text-[var(--foreground)] placeholder-gray-400 focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm"
            />
            {formData.image && !imageError && (
              <div className="mt-2 relative h-32 w-full rounded-md overflow-hidden">
                <Image
                  src={formData.image}
                  alt="Preview"
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              </div>
            )}
            {imageError && formData.image && (
              <div className="mt-2 h-32 w-full bg-[var(--muted)] rounded-md flex items-center justify-center">
                <span className="text-[var(--muted-foreground)] text-sm">Invalid image URL</span>
              </div>
            )}
          </div>

          {/* Products */}
          <div>
            <label
              htmlFor="products"
              className="block text-sm font-medium text-[var(--foreground)] mb-1"
            >
              Product IDs (comma-separated)
            </label>
            <input
              id="products"
              name="products"
              type="text"
              value={productsInput}
              onChange={handleProductsChange}
              placeholder="product_1, product_2, product_3"
              className="block w-full px-3 py-2 border border-[var(--border)] rounded-md shadow-sm text-[var(--foreground)] placeholder-gray-400 focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm"
            />
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Enter product IDs separated by commas
            </p>
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)] border-[var(--border)] rounded cursor-pointer"
            />
            <label
              htmlFor="featured"
              className="ml-2 block text-sm text-[var(--foreground)] cursor-pointer"
            >
              Featured Collection
            </label>
          </div>

          {/* Actions */}
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[var(--primary)] text-base font-medium text-white hover:bg-[var(--hover-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : collection ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-[var(--border)] shadow-sm px-4 py-2 bg-[var(--card)] text-base font-medium text-[var(--foreground)] hover:bg-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] sm:mt-0 sm:col-start-1 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CollectionModal({
  isOpen,
  onClose,
  onSave,
  collection,
  isSaving = false,
}: CollectionModalProps) {
  if (!isOpen) return null;

  // Use key to reset component state when collection changes
  const modalKey = collection?.collectionId || 'new';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-[var(--secondary)]0 bg-opacity-75"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/* Modal panel */}
        <div className="relative inline-block align-bottom bg-[var(--card)] rounded-lg px-4 pt-5 pb-4 text-left overflow-visible shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 z-50">
          <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
            <button
              type="button"
              onClick={onClose}
              className="bg-[var(--card)] rounded-md text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <CollectionModalContent
            key={modalKey}
            onClose={onClose}
            onSave={onSave}
            collection={collection}
            isSaving={isSaving}
          />
        </div>
      </div>
    </div>
  );
}
