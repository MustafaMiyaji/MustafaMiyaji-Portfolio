
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Monitor, Moon, Sun, Volume2, VolumeX, Mail, Github, Command, ArrowRight } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useSound } from './SoundManager';
import { useToast } from './ToastSystem';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const { toggleMute, isMuted, playClick, playHover } = useSound();
  const { addToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        playClick();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const actions = [
    { 
        id: 'theme', 
        icon: theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />, 
        label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, 
        shortcut: 'T',
        action: () => { toggleTheme(); addToast(`Switched to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, 'success'); } 
    },
    { 
        id: 'sound', 
        icon: isMuted ? <Volume2 size={18} /> : <VolumeX size={18} />, 
        label: isMuted ? 'Unmute Audio' : 'Mute Audio', 
        shortcut: 'S',
        action: () => { toggleMute(); addToast(isMuted ? 'Audio Enabled' : 'Audio Muted', 'info'); } 
    },
    { 
        id: 'email', 
        icon: <Mail size={18} />, 
        label: 'Copy Email Address', 
        shortcut: 'E',
        action: () => { navigator.clipboard.writeText("Mustafamiyaji32@gmail.com"); addToast("Email copied to clipboard", 'success'); } 
    },
    { 
        id: 'github', 
        icon: <Github size={18} />, 
        label: 'Open GitHub Profile', 
        shortcut: 'G',
        action: () => window.open('https://github.com/MustafaMiyaji', '_blank') 
    },
    { 
        id: 'projects', 
        icon: <Monitor size={18} />, 
        label: 'Jump to Projects', 
        shortcut: 'P',
        action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) 
    }
  ];

  const filteredActions = actions.filter(action => 
    action.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
      setActiveIndex(0);
  }, [query]);

  const executeAction = (action: any) => {
      action.action();
      setIsOpen(false);
      setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-[20vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-xl bg-slate-50 dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden"
          >
             <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-200 dark:border-white/5">
                <Search className="text-slate-400" size={20} />
                <input 
                    autoFocus
                    type="text"
                    placeholder="Type a command or search..."
                    className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-white placeholder:text-slate-400 font-sans"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter' && filteredActions[activeIndex]) {
                            executeAction(filteredActions[activeIndex]);
                        }
                        if(e.key === 'ArrowDown') {
                            e.preventDefault();
                            setActiveIndex(prev => Math.min(prev + 1, filteredActions.length - 1));
                        }
                        if(e.key === 'ArrowUp') {
                            e.preventDefault();
                            setActiveIndex(prev => Math.max(prev - 1, 0));
                        }
                    }}
                />
                <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/5">
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">ESC</span>
                </div>
             </div>

             <div className="max-h-[300px] overflow-y-auto py-2">
                 {filteredActions.length === 0 ? (
                     <div className="px-4 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                         No commands found.
                     </div>
                 ) : (
                     filteredActions.map((action, index) => (
                         <button
                            key={action.id}
                            onClick={() => executeAction(action)}
                            onMouseEnter={() => { setActiveIndex(index); playHover(); }}
                            className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                                index === activeIndex 
                                    ? 'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-l-2 border-cyan-500' 
                                    : 'text-slate-600 dark:text-slate-300 border-l-2 border-transparent'
                            }`}
                         >
                            <div className="flex items-center gap-3">
                                {action.icon}
                                <span className="text-sm font-medium">{action.label}</span>
                            </div>
                            {index === activeIndex && <ArrowRight size={14} className="opacity-50" />}
                         </button>
                     ))
                 )}
             </div>
             
             <div className="px-4 py-2 bg-slate-100 dark:bg-black/30 border-t border-slate-200 dark:border-white/5 flex justify-between items-center text-[10px] text-slate-500">
                 <div className="flex gap-4">
                    <span>↑↓ Navigate</span>
                    <span>↵ Select</span>
                 </div>
                 <span className="font-mono opacity-50">v2.4.0</span>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
