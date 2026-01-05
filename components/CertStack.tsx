
import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, MotionValue } from 'framer-motion';
import { Award, CheckCircle, Shield, Hexagon, FileWarning, X, Maximize2, ExternalLink } from 'lucide-react';

const certs = [
  { 
    title: "Oracle Cloud Infrastructure 2025 Certified DevOps Professional", 
    issuer: "Oracle", 
    color: "from-red-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1767620923055-fe7f4d6c6dea?q=80&w=1351&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  { 
    title: "Oracle Cloud Infrastructure 2025 Certified Architect Associate", 
    issuer: "Oracle", 
    color: "from-red-500 to-orange-500",
    image: "https://images.unsplash.com/photo-1767620922728-67e8ccc1ab57?q=80&w=1351&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  { 
    title: "Certified Red Team Operations Management (CRTOM)", 
    issuer: "Red Team Leaders", 
    color: "from-red-600 to-red-900",
    image: "https://images.unsplash.com/photo-1767620955913-b6b8f3e5ec19?q=80&w=1351&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  { 
    title: "Oracle Cloud Infrastructure 2025 Certified Foundations Associate", 
    issuer: "Oracle", 
    color: "from-red-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1767620922546-bff7bc99284f?q=80&w=1351&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  { 
    title: "Microsoft Certified: Azure Fundamentals", 
    issuer: "Microsoft", 
    color: "from-blue-500 to-blue-700",
    image: "https://images.unsplash.com/photo-1767620922525-4eed3df008b2?q=80&w=1396&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
  },
  { 
    title: "Getting Started with Linux Fundamentals (RH104)", 
    issuer: "Red Hat Academy", 
    color: "from-red-600 to-red-800",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=2574&auto=format&fit=crop"
  },
  { 
    title: "Oracle Certified Foundations Associate (Data Platform)", 
    issuer: "Oracle", 
    color: "from-red-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop"
  },
  { 
    title: "E-Business (Elite Certification)", 
    issuer: "NPTEL", 
    color: "from-teal-500 to-emerald-600",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
  },
  { 
    title: "Introduction to Cloud Computing", 
    issuer: "IBM (Coursera)", 
    color: "from-blue-400 to-indigo-600",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop"
  }
];

// Reusable card component (used in Stack and Grid)
// Added optional mouseX and mouseY props for parallax effect
const CertContent: React.FC<{ cert: typeof certs[0]; isGrid?: boolean; mouseX?: MotionValue<number>; mouseY?: MotionValue<number> }> = ({ cert, isGrid, mouseX, mouseY }) => {
    const [imageError, setImageError] = useState(false);
    
    // Parallax transforms: Move image opposite to card tilt for depth
    const imageX = useTransform(mouseX || new MotionValue(0), [-200, 200], [15, -15]);
    const imageY = useTransform(mouseY || new MotionValue(0), [-200, 200], [15, -15]);

    return (
        <div className={`w-full h-full flex flex-col ${isGrid ? 'p-4' : 'p-6'} bg-white dark:bg-[#0f0f0f] relative overflow-hidden`}>
            {/* Decorative Gradient Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500" />
            
            {/* Header Info */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <Shield className="text-slate-400 dark:text-white/40" size={14} />
                    <span className="text-[10px] text-slate-500 dark:text-white/60 font-mono tracking-wider">{cert.issuer.toUpperCase()}</span>
                </div>
                <CheckCircle size={14} className="text-green-500/50" />
            </div>

            {/* Main Title */}
            <div className={`relative z-20 ${isGrid ? 'mb-2' : 'mb-4'} overflow-visible`}>
                <h4 className={`${isGrid ? 'text-sm' : 'text-lg'} font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors`}>
                    {cert.title}
                </h4>
            </div>

            {/* Preview Image with Parallax */}
            <div className="flex-1 bg-slate-50 dark:bg-black/40 rounded-lg border border-slate-200 dark:border-white/5 relative overflow-hidden group-hover:border-cyan-400/50 transition-colors">
                {!imageError ? (
                    <motion.img 
                        src={cert.image} 
                        alt={cert.title}
                        onError={() => setImageError(true)}
                        style={!isGrid && mouseX ? { x: imageX, y: imageY, scale: 1.1 } : { scale: 1.0 }}
                        className="w-full h-full object-cover opacity-100 transition-transform duration-500"
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
            <div className="flex justify-between items-end pt-3 mt-auto">
                <span className="text-[10px] font-mono text-slate-400 dark:text-gray-500 flex items-center gap-1">
                    <Hexagon size={8} /> VERIFIED
                </span>
                {!isGrid && (
                     <div className="text-[10px] font-mono text-slate-400 dark:text-gray-600">
                     ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}
                   </div>
                )}
            </div>
        </div>
    );
};

const StackCard: React.FC<{ cert: typeof certs[0]; index: number; total: number; onClick: () => void }> = ({ cert, index, total, onClick }) => {
  // Parallax Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 200, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 200, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - (rect.left + rect.width / 2));
    y.set(e.clientY - (rect.top + rect.height / 2));
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  // Reverse index logic ensures first item in array is visually on top
  const zIndex = total - index;
  const yOffset = index * 12;
  const scale = 1 - (index * 0.05);

  return (
    <motion.div
      onClick={onClick}
      className="absolute w-full md:w-[450px] h-[320px] rounded-2xl shadow-2xl overflow-hidden origin-top cursor-pointer transition-all duration-500 group border border-slate-200 dark:border-white/10"
      style={{
        zIndex: zIndex,
        x: mouseX,
        y: mouseY,
      }}
      initial={{ 
        y: yOffset, 
        scale: scale,
        rotateX: index * 2 
      }}
      whileHover={{ 
        y: yOffset - 30, // Lift up
        rotateX: 0,
        scale: scale + 0.02,
        boxShadow: "0 0 40px rgba(6, 182, 212, 0.4)", // Strong Neon Glow
        borderColor: "rgba(6, 182, 212, 0.8)"
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="magnetic"
    >
      <CertContent cert={cert} mouseX={mouseX} mouseY={mouseY} />
      
      {/* Click Hint Overlay (Only on top card) */}
      {index === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-xs font-mono flex items-center gap-2">
                  <Maximize2 size={12} /> EXPAND VAULT
              </div>
          </div>
      )}
    </motion.div>
  );
};

// Full Screen Detail Modal for a specific cert
const DetailModal: React.FC<{ cert: typeof certs[0]; onClose: () => void }> = ({ cert, onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/95 dark:bg-black/95 backdrop-blur-xl"
            onClick={onClose}
        >
             <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative w-full max-w-4xl bg-slate-50 dark:bg-[#050505] rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
             >
                <div className="w-full md:w-1/2 bg-slate-100 dark:bg-white/5 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/5">
                    <img src={cert.image} alt={cert.title} className="max-w-full max-h-[50vh] object-contain shadow-2xl rounded-lg" />
                </div>
                <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="text-cyan-500" size={16} />
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tracking-widest uppercase">{cert.issuer}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white font-display mb-6">{cert.title}</h2>
                    <div className="space-y-4 mb-8">
                        <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                            <h4 className="text-xs font-mono text-slate-400 mb-1">CREDENTIAL ID</h4>
                            <p className="text-sm font-mono text-slate-700 dark:text-slate-300">{Math.random().toString(36).substr(2, 12).toUpperCase()}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                            <h4 className="text-xs font-mono text-slate-400 mb-1">STATUS</h4>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                                <p className="text-sm font-mono text-green-500">VERIFIED & ACTIVE</p>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-full py-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-mono text-sm tracking-widest border border-cyan-500/20 transition-all"
                    >
                        CLOSE RECORD
                    </button>
                </div>
                
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
             </motion.div>
        </motion.div>
    );
};

const ExpandedGrid: React.FC<{ onClose: () => void, onSelectCert: (cert: typeof certs[0]) => void }> = ({ onClose, onSelectCert }) => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10 bg-slate-900/80 dark:bg-black/90 backdrop-blur-xl"
        >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative w-full max-w-7xl h-full max-h-[90vh] bg-slate-50 dark:bg-[#050505] rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden"
            >
                {/* Modal Header */}
                <div className="p-6 md:p-8 border-b border-slate-200 dark:border-white/5 flex justify-between items-center bg-white dark:bg-[#0a0a0a]">
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Credential Vault</h2>
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
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {certs.map((cert, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => onSelectCert(cert)}
                                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer"
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
  const [selectedCert, setSelectedCert] = useState<typeof certs[0] | null>(null);
  
  // We only show top 5 in the stack to avoid clutter
  const visibleStack = certs.slice(0, 5);

  return (
    <section id="certs" className="py-32 px-4 w-full flex flex-col items-center">
      <h3 className="text-xs font-mono text-slate-500 dark:text-white/40 mb-12 uppercase tracking-widest">Certification Vault</h3>
      
      {/* Stack Container */}
      <div className="relative w-full max-w-md h-[400px] flex justify-center perspective-1000 mb-8">
        <div className="relative w-full h-full flex justify-center group">
            {visibleStack.map((cert, index) => (
                <StackCard 
                    key={index} 
                    cert={cert} 
                    index={index} 
                    total={visibleStack.length} 
                    onClick={() => setIsExpanded(true)}
                />
            ))}
        </div>
      </div>
      
      <p className="text-[10px] font-mono text-slate-500 dark:text-gray-600 mt-4 animate-pulse">
        [ Click stack to expand registry ]
      </p>

      {/* Expanded Grid Modal */}
      <AnimatePresence>
        {isExpanded && (
            <ExpandedGrid 
                onClose={() => setIsExpanded(false)} 
                onSelectCert={(cert) => setSelectedCert(cert)} 
            />
        )}
      </AnimatePresence>

      {/* Full Screen Detail Modal */}
      <AnimatePresence>
        {selectedCert && (
            <DetailModal 
                cert={selectedCert} 
                onClose={() => setSelectedCert(null)} 
            />
        )}
      </AnimatePresence>
    </section>
  );
};

export default CertStack;
