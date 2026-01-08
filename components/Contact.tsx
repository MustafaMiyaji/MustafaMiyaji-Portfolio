
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Loader2, Phone, Mail, User, FileText, Wifi } from 'lucide-react';
import { useSound } from './SoundManager';

const ACCESS_KEY = "6530beca-8de6-4201-b370-a342a6201a13";

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [descLength, setDescLength] = useState(0);
  const { playClick, playSuccess, playKeystroke, playHover } = useSound();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    formData.append("subject", `New Uplink Request from ${name}`);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        playSuccess();
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  // Calculate signal strength based on description length
  const signalStrength = Math.min(100, Math.max(10, (descLength / 50) * 100));
  const signalColor = signalStrength < 30 ? 'bg-red-500' : signalStrength < 70 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <section id="contact" className="py-24 md:py-32 px-4 relative z-10 w-full max-w-6xl mx-auto">
      
      <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-stretch">
        
        {/* Left Side: Info */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 mb-6"
            >
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                 <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 tracking-[0.3em] uppercase">Secure Uplink Available</span>
            </motion.div>
            
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white font-display leading-tight mb-6"
            >
                Let's Build the <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-600">Impossible.</span>
            </motion.h2>

            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-10 max-w-md"
            >
                Initiate a collaboration request. Whether it's complex cloud architecture, AI agents, or high-performance web apps, I'm ready to deploy.
            </motion.p>

            <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-6 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <div className="relative z-10">
                    <h4 className="font-mono text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Current Status</h4>
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-slate-900 dark:text-white font-bold">Open for New Contracts</span>
                    </div>
                </div>
            </motion.div>
        </div>

        {/* Right Side: The Form */}
        <div className="w-full md:w-1/2">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl shadow-cyan-500/5 dark:shadow-cyan-500/10 overflow-hidden"
            >
                 {/* Decorative Corner Lines */}
                 <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyan-500/20 rounded-tr-[2rem]" />
                 <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-purple-500/20 rounded-bl-[2rem]" />

                <AnimatePresence mode="wait">
                    {status === 'success' ? (
                        <motion.div 
                            key="success"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col items-center justify-center min-h-[400px] text-center"
                        >
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle className="text-green-500 w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Transmission Received</h3>
                            <p className="text-slate-500 dark:text-slate-400">Identity Verified. Establishing connection...</p>
                            
                            <div className="mt-8 p-4 bg-slate-100 dark:bg-white/5 rounded-lg border border-dashed border-slate-300 dark:border-white/10 w-full max-w-xs mx-auto">
                                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-2">
                                    <span>TICKET_ID</span>
                                    <span>#{Math.floor(Math.random() * 999999)}</span>
                                </div>
                                <div className="h-1 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-green-500" 
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 1.5 }}
                                    />
                                </div>
                                <div className="text-center mt-2 text-[10px] text-green-500 font-mono">Queued for review</div>
                            </div>

                            <button 
                                onClick={() => { setStatus('idle'); setDescLength(0); }}
                                className="mt-8 px-6 py-2 text-sm font-mono text-slate-500 hover:text-cyan-500 transition-colors"
                            >
                                SEND_NEW_PACKET
                            </button>
                        </motion.div>
                    ) : (
                        <motion.form 
                            key="form"
                            onSubmit={onSubmit}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col gap-5 relative z-10"
                        >
                            <input type="hidden" name="access_key" value={ACCESS_KEY} />
                            
                            {/* Row 1: Name & Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="group relative">
                                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-cyan-500 transition-colors">Operative Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={16} />
                                        <input 
                                            type="text" 
                                            name="name" 
                                            required 
                                            onKeyDown={playKeystroke}
                                            className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                            placeholder="Agent Cipher"
                                        />
                                    </div>
                                </div>
                                <div className="group relative">
                                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-purple-500 transition-colors">Comm Frequency (Email)</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={16} />
                                        <input 
                                            type="email" 
                                            name="email" 
                                            required 
                                            onKeyDown={playKeystroke}
                                            className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                            placeholder="signals@void.net"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Phone Number */}
                            <div className="group relative">
                                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-cyan-500 transition-colors">Secured Line</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={16} />
                                    <input 
                                        type="tel" 
                                        name="number" 
                                        required 
                                        onKeyDown={playKeystroke}
                                        className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                        placeholder="Encrypted Channel ID"
                                    />
                                </div>
                            </div>

                            {/* Row 3: Description with Signal Strength */}
                            <div className="group relative">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider group-focus-within:text-cyan-500 transition-colors">Mission Brief</label>
                                    <div className="flex items-center gap-2">
                                        <Wifi size={10} className={descLength > 0 ? "text-cyan-500" : "text-slate-600"} />
                                        <div className="w-16 h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                            <motion.div 
                                                className={`h-full ${signalColor}`}
                                                animate={{ width: `${signalStrength}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-4 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={16} />
                                    <textarea 
                                        name="description" 
                                        required 
                                        rows={4}
                                        onChange={(e) => setDescLength(e.target.value.length)}
                                        onKeyDown={playKeystroke}
                                        className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                        placeholder="Requesting extraction coordinates for Project Alpha..."
                                    ></textarea>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={status === 'submitting'}
                                onMouseEnter={playHover}
                                onClick={playClick}
                                className="relative w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors">
                                    {status === 'submitting' ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} /> ENCRYPTING PACKET...
                                        </>
                                    ) : (
                                        <>
                                            INITIATE_UPLINK <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                            </button>
                            
                            {status === 'error' && (
                                <div className="flex flex-col gap-1 mt-2">
                                    <p className="text-red-500 text-xs font-mono flex items-center gap-2">
                                        <AlertCircle size={12} /> SIGNAL LOST. RETRY UPLINK.
                                    </p>
                                </div>
                            )}
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
      </div>
    </section>
  );
}
