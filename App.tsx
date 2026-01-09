
import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence, useTransform, useVelocity, useMotionValueEvent } from 'framer-motion';
import Background from './components/Background';
import CustomCursor from './components/CustomCursor';
import Hero from './components/Hero';
import AboutChat from './components/AboutChat';
import Experience from './components/Experience';
import ProjectGrid from './components/ProjectGrid';
import SkillsMarquee from './components/SkillsMarquee';
import CertStack from './components/CertStack';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import SystemMonitor from './components/SystemMonitor';
import { SoundProvider, useSound } from './components/SoundManager';
import { ToastProvider, useToast } from './components/ToastSystem';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import { CommandPalette } from './components/CommandPalette';

// --- Matrix Rain Effect Component ---
const MatrixRain: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリBg01';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const alphabet = katakana + latin + nums;

        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops: number[] = [];

        for(let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';

            for(let i = 0; i < drops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 30);
        return () => clearInterval(interval);
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 z-[99999] pointer-events-none opacity-80 mix-blend-screen" />;
};

// Konami Code Hook
const useKonamiCode = (callback: () => void) => {
    const [input, setInput] = useState<string[]>([]);
    const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const newInput = [...input, e.key].slice(-10);
            setInput(newInput);
            if (JSON.stringify(newInput) === JSON.stringify(sequence)) {
                callback();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [input, callback]);
};

// Safe Scroll Spy that doesn't trigger bad renders
const ScrollSpyAlerts = () => {
    const { scrollYProgress } = useScroll();
    const { addToast } = useToast();
    const [hasTriggeredAbout, setHasTriggeredAbout] = useState(false);
    const [hasTriggeredProjects, setHasTriggeredProjects] = useState(false);
    const [hasTriggeredCerts, setHasTriggeredCerts] = useState(false);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (latest > 0.2 && !hasTriggeredAbout) {
            setHasTriggeredAbout(true);
            addToast("Decrypting Identity Protocol...", 'info');
        }
        if (latest > 0.6 && !hasTriggeredProjects) {
            setHasTriggeredProjects(true);
            addToast("Accessing Project Database...", 'info');
        }
        if (latest > 0.8 && !hasTriggeredCerts) {
            setHasTriggeredCerts(true);
            addToast("Unlocking Credential Vault...", 'success');
        }
    });
    return null;
}

const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress, scrollY } = useScroll();
  const [ripples, setRipples] = useState<{x:number, y:number, id:number}[]>([]);
  const [matrixMode, setMatrixMode] = useState(false);
  const [lowPowerMode, setLowPowerMode] = useState(false);
  
  const { addToast } = useToast();
  const { theme } = useTheme();
  
  const [isMobile, setIsMobile] = useState(true); 
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useKonamiCode(() => {
      setMatrixMode(true);
      addToast("MATRIX MODE ACTIVATED", 'success');
      setTimeout(() => setMatrixMode(false), 10000); 
  });

  const scrollVelocity = useVelocity(scrollY);
  const skew = useTransform(scrollVelocity, [-2000, 2000], [2, -2]); 
  const smoothSkew = useSpring(skew, { stiffness: 400, damping: 30 });
  const activeSkew = useTransform(smoothSkew, (latest) => isMobile ? 0 : latest);
  
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useLayoutEffect(() => { window.scrollTo(0, 0); }, []);

  // Sonar Ripple Effect
  useEffect(() => {
      const handleClick = (e: MouseEvent) => {
          const id = Date.now();
          setRipples(prev => [...prev, { x: e.clientX, y: e.clientY, id }]);
          setTimeout(() => {
              setRipples(prev => prev.filter(p => p.id !== id));
          }, 1500);
      };
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
      const originalTitle = document.title;
      const handleVisibilityChange = () => {
          if (document.hidden) {
              document.title = "⚠️ SIGNAL LOST...";
          } else {
              document.title = originalTitle;
          }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} key="preloader" />}
      </AnimatePresence>

      {!isLoading && (
        <div 
            className={`relative w-full min-h-screen antialiased selection:bg-cyan-500/30 selection:text-white ${matrixMode ? 'matrix-mode-active' : ''}`}
        >
          <CommandPalette />
          <ScrollSpyAlerts />
          
          {matrixMode && <MatrixRain />}
          
          {/* FILM GRAIN OVERLAY */}
          <div className="fixed inset-0 pointer-events-none z-[9000] opacity-[0.03] mix-blend-overlay"
               style={{
                   backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
               }}
          />

          <motion.div 
            className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 origin-left z-[1000]"
            style={{ scaleX }}
          />

          <div className="hidden md:block fixed inset-0 pointer-events-none z-[50] opacity-[0.02] mix-blend-overlay"
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
               }}
          />

          <div className={`fixed inset-0 pointer-events-none z-[1] transition-opacity duration-700 ${theme === 'light' ? 'opacity-100' : 'opacity-0'}`}
             style={{
                 backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`,
                 backgroundSize: '30px 30px',
                 opacity: 0.2
             }}
          />

          <div className="hidden md:block fixed inset-0 pointer-events-none z-[51] scanlines opacity-[0.05]" />
          
          {/* Sonar Ripples */}
          {!lowPowerMode && ripples.map((ripple) => (
             <motion.div
                key={ripple.id}
                initial={{ width: 0, height: 0, opacity: 0.4, borderWidth: 2 }}
                animate={{ width: 800, height: 800, opacity: 0, borderWidth: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="fixed rounded-full border-cyan-500/50 bg-cyan-400/5 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
                style={{ left: ripple.x, top: ripple.y }}
             />
          ))}

          <Background scrollVelocity={scrollVelocity} lowPowerMode={lowPowerMode} />
          
          <Navbar />
          {!isMobile && <CustomCursor />}

          <motion.main 
            className="relative flex flex-col will-change-transform z-10"
            style={{ skewY: activeSkew }}
          >
            <Hero />
            
            <div className="relative z-10 w-full flex flex-col gap-0 bg-transparent">
              <div className="h-24 md:h-40 w-full" />
              <AboutChat />
              <Experience />
              <SkillsMarquee />
              <ProjectGrid />
              <CertStack />
              <Contact />
              <Footer />
            </div>
          </motion.main>
          
          <SystemMonitor 
              lowPowerMode={lowPowerMode} 
              toggleLowPowerMode={() => setLowPowerMode(!lowPowerMode)} 
          />
        </div>
      )}
    </>
  );
};

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <SoundProvider>
                <ToastProvider>
                    <AppContent />
                </ToastProvider>
            </SoundProvider>
        </ThemeProvider>
    );
};

export default App;
