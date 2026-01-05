
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import Background from './components/Background';
import CustomCursor from './components/CustomCursor';
import Hero from './components/Hero';
import AboutChat from './components/AboutChat';
import ProjectGrid from './components/ProjectGrid';
import SkillsMarquee from './components/SkillsMarquee';
import CertStack from './components/CertStack';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  
  // Smooth progress bar
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Scroll Reset only once on mount
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} key="preloader" />}
      </AnimatePresence>

      {!isLoading && (
        <div className="relative w-full min-h-screen antialiased selection:bg-cyan-500/30 selection:text-white">
          
          {/* Film Grain Noise Overlay */}
          <div className="fixed inset-0 pointer-events-none z-[50] opacity-[0.03] mix-blend-overlay"
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
               }}
          />

          {/* CRT Scanlines */}
          <div className="fixed inset-0 pointer-events-none z-[51] scanlines opacity-30" />

          {/* Global Progress Bar */}
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 origin-left z-[100]"
            style={{ scaleX }}
          />

          <Background />
          <Navbar />
          {!isMobile && <CustomCursor />}

          <main className="relative flex flex-col">
            {/* 1. Hero Section (Scroll Gate) */}
            {/* It occupies 300vh physically, giving time for the animation. */}
            <Hero />
            
            {/* 2. Main Content */}
            {/* Sits naturally below the Hero. No opacity hacks needed. */}
            <div className="relative z-10 w-full flex flex-col gap-0 bg-transparent">
              
              {/* Spacer to ensure clean transition from Hero */}
              <div className="h-24 md:h-40 w-full" />
              
              <AboutChat />
              <SkillsMarquee />
              <ProjectGrid />
              <CertStack />
              <Footer />
            </div>
          </main>
          
          {/* Status HUD (Corner) */}
          <div className="fixed bottom-6 right-6 z-[90] hidden md:block pointer-events-none">
            <motion.div 
              className="flex flex-col items-end gap-1 bg-slate-900/80 dark:bg-black/80 backdrop-blur-md border border-slate-700 dark:border-white/10 rounded-lg px-4 py-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
            >
               <span className="text-[8px] font-mono text-cyan-500 uppercase tracking-widest">Sys_Status: Normal</span>
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
