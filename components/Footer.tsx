
import React, { useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';

const MagneticButton: React.FC<{ children: React.ReactNode; href: string }> = ({ children, href }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Move the button towards the mouse slightly
    x.set(clientX - centerX);
    y.set(clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank" 
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseX, y: mouseY }}
      className="relative flex items-center justify-center w-14 h-14 rounded-full border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-white transition-colors group"
    >
      <div className="relative z-10 group-hover:scale-110 transition-transform duration-200">
        {children}
      </div>
    </motion.a>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-20 px-4 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black relative overflow-hidden">
        
        {/* Large Background Text */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03]">
             <h1 className="text-[15vw] leading-none font-bold text-center text-slate-900 dark:text-white uppercase">
                 Mustafa
             </h1>
        </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] mb-2">
            Ready to deploy?
          </h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 font-['Inter'] mb-6">
             Let's architect the future of your infrastructure.
          </p>
          <div className="flex gap-2 justify-center md:justify-start">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             <span className="text-[10px] font-mono text-slate-400 uppercase">System Status: Online</span>
          </div>
        </div>
        
        <div className="flex gap-6">
          <MagneticButton href="https://github.com/MustafaMiyaji">
            <Github size={24} />
          </MagneticButton>
          <MagneticButton href="https://www.linkedin.com/in/mustafa-alimiyaji-195742327/">
            <Linkedin size={24} />
          </MagneticButton>
          <MagneticButton href="mailto:Mustafamiyaji32@gmail.com">
            <Mail size={24} />
          </MagneticButton>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-slate-400 dark:text-gray-600">
         <p>© 2026 THE NEURAL GRID. ALL RIGHTS RESERVED.</p>
         <button 
           onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
           className="flex items-center gap-2 hover:text-cyan-500 transition-colors mt-4 md:mt-0"
         >
            RETURN TO SURFACE <ArrowUp size={12} />
         </button>
      </div>
    </footer>
  );
};

export default Footer;
