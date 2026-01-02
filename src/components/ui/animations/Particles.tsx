"use client";

import { useEffect, useRef, useState } from "react";
import { Theme } from "@/context/ThemeContext";

// Map theme names to valid CSS color values
const themeColors: Record<Theme, string> = {
  'black': 'rgba(0, 0, 0, 0.8)',
  'petrol': 'rgba(0, 83, 78, 0.8)',
  'bleumarin-decolorat': 'rgba(69, 90, 100, 0.8)',
  'gri-albăstrui': 'rgba(96, 125, 139, 0.8)',
  'turcoaz-stins': 'rgba(0, 150, 136, 0.8)'
};

interface Particle {
  x: number;
  y: number;
  size: number;
  baseX: number;
  baseY: number;
  density: number;
  angle: number;
  radius: number;
  speed: number;
}

interface ParticlesProps {
  color?: string;
}

const Particles = ({ color = 'rgba(0, 0, 0, 0.8)' }: ParticlesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mouse, setMouse] = useState({ 
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, 
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 
  });
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setMouse({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      });
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const init = () => {
        const particles: Particle[] = [];
        const particleCount = 1500; // Increased from 50 to 120 for more particles

        for (let i = 0; i < particleCount; i++) {
            const size = Math.random() * 3 + 1; // Slightly larger particles (1-4px)
            const radius = Math.random() * 600 + 260; // Increased from 200+100 to 350+200 for wider spread
            const speed = Math.random() * 0.004 + 0.003; // Slightly slower for smoother motion
            const angle = Math.random() * Math.PI * 2;

            particles.push({
                x: mouse.x + Math.cos(angle) * radius,
                y: mouse.y + Math.sin(angle) * radius,
                size,
                baseX: mouse.x,
                baseY: mouse.y,
                density: Math.random() * 30 + 1,
                angle,
                radius,
                speed
            });
        }
        particlesRef.current = particles;
    };

    // Animation loop
    const animate = () => {
        if (!ctx || !canvas) return;

        // Clear canvas
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particlesRef.current.forEach(particle => {
            // Update angle for circular motion
            particle.angle += particle.speed;

            // Update particle's base position to follow mouse
            particle.baseX += (mouse.x - particle.baseX) * 0.1;
            particle.baseY += (mouse.y - particle.baseY) * 0.1;

            // In the animate function, update the target position calculation:
            const targetX = window.innerWidth / 2 + Math.cos(particle.angle) * particle.radius;
            const targetY = window.innerHeight / 2 + Math.sin(particle.angle) * particle.radius;

            // And update the base position to always target the center:
            particle.baseX += (window.innerWidth / 2 - particle.baseX) * 0.1;
            particle.baseY += (window.innerHeight / 2 - particle.baseY) * 0.1;

            // Smooth movement towards target position
            particle.x += (targetX - particle.x) * 0.2;
            particle.y += (targetY - particle.y) * 0.2;

            // Create gradient for particle
            const gradient = ctx.createRadialGradient(
                particle.x,
                particle.y,
                0,
                particle.x,
                particle.y,
                particle.size * 2
            );

            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); // White center
            const colorValue = themeColors[color as Theme] || color; // Get valid color from mapping or use the color as is if it's already a valid CSS color
            gradient.addColorStop(1, colorValue); // Fade to the specified color

            // Save the current context
            ctx.save();

            // Apply shadow
            ctx.shadowColor = colorValue; // Use the mapped color value
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            // Draw the particle with gradient
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Restore the context to remove shadow for next draw
            ctx.restore();
        });

        animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Handle mouse move
    const handleMouseMove = (e: MouseEvent) => {
        setMouse({
            x: e.clientX,
            y: e.clientY
        });
    };


    init();
    window.addEventListener('mousemove', handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [color]);

  return (
    <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-auto z-0"
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
        }}
    />
  );
};

export default Particles;