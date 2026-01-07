
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence, useTransform, useVelocity, useMotionValueEvent } from 'framer-motion';
import Background from './components/Background';
import CustomCursor from './components/CustomCursor';
import Hero from './components/Hero';
import AboutChat from './components/AboutChat';
import Experience from './components/Experience';
import ProjectGrid from './components/ProjectGrid';
import SkillsMarquee from './components/SkillsMarquee';
import CertStack from './components/CertStack';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import { SoundProvider, useSound } from './components/SoundManager';
import { ToastProvider, useToast } from './components/ToastSystem';
import { ThemeProvider } from './components/ThemeContext';
import { CommandPalette } from './components/CommandPalette';

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

const ScrollSpyAlerts = () => {
    const { scrollYProgress } = useScroll();
    const { addToast } = useToast();
    const [triggered, setTriggered] = useState<Set<string>>(new Set());

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (latest > 0.2 && !triggered.has('about')) {
            addToast("Decrypting Identity Protocol...", 'info');
            setTriggered(prev => new Set(prev).add('about'));
        }
        if (latest > 0.6 && !triggered.has('projects')) {
            addToast("Accessing Project Database...", 'info');
            setTriggered(prev => new Set(prev).add('projects'));
        }
        if (latest > 0.8 && !triggered.has('certs')) {
            addToast("Unlocking Credential Vault...", 'success');
            setTriggered(prev => new Set(prev).add('certs'));
        }
    });
    return null;
}

const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress, scrollY } = useScroll();
  const [clickEffect, setClickEffect] = useState<{x:number, y:number, id:number}[]>([]);
  const { addToast } = useToast();
  
  // Easter Egg
  useKonamiCode(() => {
      document.documentElement.classList.add('matrix-mode');
      addToast("MATRIX MODE ACTIVATED", 'success');
  });

  const scrollVelocity = useVelocity(scrollY);
  const skew = useTransform(scrollVelocity, [-2000, 2000], [2, -2]); 
  const smoothSkew = useSpring(skew, { stiffness: 400, damping: 30 });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useLayoutEffect(() => { window.scrollTo(0, 0); }, []);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
      const handleClick = (e: MouseEvent) => {
          const id = Date.now();
          setClickEffect(prev => [...prev, { x: e.clientX, y: e.clientY, id }]);
          setTimeout(() => {
              setClickEffect(prev => prev.filter(p => p.id !== id));
          }, 1000);
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
        <div className="relative w-full min-h-screen antialiased selection:bg-cyan-500/30 selection:text-white">
          <CommandPalette />
          <ScrollSpyAlerts />

          {/* Global Scroll Progress Bar */}
          <motion.div 
            className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 origin-left z-[1000]"
            style={{ scaleX }}
          />

          <div className="fixed inset-0 pointer-events-none z-[50] opacity-[0.02] mix-blend-overlay"
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
               }}
          />

          {/* Significantly reduced scanline opacity for clearer view of stars */}
          <div className="fixed inset-0 pointer-events-none z-[51] scanlines opacity-[0.05]" />
          
          {clickEffect.map((effect) => (
             <motion.div
                key={effect.id}
                initial={{ width: 0, height: 0, opacity: 0.5 }}
                animate={{ width: 500, height: 500, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="fixed rounded-full border border-cyan-500/30 bg-cyan-500/5 pointer-events-none z-[90] -translate-x-1/2 -translate-y-1/2"
                style={{ left: effect.x, top: effect.y }}
             />
          ))}

          <Background scrollVelocity={scrollVelocity} />
          
          <Navbar />
          {!isMobile && <CustomCursor />}

          <motion.main 
            className="relative flex flex-col will-change-transform z-10"
            style={{ skewY: smoothSkew }}
          >
            <Hero />
            
            <div className="relative z-10 w-full flex flex-col gap-0 bg-transparent">
              <div className="h-24 md:h-40 w-full" />
              <AboutChat />
              <Experience />
              <SkillsMarquee />
              <ProjectGrid />
              <CertStack />
              <Footer />
            </div>
          </motion.main>
          
          <div className="fixed bottom-6 right-6 z-[90] hidden md:block pointer-events-none">
            <motion.div 
              className="flex flex-col items-end gap-1 bg-slate-900/80 dark:bg-black/80 backdrop-blur-md border border-slate-700 dark:border-white/10 rounded-lg px-4 py-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
            >
               <span className="text-[8px] font-mono text-cyan-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/> 
                  Sys_Status: Online
               </span>
            </motion.div>
          </div>
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
