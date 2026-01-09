
import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [magnetRect, setMagnetRect] = useState<DOMRect | null>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = isHovering 
    ? { stiffness: 120, damping: 20, mass: 0.5 }
    : { stiffness: 1000, damping: 50, mass: 0.1 };

  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (isHovering && magnetRect) {
        const centerX = magnetRect.left + magnetRect.width / 2;
        const centerY = magnetRect.top + magnetRect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const magneticX = centerX + dx * 0.2; 
        const magneticY = centerY + dy * 0.2;

        cursorX.set(magneticX);
        cursorY.set(magneticY);
      } else {
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
      {/* Main Dot */}
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
      
      {/* Magnetic Lens Ring */}
      <motion.div
        className="fixed top-0 left-0 border border-slate-900 dark:border-white rounded-full pointer-events-none z-[49999]"
        style={{
            x: smoothX,
            y: smoothY,
            translateX: "-50%",
            translateY: "-50%",
            // Lens Distortion Effect
            backdropFilter: isHovering ? "hue-rotate(90deg) blur(1px)" : "none"
        }}
        animate={{
          width: isHovering ? 80 : 40,
          height: isHovering ? 80 : 40,
          borderColor: isHovering ? 'rgba(6,182,212, 0.6)' : 'rgba(255,255,255,0.3)',
          borderWidth: isHovering ? '2px' : '1px',
          backgroundColor: isHovering ? 'rgba(6,182,212, 0.05)' : 'transparent'
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      />
    </>
  );
};

export default CustomCursor;
