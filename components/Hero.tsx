
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, useTransform, useScroll, useMotionValueEvent, useMotionValue, useSpring, MotionValue } from 'framer-motion';
import { ArrowDown, Shield, Scan, Lock, Unlock, Zap, Mouse } from 'lucide-react';
import { useSound } from './SoundManager';

const LETTERS_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ΞΠΣΩλΔ∇ΦΨ";

interface ScrambleCharProps {
  char: string;
  index: number;
  progress: MotionValue<number>;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  triggerGlitch: boolean;
  isMobile: boolean;
}

const ScrambleChar: React.FC<ScrambleCharProps> = ({ char, index, progress, mouseX, mouseY, triggerGlitch, isMobile }) => {
  const [displayChar, setDisplayChar] = useState(char);
  const [isLocked, setIsLocked] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  // Physics for the "Dodge" effect
  const xForce = useMotionValue(0);
  const yForce = useMotionValue(0);
  
  // Spring physics for smooth return after dodging
  const xSpring = useSpring(xForce, { stiffness: 150, damping: 15, mass: 0.5 });
  const ySpring = useSpring(yForce, { stiffness: 150, damping: 15, mass: 0.5 });

  // Chaos Fly-in Logic
  const chaos = useMemo(() => {
    const angle = (index * 137.5) + (Math.random() * 360);
    const distance = 600 + (Math.random() * 800); 
    const zDepth = 400 + (Math.random() * 1200);
    
    return {
      startX: Math.cos(angle * (Math.PI / 180)) * distance,
      startY: Math.sin(angle * (Math.PI / 180)) * distance,
      startZ: zDepth * (Math.random() > 0.5 ? 1 : -1),
      startRotate: (Math.random() - 0.5) * 360,
    };
  }, [index]);

  const x = useTransform(progress, [0, 0.6], [chaos.startX, 0]);
  const y = useTransform(progress, [0, 0.6], [chaos.startY, 0]);
  const z = useTransform(progress, [0, 0.6], [chaos.startZ, 0]);
  const rotate = useTransform(progress, [0, 0.6], [chaos.startRotate, 0]);
  const opacity = useTransform(progress, [0, 0.2, 0.6], [0, 1, 1]);

  // Combined X/Y for render (Fly-in + Dodge)
  const finalX = useTransform([x, xSpring], ([latestX, latestSpring]) => (latestX as number) + (latestSpring as number));
  const finalY = useTransform([y, ySpring], ([latestY, latestSpring]) => (latestY as number) + (latestSpring as number));

  // Dodge Logic Loop - DISABLED ON MOBILE
  useEffect(() => {
      if (isMobile) return;
      
      const unsubscribeX = mouseX.on("change", (latestX) => {
          if (!ref.current) return;
          const rect = ref.current.getBoundingClientRect();
          const charCenterX = rect.left + rect.width / 2;
          const charCenterY = rect.top + rect.height / 2;
          const currentMouseY = mouseY.get();

          const dx = latestX - charCenterX;
          const dy = currentMouseY - charCenterY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 100; // Radius of influence

          if (dist < maxDist) {
              const force = (maxDist - dist) / maxDist;
              // Push away from mouse
              const pushX = -(dx / dist) * force * 150; 
              const pushY = -(dy / dist) * force * 150;
              xForce.set(pushX);
              yForce.set(pushY);
          } else {
              xForce.set(0);
              yForce.set(0);
          }
      });
      return () => unsubscribeX();
  }, [mouseX, mouseY, xForce, yForce, isMobile]);

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

  // Lock characters
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
      style={{ x: isMobile ? x : finalX, y: isMobile ? y : finalY, z, rotate, opacity }}
    >
      <span className="text-[1.8rem] xs:text-[2.2rem] sm:text-6xl md:text-8xl lg:text-9xl font-black font-display leading-none select-none transition-colors duration-500 hover:text-cyan-400 text-slate-800 dark:text-cyber-text dark:text-white">
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

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(0);
  const { playHover, playClick } = useSound();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const [percent, setPercent] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [hasScrolledPastHalf, setHasStartedPastHalf] = useState(false);
  const [showAberration, setShowAberration] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const hudOpacity = useTransform(scrollYProgress, [0.7, 0.85], [1, 0]);
  const gateScale = useTransform(scrollYProgress, [0.85, 1], [1, 0.9]);
  const gateOpacity = useTransform(scrollYProgress, [0.9, 1], [1, 0]);
  const gateY = useTransform(scrollYProgress, [0.85, 1], ["0%", "-50%"]); 

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const p = Math.min(100, Math.max(0, Math.floor((v / 0.5) * 100)));
    setPercent(p);
    
    // Trigger intense glitch when scrolling past 55%
    if (v > 0.55 && v < 0.8 && !hasScrolledPastHalf) {
        setHasStartedPastHalf(true);
        setIsGlitching(true);
        setShowAberration(true); // Trigger chromatic aberration
        setTimeout(() => {
             setIsGlitching(false);
             setShowAberration(false);
        }, 800);
    }
    if (v < 0.4) {
        setHasStartedPastHalf(false);
    }
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

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
            className="relative w-full h-full flex flex-col justify-center items-center bg-transparent transition-colors duration-500 overflow-hidden"
        >
            {/* Core Animation Behind Text */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-40 dark:opacity-60">
                <motion.div 
                    className="w-full h-full border border-cyan-500/30 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                />
                <motion.div 
                    className="absolute inset-10 border border-purple-500/30 rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, ease: "linear", repeat: Infinity }}
                />
            </div>

            <motion.div 
                style={{ opacity: hudOpacity }}
                className="absolute inset-0 p-6 md:p-12 flex flex-col justify-between pointer-events-none z-20"
            >
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-xs font-mono text-cyan-700 dark:text-cyan-400">
                            <Shield size={14} /> 
                            <span className="tracking-[0.2em]">SECURE_GATEWAY_V4.2</span>
                        </div>
                    </div>
                </div>

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
            
            <motion.div 
                className="flex flex-col items-center justify-center cursor-default py-10 z-30"
                animate={showAberration ? { 
                    x: [-5, 5, -5, 0],
                    filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
                } : { x: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.3 }}
            >
                <div 
                    className="flex flex-wrap justify-center gap-1 md:gap-4 lg:gap-6 px-4 text-center max-w-[100vw]"
                    onMouseEnter={triggerManualGlitch}
                    style={{
                        textShadow: showAberration ? '4px 0 rgba(255,0,0,0.7), -4px 0 rgba(0,255,255,0.7)' : 'none'
                    }}
                >
                    {name.split("").map((c, i) => (
                        <ScrambleChar 
                            key={i} 
                            char={c} 
                            index={i} 
                            progress={scrollYProgress} 
                            mouseX={mouseX} 
                            mouseY={mouseY}
                            triggerGlitch={isGlitching}
                            isMobile={isMobile}
                        />
                    ))}
                </div>
            </motion.div>

            <motion.div 
                style={{ 
                    opacity: useTransform(scrollYProgress, [0.55, 0.65], [0, 1]),
                    y: useTransform(scrollYProgress, [0.55, 0.65], [20, 0]),
                }}
                className="absolute bottom-[15vh] flex flex-col items-center text-center max-w-2xl px-6 z-20"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-6 backdrop-blur-md">
                    <Scan size={12} className="text-cyan-700 dark:text-cyan-500" />
                    <span className="text-[9px] font-mono text-cyan-800 dark:text-cyan-400 uppercase tracking-widest">Architect Verified</span>
                </div>
                <h2 className="text-xl md:text-3xl font-light text-slate-800 dark:text-slate-200 font-display leading-tight mb-8">
                    <DecoderText text="Crafting resilient digital architectures for the next generation." className="block" />
                </h2>
                
                {/* CTA Button */}
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                        playClick();
                    }}
                    className="relative group px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-mono text-sm rounded-full overflow-hidden shadow-lg shadow-cyan-500/20"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                        INITIALIZE_UPLINK <Zap size={14} />
                    </span>
                </motion.button>
            </motion.div>
            
            {/* ENHANCED SCROLL INDICATOR */}
            <motion.div 
                className="absolute bottom-10 left-0 right-0 z-50 flex flex-col items-center gap-3 pointer-events-none"
                style={{ 
                    opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]),
                    y: useTransform(scrollYProgress, [0, 0.15], [0, 20])
                }}
            >
                <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-2"
                >
                     <Mouse size={24} className="text-cyan-500 animate-pulse" />
                     <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.3em] font-bold text-shadow-glow">
                            System Ready
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 dark:text-slate-500 uppercase tracking-widest">
                            Scroll to Initialize
                        </span>
                     </div>
                     <ArrowDown size={16} className="text-slate-400 dark:text-slate-600 mt-1" />
                </motion.div>
            </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
