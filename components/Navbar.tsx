
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, User, Briefcase, Award } from 'lucide-react';

const navItems = [
  { id: 'hero', icon: <Home size={18} />, label: 'Base' },
  { id: 'about', icon: <User size={18} />, label: 'Identity' },
  { id: 'projects', icon: <Briefcase size={18} />, label: 'Ops' },
  { id: 'certs', icon: <Award size={18} />, label: 'Vault' },
];

const Navbar: React.FC = () => {
  const [activeId, setActiveId] = useState('hero');

  const scrollToSection = (id: string) => {
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

  // Simple scroll spy
  useEffect(() => {
    const handleScroll = () => {
        const sections = navItems.map(item => document.getElementById(item.id));
        const scrollPosition = window.scrollY + window.innerHeight / 3;

        sections.forEach((section) => {
            if (section && section.offsetTop <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition) {
                setActiveId(section.id);
            }
        });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2, type: "spring", stiffness: 100 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] pointer-events-auto"
    >
      <div className="flex items-center gap-2 p-2 rounded-full bg-slate-900/60 dark:bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl shadow-cyan-500/10 ring-1 ring-white/5">
        {navItems.map((item) => {
          const isActive = activeId === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative group p-3 rounded-full transition-all duration-300 ${isActive ? 'text-cyan-400 bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              {item.icon}
              
              {/* Active Indicator Dot */}
              {isActive && (
                <motion.div 
                    layoutId="nav-dot"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                />
              )}

              {/* Tooltip */}
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900/90 dark:bg-black/90 border border-white/10 rounded-lg text-[10px] font-mono text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl backdrop-blur-sm">
                {item.label}
                <span className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900/90 dark:bg-black/90 border-r border-b border-white/10 rotate-45 transform"></span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Navbar;
