import { useScrollProgress } from '../../../../hooks/useScrollProgress';

type EnhancedZoomShowcaseProps = {
  zoomIntensity: number;
  imageCount: number;
  scrollHeight: number;
};

type Slide = {
  image: string;
  title: string;
  description: string;
  backgroundColor: string;
  textPosition: 'left' | 'right';
};

export const EnhancedZoomShowcase = ({ 
  zoomIntensity, 
  imageCount,
  scrollHeight
}: EnhancedZoomShowcaseProps) => {
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0.8,
    endThreshold: 0.9,
  });

  const slides: Slide[] = [
    {
      image: 'https://images.unsplash.com/photo-1592286927505-b0c2d5d2f182?w=800&q=80',
      title: 'Premium Design',
      description: 'Experience the perfect blend of elegance and innovation with our latest flagship device.',
      backgroundColor: 'from-slate-900 via-purple-900 to-slate-900',
      textPosition: 'left',
    },
    {
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      title: 'Stunning Display',
      description: 'Immerse yourself in brilliant colors and crystal-clear resolution that brings everything to life.',
      backgroundColor: 'from-blue-900 via-cyan-900 to-blue-900',
      textPosition: 'right',
    },
    {
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80',
      title: 'Powerful Performance',
      description: 'Lightning-fast processing power that handles everything you throw at it with ease.',
      backgroundColor: 'from-indigo-900 via-purple-900 to-pink-900',
      textPosition: 'left',
    },
    {
      image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&q=80',
      title: 'All-Day Battery',
      description: 'Power through your entire day without worrying about running out of charge.',
      backgroundColor: 'from-emerald-900 via-teal-900 to-cyan-900',
      textPosition: 'right',
    },
  ];

  // Calculăm care slide e activ
  const totalSlides = Math.min(imageCount, slides.length);
  const currentSlideIndex = Math.min(Math.floor(progress * totalSlides), totalSlides - 1);
  const slideProgress = (progress * totalSlides) % 1;
  
  // Zoom pe slide-ul curent
  const currentZoom = 1 + slideProgress * zoomIntensity;
  
  // Slide curent
  const currentSlide = slides[currentSlideIndex];
  
  // Calculăm opacity și position pentru text
  const textOpacity = Math.min(slideProgress * 2, 1); // Apare rapid
  const textTranslateX = currentSlide.textPosition === 'left' 
    ? (1 - textOpacity) * -100  // Din stânga
    : (1 - textOpacity) * 100;   // Din dreapta

  return (
    <div ref={ref} className="relative bg-[var(--foreground)]" style={{ minHeight: `${scrollHeight}vh` }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Background with color transition */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${currentSlide.backgroundColor} transition-all duration-700`}
        />

        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/60" />

        {/* Product/Phone Image - Center */}
        <div className="relative z-10 flex items-center justify-center">
          <div
            className="transition-transform duration-100"
            style={{
              transform: `scale(${currentZoom})`,
              willChange: 'transform',
            }}
          >
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-64 h-auto md:w-96 object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Text Content - Slides from side */}
        <div 
          className={`absolute ${
            currentSlide.textPosition === 'left' ? 'left-8 md:left-20' : 'right-8 md:right-20'
          } top-1/2 -translate-y-1/2 max-w-md z-20`}
          style={{
            opacity: textOpacity,
            transform: `translateY(-50%) translateX(${textTranslateX}px)`,
            transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
          }}
        >
          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl font-bold text-[var(--primary-foreground)] leading-tight">
              {currentSlide.title}
            </h2>
            <p className="text-xl text-[var(--muted-foreground)] leading-relaxed">
              {currentSlide.description}
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-[var(--card)] text-[var(--foreground)] rounded-full font-semibold hover:bg-[var(--muted)] transition-colors">
                Learn More
              </button>
              <button className="px-8 py-3 border-2 border-[var(--border)] text-[var(--primary-foreground)] rounded-full font-semibold hover:bg-[var(--card)] hover:text-[var(--foreground)] transition-colors">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <div
              key={index}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlideIndex
                  ? 'w-12 h-3 bg-white'
                  : 'w-3 h-3 bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="absolute top-8 right-8 text-white/60 font-mono text-sm z-20">
          {String(currentSlideIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
        </div>

        {/* Scroll Indicator (only at start) */}
        {progress < 0.05 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
            <div className="flex flex-col items-center gap-2 text-white/80">
              <span className="text-sm font-medium">Scroll to Explore</span>
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

export const enhancedZoomShowcaseCode = `import { useScrollProgress } from '@/hooks/useScrollProgress';

type Slide = {
  image: string;
  title: string;
  description: string;
  backgroundColor: string;
  textPosition: 'left' | 'right';
};

export const EnhancedZoomShowcase = ({ 
  zoomIntensity = 3,
  imageCount = 4,
  scrollHeight = 400
}) => {
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0.8,
    endThreshold: 0.9,
  });

  const slides: Slide[] = [
    {
      image: 'product1.jpg',
      title: 'Premium Design',
      description: 'Your description here',
      backgroundColor: 'from-slate-900 via-purple-900 to-slate-900',
      textPosition: 'left',
    },
    // ... more slides
  ];

  const totalSlides = Math.min(imageCount, slides.length);
  const currentSlideIndex = Math.min(Math.floor(progress * totalSlides), totalSlides - 1);
  const slideProgress = (progress * totalSlides) % 1;
  const currentZoom = 1 + slideProgress * zoomIntensity;
  const currentSlide = slides[currentSlideIndex];
  
  const textOpacity = Math.min(slideProgress * 2, 1);
  const textTranslateX = currentSlide.textPosition === 'left' 
    ? (1 - textOpacity) * -100
    : (1 - textOpacity) * 100;

  return (
    <div ref={ref} className="relative bg-[var(--foreground)]" style={{ minHeight: \`\${scrollHeight}vh\` }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Background with color */}
        <div className={\`absolute inset-0 bg-gradient-to-br \${currentSlide.backgroundColor} transition-all duration-700\`} />

        {/* Product Image */}
        <div style={{ transform: \`scale(\${currentZoom})\` }}>
          <img src={currentSlide.image} alt={currentSlide.title} className="w-96 object-contain" />
        </div>

        {/* Text from side */}
        <div 
          style={{
            opacity: textOpacity,
            transform: \`translateY(-50%) translateX(\${textTranslateX}px)\`,
          }}
        >
          <h2>{currentSlide.title}</h2>
          <p>{currentSlide.description}</p>
        </div>
      </div>
    </div>
  );
};`;
