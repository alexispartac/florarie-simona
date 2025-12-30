'use client';

import { motion, Variants } from 'framer-motion';

interface TextGlowEffectProps {
  text: string;
  className?: string;
  color?: string;
  shadowColor?: string;
  duration?: number;
}

export default function TextGlowEffect({
  text,
  className = '',
  color = 'inherit',
  shadowColor = 'rgba(var(--primary), 0.8)',
  duration = 3
}: TextGlowEffectProps) {
  const letters = Array.from(text);
  
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: 0.03,
        delayChildren: 0.04 * i
      }
    })
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      textShadow: `0 0 10px ${shadowColor}, 0 0 20px ${shadowColor}`,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
        duration: 1
      }
    },
    hidden: {
      opacity: 0,
      x: -20,
      y: 10,
      textShadow: `0 0 25px ${shadowColor}, 0 0 50px ${shadowColor}`,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
        duration: 1
      }
    },
    hover: {
      textShadow: [
        `0 0 10px ${shadowColor}, 0 0 20px ${shadowColor}`,
        `0 0 20px ${shadowColor}, 0 0 40px ${shadowColor}`,
        `0 0 30px ${shadowColor}, 0 0 60px ${shadowColor}`,
        `0 0 10px ${shadowColor}, 0 0 20px ${shadowColor}`
      ],
      transition: {
        duration: duration,
        repeat: Infinity,
        ease: 'easeInOut',
        repeatType: 'loop'
      }
    }
  };

  return (
    <motion.div
      className={`inline-flex ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={child}
          style={{ 
            display: 'inline-block',
            color: color 
          }}
          className='w-inherit'
          custom={index}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.div>
  );
}
