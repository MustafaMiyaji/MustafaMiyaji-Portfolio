
import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, ArrowUpRight, Code2 } from 'lucide-react';
import { Project } from '../types';
import { useSound } from './SoundManager';
import { useToast } from './ToastSystem';
import { useTheme } from './ThemeContext';

const projects: Project[] = [
  {
    id: 'careerstealth',
    badge: 'AI AGENT',
    headline: 'CareerStealth',
    description: 'Neural HR agent simulating varied industry personas for ATS grading.',
    visualGradient: 'from-orange-500/10 to-red-600/20',
    link: 'https://careerstealth.app/',
    longDescription: "A sophisticated AI agent powered by Gemini that simulates various HR personas (The Grumpy Recruiter, The Tech Lead, The Startup Founder) to analyze resumes. It parses PDFs, evaluates keywords against ATS standards, and provides specific, actionable feedback with a touch of humor.",
    image: {
        light: "https://images.unsplash.com/photo-1767612600750-e8b5a43be3b3?q=80&w=1777&auto=format&fit=crop",
        dark: "https://images.unsplash.com/photo-1767891002849-c141635217ac?q=80&w=2115&auto=format&fit=crop"
    }
  },
  {
    id: 'perfectreply',
    badge: 'SAAS',
    headline: "PerfectReply",
    description: "Multimodal sentiment analysis engine for conversational optimization.",
    visualGradient: 'from-purple-500/10 to-pink-600/20',
    link: 'https://perfectreply.tech',
    longDescription: "An empathy-driven engine that analyzes screenshots of conversations and audio snippets to determine the 'vibe'. It suggests replies that aren't just grammatically correct but emotionally calibrated to the specific relationship dynamic.",
    image: {
        light: "https://images.unsplash.com/photo-1767891003043-dfade1a8c5bc?q=80&w=2114&auto=format&fit=crop",
        dark: "https://images.unsplash.com/photo-1767612600629-fce3bb48b50e?q=80&w=1778&auto=format&fit=crop"
    }
  },
  {
    id: 'blockchain-logs',
    badge: 'WEB3 DEVOPS',
    headline: 'ChainLog',
    description: 'Decentralized immutable audit trail for CI/CD pipelines.',
    visualGradient: 'from-blue-500/10 to-slate-600/20',
    link: 'https://github.com/MustafaMiyaji',
    longDescription: "Developed a decentralized logging system to record immutable deployment audit trails for DevOps pipelines. Integrated Blockchain technology to ensure transparency and prevent tampering of CI/CD build logs.",
    image: {
        light: "https://images.unsplash.com/photo-1767891002869-2a6cd0135cde?q=80&w=2113&auto=format&fit=crop",
        dark: "https://images.unsplash.com/photo-1767612600650-fefb103d537d?q=80&w=2079&auto=format&fit=crop"
    }
  },
  {
    id: 'aws-vpc',
    badge: 'AWS INFRA',
    headline: 'AWS VPC Deployment',
    description: 'Secure network architecture with public/private subnets, NAT, and bastion access.',
    visualGradient: 'from-yellow-500/10 to-orange-600/20',
    link: 'https://github.com/MustafaMiyaji',
    longDescription: "This project provides a detailed implementation of an AWS Virtual Private Cloud (VPC) with a secure network architecture. The deployment process includes configuring public and private subnets, setting up a NAT gateway, and deploying a bastion server for secure SSH access to internal resources.",
    image: {
        light: "https://images.unsplash.com/photo-1767891002831-0e00b157fe14?q=80&w=2116&auto=format&fit=crop",
        dark: "https://images.unsplash.com/photo-1767612600648-34c9b1fe6bda?q=80&w=2110&auto=format&fit=crop"
    }
  }
];

const categories = ['ALL', 'AI AGENT', 'SAAS', 'WEB3 DEVOPS', 'AWS INFRA'];

const TechBadge: React.FC<{ label: string; index: number }> = ({ label, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileHover={{ scale: 1.1 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="px-2 py-1 bg-white/20 dark:bg-black/50 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-md text-[10px] font-mono text-white font-semibold"
  >
    {label}
  </motion.div>
);

const ProjectCard: React.FC<{ project: Project; onClick: () => void }> = ({ project, onClick }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const { playHover, playClick } = useSound();
  const { theme } = useTheme();

  const currentImage = theme === 'dark' ? project.image.dark : project.image.light;

  const rotateX = useSpring(useTransform(y, [-100, 100], [5, -5]), { stiffness: 400, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-5, 5]), { stiffness: 400, damping: 30 });

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - (rect.left + rect.width / 2));
    y.set(e.clientY - (rect.top + rect.height / 2));
  }

  // Dynamic Text Shadow
  const textShadowX = useTransform(x, [-200, 200], [8, -8]);
  const textShadowY = useTransform(y, [-200, 200], [8, -8]);
  
  const techStack = ['React', 'TypeScript', 'Node.js', 'AWS']; 

  return (
    <motion.div
      layout
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); setIsHovered(false); }}
      onMouseEnter={() => { setIsHovered(true); playHover(); }}
      onClick={() => { onClick(); playClick(); }}
      data-cursor="magnetic" 
      className="group relative h-[380px] md:h-[450px] rounded-[2rem] overflow-hidden cursor-none border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-cyber-dark transform-style-3d shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-cyan-500/50"
    >
      {/* Laser Scan Animation */}
      <motion.div 
         className="absolute w-full h-[2px] bg-cyan-400 z-50 opacity-0 group-hover:opacity-100"
         animate={isHovered ? { top: ['0%', '100%'], opacity: [0, 1, 0] } : {}}
         transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
         style={{ boxShadow: '0 0 10px #22d3ee' }}
      />

      <div className="absolute inset-0 z-0 bg-slate-900 overflow-hidden">
        {/* Main Image */}
        <motion.img 
            key={currentImage}
            src={currentImage} 
            alt={project.headline} 
            className="w-full h-full object-cover relative z-10"
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
                scale: isHovered ? 1.1 : 1,
                filter: isHovered ? 'brightness(0.4) saturate(1.2)' : 'brightness(0.9) saturate(1)'
            }}
            transition={{ duration: 0.7 }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10" />

      {/* ENHANCED GLARE EFFECT - PULSING */}
      <motion.div 
        className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay"
        animate={isHovered ? {
            backgroundPosition: ["0% 0%", "100% 100%"],
            opacity: [0.3, 0.7, 0.3]
        } : {
            backgroundPosition: ["0% 50%", "100% 50%"],
            opacity: [0.05, 0.15, 0.05]
        }}
        transition={{
            backgroundPosition: { duration: isHovered ? 3 : 8, repeat: Infinity, ease: "linear" },
            opacity: { duration: isHovered ? 1.5 : 4, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
            background: isHovered 
                ? "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.8) 45%, rgba(6,182,212,0.6) 50%, transparent 54%)"
                : "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.1) 50%, transparent 80%)",
            backgroundSize: "200% 200%",
            x: useTransform(x, [-100, 100], [-20, 20]),
            y: useTransform(y, [-100, 100], [-20, 20]),
        }}
      />

      <div className="absolute top-6 right-6 z-30 flex flex-col gap-2 items-end">
          <AnimatePresence>
            {isHovered && techStack.map((tech, i) => (
               <TechBadge key={tech} label={tech} index={i} />
            ))}
          </AnimatePresence>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-8 z-20">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
             <div className="w-6 h-[1px] bg-cyan-500" />
             <span className="text-[10px] font-mono text-cyan-400 tracking-[0.2em] uppercase shadow-black drop-shadow-md">{project.badge}</span>
          </div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={isHovered ? { y: 0, opacity: 1 } : { y: 10, opacity: 0.8 }}
            transition={{ duration: 0.5 }}
          >
              <motion.h3 
                className="text-2xl md:text-3xl font-bold text-white font-display tracking-tight drop-shadow-lg"
                style={{ 
                textShadow: useTransform(
                    [textShadowX, textShadowY],
                    ([sX, sY]: any) => isHovered ? `${sX}px ${sY}px 20px rgba(0,0,0,0.8)` : '0px 0px 0px rgba(0,0,0,0)'
                )
                }}
              >
                {project.headline}
              </motion.h3>
          </motion.div>
          
          <div className="overflow-hidden">
            <motion.p 
                className="text-xs md:text-sm text-slate-300 line-clamp-2 max-w-sm"
                animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                {project.description}
            </motion.p>
          </div>

          <div className="mt-4 flex items-center gap-4 overflow-hidden">
             <div className="px-5 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-mono text-white transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-150 flex items-center gap-2">
                <Code2 size={12} /> INITIALIZE_PROJECT
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Modal = ({ selectedId, onClose, selectedProject }: { selectedId: string, onClose: () => void, selectedProject: Project }) => {
    // Portal to body to avoid transform clipping
    if (typeof document === 'undefined') return null;
    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { theme } = useTheme();
    const currentImage = theme === 'dark' ? selectedProject.image.dark : selectedProject.image.light;
    
    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 lg:p-12">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/90 dark:bg-black/90 backdrop-blur-xl"
            />
            <motion.div 
                layoutId={`card-${selectedId}`}
                className="relative w-full max-w-6xl bg-white dark:bg-[#0a0a0a] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col lg:flex-row h-full max-h-[90vh] lg:max-h-[800px] z-10"
            >
                <div className="w-full lg:w-1/2 h-[200px] lg:h-full relative overflow-hidden bg-slate-800 shrink-0">
                    <img key={currentImage} src={currentImage} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                
                <div className="w-full lg:w-1/2 p-6 md:p-10 lg:p-16 overflow-y-auto relative flex flex-col">
                     <button 
                        onClick={onClose} 
                        className="sticky top-0 right-0 self-end mb-4 md:absolute md:top-6 md:right-6 p-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 rounded-full transition-colors text-slate-900 dark:text-white z-50 backdrop-blur-md"
                    >
                        <X size={20} />
                    </button>
                    
                    <span className="text-cyan-600 dark:text-cyan-400 font-mono text-xs tracking-[0.5em] uppercase">{selectedProject.badge}</span>
                    <h2 className="text-3xl lg:text-5xl font-bold mt-4 mb-6 text-slate-900 dark:text-white font-display">{selectedProject.headline}</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-base lg:text-lg leading-relaxed mb-10 font-sans">{selectedProject.longDescription}</p>
                    
                    <div className="flex flex-wrap gap-3 mb-12 mt-auto">
                        {['Cloud Arch', 'Neural Logic', 'Zero Trust'].map(t => (
                        <span key={t} className="px-4 py-1.5 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-mono text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 uppercase tracking-widest">{t}</span>
                        ))}
                    </div>

                    <a href={selectedProject.link} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-4 px-8 py-4 bg-cyan-600 dark:bg-cyan-500 text-white dark:text-black font-bold rounded-xl hover:bg-cyan-700 dark:hover:bg-cyan-400 transition-all shadow-lg hover:shadow-cyan-500/25 w-full md:w-auto">
                        INITIALIZE_OPS <ArrowUpRight size={18} />
                    </a>
                </div>
            </motion.div>
        </div>,
        document.body
    );
}

const ProjectGrid: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState('ALL');
  const selectedProject = projects.find(p => p.id === selectedId);
  const { playClick } = useSound();

  const filteredProjects = projects.filter(p => filter === 'ALL' || p.badge === filter);

  return (
    <section id="projects" className="py-24 md:py-32 px-4 md:px-6 w-full relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 md:mb-16 flex flex-col items-center text-center">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="flex items-center gap-2 mb-4"
           >
             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-400 tracking-[1em] uppercase">Portfolio_Index</span>
           </motion.div>
           
           <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white font-display uppercase tracking-tight mb-8">
             Selected Works
           </h2>
           
           {/* Filters */}
           <div className="flex flex-wrap justify-center gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => { setFilter(cat); playClick(); }}
                        className={`px-4 py-2 rounded-full text-[10px] font-mono tracking-wider border transition-all duration-300 
                            ${filter === cat 
                                ? 'bg-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/20' 
                                : 'bg-transparent text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:border-cyan-500/50 hover:text-cyan-600 dark:hover:text-cyan-400'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
           </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence>
            {filteredProjects.map(p => (
                <ProjectCard key={p.id} project={p} onClick={() => setSelectedId(p.id)} />
            ))}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {selectedId && selectedProject && (
              <Modal 
                selectedId={selectedId} 
                selectedProject={selectedProject} 
                onClose={() => { setSelectedId(null); playClick(); }} 
              />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProjectGrid;
