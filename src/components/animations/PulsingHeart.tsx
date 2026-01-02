"use client";

import { motion } from "framer-motion";

interface PulsingHeartProps {
  size?: number;
  color?: string;
  bpm?: number;
  className?: string;
}

export default function PulsingHeart({
  size = 48,
  color = "#ff4757",
  bpm = 72,
  className = "",
}: PulsingHeartProps) {
  // Convert BPM to animation duration
  const duration = 60 / bpm;

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color, filter: "blur(20px)" }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Heart SVG */}
      <motion.svg
        viewBox="0 0 24 24"
        fill={color}
        className="relative z-10"
        style={{ width: size, height: size }}
        animate={{
          scale: [1, 1.15, 1, 1.1, 1],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </motion.svg>
    </motion.div>
  );
}

// EKG Line Animation
export function EKGLine({
  width = 200,
  height = 60,
  color = "#ff4757",
  className = "",
}: {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}) {
  // EKG pattern points
  const ekgPath = `M0,${height / 2} L${width * 0.1},${height / 2} L${width * 0.15},${height / 2} L${width * 0.18},${height * 0.8} L${width * 0.22},${height * 0.2} L${width * 0.26},${height * 0.7} L${width * 0.3},${height / 2} L${width * 0.35},${height / 2} L${width * 0.4},${height / 2} L${width * 0.45},${height / 2} L${width * 0.48},${height * 0.8} L${width * 0.52},${height * 0.2} L${width * 0.56},${height * 0.7} L${width * 0.6},${height / 2} L${width * 0.65},${height / 2} L${width * 0.7},${height / 2} L${width * 0.75},${height / 2} L${width * 0.78},${height * 0.8} L${width * 0.82},${height * 0.2} L${width * 0.86},${height * 0.7} L${width * 0.9},${height / 2} L${width},${height / 2}`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg width={width} height={height}>
        {/* Background line */}
        <path
          d={ekgPath}
          fill="none"
          stroke={`${color}30`}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Animated line */}
        <motion.path
          d={ekgPath}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 2, repeat: Infinity, ease: "linear" },
            opacity: { duration: 0.5 },
          }}
        />
        {/* Glowing dot at the end */}
        <motion.circle
          r="6"
          fill={color}
          filter="url(#glow)"
          initial={{ cx: 0, cy: height / 2 }}
          animate={{
            cx: [0, width],
            cy: [
              height / 2,
              height / 2,
              height * 0.8,
              height * 0.2,
              height * 0.7,
              height / 2,
              height / 2,
              height / 2,
              height / 2,
              height * 0.8,
              height * 0.2,
              height * 0.7,
              height / 2,
              height / 2,
              height / 2,
              height / 2,
              height * 0.8,
              height * 0.2,
              height * 0.7,
              height / 2,
              height / 2,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}

// Animated Heart Rate Number
export function HeartRateDisplay({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <PulsingHeart size={40} bpm={value} />
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-4xl font-bold text-white"
      >
        {value}
        <span className="text-lg text-white/50 ml-1">BPM</span>
      </motion.div>
    </div>
  );
}
