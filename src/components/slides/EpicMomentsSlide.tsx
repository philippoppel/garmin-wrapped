"use client";

import { motion } from "framer-motion";
import SlideWrapper, { AnimatedLine } from "./SlideWrapper";
import { YearStats, Activity, ActivityType } from "@/lib/types/activity";
import { EmojiBurst } from "../animations/Confetti";
import { useState, useEffect } from "react";

interface EpicMomentsSlideProps {
  stats: YearStats;
}

interface EpicMoment {
  activity: Activity;
  reason: string;
  emoji: string;
  sport: ActivityType;
  epicScore: number;
  comparisonText?: string;
}

// Sport-specific themes
const sportThemes: Record<string, { gradient: string; color: string; colorRgb: string; icon: string }> = {
  running: {
    gradient: "from-[#1a2a1a] via-[#0f3d1f] to-[#0a2a12]",
    color: "text-emerald-400",
    colorRgb: "74, 222, 128",
    icon: "🏃",
  },
  cycling: {
    gradient: "from-[#1a1a2a] via-[#0f2d4d] to-[#0a1a3a]",
    color: "text-blue-400",
    colorRgb: "96, 165, 250",
    icon: "🚴",
  },
  swimming: {
    gradient: "from-[#0a2a3a] via-[#0f3d4d] to-[#0a2a3a]",
    color: "text-cyan-400",
    colorRgb: "34, 211, 238",
    icon: "🏊",
  },
  hiking: {
    gradient: "from-[#2a2a1a] via-[#3d3d0f] to-[#2a2a0a]",
    color: "text-amber-400",
    colorRgb: "251, 191, 36",
    icon: "🥾",
  },
  walking: {
    gradient: "from-[#2a1a2a] via-[#3d1f3d] to-[#2a0a2a]",
    color: "text-purple-400",
    colorRgb: "192, 132, 252",
    icon: "🚶",
  },
  strength: {
    gradient: "from-[#2a1a1a] via-[#3d1f1f] to-[#2a0a0a]",
    color: "text-red-400",
    colorRgb: "248, 113, 113",
    icon: "💪",
  },
  other: {
    gradient: "from-[#1a1a2a] via-[#2d2d0a] to-[#1a1a2a]",
    color: "text-yellow-400",
    colorRgb: "250, 204, 21",
    icon: "🏆",
  },
};

// Running Animation Component - Epic Marathon Style
function RunningAnimation() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Radial glow from center */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(74,222,128,0.15) 0%, rgba(34,197,94,0.05) 40%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Running track lanes */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`lane-${i}`}
            className="absolute h-1 rounded-full"
            style={{
              width: "120%",
              left: "-10%",
              bottom: `${i * 18 + 10}%`,
              background: `linear-gradient(90deg, transparent, rgba(74,222,128,${0.1 + i * 0.03}), transparent)`,
            }}
            animate={{ x: ["-20%", "10%", "-20%"] }}
            transition={{ duration: 8 + i, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Distance markers floating up */}
      {["5K", "10K", "21K", "42K"].map((marker, i) => (
        <motion.div
          key={marker}
          className="absolute text-emerald-400/20 font-bold text-2xl"
          style={{ left: `${15 + i * 22}%`, bottom: -50 }}
          animate={{
            y: [-50, -400],
            opacity: [0, 0.4, 0.4, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
            delay: i * 2,
          }}
        >
          {marker}
        </motion.div>
      ))}

      {/* Energy particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-emerald-400"
          style={{
            left: `${(i * 5) % 100}%`,
            top: `${(i * 7) % 100}%`,
          }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 2 + (i % 3),
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 0.2,
          }}
        />
      ))}

      {/* Heartbeat line */}
      <svg className="absolute bottom-20 left-0 right-0 h-16 opacity-20" viewBox="0 0 400 50" preserveAspectRatio="none">
        <motion.path
          d="M0,25 L50,25 L60,25 L70,10 L80,40 L90,5 L100,45 L110,25 L120,25 L400,25"
          fill="none"
          stroke="rgb(74,222,128)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  );
}

// Cycling Animation Component
function CyclingAnimation() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Rotating wheel spokes */}
      <motion.svg
        className="absolute -right-20 top-1/4 w-64 h-64 text-blue-400/20"
        viewBox="0 0 100 100"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" />
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="50"
            x2="50"
            y2="10"
            stroke="currentColor"
            strokeWidth="1"
            transform={`rotate(${i * 30} 50 50)`}
          />
        ))}
      </motion.svg>
      {/* Speed lines */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`speed-${i}`}
          className="absolute h-0.5 bg-gradient-to-r from-blue-400/40 to-transparent"
          style={{
            width: 80 + i * 20,
            left: -100,
            top: `${20 + i * 12}%`,
          }}
          animate={{ x: [0, 600] }}
          transition={{
            duration: 1.5 + i * 0.2,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

// Swimming Animation Component
function SwimmingAnimation() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Water waves */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute left-0 right-0 h-2"
          style={{
            bottom: `${5 + i * 8}%`,
            background: `linear-gradient(90deg, transparent, rgba(34, 211, 238, ${0.1 + i * 0.03}), transparent)`,
          }}
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.3,
          }}
        />
      ))}
      {/* Bubbles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute rounded-full bg-cyan-400/30"
          style={{
            width: 4 + (i % 3) * 3,
            height: 4 + (i % 3) * 3,
            left: `${(i * 9) % 100}%`,
            bottom: -20,
          }}
          animate={{
            y: [-20, -400],
            x: [0, i % 2 === 0 ? 20 : -20],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 4 + i * 0.3,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  );
}

// Generic Animation for other sports
function GenericAnimation({ colorRgb }: { colorRgb: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Floating particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: 4 + (i % 4) * 2,
            height: 4 + (i % 4) * 2,
            left: `${(i * 7) % 100}%`,
            top: `${(i * 11) % 100}%`,
            background: `rgba(${colorRgb}, 0.3)`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + i * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

// Sport-specific metrics component
function SportMetrics({ activity, sport, theme }: { activity: Activity; sport: ActivityType; theme: typeof sportThemes.running }) {
  // Calculate derived metrics if not available
  const distanceKm = activity.distance / 1000;
  const durationMin = activity.duration / 60;
  const durationHours = activity.duration / 3600;

  // Calculate pace if not available (for running)
  const calculatedPace = distanceKm > 0 ? durationMin / distanceKm : null;
  const pace = activity.avgPace || calculatedPace;

  // Calculate speed if not available
  const calculatedSpeed = durationHours > 0 ? distanceKm / durationHours : null;
  const speed = activity.avgSpeed || calculatedSpeed;

  // Estimate calories if not available (rough estimate: ~60 kcal per km running, ~30 per km cycling)
  const estimatedCalories = sport === "running"
    ? Math.round(distanceKm * 60)
    : sport === "cycling"
      ? Math.round(distanceKm * 30)
      : Math.round(durationMin * 8);

  const formatPace = (paceMinPerKm: number) => {
    const mins = Math.floor(paceMinPerKm);
    const secs = Math.round((paceMinPerKm - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Running metrics
  if (sport === "running") {
    const metrics = [
      pace && pace > 0 && pace < 20 && { label: "Pace", value: formatPace(pace), unit: "/km", icon: "⚡" },
      activity.avgCadence && { label: "Kadenz", value: Math.round(activity.avgCadence), unit: "spm", icon: "👟" },
      activity.maxHeartRate && { label: "Max HR", value: Math.round(activity.maxHeartRate), unit: "bpm", icon: "💓" },
      activity.avgHeartRate && { label: "Ø HR", value: Math.round(activity.avgHeartRate), unit: "bpm", icon: "❤️" },
      activity.elevationGain && activity.elevationGain > 0 && { label: "Höhenmeter", value: Math.round(activity.elevationGain).toLocaleString("de-DE"), unit: "m", icon: "⛰️" },
      (activity.calories || estimatedCalories > 100) && {
        label: "Kalorien",
        value: (activity.calories || estimatedCalories).toLocaleString("de-DE"),
        unit: "kcal",
        icon: "🔥"
      },
      activity.trainingEffect && { label: "Training Effect", value: activity.trainingEffect.toFixed(1), unit: "", icon: "📈" },
      activity.vo2Max && { label: "VO2 Max", value: Math.round(activity.vo2Max), unit: "", icon: "🫁" },
      // Calculated metrics as fallback
      !activity.avgCadence && !activity.avgHeartRate && speed && {
        label: "Ø Speed",
        value: speed.toFixed(1),
        unit: "km/h",
        icon: "💨"
      },
    ].filter(Boolean);

    return <MetricsGrid metrics={metrics as MetricItem[]} theme={theme} />;
  }

  // Cycling metrics
  if (sport === "cycling") {
    const metrics = [
      speed && speed > 0 && { label: "Ø Speed", value: speed.toFixed(1), unit: "km/h", icon: "💨" },
      activity.maxSpeed && { label: "Max Speed", value: activity.maxSpeed.toFixed(1), unit: "km/h", icon: "🚀" },
      activity.avgPower && { label: "Ø Power", value: Math.round(activity.avgPower), unit: "W", icon: "⚡" },
      activity.normalizedPower && { label: "NP", value: Math.round(activity.normalizedPower), unit: "W", icon: "📊" },
      activity.avgCadence && { label: "Kadenz", value: Math.round(activity.avgCadence), unit: "rpm", icon: "🔄" },
      activity.elevationGain && activity.elevationGain > 0 && { label: "Höhenmeter", value: Math.round(activity.elevationGain).toLocaleString("de-DE"), unit: "m", icon: "⛰️" },
      activity.avgHeartRate && { label: "Ø HR", value: Math.round(activity.avgHeartRate), unit: "bpm", icon: "❤️" },
      (activity.calories || estimatedCalories > 100) && {
        label: "Kalorien",
        value: (activity.calories || estimatedCalories).toLocaleString("de-DE"),
        unit: "kcal",
        icon: "🔥"
      },
    ].filter(Boolean);

    return <MetricsGrid metrics={metrics as MetricItem[]} theme={theme} />;
  }

  // Swimming metrics
  if (sport === "swimming") {
    const swolf = activity.strokes && activity.laps ? Math.round((activity.strokes / activity.laps) + (activity.duration / (activity.laps || 1) / 60)) : null;
    // Calculate pace per 100m for swimming
    const swimPace100m = distanceKm > 0 ? (durationMin / distanceKm) / 10 : null;

    const metrics = [
      swimPace100m && swimPace100m > 0 && { label: "Pace", value: formatPace(swimPace100m), unit: "/100m", icon: "⚡" },
      activity.laps && { label: "Bahnen", value: activity.laps, unit: "", icon: "🏊" },
      activity.strokes && { label: "Züge", value: activity.strokes.toLocaleString("de-DE"), unit: "", icon: "💪" },
      swolf && { label: "SWOLF", value: swolf, unit: "", icon: "📊" },
      activity.poolLength && { label: "Beckenlänge", value: activity.poolLength, unit: "m", icon: "📏" },
      activity.avgHeartRate && { label: "Ø HR", value: Math.round(activity.avgHeartRate), unit: "bpm", icon: "❤️" },
      (activity.calories || estimatedCalories > 50) && {
        label: "Kalorien",
        value: (activity.calories || estimatedCalories).toLocaleString("de-DE"),
        unit: "kcal",
        icon: "🔥"
      },
    ].filter(Boolean);

    return <MetricsGrid metrics={metrics as MetricItem[]} theme={theme} />;
  }

  // Default metrics for other sports (hiking, walking, etc.)
  const metrics = [
    speed && speed > 0 && speed < 50 && { label: "Ø Speed", value: speed.toFixed(1), unit: "km/h", icon: "💨" },
    pace && pace > 0 && pace < 30 && { label: "Pace", value: formatPace(pace), unit: "/km", icon: "⚡" },
    activity.avgHeartRate && { label: "Ø HR", value: Math.round(activity.avgHeartRate), unit: "bpm", icon: "❤️" },
    activity.maxHeartRate && { label: "Max HR", value: Math.round(activity.maxHeartRate), unit: "bpm", icon: "💓" },
    activity.elevationGain && activity.elevationGain > 0 && { label: "Höhenmeter", value: Math.round(activity.elevationGain).toLocaleString("de-DE"), unit: "m", icon: "⛰️" },
    (activity.calories || estimatedCalories > 50) && {
      label: "Kalorien",
      value: (activity.calories || estimatedCalories).toLocaleString("de-DE"),
      unit: "kcal",
      icon: "🔥"
    },
  ].filter(Boolean);

  return <MetricsGrid metrics={metrics as MetricItem[]} theme={theme} />;
}

interface MetricItem {
  label: string;
  value: string | number;
  unit: string;
  icon: string;
}

function MetricsGrid({ metrics, theme }: { metrics: MetricItem[]; theme: typeof sportThemes.running }) {
  if (metrics.length === 0) return null;

  // Determine grid columns based on number of metrics
  const gridCols = metrics.length <= 2 ? "grid-cols-2"
    : metrics.length === 3 ? "grid-cols-3"
    : metrics.length === 4 ? "grid-cols-4"
    : metrics.length <= 6 ? "grid-cols-3"
    : "grid-cols-4";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className={`grid ${gridCols} gap-2 mt-4 max-w-lg mx-auto`}
    >
      {metrics.slice(0, 8).map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 + index * 0.08 }}
          className="bg-white/5 border border-white/10 rounded-xl p-3 text-center group hover:bg-white/10 hover:border-white/20 transition-all"
        >
          <motion.span
            className="text-xl block mb-1"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
          >
            {metric.icon}
          </motion.span>
          <div className={`text-xl font-bold ${theme.color}`}>
            {metric.value}
            <span className="text-xs text-white/40 ml-0.5 font-normal">{metric.unit}</span>
          </div>
          <div className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">{metric.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Calculate epic score for an activity
function calculateEpicScore(activity: Activity, avgDistance: number, avgDuration: number): number {
  let score = 0;

  if (avgDistance > 0) {
    const distanceRatio = activity.distance / 1000 / avgDistance;
    score += Math.min(distanceRatio * 30, 50);
  }

  if (avgDuration > 0) {
    const durationRatio = (activity.duration / 3600) / avgDuration;
    score += Math.min(durationRatio * 20, 30);
  }

  if (activity.elevationGain && activity.elevationGain > 500) {
    score += Math.min(activity.elevationGain / 100, 20);
  }

  const distanceKm = activity.distance / 1000;
  if (distanceKm >= 42.195) score += 50;
  else if (distanceKm >= 21.0975) score += 35;
  else if (distanceKm >= 10) score += 15;
  else if (distanceKm >= 100 && activity.type === "cycling") score += 40;

  return score;
}

// Find the epic moment
function findEpicMoment(stats: YearStats): EpicMoment | null {
  const { byType } = stats;
  const candidates: EpicMoment[] = [];

  const sportConfigs: Array<{ type: ActivityType; name: string }> = [
    { type: "running", name: "Lauf" },
    { type: "cycling", name: "Radfahrt" },
    { type: "swimming", name: "Schwimmen" },
    { type: "hiking", name: "Wanderung" },
    { type: "walking", name: "Spaziergang" },
  ];

  for (const config of sportConfigs) {
    const sportStats = byType[config.type];
    if (!sportStats?.longestActivity) continue;

    const activity = sportStats.longestActivity;
    const avgDistance = sportStats.totalDistance / Math.max(sportStats.count, 1);
    const avgDuration = sportStats.totalDuration / Math.max(sportStats.count, 1);
    const epicScore = calculateEpicScore(activity, avgDistance, avgDuration);

    let reason = `Dein längster ${config.name}`;
    let comparisonText = "";
    const distanceKm = activity.distance / 1000;

    if (config.type === "running") {
      if (distanceKm >= 42.195) reason = "Dein Marathon";
      else if (distanceKm >= 21.0975) reason = "Dein Halbmarathon";
      else if (distanceKm >= 10) reason = "Dein 10K+ Lauf";
    } else if (config.type === "cycling" && distanceKm >= 100) {
      reason = "Deine Century Ride";
    }

    if (avgDistance > 0) {
      const ratio = distanceKm / avgDistance;
      if (ratio > 1.5) {
        comparisonText = `${Math.round((ratio - 1) * 100)}% länger als dein Durchschnitt`;
      }
    }

    candidates.push({
      activity,
      reason,
      emoji: sportThemes[config.type]?.icon || "🏆",
      sport: config.type,
      epicScore,
      comparisonText,
    });
  }

  for (const config of sportConfigs) {
    const sportStats = byType[config.type];
    if (!sportStats?.longestActivity) continue;

    const activity = sportStats.longestActivity;
    if (activity.elevationGain && activity.elevationGain >= 1000) {
      const elevationScore = 60 + (activity.elevationGain / 100);
      candidates.push({
        activity,
        reason: `Dein Höhenmeter-Monster`,
        emoji: "⛰️",
        sport: config.type,
        epicScore: elevationScore,
        comparisonText: `${activity.elevationGain.toLocaleString("de-DE")}m Höhenmeter bezwungen`,
      });
    }
  }

  if (candidates.length === 0) return null;

  return candidates.reduce((best, current) =>
    current.epicScore > best.epicScore ? current : best
  );
}

export default function EpicMomentsSlide({ stats }: EpicMomentsSlideProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const epicMoment = findEpicMoment(stats);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!epicMoment) return null;

  const { activity, reason, emoji, sport, comparisonText } = epicMoment;
  const theme = sportThemes[sport] || sportThemes.other;

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}min`;
    return `${minutes}min`;
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${Math.round(meters)} m`;
  };

  // Select animation based on sport
  const SportAnimation = () => {
    switch (sport) {
      case "running":
        return <RunningAnimation />;
      case "cycling":
        return <CyclingAnimation />;
      case "swimming":
        return <SwimmingAnimation />;
      default:
        return <GenericAnimation colorRgb={theme.colorRgb} />;
    }
  };

  return (
    <SlideWrapper gradient={theme.gradient}>
      <SportAnimation />
      <EmojiBurst emoji={emoji} isActive={showConfetti} count={16} />

      <div className="relative text-center w-full max-w-2xl mx-auto px-4">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold text-white mb-1"
        >
          Dein epischster Moment
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-white/40 text-sm mb-4"
        >
          Die Leistung des Jahres
        </motion.p>

        {/* Date badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 mb-4"
        >
          <svg className="w-4 h-4 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <span className="text-white/70 text-sm font-medium">{formatDate(activity.date)}</span>
        </motion.div>

        {/* Epic badge with glow */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
          className="relative inline-block mb-4"
        >
          {/* Animated glow */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(${theme.colorRgb}, 0.4), transparent 70%)`,
              filter: "blur(25px)",
            }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Trophy container */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: `rgba(${theme.colorRgb}, 0.3)` }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border"
              style={{ borderColor: `rgba(${theme.colorRgb}, 0.2)` }}
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.span
              className="text-6xl z-10"
              animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {emoji}
            </motion.span>
          </div>
        </motion.div>

        {/* Reason */}
        <AnimatedLine delay={0.5} className="text-2xl md:text-3xl font-bold text-white mb-1">
          {reason}
        </AnimatedLine>

        {/* Activity name */}
        {activity.name && activity.name !== reason && (
          <AnimatedLine delay={0.6} className="text-base text-white/40 mb-3">
            „{activity.name}"
          </AnimatedLine>
        )}

        {/* Comparison badge */}
        {comparisonText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 ${theme.color}`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 7l5 5-5 5M6 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-medium">{comparisonText}</span>
          </motion.div>
        )}

        {/* Main stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 gap-4 max-w-sm mx-auto"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <div className={`text-4xl font-bold ${theme.color}`}>
              {formatDistance(activity.distance)}
            </div>
            <div className="text-sm text-white/50 mt-1">Distanz</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <div className={`text-4xl font-bold ${theme.color}`}>
              {formatDuration(activity.duration)}
            </div>
            <div className="text-sm text-white/50 mt-1">Dauer</div>
          </div>
        </motion.div>

        {/* Sport-specific metrics */}
        <SportMetrics activity={activity} sport={sport} theme={theme} />

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8 text-white/30 text-sm italic"
        >
          Ein Tag, der alles verändert hat.
        </motion.p>
      </div>
    </SlideWrapper>
  );
}
