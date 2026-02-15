'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { SeasonalCollection } from '@/types/seasonalCollections';
import { toast } from '@/components/hooks/use-toast';
import { SeasonalCollectionsSkeleton } from './SeasonalCollectionsSkeleton';

export function SeasonalCollectionsTab() {
  const [collections, setCollections] = useState<SeasonalCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await axios.get('/api/seasonal-collections');
      setCollections(response.data);
    } catch (error) {
      console.error('Error fetching seasonal collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (collectionId: string) => {
    if (!confirm('Ești sigur că vrei să ștergi această colecție?')) return;

    try {
      await axios.delete(`/api/seasonal-collections/${collectionId}`);
      fetchCollections();
      toast({
        title: '✓ Colecția ștearsă!',
        description: 'Colecția de sezon a fost ștearsă cu succes',
      });
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast({
        title: '✗ Ștergere eșuată',
        description: 'Eroare la ștergerea colecției. Încearcă din nou.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (collection: SeasonalCollection) => {
    try {
      await axios.put(`/api/seasonal-collections/${collection.collectionId}`, {
        ...collection,
        isActive: !collection.isActive,
      });
      fetchCollections();
      toast({
        title: '✓ Status actualizat!',
        description: `Colecția a fost ${!collection.isActive ? 'activată' : 'dezactivată'} cu succes`,
      });
    } catch (error) {
      console.error('Error toggling collection status:', error);
      toast({
        title: '✗ Actualizare eșuată',
        description: 'Eroare la actualizarea statusului. Încearcă din nou.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const isCurrentlyActive = (collection: SeasonalCollection) => {
    const now = new Date();
    const start = new Date(collection.startDate);
    const end = new Date(collection.endDate);
    return collection.isActive && now >= start && now <= end;
  };

  if (loading) {
    return (
      <div className="p-6">
        <SeasonalCollectionsSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Colecții de Sezon</h2>
        <Button onClick={() => router.push('/admin/seasonal-collections/new')}>
          + Adaugă Colecție
        </Button>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-12 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <p className="text-[var(--muted-foreground)] mb-4">Nu există colecții de sezon</p>
          <Button onClick={() => router.push('/admin/seasonal-collections/new')}>
            Creează Prima Colecție
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {collections.map((collection) => (
            <div
              key={collection.collectionId}
              className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Image */}
                <div className="w-full md:w-48 h-48 flex-shrink-0">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--foreground)] mb-1">
                        {collection.title}
                      </h3>
                      <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                        {collection.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCurrentlyActive(collection) && (
                        <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          🟢 Activ Acum
                        </span>
                      )}
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          collection.isActive
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {collection.isActive ? 'Activă' : 'Inactivă'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-[var(--muted-foreground)]">Prioritate</p>
                      <p className="font-medium text-[var(--foreground)]">{collection.priority}</p>
                    </div>
                    <div>
                      <p className="text-[var(--muted-foreground)]">Start</p>
                      <p className="font-medium text-[var(--foreground)]">
                        {formatDate(collection.startDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--muted-foreground)]">Sfârșit</p>
                      <p className="font-medium text-[var(--foreground)]">
                        {formatDate(collection.endDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--muted-foreground)]">Produse</p>
                      <p className="font-medium text-[var(--foreground)]">
                        {collection.products?.length || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-sm text-[var(--muted-foreground)]">Link:</span>
                    <code className="text-xs bg-[var(--secondary)] px-2 py-1 rounded">
                      {collection.buttonLink}
                    </code>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)]">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/admin/seasonal-collections/${collection.collectionId}`)}
                    >
                      ✏️ Editează
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleActive(collection)}
                    >
                      {collection.isActive ? '⏸️ Dezactivează' : '▶️ Activează'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(collection.collectionId)}
                    >
                      🗑️ Șterge
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
