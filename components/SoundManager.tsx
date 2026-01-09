
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface SoundContextType {
  playHover: () => void;
  playClick: () => void;
  playSuccess: () => void;
  playKeystroke: () => void;
  triggerHaptic: (pattern?: number | number[]) => void;
  toggleMute: () => void;
  isMuted: boolean;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(true); // Default muted
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    const initAudio = () => {
        if (!audioCtxRef.current) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                audioCtxRef.current = new AudioContextClass();
            }
        }
    };
    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('keydown', initAudio, { once: true });
    return () => {
        window.removeEventListener('click', initAudio);
        window.removeEventListener('keydown', initAudio);
    };
  }, []);

  const playTone = (freq: number, type: OscillatorType, duration: number, vol: number) => {
    if (isMuted || !audioCtxRef.current) return;
    
    try {
        if(audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }

        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
        
        gain.gain.setValueAtTime(vol, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);

        osc.start();
        osc.stop(audioCtxRef.current.currentTime + duration);
    } catch (e) {
        // Ignore audio errors
    }
  };

  const playHover = () => playTone(800, 'sine', 0.05, 0.02);
  const playClick = () => playTone(300, 'square', 0.1, 0.03);
  
  const playKeystroke = () => {
      // Mechanical switch sound simulation (click + thock)
      // Slight randomization for realism
      const randomPitch = 600 + Math.random() * 200;
      playTone(randomPitch, 'triangle', 0.05, 0.04);
  }
  
  const playSuccess = () => {
      if (isMuted || !audioCtxRef.current) return;
      setTimeout(() => playTone(440, 'sine', 0.2, 0.05), 0);
      setTimeout(() => playTone(554, 'sine', 0.2, 0.05), 100);
      setTimeout(() => playTone(659, 'sine', 0.4, 0.05), 200);
  };

  // --- HAPTIC ENGINE ---
  const triggerHaptic = (pattern: number | number[] = 10) => {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(pattern);
      }
  };

  // Ambient Drone Logic
  useEffect(() => {
      if (!isMuted && audioCtxRef.current) {
          try {
            if(audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();

            const osc = audioCtxRef.current.createOscillator();
            const gain = audioCtxRef.current.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(50, audioCtxRef.current.currentTime); 
            
            gain.gain.setValueAtTime(0.015, audioCtxRef.current.currentTime); 
            
            osc.connect(gain);
            gain.connect(audioCtxRef.current.destination);
            osc.start();
            
            oscillatorRef.current = osc;
          } catch(e) {}
      } else {
          if (oscillatorRef.current) {
              try {
                oscillatorRef.current.stop();
                oscillatorRef.current.disconnect();
              } catch(e) {}
              oscillatorRef.current = null;
          }
      }
      
      return () => {
          if (oscillatorRef.current) {
               try { oscillatorRef.current.stop(); } catch(e) {}
          }
      };
  }, [isMuted]);

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <SoundContext.Provider value={{ playHover, playClick, playSuccess, playKeystroke, triggerHaptic, toggleMute, isMuted }}>
      {children}
    </SoundContext.Provider>
  );
};
