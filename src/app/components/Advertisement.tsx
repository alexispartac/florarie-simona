// src/app/components/Advertisement/Advertisement.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useUser } from '@/app/components/context/ContextUser';

type AdvertisementProps = {
  imageSrc: string;
  buttonText: string;
  buttonLink: string;
};

export default function Advertisement({
  imageSrc,
  buttonText,
  buttonLink,
}: AdvertisementProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { advertisement, setAdvertisement } = useUser();

  const handleClose = () => {
    setTimeout(() => {
      setIsVisible(false);
      setAdvertisement({ isVisible: false });
    }, 1000);
  };

  if (!isVisible || advertisement.isVisible === false) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black bg-opacity-90">
      <div className="relative h-screen w-full">
        <Image
          src={imageSrc}
          alt="Advertisement"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 transform">
          <Link
            href={buttonLink}
            className="text-sm md:text-lg rounded-full bg-white px-4 py-3 text-lg font-semibold text-black transition hover:bg-gray-200"
            onClick={handleClose}
          >
            {buttonText}
          </Link>
        </div>
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full bg-white p-2 text-black hover:bg-gray-200"
          aria-label="Close advertisement"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}