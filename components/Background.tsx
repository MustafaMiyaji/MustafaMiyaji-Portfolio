
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
    
    // Mobile Detection for Performance
    const isMobileDevice = width < 768;

    // Mouse state
    const mouse = { x: -1000, y: -1000, active: false };

    // --- SYSTEMS CONFIG ---
    const STAR_COUNT = isMobileDevice ? 60 : 300; 
    const NODE_COUNT = isMobileDevice ? 25 : 60;
    const CONNECTION_DIST = 150;
    const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;

    // Layer 1: Deep Space Stars
    interface Star {
        x: number;
        y: number;
        size: number;
        baseAlpha: number;
        pulseOffset: number;
        scrollSpeed: number;
    }
    const stars: Star[] = [];

    // Layer 2: Neural Nodes
    interface Node {
        x: number;
        y: number;
        vx: number;
        vy: number;
        radius: number;
        color: string;
        baseColor: string; // Store original color to revert after interaction
    }
    const nodes: Node[] = [];

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

    const init = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Init Stars (Dark Mode Only)
        stars.length = 0;
        if (theme === 'dark') {
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
        }

        // Init Neural Nodes (Both Modes)
        nodes.length = 0;
        for (let i = 0; i < NODE_COUNT; i++) {
            const color = theme === 'light' ? (Math.random() > 0.5 ? 'blue' : 'darkblue') : (Math.random() > 0.5 ? 'cyan' : 'purple');
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * (isMobileDevice ? 0.3 : 0.5), // Slower on mobile
                vy: (Math.random() - 0.5) * (isMobileDevice ? 0.3 : 0.5),
                radius: Math.random() * 2 + 1.5,
                color: color,
                baseColor: color
            });
        }

        // Init Orbs (Light Mode) - Reduced count on mobile
        orbs.length = 0;
        if (theme === 'light') {
            const orbCount = isMobileDevice ? 2 : 4;
            const colors = [
                'rgba(59, 130, 246, 0.05)',  // Blueprint Blue
                'rgba(37, 99, 235, 0.05)',   // Darker Blue
            ];
            for (let i = 0; i < orbCount; i++) {
                orbs.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    radius: Math.random() * (isMobileDevice ? 100 : 300) + (isMobileDevice ? 50 : 150),
                    color: colors[i % colors.length]
                });
            }
        }
    };

    const drawDeepSpace = (time: number, velocity: number) => {
        if (theme === 'dark') ctx.clearRect(0, 0, width, height);
        
        ctx.fillStyle = "#FFF";
        stars.forEach(star => {
            star.y -= velocity * star.scrollSpeed * 0.1;
            star.y = (star.y % height + height) % height;

            const opacity = star.baseAlpha + Math.sin(time * 0.002 + star.pulseOffset) * 0.2;
            
            ctx.globalAlpha = opacity; 
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1.0;
    };

    const drawNeuralNetwork = (velocity: number) => {
        const buffer = 100;
        const totalHeight = height + buffer * 2;
        
        // Define colors based on theme
        const nodeColorCyan = theme === 'dark' ? '#06b6d4' : '#2563eb'; // Blueprint Blue in Light
        const nodeColorPurple = theme === 'dark' ? '#8b5cf6' : '#1e40af'; // Dark Blue in Light
        const warningColor = theme === 'dark' ? '#ef4444' : '#dc2626'; // Red for proximity warning

        ctx.lineWidth = 1;

        nodes.forEach((node, i) => {
            node.x += node.vx;
            node.y += node.vy - (velocity * 0.05); 

            if (node.x < 0) { node.x = 0; node.vx *= -1; }
            if (node.x > width) { node.x = width; node.vx *= -1; }

            node.y = ((node.y + buffer) % totalHeight + totalHeight) % totalHeight - buffer;

            // Mouse Repulsion & Color Shift Logic
            let isAgitated = false;
            if (mouse.active) {
                const dx = mouse.x - node.x;
                const dy = mouse.y - node.y;
                const distSq = dx * dx + dy * dy;
                const interactionRadius = 250 * 250; // Larger radius for repulsion

                if (distSq < interactionRadius) {
                    const dist = Math.sqrt(distSq);
                    const force = (interactionRadius - distSq) / interactionRadius;
                    
                    // Repulsion: Move AWAY from mouse
                    const angle = Math.atan2(dy, dx);
                    const moveX = Math.cos(angle) * force * 4; // Push strength
                    const moveY = Math.sin(angle) * force * 4;
                    
                    node.x -= moveX;
                    node.y -= moveY;
                    
                    // Mark as agitated if very close
                    if (dist < 100) isAgitated = true;
                }
            }

            // Draw Connections
            for (let j = i + 1; j < nodes.length; j++) {
                const other = nodes[j];
                const dx = node.x - other.x;
                const dy = node.y - other.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < CONNECTION_DIST_SQ) {
                    const dist = Math.sqrt(distSq);
                    // Darker lines in light mode for blueprint look
                    const alpha = (1 - dist / CONNECTION_DIST) * (theme === 'dark' ? 0.4 : 0.15); 
                    
                    ctx.strokeStyle = node.color === 'cyan' || node.color === 'blue'
                        ? (theme === 'dark' ? `rgba(6, 182, 212, ${alpha})` : `rgba(37, 99, 235, ${alpha})`)
                        : (theme === 'dark' ? `rgba(139, 92, 246, ${alpha})` : `rgba(30, 64, 175, ${alpha})`);
                    
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.stroke();
                }
            }
            
            // Draw Node
            if (isAgitated) {
                ctx.fillStyle = warningColor;
            } else {
                ctx.fillStyle = (node.color === 'cyan' || node.color === 'blue') ? nodeColorCyan : nodeColorPurple;
            }
            
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    };

    const drawFluidAether = () => {
        ctx.clearRect(0, 0, width, height);
        
        orbs.forEach(orb => {
            orb.x += orb.vx;
            orb.y += orb.vy;

            if (orb.x < 0 || orb.x > width) orb.vx *= -1;
            if (orb.y < 0 || orb.y > height) orb.vy *= -1;

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
        const velocity = scrollVelocity.get() || 0;

        if (theme === 'dark') {
            drawDeepSpace(time, velocity);
            drawNeuralNetwork(velocity);
        } else {
            drawFluidAether();
            drawNeuralNetwork(velocity); 
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
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    init();
    requestAnimationFrame(render);

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
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
