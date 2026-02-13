'use client';

import { useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { useShop } from '@/context/ShopContext';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import { useProduct, useSubmitReview } from '@/hooks/useProducts';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { RelatedProducts } from '../components/RelatedProducts';
import { ProductReviews } from '../components/ProductReviews';
import { ProductDetails } from '../components/ProductDetails';
import { AddReview } from '../components/AddReview';
import { ProductReview } from '@/types/products';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/translations';
import { ProductDetailSkeleton } from './components/ProductDetailSkeleton';

// Helper function to check if URL is a video
const isVideoUrl = (url: string): boolean => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    const lowerUrl = url.toLowerCase();
    return videoExtensions.some(ext => lowerUrl.includes(ext)) || lowerUrl.includes('/video/');
};

export default function ProductPage() {
    const [quantity, setQuantity] = useState<number>(1);
    const [currentImage, setCurrentImage] = useState<number>(0);
    const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
    const [isAddingToWishlist, setIsAddingToWishlist] = useState<boolean>(false);
    const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
    const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useShop();
    const { language } = useLanguage();
    const t = useTranslation(language);
    
    const params = useParams();
    const id = params.id as string;

    // Submit review
    const { mutateAsync: submitReviewAsync } = useSubmitReview();
    
    // Fetch product from API
    const { data: product, isLoading, isError, refetch } = useProduct(id);

    const router = useRouter();

    if (isLoading) {
        return <ProductDetailSkeleton />;
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
                <div className="animate-pulse flex flex-col items-center space-y-4">
                    <p className="text-[var(--muted-foreground)]">{t('product.error')}</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
                <div className="animate-pulse flex flex-col items-center space-y-4">
                    <p className="text-[var(--muted-foreground)]">{t('product.notFound')}</p>
                </div>
            </div>
        )
    }

    const handleAddToCart = () => {
        if (!product || !product.available) {
            return;
        }

        try {
            setIsAddingToCart(true);
            addToCart({
                productId: product.productId,
                name: product.name,
                price: product.price,
                quantity: quantity,
                image: product.images[0],
                stock: product.stock, // Add stock information to cart item
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setIsAddingToCart(false);
        }
    };
    
    const handleWishlistToggle = () => {
        if (!product) return;
        
        try {
            setIsAddingToWishlist(true);
            
            if (isInWishlist(product.productId)) {
                removeFromWishlist(product.productId);
            } else {
                addToWishlist({
                    productId: product.productId,
                    name: product.name,
                    price: product.price,
                    images: product.images,
                });
            }
        } catch (error) {
            console.error('Error updating wishlist:', error);
        } finally {
            setIsAddingToWishlist(false);
        }
    };

    const handleReviewSubmit = async (review: ProductReview): Promise<{ status: number } | undefined> => {
        if (!product) return undefined;
        
        setIsSubmittingReview(true);
        try {
            const response = await submitReviewAsync(review);
            
            if (response && response.success) {
                // Refresh product data to show the new review
                await refetch();
                setIsSubmittingReview(false);
                return { status: 200 };
            } else {
                setIsSubmittingReview(false);
                return { status: 400 };
            }
        } catch (error) {
            console.error('Failed to submit review:', error);
            setIsSubmittingReview(false);
            return { status: 500 };
        }
    };

    return (
        <div className="container mx-auto px-4 py-24 bg-[var(--primary-background)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images */}
                <div>
                    <div className="mb-4 bg-[var(--muted)] rounded-lg overflow-hidden">
                        {isVideoUrl(product.images[currentImage] || '') ? (
                            <video
                                src={product.images[currentImage]}
                                controls
                                className="w-full h-auto object-cover"
                                style={{ maxHeight: '600px' }}
                            >
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <Image
                                src={product.images[currentImage] || '/placeholder-product.jpg'}
                                alt={product.name}
                                width={600}
                                height={800}
                                className="w-full h-auto object-cover"
                                priority
                            />
                        )}
                    </div>

                    {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2 mt-2">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImage(index)}
                                    className={`border-2 rounded overflow-hidden ${currentImage === index ? 'border-[var(--primary)]' : 'border-transparent'}`}
                                >
                                    {isVideoUrl(image) ? (
                                        <div className="relative w-full h-24 bg-[var(--muted)] flex items-center justify-center">
                                            <svg className="w-8 h-8 text-[var(--muted-foreground)]" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                            </svg>
                                            <span className="absolute bottom-1 right-1 text-xs bg-black/70 text-white px-1 rounded">Video</span>
                                        </div>
                                    ) : (
                                        <Image
                                            src={image || '/placeholder-product.jpg'}
                                            alt={`${product.name} ${index + 1}`}
                                            width={100}
                                            height={100}
                                            className="w-full h-24 object-cover"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="md:pl-8">
                    <h1 className="serif-font text-3xl font-bold mb-2 text-[var(--foreground)]">{product.name}</h1>
                    <p className="serif-font text-2xl font-semibold text-[var(--primary)] mb-4">
                        {(product.price / 100).toFixed(2)} RON
                    </p>

                    {/* Rating */}
                    {product.reviewCount && product.reviewCount > 0 ? (
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-[var(--muted-foreground)]'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-sm text-[var(--muted-foreground)]">({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'})</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm text-[var(--muted-foreground)]">{t('review.noReviews')}</span>
                        </div>
                    )}

                    <div className="mb-6">
                        <p className="serif-light text-[var(--foreground)]">{product.description}</p>
                    </div>

                    {/* Flower Details */}
                    {product.flowerDetails && (
                        <div className="mb-6 p-4 bg-[var(--secondary)] rounded-lg space-y-3 border border-[var(--border)]">
                            {product.flowerDetails.colors && product.flowerDetails.colors.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-[var(--foreground)] mb-1">🎨 Culoare:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.flowerDetails.colors.map((color) => (
                                            <span key={color} className="px-3 py-1 bg-[var(--card)] border border-[var(--border)] rounded-full text-sm capitalize text-[var(--foreground)]">
                                                {color}
                                            </span>
                                        ))}
                            </div>
                        </div>
                    )}

                            {product.flowerDetails.occasions && product.flowerDetails.occasions.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-[var(--foreground)] mb-1">🎉 Perfect pentru:</h3>
                            <div className="flex flex-wrap gap-2">
                                        {product.flowerDetails.occasions.map((occasion) => (
                                            <span key={occasion} className="px-3 py-1 bg-[var(--card)] border border-[var(--border)] rounded-full text-sm capitalize text-[var(--foreground)]">
                                                {occasion.replace('-', ' ')}
                                            </span>
                                ))}
                            </div>
                                </div>
                            )}

                            {product.flowerDetails.stemCount && (
                                <p className="text-sm text-[var(--foreground)]">
                                    <span className="font-medium">🌹 Numar fire:</span> {product.flowerDetails.stemCount}
                                </p>
                            )}

                            {product.flowerDetails.sameDayDelivery && (
                                <p className="text-sm text-green-600 font-medium">
                                    🚚 {t('product.sameDayDelivery')}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Quantity */}
                    {product.available && (
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-[var(--foreground)] mb-2">{t('product.quantity')}</h3>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                    <button
                                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                        disabled={quantity <= 1}
                                        className={`px-3 py-1 border border-[var(--border)] rounded-l-md bg-[var(--card)] text-[var(--foreground)] ${quantity <= 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-[var(--accent)]'}`}
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-1 border-t border-b border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => {
                                            const maxStock = product.stock || 20;
                                            setQuantity(prev => Math.min(maxStock, prev + 1));
                                        }}
                                        disabled={product.stock !== undefined && quantity >= product.stock}
                                        className={`px-3 py-1 border border-[var(--border)] rounded-r-md bg-[var(--card)] text-[var(--foreground)] ${
                                            product.stock !== undefined && quantity >= product.stock 
                                                ? 'cursor-not-allowed opacity-50' 
                                                : 'cursor-pointer hover:bg-[var(--accent)]'
                                        }`}
                                    >
                                        +
                                    </button>
                                </div>
                                {product.stock !== undefined && (
                                    <span className="text-xs text-[var(--muted-foreground)]">
                                        Max: {product.stock}
                                    </span>
                                )}
                            </div>
                            {product.stock !== undefined && quantity >= product.stock && (
                                <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                                    ⚠️ Ai atins cantitatea maximă disponibilă
                                </p>
                            )}
                        </div>
                    )}

                    {/* Stock Availability */}
                    {product.available && product.stock !== undefined && (
                        <div className="mb-6">
                            <div className="p-4 bg-[var(--secondary)] rounded-lg border border-[var(--border)]">
                                {product.stock > 10 ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-green-600 dark:bg-green-400 animate-pulse"></div>
                                        <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                            ✓ În stoc - disponibil imediat
                                        </span>
                                    </div>
                                ) : product.stock > 5 ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-green-600 dark:bg-green-400"></div>
                                        <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                            ✓ În stoc ({product.stock} bucăți disponibile)
                                        </span>
                                    </div>
                                ) : product.stock > 0 ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-orange-600 dark:bg-orange-400 animate-pulse"></div>
                                        <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                                            ⚠️ Doar {product.stock} {product.stock === 1 ? 'bucată rămasă' : 'bucăți rămase'} - comandă rapid!
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-red-600 dark:bg-red-400"></div>
                                        <span className="text-sm font-medium text-red-700 dark:text-red-400">
                                            ✕ Stoc epuizat
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {/* Wishlist Button */}
                    <button
                        onClick={handleWishlistToggle}
                        disabled={isAddingToWishlist}
                        className={`w-full cursor-pointer py-2 mb-3 flex items-center justify-center gap-2 border rounded-md transition-colors ${
                            isInWishlist(product.productId) 
                                ? 'bg-[var(--card)] text-red-500 border-red-500 hover:bg-red-50' 
                                : 'bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--accent)]'}`}
                    >
                        {isAddingToWishlist ? (
                            'Processing...'
                        ) : isInWishlist(product.productId) ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                                {t('product.removeFromWishlist')}
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                {t('product.addToWishlist')}
                            </>
                        )}
                    </button>

                    {/* Add to Cart Button */}
                    <Button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart || !product.available}
                        variant="primary"
                        size="lg"
                        fullWidth
                    >
                        {isAddingToCart ? (
                            'Adding to Cart...'
                        ) : !product.available ? (
                            t('product.outOfStock')
                        ) : (
                            `${t('product.addToCart')} - ${((product.price * quantity) / 100).toFixed(2)} RON`
                        )}
                    </Button>

                    {/* Unavailable Product Message */}
                    {!product.available && (
                        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-orange-800 mb-1">
                                        {t('product.unavailableTitle')}
                                    </p>
                                    <p className="text-sm text-orange-700">
                                        {t('product.unavailableMessage')}
                                    </p>
                                    <Link 
                                        href="/contact" 
                                        className="inline-block mt-2 text-sm font-medium text-orange-600 hover:text-orange-800 dark:hover:text-orange-200 hover:underline"
                                    >
                                        {t('product.contactUs')} →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Tabs */}
            <div className="mt-16">
                <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 max-w-md mb-8 bg-[var(--secondary)] border border-[var(--border)]">
                        <TabsTrigger value="details" className="data-[state=active]:bg-[var(--primary)] data-[state=active]:text-[var(--primary-foreground)]">Details</TabsTrigger>
                        <TabsTrigger value="reviews" className="data-[state=active]:bg-[var(--primary)] data-[state=active]:text-[var(--primary-foreground)]">{t('product.reviews')} ({product.reviewCount})</TabsTrigger>
                        <TabsTrigger value="care" className="data-[state=active]:bg-[var(--primary)] data-[state=active]:text-[var(--primary-foreground)]">Flower Care</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-6">
                        <ProductDetails
                            category={product.category}
                            tags={product.tags}
                            isFeatured={product.isFeatured}
                            isNew={product.isNew}
                            details={product.details || []}
                            rating={product.rating}
                        />
                        
                        <div className="prose max-w-none">
                            <p className="text-[var(--foreground)] serif-light">{product.description}</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="reviews" className="space-y-8">
                        <ProductReviews 
                            reviews={product.reviews || []} 
                            averageRating={product.rating} 
                            reviewCount={product.reviewCount} 
                        />
                        { isSubmittingReview ? (
                            <div className="animate-pulse flex flex-col items-center space-y-4">
                                <Spinner className="w-12 h-12" />
                                <p className="text-[var(--muted-foreground)]">Submitting your review...</p>
                            </div>
                        ) : (
                            <AddReview
                                productId={product.productId}
                                onReviewSubmit={handleReviewSubmit}
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="care">
                        <div className="prose max-w-none">
                            <h2 className="serif-font text-2xl font-bold mb-4 text-[var(--foreground)]">🌱 {t('product.careInstructions')}</h2>
                            
                            {product.flowerDetails?.careInstructions ? (
                                <div className="space-y-4">
                                    {product.flowerDetails.careInstructions.wateringFrequency && (
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💧 Watering</h3>
                                            <p className="text-blue-800 dark:text-blue-200 serif-light">{product.flowerDetails.careInstructions.wateringFrequency}</p>
                                        </div>
                                    )}
                                    
                                    {product.flowerDetails.careInstructions.sunlightRequirement && (
                                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">☀️ Sunlight</h3>
                                            <p className="text-yellow-800 dark:text-yellow-200 serif-light">{product.flowerDetails.careInstructions.sunlightRequirement}</p>
                                        </div>
                                    )}
                                    
                                    {product.flowerDetails.careInstructions.temperature && (
                                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">🌡️ Temperature</h3>
                                            <p className="text-green-800 dark:text-green-200 serif-light">{product.flowerDetails.careInstructions.temperature}</p>
                                        </div>
                                    )}
                                    
                                    {product.flowerDetails.careInstructions.expectedLifespan && (
                                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">⏱️ Expected Lifespan</h3>
                                            <p className="text-purple-800 dark:text-purple-200 serif-light">{product.flowerDetails.careInstructions.expectedLifespan}</p>
                                        </div>
                                    )}
                                    
                                    {product.flowerDetails.careInstructions.specialNotes && (
                                        <div className="p-4 bg-[var(--secondary)] rounded-lg border border-[var(--border)]">
                                            <h3 className="font-semibold text-[var(--foreground)] mb-2">📝 Special Notes</h3>
                                            <p className="text-[var(--foreground)] serif-light">{product.flowerDetails.careInstructions.specialNotes}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-6 bg-[var(--secondary)] rounded-lg border border-[var(--border)]">
                                    <h3 className="font-semibold mb-2 text-[var(--foreground)]">General Flower Care Tips:</h3>
                                    <ul className="list-disc pl-5 space-y-2 text-[var(--foreground)] serif-light">
                                        <li>Keep flowers in fresh, clean water</li>
                                        <li>Change water every 2-3 days</li>
                                        <li>Trim stems at a 45° angle</li>
                                        <li>Remove leaves below water line</li>
                                        <li>Keep away from direct sunlight and heat sources</li>
                                        <li>Place in a cool location for longer freshness</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Related Products */}
            {product.relatedProducts && product.relatedProducts.length > 0 && (
                <RelatedProducts products={product.relatedProducts} />
            )}

            {/* Back to Shop */}
            <div className="mt-12 text-center">
                <Button
                    variant="outline"
                    onClick={() => router.push('/shop')}
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Shop
                </Button>
            </div>
        </div>
    );
}
