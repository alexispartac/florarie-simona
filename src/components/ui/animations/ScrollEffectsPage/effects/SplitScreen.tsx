import { useScrollProgress } from '../../../../hooks/useScrollProgress';

type SplitScreenProps = {
  zoomIntensity: number;
  slideDistance: number;
};  

export const SplitScreen = ({ zoomIntensity, slideDistance }: SplitScreenProps) => {
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0.2,
    endThreshold: 0.8,
  });

  return (
    <div ref={ref} className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 relative overflow-hidden bg-[var(--foreground)]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80)',
            transform: `scale(${1 + progress * zoomIntensity}) translateY(${progress * -50}px)`,
            transition: 'all 0.1s ease-out',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50" />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-12 md:p-20 bg-[var(--card)] dark:bg-[var(--foreground)]">
        <div
          style={{
            transform: `translateX(${(1 - progress) * slideDistance}px)`,
            opacity: progress,
            transition: 'all 0.2s ease-out',
          }}
        >
          <h2 className="text-5xl font-bold mb-6 text-[var(--foreground)] dark:text-[var(--primary-foreground)]">
            Design Modern
          </h2>
          <p className="text-xl text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-6">
            Textul apare din dreapta în timp ce imaginea face zoom treptat. 
            Efectul creează o experiență vizuală dinamică și captivantă.
          </p>
          <div className="flex gap-4">
            <div className="h-1 bg-[var(--primary)]" style={{ width: `${progress * 100}%`, transition: 'width 0.2s' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const splitScreenCode = `import { useScrollProgress } from '@/hooks/useScrollProgress';

export const SplitScreen = ({ 
  zoomIntensity = 0.3,
  slideDistance = 100
}) => {
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0.2,
    endThreshold: 0.8,
  });

  return (
    <div ref={ref} className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Image */}
      <div className="w-full md:w-1/2 relative overflow-hidden bg-[var(--foreground)]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(your-image.jpg)',
            transform: \`scale(\${1 + progress * zoomIntensity}) translateY(\${progress * -50}px)\`,
            transition: 'all 0.1s ease-out',
          }}
        />
      </div>

      {/* Right Side - Text */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-12 md:p-20 bg-[var(--card)] dark:bg-[var(--foreground)]">
        <div
          style={{
            transform: \`translateX(\${(1 - progress) * slideDistance}px)\`,
            opacity: progress,
            transition: 'all 0.2s ease-out',
          }}
        >
          <h2 className="text-5xl font-bold mb-6 text-[var(--foreground)] dark:text-[var(--primary-foreground)]">
            Your Title
          </h2>
          <p className="text-xl text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-6">
            Your description text here.
          </p>
        </div>
      </div>
    </div>
  );
};`;
