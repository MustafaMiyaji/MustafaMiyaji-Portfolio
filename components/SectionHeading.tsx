
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const LETTERS_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ΞΠΣΩλΔ∇ΦΨ";

interface SectionHeadingProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}

const DecoderText: React.FC<{ text: string; start: boolean; className?: string }> = ({ text, start, className }) => {
    const [decoded, setDecoded] = useState("");
    
    useEffect(() => {
        if (!start) return;
        
        let iteration = 0;
        const interval = setInterval(() => {
            setDecoded(text.split("").map((letter, index) => {
                if(index < iteration) return text[index];
                return LETTERS_POOL[Math.floor(Math.random() * LETTERS_POOL.length)];
            }).join(""));
            
            if(iteration >= text.length) {
                setDecoded(text);
                clearInterval(interval);
            }
            iteration += 1/3; 
        }, 30);
        return () => clearInterval(interval);
    }, [text, start]);

    return <span className={className}>{start ? decoded : text.split('').map(() => LETTERS_POOL[Math.floor(Math.random() * LETTERS_POOL.length)]).join('')}</span>;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ title, subtitle, icon }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="flex flex-col items-center mb-16 text-center relative">
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-mono text-xs tracking-[0.3em] uppercase mb-4"
        >
            {icon}
            <DecoderText text={subtitle} start={isInView} />
        </motion.div>
        
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white font-display overflow-hidden">
             <DecoderText text={title} start={isInView} />
        </h2>

        {/* Scanning Line Effect */}
        <motion.div 
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
        />
    </div>
  );
};

export default SectionHeading;
