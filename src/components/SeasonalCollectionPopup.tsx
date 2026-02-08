'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { SeasonalCollection } from '@/types/seasonalCollections';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SeasonalCollectionPopupProps {
  collection: SeasonalCollection;
  onClose: () => void;
}

export function SeasonalCollectionPopup({ collection, onClose }: SeasonalCollectionPopupProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleButtonClick = () => {
    router.push(collection.buttonLink);
    handleClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative bg-[var(--card)] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute cursor-pointer top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all hover:scale-110"
          aria-label="Close popup"
        >
          <X className="h-5 w-5 text-gray-800" />
        </button>

        {/* Image */}
        <div className="relative w-full h-64 sm:h-80 overflow-hidden">
          <Image
            src={collection.image}
            alt={collection.title}
            className="w-full h-full object-cover"
            width={1000}
            height={1000}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">
            {collection.title}
          </h2>
          <p className="text-lg text-[var(--muted-foreground)] mb-6 leading-relaxed">
            {collection.description}
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleButtonClick}
            >
              {collection.buttonText}
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              size="md"
            >
              Mai târziu
            </Button>
          </div>

          {/* Optional: Show end date */}
          {collection.endDate && (
            <p className="text-xs text-[var(--muted-foreground)] text-center mt-4">
              Ofertă valabilă până la {new Date(collection.endDate).toLocaleDateString('ro-RO', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
