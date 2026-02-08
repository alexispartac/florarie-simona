// Create a new file at: src/app/admin/extras/new/components/ExtrasForm.tsx
'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Extra, ExtraSize } from '@/types/extras';
import { v4 as uuidv4 } from 'uuid';

interface ExtrasFormProps {
  initialData?: Partial<Extra>;
  onSubmit: (data: Extra) => Promise<void>;
  isSubmitting: boolean;
}

export function ExtrasForm({ initialData, onSubmit, isSubmitting }: ExtrasFormProps) {
  const [formData, setFormData] = useState({
    extraId: initialData?.extraId || uuidv4(),
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    price: initialData?.price || 0,
    salePrice: initialData?.salePrice || 0,
    category: initialData?.category || '',
    tags: initialData?.tags?.join(', ') || '',
    isFeatured: initialData?.isFeatured || false,
    isNew: initialData?.isNew || false,
    available: initialData?.available !== undefined ? initialData.available : true,
    stock: initialData?.stock || 0,
    sku: initialData?.sku || '',
    images: initialData?.images?.join('\n') || '',
    size: initialData?.size || 'medium' as ExtraSize,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
      price: Number(formData.price) || 0,
      salePrice: Number(formData.salePrice) || 0,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      images: formData.images.split('\n').filter(url => url.trim() !== ''),
      available: formData.available && Number(formData.stock) > 0,
      stock: Number(formData.stock) || 0,
      sku: formData.sku || `EXTRA-${formData.extraId.slice(0, 8).toUpperCase()}`,
    } as Extra);
  };

  const SIZES: ExtraSize[] = ['small', 'medium', 'large'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-[var(--card)] shadow-sm rounded-lg border-2 border-[var(--border)] p-6">
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
          🎁 Informații de Bază
        </h2>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Nume Produs <span className="text-[var(--destructive)]">*</span>
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full"
              placeholder="ex: Cutie Bomboane Premium"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Categorie <span className="text-[var(--destructive)]">*</span>
            </label>
            <Input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full"
              placeholder="ex: Ciocolată"
            />
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Categoriile se creează automat și se pot filtra pe site
            </p>
          </div>

          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              SKU (Cod Produs)
            </label>
            <Input
              id="sku"
              name="sku"
              type="text"
              value={formData.sku}
              onChange={handleChange}
              className="w-full"
              placeholder="Auto-generat dacă e gol"
            />
          </div>

          <div>
            <label htmlFor="size" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Mărime
            </label>
            <select
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              {SIZES.map(size => (
                <option key={size} value={size}>
                  {size === 'small' ? 'Mic' : size === 'medium' ? 'Mediu' : 'Mare'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Tag-uri (separate prin virgulă)
            </label>
            <Input
              id="tags"
              name="tags"
              type="text"
              value={formData.tags}
              onChange={handleChange}
              className="w-full"
              placeholder="ex: premium, cadou, elegant"
            />
          </div>
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="bg-[var(--card)] shadow-sm rounded-lg border-2 border-[var(--border)] p-6">
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
          💰 Prețuri și Stoc
        </h2>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Preț (în bani - ex: 8500 = 85 RON) <span className="text-[var(--destructive)]">*</span>
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              className="w-full"
              placeholder="8500"
            />
          </div>

          <div>
            <label htmlFor="salePrice" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Preț Redus (opțional)
            </label>
            <Input
              id="salePrice"
              name="salePrice"
              type="number"
              value={formData.salePrice}
              onChange={handleChange}
              min="0"
              className="w-full"
              placeholder="7500"
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Stoc <span className="text-[var(--destructive)]">*</span>
            </label>
            <Input
              id="stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full"
              placeholder="50"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-[var(--card)] shadow-sm rounded-lg border-2 border-[var(--border)] p-6">
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
          🖼️ Imagini
        </h2>
        
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-[var(--foreground)] mb-1">
            URL-uri Imagini (câte unul pe linie) <span className="text-[var(--destructive)]">*</span>
          </label>
          <textarea
            id="images"
            name="images"
            value={formData.images}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-mono text-sm"
            placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
          />
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Adaugă URL-uri de imagini, câte unul pe linie
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="bg-[var(--card)] shadow-sm rounded-lg border-2 border-[var(--border)] p-6">
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
          ⭐ Stare Produs
        </h2>
        
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 text-[var(--primary)] border-[var(--border)] rounded focus:ring-[var(--primary)]"
            />
            <span className="text-sm font-medium text-[var(--foreground)]">⭐ Featured (Popular)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isNew"
              checked={formData.isNew}
              onChange={handleChange}
              className="w-4 h-4 text-[var(--primary)] border-[var(--border)] rounded focus:ring-[var(--primary)]"
            />
            <span className="text-sm font-medium text-[var(--foreground)]">🌟 Produs Nou</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
              className="w-4 h-4 text-[var(--primary)] border-[var(--border)] rounded focus:ring-[var(--primary)]"
            />
            <span className="text-sm font-medium text-[var(--foreground)]">✅ Disponibil</span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
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
          {isSubmitting ? 'Se salvează...' : initialData?.extraId ? 'Actualizează Extra' : 'Creează Extra'}
        </Button>
      </div>
    </form>
  );
}
