'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useUser } from '@/app/components/context/ContextUser';
import { motion, AnimatePresence } from 'framer-motion';

type AdvertisementProps = {
  imageSrc: string;
  buttonText: string;
  buttonLink: string;
};

export default function Advertisement({
  imageSrc,
  buttonText,
  buttonLink,
}: AdvertisementProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); 
  const { advertisement, setAdvertisement } = useUser();

  useEffect(() => {
    // Add a class to body when ad is open to prevent scrolling
    document.body.style.overflow = 'hidden';

    if( advertisement.isVisible === false) {
      document.body.style.overflow = 'unset';
      setIsVisible(false);
    }
    
    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          clearInterval(timer);
          handleClose();
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);
    
    return () => {
      clearInterval(timer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setAdvertisement({ isVisible: false });
      document.body.style.overflow = 'unset';
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: isClosing ? 0 : 1,
            transition: { duration: 0.3 }
          }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="relative h-[90vh] w-[95vw] max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ 
              scale: isClosing ? 0.9 : 1,
              opacity: isClosing ? 0 : 1,
              transition: { 
                type: 'spring',
                damping: 20,
                stiffness: 300
              }
            }}
          >
            <div className="relative h-full w-full">
              <Image
                src={imageSrc}
                alt="Ofertă sezonieră"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 95vw, 80vw"
                priority
              />
              
              {/* Gradient overlay for better text visibility */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
              
              {/* Content */}
              <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white">
                <div className="mb-6 max-w-lg">
                  <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
                    Ofertă specială de sezon!
                  </h2>
                  <p className="mb-6 text-lg text-gray-200 md:text-xl">
                    Descoperă colecția noastră specială creată pentru tine
                  </p>
                  <Link
                    href={buttonLink}
                    onClick={handleClose}
                    className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-semibold text-black transition-all hover:scale-105 hover:bg-gray-100 active:scale-95"
                  >
                    {buttonText}
                    <svg
                      className="ml-2 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
              
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute z-50 cursor-pointer right-4 top-4 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/30"
                aria-label="Închide anunțul"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              
              {/* Countdown timer */}
              <div className="absolute right-4 top-20 flex items-center rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                <span>Se închide în {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}