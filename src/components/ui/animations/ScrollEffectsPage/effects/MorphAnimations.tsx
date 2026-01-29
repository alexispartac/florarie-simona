import { useScrollProgress } from '../../../../hooks/useScrollProgress';

type MorphAnimationsProps = {
  morphSpeed: number;
  rotationIntensity: number;
  scaleIntensity: number;
};

export const MorphAnimations = ({
  morphSpeed,
  rotationIntensity,
  scaleIntensity,
}: MorphAnimationsProps) => {
  const { ref: ref1, progress: progress1 } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0.2,
    endThreshold: 0.8,
  });

  const { ref: ref2, progress: progress2 } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0.2,
    endThreshold: 0.8,
  });

  const { ref: ref3, progress: progress3 } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0.2,
    endThreshold: 0.8,
  });

  // Smooth progress with morphSpeed
  const smoothProgress1 = Math.pow(progress1, morphSpeed);
  const smoothProgress2 = Math.pow(progress2, morphSpeed);
  const smoothProgress3 = Math.pow(progress3, morphSpeed);

  // Circle to Square morph using border-radius
  const getBorderRadius1 = (progress: number) => {
    return `${50 - progress * 50}%`;
  };

  // Diamond to Circle
  const getRotation2 = (progress: number) => {
    return 45 - progress * 45 * rotationIntensity;
  };

  const getBorderRadius2 = (progress: number) => {
    return `${progress * 50}%`;
  };

  // Blob morph using complex border-radius
  const getBlobRadius = (progress: number) => {
    const r1 = 50 - progress * 20;
    const r2 = 50 + progress * 20;
    const r3 = 50 - progress * 10;
    const r4 = 50 + progress * 10;
    return `${r1}% ${r2}% ${r3}% ${r4}%`;
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-20 px-4">
      {/* Title Section */}
      <div className="text-center mb-16 max-w-4xl mx-auto">
        <h2 className="text-6xl font-bold text-[var(--primary-foreground)] mb-4">Morph Animations</h2>
        <p className="text-xl text-[var(--muted-foreground)]">
          Forme geometrice care se transformă pe scroll
        </p>
      </div>

      <div className="space-y-32">
        {/* Morph 1: Circle to Square */}
        <div ref={ref1} className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div
              className="w-64 h-64 mx-auto bg-gradient-to-br from-blue-400 to-purple-600 shadow-2xl transition-all duration-300"
              style={{
                borderRadius: getBorderRadius1(smoothProgress1),
                transform: `scale(${1 + smoothProgress1 * scaleIntensity}) rotate(${
                  smoothProgress1 * 360 * rotationIntensity
                }deg)`,
              }}
            />
            <p className="text-[var(--primary-foreground)] text-xl mt-8 font-semibold">
              Circle → Square
            </p>
            <p className="text-[var(--muted-foreground)] text-sm mt-2">
              Progress: {Math.round(progress1 * 100)}%
            </p>
          </div>
        </div>

        {/* Morph 2: Diamond to Circle */}
        <div ref={ref2} className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div
              className="w-64 h-64 mx-auto bg-gradient-to-br from-pink-400 to-orange-600 shadow-2xl transition-all duration-300"
              style={{
                borderRadius: getBorderRadius2(smoothProgress2),
                transform: `scale(${1 + smoothProgress2 * scaleIntensity}) rotate(${getRotation2(
                  smoothProgress2
                )}deg)`,
              }}
            />
            <p className="text-[var(--primary-foreground)] text-xl mt-8 font-semibold">
              Diamond → Circle
            </p>
            <p className="text-[var(--muted-foreground)] text-sm mt-2">
              Progress: {Math.round(progress2 * 100)}%
            </p>
          </div>
        </div>

        {/* Morph 3: Blob Morph */}
        <div ref={ref3} className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div
              className="w-64 h-64 mx-auto bg-gradient-to-br from-green-400 to-cyan-600 shadow-2xl transition-all duration-300"
              style={{
                borderRadius: getBlobRadius(smoothProgress3),
                transform: `scale(${1 + smoothProgress3 * scaleIntensity}) rotate(${
                  smoothProgress3 * 180 * rotationIntensity
                }deg)`,
              }}
            />
            <p className="text-[var(--primary-foreground)] text-xl mt-8 font-semibold">Organic Blob</p>
            <p className="text-[var(--muted-foreground)] text-sm mt-2">
              Progress: {Math.round(progress3 * 100)}%
            </p>
          </div>
        </div>

        {/* Multi Morph Grid */}
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-[var(--primary-foreground)] text-2xl mb-8 font-semibold">
              Combined Morphs
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[0, 1, 2, 3, 4, 5].map((index) => {
                const offsetProgress = Math.max(
                  0,
                  Math.min(1, progress3 - index * 0.1)
                );
                const smoothOffset = Math.pow(offsetProgress, morphSpeed);
                return (
                  <div
                    key={index}
                    className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-600 shadow-xl transition-all duration-300"
                    style={{
                      borderRadius: getBorderRadius1(smoothOffset),
                      transform: `scale(${
                        0.8 + smoothOffset * scaleIntensity
                      }) rotate(${smoothOffset * 360 * rotationIntensity}deg)`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="text-center mt-20 text-[var(--muted-foreground)]">
        <p className="text-lg">👇 Scroll to see the magic happen</p>
      </div>
    </div>
  );
};

export const morphAnimationsCode = `import { useScrollProgress } from '@/hooks/useScrollProgress';

export const MorphAnimations = ({
  morphSpeed = 1,
  rotationIntensity = 1,
  scaleIntensity = 0.5,
}) => {
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    startThreshold: 0.2,
    endThreshold: 0.8,
  });

  const smoothProgress = Math.pow(progress, morphSpeed);

  // Circle to Square morph
  const getBorderRadius = (progress: number) => {
    return \`\${50 - progress * 50}%\`;
  };

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center">
      <div
        className="w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-600 shadow-2xl"
        style={{
          borderRadius: getBorderRadius(smoothProgress),
          transform: \`scale(\${1 + smoothProgress * scaleIntensity}) rotate(\${
            smoothProgress * 360 * rotationIntensity
          }deg)\`,
          transition: 'all 0.3s ease-out',
        }}
      />
    </div>
  );
};`;
