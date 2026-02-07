import React from 'react';
import { ShoppingCart, Package } from 'lucide-react';
import { ExtraInCatalog } from '@/types/extras';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/translations';

export interface ExtraCardProps {
  extra: ExtraInCatalog;
  onAddToCart: () => void;
}

export const ExtraCard: React.FC<ExtraCardProps> = ({
  extra,
  onAddToCart,
}) => {
  const { language } = useLanguage();
  const t = useTranslation(language); 

  return (
    <div 
      className="group bg-[var(--card)] rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[var(--border)] hover:border-[var(--primary)]/30"
    >
      {/* Image Container */}
      <div className="aspect-square relative overflow-hidden bg-[var(--accent)]">
        <Image 
          src={extra.images[0] || '/placeholder-product.jpg'}
          alt={extra.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          width={300}
          height={300}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {extra.isNew && (
            <Badge variant="success" className="bg-green-500 text-white text-xs px-2 py-0.5 font-semibold shadow-md">
              Nou
            </Badge>
          )}
          {extra.isFeatured && (
            <Badge variant="info" className="bg-[var(--primary)]/20 text-[var(--primary)] text-xs px-2 py-0.5 font-semibold shadow-md">
              Popular
            </Badge>
          )}
        </div>
        
        {/* Add to Cart Button - Floating */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-95">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="flex cursor-pointer items-center gap-1.5 px-3 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md shadow-lg hover:bg-[var(--primary)]/90 transition-all duration-200 font-medium text-sm"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span className="text-xs">Adaugă</span>
          </button>
        </div>
      </div>
            
      {/* Product Details */}
      <div className="p-3">
        {/* Category */}
        <div className="mb-1">
          <span className="text-xs text-[var(--muted-foreground)] font-medium uppercase tracking-wide">
            {extra.category}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-sm text-[var(--foreground)] mb-2 line-clamp-2 group-hover:text-[var(--primary)] transition-colors leading-snug min-h-[2.5rem]">
          {extra.name}
        </h3>
        
        {/* Price and Size Row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-[var(--primary)]">
              {(extra.price / 100).toFixed(0)}
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">RON</span>
          </div>
          
          {extra.size && (
            <span className="text-xs text-[var(--muted-foreground)] bg-[var(--accent)] px-2 py-0.5 rounded-full font-medium capitalize">
              {t(`extras.size.${extra.size}`)}
            </span>
          )}
        </div>

        {/* Stock Indicator */}
        {extra.stock !== undefined && (
          <div className="flex items-center gap-1">
            <Package className="h-3 w-3 text-[var(--muted-foreground)]" />
            {extra.stock > 0 ? (
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                În stoc: {extra.stock}
              </span>
            ) : (
              <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                Stoc epuizat
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
