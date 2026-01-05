
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, useTransform, useScroll, useMotionValueEvent, useMotionValue, useSpring, MotionValue, AnimatePresence } from 'framer-motion';
import { ArrowDown, Shield, Scan, Lock, Unlock } from 'lucide-react';
import { useSound } from './SoundManager';

const LETTERS_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ΞΠΣΩλΔ∇ΦΨ";

interface ScrambleCharProps {
  char: string;
  index: number;
  progress: MotionValue<number>;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  triggerGlitch: boolean;
}

const ScrambleChar: React.FC<ScrambleCharProps> = ({ char, index, progress, mouseX, mouseY, triggerGlitch }) => {
  const [displayChar, setDisplayChar] = useState(char);
  const [isLocked, setIsLocked] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // --- RESTORED CHAOS LOGIC ---
  // Calculates random start positions for the fly-in effect on every mount
  const chaos = useMemo(() => {
    // Random angle for direction
    const angle = (index * 137.5) + (Math.random() * 360);
    // Random distance from center
    const distance = 600 + (Math.random() * 800); 
    // Random Z depth
    const zDepth = 400 + (Math.random() * 1200);
    
    return {
      startX: Math.cos(angle * (Math.PI / 180)) * distance,
      startY: Math.sin(angle * (Math.PI / 180)) * distance,
      startZ: zDepth * (Math.random() > 0.5 ? 1 : -1),
      startRotate: (Math.random() - 0.5) * 360,
    };
  }, [index]);

  // Transform scroll progress (0 to 0.5) into movement from chaos -> fixed
  const x = useTransform(progress, [0, 0.6], [chaos.startX, 0]);
  const y = useTransform(progress, [0, 0.6], [chaos.startY, 0]);
  const z = useTransform(progress, [0, 0.6], [chaos.startZ, 0]);
  const rotate = useTransform(progress, [0, 0.6], [chaos.startRotate, 0]);
  const opacity = useTransform(progress, [0, 0.2, 0.6], [0, 1, 1]);

  // Glitch Effect
  useEffect(() => {
    if (char === " ") return;
    let interval: ReturnType<typeof setInterval>;
    if (triggerGlitch) {
        let count = 0;
        const maxCount = 8 + Math.random() * 5;
        interval = setInterval(() => {
            setDisplayChar(LETTERS_POOL[Math.floor(Math.random() * LETTERS_POOL.length)]);
            count++;
            if(count > maxCount) {
                setDisplayChar(char);
                clearInterval(interval);
            }
        }, 60); 
    } else {
        if (!isLocked) {
          interval = setInterval(() => {
            setDisplayChar(LETTERS_POOL[Math.floor(Math.random() * LETTERS_POOL.length)]);
          }, 80);
        } else {
          setDisplayChar(char);
        }
    }
    return () => clearInterval(interval);
  }, [char, isLocked, triggerGlitch]);

  // Lock characters as they arrive
  useMotionValueEvent(progress, "change", (v) => {
    if (!triggerGlitch) {
        if (v > 0.55 && !isLocked) {
            setIsLocked(true);
            setDisplayChar(char);
        }
        if (v < 0.5 && isLocked) setIsLocked(false);
    }
  });

  return (
    <motion.div
      ref={ref}
      className="relative inline-block transform-style-3d will-change-transform"
      style={{ x, y, z, rotate, opacity }}
    >
      <span className="text-[2.2rem] xs:text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black font-display leading-none text-slate-800 dark:text-cyber-text dark:text-white select-none transition-colors duration-500">
        {char === " " ? "\u00A0" : displayChar}
      </span>
    </motion.div>
  );
};

// Decoder Text Component
const DecoderText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
    const [decoded, setDecoded] = useState("");
    
    useEffect(() => {
        let iteration = 0;
        const interval = setInterval(() => {
            setDecoded(text.split("").map((letter, index) => {
                if(index < iteration) return text[index];
                return LETTERS_POOL[Math.floor(Math.random() * 26)];
            }).join(""));
            
            if(iteration >= text.length) clearInterval(interval);
            iteration += 1/3; 
        }, 30);
        return () => clearInterval(interval);
    }, [text]);

    return <span className={className}>{decoded}</span>;
}

// 3D Tilt Container for Main Text
const TiltContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-300, 300], [15, -15]);
    const rotateY = useTransform(x, [-300, 300], [-15, 15]);
    
    // Smooth physics
    const springConfig = { damping: 30, stiffness: 200 };
    const springRotateX = useSpring(rotateX, springConfig);
    const springRotateY = useSpring(rotateY, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{ perspective: 1000 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="flex flex-col items-center justify-center cursor-default py-10"
        >
            <motion.div
                style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: 'preserve-3d' }}
                className="flex flex-wrap justify-center gap-1 md:gap-4 lg:gap-6 px-4 text-center max-w-[100vw]"
            >
                {children}
            </motion.div>
        </motion.div>
    );
}

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { playHover } = useSound();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const [percent, setPercent] = useState(0);
  const [isGlitching, setIsGlitching] = useState(true);
  const [hasScrolledPastHalf, setHasStartedPastHalf] = useState(false);

  const hudOpacity = useTransform(scrollYProgress, [0.7, 0.85], [1, 0]);
  const gateScale = useTransform(scrollYProgress, [0.85, 1], [1, 0.9]);
  const gateOpacity = useTransform(scrollYProgress, [0.9, 1], [1, 0]);
  const gateY = useTransform(scrollYProgress, [0.85, 1], ["0%", "-50%"]); 

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const p = Math.min(100, Math.max(0, Math.floor((v / 0.5) * 100)));
    setPercent(p);
    
    if (v > 0.55 && v < 0.8 && !hasScrolledPastHalf) {
        setHasStartedPastHalf(true);
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 800);
    }
    
    if (v < 0.4) {
        setHasStartedPastHalf(false);
    }
  });

  useEffect(() => {
    setIsGlitching(true);
    const timer = setTimeout(() => {
        setIsGlitching(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const triggerManualGlitch = () => {
      setIsGlitching(true);
      playHover();
      setTimeout(() => setIsGlitching(false), 800);
  };

  const name = "MUSTAFA MIYAJI";

  return (
    <section id="hero" ref={containerRef} className="relative w-full h-[300vh] z-50">
      <div className="sticky top-0 h-screen w-full overflow-hidden perspective-2000">
        
        <motion.div 
            style={{ scale: gateScale, opacity: gateOpacity, y: gateY }}
            className="relative w-full h-full flex flex-col justify-center items-center bg-cyber-ceramic dark:bg-cyber-space shadow-2xl transition-colors duration-500 overflow-hidden"
        >
            {/* Core Animation Behind Text */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-20 dark:opacity-40">
                <motion.div 
                    className="w-full h-full border border-cyan-500/20 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                />
                <motion.div 
                    className="absolute inset-10 border border-purple-500/20 rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, ease: "linear", repeat: Infinity }}
                />
            </div>

            <motion.div 
                style={{ opacity: hudOpacity }}
                className="absolute inset-0 p-6 md:p-12 flex flex-col justify-between pointer-events-none z-20"
            >
                {/* Top Bar HUD */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-xs font-mono text-cyan-700 dark:text-cyan-400">
                            <Shield size={14} /> 
                            <span className="tracking-[0.2em]">SECURE_GATEWAY_V4.2</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar HUD */}
                <div className="flex flex-col items-center gap-4">
                     <div className="w-48 h-1 bg-slate-300 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-cyan-600 dark:bg-cyan-500" 
                            style={{ width: `${percent}%` }}
                        />
                     </div>
                     <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        {percent < 100 ? <Lock size={10} /> : <Unlock size={10} />}
                        IDENTITY_VERIFICATION: <span className="text-slate-900 dark:text-white font-bold">{percent}%</span>
                     </div>
                </div>
            </motion.div>
            
            <TiltContainer>
                <div className="flex flex-wrap justify-center gap-1 md:gap-4 lg:gap-6" onMouseEnter={triggerManualGlitch}>
                    {name.split("").map((c, i) => (
                        <ScrambleChar 
                            key={i} 
                            char={c} 
                            index={i} 
                            progress={scrollYProgress} 
                            mouseX={mouseX} 
                            mouseY={mouseY}
                            triggerGlitch={isGlitching}
                        />
                    ))}
                </div>
            </TiltContainer>

            <motion.div 
                style={{ 
                    opacity: useTransform(scrollYProgress, [0.55, 0.65], [0, 1]),
                    y: useTransform(scrollYProgress, [0.55, 0.65], [20, 0]),
                }}
                className="absolute bottom-[20vh] text-center max-w-2xl px-6 z-20"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-6 backdrop-blur-md">
                    <Scan size={12} className="text-cyan-700 dark:text-cyan-500" />
                    <span className="text-[9px] font-mono text-cyan-800 dark:text-cyan-400 uppercase tracking-widest">Architect Verified</span>
                </div>
                <h2 className="text-xl md:text-3xl font-light text-slate-800 dark:text-slate-200 font-display leading-tight">
                    <DecoderText text="Crafting resilient digital architectures for the next generation." className="block" />
                </h2>
                
                <motion.div 
                    className="mt-12 flex flex-col items-center gap-2"
                    style={{ opacity: useTransform(scrollYProgress, [0.7, 0.8], [1, 0]) }}
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-[0.5em]">Scroll to Enter</span>
                    <ArrowDown size={14} className="text-slate-500 dark:text-slate-400" />
                </motion.div>
            </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
