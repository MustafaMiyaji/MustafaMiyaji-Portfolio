
import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { useSound } from './SoundManager';
import { useToast } from './ToastSystem';

const MagneticButton: React.FC<{ children: React.ReactNode; href: string; onClick?: () => void }> = ({ children, href, onClick }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const { playHover } = useSound();

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set(clientX - centerX);
    y.set(clientY - centerY);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target={href.startsWith('http') ? "_blank" : undefined}
      rel="noopener noreferrer"
      onClick={(e) => {
        if (onClick) {
            e.preventDefault();
            onClick();
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => playHover()}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: mouseX, y: mouseY }}
      className="relative flex items-center justify-center w-14 h-14 rounded-full border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-white transition-colors group cursor-pointer"
    >
      <div className="relative z-10 group-hover:scale-110 transition-transform duration-200">
        {children}
      </div>
    </motion.a>
  );
};

const CLI_COMMANDS: Record<string, string> = {
    'help': 'Available commands: about, projects, email, github, linkedin, ls, whoami, date, weather, clear, sudo',
    'about': 'Mustafa Miyaji. Lead Cloud Architect. Neural Grid Architect. Location: PDX.',
    'projects': 'Navigating to project sector...',
    'email': 'Mustafamiyaji32@gmail.com',
    'github': 'Opening GitHub protocol...',
    'linkedin': 'Establishing secure uplink to LinkedIn...',
    'sudo': 'Usage: sudo [command]. Try "sudo root".',
    'sudo root': 'ACCESS GRANTED. WELCOME ADMIN.',
    'ls': 'Listing directories... /projects /about /contact /system /logs',
    'whoami': 'guest@neural-grid-v1.0',
    'date': new Date().toLocaleString(),
    'weather': 'Fetching... Local conditions: 72°F / 22°C (Simulated) - Grid Stable'
};

const ContactTerminal: React.FC = () => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>(['Initializing secure shell...', 'Type "help" for instructions.']);
    const [isAdmin, setIsAdmin] = useState(false);
    const { addToast } = useToast();
    const { playKeystroke, playSuccess } = useSound();
    
    // Use a ref for the scrollable container instead of an element at the bottom
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Use scrollTop to scroll the container internally without affecting window scroll
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [history]);

    const handleCommand = (cmd: string) => {
        const lowerCmd = cmd.trim().toLowerCase();
        let response = `Command not found: ${cmd}`;
        
        if (lowerCmd === 'clear') {
            setHistory([]);
            return;
        }

        if (lowerCmd === 'sudo root') {
            setIsAdmin(true);
            playSuccess();
            addToast("ROOT ACCESS GRANTED", 'success');
        }

        if (CLI_COMMANDS[lowerCmd]) {
            response = CLI_COMMANDS[lowerCmd];
            if(lowerCmd === 'projects') document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            if(lowerCmd === 'email') {
                 navigator.clipboard.writeText("Mustafamiyaji32@gmail.com");
                 addToast("Email copied to clipboard", 'success');
            }
            if(lowerCmd === 'github') window.open('https://github.com/MustafaMiyaji', '_blank');
            if(lowerCmd === 'linkedin') window.open('https://www.linkedin.com/in/mustafa-alimiyaji-195742327/', '_blank');
            playSuccess();
        }

        setHistory(prev => [...prev, `${isAdmin ? 'root@miyaji:~#' : 'guest@miyaji:~$'} ${cmd}`, response]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!input.trim()) return;
        handleCommand(input);
        setInput('');
    };

    return (
        <div className={`w-full max-w-full md:max-w-md h-[250px] bg-black/90 rounded-lg border ${isAdmin ? 'border-red-500/50' : 'border-slate-700/50'} p-4 font-mono text-sm relative overflow-hidden shadow-2xl flex flex-col transition-colors duration-500`}>
             <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10 text-slate-500 text-[10px]">
                 <div className="w-2 h-2 rounded-full bg-red-500"></div>
                 <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                 <div className="w-2 h-2 rounded-full bg-green-500"></div>
                 <span className={`ml-2 ${isAdmin ? 'text-red-500 font-bold' : ''}`}>{isAdmin ? 'root@miyaji-grid:~#' : 'guest@miyaji-grid:~'}</span>
             </div>
             
             <div ref={containerRef} className="flex-1 overflow-y-auto no-scrollbar space-y-1 mb-2">
                 {history.map((line, i) => (
                     <div key={i} className={`text-xs break-all ${line.startsWith('guest') ? 'text-slate-400' : line.startsWith('root') ? 'text-red-400' : isAdmin ? 'text-red-300' : 'text-cyan-400'}`}>{line}</div>
                 ))}
             </div>

             <form onSubmit={handleSubmit} className="flex gap-2 items-center bg-white/5 p-2 rounded">
                <span className={isAdmin ? 'text-red-500' : 'text-green-500'}>{isAdmin ? '#' : '$'}</span>
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => { setInput(e.target.value); playKeystroke(); }}
                    className={`bg-transparent border-none outline-none w-full placeholder:text-slate-700 text-xs min-w-0 ${isAdmin ? 'text-red-400' : 'text-slate-200'}`}
                    autoComplete="off"
                    placeholder={isAdmin ? "Awaiting root command..." : "Enter command..."}
                />
            </form>
        </div>
    );
}

const Footer: React.FC = () => {
  const { addToast } = useToast();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("Mustafamiyaji32@gmail.com");
    addToast("Email address copied to clipboard.", 'success');
  };

  return (
    <footer className="w-full py-20 px-4 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black relative overflow-hidden">
        
        {/* GRAPHIC TYPO BACKGROUND - "MUSTAFA" */}
        <div className="absolute inset-0 flex items-center justify-center z-0 opacity-10 dark:opacity-5 pointer-events-none select-none overflow-hidden">
             <h1 
                className="text-[20vw] md:text-[18vw] font-black font-display text-transparent tracking-tighter blur-[2px] leading-none"
                style={{ 
                    WebkitTextStroke: '2px currentColor', 
                    color: 'rgba(6,182,212,0.8)' // Cyan tint used for stroke color via currentColor
                }}
             >
                MUSTAFA
             </h1>
        </div>

        {/* Radar Background Animation */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20 pointer-events-none overflow-hidden z-0">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] border border-cyan-500/30 rounded-full" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] border border-cyan-500/30 rounded-full" />
            
            <motion.div 
                className="absolute bottom-[0] left-1/2 w-1/2 h-[300px] bg-gradient-to-r from-cyan-500/0 to-cyan-500/20 origin-bottom-left"
                style={{ borderRadius: '100% 0 0 0' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, ease: "linear", repeat: Infinity }}
            />
        </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 relative z-10">
        <div className="text-center md:text-left w-full md:w-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] mb-2">
            Ready to deploy?
          </h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 font-['Inter'] mb-6">
             Initiate secure communication.
          </p>
          <div className="flex flex-col gap-6 items-center md:items-start w-full">
             <ContactTerminal />
          </div>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-6 w-full md:w-auto">
            <div className="flex gap-6">
                <MagneticButton href="https://github.com/MustafaMiyaji">
                    <Github size={24} />
                </MagneticButton>
                <MagneticButton href="https://www.linkedin.com/in/mustafa-alimiyaji-195742327/">
                    <Linkedin size={24} />
                </MagneticButton>
                <MagneticButton href="#" onClick={handleCopyEmail}>
                    <Mail size={24} />
                </MagneticButton>
            </div>
            <div className="text-center md:text-right">
                <p className="text-[10px] font-mono text-slate-500">LOCATION: PORTLAND, OR (PDX)</p>
                <p className="text-[10px] font-mono text-slate-500">TZ: UTC-7</p>
            </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-slate-400 dark:text-gray-600 relative z-10">
         <p>© 2026 MUSTAFA MIYAJI. ALL RIGHTS RESERVED.</p>
         <button 
           onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
           className="flex items-center gap-2 hover:text-cyan-500 transition-colors mt-4 md:mt-0 group"
         >
            RETURN TO SURFACE <ArrowUp size={12} className="group-hover:-translate-y-1 transition-transform" />
         </button>
      </div>
    </footer>
  );
};

export default Footer;
