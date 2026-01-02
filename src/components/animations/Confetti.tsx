"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

export default function Confetti({
  isActive,
  duration = 3000,
  particleCount = 100,
  colors = ["#007dcd", "#00d4ff", "#ff6b6b", "#ffd93d", "#6bcb77", "#a855f7"],
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  const createParticles = useCallback(() => {
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * (canvasRef.current?.width || window.innerWidth),
        y: -20,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
      });
    }
    return particles;
  }, [particleCount, colors]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let activeParticles = 0;

    particlesRef.current.forEach((particle) => {
      if (particle.opacity <= 0) return;

      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.1; // gravity
      particle.rotation += particle.rotationSpeed;
      particle.opacity -= 0.005;

      if (particle.y > canvas.height) {
        particle.opacity = 0;
      }

      if (particle.opacity > 0) {
        activeParticles++;
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.fillRect(
          -particle.size / 2,
          -particle.size / 2,
          particle.size,
          particle.size * 0.6
        );
        ctx.restore();
      }
    });

    if (activeParticles > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particlesRef.current = createParticles();
    animate();

    const timeoutId = setTimeout(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }, duration);

    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, createParticles, animate, duration]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

// Simple emoji burst animation
export function EmojiBurst({
  emoji,
  isActive,
  count = 8,
}: {
  emoji: string;
  isActive: boolean;
  count?: number;
}) {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * 360;
        const distance = 100 + Math.random() * 50;
        const x = Math.cos((angle * Math.PI) / 180) * distance;
        const y = Math.sin((angle * Math.PI) / 180) * distance;

        return (
          <motion.div
            key={i}
            className="absolute text-4xl"
            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
            animate={{
              scale: [0, 1.5, 1],
              x: x,
              y: y,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.05,
              ease: "easeOut",
            }}
          >
            {emoji}
          </motion.div>
        );
      })}
    </div>
  );
}
