'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX, FiShoppingBag, FiHeart } from 'react-icons/fi';
import ThemeSwitcher from './ThemeSwitcher';
import LanguageSwitcher from './LanguageSwitcher';
import Wishlist from './Wishlist';
import Cart from './Cart';
import { useShop } from '@/context/ShopContext';
import { Spinner } from '@/components/ui/Spinner';
import { useLanguage } from '@/context/LanguageContext';


export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { getCartItemCount } = useShop();
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useLanguage();
  
  const navLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.shop'), href: '/shop' },
    { name: t('nav.collections'), href: '/collections' },
    { name: t('nav.contact'), href: '/contact' },
    { name: t('nav.trackOrder'), href: '/orders' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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
    
    return () => {
      // Cleanup function if needed
    };
  }, [pathname, isOpen]);

  if (!isMounted) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <Spinner className="w-12 h-12" />
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        </div>
      );
    }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'
      }`}
    >
      <Wishlist isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
     
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              WYTB
            </Link>
          </div>

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
            <button 
              className="p-2 text-gray-700 hover:text-gray-900 relative cursor-pointer"
              onClick={() => setWishlistOpen(true)}
              aria-label="Wishlist"
            >
              <FiHeart className="h-5 w-5" />
            </button>
            
            <button 
              className="p-2 text-gray-700 hover:text-gray-900 relative cursor-pointer"
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
            >
              <FiShoppingBag className="h-5 w-5" />
              {getCartItemCount() > 0 && isMounted && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemCount() > 9 ? '9+' : getCartItemCount()}
                </span>
              )}
            </button>
            
            <ThemeSwitcher />
            <LanguageSwitcher />
            
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