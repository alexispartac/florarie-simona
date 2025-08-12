'use client';
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const IntroScreen: React.FC = () => {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const flowersContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current || !flowersContainerRef.current) return;

    const createEmojiFlowers = () => {
      const flowerEmojis = ['🌸', '🌸', '🌸', '🌸', '🌸'];

      const flowers: HTMLDivElement[] = [];

      for (let i = 0; i < 100; i++) {
        const flower = document.createElement('div');
        flower.className = 'emoji-flower';
        
        const size = Math.random() * 20 + 30; // 30-50px
        const emoji = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];
        
        flower.style.cssText = `
          position: absolute;
          font-size: ${size}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          opacity: 0;
          transform: scale(0) rotate(${Math.random() * 360}deg);
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          user-select: none;
          pointer-events: none;
        `;
        
        flower.textContent = emoji;

        flowersContainerRef.current!.appendChild(flower);
        flowers.push(flower);
      }
      return flowers;
    };

    const flowers = createEmojiFlowers();

    const tl = gsap.timeline({ 
      defaults: { ease: "power2.out" },
      onComplete: () => {
        router.push("/homepage");
      }
    });

    const splitElement = document.querySelector(".split");
    if (!splitElement) return;

    const split = SplitText.create(".split", { type: "words,chars" });

    tl
      .to(containerRef.current, {
        background: "linear-gradient(135deg, #b756a64f 100%, #b756a64f 100%)",
        duration: 1.2,
        ease: "power2.inOut"
      })
      
      .to(flowers, {
        opacity: 1,
        scale: 1,
        rotation: "+=180",
        duration: 0.25,
        stagger: 0.06,
        ease: "back.out(1)"
      })
      
      .from(split.chars, {
        duration: 1,
        y: 120,
        autoAlpha: 0,
        rotationX: -90,
        transformOrigin: "0% 50% -50",
        stagger: {
          amount: 0.8,
          from: "center"
        },
        ease: "back.out(1.5)"
      }, "-=0.5")

      .to(split.words, {
        color: "#ffffffff",
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.inOut"
      })

      .to({}, { duration: 0.5 })

      .add(() => {
        router.push("/");
      });

    const floatingTl = gsap.timeline({ repeat: -1, yoyo: true });
    floatingTl.to(flowers, {
      rotation: "+=360",
      y: "random(-50, 50)",
      x: "random(-40, 40)",
      duration: 3,
      ease: "sine.inOut",
      stagger: 0
    });

    return () => {
      tl.kill();
      floatingTl.kill();
      split.revert();
      flowers.forEach(flower => flower.remove());
    };
  }, [router]);

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
        <h1
          ref={textRef}
          className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl font-bold landscape:text-7xl tracking-wide split text-center"
          style={{
            fontFamily: "'Dancing Script', cursive, serif",
            textShadow: "0 0 40px rgba(255, 255, 255, 0.5)"
          }}
        >
          Buchetul Simonei
        </h1>
      </div>

      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              background: i % 3 === 0 ? 
                `rgba(255, 107, 157, ${Math.random() * 0.5 + 0.2})` : 
                i % 3 === 1 ?
                `rgba(196, 69, 105, ${Math.random() * 0.4 + 0.1})` :
                `rgba(253, 203, 110, ${Math.random() * 0.3 + 0.1})`,
              borderRadius: "50%",
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 4 + 3}s`,
              boxShadow: "0 0 10px currentColor"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default IntroScreen;