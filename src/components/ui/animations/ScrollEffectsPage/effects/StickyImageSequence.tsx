import { useScrollProgress } from '../../../../hooks/useScrollProgress';

type StickyImageSequenceProps = {
  transitionSpeed: number;
  imageCount: number;
};

export const StickyImageSequence = ({ transitionSpeed, imageCount }: StickyImageSequenceProps) => {
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0.1,
    endThreshold: 0.9,
  });

  const images = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
  ];

  const currentImageIndex = Math.floor(progress * imageCount);
  const safeIndex = Math.min(currentImageIndex, images.length - 1);

  return (
    <div ref={ref} className="relative min-h-[200vh] bg-black">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {images.map((img, index) => {
          const isActive = index === safeIndex;
          const isPast = index < safeIndex;

          return (
            <img
              key={index}
              src={img}
              alt={`Scene ${index + 1}`}
              className="absolute w-full h-full object-cover"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isPast ? 'scale(1.1)' : 'scale(1)',
                transition: `opacity ${transitionSpeed}s ease-out, transform ${transitionSpeed}s ease-out`,
              }}
            />
          );
        })}

        <div className="absolute bottom-20 left-0 right-0 text-center">
          <p className="text-white text-2xl font-semibold px-8">
            Imagine {safeIndex + 1} din {images.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export const stickyImageSequenceCode = `import { useScrollProgress } from '@/hooks/useScrollProgress';

export const StickyImageSequence = ({ 
  transitionSpeed = 0.5,
  imageCount = 3
}) => {
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0.1,
    endThreshold: 0.9,
  });

  const images = [
    'image1.jpg',
    'image2.jpg',
    'image3.jpg',
  ];

  const currentImageIndex = Math.floor(progress * imageCount);
  const safeIndex = Math.min(currentImageIndex, images.length - 1);

  return (
    <div ref={ref} className="relative min-h-[200vh] bg-black">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {images.map((img, index) => {
          const isActive = index === safeIndex;
          const isPast = index < safeIndex;

          return (
            <img
              key={index}
              src={img}
              alt={\`Scene \${index + 1}\`}
              className="absolute w-full h-full object-cover"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isPast ? 'scale(1.1)' : 'scale(1)',
                transition: \`opacity \${transitionSpeed}s ease-out, transform \${transitionSpeed}s ease-out\`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};`;
