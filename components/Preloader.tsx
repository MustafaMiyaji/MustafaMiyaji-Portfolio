
import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const SYMBOLS = "λ Ω Δ Σ Φ Ψ 0 1 Ξ Π Γ";

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);
  const [glitchText, setGlitchText] = useState("");

  useEffect(() => {
    // Only run if not complete
    if (percent >= 100) return;

    const timer = setInterval(() => {
      setPercent(p => {
        if (p >= 100) return 100;
        return p + Math.floor(Math.random() * 3) + 1;
      });
    }, 30);

    const glitchInterval = setInterval(() => {
      let result = "";
      for (let i = 0; i < 5; i++) {
        result += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)] + " ";
      }
      setGlitchText(result);
    }, 100);

    return () => {
      clearInterval(timer);
      clearInterval(glitchInterval);
    };
  }, [percent]);

  useEffect(() => {
    if (percent >= 100) {
        const timeout = setTimeout(onComplete, 800);
        return () => clearTimeout(timeout);
    }
  }, [percent, onComplete]);

  // Memoize random symbols to prevent re-generation during renders
  const backgroundSymbols = useMemo(() => {
      return Array.from({ length: 800 }).map((_, i) => ({
          key: i,
          char: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          delay: Math.random() * 2
      }));
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 z-[99999] bg-[#030014] flex flex-col items-center justify-center font-mono overflow-hidden"
      exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Background Matrix-style symbols */}
      <div className="absolute inset-0 opacity-[0.05] text-[10px] flex flex-wrap gap-2 p-4 pointer-events-none select-none overflow-hidden content-start">
         {backgroundSymbols.map((item) => (
           <span key={item.key} className="animate-pulse" style={{ animationDelay: `${item.delay}s` }}>
              {item.char}
           </span>
         ))}
      </div>

      <div className="relative flex flex-col items-center">
        <motion.div 
          className="text-cyan-500 text-8xl font-black mb-8 italic"
          animate={{ x: [-2, 2, -2], skewX: [-2, 2, -2] }}
          transition={{ duration: 0.1, repeat: Infinity }}
        >
          {percent}<span className="text-2xl not-italic ml-2">%</span>
        </motion.div>
        
        <div className="w-64 h-[2px] bg-slate-900 relative overflow-hidden">
          <motion.div 
            className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,1)]"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="text-[10px] text-cyan-500 tracking-[1em] uppercase">MIYAJI Neural Link</div>
          <div className="text-[8px] text-slate-600 font-mono h-4">{glitchText}</div>
        </div>
      </div>

      {/* Side Brackets */}
      <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-cyan-500/20" />
      <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-cyan-500/20" />
    </motion.div>
  );
};

export default Preloader;
