"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

interface ParticleBackgroundProps {
  particleCount?: number;
  colors?: string[];
  speed?: number;
  className?: string;
  variant?: "stars" | "bubbles" | "sparks" | "snow";
}

export default function ParticleBackground({
  particleCount = 50,
  colors = ["#007dcd", "#00d4ff", "#a855f7", "#ffffff"],
  speed = 1,
  className = "",
  variant = "stars",
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  const createParticle = useCallback(
    (canvas: HTMLCanvasElement): Particle => {
      const baseSpeed = speed * 0.3;

      switch (variant) {
        case "bubbles":
          return {
            x: Math.random() * canvas.width,
            y: canvas.height + 10,
            size: Math.random() * 6 + 2,
            speedX: (Math.random() - 0.5) * baseSpeed,
            speedY: -Math.random() * baseSpeed * 2 - 0.5,
            opacity: Math.random() * 0.5 + 0.3,
            color: colors[Math.floor(Math.random() * colors.length)],
          };
        case "sparks":
          return {
            x: canvas.width / 2 + (Math.random() - 0.5) * 100,
            y: canvas.height / 2,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * baseSpeed * 4,
            speedY: (Math.random() - 0.5) * baseSpeed * 4,
            opacity: 1,
            color: colors[Math.floor(Math.random() * colors.length)],
          };
        case "snow":
          return {
            x: Math.random() * canvas.width,
            y: -10,
            size: Math.random() * 4 + 1,
            speedX: (Math.random() - 0.5) * baseSpeed,
            speedY: Math.random() * baseSpeed + 0.5,
            opacity: Math.random() * 0.6 + 0.4,
            color: "#ffffff",
          };
        case "stars":
        default:
          return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * baseSpeed * 0.5,
            speedY: (Math.random() - 0.5) * baseSpeed * 0.5,
            opacity: Math.random() * 0.8 + 0.2,
            color: colors[Math.floor(Math.random() * colors.length)],
          };
      }
    },
    [colors, speed, variant]
  );

  const initParticles = useCallback(
    (canvas: HTMLCanvasElement) => {
      particlesRef.current = Array.from({ length: particleCount }, () =>
        createParticle(canvas)
      );
    },
    [particleCount, createParticle]
  );

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach((particle, index) => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Variant-specific behavior
      switch (variant) {
        case "bubbles":
          if (particle.y < -10) {
            particlesRef.current[index] = createParticle(canvas);
          }
          // Slight wobble
          particle.speedX += (Math.random() - 0.5) * 0.05;
          break;
        case "sparks":
          particle.opacity -= 0.01;
          if (particle.opacity <= 0) {
            particlesRef.current[index] = createParticle(canvas);
          }
          break;
        case "snow":
          if (particle.y > canvas.height + 10) {
            particlesRef.current[index] = createParticle(canvas);
          }
          // Gentle sway
          particle.speedX = Math.sin(Date.now() * 0.001 + index) * 0.3;
          break;
        case "stars":
        default:
          // Twinkle effect
          particle.opacity =
            0.3 + Math.sin(Date.now() * 0.002 + index) * 0.3 + 0.3;
          // Wrap around edges
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.height;
          if (particle.y > canvas.height) particle.y = 0;
          break;
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.opacity;
      ctx.fill();

      // Add glow for sparks
      if (variant === "sparks" || variant === "stars") {
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
      }
    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    animationRef.current = requestAnimationFrame(animate);
  }, [variant, createParticle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initParticles, animate]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}

// Floating orbs - slower, larger, more ambient
export function FloatingOrbs({
  count = 5,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            width: 100 + i * 50,
            height: 100 + i * 50,
            left: `${(i * 20) % 100}%`,
            top: `${(i * 30) % 100}%`,
            background: `radial-gradient(circle, ${
              ["#007dcd20", "#a855f720", "#00d4ff20"][i % 3]
            } 0%, transparent 70%)`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${8 + i * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
