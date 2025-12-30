import React from 'react';
import { ShopHeroProps } from './types';

export const ShopHero: React.FC<ShopHeroProps> = ({ title, subtitle }) => (
  <div className="bg-primary py-26 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl mb-6">
        {title}
      </h1>
      <p className="text-xl text-white max-w-3xl mx-auto">
        {subtitle}
      </p>
    </div>
  </div>
);
