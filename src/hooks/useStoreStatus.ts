import { useState, useEffect } from 'react';

interface StoreStatus {
  isOpen: boolean;
  closureMessage?: string;
  scheduledOpenTime?: Date;
}

export function useStoreStatus() {
  const [status, setStatus] = useState<StoreStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStoreStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/store-status');
        
        if (!response.ok) {
          throw new Error('Failed to check store status');
        }
        
        const data = await response.json();
        setStatus(data);
        setError(null);
      } catch (err) {
        console.error('Error checking store status:', err);
        setError(err instanceof Error ? err.message : 'Failed to check store status');
        // Default to open on error to avoid blocking customers
        setStatus({ isOpen: true });
      } finally {
        setLoading(false);
      }
    };

    checkStoreStatus();
  }, []);

  return { status, loading, error };
}
