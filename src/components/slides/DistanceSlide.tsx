"use client";

import { motion } from "framer-motion";
import SlideWrapper from "./SlideWrapper";
import { YearStats } from "@/lib/types/activity";
import CountingNumber from "../animations/CountingNumber";
import { useMemo } from "react";

interface DistanceSlideProps {
  stats: YearStats;
}

// Animated journey path visualization
function JourneyPath({ totalKm }: { totalKm: number }) {
  // Journey route that draws itself
  const pathD = "M50,80 Q80,75 100,60 T150,50 Q200,35 250,45 T320,30 Q370,20 400,35 T450,25";

  return (
    <div className="relative w-full max-w-md mx-auto h-32 mb-6">
      <svg viewBox="0 0 500 100" className="w-full h-full">
        <defs>
          <linearGradient id="journeyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <filter id="journeyGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background path */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Animated journey path */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#journeyGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#journeyGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
        />

        {/* Start point */}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <circle cx="50" cy="80" r="6" fill="#a855f7" filter="url(#journeyGlow)" />
          <circle cx="50" cy="80" r="3" fill="white" />
        </motion.g>

        {/* End point with pulse */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2.5, type: "spring" }}
        >
          <motion.circle
            cx="450"
            cy="25"
            r="6"
            fill="none"
            stroke="#f97316"
            strokeWidth="2"
            animate={{ r: [6, 15, 6], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 2.8 }}
          />
          <circle cx="450" cy="25" r="6" fill="#f97316" filter="url(#journeyGlow)" />
          <circle cx="450" cy="25" r="3" fill="white" />
        </motion.g>

        {/* Moving dot */}
        <motion.circle
          r="4"
          fill="white"
          filter="url(#journeyGlow)"
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
          style={{ offsetPath: `path("${pathD}")` }}
        />

        {/* City markers */}
        <motion.text
          x="50"
          y="98"
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize="10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Start
        </motion.text>
        <motion.text
          x="450"
          y="15"
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize="10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
        >
          {Math.round(totalKm).toLocaleString("de-DE")} km
        </motion.text>
      </svg>
    </div>
  );
}

// Sport distance breakdown bar with expanded "other" breakdown
function SportBreakdown({ stats }: { stats: YearStats }) {
  const sportData = useMemo(() => {
    const data: Array<{ key: string; name: string; distance: number; color: string }> = [];

    const sportConfig: Record<string, { name: string; color: string }> = {
      running: { name: "Laufen", color: "#a855f7" },
      cycling: { name: "Radfahren", color: "#3b82f6" },
      swimming: { name: "Schwimmen", color: "#06b6d4" },
      hiking: { name: "Wandern", color: "#22c55e" },
      walking: { name: "Gehen", color: "#eab308" },
      strength: { name: "Kraft", color: "#ef4444" },
      yoga: { name: "Yoga", color: "#a855f7" },
    };

    // Colors for "other" breakdown items
    const otherColors: Record<string, string> = {
      multi_sport: "#ec4899",
      stand_up_paddleboarding_v2: "#14b8a6",
      soccer: "#84cc16",
      volleyball: "#f59e0b",
      beach_volleyball: "#fbbf24",
      tennis: "#10b981",
      skiing: "#60a5fa",
      snowboarding: "#818cf8",
    };

    // Add main sports (except "other")
    Object.entries(stats.byType).forEach(([sport, sportStats]) => {
      if (sportStats && sportStats.totalDistance > 0 && sport !== "other") {
        const config = sportConfig[sport] || { name: sport, color: "#6b7280" };
        data.push({
          key: sport,
          name: config.name,
          distance: sportStats.totalDistance,
          color: config.color,
        });
      }
    });

    // Add expanded "other" breakdown
    if (stats.otherBreakdown) {
      Object.entries(stats.otherBreakdown).forEach(([typeKey, breakdown]) => {
        if (breakdown.totalDistance > 0) {
          data.push({
            key: `other_${typeKey}`,
            name: breakdown.displayName,
            distance: breakdown.totalDistance,
            color: otherColors[typeKey] || "#6b7280",
          });
        }
      });
    } else if (stats.byType.other && stats.byType.other.totalDistance > 0) {
      // Fallback: show as single "Sonstiges" if no breakdown available
      data.push({
        key: "other",
        name: "Sonstiges",
        distance: stats.byType.other.totalDistance,
        color: "#6b7280",
      });
    }

    return data.sort((a, b) => b.distance - a.distance);
  }, [stats]);

  const maxDistance = Math.max(...sportData.map((s) => s.distance));

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {sportData.slice(0, 5).map((sport, index) => (
        <motion.div
          key={sport.key}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5 + index * 0.12 }}
          className="relative"
        >
          <div className="flex justify-between text-sm mb-1">
            <span className="text-white/70">{sport.name}</span>
            <span className="text-white font-medium">
              {Math.round(sport.distance).toLocaleString("de-DE")} km
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: sport.color }}
              initial={{ width: 0 }}
              animate={{ width: `${(sport.distance / maxDistance) * 100}%` }}
              transition={{ delay: 1.7 + index * 0.12, duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Get journey comparison
function getJourneyComparison(km: number): { text: string } {
  // Real distances between cities - one-way distances
  if (km >= 10000) return { text: "Einmal von Berlin nach Sydney" };
  if (km >= 8000) return { text: "Von München bis nach Tokio" };
  if (km >= 5000) return { text: "Einmal über den Atlantik nach New York" };
  if (km >= 4000) return { text: "Von Berlin bis nach Dubai" };
  if (km >= 3000) return { text: "Von München bis zu den Pyramiden in Ägypten" };
  if (km >= 2000) return { text: "Einmal quer durch Europa bis Lissabon" };
  if (km >= 1500) return { text: "Von Berlin ans Mittelmeer nach Barcelona" };
  if (km >= 1000) return { text: "Von Hamburg über die Alpen bis nach Rom" };
  if (km >= 500) return { text: "Einmal quer durch Deutschland" };
  return { text: "Eine beeindruckende Strecke" };
}

// Fun distance comparisons
function getFunComparisons(km: number): Array<{ emoji: string; value: string; label: string }> {
  const comparisons: Array<{ emoji: string; value: string; label: string }> = [];

  // Bodensee (63 km Umfang)
  const bodensee = km / 63;
  if (bodensee >= 1) {
    comparisons.push({ emoji: "🏊", value: `${bodensee.toFixed(1)}×`, label: "um den Bodensee" });
  }

  // Äquator (40.075 km)
  const equator = (km / 40075) * 100;
  if (equator >= 0.1) {
    comparisons.push({ emoji: "🌍", value: `${equator.toFixed(1)}%`, label: "Erdumrundung" });
  }

  // Mond (384.400 km)
  const moon = (km / 384400) * 100;
  if (moon >= 0.01) {
    comparisons.push({ emoji: "🌙", value: `${moon.toFixed(2)}%`, label: "zum Mond" });
  }

  // Deutschland quer (876 km)
  const germany = km / 876;
  if (germany >= 0.5) {
    comparisons.push({ emoji: "🇩🇪", value: `${germany.toFixed(1)}×`, label: "quer durch DE" });
  }

  return comparisons.slice(0, 3);
}

export default function DistanceSlide({ stats }: DistanceSlideProps) {
  // Skip slide if no distance data
  if (stats.totalDistance === 0 || stats.totalActivities === 0) {
    return null;
  }

  const journey = getJourneyComparison(stats.totalDistance);
  const avgPerActivity = stats.totalDistance / stats.totalActivities;
  const funComparisons = getFunComparisons(stats.totalDistance);

  return (
    <SlideWrapper gradient="from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e]">
      <div className="text-center w-full max-w-4xl mx-auto px-4">
        {/* Journey visualization */}
        <div className="max-w-xs md:max-w-md mx-auto">
          <JourneyPath totalKm={stats.totalDistance} />
        </div>

        {/* Main stat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-2"
        >
          <p className="text-white/50 text-xs md:text-sm mb-1">Deine Reise</p>
          <div className="flex items-baseline justify-center gap-1 md:gap-2">
            <CountingNumber
              value={Math.round(stats.totalDistance)}
              className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent"
              duration={2}
              delay={0.3}
            />
            <span className="text-xl sm:text-2xl md:text-3xl text-white/50 font-light">km</span>
          </div>
        </motion.div>

        {/* Journey comparison */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mb-4 md:mb-6"
        >
          <p className="text-white/60 text-xs md:text-sm px-4">{journey.text}</p>
        </motion.div>

        {/* Fun comparisons */}
        {funComparisons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="flex flex-wrap justify-center gap-2 md:gap-3 mb-4 md:mb-6"
          >
            {funComparisons.map((comp, i) => (
              <motion.div
                key={comp.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 + i * 0.1 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
              >
                <span className="text-base">{comp.emoji}</span>
                <span className="text-white font-semibold text-sm">{comp.value}</span>
                <span className="text-white/50 text-xs">{comp.label}</span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Sport breakdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mb-4 md:mb-6"
        >
          <p className="text-white/50 text-[10px] md:text-xs uppercase tracking-wider mb-3 md:mb-4">Aufgeteilt nach Sportart</p>
          <SportBreakdown stats={stats} />
        </motion.div>

        {/* Average stat */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          className="inline-flex items-center gap-1.5 md:gap-2 bg-white/5 rounded-full px-3 py-1.5 md:px-4 md:py-2"
        >
          <span className="text-white/50 text-xs md:text-sm">Im Schnitt</span>
          <span className="text-white font-semibold text-sm md:text-base">{avgPerActivity.toFixed(1)} km</span>
          <span className="text-white/50 text-xs md:text-sm">pro Aktivität</span>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
