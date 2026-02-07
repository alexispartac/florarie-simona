'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useRef, useCallback, useMemo } from 'react';
import { useToast } from '@/context/ToastContext';
import { CartItem, WishlistItem } from '@/types/products';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/translations';

interface ShopContextType {
    cart: CartItem[];
    wishlist: WishlistItem[];
    addToCart: (product: CartItem) => void;
    removeFromCart: (product: CartItem) => void;
    updateCartItemQuantity: (product: CartItem, quantity: number) => void;
    addToWishlist: (product: WishlistItem) => void;
    removeFromWishlist: (productId: string) => void;
    isInCart: (productId: string) => boolean;
    isInWishlist: (productId: string) => boolean;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartItemCount: () => number;
    getPriceShipping: () => number;
};

const STORAGE_KEYS = {
    CART: 'shop_cart',
    WISHLIST: 'shop_wishlist',
    TIMESTAMP: 'shop_timestamp'
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const useInitialState = () => { 
    if (typeof window === 'undefined') {
        return { cart: [], wishlist: [], shouldClearStorage: false };
    }

    const lastUpdated = localStorage.getItem(STORAGE_KEYS.TIMESTAMP);
    const shouldClearStorage = lastUpdated && Date.now() - Number(lastUpdated) > ONE_WEEK;

    if (shouldClearStorage) {
        return { cart: [], wishlist: [], shouldClearStorage: true };
    }

    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    const savedWishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);

    // Ensure cart items have quantity
    const cart = savedCart ? (JSON.parse(savedCart) as Array<Omit<CartItem, 'quantity'> & { quantity?: number }>).map(item => ({
        ...item,
        quantity: item.quantity || 1
    } as CartItem)) : [];

    return {
        cart,
        wishlist: savedWishlist ? JSON.parse(savedWishlist) : [],
        shouldClearStorage: false
    };
};

export function ShopProvider({ children }: { children: ReactNode }) {
    const initialState = useInitialState();
    const [cart, setCart] = useState<CartItem[]>(initialState.cart);
    const [wishlist, setWishlist] = useState<WishlistItem[]>(initialState.wishlist);
    
    const { toast } = useToast();
    const { language } = useLanguage();
    const t = useTranslation(language);
    
    const toastRef = useRef(toast);
    const tRef = useRef(t);
    
    // Keep toast and translation refs updated
    useEffect(() => {
        toastRef.current = toast;
        tRef.current = t;
    }, [toast, t]);

    // Save to localStorage when cart or wishlist changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
        localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
        localStorage.setItem(STORAGE_KEYS.TIMESTAMP, Date.now().toString());
    }, [cart, wishlist]);

    // Clear storage if needed
    useEffect(() => {
        if (initialState.shouldClearStorage) {
            localStorage.clear();
        }
    }, [initialState.shouldClearStorage]);

    const addToCart = useCallback((product: CartItem) => {
        setCart(prevCart => {
            // Check if item already exists (just by productId now)
            const existingItem = prevCart.find(item => 
                item.productId === product.productId
            );
            
            if (existingItem) {
                const newQuantity = existingItem.quantity + product.quantity;
                
                // Check if adding more would exceed stock limit
                if (product.stock !== undefined && newQuantity > product.stock) {
                    setTimeout(() => {
                        toastRef.current?.({
                            title: tRef.current('cart.toast.stockLimitReached') || 'Stock limit reached',
                            description: `${tRef.current('cart.toast.maxStockAvailable') || 'Maximum available'}: ${product.stock}`,
                            variant: 'destructive',
                        });
                    }, 0);
                    return prevCart; // Don't add if it exceeds stock
                }
                
                // Show toast for existing item
                setTimeout(() => {
                    toastRef.current?.({
                        title: tRef.current('cart.toast.information'),
                        description: tRef.current('cart.toast.alreadyInCart')
                    });
                }, 0);

                // Update quantity of existing item
                return prevCart.map(item =>
                    item.productId === product.productId
                        ? { ...item, quantity: newQuantity, stock: product.stock } // Update stock info too
                        : item
                );
            }

            // Check stock limit for new item
            if (product.stock !== undefined && product.quantity > product.stock) {
                setTimeout(() => {
                    toastRef.current?.({
                        title: tRef.current('cart.toast.stockLimitReached') || 'Stock limit reached',
                        description: `${tRef.current('cart.toast.maxStockAvailable') || 'Maximum available'}: ${product.stock}`,
                        variant: 'destructive',
                    });
                }, 0);
                return prevCart; // Don't add if it exceeds stock
            }

            // Show toast for new item
            setTimeout(() => {
                toastRef.current?.({
                    title: tRef.current('cart.toast.addedToCart'),
                    description: tRef.current('cart.toast.addedToCartDesc')
                });
            }, 0);

            return [...prevCart, product];
        });
    }, []);

    const removeFromCart = useCallback((product: CartItem) => {
        setCart(prevCart => {
            const newCart = prevCart.filter(item => 
                item.productId !== product.productId
            );
            
            if (product) {
                setTimeout(() => {
                    toastRef.current?.({
                        title: tRef.current('cart.toast.removedFromCart'),
                        description: tRef.current('cart.toast.removedFromCartDesc'),
                        variant: 'destructive',
                    });
                }, 0);
            }
            
            return newCart;
        });
    }, []);

    const updateCartItemQuantity = useCallback((product: CartItem, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(product);
            return;
        }
        
        // Check if quantity exceeds stock limit
        if (product.stock !== undefined && quantity > product.stock) {
            setTimeout(() => {
                toastRef.current?.({
                    title: tRef.current('cart.toast.stockLimitReached') || 'Stock limit reached',
                    description: `${tRef.current('cart.toast.maxStockAvailable') || 'Maximum available'}: ${product.stock}`,
                    variant: 'destructive',
                });
            }, 0);
            return;
        }
        
        setCart((prevCart: CartItem[]) => {
            const newCart = prevCart.map(item =>
                item.productId === product.productId
                    ? { ...item, quantity } 
                    : item
            );
            
            if (product) {
                setTimeout(() => {
                    toastRef.current?.({
                        title: tRef.current('cart.toast.cartUpdated'),
                        description: `${tRef.current('cart.toast.quantityUpdated')} ${quantity}`,
                    });
                }, 0);
            }
            
            return newCart;
        });
    }, [removeFromCart]);

    const addToWishlist = useCallback((product: WishlistItem) => {
        setWishlist((prevWishlist: WishlistItem[]) => {
            const existingItem = prevWishlist.find(item => item.productId === product.productId);

            setTimeout(() => {
                toastRef.current?.({
                    title: existingItem ? tRef.current('wishlist.toast.wishlistUpdated') : tRef.current('wishlist.toast.addedToWishlist'),
                    description: existingItem
                        ? tRef.current('wishlist.toast.alreadyInWishlist')
                        : tRef.current('wishlist.toast.addedToWishlistDesc'),
                });
            }, 0);
            
            
            if (existingItem) {
                return prevWishlist;
            }
            
            return [...prevWishlist, product];
        });
    }, []);

    const removeFromWishlist = useCallback((productId: string) => {
        setWishlist(prevWishlist => {
            const newWishlist = prevWishlist.filter(item => item.productId !== productId);
            
            if (productId) {
                setTimeout(() => {
                    toastRef.current({
                        title: tRef.current('wishlist.toast.removedFromWishlist'),
                        description: tRef.current('wishlist.toast.removedFromWishlistDesc'),
                        variant: 'destructive',
                    });
                }, 0);
            }
            
            return newWishlist;
        });
    }, []);

    const clearCart = useCallback(() => {
        setCart(prevCart => {
            const hadItems = prevCart.length > 0;
            
            if (hadItems) {
                setTimeout(() => {
                    toastRef.current({
                        title: tRef.current('cart.toast.cartCleared'),
                        description: tRef.current('cart.toast.cartClearedDesc'),
                        variant: 'destructive',
                    });
                }, 0);
            }
            
            return [];
        });
    }, []);

    const isInCart = useCallback((productId: string) => {
        if (!productId) return false;
        return cart.some(item => item.productId === productId);
    }, [cart]);

    const isInWishlist = useCallback((productId: string) => {
        if (!productId) return false;
        return wishlist.some(item => item.productId === productId);
    }, [wishlist]);

    const getCartTotal = useCallback(() => 
        cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    , [cart]);

    const getPriceShipping = useCallback(() => {
        // Check if shipping data exists and get the city
        if (typeof window !== 'undefined') {
            const shippingDataStr = localStorage.getItem('shippingData');
            if (shippingDataStr) {
                try {
                    const shippingData = JSON.parse(shippingDataStr);
                    const city = shippingData.city?.toLowerCase() || '';
                    
                    // Free shipping for Tămășeni and Adjudeni
                    if (city === 'tămășeni' || city === 'adjudeni') {
                        return 0;
                    }
                } catch (e) {
                    console.error('Error parsing shipping data:', e);
                }
            }
        }
        
        // Default shipping cost: 20 RON (2000 bani)
        return 2000;
    }, []);
    
    const getCartItemCount = useCallback(() => 
        cart.reduce((count, item) => count + item.quantity, 0)
    , [cart]);

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        addToWishlist,
        removeFromWishlist,
        isInCart,
        isInWishlist,
        clearCart,
        getCartTotal,
        getPriceShipping,
        getCartItemCount,
    }), [
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        addToWishlist,
        removeFromWishlist,
        clearCart,
        isInCart,
        isInWishlist,
        getCartTotal,
        getPriceShipping,
        getCartItemCount,
    ]);

    return (
        <ShopContext.Provider value={contextValue}>
            {children}
        </ShopContext.Provider>
    );
}

export const useShop = (): ShopContextType => {
    const context = useContext(ShopContext);
    if (!context) {
        throw new Error('useShop must be used within a ShopProvider');
    }
    return context;
};
