'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SeasonalCollection } from '@/types/seasonalCollections';
import { v4 as uuidv4 } from 'uuid';

interface SeasonalCollectionFormProps {
  initialData?: Partial<SeasonalCollection>;
  onSubmit: (data: SeasonalCollection) => Promise<void>;
  isSubmitting: boolean;
}

export function SeasonalCollectionForm({ initialData, onSubmit, isSubmitting }: SeasonalCollectionFormProps) {
  const [formData, setFormData] = useState({
    collectionId: initialData?.collectionId || uuidv4(),
    title: initialData?.title || '',
    description: initialData?.description || '',
    slug: initialData?.slug || '',
    image: initialData?.image || '',
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
    isActive: initialData?.isActive ?? true,
    priority: initialData?.priority || 1,
    buttonText: initialData?.buttonText || 'Vezi Colecția',
    buttonLink: initialData?.buttonLink || '',
    products: initialData?.products?.join('\n') || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await onSubmit({
      ...formData,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
      priority: Number(formData.priority) || 1,
      products: formData.products.split('\n').map(id => id.trim()).filter(Boolean),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    } as SeasonalCollection);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-[var(--card)] shadow-sm rounded-lg border-2 border-[var(--border)] p-6">
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
          🎉 Informații de Bază
        </h2>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Titlu Colecție <span className="text-[var(--destructive)]">*</span>
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full"
              placeholder="ex: Colecția de Primăvară 2024"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Descriere <span className="text-[var(--destructive)]">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 p-3 block w-full rounded-lg border-2 border-[var(--border)] shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)] sm:text-sm"
              placeholder="Descrierea colecției care va apărea în pop-up..."
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Slug (URL)
            </label>
            <Input
              id="slug"
              name="slug"
              type="text"
              value={formData.slug}
              onChange={handleChange}
              className="w-full"
              placeholder="Se generează automat din titlu"
            />
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">Lasă gol pentru generare automată</p>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Prioritate <span className="text-[var(--destructive)]">*</span>
            </label>
            <Input
              id="priority"
              name="priority"
              type="number"
              min="1"
              value={formData.priority}
              onChange={handleChange}
              required
              className="w-full"
              placeholder="1"
            />
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">Prioritatea mai mare = se afișează prima</p>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="bg-[var(--card)] shadow-sm rounded-lg border-2 border-[var(--border)] p-6">
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
          📅 Perioada de Afișare
        </h2>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Data de Început <span className="text-[var(--destructive)]">*</span>
            </label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Data de Sfârșit <span className="text-[var(--destructive)]">*</span>
            </label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Image & Button */}
      <div className="bg-[var(--card)] shadow-sm rounded-lg border-2 border-[var(--border)] p-6">
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
          🖼️ Imagine & Buton
        </h2>
        
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              URL Imagine <span className="text-[var(--destructive)]">*</span>
            </label>
            <Input
              id="image"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              required
              className="w-full"
              placeholder="https://images.unsplash.com/photo-..."
            />
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">URL-ul imaginii pentru pop-up</p>
          </div>

          <div>
            <label htmlFor="buttonText" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Text Buton <span className="text-[var(--destructive)]">*</span>
            </label>
            <Input
              id="buttonText"
              name="buttonText"
              type="text"
              value={formData.buttonText}
              onChange={handleChange}
              required
              className="w-full"
              placeholder="Vezi Colecția"
            />
          </div>

          <div>
            <label htmlFor="buttonLink" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Link Buton <span className="text-[var(--destructive)]">*</span>
            </label>
            <Input
              id="buttonLink"
              name="buttonLink"
              type="text"
              value={formData.buttonLink}
              onChange={handleChange}
              required
              className="w-full"
              placeholder="/collections/collection_1770060412594_a5czy1c51?collectionId=collection_1770060412594_a5czy1c51 sau /collections"
            />
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">Unde să fie redirecționat utilizatorul</p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="bg-[var(--card)] shadow-sm rounded-lg border-2 border-[var(--border)] p-6">
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
          🌸 Produse în Colecție
        </h2>
        
        <div>
          <label htmlFor="products" className="block text-sm font-medium text-[var(--foreground)] mb-1">
            ID-uri Produse (opțional)
          </label>
          <textarea
            id="products"
            name="products"
            rows={5}
            value={formData.products}
            onChange={handleChange}
            className="mt-1 p-3 block w-full rounded-lg border-2 border-[var(--border)] shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)] sm:text-sm font-mono text-xs"
            placeholder="product-id-1&#10;product-id-2&#10;product-id-3"
          />
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">
            Un ID de produs per linie. Aceste produse vor fi asociate cu colecția.
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="bg-[var(--card)] shadow-sm rounded-lg border-2 border-[var(--border)] p-6">
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
          ⚙️ Stare
        </h2>
        
        <div className="flex items-center space-x-2">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-5 w-5 text-primary focus:ring-[var(--primary)] border-[var(--border)] rounded"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-[var(--foreground)]">
            Colecție Activă (se va afișa pop-up-ul)
          </label>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Anulează
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Se salvează...' : initialData?.collectionId ? 'Actualizează Colecția' : 'Creează Colecția'}
        </Button>
      </div>
    </form>
  );
}
