"use client";

import { motion } from "framer-motion";
import SlideWrapper from "./SlideWrapper";
import { YearStats } from "@/lib/types/activity";

interface InsightsSlideProps {
  stats: YearStats;
}

// SVG Icons for insights
const icons = {
  heart: (color: string) => (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none">
      <defs>
        <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <motion.path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="url(#heartGrad)"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.5 }}
      />
      <motion.path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="none"
        stroke={color}
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      />
    </svg>
  ),
  tv: (color: string) => (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke={color} strokeWidth="2">
      <motion.rect
        x="2"
        y="7"
        width="20"
        height="15"
        rx="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.path
        d="M17 2l-5 5-5-5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      />
    </svg>
  ),
  burger: (color: string) => (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke={color} strokeWidth="2">
      <motion.path
        d="M4 9h16c1 0 2 .5 2 2H2c0-1.5 1-2 2-2z"
        strokeLinecap="round"
        fill={`${color}33`}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
      <motion.path
        d="M20 16H4c-1 0-2-.5-2-2h20c0 1.5-1 2-2 2z"
        strokeLinecap="round"
        fill={`${color}33`}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      />
      <motion.path
        d="M4 12h16M6 14.5h.01M10 14.5h.01M14 14.5h.01M18 14.5h.01"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      />
    </svg>
  ),
  building: (color: string) => (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke={color} strokeWidth="2">
      <motion.path
        d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"
        strokeLinejoin="round"
        fill={`${color}22`}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.path
        d="M12 2v4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      />
    </svg>
  ),
  brain: (color: string) => (
    <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke={color} strokeWidth="1.5">
      <motion.path
        d="M9 4a5 5 0 015 0M7 8a7 7 0 0110 0M5 13c0-3 2-5.5 4-6.5M19 13c0-3-2-5.5-4-6.5M5 13c0 4 3 7 7 9M19 13c0 4-3 7-7 9"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.circle
        cx="9"
        cy="12"
        r="2"
        fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      />
      <motion.circle
        cx="15"
        cy="12"
        r="2"
        fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6 }}
      />
    </svg>
  ),
};

type IconType = "heart" | "tv" | "burger" | "building";

function generateInsights(stats: YearStats) {
  const insights: Array<{ title: string; value: string; icon: IconType; color: string }> = [];

  // Herzschläge beim Training
  const avgHR = 140;
  const totalMinutes = stats.totalDuration * 60;
  const heartbeats = Math.round(totalMinutes * avgHR);
  if (heartbeats > 100000) {
    insights.push({
      title: "Herzschlage",
      value: `${(heartbeats / 1000000).toFixed(1)} Mio`,
      icon: "heart",
      color: "#ec4899",
    });
  }

  // Netflix Alternative
  const netflixEpisodes = Math.floor((stats.totalDuration * 60) / 45);
  if (netflixEpisodes > 50) {
    insights.push({
      title: "Statt Netflix",
      value: `${netflixEpisodes} Folgen`,
      icon: "tv",
      color: "#3b82f6",
    });
  }

  // Big Macs
  const bigMacs = Math.floor(stats.totalCalories / 550);
  if (bigMacs > 50) {
    insights.push({
      title: "Burger-Power",
      value: `${bigMacs} Big Macs`,
      icon: "burger",
      color: "#f97316",
    });
  }

  // Kölner Dom
  const domHeight = 157;
  const doms = Math.floor(stats.totalElevation / domHeight);
  if (doms >= 10) {
    insights.push({
      title: "Hohenrekord",
      value: `${doms}x Kolner Dom`,
      icon: "building",
      color: "#10b981",
    });
  }

  return insights.slice(0, 4);
}

export default function InsightsSlide({ stats }: InsightsSlideProps) {
  const insights = generateInsights(stats);

  if (insights.length === 0) return null;

  const gradients: Record<string, string> = {
    "#ec4899": "from-pink-500/20 to-purple-500/20 border-pink-500/30",
    "#3b82f6": "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    "#f97316": "from-orange-500/20 to-red-500/20 border-orange-500/30",
    "#10b981": "from-green-500/20 to-teal-500/20 border-green-500/30",
  };

  return (
    <SlideWrapper gradient="from-[#1a0a28] via-[#2d1b47] to-[#1a0a28]">
      <div className="text-center w-full max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            {icons.brain("#a855f7")}
          </motion.div>
          <div className="text-left">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl md:text-2xl font-bold text-white"
            >
              Fun Facts
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/50 text-sm"
            >
              Wusstest du?
            </motion.p>
          </div>
        </div>

        {/* Insights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          {insights.map((insight, index) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`bg-gradient-to-br ${gradients[insight.color]} border rounded-xl p-4 text-left relative overflow-hidden`}
            >
              {/* Animated gradient bar at top */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: `linear-gradient(to right, ${insight.color}, ${insight.color}88)` }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              />

              <motion.div
                className="mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              >
                {icons[insight.icon](insight.color)}
              </motion.div>
              <div className="text-xs text-white/50 uppercase tracking-wider">
                {insight.title}
              </div>
              <div className="text-2xl font-bold text-white">
                {insight.value}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Data Source Attribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 flex items-center justify-center gap-2 text-[10px] text-white/30"
        >
          <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <span>Berechnet aus: Aktivitatsdauer, Kalorien, Hohenmeter</span>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
