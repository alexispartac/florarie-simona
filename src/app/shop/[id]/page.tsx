'use client';

import { useState, useEffect } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { useShop } from '@/context/ShopContext';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { ProductVariant } from '@/types/products';
import Image from 'next/image';
import { useProduct } from '@/hooks/useProducts';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { RelatedProducts } from '../components/RelatedProducts';
import { ProductReviews } from '../components/ProductReviews';
import { SizeGuide } from '../components/SizeGuide';
import { ProductDetails } from '../components/ProductDetails';
import { AddReview } from '../components/AddReview';
import { ProductReview } from '@/types/products';

export default function ProductPage() {
    const [quantity, setQuantity] = useState<number>(1);
    const [currentImage, setCurrentImage] = useState<number>(0);
    const [selectedColor, setSelectedColor] = useState<string>();
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
    const [isAddingToWishlist, setIsAddingToWishlist] = useState<boolean>(false);
    const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
    const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useShop();
    
    const params = useParams();
    const id = params.id;
    
    const { data: product, isLoading, isError } = useProduct(id as string);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(product?.variants[0] as ProductVariant | undefined ?? null);

    const router = useRouter();
    // Set initial variant when product loads
    useEffect(() => {
        if (product && product.variants && product.variants.length > 0) {
            const firstVariant = product.variants[0];
            setSelectedVariant(firstVariant);
            setSelectedColor(firstVariant.colorCode);
            setSelectedSize(firstVariant.size);
        }
    }, [product]);

    useEffect(() => {
        if (product && selectedColor && selectedSize) {
            const variant = product.variants.find(
                v => v.size === selectedSize && v.colorCode === selectedColor
            );
            setSelectedVariant(variant || null);
        }
    }, [selectedColor, selectedSize, product, selectedVariant]);

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
        if (!selectedSize && product.availableSizes?.length > 0) {
            return;
        }
        
        if (!selectedColor && product.availableColors?.length > 0) {
            return;
        }
        
        if (!selectedVariant || selectedVariant.stock <= 0) {
            return;
        }

        try {
            setIsAddingToCart(true);
            addToCart({
                productId: product.productId,
                name: product.name,
                price: product.price + (selectedVariant?.priceAdjustment || 0),
                variant: selectedVariant,
                quantity: quantity,
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

    const handleReviewSubmit = async (review: ProductReview) => {
        if (!product) return;
        
        console.log("Review to submit:", review);
        try {
            setIsSubmittingReview(true);
            // TODO: Replace with actual API call to submit the review
            const response = await fetch(`/api/products/${product.productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reviews: [...product.reviews, { ...review, createdAt: new Date().toISOString() }],
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to submit review. Please try again.');
            }
            
            return response;
            
        } catch (error) {
            console.error('Failed to submit review:', error);
            alert('Failed to submit review. Please try again.');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const handleSizeSelect = (size: string) => {
        setSelectedSize(size);
    };

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
    };

    // get unique colors once
    const stockColors = [...new Set(product.variants?.map(v => v.colorCode) || [])];
    // const stockSizes = [...new Set(product.variants?.map(v => v.size) || [])];
    const stockSizes = product.availableSizes

    return (
        <div className="container mx-auto px-4 py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images */}
                <div>
                    <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                            src={selectedVariant?.images[0] || '/placeholder-product.jpg'}
                            alt={product.name}
                            width={600}
                            height={800}
                            className="w-full h-auto object-cover"
                            priority
                        />
                    </div>

                    {selectedVariant?.images && selectedVariant.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2 mt-2">
                            {selectedVariant.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImage(index)}
                                    className={`border-2 rounded overflow-hidden ${currentImage === index ? 'border-primary' : 'border-transparent'}`}
                                >
                                    <Image
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        width={100}
                                        height={100}
                                        className="w-full h-24 object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="md:pl-8">
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <p className="text-2xl font-semibold text-primary mb-4">${((product.price + (selectedVariant?.priceAdjustment || 0)) / 100).toFixed(2)}</p>

                    <div className="mb-6">
                        <p className="text-gray-700">{product.description}</p>
                    </div>

                    {/* Color Selection */}
                    {stockColors.length > 0 && (
                        
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
                            <div className="flex space-x-2">
                                {stockColors.map((color) => 
                                    <button
                                        key={color}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleColorSelect(color);
                                        }}
                                        className={`w-8 h-8 cursor-pointer rounded-full border-2 ${selectedColor === color ? 'border-primary' : 'border-gray-300'}`}
                                        style={{ backgroundColor: color }}
                                        aria-label={`Select color ${color}`}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Size Selection */}
                    {stockSizes.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
                            <div className="flex flex-wrap gap-2">
                                {stockSizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleSizeSelect(size);
                                        }}
                                        className={`px-4 py-2 cursor-pointer border rounded-md ${selectedSize === size ? 'bg-primary text-white border-primary' : 'border-gray-300'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
                        <div className="flex items-center">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-3 py-1 border border-gray-300 rounded-l-md cursor-pointer"
                            >
                                -
                            </button>
                            <span className="px-4 py-1 border-t border-b border-gray-300">
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="px-3 py-1 border border-gray-300 rounded-r-md cursor-pointer"
                            >
                                +
                            </button>
                        </div>
                    </div>
                    
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
                        className="w-full py-3 mb-4 cursor-pointer"
                        disabled={isAddingToCart || !selectedVariant || selectedVariant.stock <= 0}
                    >
                        {isAddingToCart ? (
                            'Adding to Cart...'
                        ) : !selectedColor ? (
                            'Select a color'
                        ) : !selectedSize ? (
                            'Select a size'
                        ) : !selectedVariant ? (
                            'Variant not available'
                        ) : selectedVariant.stock > 0 ? (
                            `Add to Cart - $${(((product.price + (selectedVariant.priceAdjustment || 0)) * quantity) / 100).toFixed(2)}`
                        ) : (
                            'Out of Stock'
                        )}
                    </Button>
                    
                    {selectedVariant?.stock && selectedVariant.stock > 0 && selectedVariant.stock < 5 && (
                        <p className="text-sm text-amber-600 font-semibold text-center mb-4">
                            Only {selectedVariant.stock} {selectedVariant.stock === 1 ? 'item' : 'items'} left in stock!
                        </p>
                    )}

                    {/* Product Details */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Details</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                            {product.details?.map((detail, index) => (
                                <li key={index}>{detail}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Product Tabs */}
            <div className="mt-16">
                <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
                        <TabsTrigger value="size-guide">Size Guide</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-6">
                        <ProductDetails
                            category={product.category}
                            tags={product.tags}
                            isFeatured={product.isFeatured}
                            isNew={product.isNew}
                            details={product.details}
                            rating={product.rating}
                        />
                        
                        <div className="prose max-w-none">
                            <p>{product.description}</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="reviews" className="space-y-8">
                        <ProductReviews 
                            reviews={product.reviews} 
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

                    <TabsContent value="size-guide">
                        <SizeGuide sizeGuide={product.sizeGuide} />
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
