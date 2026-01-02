// Create a new file at: src/app/admin/products/components/ProductForm.tsx
'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Product, RelatedProduct } from '@/types/products';
import { v4 as uuidv4 } from 'uuid';

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: Omit<Product, 'reviews' | 'rating' | 'reviewCount'>) => Promise<void>;
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
    sizeGuide: initialData?.sizeGuide || {
      category: 'clothing',
      sizes: [],
      measuringGuide: ''
    },
    variants: initialData?.variants?.map(variant => ({
      ...variant,
      priceAdjustment: variant.priceAdjustment || 0,
      stock: variant.stock || 0,
    })) || [{
      variantId: uuidv4(),
      productId: initialData?.productId || '',
      sku: '',
      size: '',
      color: '',
      colorName: '',
      colorCode: '#000000',
      priceAdjustment: 0,
      stock: 0,
      images: [],
      isActive: true
    }],
    availableSizes: initialData?.availableSizes?.join(', ') || '',
    availableColors: initialData?.availableColors?.map(c => c.name).join(', ') || '',
    images: initialData?.images?.join('\n') || '',
    relatedProducts: initialData?.relatedProducts?.map(prod => ({
      id: prod.id,
      name: prod.name || '',
      price: prod.price || 0,
      slug: prod.slug || '',
      image: prod.image || '',
      category: prod.category || ''
    })) || [{
      id: '',
      name: '',
      price: 0,
      slug: '',
      image: '',
      category: ''
    }],
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
    
    // Process variants to ensure they match the ProductVariant type
    const processedVariants = formData.variants.map(variant => ({
      variantId: variant.variantId || uuidv4(),
      productId: variant.productId || '',
      sku: variant.sku || '',
      size: variant.size || '',
      color: variant.color || '',
      colorName: variant.colorName || '',
      colorCode: variant.colorCode || '#000000',
      priceAdjustment: Number(variant.priceAdjustment) || 0,
      stock: Number(variant.stock) || 0,
      images: Array.isArray(variant.images) ? variant.images : [],
      isActive: variant.isActive !== undefined ? variant.isActive : true
    }));

    // Process colors to match ColorOption type
    const processedColors = formData.availableColors
      .split(',')
      .map(c => c.trim())
      .filter(Boolean)
      .map(color => ({
        name: color,
        code: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        image: ''
      }));

    // Process related products to match RelatedProduct type
    const processedRelatedProducts = formData.relatedProducts;

    await onSubmit({
      ...formData,
      price: Number(formData.price) || 0,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      details: formData.details.split('\n').filter(Boolean),
      variants: processedVariants,
      availableSizes: formData.availableSizes.split(',').map(s => s.trim()).filter(Boolean),
      availableColors: processedColors,
      images: formData.images.split('\n').filter(url => url.trim() !== ''),
      relatedProducts: processedRelatedProducts,
    });
  };

  // Handle adding/removing variants
  const handleAddVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          variantId: uuidv4(),
          productId: initialData?.productId || '',
          sku: '',
          size: '',
          color: '',
          colorName: '',
          colorCode: '#000000',
          priceAdjustment: 0,
          stock: 0,
          images: [],
          isActive: true
        }
      ]
    }));
  };

  const handleRemoveVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleAddRelatedProduct = () => {
    setFormData(prev => ({
      ...prev,
      relatedProducts: [
        ...prev.relatedProducts,
        {
          id: '',
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

  const handleVariantChange = (index: number, field: string, value: string | number | boolean | string[]) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value
    };
    setFormData({
      ...formData,
      variants: updatedVariants
    });
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full rounded-md border-1 border-primary shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            aria-describedby="description-help"
          />
          <p id="description-help" className="mt-1 text-sm text-gray-500">Enter a brief description of the product</p>
        </div>

        <div className="sm:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Product Variants</h3>
          <div className="space-y-4">
            {formData.variants.map((variant, index) => (
              <div key={variant.variantId} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Variant {index + 1}</h4>
                  {formData.variants.length > 1 && (
                    <Button
                      onClick={() => handleRemoveVariant(index)}
                      className="text-red-600 hover:text-red-800 text-sm cursor-pointer"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <Input
                      value={variant.sku}
                      onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                      placeholder="SKU-001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                    <Input
                      value={variant.size}
                      onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                      placeholder="e.g., S, M, L, XL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <Input
                      value={variant.color}
                      onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                      placeholder="e.g., Black, White"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Adjustment</label>
                    <Input
                      type="number"
                      value={variant.priceAdjustment}
                      onChange={(e) => handleVariantChange(index, 'priceAdjustment', Number(e.target.value))}
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <Input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => handleVariantChange(index, 'stock', Number(e.target.value))}
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color Name</label>
                    <Input
                      value={variant.colorName}
                      onChange={(e) => handleVariantChange(index, 'colorName', e.target.value)}
                      placeholder="e.g., Midnight Black"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={`variant-images-${index}`} className="block text-sm font-medium text-gray-700">Image URLs</label>
                    <textarea
                      id={`variant-images-${index}`}
                      name="images"
                      rows={4}
                      value={Array.isArray(variant.images) ? variant.images.join('\n') : ''}
                      onChange={(e) => {
                        const urls = e.target.value.split('\n').filter(url => url.trim() !== '');
                        handleVariantChange(index, 'images', urls);
                      }}
                      className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="Enter one image URL per line"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color Code</label>
                    <Input
                      type="color"
                      className="w-16 h-10 p-1"
                      value={variant.colorCode}
                      onChange={(e) => handleVariantChange(index, 'colorCode', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              onClick={handleAddVariant}
              className="mt-2 inline-flex cursor-pointer items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add Variant
            </Button>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="availableSizes" className="block text-sm font-medium text-gray-700">Available Sizes</label>
          <Input
            id="availableSizes"
            name="availableSizes"
            type="text"
            value={formData.availableSizes}
            onChange={handleChange}
            placeholder="e.g., S, M, L, XL"
          />
          <p className="mt-1 text-sm text-gray-500">Separate sizes with commas</p>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="availableColors" className="block text-sm font-medium text-gray-700">Available Colors</label>
          <Input
            id="availableColors"
            name="availableColors"
            type="text"
            value={formData.availableColors}
            onChange={handleChange}
            placeholder="e.g., Black, White, Red"
          />
          <p className="mt-1 text-sm text-gray-500">Separate colors with commas</p>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="images" className="block text-sm font-medium text-gray-700">Image URLs</label>
          <textarea
            id="images"
            name="images"
            rows={4}
            value={formData.images}
            onChange={handleChange}
            className="mt-1 p-2 block w-full rounded-md border-1 border-primary shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="Enter one image URL per line"
          />
        </div>

        <div className="sm:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Related Products</h3>
          <div className="space-y-4">
            {formData.relatedProducts.map((product, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Related Product {index + 1}</h4>
                  {formData.relatedProducts.length > 1 && (
                    <Button
                      onClick={() => handleRemoveRelatedProduct(index)}
                      className="text-red-600 hover:text-red-800 text-sm cursor-pointer"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
                    <Input
                      value={product.id}
                      onChange={(e) => handleRelatedProductChange(index, 'id', e.target.value)}
                      placeholder="Product ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <Input
                      value={product.name}
                      onChange={(e) => handleRelatedProductChange(index, 'name', e.target.value)}
                      placeholder="Product Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <Input
                      type="number"
                      value={product.price}
                      onChange={(e) => handleRelatedProductChange(index, 'price', Number(e.target.value))}
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                    <Input
                      value={product.slug}
                      onChange={(e) => handleRelatedProductChange(index, 'slug', e.target.value)}
                      placeholder="product-slug"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <Input
                      value={product.image}
                      onChange={(e) => handleRelatedProductChange(index, 'image', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <Input
                      value={product.category}
                      onChange={(e) => handleRelatedProductChange(index, 'category', e.target.value)}
                      placeholder="Category"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              onClick={handleAddRelatedProduct}
              className="mt-2 cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add Related Product
            </Button>
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <Input
            id="category"
            name="category"
            type="text"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
          <Input
            id="tags"
            name="tags"
            type="text"
            value={formData.tags}
            onChange={handleChange}
            placeholder="tag1, tag2, tag3"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="isFeatured"
            name="isFeatured"
            type="checkbox"
            checked={formData.isFeatured}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">Featured Product</label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="isNew"
            name="isNew"
            type="checkbox"
            checked={formData.isNew}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="isNew" className="text-sm font-medium text-gray-700">New Arrival</label>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="details" className="block text-sm font-medium text-gray-700">Product Details (one per line)</label>
          <textarea
            id="details"
            name="details"
            rows={4}
            value={formData.details}
            onChange={handleChange}
            required
            className="mt-1 block p-2 w-full rounded-md border-1 border-primary shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            aria-describedby="details-help"
          />
          <p id="details-help" className="mt-1 text-sm text-gray-500">Enter each detail on a new line</p>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
          className="cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className='cursor-pointer bg-primary-600 hover:bg-primary-700'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Product'}
        </Button>
      </div>
    </form>
  );
}