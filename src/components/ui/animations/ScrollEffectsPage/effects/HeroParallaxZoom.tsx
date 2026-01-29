import { useScrollProgress } from '../../../../hooks/useScrollProgress';

type HeroParallaxZoomProps = {
  zoomIntensity: number;
  blurIntensity: number;
  fadeSpeed: number;
};

export const HeroParallaxZoom = ({ 
  zoomIntensity, 
  blurIntensity, 
  fadeSpeed 
}: HeroParallaxZoomProps) => {
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0,
    endThreshold: 1,
  });

  const scale = 1 + progress * zoomIntensity;
  const blur = progress * blurIntensity;
  const opacity = 1 - progress * fadeSpeed;

  return (
    <div ref={ref} className="relative h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80)',
          transform: `scale(${scale})`,
          filter: `blur(${blur}px)`,
          opacity: opacity,
          transition: 'all 0.1s ease-out',
          willChange: 'transform, filter, opacity',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      
      <div className="relative z-10 flex items-center justify-center h-full px-8">
        <div className="text-center text-white max-w-4xl">
          <h1
            className="text-7xl md:text-9xl font-bold mb-6"
            style={{
              transform: `translateY(${progress * -100}px)`,
              opacity: 1 - progress * 0.7,
              transition: 'all 0.1s ease-out',
            }}
          >
            Parallax Zoom
          </h1>
          <p
            className="text-xl md:text-2xl text-gray-200"
            style={{
              transform: `translateY(${progress * -50}px)`,
              opacity: 1 - progress * 0.5,
              transition: 'all 0.1s ease-out',
            }}
          >
            Scroll pentru a vedea efectul
          </p>
        </div>
      </div>

      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        style={{
          opacity: 1 - progress * 2,
          transition: 'opacity 0.2s ease-out',
        }}
      >
        <div className="flex flex-col items-center gap-2 text-white animate-bounce">
          <span className="text-sm">Scroll Down</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export const heroParallaxZoomCode = `import { useScrollProgress } from '@/hooks/useScrollProgress';

export const HeroParallaxZoom = ({ 
  zoomIntensity = 0.5,
  blurIntensity = 3,
  fadeSpeed = 0.3
}) => {
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0,
    endThreshold: 1,
  });

  const scale = 1 + progress * zoomIntensity;
  const blur = progress * blurIntensity;
  const opacity = 1 - progress * fadeSpeed;

  return (
    <div ref={ref} className="relative h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(your-image.jpg)',
          transform: \`scale(\${scale})\`,
          filter: \`blur(\${blur}px)\`,
          opacity: opacity,
          transition: 'all 0.1s ease-out',
          willChange: 'transform, filter, opacity',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      
      <div className="relative z-10 flex items-center justify-center h-full px-8">
        <div className="text-center text-white max-w-4xl">
          <h1
            className="text-7xl md:text-9xl font-bold mb-6"
            style={{
              transform: \`translateY(\${progress * -100}px)\`,
              opacity: 1 - progress * 0.7,
              transition: 'all 0.1s ease-out',
            }}
          >
            Your Title
          </h1>
        </div>
      </div>
    </div>
  );
};`;
