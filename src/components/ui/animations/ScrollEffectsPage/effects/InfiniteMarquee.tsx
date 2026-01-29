import { useState } from 'react';

type InfiniteMarqueeProps = {
  speed: number;
  direction: 'left' | 'right';
  pauseOnHover: boolean;
};

export const InfiniteMarquee = ({ 
  speed, 
  direction,
  pauseOnHover
}: InfiniteMarqueeProps) => {
  const [isPaused, setIsPaused] = useState(false);

  // Content pentru marquee - poți customiza
  const items = [
    { icon: '🚀', text: 'React 19' },
    { icon: '⚡', text: 'TypeScript' },
    { icon: '🎨', text: 'Tailwind CSS' },
    { icon: '🔥', text: 'Vite' },
    { icon: '✨', text: 'Custom Hooks' },
    { icon: '🎯', text: 'Zero Dependencies' },
    { icon: '💎', text: 'Premium Design' },
    { icon: '🌟', text: 'Smooth Animations' },
  ];

  // Calculăm durata animației bazată pe speed (1-10)
  // Speed mai mare = animație mai rapidă
  const animationDuration = 30 / speed; // seconds

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-4">
      {/* Title Section */}
      <div className="text-center mb-16 max-w-4xl mx-auto">
        <h2 className="text-6xl font-bold text-[var(--primary-foreground)] mb-4">
          Infinite Marquee
        </h2>
        <p className="text-xl text-[var(--muted-foreground)]">
          Endless scrolling animation - perfect for showcasing features, logos, or testimonials
        </p>
      </div>

      {/* Marquee Container */}
      <div className="w-[1000px] space-y-8 overflow-hidden mx-auto">
        {/* Marquee Row 1 - Normal */}
        <div 
          className="relative flex overflow-hidden"
          onMouseEnter={() => pauseOnHover && setIsPaused(true)}
          onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        >
          <div
            className={`flex gap-8 ${isPaused ? '' : 'animate-marquee'}`}
            style={{
              animationDuration: `${animationDuration}s`,
              animationDirection: direction === 'left' ? 'normal' : 'reverse',
            }}
          >
            {/* Duplicate items for seamless loop */}
            {[...items, ...items, ...items].map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 bg-[var(--card)]/10 backdrop-blur-sm border border-[var(--border)]/20 rounded-2xl px-8 py-6 flex items-center gap-4 hover:bg-[var(--card)]/20 transition-all hover:scale-105"
              >
                <span className="text-4xl">{item.icon}</span>
                <span className="text-2xl font-bold text-[var(--primary-foreground)] whitespace-nowrap">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Row 2 - Reverse direction */}
        <div className="relative flex overflow-hidden">
          <div
            className="flex gap-8 animate-marquee"
            style={{
              animationDuration: `${animationDuration * 1.2}s`,
              animationDirection: direction === 'left' ? 'reverse' : 'normal',
            }}
          >
            {[...items, ...items, ...items].map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl px-8 py-6 flex items-center gap-4 hover:shadow-2xl transition-all hover:scale-105"
              >
                <span className="text-4xl">{item.icon}</span>
                <span className="text-2xl font-bold text-[var(--primary-foreground)] whitespace-nowrap">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Row 3 - Different speed */}
        <div className="relative flex overflow-hidden">
          <div
            className="flex gap-8 animate-marquee"
            style={{
              animationDuration: `${animationDuration * 0.8}s`,
              animationDirection: direction === 'left' ? 'normal' : 'reverse',
            }}
          >
            {[...items, ...items, ...items].map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 bg-[var(--card)]/5 border-2 border-[var(--border)]/30 rounded-2xl px-8 py-6 flex items-center gap-4 hover:border-[var(--border)]/60 transition-all hover:scale-105"
              >
                <span className="text-4xl">{item.icon}</span>
                <span className="text-2xl font-bold text-[var(--primary-foreground)] whitespace-nowrap">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Text */}
      <div className="mt-16 text-center text-[var(--muted-foreground)]">
        <p className="text-lg">
          {pauseOnHover ? '🖱️ Hover to pause' : '🔄 Always scrolling'}
        </p>
        <p className="text-sm mt-2">
          Speed: {speed} | Direction: {direction === 'left' ? '←' : '→'}
        </p>
      </div>

      {/* Add the CSS animation in a style tag */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        .animate-marquee {
          animation: marquee linear infinite;
          animation-play-state: ${isPaused ? 'paused' : 'running'};
        }
      `}</style>
    </div>
  );
};

export const infiniteMarqueeCode = `import { useState } from 'react';

export const InfiniteMarquee = ({ 
  speed = 5,
  direction = 'left',
  pauseOnHover = true
}) => {
  const [isPaused, setIsPaused] = useState(false);

  const items = [
    { icon: '🚀', text: 'React 19' },
    { icon: '⚡', text: 'TypeScript' },
    // ... more items
  ];

  const animationDuration = 30 / speed; // seconds

  return (
    <div className="w-full overflow-hidden">
      <div 
        className="relative flex"
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      >
        <div
          className={\`flex gap-8 \${isPaused ? '' : 'animate-marquee'}\`}
          style={{
            animationDuration: \`\${animationDuration}s\`,
            animationDirection: direction === 'left' ? 'normal' : 'reverse',
          }}
        >
          {/* Duplicate items 3x for seamless loop */}
          {[...items, ...items, ...items].map((item, index) => (
            <div key={index} className="flex-shrink-0 bg-[var(--card)]/10 rounded-2xl px-8 py-6">
              <span className="text-4xl">{item.icon}</span>
              <span className="text-2xl font-bold text-[var(--primary-foreground)]">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{\`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee linear infinite;
          animation-play-state: \${isPaused ? 'paused' : 'running'};
        }
      \`}</style>
    </div>
  );
};`;
