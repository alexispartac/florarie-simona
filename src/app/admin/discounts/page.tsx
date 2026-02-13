'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Discount } from '@/types/discounts';
import { FiPlus, FiEdit2, FiTrash2, FiTag, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import Link from 'next/link';

export default function DiscountsAdminPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/discounts');
      setDiscounts(response.data.discounts || []);
    } catch (err) {
      console.error('Error fetching discounts:', err);
      setError('Failed to load discounts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (discountId: string) => {
    if (!confirm('Are you sure you want to delete this discount code?')) {
      return;
    }

    setDeletingId(discountId);
    try {
      await axios.delete(`/api/discounts/${discountId}`);
      setDiscounts(discounts.filter((d) => d.discountId !== discountId));
    } catch (err) {
      console.error('Error deleting discount:', err);
      alert('Failed to delete discount code');
    } finally {
      setDeletingId(null);
    }
  };

  const isExpired = (expiresAt: Date) => {
    return new Date(expiresAt) < new Date();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-12 h-12" />
          <p className="text-[var(--muted-foreground)]">Loading discounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        {/* link catre dashboard */}
        <Link href="/admin/dashboard" className="text-[var(--primary)] hover:text-[var(--hover-primary)]">
          <FiArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] flex items-center gap-2">
            <FiTag className="h-8 w-8" />
            Discount Codes
          </h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Manage discount codes for your store
          </p>
        </div>
        <Button
          onClick={() => router.push('/admin/discounts/create')}
        >
          <FiPlus className="h-5 w-5" />
          Create Discount
        </Button>
      </div>

      {error && (
        <div className="mb-6 bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 rounded-lg p-4 flex items-center gap-2">
          <FiAlertCircle className="h-5 w-5 text-[var(--destructive)]" />
          <p className="text-[var(--destructive)]">{error}</p>
        </div>
      )}

      {discounts.length === 0 ? (
        <div className="text-center py-12 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <FiTag className="h-16 w-16 mx-auto text-[var(--muted-foreground)] mb-4" />
          <h3 className="text-xl font-medium text-[var(--foreground)] mb-2">
            No discount codes yet
          </h3>
          <p className="text-[var(--muted-foreground)] mb-6">
            Create your first discount code to get started
          </p>
          <Button onClick={() => router.push('/admin/discounts/create')}>
            <FiPlus className="h-5 w-5 mr-2" />
            Create Discount
          </Button>
        </div>
      ) : (
        <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--accent)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                    Uses
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {discounts.map((discount) => {
                  const expired = isExpired(discount.expiresAt);
                  return (
                    <tr key={discount.discountId} className="hover:bg-[var(--accent)]/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FiTag className="h-4 w-4 text-[var(--primary)]" />
                          <span className="font-mono font-semibold text-[var(--foreground)]">
                            {discount.code}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[var(--foreground)] font-medium">
                          {(discount.amount / 100).toFixed(2)} RON
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={expired ? 'text-[var(--destructive)]' : 'text-[var(--foreground)]'}>
                          {formatDate(discount.expiresAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            !discount.isActive
                              ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                              : expired
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          }`}
                        >
                          {!discount.isActive ? 'Inactive' : expired ? 'Expired' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[var(--muted-foreground)]">
                        {discount.usageCount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push(`/admin/discounts/${discount.discountId}/edit`)}
                            className="text-[var(--primary)] hover:text-[var(--hover-primary)] p-2 rounded-md hover:bg-[var(--accent)] transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(discount.discountId)}
                            disabled={deletingId === discount.discountId}
                            className="text-[var(--destructive)] hover:text-[var(--destructive)]/80 p-2 rounded-md hover:bg-[var(--destructive)]/10 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === discount.discountId ? (
                              <Spinner className="h-4 w-4" />
                            ) : (
                              <FiTrash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
