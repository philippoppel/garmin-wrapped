"use client";

import { motion } from "framer-motion";
import SlideWrapper from "./SlideWrapper";
import { YearStats } from "@/lib/types/activity";

interface TimeOfDaySlideProps {
  stats: YearStats;
}

// Animated time-of-day icons
function SunriseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className}>
      <defs>
        <linearGradient id="sunriseGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      {/* Horizon line */}
      <motion.path
        d="M10 55h60"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      {/* Sun rising */}
      <motion.circle
        cx="40"
        cy="55"
        r="15"
        fill="url(#sunriseGrad)"
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      />
      {/* Rays */}
      {[0, 30, 60, 90, 120, 150].map((angle) => (
        <motion.line
          key={angle}
          x1="40"
          y1="35"
          x2="40"
          y2="25"
          stroke="#fbbf24"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${angle} 40 55)`}
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ delay: 0.5 + angle * 0.005, duration: 0.3 }}
        />
      ))}
    </svg>
  );
}

function NoonSunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className}>
      <defs>
        <linearGradient id="noonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <filter id="noonGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Sun */}
      <motion.circle
        cx="40"
        cy="40"
        r="18"
        fill="url(#noonGrad)"
        filter="url(#noonGlow)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.4 }}
      />
      {/* Rays */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.line
          key={i}
          x1="40"
          y1="15"
          x2="40"
          y2="8"
          stroke="#fbbf24"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${i * 45} 40 40)`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.05 }}
        />
      ))}
    </svg>
  );
}

function SunsetIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className}>
      <defs>
        <linearGradient id="sunsetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      {/* Horizon line */}
      <motion.path
        d="M10 50h60"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      {/* Sun setting */}
      <motion.circle
        cx="40"
        cy="50"
        r="18"
        fill="url(#sunsetGrad)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring" }}
      />
      {/* Clouds */}
      <motion.ellipse
        cx="55"
        cy="40"
        rx="12"
        ry="5"
        fill="rgba(139, 92, 246, 0.3)"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      />
      <motion.ellipse
        cx="25"
        cy="35"
        rx="10"
        ry="4"
        fill="rgba(236, 72, 153, 0.3)"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className}>
      <defs>
        <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0e7ff" />
          <stop offset="100%" stopColor="#a5b4fc" />
        </linearGradient>
      </defs>
      {/* Moon crescent */}
      <motion.path
        d="M45 15 A25 25 0 1 0 45 65 A20 20 0 1 1 45 15"
        fill="url(#moonGrad)"
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.4 }}
      />
      {/* Stars */}
      {[[20, 25], [60, 20], [65, 50], [15, 55]].map(([cx, cy], i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r="1.5"
          fill="#fbbf24"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0.5, 1], scale: 1 }}
          transition={{ delay: 0.5 + i * 0.1, duration: 1.5, repeat: Infinity }}
        />
      ))}
    </svg>
  );
}

type TimePersonality = {
  icon: JSX.Element;
  title: string;
  desc: string;
  gradient: string;
};

export default function TimeOfDaySlide({ stats }: TimeOfDaySlideProps) {
  const patterns = stats.trainingPatterns;
  const hourlyDist = patterns?.hourlyDistribution || Array(24).fill(0);
  const maxValue = Math.max(...hourlyDist, 1);
  const peakHour = hourlyDist.indexOf(Math.max(...hourlyDist));

  const getTimePersonality = (): TimePersonality => {
    if (peakHour >= 5 && peakHour < 10) return {
      icon: <SunriseIcon className="w-16 h-16" />,
      title: "Fruhaufsteher",
      desc: "Die Morgenstunden gehoren dir",
      gradient: "from-orange-500 to-amber-400"
    };
    if (peakHour >= 10 && peakHour < 14) return {
      icon: <NoonSunIcon className="w-16 h-16" />,
      title: "Mittagssportler",
      desc: "Wenn andere essen, trainierst du",
      gradient: "from-yellow-400 to-orange-400"
    };
    if (peakHour >= 14 && peakHour < 18) return {
      icon: <SunsetIcon className="w-16 h-16" />,
      title: "Nachmittagsathlet",
      desc: "Der perfekte After-Work-Sport",
      gradient: "from-orange-400 to-pink-500"
    };
    if (peakHour >= 18 && peakHour < 21) return {
      icon: <SunsetIcon className="w-16 h-16" />,
      title: "Abendsportler",
      desc: "Training nach Feierabend",
      gradient: "from-pink-500 to-purple-500"
    };
    return {
      icon: <MoonIcon className="w-16 h-16" />,
      title: "Nachteule",
      desc: "Wenn andere schlafen, trainierst du",
      gradient: "from-indigo-500 to-purple-600"
    };
  };

  const personality = getTimePersonality();
  const formatHour = (h: number) => `${h.toString().padStart(2, "0")}:00`;

  return (
    <SlideWrapper gradient="from-[#0a1628] via-[#1a2a4a] to-[#0a1628]">
      <div className="text-center w-full max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/50 text-lg mb-2"
        >
          Du bist ein
        </motion.p>

        {/* Main personality display */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
          >
            {personality.icon}
          </motion.div>
          <div className="text-left">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${personality.gradient} bg-clip-text text-transparent`}
            >
              {personality.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/50"
            >
              {personality.desc}
            </motion.p>
          </div>
        </div>

        {/* Compact 24h chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4"
        >
          <div className="flex items-end justify-between gap-1 h-24">
            {hourlyDist.map((value, hour) => {
              const height = Math.max((value / maxValue) * 100, 5);
              const isPeak = hour === peakHour;
              const isMorning = hour >= 5 && hour < 12;
              const isEvening = hour >= 17 && hour < 22;

              return (
                <motion.div
                  key={hour}
                  className="flex-1 flex flex-col items-center"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.6 + hour * 0.02 }}
                  style={{ transformOrigin: "bottom" }}
                >
                  <div
                    className={`w-full rounded-t transition-all ${
                      isPeak
                        ? "bg-gradient-to-t from-yellow-500 to-orange-400 shadow-lg shadow-yellow-500/30"
                        : value > 0
                        ? isMorning
                          ? "bg-gradient-to-t from-orange-500/60 to-yellow-400/60"
                          : isEvening
                          ? "bg-gradient-to-t from-purple-500/60 to-blue-400/60"
                          : "bg-blue-500/50"
                        : "bg-white/10"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </motion.div>
              );
            })}
          </div>
          {/* Hour labels */}
          <div className="flex justify-between mt-2 text-xs text-white/40">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00</span>
          </div>
        </motion.div>

        {/* Peak time highlight */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="bg-orange-500/20 border border-orange-500/30 rounded-xl p-3">
            <div className="flex items-center justify-center gap-1 mb-1">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-orange-400">{formatHour(peakHour)}</div>
            <div className="text-xs text-white/50">Aktivste Zeit</div>
          </div>
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3">
            <div className="flex items-center justify-center gap-1 mb-1">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h4l3-9 4 18 3-9h4" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {hourlyDist.filter(v => v > 0).length}
            </div>
            <div className="text-xs text-white/50">Aktive Stunden</div>
          </div>
          <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-3">
            <div className="flex items-center justify-center gap-1 mb-1">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-purple-400" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {peakHour < 12 ? "Morgen" : peakHour < 17 ? "Mittag" : "Abend"}
            </div>
            <div className="text-xs text-white/50">Bevorzugt</div>
          </div>
        </motion.div>

        {/* Data Source Attribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-4 flex items-center justify-center gap-2 text-[10px] text-white/30"
        >
          <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <span>Daten: Garmin Aktivitats-Startzeiten ({stats.totalActivities} Aktivitaten)</span>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
