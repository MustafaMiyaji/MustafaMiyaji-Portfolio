
import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [magnetRect, setMagnetRect] = useState<DOMRect | null>(null);
  
  // Track raw mouse position to restore it during scroll events
  const mousePos = useRef({ x: -100, y: -100 });
  
  // Use springs for smooth magnetic physics
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Adjusted physics: Reduced mass for snappier recovery
  const springConfig = isHovering 
    ? { stiffness: 120, damping: 20, mass: 0.5 } // Magnetic
    : { stiffness: 1000, damping: 50, mass: 0.1 }; // Sharp follow

  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      // Always update raw position
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (isHovering && magnetRect) {
        // Magnetic Logic: Pull towards center of element
        const centerX = magnetRect.left + magnetRect.width / 2;
        const centerY = magnetRect.top + magnetRect.height / 2;
        
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        
        const magneticX = centerX + dx * 0.2; 
        const magneticY = centerY + dy * 0.2;

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
        // CRITICAL FIX: On scroll, immediately reset cursor to raw mouse position
        // This prevents the cursor from sticking to a stale magnetic position
        // as the element moves away during scroll.
        if (isHovering) {
            setIsHovering(false);
            setMagnetRect(null);
        }
        cursorX.set(mousePos.current.x);
        cursorY.set(mousePos.current.y);
    };

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('scroll', handleScroll, { passive: true });

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
        className="fixed top-0 left-0 w-3 h-3 bg-slate-900 dark:bg-cyan-400 rounded-full pointer-events-none z-[50000] mix-blend-difference"
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
      
      {/* Magnetic Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-slate-900 dark:border-white rounded-full pointer-events-none z-[49999] opacity-50"
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
          borderWidth: isHovering ? '2px' : '1px',
          backgroundColor: isHovering ? 'rgba(6,182,212, 0.05)' : 'transparent'
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      />
    </>
  );
};

export default CustomCursor;
