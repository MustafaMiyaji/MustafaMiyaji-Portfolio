
import React, { useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';
import { MotionValue } from 'framer-motion';

interface BackgroundProps {
    scrollVelocity: MotionValue<number>;
    lowPowerMode: boolean;
}

const Background: React.FC<BackgroundProps> = ({ scrollVelocity, lowPowerMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true }); 
    if (!ctx) return;

    if (lowPowerMode) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return; 
    }

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Mobile Detection for Performance
    const isMobileDevice = width < 768;

    // Mouse state
    const mouse = { x: -1000, y: -1000, active: false };

    // --- SYSTEMS CONFIG ---
    // Drastically reduced counts for mobile performance
    const STAR_COUNT = isMobileDevice ? 40 : 400; 
    const NODE_COUNT = isMobileDevice ? 15 : 60;
    const CONNECTION_DIST = isMobileDevice ? 100 : 150;
    const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;

    // Layer 1: Deep Space Stars
    interface Star {
        x: number;
        y: number;
        z: number; // Added Z depth for parallax
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
        baseColor: string;
    }
    const nodes: Node[] = [];

    // Light Mode Orbs
    interface Orb {
        x: number;
        y: number;
        vx: number;
        vy: number;
        radius: number;
        baseRadius: number; // For restoring size
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
                    z: Math.random() * 2 + 0.5, // Depth factor
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
                vx: (Math.random() - 0.5) * (isMobileDevice ? 0.3 : 0.5),
                vy: (Math.random() - 0.5) * (isMobileDevice ? 0.3 : 0.5),
                radius: Math.random() * 2 + 1.5,
                color: color,
                baseColor: color
            });
        }

        // Init Orbs (Light Mode)
        orbs.length = 0;
        if (theme === 'light') {
            const orbCount = isMobileDevice ? 2 : 4;
            const colors = [
                'rgba(59, 130, 246, 0.05)',  // Blueprint Blue
                'rgba(37, 99, 235, 0.05)',   // Darker Blue
            ];
            for (let i = 0; i < orbCount; i++) {
                const radius = Math.random() * (isMobileDevice ? 100 : 300) + (isMobileDevice ? 50 : 150);
                orbs.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    radius: radius,
                    baseRadius: radius,
                    color: colors[i % colors.length]
                });
            }
        }
    };

    const drawDeepSpace = (time: number, velocity: number) => {
        if (theme === 'dark') ctx.clearRect(0, 0, width, height);
        
        // WARP SPEED CALCULATION
        // Normalize velocity to a stretch factor (0 to 1)
        const warpFactor = Math.min(Math.abs(velocity) / 500, 15);
        const isWarping = warpFactor > 0.1;

        ctx.fillStyle = "#FFF";
        stars.forEach(star => {
            // Move stars based on scroll velocity (parallax)
            star.y -= velocity * star.scrollSpeed * 0.1 * star.z;
            star.y = (star.y % height + height) % height;

            const opacity = star.baseAlpha + Math.sin(time * 0.002 + star.pulseOffset) * 0.2;
            ctx.globalAlpha = opacity; 

            ctx.beginPath();
            
            if (isWarping) {
                // WARP EFFECT: Stretch star into a line
                const stretchLength = star.size + (warpFactor * 30 * star.z);
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(star.x, star.y - stretchLength); // Stretch upwards/downwards based on movement? Actually trail behind
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.lineWidth = star.size;
                ctx.stroke();
            } else {
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        ctx.globalAlpha = 1.0;
    };

    const drawNeuralNetwork = (velocity: number) => {
        const buffer = 100;
        const totalHeight = height + buffer * 2;
        
        const nodeColorCyan = theme === 'dark' ? '#06b6d4' : '#2563eb';
        const nodeColorPurple = theme === 'dark' ? '#8b5cf6' : '#1e40af';
        const warningColor = theme === 'dark' ? '#ef4444' : '#dc2626';

        ctx.lineWidth = 1;

        nodes.forEach((node, i) => {
            node.x += node.vx;
            node.y += node.vy - (velocity * 0.05); 

            if (node.x < 0) { node.x = 0; node.vx *= -1; }
            if (node.x > width) { node.x = width; node.vx *= -1; }

            node.y = ((node.y + buffer) % totalHeight + totalHeight) % totalHeight - buffer;

            let isAgitated = false;
            if (mouse.active) {
                const dx = mouse.x - node.x;
                const dy = mouse.y - node.y;
                const distSq = dx * dx + dy * dy;
                const interactionRadius = 250 * 250; 

                if (distSq < interactionRadius) {
                    const dist = Math.sqrt(distSq);
                    const force = (interactionRadius - distSq) / interactionRadius;
                    const angle = Math.atan2(dy, dx);
                    const moveX = Math.cos(angle) * force * 4; 
                    const moveY = Math.sin(angle) * force * 4;
                    
                    node.x -= moveX;
                    node.y -= moveY;
                    
                    if (dist < 100) isAgitated = true;
                }
            }

            for (let j = i + 1; j < nodes.length; j++) {
                const other = nodes[j];
                const dx = node.x - other.x;
                const dy = node.y - other.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < CONNECTION_DIST_SQ) {
                    const dist = Math.sqrt(distSq);
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
        if (isMobileDevice) {
            ctx.clearRect(0, 0, width, height);
            return;
        }

        ctx.clearRect(0, 0, width, height);
        
        orbs.forEach(orb => {
            // Mouse Interaction Logic
            if (mouse.active) {
                const dx = mouse.x - orb.x;
                const dy = mouse.y - orb.y;
                const distSq = dx * dx + dy * dy;
                const interactionRadius = 400 * 400; // Larger radius for big orbs

                if (distSq < interactionRadius) {
                    const dist = Math.sqrt(distSq);
                    const force = (interactionRadius - distSq) / interactionRadius;
                    const angle = Math.atan2(dy, dx);
                    
                    // Repulsion
                    orb.x -= Math.cos(angle) * force * 5;
                    orb.y -= Math.sin(angle) * force * 5;

                    // Ripple Distortion: Shrink radius when pushed, like compressing a bubble
                    const squishFactor = 1 - (force * 0.3);
                    orb.radius = orb.baseRadius * squishFactor;
                } else {
                     // Restore radius
                     orb.radius += (orb.baseRadius - orb.radius) * 0.05;
                }
            } else {
                orb.radius += (orb.baseRadius - orb.radius) * 0.05;
            }

            orb.x += orb.vx;
            orb.y += orb.vy;

            // Soft boundaries
            if (orb.x < -orb.radius) orb.x = width + orb.radius;
            if (orb.x > width + orb.radius) orb.x = -orb.radius;
            if (orb.y < -orb.radius) orb.y = height + orb.radius;
            if (orb.y > height + orb.radius) orb.y = -orb.radius;

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
        if (lowPowerMode) return; // Stop rendering loop
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
        if (lowPowerMode) {
             const canvas = canvasRef.current;
             if(canvas) {
                const ctx = canvas.getContext('2d');
                ctx?.clearRect(0, 0, canvas.width, canvas.height);
             }
        }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    init();
    if (!lowPowerMode) requestAnimationFrame(render);

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        cancelAnimationFrame(animationFrameId);
    };
  }, [theme, scrollVelocity, lowPowerMode]); 

  return (
    <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full z-0 bg-transparent"
        style={{ pointerEvents: 'none' }} 
    />
  );
};

export default Background;
