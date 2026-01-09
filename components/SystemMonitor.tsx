
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Battery, Zap, ZapOff, Crosshair, Wifi } from 'lucide-react';
import { useSound } from './SoundManager';

interface SystemMonitorProps {
    lowPowerMode: boolean;
    toggleLowPowerMode: () => void;
}

const SystemMonitor: React.FC<SystemMonitorProps> = ({ lowPowerMode, toggleLowPowerMode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [fps, setFps] = useState(60);
    const [time, setTime] = useState('');
    const { playClick, triggerHaptic } = useSound();
    
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toISOString().split('T')[1].split('.')[0] + 'Z');
        };
        const interval = setInterval(updateTime, 1000);
        updateTime();
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setFps(prev => Math.min(60, Math.max(45, prev + (Math.random() > 0.5 ? 1 : -1))));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let dataPoints: number[] = Array(20).fill(10);
        let animationId: number;

        const draw = () => {
            dataPoints.shift();
            dataPoints.push(Math.random() * 30 + 5);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#06b6d4';
            ctx.lineWidth = 1;
            ctx.beginPath();
            
            dataPoints.forEach((point, i) => {
                const x = (i / (dataPoints.length - 1)) * canvas.width;
                const y = canvas.height - point;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();

            ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.fill();

            animationId = requestAnimationFrame(() => setTimeout(draw, 100));
        };
        draw();

        return () => cancelAnimationFrame(animationId);
    }, [isOpen]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        playClick();
        triggerHaptic(5);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[900] pointer-events-auto flex flex-col items-end gap-2">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="bg-slate-900/90 dark:bg-black/90 backdrop-blur-md border border-slate-700 dark:border-white/10 rounded-lg p-4 w-64 shadow-2xl font-mono text-[10px] text-cyan-400"
                    >
                        <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
                            <span className="uppercase tracking-widest text-slate-400">System_Diagnostics</span>
                            <Activity size={12} className="animate-pulse" />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-slate-500">POINTER_XY</span>
                                <span>{mousePos.x}, {mousePos.y}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">SYS_TIME</span>
                                <span>{time}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">RENDER_FPS</span>
                                <span className={fps < 50 ? 'text-yellow-500' : 'text-green-500'}>{fps}</span>
                            </div>
                            <div className="h-10 bg-slate-800/50 rounded overflow-hidden relative border border-white/5">
                                <canvas ref={canvasRef} width={220} height={40} className="w-full h-full" />
                                <div className="absolute top-0.5 left-1 text-[8px] text-slate-500">NET_IO</div>
                            </div>
                            <div className="pt-2 border-t border-white/10">
                                <button 
                                    onClick={() => { toggleLowPowerMode(); triggerHaptic(20); }}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded transition-colors ${lowPowerMode ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}
                                >
                                    <span className="flex items-center gap-2">
                                        {lowPowerMode ? <Battery size={12} /> : <Zap size={12} />}
                                        {lowPowerMode ? 'ECO_MODE_ACTIVE' : 'PERFORMANCE_MODE'}
                                    </span>
                                    <div className={`w-2 h-2 rounded-full ${lowPowerMode ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border shadow-lg transition-all
                    ${isOpen ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:border-cyan-500 hover:text-cyan-400'}
                `}
            >
                <Crosshair size={14} className={isOpen ? 'animate-spin-slow' : ''} />
                <span className="text-[10px] font-mono font-bold tracking-widest">
                    {lowPowerMode ? 'ECO_OPS' : 'SYS_MON'}
                </span>
                <div className={`w-1.5 h-1.5 rounded-full ${lowPowerMode ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
            </motion.button>
        </div>
    );
};

export default SystemMonitor;
