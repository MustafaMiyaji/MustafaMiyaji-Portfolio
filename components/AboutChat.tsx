
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Bot, ChevronRight, Cpu, Shield, Wifi, Activity } from 'lucide-react';
import { useSound } from './SoundManager';

const messages = [
  { id: 1, text: "Initializing identity protocol...", sender: 'system' },
  { id: 2, text: "Identity Verified: Mustafa Miyaji", sender: 'bot' },
  { id: 3, text: "Role: Lead Cloud Architect & Neural Grid Architect", sender: 'bot' },
  { id: 4, text: "Mission: To construct resilient, self-healing digital infrastructures.", sender: 'bot' },
  { id: 5, text: "Stack analysis complete. Loading modules: Kubernetes, Terraform, React, Node.js.", sender: 'system' },
  { id: 6, text: "Current Status: Open for high-priority contracts.", sender: 'bot' },
];

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5">
        <div className={`p-1.5 rounded bg-${color}-500/20 text-${color}-400`}>
            {icon}
        </div>
        <div className="flex flex-col">
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">{label}</span>
            <span className="text-[10px] font-mono text-slate-300">{value}</span>
        </div>
    </div>
);

const AboutChat: React.FC = () => {
    const [visibleMessages, setVisibleMessages] = useState<typeof messages>([]);
    const [isTyping, setIsTyping] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { playKeystroke, playSuccess } = useSound();

    // Auto-scroll logic restricted to the chat container
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [visibleMessages, isTyping]);

    useEffect(() => {
        let currentIdx = 0;
        
        const showNextMessage = () => {
            if (currentIdx >= messages.length) {
                setIsTyping(false);
                return;
            }

            setIsTyping(true);
            const msg = messages[currentIdx];
            
            // Random typing delay based on length
            const typingTime = 500 + Math.random() * 800;

            setTimeout(() => {
                setVisibleMessages(prev => [...prev, msg]);
                playSuccess();
                currentIdx++;
                showNextMessage();
            }, typingTime);
        };

        const initialDelay = setTimeout(showNextMessage, 1000);
        return () => clearTimeout(initialDelay);
    }, []);

    return (
        <section id="about" className="py-24 md:py-32 px-4 max-w-6xl mx-auto w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
                
                {/* Left Panel: Stats (Hidden on mobile) */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="hidden lg:flex flex-col gap-4 p-4 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl h-full"
                >
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                        <Activity size={16} className="text-cyan-500 animate-pulse" />
                        <span className="text-xs font-mono text-slate-300">SYSTEM_METRICS</span>
                    </div>
                    
                    <SidebarItem icon={<Cpu size={14} />} label="CPU Usage" value="12% / 3.4GHz" color="cyan" />
                    <SidebarItem icon={<Shield size={14} />} label="Encryption" value="AES-256-GCM" color="purple" />
                    <SidebarItem icon={<Wifi size={14} />} label="Latency" value="24ms (Stable)" color="green" />
                    
                    <div className="mt-auto p-4 bg-cyan-900/10 border border-cyan-500/20 rounded-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-cyan-500/5 animate-pulse" />
                        <span className="text-[10px] font-mono text-cyan-400 block mb-2">NEURAL_SYNC</span>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-cyan-500"
                                animate={{ width: ["0%", "100%"] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Main Chat Terminal */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="lg:col-span-3 bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative"
                >
                    {/* Glass Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] pointer-events-none" />

                    {/* Header */}
                    <div className="bg-slate-900/50 p-4 border-b border-white/5 flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                            </div>
                            <div className="h-4 w-[1px] bg-white/10 mx-1" />
                            <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
                                <Terminal size={12} className="text-cyan-500" /> 
                                protocol_chat_v1.0.sh
                            </span>
                        </div>
                        <div className="px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-[9px] font-mono text-green-400 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            SECURE_CONN
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div 
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-sm custom-scrollbar relative z-10"
                    >
                        {visibleMessages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex gap-4 group ${msg.sender === 'system' ? 'opacity-60 my-8 pl-4 border-l-2 border-slate-700' : ''}`}
                            >
                                {msg.sender !== 'system' && (
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border 
                                        ${msg.sender === 'bot' ? 'bg-cyan-950/30 border-cyan-500/30 text-cyan-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                                        {msg.sender === 'bot' ? <Bot size={16} /> : <ChevronRight size={16} />}
                                    </div>
                                )}
                                
                                <div className="flex flex-col gap-1 max-w-[85%]">
                                    <span className={`text-[10px] uppercase tracking-wider font-bold ${msg.sender === 'bot' ? 'text-cyan-600' : 'text-slate-500'}`}>
                                        {msg.sender}
                                    </span>
                                    <p className={`${msg.sender === 'bot' ? 'text-slate-200 leading-relaxed' : 'text-slate-400 italic text-xs'}`}>
                                        {msg.text}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                        
                        {isTyping && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 items-center">
                                 <div className="w-8 h-8 flex items-center justify-center shrink-0 text-cyan-500/50">
                                    <Bot size={16} />
                                </div>
                                <div className="flex items-center gap-1 h-6 px-3 py-1 rounded-full bg-cyan-900/10 border border-cyan-500/10">
                                    <span className="text-[10px] text-cyan-500 font-mono animate-pulse">DECRYPTING_PACKET...</span>
                                    <span className="w-1 h-3 bg-cyan-500/50 ml-1 animate-blink" />
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutChat;
