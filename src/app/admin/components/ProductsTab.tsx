// Create /src/app/admin/components/ProductsTab.tsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useProductsAdmin } from '@/hooks/useProducts';
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon, MessageSquare, Link2, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import ProductReviewsModal from './ProductReviewsModal';
import { toast } from '@/components/hooks/use-toast';
import axios from 'axios';
import { AdminTableSkeleton } from './AdminTableSkeleton';

const ITEMS_PER_PAGE = 10;

export default function ProductsTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reviewsModalOpen, setReviewsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string } | null>(null);
  const [shareMenuOpen, setShareMenuOpen] = useState<string | null>(null);

  // Debounce search query - wait 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, error, refetch } = useProductsAdmin({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearchQuery,
  });

  const products = data?.data || [];
  const { total = 0 } = data?.pagination || {};
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteClick = (productId: string) => {
    setProductId(productId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productId) return;

    setIsDeleting(true);
    try {
      const response = await axios.delete(`/api/products/${productId}`);

      console.log('Delete response:', response.data);

      if (response.status !== 200) {
        throw new Error('Failed to delete product');
      }
      // Refresh the products list
      await refetch();
      setIsDeleteModalOpen(false);
      
      toast({
        title: '✓ Product deleted!',
        description: 'Product has been successfully deleted',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: '✗ Delete failed',
        description: 'Failed to delete product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenReviews = (productId: string, productName: string) => {
    setSelectedProduct({ id: productId, name: productName });
    setReviewsModalOpen(true);
  };

  const handleCloseReviews = () => {
    setReviewsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCopyProductLink = async (productId: string, slug: string) => {
    const productUrl = `${window.location.origin}/shop/${productId}?slug=${slug}`;
    
    try {
      await navigator.clipboard.writeText(productUrl);
      toast({
        title: '✓ Link copied!',
        description: 'Product link has been copied to clipboard',
      });
    } catch (err) {
      console.error('Failed to copy link:', err);
      toast({
        title: '✗ Failed to copy',
        description: 'Could not copy link to clipboard',
        variant: 'destructive',
      });
    }
  };

  const handleShare = (productId: string, productName: string, slug: string) => {
    const productUrl = `${window.location.origin}/shop/${productId}?slug=${slug}`;
    const text = `Check out ${productName} on Buchetul Simonei`;

    if (navigator.share) {
      // Use native share API if available (mobile)
      navigator.share({
        title: productName,
        text: text,
        url: productUrl,
      }).catch((error) => {
        console.log('Error sharing:', error);
      });
    } else {
      // Toggle share menu for desktop
      setShareMenuOpen(shareMenuOpen === productId ? null : productId);
    }
  };

  const shareToSocial = (platform: string, productId: string, productName: string, slug: string) => {
    const productUrl = `${window.location.origin}/shop/${productId}?slug=${slug}`;
    const text = `Check out ${productName} on Buchetul Simonei`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + productUrl)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(productName)}&body=${encodeURIComponent(text + '\n\n' + productUrl)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=600');
      setShareMenuOpen(null);
      toast({
        title: '✓ Shared!',
        description: `Product shared to ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
      });
    }
  };

  if (isLoading) {
    return <AdminTableSkeleton rows={10} withImage={true} withSearch={true} withAddButton={true} columns={5} />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-[var(--destructive)] mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-[var(--destructive)]">Error loading products. Please try again later.</p>
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
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete Product"
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setProductId(null);
        }}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-lg font-medium text-[var(--foreground)]">Products</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-4 w-4 text-[var(--muted-foreground)]" />
              </div>
              <Input
                type="text"
                fullWidth
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearch}
                className="block w-full pl-4 pr-3 py-2 border border-[var(--border)] rounded-md leading-5 bg-[var(--card)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm"
              />
            </div>
          {/* <button
            onClick={handleAddStockToAll}
            disabled={isAddingStock}
            className="inline-flex items-center px-4 py-2 border border-orange-600 text-sm font-medium cursor-pointer rounded-md shadow-sm text-orange-600 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingStock ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-orange-600 mr-2"></div>
                Adding Stock...
              </>
            ) : (
              <>
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Add Stock to All
              </>
            )}
          </button> */}
          <button
            onClick={() => router.push('/admin/products/new')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium cursor-pointer rounded-md shadow-sm text-[var(--primary-foreground)] bg-[var(--primary)] hover:bg-[var(--hover-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-[var(--card)] shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--border)]">
            <thead className="bg-[var(--secondary)]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                  Reviews
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--card)] divide-y divide-[var(--border)]">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.productId} className="hover:bg-[var(--secondary)]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {product.images?.[0] ? (
                            <Image
                              className="h-10 w-10 rounded-md object-cover"
                              src={product.images[0]}
                              alt={product.name}
                              width={40}
                              height={40}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-[var(--muted)] flex items-center justify-center">
                              <span className="text-[var(--muted-foreground)] text-xs">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-[var(--foreground)]">{product.name}</div>
                          <div className="text-sm text-[var(--destructive)]">{product.productId}</div>
                          <div className="text-sm text-[var(--muted-foreground)]">{product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      ${product.price ? (product.price / 100).toFixed(2) : '0.00'} USD
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-[var(--muted-foreground)]">
                      {product.stock || 0} in stock
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleOpenReviews(product.productId, product.name)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-[var(--primary)] hover:bg-[var(--secondary)] rounded-md transition-colors cursor-pointer"
                        title="Manage reviews"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>{product.reviewCount || 0}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleCopyProductLink(product.productId, product.slug)}
                          className="text-[var(--primary)] hover:text-[var(--foreground)] cursor-pointer"
                          title="Copy product link"
                        >
                          <Link2 className="h-4 w-4" />
                        </button>
                        
                        {/* Share button with dropdown */}
                        <div className="relative mt-2">
                          <button
                            onClick={() => handleShare(product.productId, product.name, product.slug)}
                            className="text-[var(--primary)] hover:text-[var(--foreground)] cursor-pointer"
                            title="Share product"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                          
                          {/* Share menu dropdown */}
                          {shareMenuOpen === product.productId && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setShareMenuOpen(null)}
                              />
                              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[var(--card)] border border-[var(--border)] z-20">
                                <div className="py-1" role="menu">
                                  <button
                                    onClick={() => shareToSocial('facebook', product.productId, product.name, product.slug)}
                                    className="w-full text-left px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--secondary)] flex items-center gap-2 cursor-pointer"
                                  >
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                    Facebook
                                  </button>
                                  <button
                                    onClick={() => shareToSocial('twitter', product.productId, product.name, product.slug)}
                                    className="w-full text-left px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--secondary)] flex items-center gap-2 cursor-pointer"
                                  >
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                    Twitter
                                  </button>
                                  <button
                                    onClick={() => shareToSocial('whatsapp', product.productId, product.name, product.slug)}
                                    className="w-full text-left px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--secondary)] flex items-center gap-2 cursor-pointer"
                                  >
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                    </svg>
                                    WhatsApp
                                  </button>
                                  <button
                                    onClick={() => shareToSocial('telegram', product.productId, product.name, product.slug)}
                                    className="w-full text-left px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--secondary)] flex items-center gap-2 cursor-pointer"
                                  >
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                    </svg>
                                    Telegram
                                  </button>
                                  <button
                                    onClick={() => shareToSocial('email', product.productId, product.name, product.slug)}
                                    className="w-full text-left px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--secondary)] flex items-center gap-2 cursor-pointer"
                                  >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Email
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        
                        <button 
                          onClick={() => router.push(`/admin/products/${product.productId}`)}
                          className="text-[var(--primary)] hover:text-[var(--foreground)] cursor-pointer">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product.productId)}
                          className="text-[var(--destructive)] hover:text-[var(--destructive)]/90 cursor-pointer"
                          disabled={isDeleting}
                          title="Delete product"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-[var(--muted-foreground)]">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-[var(--card)] px-4 py-3 flex items-center justify-between border-t border-[var(--border)] sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-[var(--border)] text-sm font-medium rounded-md text-[var(--foreground)] bg-[var(--card)] hover:bg-[var(--secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-[var(--border)] text-sm font-medium rounded-md text-[var(--foreground)] bg-[var(--card)] hover:bg-[var(--secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-[var(--foreground)]">
                Showing <span className="font-medium">{startItem + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(startItem + ITEMS_PER_PAGE, total)}
                </span>{' '}
                of <span className="font-medium">{total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-[var(--border)] bg-[var(--card)] text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
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
                          ? 'z-10 bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)]'
                          : 'bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-[var(--border)] bg-[var(--card)] text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Modal */}
      {selectedProduct && (
        <ProductReviewsModal
          isOpen={reviewsModalOpen}
          onClose={handleCloseReviews}
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          onReviewsChange={() => refetch()}
        />
      )}
    </div>
  );
}