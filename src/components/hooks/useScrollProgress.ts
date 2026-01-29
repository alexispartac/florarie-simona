import { useEffect, useState, useRef } from 'react';

type ScrollProgressOptions = {
  /** 
   * Start threshold (0-1). 
   * 0 = animation starts when element enters viewport from bottom
   * 0.5 = animation starts when element is halfway in viewport
   * 1 = animation starts when element is fully in viewport
   */
  startThreshold?: number;
  /** 
   * End threshold (0-1). 
   * When progress reaches 1 (animation complete)
   * 0.8 = progress reaches 1 when element is 80% through viewport
   */
  endThreshold?: number;
};

/**
 * Returns a progress value (0-1) based on how much the element has scrolled into view.
 * Progress 0 = animation starts (element entering viewport)
 * Progress 1 = animation complete (element fully visible)
 */
export const useScrollProgress = <T extends HTMLElement>(
  options: ScrollProgressOptions = {}
) => {
  const { startThreshold = 0, endThreshold = 0.8 } = options;
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;

      // Element position relative to viewport (top edge)
      const elementTop = rect.top;

      // Define start and end points for the animation
      // Start: when element starts entering viewport
      const startPoint = windowHeight - (elementHeight * startThreshold);
      
      // End: when element has scrolled through the viewport
      const endPoint = windowHeight * (1 - endThreshold);

      // Calculate progress
      if (elementTop > startPoint) {
        // Element hasn't reached start point yet
        setProgress(0);
      } else if (elementTop < endPoint) {
        // Element has passed end point - animation complete
        setProgress(1);
      } else {
        // Element is between start and end - calculate progress
        const totalDistance = startPoint - endPoint;
        const currentDistance = startPoint - elementTop;
        const newProgress = currentDistance / totalDistance;
        
        // Clamp between 0 and 1 with smooth easing
        setProgress(Math.max(0, Math.min(1, newProgress)));
      }
    };

    // Run on mount and scroll
    handleScroll();
    
    // Use requestAnimationFrame for smoother updates
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [startThreshold, endThreshold]);

  return { ref, progress };
};
