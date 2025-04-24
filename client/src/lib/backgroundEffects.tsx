import React, { useEffect, useRef } from "react";

interface StarfieldProps {
  speed?: number;
  density?: number;
  opacity?: number;
  className?: string;
}

export const Starfield: React.FC<StarfieldProps> = ({
  speed = 0.05,
  density = 100,
  opacity = 0.5,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    let width = 0;
    let height = 0;

    // Initialize stars
    const initStars = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      stars = [];

      for (let i = 0; i < density; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.1,
          speed: Math.random() * (speed * 2) + speed * 0.1,
          opacity: Math.random() * opacity
        });
      }
    };

    // Draw stars
    const drawStars = () => {
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
        
        // Move star
        star.y += star.speed;
        
        // If star reaches bottom, reset to top
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
      }
      
      animationFrameId = requestAnimationFrame(drawStars);
    };

    // Handle resize
    const handleResize = () => {
      initStars();
    };

    window.addEventListener('resize', handleResize);
    initStars();
    drawStars();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density, speed, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full -z-10 ${className}`}
    />
  );
};

interface BackgroundGradientProps {
  className?: string;
  children?: React.ReactNode;
}

export const BackgroundGradient: React.FC<BackgroundGradientProps> = ({ 
  className = "", 
  children 
}) => {
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-indigo-950/20 z-[-1]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-900/40 to-gray-950 z-[-2]" />
      <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full filter blur-[120px] top-1/4 -left-12 z-[-1]" />
      <div className="absolute w-96 h-96 bg-indigo-600/20 rounded-full filter blur-[120px] bottom-1/4 -right-12 z-[-1]" />
      {children}
    </div>
  );
};

export const NeonGlow = ({ children, color = "purple", className = "" }: { 
  children: React.ReactNode;
  color?: "purple" | "blue" | "indigo" | "red" | "green" | "yellow"; 
  className?: string;
}) => {
  const colorMap = {
    purple: "shadow-purple-500/50",
    blue: "shadow-blue-500/50",
    indigo: "shadow-indigo-500/50",
    red: "shadow-red-500/50",
    green: "shadow-green-500/50",
    yellow: "shadow-yellow-500/50",
  };

  return (
    <div className={`shadow-lg ${colorMap[color]} ${className}`}>
      {children}
    </div>
  );
};

export const ParticleEffect = ({ density = 20, className = "" }: { 
  density?: number;
  className?: string; 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    // Create particles
    for (let i = 0; i < density; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 4 + 1;
      
      particle.className = 'absolute rounded-full bg-white/30';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.opacity = `${Math.random() * 0.5 + 0.1}`;
      particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      
      container.appendChild(particle);
    }
    
    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [density]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`} />
  );
};

export const ShimmerButton = ({ 
  children,
  className = "",
  onClick
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-md px-4 py-2
        bg-slate-900/50 border border-slate-800
        hover:bg-slate-800/70 transition-colors
        ${className}
      `}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="shimmer-effect absolute inset-0" />
      </div>
      <span className="relative z-10">{children}</span>
    </button>
  );
};