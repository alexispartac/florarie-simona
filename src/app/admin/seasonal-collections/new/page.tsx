'use client';

import { useRouter } from 'next/navigation';
import axios from 'axios';
import { SeasonalCollectionForm } from '../components/SeasonalCollectionForm';
import { useState } from 'react';
import { SeasonalCollection } from '@/types/seasonalCollections';

export default function NewSeasonalCollectionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: SeasonalCollection) => {
    try {
      setIsSubmitting(true);
      await axios.post('/api/seasonal-collections', data);
      alert('Colecția a fost creată cu succes!');
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Error creating seasonal collection:', error);
      alert('Eroare la crearea colecției. Vă rugăm încercați din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Creează Colecție de Sezon</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Adaugă o nouă colecție care va fi afișată în pop-up pe pagina principală
          </p>
        </div>

        <SeasonalCollectionForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
