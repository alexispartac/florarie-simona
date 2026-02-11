'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExtrasForm } from './components/ExtrasForm';
import { Extra } from '@/types/extras';
import { toast } from '@/components/hooks/use-toast';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewExtraPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: Extra) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post('/api/extras', data);
      
      if (response.status === 201) {
        toast({
          title: '✓ Extra created!',
          description: 'Extra item has been successfully created',
        });
        // Success! Redirect to admin dashboard
        router.push('/admin/dashboard');
      }
    } catch (err) {
      console.error('Error creating extra:', err);
      setError('Failed to create extra. Please try again.');
      toast({
        title: '✗ Creation failed',
        description: 'Failed to create extra. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Înapoi la Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Adaugă Extra Nou</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Completează informațiile de mai jos pentru a crea un produs extra nou
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Form */}
        <ExtrasForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
