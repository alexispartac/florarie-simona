import React from 'react';
import { Heart } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { ProductInCatalog } from '@/types/products';
import Image from 'next/image';

export interface ProductCardProps {
  product: ProductInCatalog;
  onToggleWishlist: (
    productId: string,
    name: string,
    price: number,
    images: string[],
  ) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onToggleWishlist,
}) => {
  const router = useRouter(); 

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      <div className="aspect-square relative overflow-hidden">
        <Image 
          src={product.images[0] || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover"
          width={200}
          height={200}
        />
        <div className="absolute top-3 right-3">
          <button
            onClick={() => onToggleWishlist(product.productId, product.name, product.price, product.images)}
            className={`p-1.5 bg-white/90 rounded-full shadow-sm text-black hover:text-red-500 cursor-pointer`}
          >
            <Heart className={`h-5 w-5 fill-current`} />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{product.category}</p>
          </div>
          <p className="text-sm font-medium text-gray-900">
            ${(product.price / 100).toFixed(2)}
          </p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            View details and variants colors
          </p>
          {/* <div className="flex -space-x-1">
            {product.availableColors.map((color, i) => (
              <div
                key={i}
                className="h-4 w-4 rounded-full border border-gray-200"
                style={{ backgroundColor: color.code }}
                title={color.name}
              />
            ))}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            {product.availableSizes.join(', ')}
          </div> */}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/shop/${product.productId}?slug=${product.slug}`)}
          className="w-full mt-3 bg-primary cursor-pointer text-white group-hover:bg-gray-50 transition-colors"
        >
          Quick View
        </Button>
      </div>
    </div>
  );

};