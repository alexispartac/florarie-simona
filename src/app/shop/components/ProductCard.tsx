import React from 'react';
import { Heart, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProductInCatalog } from '@/types/products';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';

// Helper function to check if URL is a video
const isVideoUrl = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some(ext => lowerUrl.includes(ext)) || lowerUrl.includes('/video/');
};

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
    <div 
      className="group bg-[var(--card)] rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[var(--border)]"
    >
      <div className="aspect-square relative overflow-hidden">
        {isVideoUrl(product.images[0] || '') ? (
          <div className="relative w-full h-full bg-[var(--muted)]">
            <video
              src={product.images[0]}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <svg className="w-16 h-16 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>
        ) : (
          <Image 
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            width={400}
            height={400}
          />
        )}
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <Badge variant="success" className="bg-green-500 text-white text-xs px-2 py-1">
              Nou
            </Badge>
          )}
          {product.isFeatured && (
            <Badge variant="info" className="bg-purple-500 text-white text-xs px-2 py-1">
              Popular
            </Badge>
          )}
          {product.flowerDetails?.sameDayDelivery && (
            <Badge variant="warning" className="bg-orange-500 text-white text-xs px-2 py-1 flex items-center gap-1">
              <Truck className="h-3 w-3" />
              Azi
            </Badge>
          )}
        </div>
        
        {/* Wishlist button */}
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.productId, product.name, product.price, product.images);
            }}
            className="p-2 bg-[var(--card)]/90 rounded-full shadow-sm hover:bg-[var(--card)] hover:scale-110 transition-all duration-200"
          >
            <Heart className="h-5 w-5 text-[var(--primary)] hover:fill-[var(--primary)] transition-colors" />
          </button>
        </div>
      </div>
            
      {/* Product details */}
      <div 
        className="p-4 cursor-pointer"
        onClick={() => router.push(`/shop/${product.productId}?slug=${product.slug}`)}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-[var(--foreground)] line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">{product.category}</p>
          </div>
        </div>
        
        {/* Colors */}
        {product.flowerDetails?.colors && product.flowerDetails.colors.length > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {product.flowerDetails.colors.slice(0, 3).map((color, i) => (
              <div
                key={i}
                className="h-4 w-4 rounded-full border-2 border-[var(--border)]"
                style={{ 
                  backgroundColor: 
                    color === 'rosu' ? '#ef4444' :
                    color === 'roz' ? '#ec4899' :
                    color === 'alb' ? '#f9fafb' :
                    color === 'galben' ? '#fbbf24' :
                    color === 'mov' ? '#a855f7' :
                    color === 'portocaliu' ? '#f97316' :
                    color === 'albastru' ? '#3b82f6' :
                    color === 'mixt' ? '#fce7f3' :
                    color === 'pastel' ? '#10b981' :
                    color === 'negru' ? '#10b981' :
                    '#10b981'
                }}
                title={color}
              />
            ))}
            {product.flowerDetails.colors.length > 3 && (
              <span className="text-xs text-[var(--muted-foreground)]">+{product.flowerDetails.colors.length - 3}</span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-[var(--foreground)]">
              {(product.price / 100).toFixed(0)} RON
            </span>
          </div>
          
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="text-sm font-medium text-[var(--foreground)]">{product.rating}</span>
              <span className="text-xs text-[var(--muted-foreground)]">({product.reviewCount + 1})</span>
            </div>
          )}
        </div>
        
        {!product.available && (
          <div className="mt-3">
            <Badge variant="destructive" className="w-full text-center">
              Indisponibil
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};