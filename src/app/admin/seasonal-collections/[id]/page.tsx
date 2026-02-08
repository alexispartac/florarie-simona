'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { SeasonalCollectionForm } from '../components/SeasonalCollectionForm';
import { SeasonalCollection } from '@/types/seasonalCollections';
import { Spinner } from '@/components/ui/Spinner';

export default function EditSeasonalCollectionPage() {
  const router = useRouter();
  const params = useParams();
  const collectionId = params.id as string;
  const [collection, setCollection] = useState<SeasonalCollection | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await axios.get(`/api/seasonal-collections/${collectionId}`);
        setCollection(response.data);
      } catch (error) {
        console.error('Error fetching seasonal collection:', error);
        alert('Eroare la încărcarea colecției');
        router.push('/admin/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    if (collectionId) {
      fetchCollection();
    }
  }, [collectionId, router]);

  const handleSubmit = async (data: SeasonalCollection) => {
    try {
      setIsSubmitting(true);
      await axios.put(`/api/seasonal-collections/${collectionId}`, data);
      alert('Colecția a fost actualizată cu succes!');
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Error updating seasonal collection:', error);
      alert('Eroare la actualizarea colecției. Vă rugăm încercați din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-12 h-12" />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--muted-foreground)]">Colecția nu a fost găsită</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Editează Colecție de Sezon</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Modifică detaliile colecției {collection.title}
          </p>
        </div>

        <SeasonalCollectionForm
          initialData={collection}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
