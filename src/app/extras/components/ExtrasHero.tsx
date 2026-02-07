import React from 'react';
import { Gift } from 'lucide-react';

interface ExtrasHeroProps {
  title: string;
  subtitle: string;
}

export const ExtrasHero: React.FC<ExtrasHeroProps> = ({ title, subtitle }) => {
  return (
    <div 
      className="relative py-26 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[var(--secondary)]"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1200&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Adaptive overlay based on theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/30 via-[var(--primary)]/20 to-[var(--primary)]/35" />
      
      {/* Decorative corner accents */}
      <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-[var(--primary-foreground)]/20" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-[var(--primary-foreground)]/20" />
      
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Top decorative element with icon */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-12 bg-[var(--primary-foreground)]/40" />
          <Gift className="h-5 w-5 text-[var(--primary-foreground)]/70" />
          <div className="h-px w-12 bg-[var(--primary-foreground)]/40" />
        </div>
        
        <h1 className="serif-font text-4xl font-bold text-[var(--primary-foreground)] sm:text-5xl lg:text-6xl mb-6 drop-shadow-2xl">
          {title}
        </h1>
        <p className="serif-light text-xl text-[var(--primary-foreground)]/95 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
          {subtitle}
        </p>
        
        {/* Bottom decorative line */}
        <div className="mt-8 w-24 h-px bg-[var(--primary-foreground)]/40 mx-auto" />
      </div>
    </div>
  );
};
