import { useScrollProgress } from '../../../../hooks/useScrollProgress';

type RevealCardsProps = {
  scaleFrom: number;
  scaleTo: number;
  staggerDelay: number;
};

export const RevealCards = ({ scaleFrom, scaleTo, staggerDelay }: RevealCardsProps) => {
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0.1,
    endThreshold: 0.9,
  });

  const cards = [
    {
      title: 'Parallax Effect',
      description: 'Elementele se mișcă cu viteze diferite',
      gradient: 'from-pink-500 to-rose-500',
      image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&q=80',
    },
    {
      title: 'Zoom Animation',
      description: 'Imaginile fac zoom când intră în view',
      gradient: 'from-violet-500 to-purple-500',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    },
    {
      title: 'Text Reveal',
      description: 'Textul apare progresiv, cuvânt cu cuvânt',
      gradient: 'from-blue-500 to-cyan-500',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
    },
  ];

  return (
    <div ref={ref} className="min-h-screen bg-[var(--secondary)] dark:bg-[var(--foreground)] py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-16 text-[var(--foreground)] dark:text-[var(--primary-foreground)]">
          Efecte Populare
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => {
            const cardProgress = Math.max(0, Math.min(1, (progress - index * staggerDelay) * 1.5));
            const scale = scaleFrom + cardProgress * (scaleTo - scaleFrom);
            const translateY = (1 - cardProgress) * 50;

            return (
              <div
                key={index}
                style={{
                  transform: `scale(${scale}) translateY(${translateY}px)`,
                  opacity: cardProgress,
                  transition: 'all 0.3s ease-out',
                }}
                className="group relative overflow-hidden rounded-2xl shadow-2xl"
              >
                <div className="h-96 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className={`absolute inset-0 bg-gradient-to-t ${card.gradient} opacity-60 mix-blend-multiply`} />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-[var(--primary-foreground)]">
                  <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
                  <p className="text-white/90">{card.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const revealCardsCode = `import { useScrollProgress } from '@/hooks/useScrollProgress';

export const RevealCards = ({ 
  scaleFrom = 0.8,
  scaleTo = 1.0,
  staggerDelay = 0.15
}) => {
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0.1,
    endThreshold: 0.9,
  });

  const cards = [
    { title: 'Card 1', description: 'Description', gradient: 'from-pink-500 to-rose-500', image: 'image1.jpg' },
    { title: 'Card 2', description: 'Description', gradient: 'from-violet-500 to-purple-500', image: 'image2.jpg' },
    { title: 'Card 3', description: 'Description', gradient: 'from-blue-500 to-cyan-500', image: 'image3.jpg' },
  ];

  return (
    <div ref={ref} className="min-h-screen bg-[var(--secondary)] dark:bg-[var(--foreground)] py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => {
            const cardProgress = Math.max(0, Math.min(1, (progress - index * staggerDelay) * 1.5));
            const scale = scaleFrom + cardProgress * (scaleTo - scaleFrom);
            const translateY = (1 - cardProgress) * 50;

            return (
              <div
                key={index}
                style={{
                  transform: \`scale(\${scale}) translateY(\${translateY}px)\`,
                  opacity: cardProgress,
                  transition: 'all 0.3s ease-out',
                }}
                className="group relative overflow-hidden rounded-2xl shadow-2xl"
              >
                <div className="h-96 overflow-hidden">
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className={\`absolute inset-0 bg-gradient-to-t \${card.gradient} opacity-60 mix-blend-multiply\`} />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-[var(--primary-foreground)]">
                  <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
                  <p className="text-white/90">{card.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};`;
