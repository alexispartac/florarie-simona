'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX, FiShoppingBag, FiHeart, FiSearch } from 'react-icons/fi';
import Wishlist from './Wishlist';
import Cart from './Cart';
import { useShop } from '@/context/ShopContext';
import { Spinner } from '@/components/ui/Spinner';
import { useLanguage } from '@/context/LanguageContext';
import { useProductSearch } from '@/hooks/useProducts';
import ThemeSwitcher from './ThemeSwitcher';
import { useTheme } from '@/context/ThemeContext';


export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const { getCartItemCount } = useShop();
  const pathname = usePathname();
  const router = useRouter();
  const prevPathnameRef = useRef(pathname);
  const { t } = useLanguage();
  const searchRef = useRef<HTMLDivElement>(null);
  const { currentThemeConfig } = useTheme();

  useEffect(() => {
    setTimeout(() => {
      setHydrated(true);
    }, 0);
  }, []);
  
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search results
  const { data: searchResults, isLoading: isSearching } = useProductSearch(debouncedQuery);
  
  const navLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.shop'), href: '/shop' },
    { name: t('nav.collections'), href: '/collections' },
    { name: t('nav.events'), href: '/events' },
    { name: t('nav.contact'), href: '/contact' },
    { name: t('nav.trackOrder'), href: '/orders' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      if (prevPathnameRef.current !== pathname && isOpen) {
        setIsOpen(false);
      }
      prevPathnameRef.current = pathname;
    };
    
    handleRouteChange();
  }, [pathname, isOpen]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchOpen]);

  const handleSearchResultClick = (productId: string, slug: string) => {
    router.push(`/shop/${productId}?slug=${slug}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  // Show loading state during hydration
  if (!hydrated) {
    return null; // or return a placeholder
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[var(--primary-background)] ${
        scrolled ? 'backdrop-blur-md shadow-sm' : ''
      }`}
    >
      <Wishlist isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
     
     <div className="max-w-7xl mx-auto pr-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center px-4">
            <Image
              src={currentThemeConfig.image}
              alt="Buchetul Simonei Logo"
              width={125}
              height={50}
              className="object-contain"
              priority
            />
          </Link>
          

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium ${
                  pathname === link.href
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-700 hover:text-primary transition-colors'
                }
                ${link.href === '/orders' ? 'underline' : ''}
                `}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search button */}
            <button 
              className="p-2 hover:text-gray-900 relative cursor-pointer text-primary"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <FiSearch className="h-5 w-5" />
            </button>
            
            <button 
              className="p-2 hover:text-gray-900 relative cursor-pointer text-primary"
              onClick={() => setWishlistOpen(true)}
              aria-label="Wishlist"
            >
              <FiHeart className="h-5 w-5" />
            </button>
            
            <button 
              className="p-2 hover:text-gray-900 relative cursor-pointer text-primary"
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
            >
              <FiShoppingBag className="h-5 w-5" />
              {getCartItemCount() > 0 && hydrated && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemCount() > 9 ? '9+' : getCartItemCount()}
                </span>
              )}
            </button>
            
            <ThemeSwitcher />
            {/* <LanguageSwitcher /> */}
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <FiX className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <FiMenu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search dropdown */}
      {searchOpen && (
        <div 
          ref={searchRef}
          className="absolute top-16 left-0 right-0 bg-white shadow-lg border-t border-gray-200 animate-slide-down"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Caută buchete, flori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                autoFocus
              />
            </div>

            {/* Search Results */}
            {searchQuery.trim() && (
              <div className="mt-4 max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="flex justify-center py-8">
                    <Spinner className="w-6 h-6" />
                  </div>
                ) : searchResults?.products?.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.products.map((product: { productId: string; slug: string; name: string; category: string; images: string[]; price: number }) => (
                      <button
                        key={product.productId}
                        onClick={() => handleSearchResultClick(product.productId, product.slug)}
                        className="w-full flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                      >
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={60}
                          height={60}
                          className="rounded-md object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-medium text-primary">
                            {(product.price / 100).toFixed(2)} RON
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Nu s-au găsit rezultate pentru &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all bg-white duration-300 ease-in-out ${
          isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === link.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-700 hover:bg-gray-100'
              }
              ${link.href === '/orders' ? 'underline' : ''}
              `}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}