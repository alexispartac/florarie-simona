'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface StoreContextProps {
  isClosed: boolean;
  closePeriod: string | null;
}

const StoreContext = createContext<StoreContextProps>({
  isClosed: false,
  closePeriod: null,
});

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [isClosed, setIsClosed] = useState(false);
  const [closePeriod, setClosePeriod] = useState<string | null>(null);

  useEffect(() => {
    const fetchClosePeriod = async () => {
      try {
        const response = await axios.get('/api/close-period');
        const closeDate = response.data.date;
        setClosePeriod(closeDate);

        const currentDate = new Date();
        if (currentDate < new Date(closeDate)) {
          setIsClosed(true);
        }
      } catch (error) {
        console.error('Error fetching close period:', error);
      }
    };

    fetchClosePeriod();
  }, []);

  return (
    <StoreContext.Provider value={{ isClosed, closePeriod }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);