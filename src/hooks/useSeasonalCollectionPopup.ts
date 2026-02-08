'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { SeasonalCollection } from '@/types/seasonalCollections';

const STORAGE_KEY = 'seasonal-popup-shown';
const POPUP_COOLDOWN = 5 * 60 * 1000; // 1 minute in milliseconds

export function useSeasonalCollectionPopup() {
  const [collection, setCollection] = useState<SeasonalCollection | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const checkAndShowPopup = async () => {
    // Check if popup was shown recently
    const lastShown = localStorage.getItem(STORAGE_KEY);
    if (lastShown) {
      const timeSinceLastShown = Date.now() - parseInt(lastShown);
      if (timeSinceLastShown < POPUP_COOLDOWN) {
        return; // Don't show popup if it was shown recently
      }
    }

    try {
      // Fetch active collections
      const response = await axios.get('/api/seasonal-collections?isActive=true');
      const collections: SeasonalCollection[] = response.data;

      if (collections.length === 0) return;

      // Filter collections that are currently active (within date range)
      const now = new Date();
      const activeCollections = collections.filter(col => {
        const startDate = new Date(col.startDate);
        const endDate = new Date(col.endDate);
        return now >= startDate && now <= endDate && col.isActive;
      });

      if (activeCollections.length === 0) return;

      // Sort by priority (higher first) and show the first one
      const sortedCollections = activeCollections.sort((a, b) => b.priority - a.priority);
      const collectionToShow = sortedCollections[0];

      // Small delay before showing popup (better UX)
      setTimeout(() => {
        setCollection(collectionToShow);
        setShowPopup(true);
      }, 2000); // Show after 2 seconds

    } catch (error) {
      console.error('Error fetching seasonal collections:', error);
    }
  };

  useEffect(() => {
    checkAndShowPopup();
  }, []);


  const closePopup = () => {
    setShowPopup(false);
    // Mark popup as shown
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  return {
    collection,
    showPopup,
    closePopup,
  };
}
