
import React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

const skillsRow1 = [
  "Oracle OCI", "AWS", "Azure", "Red Team Ops", "Docker", "Kubernetes", "Terraform", "Jenkins"
];

const skillsRow2 = [
  "Python", "JavaScript", "TypeScript", "React", "Next.js", "Bash", "SQL", "Cloud Security", "CI/CD"
];

const SkillPill: React.FC<{ skill: string }> = ({ skill }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const letters = skill.split("");

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      whileHover={{ y: -5, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-full bg-white dark:bg-black/30 backdrop-blur-sm border border-slate-200 dark:border-white/10 overflow-hidden cursor-crosshair group transition-colors hover:border-cyan-500/50"
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              150px circle at ${mouseX}px ${mouseY}px,
              rgba(6, 182, 212, 0.3),
              transparent 80%
            )
          `,
        }}
      />
      
      <span className="relative z-10 w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full group-hover:bg-cyan-400 group-hover:shadow-[0_0_12px_rgba(34,211,238,1)] transition-all duration-300"></span>
      
      <div className="relative z-10 flex">
        {letters.map((char, i) => (
           <span
             key={i}
             className="text-lg md:text-xl font-mono font-bold text-slate-700 dark:text-slate-300 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] transition-colors"
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
    <div className="flex overflow-hidden whitespace-nowrap w-full group">
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
      
      {/* Duplicate for seamless loop */}
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
      
      {/* Background decoration */}
      <div className="absolute left-0 top-0 w-20 md:w-32 h-full bg-gradient-to-r from-slate-50 dark:from-black to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 w-20 md:w-32 h-full bg-gradient-to-l from-slate-50 dark:from-black to-transparent z-10 pointer-events-none"></div>

      {/* Tilt container */}
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
