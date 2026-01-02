"use client";

import { motion } from "framer-motion";
import SlideWrapper from "./SlideWrapper";
import { YearStats } from "@/lib/types/activity";
import CountingNumber from "../animations/CountingNumber";
import PulsingHeart from "../animations/PulsingHeart";

interface SleepHealthSlideProps {
  stats: YearStats;
}

// Animated moon with stars
function AnimatedMoon() {
  return (
    <div className="w-14 h-14">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        {/* Moon crescent */}
        <motion.path
          d="M60 15 A35 35 0 1 0 60 85 A28 28 0 1 1 60 15"
          fill="url(#moonGradient)"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.4 }}
        />
        {/* Stars */}
        {[[20, 25], [75, 20], [80, 50], [25, 70]].map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r="2"
            fill="#fbbf24"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1], scale: [0, 1.2, 0.8, 1] }}
            transition={{ delay: 0.5 + i * 0.15, duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
        ))}
        {/* Zzzs */}
        {[0, 1, 2].map((i) => (
          <motion.text
            key={`z-${i}`}
            x={70 + i * 8}
            y={35 - i * 8}
            fontSize={10 - i * 2}
            fill="rgba(129, 140, 248, 0.6)"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: [0, 1, 0], y: [5, 0, -5] }}
            transition={{ delay: 0.8 + i * 0.2, duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          >
            Z
          </motion.text>
        ))}
      </svg>
    </div>
  );
}

// Sleep quality indicator SVG
function SleepQualityIcon({ quality }: { quality: "excellent" | "good" | "ok" | "poor" | "unknown" }) {
  const colors = {
    excellent: "#22c55e",
    good: "#3b82f6",
    ok: "#eab308",
    poor: "#f97316",
    unknown: "rgba(255,255,255,0.4)",
  };
  const color = colors[quality];

  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <defs>
        <linearGradient id={`sleepGrad-${quality}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Bed icon */}
      <motion.rect
        x="2"
        y="14"
        width="20"
        height="4"
        rx="1"
        fill={`url(#sleepGrad-${quality})`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4 }}
      />
      <motion.path
        d="M4 14V10a2 2 0 012-2h12a2 2 0 012 2v4"
        fill="none"
        stroke={color}
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      />
      <motion.circle
        cx="8"
        cy="10"
        r="2"
        fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4 }}
      />
      {/* Quality stars */}
      {quality === "excellent" && (
        <motion.path
          d="M18 5l1 2 2 .3-1.5 1.4.4 2-1.9-1-1.9 1 .4-2L15 7.3l2-.3 1-2z"
          fill="#fbbf24"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 0.5 }}
        />
      )}
    </svg>
  );
}

// Step icon
function StepIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <motion.path
        d="M4 19l4-4m0 0l4 4m-4-4v9"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.circle
        cx="8"
        cy="8"
        r="4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 }}
      />
      <motion.path
        d="M14 19l4-4m0 0l4 4m-4-4v9"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        opacity={0.5}
      />
    </svg>
  );
}

// Walking distance icon
function WalkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <motion.circle
        cx="12"
        cy="5"
        r="2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      />
      <motion.path
        d="M12 7v5l3 3M12 12l-3 5M15 15l2 4M9 17l-2 4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6 }}
      />
    </svg>
  );
}

// HR Rating badge
function RatingBadge({ text, color }: { text: string; color: string }) {
  const colorClasses: Record<string, string> = {
    "text-green-400": "bg-green-500/20 text-green-400",
    "text-blue-400": "bg-blue-500/20 text-blue-400",
    "text-cyan-400": "bg-cyan-500/20 text-cyan-400",
    "text-yellow-400": "bg-yellow-500/20 text-yellow-400",
    "text-orange-400": "bg-orange-500/20 text-orange-400",
    "text-white/40": "bg-white/10 text-white/40",
  };

  return (
    <motion.span
      className={`text-xs px-2 py-0.5 rounded-full ${colorClasses[color] || "bg-white/10 text-white/40"}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      {text}
    </motion.span>
  );
}

export default function SleepHealthSlide({ stats }: SleepHealthSlideProps) {
  const health = stats.healthStats;

  const hasRealData = health?.hasRealData === true;
  const hasSleepData = health?.avgSleepDuration !== null && health?.avgSleepDuration !== undefined;
  const hasHRData = health?.avgRestingHeartRate !== null && health?.avgRestingHeartRate !== undefined;
  const hasStepsData = health?.avgDailySteps !== null && health?.avgDailySteps !== undefined;

  const avgRestingHR = hasHRData ? health.avgRestingHeartRate : null;
  const avgSleep = hasSleepData ? health.avgSleepDuration : null;
  const avgDailySteps = hasStepsData ? health.avgDailySteps : null;

  const getSleepQuality = (): { quality: "excellent" | "good" | "ok" | "poor" | "unknown"; text: string; color: string } => {
    if (!avgSleep) return { quality: "unknown", text: "Keine Daten", color: "text-white/40" };
    if (avgSleep >= 7.5) return { quality: "excellent", text: "Ausgezeichnet", color: "text-green-400" };
    if (avgSleep >= 7) return { quality: "good", text: "Gut", color: "text-blue-400" };
    if (avgSleep >= 6.5) return { quality: "ok", text: "Okay", color: "text-yellow-400" };
    return { quality: "poor", text: "Verbesserungswurdig", color: "text-orange-400" };
  };

  const getHRAssessment = () => {
    if (!avgRestingHR) return { text: "-", color: "text-white/40" };
    if (avgRestingHR < 55) return { text: "Athletisch", color: "text-green-400" };
    if (avgRestingHR < 65) return { text: "Sehr gut", color: "text-blue-400" };
    if (avgRestingHR < 75) return { text: "Gut", color: "text-cyan-400" };
    return { text: "Normal", color: "text-yellow-400" };
  };

  const sleepQuality = getSleepQuality();
  const hrAssessment = getHRAssessment();
  const kmWalked = avgDailySteps ? (avgDailySteps * 365 * 0.0007) : 0;

  return (
    <SlideWrapper gradient="from-[#0a0a1a] via-[#1a1a3e] to-[#0a0a1a]">
      <div className="text-center w-full max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <AnimatedMoon />
          <div className="text-left">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl md:text-2xl font-bold text-white"
            >
              Gesundheit & Erholung
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/50 text-sm"
            >
              Dein Wellness-Profil
            </motion.p>
          </div>
        </div>

        {/* Main Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-4"
        >
          {/* Sleep */}
          <motion.div
            className="bg-indigo-500/15 border border-indigo-500/30 rounded-xl p-3 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{ transformOrigin: "left" }}
            />
            <div className="flex items-center justify-between mb-1">
              <SleepQualityIcon quality={sleepQuality.quality} />
              <RatingBadge text={sleepQuality.text} color={sleepQuality.color} />
            </div>
            <div className="text-3xl font-bold text-white">
              {avgSleep !== null ? avgSleep.toFixed(1) : "-"}
              <span className="text-sm text-white/50 ml-1">h</span>
            </div>
            <div className="text-xs text-white/50">Durchschnitt Schlaf/Nacht</div>
          </motion.div>

          {/* Resting HR */}
          <motion.div
            className="bg-red-500/15 border border-red-500/30 rounded-xl p-3 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-400 to-pink-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{ transformOrigin: "left" }}
            />
            <div className="flex items-center justify-between mb-1">
              <PulsingHeart size={28} bpm={avgRestingHR || 60} color="#ef4444" />
              <RatingBadge text={hrAssessment.text} color={hrAssessment.color} />
            </div>
            <div className="text-3xl font-bold text-white">
              {avgRestingHR !== null ? <CountingNumber value={avgRestingHR} delay={0.3} /> : "-"}
              <span className="text-sm text-white/50 ml-1">BPM</span>
            </div>
            <div className="text-xs text-white/50">Ruhepuls</div>
          </motion.div>

          {/* Daily Steps */}
          <motion.div
            className="bg-green-500/15 border border-green-500/30 rounded-xl p-3 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              style={{ transformOrigin: "left" }}
            />
            <div className="mb-1">
              <StepIcon className="w-8 h-8 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white">
              {avgDailySteps !== null ? (
                <CountingNumber value={avgDailySteps} delay={0.4} />
              ) : "-"}
            </div>
            <div className="text-xs text-white/50">Durchschnitt Schritte/Tag</div>
          </motion.div>

          {/* Distance walked */}
          <motion.div
            className="bg-teal-500/15 border border-teal-500/30 rounded-xl p-3 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              style={{ transformOrigin: "left" }}
            />
            <div className="mb-1">
              <WalkIcon className="w-8 h-8 text-teal-400" />
            </div>
            <div className="text-3xl font-bold text-white">
              {avgDailySteps !== null ? Math.round(kmWalked).toLocaleString("de-DE") : "-"}
              <span className="text-sm text-white/50 ml-1">km</span>
            </div>
            <div className="text-xs text-white/50">zu Fuss gelaufen</div>
          </motion.div>
        </motion.div>

        {/* Sleep bar visualization */}
        {avgSleep !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white/5 border border-white/10 rounded-xl p-3 mb-4"
          >
            <div className="flex items-center justify-between text-xs text-white/50 mb-2">
              <span>Schlafqualitat</span>
              <span>Empfohlen: 7-9h</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden relative">
              {/* Recommended zone indicator */}
              <div
                className="absolute top-0 bottom-0 bg-green-500/20 border-l border-r border-green-500/40"
                style={{ left: `${(7 / 9) * 100}%`, right: "0%" }}
              />
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full relative z-10"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((avgSleep / 9) * 100, 100)}%` }}
                transition={{ delay: 0.8, duration: 0.8 }}
              />
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-white/30">
              <span>0h</span>
              <span>9h</span>
            </div>
          </motion.div>
        )}

        {/* Insight message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          {hasRealData ? (
            <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
              {avgRestingHR !== null && avgRestingHR < 60 ? (
                <>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Dein Ruhepuls ist im Bereich von Profisportlern</span>
                </>
              ) : avgSleep !== null && avgSleep >= 7.5 ? (
                <>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Du schlafst besser als 70% der Bevolkerung</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4m0 12v4m-8-8h4m12 0h4" strokeLinecap="round" />
                  </svg>
                  <span>Weiter so mit deiner Gesundheit</span>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-yellow-400/70 text-sm">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" />
              </svg>
              <span>Keine Health-Daten - aktiviere Schlaf & HR Tracking</span>
            </div>
          )}
        </motion.div>

        {/* Data Source Attribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-4 flex items-center justify-center gap-2 text-[10px] text-white/30"
        >
          <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <span>Daten: Garmin Health Stats API (Schlaf, Herzfrequenz, Schritte)</span>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
