'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ExtrasForm } from '../new/components/ExtrasForm';
import { Extra } from '@/types/extras';
import { useExtra } from '@/hooks/useExtras';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Spinner } from '@/components/ui/Spinner';

export default function EditExtraPage() {
  const router = useRouter();
  const params = useParams();
  const extraId = params.extraId as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: extra, isLoading, error: fetchError } = useExtra(extraId);

  const handleSubmit = async (data: Extra) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.put(`/api/extras/${extraId}`, data);
      
      if (response.status === 200) {
        // Success! Redirect to admin dashboard
        router.push('/admin/dashboard');
      }
    } catch (err) {
      console.error('Error updating extra:', err);
      setError('Failed to update extra. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--primary-background)] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Spinner className="w-12 h-12" />
          <p className="text-[var(--muted-foreground)]">Se încarcă...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !extra) {
    return (
      <div className="min-h-screen bg-[var(--primary-background)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">
            Extra nu a fost găsit
          </h2>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Înapoi la Dashboard
          </Link>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Editează Extra</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Actualizează informațiile produsului extra
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
          initialData={extra}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
