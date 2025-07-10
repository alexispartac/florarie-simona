'use client';

import React from 'react';
import { useStore } from './../components/context/StoreContext';

const GlobalMessage = () => {
  const { isClosed, closePeriod } = useStore();

  if (!isClosed || !closePeriod) return null;

  return (
    <div className='flex flex-col items-center justify-center bg-white text-white fixed top-0 left-0 w-full h-full z-50'>
      <div className="fixed top-0 left-0 w-full bg-[#b756a5] text-white text-center py-2 z-50">
        Magazinul este închis până la data de { closePeriod }.
      </div>
      <div className="flex flex-col items-center justify-center mt-10 text-[#b756a5]">
        <h1 className="text-2xl font-bold mb-4">Magazinul este închis</h1>
        <p className="text-lg">Vă mulțumim pentru înțelegere!</p>
      </div>
    </div>
  );
};

export default GlobalMessage;