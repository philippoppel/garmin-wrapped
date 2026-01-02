"use client";

import { motion } from "framer-motion";
import SlideWrapper from "./SlideWrapper";
import { YearStats } from "@/lib/types/activity";

interface ComparisonSlideProps {
  stats: YearStats;
}

interface Comparison {
  icon: string;
  title: string;
  yourValue: string;
  avgValue: string;
  yourNumeric: number;
  avgNumeric: number;
  comparison: string;
  isAboveAvg: boolean;
  source: string;
  color: string;
}

// Animated background with floating orbs
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            width: 150 + i * 50,
            height: 150 + i * 50,
            background: i % 2 === 0
              ? "radial-gradient(circle, #10b981 0%, transparent 70%)"
              : "radial-gradient(circle, #6366f1 0%, transparent 70%)",
            left: `${10 + i * 20}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Rising particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-emerald-400/40 rounded-full"
          style={{
            left: `${5 + i * 8}%`,
            bottom: -10,
          }}
          animate={{
            y: [0, -600],
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// Visual progress bar showing comparison
function ComparisonBar({ percent, isAboveAvg }: { percent: number; isAboveAvg: boolean }) {
  const cappedPercent = Math.min(percent, 200);
  const barWidth = Math.min((cappedPercent / 200) * 100, 100);
  const avgPosition = 50; // 100% = middle of the bar

  return (
    <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
      {/* Average marker */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/30 z-10"
        style={{ left: `${avgPosition}%` }}
      />

      {/* User's bar */}
      <motion.div
        className={`absolute top-0 bottom-0 left-0 rounded-full ${
          isAboveAvg
            ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
            : "bg-gradient-to-r from-blue-500 to-blue-400"
        }`}
        initial={{ width: 0 }}
        animate={{ width: `${barWidth}%` }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      />

      {/* Glow effect for above average */}
      {isAboveAvg && (
        <motion.div
          className="absolute top-0 bottom-0 left-0 rounded-full bg-emerald-400/50 blur-sm"
          initial={{ width: 0 }}
          animate={{ width: `${barWidth}%` }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        />
      )}
    </div>
  );
}

// Reference data from Strava Year in Sport 2024 & Garmin Connect Data Report 2024
const REFERENCE_DATA = {
  // Strava Year in Sport 2024: 135 Mio. Nutzer analysiert
  strava: {
    avgRunDistanceKm: 6.3, // Average run distance
    medianPaceMinPerKm: 6.37, // 6:22 min/km median
    weeklyRunningKmGenZ: 9, // Gen Z weekly average
    weeklyRunningKmBoomer: 14, // Boomer weekly average
    weeklyRunningKmAvg: 11.5, // Average of both
    medianActivityMinutes: 53,
  },
  // Garmin Connect Data Report 2024
  garmin: {
    avgDailySteps: 8317,
    avgSleepScore: 71,
    avgBodyBattery: 71,
  },
  // Various cycling sources
  cycling: {
    casualYearlyKm: 1600, // UK government stats: 1000 miles
    activeYearlyKm: 4800, // 3000 miles for regular cyclists
  },
};

export default function ComparisonSlide({ stats }: ComparisonSlideProps) {
  // Skip slide if no activities at all
  if (stats.totalActivities === 0) {
    return null;
  }

  const comparisons: Comparison[] = [];

  // Calculate user's running stats
  const runningStats = stats.byType.running;
  const cyclingStats = stats.byType.cycling;

  // 1. Running distance comparison
  if (runningStats && runningStats.totalDistance > 0) {
    const userYearlyRunKm = runningStats.totalDistance;
    const avgYearlyRunKm = REFERENCE_DATA.strava.weeklyRunningKmAvg * 52;
    const percentOfAvg = Math.round((userYearlyRunKm / avgYearlyRunKm) * 100);
    const isAbove = userYearlyRunKm > avgYearlyRunKm;

    comparisons.push({
      icon: "🏃",
      title: "Lauf gesamt",
      yourValue: `${Math.round(userYearlyRunKm)}km`,
      avgValue: `${Math.round(avgYearlyRunKm)}km`,
      yourNumeric: userYearlyRunKm,
      avgNumeric: avgYearlyRunKm,
      comparison: isAbove
        ? `+${Math.round(userYearlyRunKm - avgYearlyRunKm)}km`
        : `${percentOfAvg}%`,
      isAboveAvg: isAbove,
      source: "Strava 2024",
      color: isAbove ? "from-emerald-500/10 to-green-500/10" : "from-blue-500/10 to-cyan-500/10",
    });
  }

  // 2. Average run distance
  if (runningStats && runningStats.count > 0) {
    const userAvgRunKm = runningStats.avgDistance;
    const stravaAvgRunKm = REFERENCE_DATA.strava.avgRunDistanceKm;
    const isAbove = userAvgRunKm > stravaAvgRunKm;
    const diff = Math.abs(userAvgRunKm - stravaAvgRunKm).toFixed(1);

    comparisons.push({
      icon: "📏",
      title: "Ø pro Lauf",
      yourValue: `${userAvgRunKm.toFixed(1)}km`,
      avgValue: `${stravaAvgRunKm}km`,
      yourNumeric: userAvgRunKm,
      avgNumeric: stravaAvgRunKm,
      comparison: isAbove ? `+${diff}km` : `-${diff}km`,
      isAboveAvg: isAbove,
      source: "Strava 2024",
      color: isAbove ? "from-emerald-500/10 to-green-500/10" : "from-slate-500/10 to-gray-500/10",
    });
  }

  // 3. Running pace comparison (inverted - lower is better)
  if (runningStats && runningStats.avgPace && runningStats.avgPace > 0) {
    const userPace = runningStats.avgPace;
    const stravaPace = REFERENCE_DATA.strava.medianPaceMinPerKm;
    const isFaster = userPace < stravaPace;
    const diffSeconds = Math.abs(userPace - stravaPace) * 60;

    const formatPace = (pace: number) => {
      const mins = Math.floor(pace);
      const secs = Math.round((pace - mins) * 60);
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    comparisons.push({
      icon: "⚡",
      title: "Tempo",
      yourValue: `${formatPace(userPace)}/km`,
      avgValue: `${formatPace(stravaPace)}/km`,
      yourNumeric: stravaPace, // Inverted for pace (show faster as more)
      avgNumeric: userPace,
      comparison: isFaster ? `-${Math.round(diffSeconds)}s` : `+${Math.round(diffSeconds)}s`,
      isAboveAvg: isFaster,
      source: "Strava 2024",
      color: isFaster ? "from-orange-500/10 to-amber-500/10" : "from-blue-500/10 to-indigo-500/10",
    });
  }

  // 4. Cycling distance comparison
  if (cyclingStats && cyclingStats.totalDistance > 0) {
    const userYearlyCycleKm = cyclingStats.totalDistance;
    const avgYearlyCycleKm = REFERENCE_DATA.cycling.casualYearlyKm;
    const percentOfAvg = Math.round((userYearlyCycleKm / avgYearlyCycleKm) * 100);
    const isAbove = userYearlyCycleKm > avgYearlyCycleKm;

    comparisons.push({
      icon: "🚴",
      title: "Rad gesamt",
      yourValue: `${Math.round(userYearlyCycleKm).toLocaleString("de-DE")}km`,
      avgValue: `${avgYearlyCycleKm.toLocaleString("de-DE")}km`,
      yourNumeric: userYearlyCycleKm,
      avgNumeric: avgYearlyCycleKm,
      comparison: `${percentOfAvg}%`,
      isAboveAvg: isAbove,
      source: "UK Gov",
      color: isAbove ? "from-emerald-500/10 to-green-500/10" : "from-blue-500/10 to-cyan-500/10",
    });
  }

  // 5. Daily steps comparison (if available)
  if (stats.wellnessInsights?.avgDailySteps && stats.wellnessInsights.avgDailySteps > 0) {
    const userSteps = stats.wellnessInsights.avgDailySteps;
    const garminAvgSteps = REFERENCE_DATA.garmin.avgDailySteps;
    const isAbove = userSteps > garminAvgSteps;
    const diff = Math.abs(userSteps - garminAvgSteps);

    comparisons.push({
      icon: "👟",
      title: "Schritte/Tag",
      yourValue: `${userSteps.toLocaleString("de-DE")}`,
      avgValue: `${garminAvgSteps.toLocaleString("de-DE")}`,
      yourNumeric: userSteps,
      avgNumeric: garminAvgSteps,
      comparison: isAbove ? `+${diff.toLocaleString("de-DE")}` : `-${diff.toLocaleString("de-DE")}`,
      isAboveAvg: isAbove,
      source: "Garmin 2024",
      color: isAbove ? "from-emerald-500/10 to-green-500/10" : "from-slate-500/10 to-gray-500/10",
    });
  }

  // 6. Activity count comparison
  const activitiesPerWeek = stats.totalActivities / 52;
  const avgActivitiesPerWeek = 3;
  const isAboveAvgActivities = activitiesPerWeek > avgActivitiesPerWeek;

  if (stats.totalActivities > 0) {
    comparisons.push({
      icon: "📊",
      title: "Frequenz",
      yourValue: `${activitiesPerWeek.toFixed(1)}x/Wo`,
      avgValue: `${avgActivitiesPerWeek}x/Wo`,
      yourNumeric: activitiesPerWeek,
      avgNumeric: avgActivitiesPerWeek,
      comparison: isAboveAvgActivities ? `Top!` : `Solide`,
      isAboveAvg: isAboveAvgActivities,
      source: "Strava 2024",
      color: isAboveAvgActivities ? "from-purple-500/10 to-pink-500/10" : "from-blue-500/10 to-cyan-500/10",
    });
  }

  // Take the most interesting comparisons (prioritize those where user is above average)
  const sortedComparisons = comparisons.sort((a, b) => {
    if (a.isAboveAvg && !b.isAboveAvg) return -1;
    if (!a.isAboveAvg && b.isAboveAvg) return 1;
    return 0;
  });
  const displayComparisons = sortedComparisons.slice(0, 4);

  // Count above-average stats
  const aboveAvgCount = displayComparisons.filter(c => c.isAboveAvg).length;

  return (
    <SlideWrapper gradient="from-[#050a15] via-[#0a1628] to-[#050a15]">
      <AnimatedBackground />

      <div className="relative z-10 text-center w-full max-w-2xl mx-auto px-4">
        {/* Header - Bigger and bolder */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-8"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-black text-white mb-3"
            animate={{
              textShadow: [
                "0 0 20px rgba(16,185,129,0)",
                "0 0 40px rgba(16,185,129,0.4)",
                "0 0 20px rgba(16,185,129,0)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Du vs. die Welt
          </motion.h1>
          <motion.p
            className="text-white/50 text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Verglichen mit <motion.span
              className="text-emerald-400 font-bold text-lg"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >135 Millionen</motion.span> Athleten
          </motion.p>
        </motion.div>

        {/* Comparison Cards - Larger with more impact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          {displayComparisons.map((comp, index) => {
            const percent = Math.round((comp.yourNumeric / comp.avgNumeric) * 100);

            return (
              <motion.div
                key={comp.title}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: 0.4 + index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`relative rounded-2xl p-4 text-left overflow-hidden backdrop-blur-sm ${
                  comp.isAboveAvg
                    ? "bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent border-2 border-emerald-500/30"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                {/* Animated glow for top performers */}
                {comp.isAboveAvg && (
                  <>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-2xl"
                      animate={{ opacity: [0.2, 0.5, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute -inset-1 bg-emerald-500/20 rounded-2xl blur-xl"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                  </>
                )}

                <div className="relative z-10">
                  {/* Icon - Much bigger and animated */}
                  <div className="flex items-start justify-between mb-3">
                    <motion.span
                      className="text-4xl"
                      animate={comp.isAboveAvg ? {
                        scale: [1, 1.3, 1],
                        rotate: [0, 5, -5, 0]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      {comp.icon}
                    </motion.span>
                    {comp.isAboveAvg && (
                      <motion.div
                        className="flex items-center gap-1 bg-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full"
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.7 + index * 0.1, type: "spring", stiffness: 200 }}
                      >
                        <motion.span
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          ★
                        </motion.span>
                        <span className="text-xs font-bold">TOP</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Category name */}
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-1 font-medium">
                    {comp.title}
                  </p>

                  {/* Main value - HUGE */}
                  <motion.div
                    className="mb-2"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                  >
                    <span className={`text-3xl md:text-4xl font-black ${
                      comp.isAboveAvg ? "text-white" : "text-white/70"
                    }`}>
                      {comp.yourValue}
                    </span>
                  </motion.div>

                  {/* VS comparison */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-white/30 text-xs">vs</span>
                    <span className="text-white/50 text-sm font-medium">{comp.avgValue}</span>
                    <span className="text-white/30 text-xs">Durchschnitt</span>
                  </div>

                  {/* Visual comparison bar - Bigger */}
                  <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-3">
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white/40 z-10"
                      style={{ left: "50%" }}
                    />
                    <motion.div
                      className={`absolute top-0 bottom-0 left-0 rounded-full ${
                        comp.isAboveAvg
                          ? "bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400"
                          : "bg-gradient-to-r from-blue-600 to-blue-400"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((percent / 200) * 100, 100)}%` }}
                      transition={{ duration: 1.2, delay: 0.6 + index * 0.15, ease: "easeOut" }}
                    />
                    {comp.isAboveAvg && (
                      <motion.div
                        className="absolute top-0 bottom-0 left-0 rounded-full bg-emerald-400/50 blur-sm"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((percent / 200) * 100, 100)}%` }}
                        transition={{ duration: 1.2, delay: 0.6 + index * 0.15, ease: "easeOut" }}
                      />
                    )}
                  </div>

                  {/* Result - Bold and prominent */}
                  <div className="flex items-center justify-between">
                    <motion.span
                      className={`text-lg font-bold ${
                        comp.isAboveAvg ? "text-emerald-400" : "text-white/40"
                      }`}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      {comp.comparison}
                    </motion.span>
                    <span className="text-[10px] text-white/20">{comp.source}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Summary - Bigger celebration */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.2, type: "spring" }}
          className={`relative rounded-3xl p-6 overflow-hidden ${
            aboveAvgCount >= 3
              ? "bg-gradient-to-r from-emerald-500/20 via-emerald-400/15 to-emerald-500/20 border-2 border-emerald-500/40"
              : "bg-white/5 border border-white/10"
          }`}
        >
          {/* Animated effects */}
          {aboveAvgCount >= 3 && (
            <>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
              />
              <motion.div
                className="absolute -inset-2 bg-emerald-500/10 rounded-3xl blur-2xl"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </>
          )}

          <div className="relative z-10">
            {aboveAvgCount >= 3 ? (
              <>
                <motion.span
                  className="text-6xl block mb-3"
                  animate={{
                    rotate: [0, -15, 15, 0],
                    scale: [1, 1.2, 1.2, 1],
                    y: [0, -10, -10, 0]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.5 }}
                >
                  🏆
                </motion.span>
                <motion.p
                  className="text-white text-xl font-bold mb-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                >
                  <span className="text-emerald-400">{aboveAvgCount}</span> von {displayComparisons.length} über dem Schnitt
                </motion.p>
                <motion.p
                  className="text-emerald-400 text-lg font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 }}
                >
                  Du gehörst zur Elite! 🌟
                </motion.p>
              </>
            ) : aboveAvgCount >= 1 ? (
              <>
                <motion.span
                  className="text-5xl block mb-3"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💪
                </motion.span>
                <p className="text-white/90 text-lg font-medium">
                  In <span className="text-emerald-400 font-bold text-xl">{aboveAvgCount}</span> {aboveAvgCount === 1 ? "Kategorie" : "Kategorien"} über dem Schnitt!
                </p>
              </>
            ) : (
              <>
                <span className="text-5xl block mb-3">🎯</span>
                <p className="text-white/70 text-lg">
                  Deine Basis für ein starkes {stats.year + 1}!
                </p>
              </>
            )}
          </div>
        </motion.div>

        {/* Source footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-5 text-white/20 text-xs"
        >
          Quellen: Strava Year in Sport 2024, Garmin Connect 2024, UK Gov Statistics
        </motion.p>
      </div>
    </SlideWrapper>
  );
}
