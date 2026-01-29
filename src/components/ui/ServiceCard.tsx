'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ServiceCardProps {
  title: string;
  description: string;
  number: string;
  image: string;
  href?: string;
  cardProgress: number;
}

export default function ServiceCard({
  title,
  description,
  number,
  image,
  href = '/shop',
  cardProgress,
}: ServiceCardProps) {
  const router = useRouter();
  const translateY = (1 - cardProgress) * 40;

  return (
    <div
      style={{
        opacity: cardProgress,
        transform: `translateY(${translateY}px)`,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className="group relative overflow-hidden cursor-pointer"
      onClick={() => router.push(href)}
    >
      {/* Card Container */}
      <div className="relative h-[500px] bg-[var(--card)] border border-[var(--border)] transition-all duration-500 group-hover:border-[var(--primary)]/50 group-hover:shadow-2xl group-hover:shadow-[var(--primary)]/10">
        {/* Image */}
        <div className="relative h-[340px] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90"
          />
          {/* Elegant overlay with better contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Number Badge with theme colors */}
          <div className="absolute top-6 left-6 w-14 h-14 border-2 border-white/80 flex items-center justify-center backdrop-blur-sm bg-black/20">
            <span className="serif-font text-white text-lg font-light drop-shadow-lg">{number}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <h3 className="serif-font text-2xl font-medium mb-3 text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
            {title}
          </h3>
          <p className="serif-light text-[var(--muted-foreground)] text-base leading-relaxed">
            {description}
          </p>
          
          {/* Bottom decorative line */}
          <div className="mt-6 h-px w-0 bg-[var(--primary)] group-hover:w-full transition-all duration-500" />
        </div>
      </div>
    </div>
  );
}
