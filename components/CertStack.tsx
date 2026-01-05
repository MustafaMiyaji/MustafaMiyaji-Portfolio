
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, CheckCircle, Shield, Hexagon, X, ChevronRight } from 'lucide-react';

const certs = [
  { 
    title: "Oracle Cloud Infrastructure 2025 Certified DevOps Professional", 
    issuer: "Oracle", 
    color: "from-red-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1767620923055-fe7f4d6c6dea?q=80&w=1351&auto=format&fit=crop"
  },
  { 
    title: "Oracle Cloud Infrastructure 2025 Certified Architect Associate", 
    issuer: "Oracle", 
    color: "from-red-500 to-orange-500",
    image: "https://images.unsplash.com/photo-1767620922728-67e8ccc1ab57?q=80&w=1351&auto=format&fit=crop"
  },
  { 
    title: "Certified Red Team Operations Management (CRTOM)", 
    issuer: "Red Team Leaders", 
    color: "from-red-600 to-red-900",
    image: "https://images.unsplash.com/photo-1767620955913-b6b8f3e5ec19?q=80&w=1351&auto=format&fit=crop"
  },
  { 
    title: "Oracle Cloud Infrastructure 2025 Certified Foundations Associate", 
    issuer: "Oracle", 
    color: "from-red-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1767620922546-bff7bc99284f?q=80&w=1351&auto=format&fit=crop"
  },
  { 
    title: "Microsoft Certified: Azure Fundamentals", 
    issuer: "Microsoft", 
    color: "from-blue-500 to-blue-700",
    image: "https://images.unsplash.com/photo-1767620922525-4eed3df008b2?q=80&w=1396&auto=format&fit=crop"
  },
  { 
    title: "Certified Network Security Practitioner (CNSP)", 
    issuer: "The SecOps Group", 
    color: "from-blue-600 to-cyan-600",
    image: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=2668&auto=format&fit=crop"
  },
  { 
    title: "Cloud and DevOps Mastery Training 2025", 
    issuer: "Exlearn Technologies", 
    color: "from-yellow-500 to-amber-600",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2670&auto=format&fit=crop"
  }
];

// --- Sub-components ---

const CertContent: React.FC<{ cert: typeof certs[0]; isGrid?: boolean }> = ({ cert, isGrid }) => {
    const [imageError, setImageError] = useState(false);
    
    return (
        <div className={`w-full h-full flex flex-col ${isGrid ? 'p-4' : 'p-6'} bg-white dark:bg-[#0f0f0f] relative overflow-hidden group transition-all duration-300`}>
            {/* Holographic Sheen Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full group-hover:animate-shimmer" style={{ zIndex: 30 }} />

            {/* Decorative Gradient Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500" />
            
            {/* Header Info */}
            <div className="flex justify-between items-center mb-3 relative z-10">
                <div className="flex items-center gap-2">
                    <Shield className="text-slate-400 dark:text-white/40" size={14} />
                    <span className="text-[10px] text-slate-500 dark:text-white/60 font-mono tracking-wider">{cert.issuer.toUpperCase()}</span>
                </div>
                <CheckCircle size={14} className="text-green-500/50" />
            </div>

            {/* Main Title - Enhanced with Neon Glow on Hover */}
            <div className={`relative z-20 ${isGrid ? 'mb-2' : 'mb-4'} overflow-visible`}>
                <h4 className={`${isGrid ? 'text-sm' : 'text-lg'} font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] leading-tight transition-all duration-300 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]`}>
                    {cert.title}
                </h4>
            </div>

            {/* Preview Image */}
            <div className="flex-1 bg-slate-50 dark:bg-black/40 rounded-lg border border-slate-200 dark:border-white/5 relative overflow-hidden group-hover:border-cyan-400/50 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300">
                {!imageError ? (
                    <img 
                        src={cert.image} 
                        alt={cert.title}
                        onError={() => setImageError(true)}
                        className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full relative flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-white/5">
                        <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${cert.color} rounded-full opacity-20 blur-xl`} />
                        <Award size={24} className="text-slate-400 dark:text-white/20 mb-2 relative z-10" />
                        <div className="text-[8px] text-slate-400 font-mono">NO PREVIEW</div>
                    </div>
                )}
            </div>
            
            {/* Footer Metadata */}
            <div className="flex justify-between items-end pt-3 mt-auto relative z-10">
                <span className="text-[10px] font-mono text-slate-400 dark:text-gray-500 flex items-center gap-1">
                    <Hexagon size={8} /> VERIFIED
                </span>
            </div>
        </div>
    );
};

// --- Mobile Carousel Card ---
const MobileCard: React.FC<{ cert: typeof certs[0]; onClick: () => void }> = ({ cert, onClick }) => (
    <div 
        onClick={onClick}
        data-cursor="magnetic"
        className="min-w-[280px] w-[280px] h-[350px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden snap-center shrink-0 cursor-pointer"
    >
        <CertContent cert={cert} />
    </div>
);

// --- Expanded Modal ---
const ExpandedGrid: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-10 bg-slate-900/80 dark:bg-black/80"
            onClick={onClose}
        >
            <motion.div 
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                transition={{ type: "spring", bounce: 0.3 }}
                className="relative w-full max-w-7xl h-full max-h-[90vh] bg-slate-50 dark:bg-[#050505] rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-white/5 flex justify-between items-center bg-white dark:bg-[#0a0a0a]">
                    <div className="flex flex-col">
                        <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 dark:text-white">Credential Vault</h2>
                        <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 tracking-widest uppercase">Verified Blockchain Records</span>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-3 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-slate-900 dark:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Grid Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {certs.map((cert, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-cyan-500/30 hover:border-cyan-400 transition-all duration-300 cursor-pointer"
                            >
                                <CertContent cert={cert} isGrid />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const CertStack: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Only use top 5 for desktop deck to keep it clean
  const visibleStack = certs.slice(0, 5); 

  return (
    <section id="certs" className="py-20 md:py-32 px-4 w-full flex flex-col items-center overflow-hidden">
      
      {/* Header */}
      <div className="mb-12 text-center">
         <motion.h3 
            className="text-xs font-mono text-slate-500 dark:text-white/40 mb-2 uppercase tracking-widest"
         >
            Security_Clearance_Level_5
         </motion.h3>
         <h2 className="text-4xl md:text-5xl font-bold font-display text-slate-900 dark:text-white mb-4">
            Certification Vault
         </h2>
         <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full" />
      </div>
      
      {/* --- DESKTOP VIEW: Fan-Out Deck --- */}
      <div 
        className="hidden md:block relative w-[400px] h-[500px] perspective-1000 z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
         <div className="relative w-full h-full">
            {visibleStack.map((cert, index) => {
               // Calculate fan position
               // When hovered (fanned out), we calculate new Y and Scale
               const isTop = index === 0;
               const offset = index * 12;
               
               return (
                   <motion.div
                        key={index}
                        className="absolute top-0 w-full h-[320px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden cursor-pointer hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:border-cyan-500/50 transition-all duration-300"
                        style={{ 
                            zIndex: 10 - index,
                            transformOrigin: "center top",
                        }}
                        initial={{ y: offset, scale: 1 - index * 0.04 }}
                        animate={{ 
                            y: isHovered ? index * 80 : offset, // Spread out significantly on container hover
                            scale: isHovered ? 1 : 1 - index * 0.04,
                            rotateX: isHovered ? 0 : 0
                        }}
                        transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                        onClick={() => setIsExpanded(true)}
                        whileHover={{ scale: 1.05, zIndex: 20 }}
                        data-cursor="magnetic"
                   >
                        <div className="w-full h-full relative group/card">
                             <CertContent cert={cert} />
                             {isTop && !isHovered && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none">
                                     <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-mono border border-white/20">
                                         HOVER TO EXPAND
                                     </div>
                                </div>
                            )}
                        </div>
                   </motion.div>
               );
            })}
         </div>
      </div>

      {/* --- MOBILE VIEW: Horizontal Snap Carousel --- */}
      <div className="md:hidden w-full overflow-x-auto pb-8 snap-x snap-mandatory flex gap-4 px-6 no-scrollbar">
          {certs.map((cert, index) => (
              <MobileCard key={index} cert={cert} onClick={() => setIsExpanded(true)} />
          ))}
          <div className="snap-center shrink-0 w-8" /> {/* Spacer */}
      </div>
      
      {/* Mobile Hint */}
      <div className="md:hidden flex items-center gap-2 text-[10px] font-mono text-slate-400 animate-pulse mt-2">
          <span>SWIPE TO BROWSE</span> <ChevronRight size={12} />
      </div>

      {/* Desktop Hint */}
      <p className="hidden md:block text-[10px] font-mono text-slate-500 dark:text-gray-600 mt-[-100px] relative z-0">
        [ Click stack to access full registry ]
      </p>

      <AnimatePresence>
        {isExpanded && (
            <ExpandedGrid onClose={() => setIsExpanded(false)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default CertStack;
