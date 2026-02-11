// Create /src/app/admin/components/ExtrasTab.tsx
'use client';

import { useState, useCallback } from 'react';
import { useExtrasAdmin } from '@/hooks/useExtras';
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { toast } from '@/components/hooks/use-toast';
import axios from 'axios';

const ITEMS_PER_PAGE = 10;

export default function ExtrasTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [extraId, setExtraId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading, error, refetch } = useExtrasAdmin({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchQuery,
  });

  const extras = data?.data || [];
  const { total = 0 } = data?.pagination || {};
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteClick = (extraId: string) => {
    setExtraId(extraId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!extraId) return;

    setIsDeleting(true);
    try {
      const response = await axios.delete(`/api/extras/${extraId}`);

      console.log('Delete response:', response.data);

      if (response.status !== 200) {
        throw new Error('Failed to delete extra');
      }
      // Refresh the extras list
      await refetch();
      setIsDeleteModalOpen(false);
      
      toast({
        title: '✓ Extra deleted!',
        description: 'Extra item has been successfully deleted',
      });
    } catch (error) {
      console.error('Error deleting extra:', error);
      toast({
        title: '✗ Delete failed',
        description: 'Failed to delete extra. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-[var(--destructive)] mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-[var(--destructive)]">Error loading extras. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE;

  return (
    <div className="p-6">
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Extra"
        message="Are you sure you want to delete this extra? This action cannot be undone."
        confirmText="Delete Extra"
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setExtraId(null);
        }}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-lg font-medium text-[var(--foreground)]">Extras</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-4 w-4 text-[var(--muted-foreground)]" />
              </div>
              <Input
                type="text"
                placeholder="Search extras..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 w-full sm:w-64 bg-[var(--card)]"
              />
            </div>
          </form>
          <button
            onClick={() => router.push('/admin/extras/new')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <PlusIcon className="h-5 w-5" />
            Add Extra
          </button>
        </div>
      </div>

      {/* Extras Table */}
      <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--accent)] border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                  Image
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {extras.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[var(--muted-foreground)]">
                    No extras found. Create your first extra item!
                  </td>
                </tr>
              ) : (
                extras.map((extra) => (
                  <tr key={extra.extraId} className="hover:bg-[var(--accent)] transition-colors">
                    <td className="px-4 py-4">
                      <Image
                        src={extra.images?.[0] || '/placeholder.png'}
                        alt={extra.name}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-[var(--foreground)]">{extra.name}</div>
                      <div className="text-sm text-[var(--muted-foreground)] capitalize">
                        {extra.size || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-4 capitalize text-[var(--foreground)]">
                      {extra.category}
                    </td>
                    <td className="px-4 py-4 text-[var(--foreground)]">
                      {(extra.price / 100).toFixed(2)} RON
                    </td>
                    <td className="px-4 py-4 text-[var(--foreground)]">
                      {extra.stock || 0}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          extra.available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {extra.available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => router.push(`/admin/extras/${extra.extraId}`)}
                          className="p-2 hover:bg-[var(--accent)] rounded-lg transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4 text-[var(--primary)]" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(extra.extraId)}
                          className="p-2 hover:bg-[var(--accent)] rounded-lg transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-[var(--muted-foreground)]">
            Showing {startItem + 1} to {Math.min(startItem + ITEMS_PER_PAGE, total)} of {total} extras
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                      : 'border border-[var(--border)] hover:bg-[var(--accent)]'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
