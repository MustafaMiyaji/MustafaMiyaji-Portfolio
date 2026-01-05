
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [magnetRect, setMagnetRect] = useState<DOMRect | null>(null);
  
  // Use springs for smooth magnetic physics
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Adjusted physics for a "heavier" pull
  const springConfig = isHovering 
    ? { stiffness: 150, damping: 15, mass: 0.5 } // Magnetic: bouncier, snap
    : { stiffness: 1000, damping: 50, mass: 0.1 }; // Normal: Sharp follow

  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      if (isHovering && magnetRect) {
        // Magnetic Logic: Pull towards center of element with a lag
        const centerX = magnetRect.left + magnetRect.width / 2;
        const centerY = magnetRect.top + magnetRect.height / 2;
        
        // Calculate distance from center (delta)
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        
        // Apply magnetic pull: 
        // We move the cursor towards the mouse, but clamped heavily towards the center of the element
        const magneticX = centerX + dx * 0.3; // Stronger pull to center (0.3 factor)
        const magneticY = centerY + dy * 0.3;

        cursorX.set(magneticX);
        cursorY.set(magneticY);
      } else {
        // Standard Follow
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        
        // Check for specific clickable elements that we want to magnetize to
        const magneticElement = 
            target.closest('button') || 
            target.closest('a') || 
            target.closest('[data-cursor="magnetic"]');

        if (magneticElement) {
            setIsHovering(true);
            setMagnetRect(magneticElement.getBoundingClientRect());
        } else if (window.getComputedStyle(target).cursor === 'pointer') {
            setIsHovering(true);
            setMagnetRect(target.getBoundingClientRect());
        } else {
            setIsHovering(false);
            setMagnetRect(null);
        }
    };

    const handleScroll = () => {
        // Clear magnet on scroll to prevent cursor getting stuck in wrong pos relative to viewport
        if (isHovering) {
            setIsHovering(false);
            setMagnetRect(null);
        }
    };

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [cursorX, cursorY, isHovering, magnetRect]);

  return (
    <>
      {/* Main Dot - Stays sharp */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-white dark:bg-cyan-400 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%"
        }}
        animate={{
            scale: isHovering ? 0.3 : 1
        }}
      />
      
      {/* Magnetic Outer Ring - The "Lazy" Follower */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-black dark:border-white rounded-full pointer-events-none z-[9998] opacity-50"
        style={{
            x: smoothX,
            y: smoothY,
            translateX: "-50%",
            translateY: "-50%"
        }}
        animate={{
          width: isHovering ? 80 : 40,
          height: isHovering ? 80 : 40,
          borderColor: isHovering ? 'rgba(6,182,212, 0.6)' : 'currentColor',
          borderWidth: isHovering ? '1px' : '1px',
          backgroundColor: isHovering ? 'rgba(6,182,212, 0.05)' : 'transparent'
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      />
    </>
  );
};

export default CustomCursor;
