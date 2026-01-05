
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, useTransform, useScroll, MotionValue, useMotionValueEvent, useMotionValue, useSpring } from 'framer-motion';
import { Activity, ArrowDown, Cpu, Lock, Unlock, Wifi, Shield } from 'lucide-react';

// Added cybernetic symbols to the pool
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

  // Magnetic Repulsion Logic
  const distance = useTransform([mouseX, mouseY], ([latestX, latestY]: any[]) => {
    if (!ref.current) return 0;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dist = Math.sqrt(Math.pow(latestX - centerX, 2) + Math.pow(latestY - centerY, 2));
    return dist;
  });

  const repelX = useTransform([mouseX, distance], ([latestX, dist]: any[]) => {
     if (!ref.current || dist > 200) return 0;
     const rect = ref.current.getBoundingClientRect();
     const centerX = rect.left + rect.width / 2;
     return ((centerX - latestX) / dist) * 50; 
  });
  const repelY = useTransform([mouseY, distance], ([latestY, dist]: any[]) => {
     if (!ref.current || dist > 200) return 0;
     const rect = ref.current.getBoundingClientRect();
     const centerY = rect.top + rect.height / 2;
     return ((centerY - latestY) / dist) * 50; 
  });
  
  const smoothRepelX = useSpring(repelX, { stiffness: 150, damping: 15 });
  const smoothRepelY = useSpring(repelY, { stiffness: 150, damping: 15 });

  const chaos = useMemo(() => {
    const angle = (index * 137.5) + (Math.random() * 360);
    const distance = 800 + (Math.random() * 400); 
    const zDepth = 600 + (Math.random() * 800);
    
    return {
      startX: Math.cos(angle) * distance,
      startY: Math.sin(angle) * distance,
      startZ: zDepth * (Math.random() > 0.5 ? 1 : -1),
      rotation: Math.random() * 360 - 180,
    };
  }, [index]);

  const x = useTransform(progress, [0, 0.5], [chaos.startX, 0]);
  const y = useTransform(progress, [0, 0.5], [chaos.startY, 0]);
  const z = useTransform(progress, [0, 0.5], [chaos.startZ, 0]);
  const rotate = useTransform(progress, [0, 0.5], [chaos.rotation, 0]);
  const opacity = useTransform(progress, [0, 0.2, 0.5], [0, 1, 1]);

  const textShadow = useTransform(progress, 
    [0, 0.4, 0.5], 
    ["-2px 0px red, 2px 0px cyan", "-4px 0px red, 4px 0px cyan", "0px 0px transparent"]
  );

  const filter = useTransform(progress, [0, 0.4, 0.5], ["blur(30px) brightness(2)", "blur(10px) brightness(1.5)", "blur(0px) brightness(1)"]);

  // Scramble and Glitch Effect
  useEffect(() => {
    if (char === " ") return;
    let interval: ReturnType<typeof setInterval>;
    
    // Initial entry glitch or scroll trigger
    if (triggerGlitch) {
        let count = 0;
        const maxCount = 15 + Math.random() * 10; // Number of swaps before settling
        
        interval = setInterval(() => {
            setDisplayChar(LETTERS_POOL[Math.floor(Math.random() * LETTERS_POOL.length)]);
            count++;
            if(count > maxCount) {
                setDisplayChar(char);
                clearInterval(interval);
            }
        }, 50); 
    } else {
        if (!isLocked) {
          interval = setInterval(() => {
            setDisplayChar(LETTERS_POOL[Math.floor(Math.random() * LETTERS_POOL.length)]);
          }, 50);
        } else {
          setDisplayChar(char);
        }
    }
    return () => clearInterval(interval);
  }, [char, isLocked, triggerGlitch]);

  useMotionValueEvent(progress, "change", (v) => {
    if (!triggerGlitch) {
        if (v > 0.48 && !isLocked) {
            setIsLocked(true);
            setDisplayChar(char);
        }
        if (v < 0.45 && isLocked) setIsLocked(false);
    }
  });

  return (
    <motion.div
      ref={ref}
      className="relative inline-block transform-style-3d will-change-transform"
      style={{ 
        x: useTransform(() => x.get() + smoothRepelX.get()), 
        y: useTransform(() => y.get() + smoothRepelY.get()), 
        z, 
        rotate, 
        opacity,
        filter,
        textShadow
      }}
      animate={triggerGlitch ? {
        scale: [1, 1.1, 0.9, 1], // Subtle distortion on entry
        skewX: [0, -10, 10, 0],
      } : {}}
      transition={{ duration: 0.5 }}
    >
      <span className="text-6xl md:text-9xl font-black font-display leading-none text-cyber-text dark:text-white select-none">
        {char === " " ? "\u00A0" : displayChar}
      </span>
    </motion.div>
  );
};

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const [percent, setPercent] = useState(0);
  const [isGlitching, setIsGlitching] = useState(true);
  const [hasScrolledPastHalf, setHasScrolledPastHalf] = useState(false);

  const hudOpacity = useTransform(scrollYProgress, [0.7, 0.85], [1, 0]);
  const gateScale = useTransform(scrollYProgress, [0.85, 1], [1, 0.9]);
  const gateOpacity = useTransform(scrollYProgress, [0.9, 1], [1, 0]);
  const gateY = useTransform(scrollYProgress, [0.85, 1], ["0%", "-50%"]); 

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const p = Math.min(100, Math.max(0, Math.floor((v / 0.5) * 100)));
    setPercent(p);
    
    // Trigger secondary glitch strictly when crossing 0.55 threshold
    if (v > 0.55 && v < 0.8 && !hasScrolledPastHalf) {
        setHasScrolledPastHalf(true);
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 800); // Transient burst
    }
    
    if (v < 0.4) {
        setHasScrolledPastHalf(false);
    }
  });

  // Trigger initial glitch on mount
  useEffect(() => {
    setIsGlitching(true);
    // Longer initial duration for the symbol swap effect
    const timer = setTimeout(() => {
        setIsGlitching(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const name = "MUSTAFA";

  return (
    <section id="hero" ref={containerRef} className="relative w-full h-[300vh] z-50">
      <div className="sticky top-0 h-screen w-full overflow-hidden perspective-2000">
        
        {/* The Gate Container */}
        <motion.div 
            style={{ scale: gateScale, opacity: gateOpacity, y: gateY }}
            className="relative w-full h-full flex flex-col justify-center items-center bg-cyber-ceramic dark:bg-cyber-space shadow-2xl transition-colors duration-500"
        >
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                <div className="h-full w-full bg-[linear-gradient(to_right,#00000012_1px,transparent_1px),linear-gradient(to_bottom,#00000012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            {/* HUD Elements */}
            <motion.div 
                style={{ opacity: hudOpacity }}
                className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between pointer-events-none z-20"
            >
                {/* Top Bar */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-xs font-mono text-cyan-700 dark:text-cyan-400">
                            <Shield size={14} /> 
                            <span className="tracking-[0.2em]">SECURE_GATEWAY_V4</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-500 uppercase tracking-widest">
                            {percent === 100 ? 'SYSTEM_LOCKED' : 'CALIBRATING_NEURAL_LINK...'}
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                        <div className={`flex items-center gap-2 text-xs font-mono transition-colors ${percent === 100 ? 'text-green-600 dark:text-green-500' : 'text-amber-600 dark:text-amber-500'}`}>
                            {percent === 100 ? <Wifi size={14} /> : <Activity size={14} className="animate-pulse" />}
                            {percent === 100 ? 'ONLINE' : 'SYNCING'}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
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

            {/* Name Formation */}
            <div className="z-10 flex flex-wrap justify-center gap-2 md:gap-8 lg:gap-12 transform-style-3d cursor-default">
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

            {/* Subtext Reveal */}
            <motion.div 
                style={{ 
                    opacity: useTransform(scrollYProgress, [0.55, 0.65], [0, 1]),
                    y: useTransform(scrollYProgress, [0.55, 0.65], [20, 0]),
                }}
                className="absolute bottom-[20vh] text-center max-w-2xl px-6 z-20"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-6 backdrop-blur-md">
                    <Cpu size={12} className="text-cyan-700 dark:text-cyan-500" />
                    <span className="text-[9px] font-mono text-cyan-800 dark:text-cyan-400 uppercase tracking-widest">Architect Verified</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-light text-slate-800 dark:text-slate-200 font-display leading-tight">
                    "Crafting resilient digital architectures for the <span className="text-cyan-700 dark:text-cyan-400 font-medium">next generation</span>."
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
