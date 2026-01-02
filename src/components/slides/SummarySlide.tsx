"use client";

import { motion } from "framer-motion";
import SlideWrapper, { AnimatedLine } from "./SlideWrapper";
import { YearStats, ActivityType } from "@/lib/types/activity";

interface SummarySlideProps {
  stats: YearStats;
}

const sportEmojis: Record<ActivityType, string> = {
  running: "🏃",
  cycling: "🚴",
  swimming: "🏊",
  walking: "🚶",
  hiking: "⛰️",
  strength: "💪",
  yoga: "🧘",
  other: "🏋️",
};

export default function SummarySlide({ stats }: SummarySlideProps) {
  // Get top sport
  const topSport = Object.entries(stats.byType).sort(
    ([, a], [, b]) => b.count - a.count
  )[0];

  return (
    <SlideWrapper gradient="from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a1a]">
      <div className="text-center w-full max-w-lg mx-auto" id="summary-card">
        <AnimatedLine className="text-white/50 text-lg mb-4">
          Dein Jahr {stats.year}
        </AnimatedLine>

        <AnimatedLine delay={0.1} className="text-4xl md:text-5xl font-bold gradient-text mb-8">
          Zusammenfassung
        </AnimatedLine>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-3xl font-bold text-white">
              {stats.totalActivities}
            </div>
            <div className="text-sm text-white/50">Aktivitäten</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-3xl font-bold text-white">
              {Math.round(stats.totalDistance).toLocaleString("de-DE")}
            </div>
            <div className="text-sm text-white/50">Kilometer</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-3xl font-bold text-white">
              {Math.round(stats.totalDuration)}
            </div>
            <div className="text-sm text-white/50">Stunden</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-3xl font-bold text-white">
              {Math.round(stats.totalElevation).toLocaleString("de-DE")}
            </div>
            <div className="text-sm text-white/50">Höhenmeter</div>
          </div>
        </motion.div>

        {/* Top sport */}
        {topSport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-garmin-blue/20 to-garmin-purple/20 rounded-xl p-4 border border-white/10"
          >
            <div className="text-sm text-white/50 mb-1">Lieblingssport</div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">{sportEmojis[topSport[0] as ActivityType]}</span>
              <span className="text-xl font-bold text-white">
                {topSport[1].count}x{" "}
                {topSport[0] === "running"
                  ? "Laufen"
                  : topSport[0] === "cycling"
                    ? "Radfahren"
                    : topSport[0] === "swimming"
                      ? "Schwimmen"
                      : topSport[0]}
              </span>
            </div>
          </motion.div>
        )}

        {/* Branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-white/30 text-sm"
        >
          Garmin Wrapped {stats.year}
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
