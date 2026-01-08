
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Briefcase, Award, Volume2, VolumeX, Clock, Sun, Moon, Search, Command, Cpu, Send } from 'lucide-react';
import { useSound } from './SoundManager';
import { useTheme } from './ThemeContext';

const navItems = [
  { id: 'hero', icon: <Home size={18} />, label: 'Base' },
  { id: 'about', icon: <User size={18} />, label: 'Identity' },
  { id: 'experience', icon: <Cpu size={18} />, label: 'History' },
  { id: 'projects', icon: <Briefcase size={18} />, label: 'Ops' },
  { id: 'certs', icon: <Award size={18} />, label: 'Vault' },
  { id: 'contact', icon: <Send size={18} />, label: 'Uplink' },
];

const AudioVisualizer = ({ active }: { active: boolean }) => (
    <div className="flex items-center gap-[2px] h-3">
        {[1, 2, 3].map(i => (
            <motion.div
                key={i}
                className="w-1 bg-cyan-500 rounded-full"
                animate={active ? { height: [4, 12, 4] } : { height: 4 }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
            />
        ))}
    </div>
);

const Navbar: React.FC = () => {
  const [activeId, setActiveId] = useState('hero');
  const [time, setTime] = useState('');
  const { playClick, toggleMute, isMuted } = useSound();
  const { theme, toggleTheme } = useTheme();

  const scrollToSection = (id: string) => {
    playClick();
    setActiveId(id);
    if (id === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const updateTime = () => {
        const now = new Date();
        setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        const sections = navItems.map(item => ({
            id: item.id,
            offset: document.getElementById(item.id)?.offsetTop || 0,
            height: document.getElementById(item.id)?.offsetHeight || 0
        }));

        sections.forEach((section) => {
            if (section.offset <= scrollPosition && (section.offset + section.height) > scrollPosition) {
                setActiveId(section.id);
            }
        });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerCommandPalette = () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };

  return (
    <>
        {/* Top Right Status Bar */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="fixed top-6 right-6 z-[900] flex items-center gap-3 md:gap-4 pointer-events-none"
        >
            <div className="hidden xs:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/50 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-white/10 text-[10px] font-mono text-slate-600 dark:text-cyan-400 shadow-sm pointer-events-auto">
                <Clock size={12} />
                <span>{time}</span>
            </div>

            <button 
                onClick={() => { playClick(); toggleTheme(); }}
                className="p-2 rounded-full bg-slate-100/50 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-white transition-colors shadow-sm pointer-events-auto"
                aria-label="Toggle Theme"
            >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button 
                onClick={() => { playClick(); toggleMute(); }}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100/50 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-white transition-colors shadow-sm pointer-events-auto"
                aria-label="Toggle Sound"
            >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                {!isMuted && <AudioVisualizer active={true} />}
            </button>
        </motion.div>

        {/* Bottom Floating Nav - Centered with Flexbox */}
        <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2, type: "spring", stiffness: 100 }}
            className="fixed bottom-6 md:bottom-8 inset-x-0 z-[999] flex justify-center pointer-events-none"
        >
            <div className="pointer-events-auto flex items-center gap-1 md:gap-2 p-1.5 md:p-2 rounded-full bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl shadow-cyan-500/10 dark:ring-1 dark:ring-white/5 max-w-[95vw] overflow-x-auto no-scrollbar">
                {navItems.map((item) => {
                const isActive = activeId === item.id;
                return (
                    <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative group p-2 md:p-3 rounded-full transition-all duration-300 shrink-0 ${
                        isActive 
                            ? 'text-cyan-600 dark:text-cyan-400 bg-slate-100 dark:bg-white/10' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                    >
                    <div className="relative z-10">{item.icon}</div>
                    
                    {/* Scan Line Effect on Hover */}
                    <div className="absolute inset-0 bg-cyan-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
                    
                    {isActive && (
                        <motion.div 
                            layoutId="nav-dot"
                            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-600 dark:bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)] z-20"
                        />
                    )}

                    <span className="hidden md:block absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900/90 dark:bg-black/90 border border-white/10 rounded-lg text-[10px] font-mono text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl backdrop-blur-sm z-30">
                        {item.label}
                        <span className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900/90 dark:bg-black/90 border-r border-b border-white/10 rotate-45 transform"></span>
                    </span>
                    </motion.button>
                );
                })}
                
                <div className="w-[1px] h-6 bg-slate-300 dark:bg-white/10 mx-1 shrink-0" />
                
                <motion.button
                    onClick={triggerCommandPalette}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group p-2 md:p-3 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-300 shrink-0"
                >
                    <Search size={18} />
                </motion.button>

            </div>
        </motion.div>
    </>
  );
};

export default Navbar;
