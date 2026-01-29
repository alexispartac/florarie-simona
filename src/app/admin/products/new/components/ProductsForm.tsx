// Create a new file at: src/app/admin/products/components/ProductForm.tsx
'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Product, RelatedProduct, FlowerColor, FlowerOccasion, FlowerType, FlowerSize, SeasonalAvailability } from '@/types/products';
import { v4 as uuidv4 } from 'uuid';

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: Product) => Promise<void>;
  isSubmitting: boolean;
}

export function ProductForm({ initialData, onSubmit, isSubmitting }: ProductFormProps) {
  const [formData, setFormData] = useState({
    productId: initialData?.productId || uuidv4(),
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    category: initialData?.category || '',
    tags: initialData?.tags?.join(', ') || '',
    isFeatured: initialData?.isFeatured || false,
    isNew: initialData?.isNew || false,
    details: initialData?.details?.join('\n') || '',
    images: initialData?.images?.join('\n') || '',
    available: initialData?.available !== undefined ? initialData.available : true,
    stock: initialData?.stock || 0,
    sku: initialData?.sku || '',
    weight: initialData?.weight || 0,
    salePrice: initialData?.salePrice || 0,
    relatedProducts: initialData?.relatedProducts?.map(prod => ({
      productId: prod.productId,
      name: prod.name || '',
      price: prod.price || 0,
      slug: prod.slug || '',
      image: prod.image || '',
      category: prod.category || ''
    })) || [{
      productId: '',
      name: '',
      price: 0,
      slug: '',
      image: '',
      category: ''
    }],
    rating: initialData?.rating || 0,
    reviewCount: initialData?.reviewCount || 0,
    reviews: initialData?.reviews || [],
    // Flower-specific fields
    flowerColors: initialData?.flowerDetails?.colors?.join(', ') || '',
    flowerOccasions: initialData?.flowerDetails?.occasions?.join(', ') || '',
    flowerTypes: initialData?.flowerDetails?.flowerTypes?.join(', ') || '',
    flowerSizes: initialData?.flowerDetails?.size?.join(', ') || '',
    stemCount: initialData?.flowerDetails?.stemCount || 0,
    includesVase: initialData?.flowerDetails?.includesVase || false,
    sameDayDelivery: initialData?.flowerDetails?.sameDayDelivery || false,
    customMessageAvailable: initialData?.flowerDetails?.customMessageAvailable || true,
    seasonalAvailability: initialData?.flowerDetails?.seasonalAvailability || 'all-year',
    wateringFrequency: initialData?.flowerDetails?.careInstructions?.wateringFrequency || '',
    sunlightRequirement: initialData?.flowerDetails?.careInstructions?.sunlightRequirement || '',
    temperature: initialData?.flowerDetails?.careInstructions?.temperature || '',
    expectedLifespan: initialData?.flowerDetails?.careInstructions?.expectedLifespan || '',
    specialNotes: initialData?.flowerDetails?.careInstructions?.specialNotes || '',
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

    // Process related products to match RelatedProduct type
    const processedRelatedProducts = formData.relatedProducts;

    await onSubmit({
      ...formData,
      slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
      price: Number(formData.price) || 0,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      details: formData.details.split('\n').filter(Boolean),
      images: formData.images.split('\n').filter(url => url.trim() !== ''),
      relatedProducts: processedRelatedProducts,
      available: formData.available && Number(formData.stock) > 0,
      stock: Number(formData.stock) || 0,
      sku: formData.sku || `SKU-${formData.productId.slice(0, 8).toUpperCase()}`,
      weight: Number(formData.weight) || 0,
      salePrice: Number(formData.salePrice) || 0,
      flowerDetails: {
        colors: formData.flowerColors.split(',').map(c => c.trim()).filter(Boolean) as FlowerColor[],
        occasions: formData.flowerOccasions.split(',').map(o => o.trim()).filter(Boolean) as FlowerOccasion[],
        flowerTypes: formData.flowerTypes.split(',').map(t => t.trim()).filter(Boolean) as FlowerType[],
        size: formData.flowerSizes.split(',').map(s => s.trim()).filter(Boolean) as FlowerSize[],
        stemCount: Number(formData.stemCount) || 0,
        includesVase: formData.includesVase,
        sameDayDelivery: formData.sameDayDelivery,
        customMessageAvailable: formData.customMessageAvailable,
        seasonalAvailability: formData.seasonalAvailability as SeasonalAvailability,
        careInstructions: {
          wateringFrequency: formData.wateringFrequency,
          sunlightRequirement: formData.sunlightRequirement,
          temperature: formData.temperature,
          expectedLifespan: formData.expectedLifespan,
          specialNotes: formData.specialNotes,
        }
      }
    } as Product);
  };

  const handleAddRelatedProduct = () => {
    setFormData(prev => ({
      ...prev,
      relatedProducts: [
        ...prev.relatedProducts,
        {
          productId: '',
          name: '',
          price: 0,
          slug: '',
          image: '',
          category: ''
        }
      ]
    }));
  };

  const handleRemoveRelatedProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      relatedProducts: prev.relatedProducts.filter((_, i) => i !== index)
    }));
  };

  const handleRelatedProductChange = (index: number, field: keyof RelatedProduct, value: string | number) => {
    const updatedProducts = [...formData.relatedProducts];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      relatedProducts: updatedProducts
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white shadow-sm rounded-lg border-2 border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          📦 Informații de Bază
        </h2>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nume Produs <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full"
              placeholder="ex: Buchet de Trandafiri Roșii"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Categorie <span className="text-red-500">*</span>
            </label>
            <Input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full"
              placeholder="ex: Trandafiri"
            />
          </div>

          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
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
            <p className="mt-1 text-xs text-gray-500">Cod unic pentru identificare</p>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Etichete
            </label>
            <Input
              id="tags"
              name="tags"
              type="text"
              value={formData.tags}
              onChange={handleChange}
              placeholder="romantic, popular, valentine"
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500">Separate prin virgulă</p>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descriere <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 p-3 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="O descriere detaliată a produsului..."
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
              Detalii Produs <span className="text-red-500">*</span>
            </label>
            <textarea
              id="details"
              name="details"
              rows={5}
              value={formData.details}
              onChange={handleChange}
              required
              className="mt-1 block p-3 w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="12 trandafiri roșii premium&#10;Livrare în aceeași zi disponibilă&#10;Include felicitare personalizabilă"
            />
            <p className="mt-1 text-xs text-gray-500">Un detaliu per linie</p>
          </div>
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="bg-white shadow-sm rounded-lg border-2 border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          💰 Preț & Stoc
        </h2>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Preț (RON) <span className="text-red-500">*</span>
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price / 100}
              onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) * 100 }))}
              required
              className="w-full"
              placeholder="150.00"
            />
            <p className="mt-1 text-xs text-gray-500">Preț în RON (va fi salvat în cenți)</p>
          </div>

          <div>
            <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700 mb-1">
              Preț Redus (RON)
            </label>
            <Input
              id="salePrice"
              name="salePrice"
              type="number"
              step="0.01"
              min="0"
              value={formData.salePrice ? formData.salePrice / 100 : ''}
              onChange={(e) => setFormData(prev => ({ ...prev, salePrice: e.target.value ? Number(e.target.value) * 100 : 0 }))}
              className="w-full"
              placeholder="120.00"
            />
            <p className="mt-1 text-xs text-gray-500">Lasă gol dacă nu e la reducere</p>
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Stoc Disponibil <span className="text-red-500">*</span>
            </label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              required
              className="w-full"
              placeholder="50"
            />
            <p className="mt-1 text-xs text-gray-500">Cantitate în stoc</p>
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Greutate (kg)
            </label>
            <Input
              id="weight"
              name="weight"
              type="number"
              step="0.01"
              min="0"
              value={formData.weight}
              onChange={handleChange}
              className="w-full"
              placeholder="0.5"
            />
            <p className="mt-1 text-xs text-gray-500">Pentru calculul transportului</p>
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <input
              id="available"
              name="available"
              type="checkbox"
              checked={formData.available}
              onChange={handleChange}
              className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="available" className="text-sm font-medium text-gray-700">Disponibil pentru vânzare</label>
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <input
              id="isFeatured"
              name="isFeatured"
              type="checkbox"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">Produs Recomandat</label>
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <input
              id="isNew"
              name="isNew"
              type="checkbox"
              checked={formData.isNew}
              onChange={handleChange}
              className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="isNew" className="text-sm font-medium text-gray-700">Produs Nou</label>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white shadow-sm rounded-lg border-2 border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          🖼️ Imagini
        </h2>
        
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
            URL-uri Imagini <span className="text-red-500">*</span>
          </label>
          <textarea
            id="images"
            name="images"
            rows={5}
            value={formData.images}
            onChange={handleChange}
            className="mt-1 p-3 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm font-mono text-xs"
            placeholder="https://images.unsplash.com/photo-1.jpg&#10;https://images.unsplash.com/photo-2.jpg&#10;https://images.unsplash.com/photo-3.jpg"
            required
          />
          <p className="mt-2 text-xs text-gray-500">Un URL per linie. Prima imagine va fi imaginea principală.</p>
        </div>
      </div>

      {/* Flower-specific fields */}
      <div className="bg-white shadow-sm rounded-lg border-2 border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          🌸 Detalii Flori
        </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
              <label htmlFor="flowerColors" className="block text-sm font-medium text-gray-700">Colors</label>
                    <Input
                id="flowerColors"
                name="flowerColors"
                type="text"
                value={formData.flowerColors}
                onChange={handleChange}
                placeholder="e.g., red, pink, white"
                    />
              <p className="mt-1 text-sm text-gray-500">Separate with commas</p>
                  </div>

                  <div>
              <label htmlFor="flowerOccasions" className="block text-sm font-medium text-gray-700">Occasions</label>
                    <Input
                id="flowerOccasions"
                name="flowerOccasions"
                type="text"
                value={formData.flowerOccasions}
                onChange={handleChange}
                placeholder="e.g., birthday, romantic, wedding"
                    />
              <p className="mt-1 text-sm text-gray-500">Separate with commas</p>
                  </div>

                  <div>
              <label htmlFor="flowerTypes" className="block text-sm font-medium text-gray-700">Flower Types</label>
                    <Input
                id="flowerTypes"
                name="flowerTypes"
                type="text"
                value={formData.flowerTypes}
                onChange={handleChange}
                placeholder="e.g., roses, tulips, lilies"
                    />
              <p className="mt-1 text-sm text-gray-500">Separate with commas</p>
                  </div>

                  <div>
              <label htmlFor="flowerSizes" className="block text-sm font-medium text-gray-700">Available Sizes</label>
                    <Input
                id="flowerSizes"
                name="flowerSizes"
                type="text"
                value={formData.flowerSizes}
                onChange={handleChange}
                placeholder="e.g., small, medium, large"
                    />
              <p className="mt-1 text-sm text-gray-500">Separate with commas</p>
                  </div>

                  <div>
              <label htmlFor="stemCount" className="block text-sm font-medium text-gray-700">Stem Count</label>
                    <Input
                id="stemCount"
                name="stemCount"
                      type="number"
                      min="0"
                value={formData.stemCount}
                onChange={handleChange}
                    />
                  </div>

                  <div>
              <label htmlFor="seasonalAvailability" className="block text-sm font-medium text-gray-700">Seasonal Availability</label>
              <select
                id="seasonalAvailability"
                name="seasonalAvailability"
                value={formData.seasonalAvailability}
                onChange={handleChange}
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="all-year">All Year</option>
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="fall">Fall</option>
                <option value="winter">Winter</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="includesVase"
                name="includesVase"
                type="checkbox"
                checked={formData.includesVase}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="includesVase" className="text-sm font-medium text-gray-700">Includes Vase</label>
                  </div>

            <div className="flex items-center space-x-2">
              <input
                id="sameDayDelivery"
                name="sameDayDelivery"
                type="checkbox"
                checked={formData.sameDayDelivery}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="sameDayDelivery" className="text-sm font-medium text-gray-700">Same Day Delivery</label>
                </div>

            <div className="flex items-center space-x-2">
              <input
                id="customMessageAvailable"
                name="customMessageAvailable"
                type="checkbox"
                checked={formData.customMessageAvailable}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="customMessageAvailable" className="text-sm font-medium text-gray-700">Custom Message Available</label>
              </div>
          </div>
      </div>

      {/* Care Instructions */}
      <div className="bg-white shadow-sm rounded-lg border-2 border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          🌱 Instrucțiuni de Îngrijire
        </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="wateringFrequency" className="block text-sm font-medium text-gray-700">Watering Frequency</label>
              <Input
              id="wateringFrequency"
              name="wateringFrequency"
              type="text"
              value={formData.wateringFrequency}
              onChange={handleChange}
              placeholder="ex: zilnic, o dată la 2 zile"
              className="w-full"
            />
            </div>

            <div>
              <label htmlFor="sunlightRequirement" className="block text-sm font-medium text-gray-700">Sunlight Requirement</label>
              <Input
              id="sunlightRequirement"
              name="sunlightRequirement"
              type="text"
              value={formData.sunlightRequirement}
              onChange={handleChange}
              placeholder="ex: lumină indirectă"
              className="w-full"
            />
            </div>

            <div>
              <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">Temperature</label>
              <Input
              id="temperature"
              name="temperature"
              type="text"
              value={formData.temperature}
              onChange={handleChange}
              placeholder="ex: 15-25°C"
              className="w-full"
            />
            </div>

            <div>
              <label htmlFor="expectedLifespan" className="block text-sm font-medium text-gray-700">Expected Lifespan</label>
              <Input
                id="expectedLifespan"
                name="expectedLifespan"
                type="text"
                value={formData.expectedLifespan}
                onChange={handleChange}
                placeholder="ex: 7-10 zile"
                className="w-full"
              />
            </div>

          <div className="sm:col-span-2">
            <label htmlFor="specialNotes" className="block text-sm font-medium text-gray-700 mb-1">
              Note Speciale
            </label>
            <textarea
              id="specialNotes"
              name="specialNotes"
              rows={3}
              value={formData.specialNotes}
              onChange={handleChange}
              className="mt-1 p-3 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="Orice instrucțiuni speciale de îngrijire..."
            />
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="bg-white shadow-sm rounded-lg border-2 border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          🔗 Produse Similare
        </h2>
        <div className="space-y-4">
          {formData.relatedProducts.map((product, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-xl p-5 space-y-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-900">Produs Similar #{index + 1}</h4>
                {formData.relatedProducts.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => handleRemoveRelatedProduct(index)}
                    className="text-red-600 hover:text-red-800 text-sm cursor-pointer bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg"
                  >
                    Șterge
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
                  <Input
                    value={product.productId}
                    onChange={(e) => handleRelatedProductChange(index, 'productId', e.target.value)}
                    placeholder="ID-ul produsului"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nume</label>
                  <Input
                    value={product.name}
                    onChange={(e) => handleRelatedProductChange(index, 'name', e.target.value)}
                    placeholder="Nume produs"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preț (RON)</label>
                  <Input
                    type="number"
                    value={product.price / 100}
                    onChange={(e) => handleRelatedProductChange(index, 'price', Number(e.target.value) * 100)}
                    step="0.01"
                    min="0"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <Input
                    value={product.slug}
                    onChange={(e) => handleRelatedProductChange(index, 'slug', e.target.value)}
                    placeholder="product-slug"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Imagine</label>
                  <Input
                    value={product.image}
                    onChange={(e) => handleRelatedProductChange(index, 'image', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
                  <Input
                    value={product.category}
                    onChange={(e) => handleRelatedProductChange(index, 'category', e.target.value)}
                    placeholder="Categorie"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddRelatedProduct}
            className="cursor-pointer inline-flex items-center px-6 py-3 border-2 border-dashed border-gray-300 text-sm font-medium rounded-xl text-primary bg-white hover:bg-gray-50 hover:border-primary transition-all"
          >
            + Adaugă Produs Similar
          </button>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
          className="cursor-pointer px-6 py-3 rounded-xl"
        >
          Anulează
        </Button>
        <Button
          type="submit"
          className='cursor-pointer bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Se salvează...' : 'Salvează Produsul'}
        </Button>
      </div>
    </form>
  );
}