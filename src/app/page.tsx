'use client';
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import SplitText from "gsap/SplitText";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(SplitText);
}

const IntroScreen: React.FC = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const flowersContainerRef = useRef<HTMLDivElement>(null);

  // Static data pentru a evita hydration mismatch
  const staticFlowers = useMemo(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      size: 30 + (i % 20),
      left: (i * 17) % 100,
      top: (i * 23) % 100,
      rotation: i * 24,
    })), []
  );

  // Static particles pentru consistency
  const staticParticles = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: (i * 23 + 10) % 90,
      top: (i * 17 + 10) % 90,
      size: 2 + (i % 3),
      opacity: 0.3 + (i % 3) * 0.1,
      color: i % 3 === 0 ? '#ff6b9d' : i % 3 === 1 ? '#c4456b' : '#fdcb6e',
      delay: i * 0.2,
      duration: 2 + (i % 2),
    })), []
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !textRef.current || !flowersContainerRef.current) return;

    const createEmojiFlowers = () => {
      const fragment = document.createDocumentFragment();
      const flowers: HTMLDivElement[] = [];

      staticFlowers.forEach(flower => {
        const flowerEl = document.createElement('div');
        flowerEl.className = 'emoji-flower';
        
        flowerEl.style.cssText = `
          position: absolute;
          font-size: ${flower.size}px;
          left: ${flower.left}%;
          top: ${flower.top}%;
          opacity: 0;
          transform: scale(0) rotate(${flower.rotation}deg);
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          user-select: none;
          pointer-events: none;
          will-change: transform, opacity;
          backface-visibility: hidden;
        `;
        
        flowerEl.textContent = '🌸';
        fragment.appendChild(flowerEl);
        flowers.push(flowerEl);
      });

      flowersContainerRef.current!.appendChild(fragment);
      return flowers;
    };

    const flowers = createEmojiFlowers();

    const tl = gsap.timeline({ 
      defaults: { ease: "power2.out" },
      onComplete: () => {
        router.push("/homepage");
      }
    });

    let split: SplitText | null = null;
    try {
      split = new SplitText(textRef.current, { 
        type: "words,chars",
        wordsClass: "split-word",
        charsClass: "split-char"
      });
    } catch (error) {
      console.error("SplitText error:", error);
      setTimeout(() => router.push("/not-found"), 2000);
      return;
    }

    tl
      .to(containerRef.current, {
        background: "linear-gradient(135deg, #bf8fb6ff 60%, #fbb6f3ff 100%)",
        duration: 1.2,
        ease: "power2.inOut"
      })
      
      .to(flowers, {
        opacity: 1,
        scale: 1,
        rotation: "+=180",
        duration: 0.6,
        stagger: 0.02,
        ease: "back.out(1.2)"
      })
      
      .from(split.chars, {
        duration: 0.8,
        y: 80,
        opacity: 0,
        rotationX: -45,
        transformOrigin: "50% 50%",
        stagger: {
          amount: 0.6,
          from: "center"
        },
        ease: "back.out(1.5)"
      }, "-=0.4")

      .to(split.words, {
        color: "#ffffff",
        textShadow: "0 0 25px rgba(255, 255, 255, 0.8)",
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.inOut"
      })

      .to({}, { duration: 1 })

      .to([flowers, split.words], {
        opacity: 0,
        scale: 0.8,
        y: -30,
        duration: 0.6,
        ease: "power2.in"
      })

      .to(containerRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut"
      }, "-=0.2");

    // Floating animation
    const floatingTl = gsap.timeline({ 
      repeat: -1, 
      yoyo: true,
      delay: 1
    });
    
    floatingTl.to(flowers, {
      y: 10,
      x: 5,
      rotation: "+=20",
      duration: 2,
      ease: "sine.inOut",
      stagger: {
        amount: 0.5,
        from: "random"
      }
    });

    return () => {
      tl.kill();
      floatingTl.kill();
      if (split) split.revert();
      flowers.forEach(flower => flower.remove());
    };
  }, [router, isMounted, staticFlowers]);

  // Enhanced loading state pentru SSR consistency
  if (!isMounted) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 pointer-events-none">
          {staticParticles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full animate-bounce"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                opacity: particle.opacity,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              }}
            />
          ))}
        </div>

        <div className="text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-8" style={{ fontFamily: "'Dancing Script', cursive" }}>
            Buchetul Simonei
          </h1>
          
          {/* Beautiful loading animation */}
          <div className="flex flex-col items-center space-y-6">
            {/* Floating flowers loader */}
            <div className="relative">
              <div className="flex space-x-2">
                {['🌸', '🌺', '🌻', '🌹', '🌷'].map((flower, index) => (
                  <div
                    key={index}
                    className="text-3xl animate-bounce"
                    style={{
                      animationDelay: `${index * 0.2}s`,
                      animationDuration: '1.5s',
                    }}
                  >
                    {flower}
                  </div>
                ))}
              </div>
            </div>

            {/* Elegant progress bar */}
            <div className="w-64 h-2 bg-pink-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-pulse">
                <div className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full animate-loading-bar"></div>
              </div>
            </div>

            {/* Loading text with typing effect */}
            <div className="flex items-center space-x-2">
              <span className="text-lg text-gray-700 font-medium">Se încarcă</span>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-pink-500 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
                <div className="w-1 h-1 bg-pink-500 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 h-1 bg-pink-500 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>

            {/* Subtle rotating ring */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-pink-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-pink-500 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-2 border-transparent border-t-purple-400 rounded-full animate-spin-reverse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl">🌸</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating corner decorations */}
        <div className="absolute top-10 left-10 text-4xl opacity-30 animate-pulse">🌸</div>
        <div className="absolute top-20 right-20 text-3xl opacity-25 animate-bounce">🌺</div>
        <div className="absolute bottom-10 left-20 text-5xl opacity-20 animate-pulse">🌷</div>
        <div className="absolute bottom-20 right-10 text-3xl opacity-30 animate-bounce">🌻</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ 
        background: "linear-gradient(135deg, #f6c8eeff 0%, #f6b6ffff 100%)"
      }}
    >
      <div
        ref={flowersContainerRef}
        className="absolute inset-0 pointer-events-none z-10"
      />

      <div className="flex items-center justify-center relative z-30">
        <span
          ref={textRef}
          className="flex flex-col text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl font-bold landscape:text-7xl tracking-wide split text-center"
          style={{
            fontFamily: "'Dancing Script', cursive, serif",
            textShadow: "0 0 40px rgba(255, 255, 255, 0.5)"
          }}
        >
          <p className="text-2xl pb-2 text-red-500">
            Since 2016
          </p>
          <p className="text-2xl pb-2 text-red-500">
            De 10 ani înflorim alaturi de tine!
          </p>
          <h1 className="text-6xl pb-2">
            Buchetul Simonei
          </h1>
          <p className="text-2xl pb-2">
            ~poezia florilor~
          </p>
        </span>
      </div>

      {/* Static particles pentru consistency */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {staticParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default IntroScreen;