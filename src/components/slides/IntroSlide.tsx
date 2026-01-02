"use client";

import { motion } from "framer-motion";
import SlideWrapper from "./SlideWrapper";
import ParticleBackground from "../animations/ParticleBackground";

interface IntroSlideProps {
  year: number;
}

// Animated GPS Route that draws itself
function AnimatedGPSRoute() {
  // A realistic-looking running route path
  const routePath = "M15,50 Q25,20 40,35 T60,25 Q75,15 85,30 Q95,45 80,55 Q65,65 70,80 Q75,95 55,90 Q35,85 30,70 Q25,55 15,50";

  return (
    <motion.div
      className="relative w-48 h-48 md:w-64 md:h-64"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="40%" stopColor="#007dcd" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <filter id="routeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
            </feMerge>
          </filter>
        </defs>

        {/* Background glow layer */}
        <motion.path
          d={routePath}
          fill="none"
          stroke="#007dcd"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#strongGlow)"
          opacity="0.3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.2 }}
        />

        {/* Main route line */}
        <motion.path
          d={routePath}
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#routeGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.2 }}
        />

        {/* Start point */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4, type: "spring" }}
        >
          <circle cx="15" cy="50" r="4" fill="#00d4ff" filter="url(#routeGlow)" />
          <circle cx="15" cy="50" r="2" fill="white" />
        </motion.g>

        {/* End point / Current position - pulsing */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.4, type: "spring" }}
        >
          {/* Pulse rings */}
          <motion.circle
            cx="15"
            cy="50"
            r="4"
            fill="none"
            stroke="#a855f7"
            strokeWidth="1"
            animate={{ r: [4, 12, 4], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, delay: 2.7 }}
          />
          <motion.circle
            cx="15"
            cy="50"
            r="4"
            fill="none"
            stroke="#a855f7"
            strokeWidth="1"
            animate={{ r: [4, 18, 4], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 2.9 }}
          />
        </motion.g>

        {/* Moving dot along path */}
        <motion.circle
          r="3"
          fill="#ffffff"
          filter="url(#routeGlow)"
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.2 }}
          style={{
            offsetPath: `path("${routePath}")`,
          }}
        />
      </svg>

      {/* Distance indicator that appears */}
      <motion.div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs text-white/40 font-mono tracking-wider"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.8, duration: 0.5 }}
      >
        ROUTE LOADED
      </motion.div>
    </motion.div>
  );
}

// Animated year digits
function AnimatedYear({ year }: { year: number }) {
  const digits = year.toString().split("");

  return (
    <div className="flex justify-center items-center gap-1 md:gap-2">
      {digits.map((digit, i) => (
        <motion.span
          key={i}
          className="text-7xl md:text-9xl font-bold shimmer-text inline-block"
          initial={{
            opacity: 0,
            y: 50,
            rotateX: -90,
          }}
          animate={{
            opacity: 1,
            y: 0,
            rotateX: 0,
          }}
          transition={{
            delay: 0.8 + i * 0.12,
            duration: 0.6,
            ease: [0.215, 0.61, 0.355, 1],
          }}
          style={{ perspective: "500px" }}
        >
          {digit}
        </motion.span>
      ))}
    </div>
  );
}

// Cinematic light sweep
function LightSweep() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="absolute w-[200%] h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-[20deg]"
        initial={{ x: "-100%", y: "50vh" }}
        animate={{ x: "100%" }}
        transition={{ delay: 0.2, duration: 1.2, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

// Pulsing energy rings (replacing emojis)
function EnergyRings() {
  return (
    <div className="flex justify-center gap-8 md:gap-12 mt-16">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="relative w-3 h-3"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 + i * 0.15, duration: 0.5, type: "spring" }}
        >
          {/* Core dot */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-garmin-blue to-garmin-purple" />

          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 -m-2 rounded-full border border-garmin-blue/50"
            animate={{
              scale: [1, 2.5, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeOut",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default function IntroSlide({ year }: IntroSlideProps) {
  return (
    <SlideWrapper gradient="from-garmin-dark via-[#0f1629] to-[#1a0a2e]">
      {/* Particle background */}
      <ParticleBackground
        variant="stars"
        particleCount={60}
        speed={0.5}
        colors={["#007dcd", "#a855f7", "#00d4ff", "#ffffff"]}
      />

      {/* Cinematic light sweep on load */}
      <LightSweep />

      <div className="text-center relative z-10">
        {/* Animated GPS Route */}
        <div className="mb-6 flex justify-center">
          <AnimatedGPSRoute />
        </div>

        {/* Title */}
        <motion.h1
          className="text-2xl md:text-3xl font-medium text-white/70 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Dein Jahr
        </motion.h1>

        {/* Animated year with staggered digits */}
        <div className="mb-6">
          <AnimatedYear year={year} />
        </div>

        <motion.p
          className="text-xl md:text-2xl text-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          in Bewegung
        </motion.p>

        {/* Pulsing energy rings instead of emojis */}
        <EnergyRings />
      </div>
    </SlideWrapper>
  );
}
