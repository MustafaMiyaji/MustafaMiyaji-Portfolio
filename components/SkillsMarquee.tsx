
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

  // Text Wave Animation Logic
  const letters = skill.split("");

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      whileHover={{ y: -6, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      // Pulsing Neon Glow on Hover
      animate={{ 
         boxShadow: ["0 0 0px rgba(6,182,212,0)", "0 0 15px rgba(6,182,212,0.5)", "0 0 0px rgba(6,182,212,0)"],
         borderColor: ["rgba(255,255,255,0.1)", "rgba(6,182,212,0.5)", "rgba(255,255,255,0.1)"]
      }}
      transition={{ 
         boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
         borderColor: { duration: 2, repeat: Infinity, ease: "easeInOut" },
         y: { duration: 0.2 },
         scale: { duration: 0.2 }
      }}
      className="relative flex items-center gap-3 px-8 py-4 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 overflow-hidden cursor-crosshair group"
    >
      {/* High Performance Spotlight using MotionTemplates */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              150px circle at ${mouseX}px ${mouseY}px,
              rgba(6, 182, 212, 0.4),
              transparent 80%
            )
          `,
        }}
      />
      
      {/* Intense Border Follow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-full opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              100px circle at ${mouseX}px ${mouseY}px,
              rgba(6, 182, 212, 1),
              transparent 80%
            )
          `,
          maskImage: `linear-gradient(black, black)`,
          WebkitMaskComposite: 'destination-out',
          maskComposite: 'exclude',
          padding: '2px', 
        }}
      />

      <span className="relative z-10 w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full group-hover:bg-cyan-400 group-hover:shadow-[0_0_12px_rgba(34,211,238,1)] transition-all duration-300"></span>
      
      {/* Wave Text Effect */}
      <div className="relative z-10 flex">
        {letters.map((char, i) => (
           <motion.span
             key={i}
             className="text-xl md:text-2xl font-mono font-bold text-slate-700 dark:text-slate-300 group-hover:text-cyan-700 dark:group-hover:text-cyan-200 transition-colors"
             variants={{
               hover: { y: -3 }
             }}
             transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.05
             }}
           >
             {char === " " ? "\u00A0" : char}
           </motion.span>
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
   // Duplicate skills enough times to ensure smooth looping on large screens
   const repeatedSkills = [...skills, ...skills, ...skills, ...skills]; 
   
   return (
    <div className="flex overflow-hidden whitespace-nowrap w-full">
      <motion.div
        initial={{ x: direction === 'left' ? "0%" : "-100%" }}
        animate={{ x: direction === 'left' ? "-100%" : "0%" }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
        className="flex flex-shrink-0 gap-12 pr-12"
      >
        {repeatedSkills.map((skill, idx) => (
          <SkillPill key={`a-${idx}`} skill={skill} />
        ))}
      </motion.div>
      
      <motion.div
        initial={{ x: direction === 'left' ? "0%" : "-100%" }}
        animate={{ x: direction === 'left' ? "-100%" : "0%" }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
        className="flex flex-shrink-0 gap-12 pr-12"
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
    <section className="py-32 w-full overflow-hidden border-y border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 backdrop-blur-sm relative z-10">
      
      {/* Background decoration */}
      <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-slate-50 dark:from-black to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-slate-50 dark:from-black to-transparent z-10 pointer-events-none"></div>

      <div className="flex flex-col gap-12 rotate-[-2deg] scale-110 origin-center">
        <MarqueeRow skills={skillsRow1} direction="left" speed={40} />
        <MarqueeRow skills={skillsRow2} direction="right" speed={50} />
      </div>
    </section>
  );
};

export default SkillsMarquee;
