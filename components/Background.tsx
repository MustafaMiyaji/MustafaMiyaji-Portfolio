
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
    const ctx = canvas.getContext('2d', { alpha: true }); 
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Mouse state
    const mouse = { x: -1000, y: -1000, active: false };

    // --- SYSTEMS CONFIG ---
    
    // Layer 1: Deep Space Stars (Static-ish, twinkling)
    interface Star {
        x: number;
        y: number;
        size: number;
        baseAlpha: number;
        pulseOffset: number;
        scrollSpeed: number;
    }
    const stars: Star[] = [];
    const STAR_COUNT = 400; 

    // Layer 2: Neural Nodes (Interactive, moving)
    interface Node {
        x: number;
        y: number;
        vx: number;
        vy: number;
        radius: number;
        color: string;
    }
    const nodes: Node[] = [];
    // Increased node count for better coverage
    const NODE_COUNT = isMobile() ? 40 : 80;
    const CONNECTION_DIST = 150;

    // Light Mode Orbs
    interface Orb {
        x: number;
        y: number;
        vx: number;
        vy: number;
        radius: number;
        color: string;
    }
    const orbs: Orb[] = [];

    function isMobile() {
        return width < 768;
    }

    const init = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Init Stars
        stars.length = 0;
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.5 + 0.5,
                baseAlpha: Math.random() * 0.5 + 0.2,
                pulseOffset: Math.random() * Math.PI * 2,
                scrollSpeed: Math.random() * 0.5 + 0.1 
            });
        }

        // Init Neural Nodes
        nodes.length = 0;
        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1.5,
                color: Math.random() > 0.5 ? 'cyan' : 'purple'
            });
        }

        // Init Orbs (Light Mode)
        orbs.length = 0;
        const colors = [
            'rgba(6, 182, 212, 0.6)', 
            'rgba(139, 92, 246, 0.6)', 
            'rgba(236, 72, 153, 0.5)'
        ];
        for (let i = 0; i < 6; i++) {
            orbs.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                radius: Math.random() * 150 + 100,
                color: colors[i % colors.length]
            });
        }
    };

    const drawDeepSpace = (time: number, velocity: number) => {
        ctx.clearRect(0, 0, width, height);
        
        ctx.fillStyle = "#FFF";
        stars.forEach(star => {
            // Parallax
            star.y -= velocity * star.scrollSpeed * 0.1;
            
            // Infinite Wrap Y using Modulo
            // This ensures they wrap seamlessly regardless of speed, preserving distribution
            star.y = (star.y % height + height) % height;

            // Twinkle
            const opacity = star.baseAlpha + Math.sin(time * 0.002 + star.pulseOffset) * 0.2;
            
            ctx.globalAlpha = Math.max(0.1, opacity);
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1.0;
    };

    const drawNeuralNetwork = (velocity: number) => {
        // We use a large buffer and modulo math to ensure the "cloud" wraps
        // without flattening into lines at the edges.
        const buffer = 100;
        const totalHeight = height + buffer * 2;

        nodes.forEach((node, i) => {
            // Move
            node.x += node.vx;
            // Apply velocity parallax to Y
            node.y += node.vy - (velocity * 0.05); 

            // X Axis: Wall Bounce
            if (node.x < 0) { node.x = 0; node.vx *= -1; }
            if (node.x > width) { node.x = width; node.vx *= -1; }

            // Y Axis: Infinite Wrap with Modulo
            // Shift coordinate space to positive, modulo by total height, shift back
            node.y = ((node.y + buffer) % totalHeight + totalHeight) % totalHeight - buffer;

            // Mouse Interaction
            if (mouse.active) {
                const dx = mouse.x - node.x;
                const dy = mouse.y - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 300) {
                    // Gentle push
                    node.x += (dx / dist) * -1; // Repel slightly
                    node.y += (dy / dist) * -1;
                }
            }

            // Draw Connections
            for (let j = i + 1; j < nodes.length; j++) {
                const other = nodes[j];
                const dx = node.x - other.x;
                const dy = node.y - other.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DIST) {
                    const alpha = (1 - dist / CONNECTION_DIST) * 0.4;
                    ctx.strokeStyle = node.color === 'cyan' 
                        ? `rgba(6, 182, 212, ${alpha})` 
                        : `rgba(139, 92, 246, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.stroke();
                }
            }
            
            // Mouse Connector
            if (mouse.active) {
                const dx = mouse.x - node.x;
                const dy = mouse.y - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist/200})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(mouse.x, mouse.y);
                    ctx.lineTo(node.x, node.y);
                    ctx.stroke();
                }
            }

            // Draw Node
            ctx.fillStyle = node.color === 'cyan' ? '#06b6d4' : '#8b5cf6';
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Glow
            const glow = node.color === 'cyan' ? 'rgba(6, 182, 212, 0.3)' : 'rgba(139, 92, 246, 0.3)';
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
            ctx.fill();
        });
    };

    const drawFluidAether = () => {
        ctx.clearRect(0, 0, width, height);
        
        orbs.forEach(orb => {
            orb.x += orb.vx;
            orb.y += orb.vy;

            // Bounce
            if (orb.x < 0 || orb.x > width) orb.vx *= -1;
            if (orb.y < 0 || orb.y > height) orb.vy *= -1;

            if (mouse.active) {
                const dx = orb.x - mouse.x;
                const dy = orb.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // Intense Interaction Logic
                if (dist < 500) {
                    const force = (500 - dist) / 500;
                    // Strong push away
                    orb.x += (dx / dist) * force * 15; 
                    orb.y += (dy / dist) * force * 15;
                    // Add slight random jitter for "energy" feel
                    orb.x += (Math.random() - 0.5) * 2;
                    orb.y += (Math.random() - 0.5) * 2;
                }
            }

            const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
            gradient.addColorStop(0, orb.color);
            gradient.addColorStop(1, 'rgba(255,255,255,0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    };

    const render = (time: number) => {
        // Safe access to velocity
        const velocity = scrollVelocity.get() || 0;

        if (theme === 'dark') {
            drawDeepSpace(time, velocity);
            drawNeuralNetwork(velocity);
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

    const handleTouchMove = (e: TouchEvent) => {
        if(e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
            mouse.active = true;
        }
    };
    
    const handleResize = () => {
        init();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchstart', handleTouchMove);
    
    init();
    requestAnimationFrame(render);

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchstart', handleTouchMove);
        cancelAnimationFrame(animationFrameId);
    };
  }, [theme, scrollVelocity]); 

  return (
    <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full z-0 bg-transparent"
        style={{ pointerEvents: 'none' }} 
    />
  );
};

export default Background;
