
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Award, CheckCircle, Shield, Hexagon, X, ChevronRight, ZoomIn } from 'lucide-react';

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
    image: "https://images.unsplash.com/photo-1767883921100-b8e1c167c75d?q=80&w=1351&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  { 
    title: "Oracle Cloud Data Platform 2025 Certified Foundations Associate", 
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
    title: "IBM Cloud Technical Advocate v4", 
    issuer: "IBM", 
    color: "from-blue-600 to-indigo-600",
    image: "http://images.unsplash.com/photo-1767883797428-44808fb98611?q=80&w=1351&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  { 
    title: "Red Hat Certified Enterprise Linux System Administrator", 
    issuer: "Red Hat", 
    color: "from-red-600 to-red-800",
    image: "https://images.unsplash.com/photo-1767883797540-6a7641e510a5?q=80&w=1351&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  { 
    title: "Certified Network Security Practitioner (CNSP)", 
    issuer: "The SecOps Group", 
    color: "from-blue-600 to-cyan-600",
    image: "https://images.unsplash.com/photo-1767883930326-de9f905436b3?q=80&w=1421&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  { 
    title: "Cloud and DevOps Mastery Training 2025", 
    issuer: "Exlearn Technologies", 
    color: "from-yellow-500 to-amber-600",
    image: "https://images.unsplash.com/photo-1767885372322-8dae334c4567?q=80&w=1418&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  { 
    title: "NPTEL Online Certification: E-Business", 
    issuer: "NPTEL", 
    color: "from-teal-500 to-emerald-600", 
    image: "https://images.unsplash.com/photo-1767883925915-ce91d2246847?q=80&w=1410&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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

            {/* Main Title */}
            <div className={`relative z-20 ${isGrid ? 'mb-2' : 'mb-4'} overflow-visible`}>
                <h4 className={`${isGrid ? 'text-sm' : 'text-lg'} font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] leading-tight transition-all duration-300 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]`}>
                    {cert.title}
                </h4>
            </div>

            {/* Preview Image - Enhanced Glow */}
            <div className="flex-1 bg-slate-50 dark:bg-black/40 rounded-lg border border-slate-200 dark:border-white/5 relative overflow-hidden group-hover:border-cyan-400/50 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300">
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
                
                {/* View Icon Overlay (Only on grid) */}
                {isGrid && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <ZoomIn className="text-white" size={24} />
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
        className="min-w-[280px] w-[280px] h-[350px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden snap-center shrink-0 cursor-pointer"
    >
        <CertContent cert={cert} />
    </div>
);

// --- Lightbox Component ---
const Lightbox: React.FC<{ cert: typeof certs[0]; onClose: () => void }> = ({ cert, onClose }) => {
    if (typeof document === 'undefined') return null;

    return createPortal(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[11000] bg-black/95 flex flex-col items-center justify-center p-4 md:p-10"
            onClick={onClose}
        >
             <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-[11001]"
            >
                <X size={24} />
            </button>

            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-5xl w-full h-auto max-h-[80vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                <img 
                    src={cert.image} 
                    alt={cert.title} 
                    className="w-full h-full object-contain rounded-lg shadow-2xl border border-white/10"
                />
            </motion.div>
            
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mt-6 text-center"
            >
                <h3 className="text-white text-xl md:text-2xl font-bold font-display">{cert.title}</h3>
                <span className="text-cyan-400 font-mono text-sm tracking-widest uppercase">{cert.issuer}</span>
            </motion.div>
        </motion.div>,
        document.body
    );
}

// --- Expanded Modal (The Vault) ---
const ExpandedGrid: React.FC<{ onClose: () => void; onSelectCert: (cert: typeof certs[0]) => void }> = ({ onClose, onSelectCert }) => {
    if (typeof document === 'undefined') return null;

    return createPortal(
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
                        <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 tracking-widest uppercase">Select Record to Inspect</span>
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
                                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:border-cyan-400 transition-all duration-300 cursor-pointer"
                                onClick={() => onSelectCert(cert)}
                            >
                                <CertContent cert={cert} isGrid />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>,
        document.body
    );
};

const CertStack: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCert, setSelectedCert] = useState<typeof certs[0] | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
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
                            y: isHovered ? index * 80 : offset, 
                            scale: isHovered ? 1 : 1 - index * 0.04,
                            rotateX: isHovered ? 0 : 0
                        }}
                        transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                        onClick={() => setIsExpanded(true)}
                        whileHover={{ scale: 1.05, zIndex: 20 }}
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
          <div className="snap-center shrink-0 w-8" />
      </div>
      
      {/* Mobile Hint */}
      <div className="md:hidden flex items-center gap-2 text-[10px] font-mono text-slate-400 animate-pulse mt-2">
          <span>SWIPE TO BROWSE</span> <ChevronRight size={12} />
      </div>

      {/* Desktop Hint */}
      <p className="hidden md:block text-[10px] font-mono text-slate-500 dark:text-gray-600 mt-[-100px] relative z-0">
        [ Click stack to access full registry ]
      </p>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {isExpanded && (
            <ExpandedGrid 
                onClose={() => setIsExpanded(false)} 
                onSelectCert={(cert) => setSelectedCert(cert)}
            />
        )}
        {selectedCert && (
            <Lightbox 
                cert={selectedCert} 
                onClose={() => setSelectedCert(null)} 
            />
        )}
      </AnimatePresence>
    </section>
  );
};

export default CertStack;
