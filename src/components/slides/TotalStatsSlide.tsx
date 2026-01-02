"use client";

import { motion } from "framer-motion";
import SlideWrapper from "./SlideWrapper";
import { YearStats } from "@/lib/types/activity";
import CountingNumber from "../animations/CountingNumber";
import { useMemo } from "react";

interface TotalStatsSlideProps {
  stats: YearStats;
}

// Animated rising particles (energy effect)
function RisingParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 5 + Math.random() * 5,
      size: 3 + Math.random() * 4,
      opacity: 0.3 + Math.random() * 0.4,
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: -20,
            width: p.size,
            height: p.size,
            background: `linear-gradient(to top, #00d4ff, #a855f7)`,
            boxShadow: `0 0 ${p.size * 2}px rgba(0, 212, 255, 0.5)`,
          }}
          animate={{
            y: [0, -1000],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// Subtle grid background
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      {/* Radial fade to hide edges */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at center, transparent 20%, #0a1628 80%)' }}
      />
    </div>
  );
}

// Sparks that fly off the ring
function RingSparks({ delay = 2 }: { delay?: number }) {
  const sparks = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      angle: (i / 8) * 360,
      distance: 60 + Math.random() * 40,
    })), []
  );

  return (
    <>
      {sparks.map((spark) => (
        <motion.div
          key={spark.id}
          className="absolute w-1.5 h-1.5 rounded-full bg-white"
          style={{
            left: '50%',
            top: '50%',
            boxShadow: '0 0 6px 2px rgba(0,212,255,0.8)',
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 0,
            scale: 0
          }}
          animate={{
            x: Math.cos(spark.angle * Math.PI / 180) * spark.distance,
            y: Math.sin(spark.angle * Math.PI / 180) * spark.distance,
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 0.8,
            delay: delay + spark.id * 0.05,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}

// Animated progress ring with pulsing glow
function ProgressRing({ progress, delay = 0 }: { progress: number; delay?: number }) {
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64">
      {/* Pulsing outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: delay + 2,
          ease: "easeInOut",
        }}
      />

      <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="50%" stopColor="#007dcd" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <filter id="ringGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background ring */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="10"
        />

        {/* Animated progress ring */}
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          filter="url(#ringGlow)"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, delay, ease: "easeOut" }}
        />
      </svg>

      {/* Sparks on completion */}
      <RingSparks delay={delay + 1.8} />
    </div>
  );
}

// Icon components
function RouteIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 12h4l3-9 4 18 3-9h4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z" />
    </svg>
  );
}

function MountainIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3l4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

// SVG Icons for highlights
const highlightIcons = {
  calendar: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <circle cx="12" cy="16" r="2" fill="currentColor" />
    </svg>
  ),
  trophy: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2" />
      <path d="M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
      <path d="M18 2H6v7a6 6 0 0012 0V2z" />
    </svg>
  ),
  flame: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2c0 4-4 6-4 10a4 4 0 008 0c0-4-4-6-4-10z" />
      <path d="M12 12c0 2-1.5 3-1.5 4.5a1.5 1.5 0 003 0c0-1.5-1.5-2.5-1.5-4.5z" fill="currentColor" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  sun: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" fill="currentColor" fillOpacity="0.3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" fillOpacity="0.8">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  ),
  muscle: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 11c-1.5 0-3-1.5-3-3s1.5-3 3-3c.5 0 1 .1 1.4.3" strokeLinecap="round" />
      <path d="M17 11c1.5 0 3-1.5 3-3s-1.5-3-3-3c-.5 0-1 .1-1.4.3" strokeLinecap="round" />
      <path d="M7 11l5 8 5-8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="5" r="3" fill="currentColor" fillOpacity="0.3" />
    </svg>
  ),
};

type HighlightIconType = keyof typeof highlightIcons;

// Calculate personal highlight based on stats
function getPersonalHighlight(stats: YearStats): { icon: HighlightIconType; text: string; subtext: string } {
  const highlights: Array<{ icon: HighlightIconType; text: string; subtext: string; score: number }> = [];

  // Best month
  if (stats.monthlyStats && stats.monthlyStats.length > 0) {
    const months = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
    let bestMonth = 0;
    let bestMonthCount = 0;
    stats.monthlyStats.forEach((data, index) => {
      if (data.activities > bestMonthCount) {
        bestMonthCount = data.activities;
        bestMonth = index;
      }
    });
    if (bestMonthCount > 0) {
      highlights.push({
        icon: "calendar",
        text: `${months[bestMonth]} war dein starkster Monat`,
        subtext: `${bestMonthCount} Aktivitaten`,
        score: bestMonthCount / 30,
      });
    }
  }

  // Favorite sport
  const sportNames: Record<string, string> = {
    running: "Laufen",
    cycling: "Radfahren",
    swimming: "Schwimmen",
    hiking: "Wandern",
    strength: "Krafttraining",
    walking: "Gehen",
    other: "Sonstiges",
  };

  let topSport = "";
  let topSportCount = 0;
  Object.entries(stats.byType).forEach(([sport, data]) => {
    if (data && data.count > topSportCount) {
      topSportCount = data.count;
      topSport = sport;
    }
  });

  if (topSport && topSportCount > 10) {
    highlights.push({
      icon: "trophy",
      text: `${sportNames[topSport] || topSport} ist deine #1`,
      subtext: `${topSportCount} Sessions`,
      score: topSportCount / stats.totalActivities,
    });
  }

  // Consistency - months active
  if (stats.monthlyStats && stats.monthlyStats.length > 0) {
    const activeMonths = stats.monthlyStats.filter(m => m.activities > 0).length;
    if (activeMonths >= 10) {
      highlights.push({
        icon: "flame",
        text: `${activeMonths} von 12 Monaten aktiv`,
        subtext: "Beeindruckende Konstanz!",
        score: activeMonths / 12,
      });
    }
  }

  // Almost every day
  if (stats.totalActivities >= 300) {
    highlights.push({
      icon: "bolt",
      text: "Fast jeden Tag aktiv",
      subtext: `${stats.totalActivities} Aktivitaten = ${(stats.totalActivities / 365 * 100).toFixed(0)}% aller Tage`,
      score: stats.totalActivities / 365,
    });
  }

  // Favorite time (if available)
  if (stats.trainingPatterns?.mostActiveHour !== undefined) {
    const hour = stats.trainingPatterns.mostActiveHour;
    const timeLabel = hour < 10 ? "Fruhaufsteher" : hour < 14 ? "Mittags-Sportler" : hour < 18 ? "Nachmittags-Athlet" : "Nachteule";
    highlights.push({
      icon: hour < 18 ? "sun" : "moon",
      text: `Du bist ein ${timeLabel}`,
      subtext: `Am liebsten um ${hour}:00 Uhr`,
      score: 0.7,
    });
  }

  // Sort by score and return best
  highlights.sort((a, b) => b.score - a.score);

  return highlights[0] || {
    icon: "muscle",
    text: "Ein Jahr voller Bewegung",
    subtext: "Stark gemacht!",
  };
}

export default function TotalStatsSlide({ stats }: TotalStatsSlideProps) {
  // Calculate impressive comparisons
  const marathons = Math.round(stats.totalDistance / 42.195);
  const everests = (stats.totalElevation / 8848).toFixed(1);
  const daysActive = Math.round(stats.totalDuration / 24);
  const burgersEquivalent = Math.round(stats.totalCalories / 500);

  // Get personal highlight
  const highlight = getPersonalHighlight(stats);

  const statCards = [
    {
      value: Math.round(stats.totalDistance),
      label: "Kilometer",
      subtext: `${marathons} Marathons`,
      icon: <RouteIcon />,
      color: "from-cyan-400 to-blue-500",
    },
    {
      value: Math.round(stats.totalDuration),
      label: "Stunden",
      subtext: `${daysActive} Tage non-stop`,
      icon: <ClockIcon />,
      color: "from-blue-400 to-indigo-500",
    },
    {
      value: Math.round(stats.totalCalories / 1000),
      suffix: "k",
      label: "Kalorien",
      subtext: `${burgersEquivalent} Burger`,
      icon: <FlameIcon />,
      color: "from-orange-400 to-red-500",
    },
    {
      value: Math.round(stats.totalElevation),
      label: "Höhenmeter",
      subtext: `${everests}x Everest`,
      icon: <MountainIcon />,
      color: "from-purple-400 to-pink-500",
    },
  ];

  return (
    <SlideWrapper gradient="from-[#0a1628] via-[#0f2847] to-[#0a1628]">
      {/* Background effects */}
      <GridBackground />
      <RisingParticles />

      <div className="text-center w-full max-w-4xl mx-auto px-4 relative z-10">

        {/* Hero section with ring */}
        <div className="flex flex-col items-center mb-4 md:mb-8">
          <motion.p
            className="text-white/50 text-base md:text-lg mb-2 md:mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Dieses Jahr hast du
          </motion.p>

          {/* Progress ring with number inside */}
          <div className="relative flex items-center justify-center">
            <ProgressRing progress={Math.min((stats.totalActivities / 365) * 100, 100)} delay={0.2} />

            {/* Number in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <CountingNumber
                value={stats.totalActivities}
                className="text-5xl md:text-7xl font-bold text-white"
                duration={2}
                delay={0.3}
              />
              <motion.span
                className="text-white/60 text-sm md:text-base mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Aktivitäten
              </motion.span>
            </div>
          </div>

          {/* Personal Highlight */}
          <motion.div
            className="mt-4 md:mt-6 relative w-full max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            {/* Glow behind */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 blur-xl rounded-2xl"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4">
              <div className="flex items-center justify-center gap-2 md:gap-3">
                <div className="text-cyan-400 flex-shrink-0 [&>svg]:w-5 [&>svg]:h-5 md:[&>svg]:w-7 md:[&>svg]:h-7">{highlightIcons[highlight.icon]}</div>
                <div className="text-left min-w-0">
                  <p className="text-white font-semibold text-sm md:text-base truncate">{highlight.text}</p>
                  <p className="text-white/50 text-xs md:text-sm truncate">{highlight.subtext}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid with icons and subtexts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 gap-2 md:gap-3 md:grid-cols-4"
        >
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 1 + i * 0.15,
                duration: 0.5,
                type: "spring",
                bounce: 0.3
              }}
              className="relative group"
            >
              {/* Card glow on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 rounded-xl md:rounded-2xl blur-xl transition-opacity duration-300`} />

              <div className="relative bg-white/5 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/10 hover:border-white/20 transition-colors">
                {/* Icon */}
                <div className={`inline-flex p-1.5 md:p-2 rounded-lg bg-gradient-to-br ${stat.color} text-white mb-1.5 md:mb-2 [&>svg]:w-4 [&>svg]:h-4 md:[&>svg]:w-5 md:[&>svg]:h-5`}>
                  {stat.icon}
                </div>

                {/* Number */}
                <CountingNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-white block"
                  delay={1.2 + i * 0.15}
                />

                {/* Label */}
                <div className="text-[10px] md:text-xs text-white/50 mb-0.5 md:mb-1">{stat.label}</div>

                {/* Impressive comparison */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ delay: 2 + i * 0.1 }}
                  className="text-[10px] md:text-xs font-medium bg-gradient-to-r from-white/80 to-white/60 bg-clip-text text-transparent"
                >
                  {stat.subtext}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
