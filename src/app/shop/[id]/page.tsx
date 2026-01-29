'use client';

import { useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { useShop } from '@/context/ShopContext';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { useProduct, useSubmitReview } from '@/hooks/useProducts';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { RelatedProducts } from '../components/RelatedProducts';
import { ProductReviews } from '../components/ProductReviews';
import { ProductDetails } from '../components/ProductDetails';
import { AddReview } from '../components/AddReview';
import { ProductReview } from '@/types/products';

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
    
    const params = useParams();
    const id = params.id as string;

    // Submit review
    const { mutateAsync: submitReviewAsync } = useSubmitReview();
    
    // Fetch product from API
    const { data: product, isLoading, isError, refetch } = useProduct(id);

    const router = useRouter();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center space-y-4">
                    <Spinner className="w-12 h-12" />
                    <p className="text-gray-600">Loading product...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center space-y-4">
                    <p className="text-gray-600">Error loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center space-y-4">
                    <p className="text-gray-600">Product not found</p>
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
        <div className="container mx-auto px-4 py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images */}
                <div>
                    <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden">
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
                                    className={`border-2 rounded overflow-hidden ${currentImage === index ? 'border-primary' : 'border-transparent'}`}
                                >
                                    {isVideoUrl(image) ? (
                                        <div className="relative w-full h-24 bg-gray-200 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
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
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <p className="text-2xl font-semibold text-primary mb-4">
                        {(product.price / 100).toFixed(2)} RON
                    </p>

                    {/* Rating */}
                    {product.rating && (
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-gray-300'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-sm text-gray-600">({product.reviewCount} reviews)</span>
                        </div>
                    )}

                    <div className="mb-6">
                        <p className="text-gray-700">{product.description}</p>
                    </div>

                    {/* Flower Details */}
                    {product.flowerDetails && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
                            {product.flowerDetails.colors && product.flowerDetails.colors.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-1">🎨 Colors:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.flowerDetails.colors.map((color) => (
                                            <span key={color} className="px-3 py-1 bg-white border rounded-full text-sm capitalize">
                                                {color}
                                            </span>
                                        ))}
                            </div>
                        </div>
                    )}

                            {product.flowerDetails.occasions && product.flowerDetails.occasions.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-1">🎉 Perfect for:</h3>
                            <div className="flex flex-wrap gap-2">
                                        {product.flowerDetails.occasions.map((occasion) => (
                                            <span key={occasion} className="px-3 py-1 bg-white border rounded-full text-sm capitalize">
                                                {occasion.replace('-', ' ')}
                                            </span>
                                ))}
                            </div>
                                </div>
                            )}

                            {product.flowerDetails.stemCount && (
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium">🌹 Stem Count:</span> {product.flowerDetails.stemCount} stems
                                </p>
                            )}

                            {product.flowerDetails.sameDayDelivery && (
                                <p className="text-sm text-green-600 font-medium">
                                    🚚 Same-day delivery available!
                                </p>
                            )}
                        </div>
                    )}

                    {/* Quantity */}
                    {product.available && (
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
                            <div className="flex items-center">
                                <button
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    disabled={quantity <= 1}
                                    className={`px-3 py-1 border border-gray-300 rounded-l-md ${quantity <= 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                >
                                    -
                                </button>
                                <span className="px-4 py-1 border-t border-b border-gray-300">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    className="px-3 py-1 border border-gray-300 rounded-r-md cursor-pointer"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {/* Wishlist Button */}
                    <button
                        onClick={handleWishlistToggle}
                        disabled={isAddingToWishlist}
                        className={`w-full cursor-pointer py-2 mb-3 flex items-center justify-center gap-2 border rounded-md transition-colors ${
                            isInWishlist(product.productId) 
                                ? 'bg-white text-red-500 border-red-500 hover:bg-red-50' 
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                        {isAddingToWishlist ? (
                            'Processing...'
                        ) : isInWishlist(product.productId) ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                                Remove from Wishlist
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                Add to Wishlist
                            </>
                        )}
                    </button>

                    {/* Add to Cart Button */}
                    <Button
                        onClick={handleAddToCart}
                        className={`w-full py-3 mb-4 ${isAddingToCart || !product.available ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
                        disabled={isAddingToCart || !product.available}
                    >
                        {isAddingToCart ? (
                            'Adding to Cart...'
                        ) : !product.available ? (
                            'Out of Stock'
                        ) : (
                            `Add to Cart - ${((product.price * quantity) / 100).toFixed(2)} RON`
                        )}
                    </Button>
                </div>
            </div>

            {/* Product Tabs */}
            <div className="mt-16">
                <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
                        <TabsTrigger value="details" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Details</TabsTrigger>
                        <TabsTrigger value="reviews" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Reviews ({product.reviewCount})</TabsTrigger>
                        <TabsTrigger value="care" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Flower Care</TabsTrigger>
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
                            <p>{product.description}</p>
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
                                <p>Submitting your review...</p>
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
                            <h2 className="text-2xl font-bold mb-4">🌱 Flower Care Instructions</h2>
                            
                            {product.flowerDetails?.careInstructions ? (
                                <div className="space-y-4">
                                    {product.flowerDetails.careInstructions.wateringFrequency && (
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <h3 className="font-semibold text-blue-900 mb-2">💧 Watering</h3>
                                            <p className="text-blue-800">{product.flowerDetails.careInstructions.wateringFrequency}</p>
                                        </div>
                                    )}
                                    
                                    {product.flowerDetails.careInstructions.sunlightRequirement && (
                                        <div className="p-4 bg-yellow-50 rounded-lg">
                                            <h3 className="font-semibold text-yellow-900 mb-2">☀️ Sunlight</h3>
                                            <p className="text-yellow-800">{product.flowerDetails.careInstructions.sunlightRequirement}</p>
                                        </div>
                                    )}
                                    
                                    {product.flowerDetails.careInstructions.temperature && (
                                        <div className="p-4 bg-green-50 rounded-lg">
                                            <h3 className="font-semibold text-green-900 mb-2">🌡️ Temperature</h3>
                                            <p className="text-green-800">{product.flowerDetails.careInstructions.temperature}</p>
                                        </div>
                                    )}
                                    
                                    {product.flowerDetails.careInstructions.expectedLifespan && (
                                        <div className="p-4 bg-purple-50 rounded-lg">
                                            <h3 className="font-semibold text-purple-900 mb-2">⏱️ Expected Lifespan</h3>
                                            <p className="text-purple-800">{product.flowerDetails.careInstructions.expectedLifespan}</p>
                                        </div>
                                    )}
                                    
                                    {product.flowerDetails.careInstructions.specialNotes && (
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <h3 className="font-semibold text-gray-900 mb-2">📝 Special Notes</h3>
                                            <p className="text-gray-800">{product.flowerDetails.careInstructions.specialNotes}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-6 bg-gray-50 rounded-lg">
                                    <h3 className="font-semibold mb-2">General Flower Care Tips:</h3>
                                    <ul className="list-disc pl-5 space-y-2">
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
                    className="inline-flex items-center cursor-pointer"
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
