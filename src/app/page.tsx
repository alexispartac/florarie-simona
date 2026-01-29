'use client';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useScrollProgress } from '@/components/hooks/useScrollProgress';
import Button from "../components/ui/Button";
import ServiceCard from "../components/ui/ServiceCard";
import Image from 'next/image';
import { ArrowBigDown, Calendar, MapPin, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEvents } from '@/hooks/useEvents';

interface SectionProps {
  t: (key: string) => string;
  router: ReturnType<typeof useRouter>;
}

interface TextOnlyProps {
  t: (key: string) => string;
}

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();
  
  return (
    <div className="relative w-full overflow-x-hidden bg-[var(--primary-background)]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Cormorant+Garamond:wght@300;400;500;600&display=swap');
        
        .serif-font {
          font-family: 'Playfair Display', serif;
        }
        
        .serif-light {
          font-family: 'Cormorant Garamond', serif;
        }
      `}</style>
      
      {/* Hero Section with Parallax Zoom */}
      <HeroSection t={t} router={router} />
      
      {/* Decorative Divider */}
      <DecorativeDivider />

      {/* Events Section */}
      <EventsSection router={router} />

      {/* Decorative Divider */}
      <DecorativeDivider />
      
      {/* Text Reveal Section */}
      <TextRevealSection t={t} />

      {/* Decorative Divider */}
      <DecorativeDivider />
      
      {/* Split Screen Section */}
      <SplitScreenSection t={t} router={router} />

      {/* Decorative Divider */}
      <DecorativeDivider />
      
      {/* Reveal Cards Section */}
      <RevealCardsSection />

      {/* Decorative Divider */}
      <DecorativeDivider />
      
      {/* CTA Section */}
      <CTASection t={t} router={router} />

      {/* Footer Section */}
      <FooterSection />
    </div>
  );
}

// Decorative Divider Component
function DecorativeDivider() {
  return (
    <div className="py-12 bg-[var(--primary-background)]">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-4 px-8">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-[var(--primary)]/40 to-[var(--primary)]/40" />
          <ArrowBigDown className="w-6 h-6 text-[var(--primary)]/70" />
        <div className="h-px flex-1 bg-linear-to-l from-transparent via-[var(--primary)]/40 to-[var(--primary)]/40" />
      </div>
    </div>
  );
}

// Hero Section with Parallax Zoom Effect
function HeroSection({ t, router }: SectionProps) {
  return (
    <div className="relative h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=1200&q=80)',
          filter: 'brightness(0.85) contrast(1.1)',
        }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-stone-900/70 via-stone-900/50 to-stone-900/80" />
      
      {/* Elegant top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-[var(--primary)]/50 to-transparent" />
      
      <div className="relative z-10 h-full px-6 md:px-12 lg:px-16 py-16 md:py-20 flex flex-col justify-between">
        {/* Top Left - Small Label */}
        <div className="self-start mt-10">
          <div className="flex items-center gap-2 text-[var(--accent)]">
            <div className="h-px w-8 bg-[var(--primary)]/70" />
            <span className="text-xs tracking-[0.3em] uppercase serif-light">Flori Premium</span>
          </div>
        </div>

        {/* Center - Main Content Split */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left Side - Main Title */}
            <div className="flex flex-col justify-center lg:items-end lg:text-right">
              <h1 className="serif-font text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-semibold text-[var(--accent)] leading-[0.9] mb-4">
                {t('homepage.heroTitle')}
              </h1>
              
              {/* Decorative element */}
              <div className="flex items-center gap-2 lg:justify-end mt-4 lg:mt-6">
                <svg className="w-5 h-5 text-[var(--primary)]/90" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div className="h-px w-16 lg:w-20 bg-[var(--primary)]/60" />
              </div>
            </div>

            {/* Right Side - Subtitle and CTA */}
            <div className="flex flex-col justify-center gap-6 lg:gap-8">
              <p className="serif-light text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-[var(--accent)] font-light leading-relaxed">
                {t('homepage.heroSubtitle')}
              </p>
              
              <div className="space-y-10">
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={() => router.push('/shop')}
                >
                  {t('homepage.shopNow')}
                </Button>
                
                {/* Social Media Links */}
                <div className="flex items-center gap-3 text-[var(--accent)]/90">
                  <span className="text-sm serif-light">Ne poți găsi pe:</span>
                  <a 
                    href="https://wa.me/40123456789" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-[var(--primary)] transition-colors"
                    aria-label="WhatsApp"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-[var(--primary)] transition-colors"
                    aria-label="Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-[var(--primary)] transition-colors"
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Right - Info Tags */}
        <div className="self-end flex flex-wrap gap-4 md:gap-8 items-center justify-end">
          <div className="flex items-center gap-2 text-[var(--accent)]/80 text-xs md:text-sm serif-light">
            <svg className="w-4 h-4 text-[var(--primary)]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
            <span>Livrare Rapidă în Maxim 24h de la Crearea Aranjamentului</span>
          </div>
          <div className="h-4 md:h-6 w-px bg-[var(--primary)]/30" />
          <div className="flex items-center gap-2 text-[var(--accent)]/80 text-xs md:text-sm serif-light">
            <svg className="w-4 h-4 text-[var(--primary)]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>Creat cu pasiune</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Bottom Center */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-[var(--accent)]">
          <div className="w-px h-10 md:h-12 bg-linear-to-b from-transparent via-[var(--primary)]/50 to-transparent animate-pulse" />
          <span className="text-xs tracking-widest uppercase serif-light">Scroll</span>
        </div>
      </div>
    </div>
  );
}

// Text Reveal Section
function TextRevealSection({ t }: TextOnlyProps) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0.2,
    endThreshold: 0.8,
  });

  const text = t('homepage.banner');
  const words = text.split(' ');

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-[var(--secondary)] px-8 py-20">
      <div className="max-w-5xl">
        {/* Title */}
        <h2 className="serif-font text-4xl md:text-6xl font-medium text-[var(--foreground)] leading-relaxed text-center mb-12">
          {words.map((word: string, index: number) => {
            const wordProgress = Math.max(
              0,
              Math.min(1, (progress - index * 0.08) * (words.length / 2))
            );
            return (
              <span
                key={index}
                style={{
                  opacity: wordProgress,
                  transform: `translateY(${(1 - wordProgress) * 15}px)`,
                  display: 'inline-block',
                  marginRight: '0.35em',
                  transition: `all 0.25s ease-out`,
                }}
              >
                {word}
              </span>
            );
          })}
        </h2>

        {/* Decorative top element */}
        <div 
          className="flex items-center justify-center gap-4 mb-12"
          style={{
            opacity: progress,
            transition: 'all 0.3s ease-out',
          }}
        >
          <div className="h-px w-16 bg-[var(--primary)]/40" />
          <span className="text-[var(--primary)] text-xs tracking-widest uppercase serif-light">Cu ce ne ocupăm?</span>
          <div className="h-px w-16 bg-[var(--primary)]/40" />
        </div>
    
        {/* add a paragraph here with some text about the company */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="serif-light text-lg md:text-xl text-[var(--muted-foreground)] mb-8 leading-relaxed font-light"
        >
          La Buchetul Simonei, credem că fiecare floare spune o poveste. Fondată din pasiunea pentru frumusețea naturii și dorința de a aduce bucurie în viețile oamenilor, florăria noastră a crescut de la o mică afacere locală la un nume de încredere în livrarea de flori proaspete și aranjamente florale spectaculoase.

          Echipa noastră dedicată de florari talentați lucrează cu atenție pentru a crea buchete care să reflecte emoțiile și ocaziile speciale ale clienților noștri. Fiecare aranjament este realizat cu grijă, folosind doar cele mai proaspete flori, pentru a asigura calitatea și satisfacția deplină.

          Ne mândrim cu serviciul nostru de livrare rapidă și fiabilă, asigurându-ne că fiecare comandă ajunge la destinație în condiții perfecte. Indiferent dacă este vorba de o aniversare, o zi de naștere sau pur și simplu dorința de a aduce un zâmbet pe fața cuiva drag, suntem aici pentru a transforma momentele speciale în amintiri de neuitat.
                    
        </motion.div>

        
      </div>
    </div>
  );
}

// Split Screen Section
function SplitScreenSection({ t, router }: SectionProps) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0.2,
    endThreshold: 0.8,
  });

  return (
    <div ref={ref} className="md:min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 relative overflow-hidden bg-stone-900 order-2 md:order-1">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://res.cloudinary.com/dm7ttgpta/image/upload/v1763646807/70153b94-da07-455b-b1b5-27a26a6c3f9e/ykifzltiznhghgiz8bkf.webp)',
            transform: `scale(${1 + progress * 0.2})`,
            filter: 'brightness(0.85) contrast(1.05)',
            transition: 'all 0.15s ease-out',
          }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-stone-900/40 via-transparent to-stone-900/60" />
        
        { /* Elegant frame border */}
        <div className="absolute inset-4 border border-rose-400/10 pointer-events-none" />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-12 md:p-20 lg:p-24 bg-[var(--secondary)] order-1 md:order-2">
        <div
          className="max-w-xl"
          style={{
            transform: `translateX(${(1 - progress) * 60}px)`,
            opacity: progress,
            transition: 'all 0.25s ease-out',
          }}
        >
          {/* Small label */}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px w-8 bg-[var(--primary)]/50" />
            <span className="text-xs tracking-widest uppercase text-[var(--primary)] serif-light">Excellence</span>
          </div>
          
          <h2 className="serif-font text-4xl md:text-5xl font-medium mb-6 text-[var(--foreground)] leading-tight">
            {t('homepage.heroTitle')}
          </h2>
          
          <p className="serif-light text-lg md:text-xl text-[var(--muted-foreground)] mb-8 leading-relaxed font-light">
            Descoperiți colecția noastră unică de flori proaspete și aranjamente florale create cu pasiune și dedicație. Fiecare buchet spune o poveste specială.
          </p>
          
            <Button 
            variant="outline" 
              size="lg" 
            onClick={() => router.push('/shop')}
          >
            Explorează Mai Mult
          </Button>
          
          {/* Progress indicator */}
          <div className="mt-10 flex items-center gap-3">
            <div className="flex-1 h-px bg-[var(--accent)]">
              <div 
                className="h-full bg-[var(--primary)]" 
                style={{ width: `${progress * 100}%`, transition: 'width 0.2s' }} 
              />
            </div>
            <span className="text-xs text-[var(--primary)] serif-light">{Math.round(progress * 100)}%</span>
          </div>

          
        </div>
      </div>
    </div>
  );
}

// Reveal Cards Section
function RevealCardsSection() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0.1,
    endThreshold: 0.9,
  });

  const cards = [
    {
      title: 'Buchete Romantice',
      description: 'Aranjamente florale perfecte pentru momente speciale',
      number: '01',
      image: 'https://res.cloudinary.com/dm7ttgpta/image/upload/v1764067790/a631f8ec-b16b-402a-9566-67749f6b33e5/il75wd9vjs0ee5uqzyce.webp',
    },
    {
      title: 'Flori Proaspete',
      description: 'Calitate premium direct de la cultivatori',
      number: '02',
      image: 'https://res.cloudinary.com/dm7ttgpta/image/upload/v1763577654/a425b4f7-bfce-46f5-8e0f-f4241d3131b1/vszdn1n6lpsjbmlzt198.webp',
    },
    {
      title: 'Design Personalizat',
      description: 'Creăm aranjamente unice după preferințele tale',
      number: '03',
      image: 'https://res.cloudinary.com/dm7ttgpta/image/upload/v1763581406/5da3f391-0d05-4fd9-a7d2-fb1a98614479/kc9bod1ii9pm2najso7s.webp',
    },
  ];

  return (
    <div ref={ref} className="min-h-screen bg-[var(--secondary)] py-24 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div 
            className="flex items-center justify-center gap-4 mb-6"
            style={{
              opacity: progress,
              transform: `translateY(${(1 - progress) * 20}px)`,
              transition: 'all 0.3s ease-out',
            }}
          >
            <div className="h-px w-16 bg-[var(--primary)]/40" />
            <span className="text-[var(--primary)] text-xs tracking-widest uppercase serif-light">Serviciile Noastre</span>
            <div className="h-px w-16 bg-[var(--primary)]/40" />
          </div>
          
          <h2 
            className="serif-font text-4xl md:text-6xl font-medium text-[var(--foreground)]"
            style={{
              opacity: progress,
              transform: `translateY(${(1 - progress) * 25}px)`,
              transition: 'all 0.3s ease-out',
            }}
          >
            L&apos;Art des Fleurs
          </h2>
        </div>
        
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {cards.map((card, index) => {
            const cardProgress = Math.max(0, Math.min(1, (progress - index * 0.12) * 1.5));

            return (
              <ServiceCard
                key={index}
                title={card.title}
                description={card.description}
                number={card.number}
                image={card.image}
                href="/shop"
                cardProgress={cardProgress}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Events Section
function EventsSection({ router }: Omit<SectionProps, 't'>) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0.1,
    endThreshold: 0.9,
  });

  const { data, isLoading, error } = useEvents({
    page: 1,
    limit: 3,
    published: true,
  });

  const events = data?.data || [];

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Don't show section if no events and not loading
  if (!isLoading && events.length === 0) {
    return null;
  }

  return (
    <div ref={ref} className="min-h-screen bg-[var(--secondary)] py-24 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div
            className="flex items-center justify-center gap-4 mb-6"
            style={{
              opacity: progress,
              transform: `translateY(${(1 - progress) * 20}px)`,
              transition: 'all 0.3s ease-out',
            }}
          >
            <div className="h-px w-16 bg-[var(--primary)]/40" />
            <span className="text-[var(--primary)] text-xs tracking-widest uppercase serif-light">
              Evenimente Speciale
            </span>
            <div className="h-px w-16 bg-[var(--primary)]/40" />
          </div>

          <h2
            className="serif-font text-4xl md:text-6xl font-medium text-[var(--foreground)] mb-4"
            style={{
              opacity: progress,
              transform: `translateY(${(1 - progress) * 25}px)`,
              transition: 'all 0.3s ease-out',
            }}
          >
            Momente de Neuitat
          </h2>

          <p
            className="serif-light text-lg md:text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto"
            style={{
              opacity: progress,
              transform: `translateY(${(1 - progress) * 25}px)`,
              transition: 'all 0.3s ease-out',
            }}
          >
            Descoperiți evenimentele noastre și petreceți momente memorabile alături de noi
          </p>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--primary)]"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="serif-light text-lg text-[var(--muted-foreground)]">
              Ne pare rău, nu am putut încărca evenimentele.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {events.map((event, index) => {
            const cardProgress = Math.max(0, Math.min(1, (progress - index * 0.12) * 1.5));
            const translateY = (1 - cardProgress) * 40;

            return (
              <Link
                key={event.eventId}
                href={`/events/${event.eventId}`}
                style={{
                  opacity: cardProgress,
                  transform: `translateY(${translateY}px)`,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                className="group relative overflow-hidden cursor-pointer"
              >
                {/* Card Container */}
                <div className="relative h-[500px] bg-[var(--card)] border border-[var(--border)] transition-all duration-500 group-hover:border-[var(--primary)]/50 group-hover:shadow-2xl group-hover:shadow-[var(--primary)]/10">
                  {/* Image */}
                  <div className="relative h-[300px] overflow-hidden">
                    {event.media && event.media.length > 0 && event.media[0].type === 'image' ? (
                      <Image
                        src={event.media[0].url}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-[var(--accent)] to-[var(--primary-background)] flex items-center justify-center">
                        <Calendar className="h-16 w-16 text-[var(--primary)]" />
                      </div>
                    )}
                    {/* Elegant overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-[var(--accent-foreground)]/70 via-[var(--accent-foreground)]/20 to-transparent" />

                    {/* Date Badge */}
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <div className="flex items-center gap-2 text-[var(--primary)]">
                        <Calendar className="h-4 w-4" />
                        <span className="serif-light text-sm font-medium">
                          {formatDate(event.eventDate)}
                        </span>
                      </div>
                    </div>

                    {/* Event Type Badge */}
                    <div className="absolute top-6 right-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          event.eventType === 'upcoming'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-500 text-white'
                        }`}
                      >
                        {event.eventType === 'upcoming' ? 'Viitor' : 'Trecut'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="serif-font text-xl font-medium mb-3 text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                      {event.title}
                    </h3>

                    {event.location && (
                      <div className="flex items-center gap-2 text-[var(--muted-foreground)] text-sm mb-3">
                        <MapPin className="h-4 w-4 text-[var(--primary)]" />
                        <span className="serif-light line-clamp-1">{event.location}</span>
                      </div>
                    )}

                    <p className="serif-light text-[var(--muted-foreground)] text-sm leading-relaxed mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Stats and Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                      <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4 text-[var(--primary)]" />
                          <span>{event.likes || 0}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-[var(--primary)] text-sm font-medium group-hover:text-[var(--hover-primary)] transition-colors">
                        <span className="serif-light">Detalii</span>
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          </div>
        )}

        {/* View All Button */}
        <div
          className="text-center mt-16"
          style={{
            opacity: progress,
            transform: `translateY(${(1 - progress) * 20}px)`,
            transition: 'all 0.3s ease-out',
          }}
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push('/events')}
          >
            Vezi Toate Evenimentele
          </Button>
        </div>
      </div>
    </div>
  );
}

// CTA Section
function CTASection({ t, router }: SectionProps) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0.2,
    endThreshold: 0.8,
  });

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-[var(--primary)] px-8 py-20 relative overflow-hidden">
      {/* Elegant background pattern */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, var(--primary-foreground) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, var(--primary-foreground) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, var(--primary-foreground) 0%, transparent 50%)
          `,
        }} />
      </div>
      
      {/* Decorative corner elements */}
      <div className="absolute top-12 left-12 w-32 h-32 border-l border-t border-[var(--primary-foreground)]/20" />
      <div className="absolute bottom-12 right-12 w-32 h-32 border-r border-b border-[var(--primary-foreground)]/20" />
      
      <div 
        className="text-center max-w-4xl relative z-10"
        style={{
          opacity: progress,
          transform: `translateY(${(1 - progress) * 30}px)`,
          transition: 'all 0.4s ease-out',
        }}
      >
        {/* Top decorative element */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="h-px w-12 bg-[var(--primary-foreground)]/40" />
          <svg className="w-5 h-5 text-[var(--primary-foreground)]/60" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div className="h-px w-12 bg-[var(--primary-foreground)]/40" />
        </div>
        
        <h2 className="serif-font text-5xl md:text-7xl font-medium text-[var(--primary-foreground)] mb-8 leading-tight">
          Începeți Călătoria Voastră
        </h2>
        
        <p className="serif-light text-xl md:text-2xl text-[var(--primary-foreground)]/90 mb-12 leading-relaxed font-light max-w-2xl mx-auto">
          Descoperă frumusețea florilor noastre și găsește buchetul perfect pentru tine sau persoana dragă.
        </p>
        
        {/* Divider */}
        <div className="w-24 h-px bg-[var(--primary-foreground)]/30 mx-auto mb-12" />
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button 
            variant="secondary" 
            size="lg" 
            onClick={() => router.push('/shop')}
          >
            {t('homepage.shopNow')}
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => router.push('/collections')}
          >
            {t('homepage.exploreColl')}
          </Button>
        </div>
        
        {/* Bottom element */}
        <div 
          className="mt-20 flex flex-col items-center gap-4"
          style={{
            opacity: progress * 0.8,
            transition: 'all 0.3s ease-out',
          }}
        >
          <div className="flex items-center gap-8 text-[var(--primary-foreground)]/80 text-sm serif-light">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--primary-foreground)]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Calitate Premium</span>
            </div>
            <div className="h-4 w-px bg-[var(--primary-foreground)]/30" />
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--primary-foreground)]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Livrare Rapidă</span>
            </div>
            <div className="h-4 w-px bg-[var(--primary-foreground)]/30" />
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--primary-foreground)]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>1000+ Clienți</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Footer Section
function FooterSection() {
  return (
    <footer className="bg-[var(--secondary)] text-[var(--foreground)]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Left Column - Company Info */}
          <div className="space-y-4">
            <h3 className="serif-font text-3xl font-semibold text-[var(--foreground)] mb-4">
              Buchetul Simonei
            </h3>
            <p className="serif-light text-base text-[var(--muted-foreground)] leading-relaxed">
              Povești scrise în petale, emoții transmise prin flori.
            </p>
            <div className="space-y-2 text-sm serif-light text-[var(--muted-foreground)]">
              <p className="font-medium">Adresa: Str. Unirii 240, Târnșeni, Neamt</p>
              <p>Program: Luni–Sâmbătă, 09:00–20:00</p>
              <p>Duminica, 10:00-18:00</p>
            </div>
          </div>

          {/* Middle Column - Quick Links */}
          <div className="space-y-4">
            <h4 className="serif-font text-lg font-medium text-[var(--foreground)] mb-4">
              Link-uri Rapide
            </h4>
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="serif-light text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                Acasă
              </Link>
              <Link href="/shop" className="serif-light text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                Galerie foto
              </Link>
              <a href="/contact" className="serif-light text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                Contact
              </a>
            </nav>
          </div>

          {/* Right Column - Social Media */}
          <div className="space-y-4">
            <h4 className="serif-font text-lg font-medium text-[var(--foreground)] mb-4">
              Urmărește-ne
            </h4>
            <div className="flex gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[var(--primary)] hover:bg-[var(--hover-primary)] flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[var(--primary)] hover:bg-[var(--hover-primary)] flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-[var(--border)] pt-8 mb-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm serif-light">
            <a href="/termeni-conditii" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
              Termeni&Condiții
            </a>
            <a href="/politica-cookies" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
              Politica de cookies
            </a>
            <a href="/gdpr" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
              GDPR
            </a>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-[var(--border)] pt-8">
          <h4 className="serif-font text-lg font-medium text-[var(--foreground)] text-center mb-6">
            Metode de plată acceptate
          </h4>
          <p className="text-center text-sm serif-light text-[var(--muted-foreground)] mb-6">
            Plătești în siguranță cu metodele preferate
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
            {/* EuPlatesc */}
            {/* <div className="bg-white p-3 rounded-lg shadow-sm">
              <Image 
                src="https://www.euplatesc.ro/img/euplatesc_logo_mic.jpg" 
                alt="EuPlatesc" 
                width={100} 
                height={40}
                className="h-10 w-auto"
              />
            </div> */}
            
            {/* Visa */}
            {/* <div className="bg-white p-3 rounded-lg shadow-sm">
              <svg className="h-10 w-16" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" fill="white"/>
                <path d="M19.5 10.5H16.5L14 21.5H17L19.5 10.5Z" fill="#00579F"/>
                <path d="M27.5 10.5L24 21.5H27.5L31 10.5H27.5Z" fill="#00579F"/>
              </svg>
            </div> */}
            
            {/* Mastercard */}
            {/* <div className="bg-white p-3 rounded-lg shadow-sm">
              <svg className="h-10 w-16" viewBox="0 0 48 32" fill="none">
                <circle cx="18" cy="16" r="8" fill="#EB001B"/>
                <circle cx="30" cy="16" r="8" fill="#F79E1B"/>
                <path d="M24 10C22 11.5 20.5 13.5 20.5 16C20.5 18.5 22 20.5 24 22C26 20.5 27.5 18.5 27.5 16C27.5 13.5 26 11.5 24 10Z" fill="#FF5F00"/>
              </svg>
            </div> */}
            
            {/* Apple Pay */}
            {/* <div className="bg-white p-3 rounded-lg shadow-sm">
              <svg className="h-10 w-16" viewBox="0 0 48 32" fill="none">
                <path d="M15.5 10.5C14.5 11 14 12 14 13C14 14 15 15 16 15C17 15 18 14 18 13C18 12 17.5 11 16.5 10.5C16 10.5 15.5 10.5 15.5 10.5ZM16 16C14.5 16 13 17 13 18.5C13 20 14 21.5 15.5 21.5C16.5 21.5 17.5 21 18 20C18.5 21 19.5 21.5 20.5 21.5C22 21.5 23 20 23 18.5C23 17 21.5 16 20 16C19 16 18 16.5 17.5 17C17 16.5 16.5 16 16 16Z" fill="black"/>
              </svg>
            </div> */}
          </div>

          {/* Security Info */}
          <div className="text-center space-y-4 mb-8">
            <div className="flex items-center justify-center gap-2 text-sm serif-light text-[var(--muted-foreground)]">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
              <span>Toate tranzacțiile sunt securizate și criptate SSL</span>
            </div>
            <p className="text-sm serif-light text-[var(--muted-foreground)]">
              Procesare securizată prin partenerii noștri de încredere
            </p>
          </div>

          {/* ANPC Badges */}
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://anpc.ro/ce-este-sal/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              {/* <Image 
                src="https://www.anpc.ro/galerie/5c89c00d52821_sol_alternativa_solutionarea_litigiilor.png" 
                alt="ANPC - Soluționarea Alternativă a Litigiilor" 
                width={200} 
                height={80}
                className="h-16 w-auto"
              /> */}
            </a>
            <a 
              href="https://ec.europa.eu/consumers/odr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              {/* <Image 
                src="https://www.anpc.ro/galerie/5c89c4e1a3cea_solutionarea_online_litigiilor.png" 
                alt="ANPC - Soluționarea Online a Litigiilor" 
                width={200} 
                height={80}
                className="h-16 w-auto"
              /> */}
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-primary border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-sm serif-light text-[var(--primary-foreground)]">
            © 2026 Buchetul Simonei. Toate drepturile rezervate.
          </p>
        </div>
      </div>
    </footer>
  );
}