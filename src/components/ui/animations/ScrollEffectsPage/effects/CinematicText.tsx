import { useScrollProgress } from '../../../../hooks/useScrollProgress';

type CinematicTextProps = {
  minSize: number;
  maxSize: number;
  letterSpacing: number;
};

export const CinematicText = ({ minSize, maxSize, letterSpacing }: CinematicTextProps) => {
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0.1,
    endThreshold: 0.9,
  });

  const fontSize = minSize + progress * (maxSize - minSize);
  const spacing = progress * letterSpacing;

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-[var(--foreground)] px-8">
      <h2
        className="font-bold text-center bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
        style={{
          fontSize: `${fontSize}rem`,
          letterSpacing: `${spacing}rem`,
          opacity: Math.max(0.3, progress),
          transition: 'all 0.1s ease-out',
          lineHeight: 1.2,
        }}
      >
        WOW
      </h2>
    </div>
  );
};

export const cinematicTextCode = `import { useScrollProgress } from '@/hooks/useScrollProgress';

export const CinematicText = ({ 
  minSize = 2,
  maxSize = 8,
  letterSpacing = 0.5
}) => {
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0.1,
    endThreshold: 0.9,
  });

  const fontSize = minSize + progress * (maxSize - minSize);
  const spacing = progress * letterSpacing;

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-[var(--foreground)] px-8">
      <h2
        className="font-bold text-center bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
        style={{
          fontSize: \`\${fontSize}rem\`,
          letterSpacing: \`\${spacing}rem\`,
          opacity: Math.max(0.3, progress),
          transition: 'all 0.1s ease-out',
          lineHeight: 1.2,
        }}
      >
        Your Text
      </h2>
    </div>
  );
};`;
