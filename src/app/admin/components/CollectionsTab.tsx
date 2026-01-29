'use client';

import { useState } from 'react';
import { useCollections, useCreateCollection, useUpdateCollection, useDeleteCollection } from '@/hooks/useCollections';
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Collection } from '@/types/collections';
import { Input } from '@/components/ui';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import CollectionModal from './CollectionModal';

const ITEMS_PER_PAGE = 10;

export default function CollectionsTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null);

  // Hooks
  const { data, isLoading, error } = useCollections({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchQuery,
  });

  const createMutation = useCreateCollection();
  const updateMutation = useUpdateCollection();
  const deleteMutation = useDeleteCollection();

  const collections = data?.data || [];
  const { total = 0 } = data?.pagination || {};
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleAddCollection = () => {
    setSelectedCollection(null);
    setIsCollectionModalOpen(true);
  };

  const handleEditCollection = (collection: Collection) => {
    setSelectedCollection(collection);
    setIsCollectionModalOpen(true);
  };

  const handleDeleteClick = (collectionId: string) => {
    setCollectionToDelete(collectionId);
    setIsDeleteModalOpen(true);
  };

  const handleSaveCollection = async (data: Partial<Collection>) => {
    try {
      if (selectedCollection) {
        // Update existing collection
        await updateMutation.mutateAsync({
          collectionId: selectedCollection.collectionId,
          data,
        });
      } else {
        // Create new collection
        await createMutation.mutateAsync(data);
      }
      setIsCollectionModalOpen(false);
      setSelectedCollection(null);
    } catch (error) {
      console.error('Error saving collection:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!collectionToDelete) return;

    try {
      await deleteMutation.mutateAsync(collectionToDelete);
      setIsDeleteModalOpen(false);
      setCollectionToDelete(null);
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-red-400 mr-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-red-700">Error loading collections. Please try again later.</p>
          </div>
        </div>
        </div>
    );
}

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE;

  return (
    <div className="p-6">
      {/* Modals */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Collection"
        message="Are you sure you want to delete this collection? This action cannot be undone."
        confirmText="Delete Collection"
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setCollectionToDelete(null);
        }}
      />

      <CollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => {
          setIsCollectionModalOpen(false);
          setSelectedCollection(null);
        }}
        onSave={handleSaveCollection}
        collection={selectedCollection}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-lg font-medium text-gray-900">Collections</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              fullWidth
              placeholder="Search collections..."
              value={searchQuery}
              onChange={handleSearch}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddCollection}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium cursor-pointer rounded-md shadow-sm text-white bg-primary hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Collection
          </button>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {collections.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {collections.map((collection) => (
                <div
                  key={collection.collectionId}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100">
                    {collection.image ? (
                      <Image
                        src={collection.image}
                        alt={collection.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                    {collection.featured && (
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {collection.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {collection.description}
                    </p>
                    <p className="text-xs text-gray-400 mb-4">
                      {collection.products?.length || 0} products
                    </p>

                    {/* Actions */}
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditCollection(collection)}
                        className="p-2 text-primary-600 hover:text-primary-900 cursor-pointer"
                        title="Edit collection"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(collection.collectionId)}
                        className="p-2 text-red-600 hover:text-red-900 cursor-pointer"
                        title="Delete collection"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startItem + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(startItem + ITEMS_PER_PAGE, total)}
                    </span>{' '}
                    of <span className="font-medium">{total}</span> results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No collections</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new collection.</p>
            <div className="mt-6">
              <button
                onClick={handleAddCollection}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Collection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
