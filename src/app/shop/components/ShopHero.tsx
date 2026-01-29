import React from 'react';
import { ShopHeroProps } from './types';

export const ShopHero: React.FC<ShopHeroProps> = ({ title, subtitle }) => (
  <div className="py-26 px-4 sm:px-6 lg:px-8"
    style={{
      backgroundImage: 'url(https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=1200&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
  >
    <div className="max-w-7xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-gray-800 sm:text-5xl lg:text-6xl mb-6">
        {title}
      </h1>
      <p className="text-xl text-gray-800 max-w-3xl mx-auto">
        {subtitle}
      </p>
    </div>
  </div>
);
