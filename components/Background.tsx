
import React, { useEffect, useRef } from 'react';

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for no transparency on base
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Check system theme dynamically
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    let isDark = mediaQuery.matches;

    // Mouse state
    const mouse = { x: -500, y: -500, active: false };

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
    }
    const particles: Particle[] = [];
    const PARTICLE_COUNT = 150; // Increased density
    const CONNECTION_DIST = 160;
    const MOUSE_REPULSION_DIST = 200; // Radius where particles avoid cursor

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
        'rgba(6, 182, 212, 0.15)',  // Soft Cyan
        'rgba(139, 92, 246, 0.15)', // Soft Purple
        'rgba(59, 130, 246, 0.15)', // Soft Blue
        'rgba(236, 72, 153, 0.1)'   // Soft Pink
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
          pulseSpeed: 0.02 + Math.random() * 0.03
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
        // Deep Space Background with slight pulse
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#030014'); // Deep Space Black
        gradient.addColorStop(1, '#0f172a'); // Slate 900
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        particles.forEach((p, i) => {
            // Physics
            p.x += p.vx;
            p.y += p.vy;
            p.pulse += p.pulseSpeed;

            // Breathing effect on size independent of mouse
            p.size = p.baseSize + Math.sin(p.pulse) * 0.5;

            // Boundary Wrap
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // REPULSION Logic (Avoid Cursor)
            let color = 'rgba(6, 182, 212,'; // Default Cyan base
            
            if (mouse.active) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Color Shift based on proximity (Cyan -> Purple)
                if (dist < 400) {
                     // Interpolate color roughly
                     color = `rgba(139, 92, 246,`; // Switch to purple base near mouse
                }

                if (dist < MOUSE_REPULSION_DIST) {
                    const force = (MOUSE_REPULSION_DIST - dist) / MOUSE_REPULSION_DIST;
                    
                    // Push away actively
                    p.vx += (dx / dist) * force * 1.5; 
                    p.vy += (dy / dist) * force * 1.5;
                    
                    // Particles shrink slightly when avoiding (compression)
                    p.size = Math.max(0.5, p.baseSize - force);
                }
            }
            
            // Friction/Limit speed
            p.vx *= 0.95;
            p.vy *= 0.95;
            
            // Minimum movement to keep it alive
            if (Math.abs(p.vx) < 0.2) p.vx += (Math.random() - 0.5) * 0.05;
            if (Math.abs(p.vy) < 0.2) p.vy += (Math.random() - 0.5) * 0.05;

            // Draw Nodes - Pulse effect
            const alpha = 0.3 + Math.sin(p.pulse) * 0.5; // More intense pulse
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `${color} ${alpha})`;
            ctx.fill();

            // Draw Connections
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DIST) {
                    const opacity = (1 - dist / CONNECTION_DIST) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = `${color} ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });
    };

    const drawFluidAether = () => {
        // Ceramic Background
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(0, 0, width, height);

        orbs.forEach(orb => {
            // Complex Fluid Movement: Velocity + Sine Wave Oscillation
            orb.angle += orb.angleSpeed;
            
            // Base movement
            let dx = Math.cos(orb.angle) * 0.5 + orb.vx;
            let dy = Math.sin(orb.angle) * 0.5 + orb.vy;
            
            // Add organic oscillation
            dx += Math.cos(Date.now() * 0.001 * orb.oscillationSpeed) * 0.2;
            dy += Math.sin(Date.now() * 0.001 * orb.oscillationSpeed) * 0.2;

            orb.x += dx;
            orb.y += dy;

            // Morphing size (pulsing blobs)
            const breathing = Math.sin(Date.now() * 0.002 + orb.x * 0.01) * 15;
            const currentRadius = orb.radius + breathing;

            // Wall Bounce
            if (orb.x < -currentRadius) orb.vx += 0.05;
            if (orb.x > width + currentRadius) orb.vx -= 0.05;
            if (orb.y < -currentRadius) orb.vy += 0.05;
            if (orb.y > height + currentRadius) orb.vy -= 0.05;

            // Intense Mouse Repulsion (Ripple effect)
            if (mouse.active) {
                const dx = orb.x - mouse.x;
                const dy = orb.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 600) {
                    const force = (600 - dist) / 600;
                    // Push away logic
                    orb.vx += (dx / dist) * force * 0.8;
                    orb.vy += (dy / dist) * force * 0.8;
                    
                    // Ripple size distortion - squish effect
                    orb.radius = orb.baseRadius - (Math.sin(dist * 0.1) * 20 * force);
                } else {
                    // Restore size with damped spring
                    orb.radius += (orb.baseRadius - orb.radius) * 0.05;
                }
            }
            
            // Friction
            orb.vx *= 0.96;
            orb.vy *= 0.96;

            // Draw Soft Orbs
            const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, Math.max(0, currentRadius));
            gradient.addColorStop(0, orb.color);
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(orb.x, orb.y, Math.max(0, currentRadius), 0, Math.PI * 2);
            ctx.fill();
        });

        // Matte Overlay for "Ceramic" feel
        ctx.fillStyle = 'rgba(248, 250, 252, 0.3)';
        ctx.fillRect(0, 0, width, height);
    };

    const render = () => {
        if (isDark) {
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

    const handleThemeChange = (e: MediaQueryListEvent) => {
        isDark = e.matches;
        init();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    mediaQuery.addEventListener('change', handleThemeChange);
    
    init();
    render();

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        mediaQuery.removeEventListener('change', handleThemeChange);
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full -z-10"
        style={{ pointerEvents: 'none' }} 
    />
  );
};

export default Background;
