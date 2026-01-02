"use client";

import { motion } from "framer-motion";
import SlideWrapper, { AnimatedLine } from "./SlideWrapper";
import { YearStats } from "@/lib/types/activity";
import CountingNumber from "../animations/CountingNumber";
import { Droplets } from "lucide-react";

interface SweatLossSlideProps {
  stats: YearStats;
}

// Animated water drops background
function WaterBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient waves */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute w-full h-40"
          style={{
            bottom: `${5 + i * 20}%`,
            background: `linear-gradient(90deg, transparent, rgba(6, 182, 212, ${0.08 - i * 0.02}), transparent)`,
            borderRadius: "50%",
          }}
          animate={{
            x: ["-15%", "15%", "-15%"],
            scaleY: [1, 1.4, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
        />
      ))}

      {/* Floating water drops */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`drop-${i}`}
          className="absolute text-cyan-400/20"
          style={{
            left: `${5 + (i % 5) * 20}%`,
            top: `${10 + Math.floor(i / 5) * 25}%`,
            fontSize: 16 + Math.random() * 12,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.15, 0.35, 0.15],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
        >
          💧
        </motion.div>
      ))}
    </div>
  );
}

// Big animated sweat counter
function SweatCounter({ liters }: { liters: number }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, type: "spring" }}
      className="relative"
    >
      {/* Animated droplet icon */}
      <motion.div
        className="absolute -left-20 top-1/2 -translate-y-1/2"
        animate={{
          y: [0, -8, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Droplets className="w-14 h-14 text-cyan-400" />
      </motion.div>

      <div className="flex items-baseline justify-center gap-3">
        <CountingNumber
          value={liters}
          decimals={0}
          className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 via-cyan-400 to-blue-500"
          delay={0.5}
        />
        <span className="text-3xl md:text-4xl font-bold text-white/60">Liter</span>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-xl text-cyan-300/80 mt-2"
      >
        Schweiß verloren
      </motion.p>
    </motion.div>
  );
}

// Fun comparisons visualization
function SweatComparisons({ liters }: { liters: number }) {
  // Fun calculations
  const bathtubs = liters / 150; // Average bathtub ~150L
  const waterBottles = liters / 0.5; // 500ml bottles
  const buckets = liters / 10; // 10L bucket
  const showers = liters / 65; // Average shower ~65L

  const comparisons = [
    {
      icon: "🛁",
      value: bathtubs,
      label: "Badewannen",
      gradient: "from-cyan-500/20 to-blue-500/20",
      border: "border-cyan-500/30",
      color: "text-cyan-400",
    },
    {
      icon: "🚿",
      value: showers,
      label: "Duschen",
      gradient: "from-blue-500/20 to-indigo-500/20",
      border: "border-blue-500/30",
      color: "text-blue-400",
    },
    {
      icon: "🪣",
      value: buckets,
      label: "Eimer",
      gradient: "from-teal-500/20 to-cyan-500/20",
      border: "border-teal-500/30",
      color: "text-teal-400",
    },
    {
      icon: "🍶",
      value: waterBottles,
      label: "Flaschen (0.5L)",
      gradient: "from-sky-500/20 to-blue-500/20",
      border: "border-sky-500/30",
      color: "text-sky-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
      {comparisons.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1 + i * 0.15, type: "spring" }}
          className={`bg-gradient-to-br ${item.gradient} ${item.border} border rounded-2xl p-4 text-center backdrop-blur-sm
                     transition-all duration-300 hover:scale-105 hover:border-opacity-60 hover:shadow-lg`}
        >
          <div className="text-3xl mb-2">{item.icon}</div>
          <div className={`text-2xl font-bold ${item.color}`}>
            {item.value >= 100 ? Math.round(item.value).toLocaleString("de-DE") : item.value.toFixed(1)}
          </div>
          <div className="text-xs text-white/50">{item.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

// Hydration insight card
function HydrationInsight({ liters, trainingHours }: { liters: number; trainingHours: number }) {
  const litersPerHour = trainingHours > 0 ? liters / trainingHours : 0;

  // Hydration status based on sweat rate
  const getHydrationStatus = () => {
    if (litersPerHour >= 1.5) return { status: "Hohe Schweißrate", color: "text-orange-400", tip: "Achte besonders auf ausreichend Flüssigkeit!" };
    if (litersPerHour >= 1.0) return { status: "Normale Schweißrate", color: "text-cyan-400", tip: "Trinke 150% deines Schweißverlusts" };
    if (litersPerHour >= 0.5) return { status: "Moderate Schweißrate", color: "text-green-400", tip: "Gute Basis - bleib hydriert!" };
    return { status: "Niedrige Schweißrate", color: "text-blue-400", tip: "Vergiss trotzdem nicht zu trinken" };
  };

  const status = getHydrationStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.8 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 mt-6 max-w-md mx-auto"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-white/60">Deine Schweißrate</span>
        <span className={`text-sm font-semibold ${status.color}`}>{status.status}</span>
      </div>

      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="text-4xl font-bold text-white">{litersPerHour.toFixed(1)}</span>
        <span className="text-lg text-white/50">L/Stunde</span>
      </div>

      {/* Sweat rate meter */}
      <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-3">
        <motion.div
          className="absolute h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((litersPerHour / 2) * 100, 100)}%` }}
          transition={{ delay: 2, duration: 0.8 }}
        />
        {/* Markers */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-white/20" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-white/20" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-white/20" />
      </div>

      <div className="flex justify-between text-[10px] text-white/40 mb-3">
        <span>0.5L</span>
        <span>1.0L</span>
        <span>1.5L</span>
        <span>2.0L+</span>
      </div>

      <p className="text-xs text-white/50 text-center italic">
        💡 {status.tip}
      </p>
    </motion.div>
  );
}

// Water drop animation falling
function FallingDrops() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-4 bg-gradient-to-b from-cyan-400/40 to-blue-500/40 rounded-full"
          style={{
            left: `${10 + i * 12}%`,
            top: -20,
          }}
          animate={{
            y: ["0vh", "110vh"],
            opacity: [0.6, 0.3, 0],
            scale: [1, 0.8, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

export default function SweatLossSlide({ stats }: SweatLossSlideProps) {
  const wellness = stats.wellnessInsights;

  // Debug logging
  console.log("SweatLossSlide - wellness data:", {
    hasSweatLossData: wellness?.hasSweatLossData,
    estimatedYearlySweatLossMl: wellness?.estimatedYearlySweatLossMl,
    sweatLossDataPoints: wellness?.sweatLossDataPoints,
    avgDailySweatLossMl: wellness?.avgDailySweatLossMl,
  });

  // Skip if no sweat data
  if (!wellness?.hasSweatLossData || !wellness?.estimatedYearlySweatLossMl) {
    console.log("SweatLossSlide - skipping, no data");
    return null;
  }

  const liters = wellness.estimatedYearlySweatLossMl / 1000;
  const trainingHours = stats.totalDuration || 0;

  // Skip if less than 10 liters (probably bad data)
  if (liters < 10) {
    console.log("SweatLossSlide - skipping, less than 10L:", liters);
    return null;
  }

  return (
    <SlideWrapper gradient="from-[#0a1520] via-[#0c1f2e] to-[#0a1520]">
      <WaterBackground />
      <FallingDrops />

      <div className="relative z-10 text-center w-full max-w-4xl mx-auto px-4">
        {/* Header */}
        <AnimatedLine className="text-white/50 text-sm mb-4">
          Dein Schweißverlust in {stats.year}
        </AnimatedLine>

        {/* Big sweat counter */}
        <SweatCounter liters={Math.round(liters)} />

        {/* Fun comparisons */}
        <SweatComparisons liters={liters} />

        {/* Hydration insight */}
        <HydrationInsight liters={liters} trainingHours={trainingHours} />

        {/* Data source note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mt-6 text-[10px] text-white/30 flex items-center justify-center gap-2"
        >
          <Droplets className="w-3 h-3" />
          <span>
            Basierend auf {wellness.sweatLossDataPoints} Aktivitäten mit Schweißdaten
          </span>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
