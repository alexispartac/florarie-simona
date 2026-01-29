import { useScrollProgress } from '../../../../hooks/useScrollProgress';

type TextRevealProps = {
  wordDelay: number;
  slideDistance: number;
  fadeSpeed: number;
};

export const TextReveal = ({ wordDelay, slideDistance, fadeSpeed }: TextRevealProps) => {
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0.2,
    endThreshold: 0.8,
  });

  const text = "Fiecare cuvânt apare treptat când scrollezi";
  const words = text.split(' ');

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 px-8">
      <div className="max-w-5xl">
        <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight">
          {words.map((word, index) => {
            const wordProgress = Math.max(
              0,
              Math.min(1, (progress - index * wordDelay) * (words.length / 2))
            );
            return (
              <span
                key={index}
                style={{
                  opacity: wordProgress,
                  transform: `translateY(${(1 - wordProgress) * slideDistance}px)`,
                  display: 'inline-block',
                  marginRight: '0.3em',
                  transition: `all ${fadeSpeed}s ease-out`,
                }}
              >
                {word}
              </span>
            );
          })}
        </h2>
      </div>
    </div>
  );
};

export const textRevealCode = `import { useScrollProgress } from '@/hooks/useScrollProgress';

export const TextReveal = ({ 
  wordDelay = 0.1,
  slideDistance = 20,
  fadeSpeed = 0.2
}) => {
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0.2,
    endThreshold: 0.8,
  });

  const text = "Your text here";
  const words = text.split(' ');

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 px-8">
      <div className="max-w-5xl">
        <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight">
          {words.map((word, index) => {
            const wordProgress = Math.max(
              0,
              Math.min(1, (progress - index * wordDelay) * (words.length / 2))
            );
            return (
              <span
                key={index}
                style={{
                  opacity: wordProgress,
                  transform: \`translateY(\${(1 - wordProgress) * slideDistance}px)\`,
                  display: 'inline-block',
                  marginRight: '0.3em',
                  transition: \`all \${fadeSpeed}s ease-out\`,
                }}
              >
                {word}
              </span>
            );
          })}
        </h2>
      </div>
    </div>
  );
};`;
