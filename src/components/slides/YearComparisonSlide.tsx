"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, ArrowUp } from "lucide-react";
import SlideWrapper from "./SlideWrapper";
import { YearStats } from "@/lib/types/activity";

interface YearComparisonSlideProps {
  stats: YearStats;
  previousYearStats: YearStats;
}

interface ComparisonItem {
  label: string;
  current: number;
  previous: number;
  unit: string;
  emoji: string;
  color: string;
}

function getChangePercent(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

// Animated background with rising elements
function RisingBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Rising arrows */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-green-500/10"
          style={{
            left: `${10 + i * 12}%`,
            bottom: -50,
          }}
          animate={{
            y: [0, -800],
            opacity: [0, 0.3, 0.3, 0],
            scale: [0.5, 1, 1, 0.5],
          }}
          transition={{
            duration: 5 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeOut",
          }}
        >
          <ArrowUp className="w-8 h-8" />
        </motion.div>
      ))}

      {/* Gradient orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full blur-3xl"
          style={{
            width: 200 + i * 100,
            height: 200 + i * 100,
            background: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)",
            left: `${20 + i * 30}%`,
            top: `${30 + (i % 2) * 20}%`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function YearComparisonSlide({ stats, previousYearStats }: YearComparisonSlideProps) {
  const comparisons: ComparisonItem[] = [
    {
      label: "Aktivitäten",
      current: stats.totalActivities,
      previous: previousYearStats.totalActivities,
      unit: "",
      emoji: "🏃",
      color: "from-blue-500 to-cyan-400",
    },
    {
      label: "Distanz",
      current: stats.totalDistance,
      previous: previousYearStats.totalDistance,
      unit: "km",
      emoji: "🛣️",
      color: "from-purple-500 to-pink-400",
    },
    {
      label: "Zeit",
      current: stats.totalDuration,
      previous: previousYearStats.totalDuration,
      unit: "h",
      emoji: "⏱️",
      color: "from-orange-500 to-amber-400",
    },
    {
      label: "Höhenmeter",
      current: stats.totalElevation,
      previous: previousYearStats.totalElevation,
      unit: "m",
      emoji: "⛰️",
      color: "from-emerald-500 to-green-400",
    },
  ];

  // Find best improvement
  const improvements = comparisons.map(c => ({
    ...c,
    change: getChangePercent(c.current, c.previous)
  }));
  const bestImprovement = improvements.reduce((best, curr) =>
    curr.change > best.change ? curr : best
  , improvements[0]);

  // Calculate total improvement average
  const avgImprovement = Math.round(
    improvements.reduce((sum, i) => sum + Math.max(0, i.change), 0) / improvements.length
  );

  return (
    <SlideWrapper gradient="from-[#051a05] via-[#0a2a0a] to-[#051a05]">
      <RisingBackground />

      <div className="relative z-10 text-center w-full max-w-2xl mx-auto px-4">
        {/* Header - Big and bold */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-6"
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          >
            📈
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
            {stats.year} vs {previousYearStats.year}
          </h1>
          <p className="text-white/40 text-base">Deine Entwicklung im Vergleich</p>
        </motion.div>

        {/* Big highlight stat */}
        {bestImprovement.change > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="mb-8 relative"
          >
            <motion.div
              className="absolute inset-0 bg-green-500/20 rounded-3xl blur-2xl"
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="relative bg-gradient-to-r from-green-500/20 via-green-400/10 to-green-500/20 rounded-3xl p-6 border-2 border-green-500/30">
              <motion.div
                className="flex items-center justify-center gap-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <TrendingUp className="w-10 h-10 text-green-400" />
                </motion.div>
                <span className="text-6xl md:text-7xl font-black text-green-400">
                  +{bestImprovement.change}%
                </span>
              </motion.div>
              <p className="text-white/70 text-lg mt-2">
                mehr <span className="text-green-400 font-semibold">{bestImprovement.label}</span> als {previousYearStats.year}
              </p>
            </div>
          </motion.div>
        )}

        {/* Comparison Grid - 2x2 with visual bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          {comparisons.map((item, index) => {
            const change = getChangePercent(item.current, item.previous);
            const isPositive = change > 0;
            const isNegative = change < 0;
            // Calculate bar percentage (previous year = 50%, scale based on change)
            const barPercent = Math.min(50 + (change / 2), 100);

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.15, type: "spring" }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`relative rounded-2xl p-4 overflow-hidden backdrop-blur-sm ${
                  isPositive
                    ? "bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                {/* Glow for positive */}
                {isPositive && (
                  <motion.div
                    className="absolute inset-0 bg-green-500/5 rounded-2xl"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                <div className="relative z-10">
                  {/* Emoji and label */}
                  <div className="flex items-center justify-between mb-3">
                    <motion.span
                      className="text-3xl"
                      animate={isPositive ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                    >
                      {item.emoji}
                    </motion.span>
                    <span className="text-xs text-white/40 uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>

                  {/* Current value - BIG */}
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1, type: "spring" }}
                    className="mb-2"
                  >
                    <span className="text-3xl md:text-4xl font-black text-white">
                      {Math.round(item.current).toLocaleString("de-DE")}
                    </span>
                    <span className="text-lg text-white/40 ml-1">{item.unit}</span>
                  </motion.div>

                  {/* Visual progress bar */}
                  <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-3">
                    {/* Previous year marker */}
                    <div className="absolute top-0 bottom-0 w-0.5 bg-white/30 z-10" style={{ left: "50%" }} />

                    {/* Current year bar */}
                    <motion.div
                      className={`absolute top-0 bottom-0 left-0 rounded-full ${
                        isPositive
                          ? "bg-gradient-to-r from-green-600 via-green-500 to-green-400"
                          : isNegative
                          ? "bg-gradient-to-r from-red-600 to-red-400"
                          : "bg-gradient-to-r from-blue-600 to-blue-400"
                      }`}
                      initial={{ width: "50%" }}
                      animate={{ width: `${barPercent}%` }}
                      transition={{ duration: 1.2, delay: 0.8 + index * 0.15, ease: "easeOut" }}
                    />
                    {isPositive && (
                      <motion.div
                        className="absolute top-0 bottom-0 left-0 rounded-full bg-green-400/50 blur-sm"
                        initial={{ width: "50%" }}
                        animate={{ width: `${barPercent}%` }}
                        transition={{ duration: 1.2, delay: 0.8 + index * 0.15, ease: "easeOut" }}
                      />
                    )}
                  </div>

                  {/* Change and previous value */}
                  <div className="flex items-center justify-between">
                    <motion.div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-bold ${
                        isPositive
                          ? "bg-green-500/20 text-green-400"
                          : isNegative
                          ? "bg-red-500/20 text-red-400"
                          : "bg-white/10 text-white/50"
                      }`}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1 + index * 0.1 }}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : isNegative ? (
                        <TrendingDown className="w-4 h-4" />
                      ) : (
                        <Minus className="w-4 h-4" />
                      )}
                      {isPositive ? "+" : ""}{change}%
                    </motion.div>
                    <span className="text-xs text-white/30">
                      {previousYearStats.year}: {Math.round(item.previous).toLocaleString("de-DE")}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Summary message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, type: "spring" }}
          className={`rounded-2xl p-5 ${
            avgImprovement >= 50
              ? "bg-gradient-to-r from-green-500/20 via-green-400/10 to-green-500/20 border border-green-500/30"
              : "bg-white/5 border border-white/10"
          }`}
        >
          {avgImprovement >= 50 ? (
            <div className="flex flex-col items-center gap-2">
              <motion.span
                className="text-5xl"
                animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
              >
                🚀
              </motion.span>
              <p className="text-green-400 text-lg font-bold">
                Unglaubliche Steigerung!
              </p>
              <p className="text-white/60 text-sm">Du hast dich selbst übertroffen!</p>
            </div>
          ) : avgImprovement >= 20 ? (
            <div className="flex flex-col items-center gap-2">
              <motion.span
                className="text-4xl"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💪
              </motion.span>
              <p className="text-green-400 text-lg font-medium">Starke Verbesserung!</p>
            </div>
          ) : avgImprovement > 0 ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">✨</span>
              <p className="text-white/70 text-base">Kontinuierlich besser - weiter so!</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">🎯</span>
              <p className="text-white/70 text-base">
                {stats.year + 1} wird dein Jahr!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
