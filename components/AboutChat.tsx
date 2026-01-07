
import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Terminal, Bot, User, Cpu, Download } from 'lucide-react';
import { useSound } from './SoundManager';

const RESUME_LINK = "https://drive.google.com/file/d/1hdW7tMXtyiVWKSYdjIoUg0fS_d2Jv7Ri/view?usp=sharing";

const messagesData = [
  { 
    id: 1, 
    user: 'AI', 
    text: "Neural verification successful. Initializing Miyaji_Archive...", 
    icon: <Bot size={16} /> 
  },
  { 
    id: 2, 
    user: 'Mustafa', 
    text: "Lead Cloud Architect & Backend Developer. Specialized in automated container orchestration (K8s) and scalable API architectures.", 
    icon: <User size={16} /> 
  },
  { 
    id: 3, 
    user: 'System', 
    text: "METRIC: 99.99% Infrastructure Uptime achieved across enterprise nodes. Secured via Hardened CI/CD pipelines.", 
    isSystem: true 
  },
  { 
    id: 4, 
    user: 'Mustafa', 
    text: "Current Research: Neural networks in predictive DevOps and decentralizing hybrid-cloud security layers.", 
    icon: <Cpu size={16} /> 
  }
];

const TypingIndicator = () => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }}
    className="flex items-center gap-1 p-4 rounded-2xl rounded-tl-none bg-purple-500/10 border border-purple-500/20 w-16 h-10"
  >
    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full" />
    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full" />
    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full" />
  </motion.div>
);

const messageVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (isSystem: boolean) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: isSystem ? 1.5 : 0.5,
      ease: "easeOut"
    }
  })
};

const AboutChat: React.FC = () => {
  const [visibleMessages, setVisibleMessages] = useState<typeof messagesData>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const { playSuccess } = useSound();

  const onInView = () => {
    if (hasStarted) return;
    setHasStarted(true);
    let delay = 0;
    
    messagesData.forEach((msg, index) => {
      delay += 800; 
      
      if (msg.user === 'AI' || msg.isSystem) {
         setTimeout(() => setIsTyping(true), delay);
         delay += 1200; 
         setTimeout(() => {
           setIsTyping(false);
           setVisibleMessages(prev => [...prev, msg]);
           if (index === messagesData.length - 1) playSuccess();
         }, delay);
      } else {
         setTimeout(() => {
           setVisibleMessages(prev => [...prev, msg]);
         }, delay);
      }
    });
  };

  return (
    <section id="about" className="py-24 md:py-40 px-4 max-w-5xl mx-auto w-full relative z-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        onViewportEnter={onInView}
        viewport={{ once: true, amount: 0.3 }}
        className="bg-white/80 dark:bg-black/40 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 md:p-12 shadow-2xl relative overflow-hidden min-h-[600px]"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-shimmer" />
        
        <div className="flex items-center justify-between mb-8 md:mb-12 pb-6 border-b border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
            <span className="hidden xs:flex items-center gap-2 text-[10px] font-mono text-cyan-700 dark:text-cyan-500/50 uppercase tracking-widest">
              <Terminal size={12} /> protocol_identity.sh
            </span>
          </div>
          
          <a 
            href={RESUME_LINK}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="magnetic"
            className="flex items-center gap-2 text-[10px] font-mono text-slate-500 hover:text-cyan-500 transition-colors border border-slate-700 rounded px-2 py-1 group"
          >
             <Download size={10} className="group-hover:animate-bounce" /> DOWNLOAD_RESUME
          </a>
        </div>

        <div className="space-y-8 md:space-y-10">
          {visibleMessages.map((msg) => (
            <motion.div
              key={msg.id}
              custom={msg.isSystem}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              className={`flex items-start gap-3 md:gap-6 ${msg.user === 'Mustafa' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {!msg.isSystem && (
                <div className={`w-8 h-8 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg
                    ${msg.user === 'Mustafa' 
                      ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30' 
                      : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'}`}
                >
                  {msg.icon}
                </div>
              )}
              
              <div className={`max-w-[85%] md:max-w-[70%] p-4 md:p-6 rounded-3xl text-sm md:text-base leading-relaxed group transition-all duration-300
                ${msg.isSystem ? 'w-full text-center bg-transparent border-0 shadow-none text-slate-500 dark:text-slate-500 font-mono text-[10px] my-2 md:my-4 tracking-wider italic' : ''}
                ${!msg.isSystem && msg.user === 'Mustafa' 
                  ? 'bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-900 dark:text-cyan-50 rounded-tr-none' 
                  : !msg.isSystem ? 'bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-900 dark:text-purple-50 rounded-tl-none' : ''}
              `}>
                <div className="flex flex-col gap-2">
                   {msg.text}
                </div>
              </div>
            </motion.div>
          ))}
          
          <AnimatePresence>
            {isTyping && (
                <div className="flex items-start gap-3 md:gap-6">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg bg-purple-500/10 text-purple-400 border-purple-500/30">
                        <Bot size={16} />
                    </div>
                    <TypingIndicator />
                </div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 md:mt-16 pt-8 border-t border-slate-200 dark:border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
           {[
             { label: "Uptime", val: "99.9%" },
             { label: "Deployment", val: "Automated" },
             { label: "Security", val: "Zero-Trust" },
             { label: "Status", val: "Active" }
           ].map((stat, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               transition={{ delay: 1 + (i * 0.1) }}
               className="flex flex-col gap-1"
             >
                <span className="text-[8px] font-mono text-slate-400 dark:text-white/30 uppercase tracking-[0.3em]">{stat.label}</span>
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-500 font-bold">{stat.val}</span>
             </motion.div>
           ))}
        </div>
      </motion.div>
    </section>
  );
};

export default AboutChat;
