
import React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useTheme } from './ThemeContext';
import { useSound } from './SoundManager';

const skillsRow1 = [
  "Oracle OCI", "AWS", "Azure", "Red Team Ops", "Docker", "Kubernetes", "Terraform", "Jenkins"
];

const skillsRow2 = [
  "Python", "JavaScript", "TypeScript", "React", "Next.js", "Bash", "SQL", "Cloud Security", "CI/CD"
];

const SkillPill: React.FC<{ skill: string }> = ({ skill }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { theme } = useTheme();
  const { playHover } = useSound();
  
  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const handleMouseEnter = () => {
     playHover(); 
  }

  const letters = skill.split("");

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      initial={{ y: 0, scale: 1 }}
      whileHover={{ 
          y: -8, 
          scale: 1.1,
          zIndex: 10,
          transition: { type: "spring", stiffness: 300, damping: 15 }
      }}
      whileTap={{ scale: 0.95 }}
      data-cursor="magnetic"
      className="relative flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-full bg-white dark:bg-black/40 backdrop-blur-md border border-slate-200 dark:border-white/10 overflow-hidden cursor-crosshair group/pill transition-colors duration-300 hover:border-cyan-400/50 hover:shadow-[0_20px_40px_-10px_rgba(6,182,212,0.3)] select-none"
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover/pill:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              120px circle at ${mouseX}px ${mouseY}px,
              ${theme === 'dark' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(59, 130, 246, 0.25)'},
              transparent 100%
            )
          `,
        }}
      />
      
      {/* Neon Glow Dot */}
      <span className="relative z-10 w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full group-hover/pill:bg-cyan-400 group-hover/pill:shadow-[0_0_15px_2px_rgba(34,211,238,0.8)] transition-all duration-300"></span>
      
      <div className="relative z-10 flex">
        {letters.map((char, i) => (
           <span
             key={i}
             className="text-lg md:text-xl font-mono font-bold text-slate-700 dark:text-slate-300 group-hover/pill:text-cyan-400 group-hover/pill:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-colors delay-75"
           >
             {char === " " ? "\u00A0" : char}
           </span>
        ))}
      </div>
    </motion.div>
  );
};

interface MarqueeRowProps {
  skills: string[];
  direction: 'left' | 'right';
  speed: number;
}

const MarqueeRow: React.FC<MarqueeRowProps> = ({ skills, direction, speed }) => {
   const repeatedSkills = [...skills, ...skills, ...skills, ...skills]; 
   
   return (
    <div className="flex overflow-hidden whitespace-nowrap w-full group select-none">
      <motion.div
        initial={{ x: direction === 'left' ? "0%" : "-100%" }}
        animate={{ x: direction === 'left' ? "-100%" : "0%" }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
        className="flex flex-shrink-0 gap-8 md:gap-12 pr-12 group-hover:[animation-play-state:paused]"
        style={{ animationPlayState: 'running' }} 
      >
        {repeatedSkills.map((skill, idx) => (
          <SkillPill key={`a-${idx}`} skill={skill} />
        ))}
      </motion.div>
      
      <motion.div
        initial={{ x: direction === 'left' ? "0%" : "-100%" }}
        animate={{ x: direction === 'left' ? "-100%" : "0%" }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
        className="flex flex-shrink-0 gap-8 md:gap-12 pr-12 group-hover:[animation-play-state:paused]"
      >
        {repeatedSkills.map((skill, idx) => (
          <SkillPill key={`b-${idx}`} skill={skill} />
        ))}
      </motion.div>
    </div>
   );
};

const SkillsMarquee: React.FC = () => {
  return (
    <section className="py-24 md:py-32 w-full overflow-hidden border-y border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 backdrop-blur-sm relative z-10">
      
      <div className="absolute left-0 top-0 w-20 md:w-32 h-full bg-gradient-to-r from-slate-50 dark:from-black to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 w-20 md:w-32 h-full bg-gradient-to-l from-slate-50 dark:from-black to-transparent z-10 pointer-events-none"></div>

      <div className="flex flex-col gap-12 rotate-[-2deg] scale-110 origin-center hover:rotate-0 transition-transform duration-700">
        <div className="hover:pause">
             <MarqueeRow skills={skillsRow1} direction="left" speed={40} />
        </div>
        <div className="hover:pause">
             <MarqueeRow skills={skillsRow2} direction="right" speed={50} />
        </div>
      </div>
    </section>
  );
};

export default SkillsMarquee;
