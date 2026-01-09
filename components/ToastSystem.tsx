
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'error';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const LETTERS_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

const DecryptText = ({ text }: { text: string }) => {
    const [display, setDisplay] = useState(text.split('').map(() => ' '));
    
    useEffect(() => {
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplay(text.split("").map((letter, index) => {
                if(index < iteration) return text[index];
                return LETTERS_POOL[Math.floor(Math.random() * LETTERS_POOL.length)];
            }));
            
            if(iteration >= text.length) clearInterval(interval);
            iteration += 1; // Fast decryption
        }, 20);
        return () => clearInterval(interval);
    }, [text]);

    return <span>{display.join('')}</span>;
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 left-6 z-[1000] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 bg-slate-900/90 dark:bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl shadow-cyan-500/10 min-w-[280px]"
            >
              {toast.type === 'success' && <CheckCircle size={16} className="text-green-500" />}
              {toast.type === 'info' && <Info size={16} className="text-cyan-500" />}
              {toast.type === 'error' && <AlertCircle size={16} className="text-red-500" />}
              
              <div className="flex flex-col flex-1">
                 <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">System Message</span>
                 <span className="text-sm text-white font-medium font-mono">
                    <DecryptText text={toast.message} />
                 </span>
              </div>
              
              <button onClick={() => removeToast(toast.id)} className="text-slate-500 hover:text-white">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
