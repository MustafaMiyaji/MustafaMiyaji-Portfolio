
import React, { useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';
import { MotionValue } from 'framer-motion';

interface BackgroundProps {
    scrollVelocity: MotionValue<number>;
}

const Background: React.FC<BackgroundProps> = ({ scrollVelocity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); 
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Mouse state
    const mouse = { x: -1000, y: -1000, active: false };

    // --- SYSTEMS CONFIG ---
    // Dark Mode: "The Neural Grid"
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseSize: number;
      pulse: number;
      pulseSpeed: number;
      threatLevel: number;
    }
    const particles: Particle[] = [];
    const PARTICLE_COUNT = 150; 
    const CONNECTION_DIST = 160;
    const MOUSE_REPULSION_DIST = 250;
    const PANIC_DIST = 150;

    // Light Mode: "Fluid Aether"
    interface Orb {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseRadius: number;
      color: string;
      angle: number;
      angleSpeed: number;
      oscillationSpeed: number;
      oscillationAmp: number;
    }
    const orbs: Orb[] = [];
    const orbColors = [
        'rgba(6, 182, 212, 0.15)',  
        'rgba(139, 92, 246, 0.15)', 
        'rgba(59, 130, 246, 0.15)', 
        'rgba(236, 72, 153, 0.1)'   
    ];

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      // Init Particles (Dark Mode)
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const size = Math.random() * 2 + 0.5;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: size,
          baseSize: size,
          pulse: Math.random() * Math.PI,
          pulseSpeed: 0.02 + Math.random() * 0.03,
          threatLevel: 0
        });
      }

      // Init Orbs (Light Mode)
      orbs.length = 0;
      for (let i = 0; i < 7; i++) {
        const radius = Math.random() * 300 + 200;
        orbs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: radius,
          baseRadius: radius,
          color: orbColors[i % orbColors.length],
          angle: Math.random() * Math.PI * 2,
          angleSpeed: (Math.random() - 0.5) * 0.005,
          oscillationSpeed: 0.01 + Math.random() * 0.02,
          oscillationAmp: 20 + Math.random() * 30
        });
      }
    };

    const drawNeuralGrid = () => {
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#030014');
        gradient.addColorStop(1, '#0f172a'); 
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Read velocity directly from MotionValue inside the loop
        const currentVelocity = scrollVelocity.get();
        const warpFactor = Math.min(Math.abs(currentVelocity) / 50, 10); 
        const isWarping = warpFactor > 0.5;

        particles.forEach((p, i) => {
            const warpY = -(currentVelocity / 50); 
            
            p.x += p.vx;
            p.y += p.vy + warpY;
            p.pulse += p.pulseSpeed;

            p.size = p.baseSize + Math.sin(p.pulse) * 0.5;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            let r = 6; let g = 182; let b = 212;
            
            if (p.threatLevel > 0) p.threatLevel -= 0.05;
            if (p.threatLevel < 0) p.threatLevel = 0;

            if (mouse.active) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MOUSE_REPULSION_DIST) {
                    const force = (MOUSE_REPULSION_DIST - dist) / MOUSE_REPULSION_DIST;
                    p.vx += (dx / dist) * force * 2.0; 
                    p.vy += (dy / dist) * force * 2.0;
                    if (dist < PANIC_DIST) p.threatLevel = 1;
                }
            }
            
            r = r + (255 - r) * p.threatLevel;
            g = g + (50 - g) * p.threatLevel;
            b = b + (50 - b) * p.threatLevel;

            p.vx *= 0.94;
            p.vy *= 0.94;
            
            const alpha = 0.3 + Math.sin(p.pulse) * 0.5;
            const colorString = `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}`;

            if (isWarping) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x, p.y - (warpY * 3));
                ctx.strokeStyle = `${colorString}, ${alpha})`;
                ctx.lineWidth = p.size;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `${colorString}, ${alpha})`;
                ctx.fill();
            }

            if (!isWarping) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < CONNECTION_DIST) {
                        const opacity = (1 - dist / CONNECTION_DIST) * 0.15;
                        ctx.beginPath();
                        const isThreat = Math.max(p.threatLevel, p2.threatLevel);
                        const lr = 6 + (255 - 6) * isThreat;
                        const lg = 182 + (50 - 182) * isThreat;
                        const lb = 212 + (50 - 212) * isThreat;

                        ctx.strokeStyle = `rgba(${Math.floor(lr)}, ${Math.floor(lg)}, ${Math.floor(lb)}, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
        });
    };

    const drawFluidAether = () => {
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(0, 0, width, height);

        const currentVelocity = scrollVelocity.get();

        orbs.forEach(orb => {
            orb.angle += orb.angleSpeed;
            let dx = Math.cos(orb.angle) * 0.5 + orb.vx;
            let dy = Math.sin(orb.angle) * 0.5 + orb.vy;
            
            const warpY = -(currentVelocity / 100); 
            orb.y += warpY;

            orb.x += dx;
            orb.y += dy;

            // Intense Mouse Interaction
            if (mouse.active) {
                const dx = orb.x - mouse.x;
                const dy = orb.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // Increased interaction radius for "ripple" feel
                const INTERACTION_RADIUS = 500;
                
                if (dist < INTERACTION_RADIUS) {
                    const force = Math.pow((INTERACTION_RADIUS - dist) / INTERACTION_RADIUS, 2); // Exponential force
                    const angle = Math.atan2(dy, dx);
                    
                    // Violent push
                    orb.vx += Math.cos(angle) * force * 3.0;
                    orb.vy += Math.sin(angle) * force * 3.0;
                    
                    // Ripple distortion effect on radius
                    const velocityMag = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
                    orb.radius = orb.baseRadius + (velocityMag * 5) + (Math.sin(dist * 0.1) * 20);
                } else {
                    // Elastic return
                    orb.radius += (orb.baseRadius - orb.radius) * 0.05;
                }
            } else {
                 orb.radius += (orb.baseRadius - orb.radius) * 0.05;
            }

            // Boundary wrapping
            if (orb.x < -orb.radius) orb.x = width + orb.radius;
            if (orb.x > width + orb.radius) orb.x = -orb.radius;
            if (orb.y < -orb.radius) orb.y = height + orb.radius;
            if (orb.y > height + orb.radius) orb.y = -orb.radius;

            // Damping
            orb.vx *= 0.96;
            orb.vy *= 0.96;

            const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, Math.max(0, orb.radius));
            gradient.addColorStop(0, orb.color);
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(orb.x, orb.y, Math.max(0, orb.radius), 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.fillStyle = 'rgba(248, 250, 252, 0.3)';
        ctx.fillRect(0, 0, width, height);
    };

    const render = () => {
        if (theme === 'dark') {
            drawNeuralGrid();
        } else {
            drawFluidAether();
        }
        animationFrameId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    };
    
    const handleResize = () => {
        init();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    init();
    render();

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animationFrameId);
    };
  }, [theme, scrollVelocity]); 

  return (
    <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full -z-10"
        style={{ pointerEvents: 'none' }} 
    />
  );
};

export default Background;
