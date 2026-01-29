import { useScrollProgress } from '../../../../hooks/useScrollProgress';

type ImageZoomSequenceProps = {
  zoomIntensity: number;
  imageCount: number;
  scrollHeight: number;
};

export const ImageZoomSequence = ({ 
  zoomIntensity, 
  imageCount,
  scrollHeight
}: ImageZoomSequenceProps) => {
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0.8,  // Efectul începe când imaginea e aproape full screen
    endThreshold: 0.9,    // Se termină când imaginea începe să iasă
  });

  const images = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80',
  ];

  // Împărțim scroll-ul COMPLET egal între imagini
  const totalImages = Math.min(imageCount, images.length);
  
  // Index imaginii curente (0, 1, 2...)
  const currentImageIndex = Math.min(Math.floor(progress * totalImages), totalImages - 1);
  
  // Progress în cadrul imaginii curente (0 → 1)
  const imageProgress = (progress * totalImages) % 1;
  
  // Zoom simplu: de la 1 la 1+zoomIntensity pentru fiecare imagine
  const currentZoom = 1 + imageProgress * zoomIntensity;

  return (
    <div ref={ref} className="relative bg-[var(--foreground)]" style={{ minHeight: `${scrollHeight}vh` }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Current Image - Simplu, fără tranziție */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-100"
          style={{
            backgroundImage: `url(${images[currentImageIndex]})`,
            transform: `scale(${currentZoom})`,
            opacity: 1,
            willChange: 'transform',
          }}
        />

        {/* Overlay gradient for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

        {/* Info overlay */}
        <div className="absolute bottom-20 left-0 right-0 text-center z-10">
          <div className="bg-black/50 backdrop-blur-sm inline-block px-8 py-4 rounded-full">
            <p className="text-[var(--primary-foreground)] text-xl font-semibold">
              Imagine {currentImageIndex + 1} / {Math.min(imageCount, images.length)}
            </p>
            <div className="mt-2 flex items-center gap-2 justify-center">
              {Array.from({ length: Math.min(imageCount, images.length) }).map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'w-8 bg-white'
                      : index < currentImageIndex
                      ? 'w-2 bg-[var(--card)]/50'
                      : 'w-2 bg-[var(--card)]/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="absolute top-8 left-0 right-0 z-10">
          <div className="max-w-md mx-auto px-6">
            <div className="h-1 bg-[var(--card)]/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--card)] rounded-full transition-all duration-100"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Scroll indicator (only show at start) */}
        {progress < 0.05 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center gap-2 text-[var(--primary-foreground)]">
              <span className="text-sm">Scroll pentru Zoom</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const imageZoomSequenceCode = `import { useScrollProgress } from '@/hooks/useScrollProgress';

export const ImageZoomSequence = ({ 
  zoomIntensity = 3,
  imageCount = 3,
  scrollHeight = 300
}) => {
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0.8,  // Efectul începe când imaginea e aproape full screen
    endThreshold: 0.9,    // Se termină când imaginea începe să iasă
  });

  const images = [
    'image1.jpg',
    'image2.jpg',
    'image3.jpg',
    'image4.jpg',
  ];

  // Împărțim progress-ul în segmente pentru fiecare imagine
  const segmentDuration = 1 / Math.min(imageCount, images.length);
  const currentSegment = Math.floor(progress / segmentDuration);
  const segmentProgress = (progress % segmentDuration) / segmentDuration;

  // Index-ul imaginii curente și următoare
  const currentImageIndex = Math.min(currentSegment, images.length - 1);
  const nextImageIndex = Math.min(currentSegment + 1, images.length - 1);

  // Calculăm zoom-ul și opacity pentru fiecare imagine
  const currentZoom = 1 + segmentProgress * zoomIntensity;
  
  // Tranziția începe când segmentProgress trece de transitionPoint
  const transitionProgress = Math.max(0, (segmentProgress - transitionPoint) / (1 - transitionPoint));
  const currentOpacity = 1 - transitionProgress;
  const nextOpacity = transitionProgress;
  const nextZoom = 1 + transitionProgress * 0.2;

  return (
    <div ref={ref} className="relative bg-[var(--foreground)]" style={{ minHeight: \`\${scrollHeight}vh\` }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Current Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-100"
          style={{
            backgroundImage: \`url(\${images[currentImageIndex]})\`,
            transform: \`scale(\${currentZoom})\`,
            opacity: currentOpacity,
            willChange: 'transform, opacity',
          }}
        />

        {/* Next Image */}
        {currentImageIndex !== nextImageIndex && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-100"
            style={{
              backgroundImage: \`url(\${images[nextImageIndex]})\`,
              transform: \`scale(\${nextZoom})\`,
              opacity: nextOpacity,
              willChange: 'transform, opacity',
            }}
          />
        )}

        {/* Info overlay */}
        <div className="absolute bottom-20 left-0 right-0 text-center z-10">
          <div className="bg-black/50 backdrop-blur-sm inline-block px-8 py-4 rounded-full">
            <p className="text-[var(--primary-foreground)] text-xl font-semibold">
              Imagine {currentImageIndex + 1} / {Math.min(imageCount, images.length)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};`;
