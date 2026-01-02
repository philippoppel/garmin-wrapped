"use client";

import { motion } from "framer-motion";
import SlideWrapper, { AnimatedLine } from "./SlideWrapper";
import { YearStats } from "@/lib/types/activity";
import CountingNumber from "../animations/CountingNumber";

interface SleepRecoverySlideProps {
  stats: YearStats;
}

// Animated Aurora/Dream Background
function DreamBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Aurora waves */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={`aurora-${i}`}
          className="absolute w-[200%] h-[60%]"
          style={{
            top: `${10 + i * 15}%`,
            left: "-50%",
            background: `linear-gradient(90deg,
              transparent 0%,
              rgba(${100 + i * 30}, ${50 + i * 50}, ${200 - i * 20}, 0.1) 25%,
              rgba(${80 + i * 40}, ${100 + i * 30}, ${220 - i * 30}, 0.15) 50%,
              rgba(${100 + i * 30}, ${50 + i * 50}, ${200 - i * 20}, 0.1) 75%,
              transparent 100%)`,
            filter: "blur(40px)",
            borderRadius: "50%",
          }}
          animate={{
            x: ["-10%", "10%", "-10%"],
            scaleY: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
        />
      ))}

      {/* Floating dream particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: 2 + Math.random() * 4,
            height: 2 + Math.random() * 4,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `rgba(${150 + Math.random() * 100}, ${100 + Math.random() * 100}, 255, ${0.3 + Math.random() * 0.4})`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Stars */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute rounded-full bg-white"
          style={{
            width: 1 + Math.random() * 2,
            height: 1 + Math.random() * 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
        />
      ))}
    </div>
  );
}

// Animated Moon with phases
function AnimatedMoon({ sleepScore }: { sleepScore: number | null }) {
  // Moon phase based on sleep score (higher score = fuller moon)
  const phase = sleepScore ? Math.min(sleepScore / 100, 1) : 0.5;

  return (
    <motion.div
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", bounce: 0.4, delay: 0.2 }}
      className="relative w-20 h-20"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="moonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0e7ff" />
            <stop offset="50%" stopColor="#a5b4fc" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          <filter id="moonBlur">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <radialGradient id="moonShadow" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#e0e7ff" />
            <stop offset="100%" stopColor="#6366f1" />
          </radialGradient>
        </defs>

        {/* Glow */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="url(#moonGlow)"
          filter="url(#moonBlur)"
          opacity={0.3}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Moon body */}
        <circle cx="50" cy="50" r="35" fill="url(#moonShadow)" />

        {/* Moon shadow (creates phase effect) */}
        <motion.ellipse
          cx={50 + (1 - phase) * 40}
          cy="50"
          rx={35 * (1 - phase)}
          ry="35"
          fill="#1e1b4b"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 0.5 }}
        />

        {/* Craters */}
        <circle cx="40" cy="40" r="5" fill="rgba(99, 102, 241, 0.3)" />
        <circle cx="60" cy="55" r="4" fill="rgba(99, 102, 241, 0.3)" />
        <circle cx="45" cy="60" r="3" fill="rgba(99, 102, 241, 0.3)" />
      </svg>

      {/* Z's floating away */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={`z-${i}`}
          className="absolute text-indigo-300 font-bold"
          style={{
            right: -5 + i * 12,
            top: -5 - i * 10,
            fontSize: 14 - i * 2,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 0.8, 0], y: [10, -10, -30] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.5 + i * 0.3,
            repeatDelay: 1,
          }}
        >
          Z
        </motion.span>
      ))}
    </motion.div>
  );
}

// Body Battery Charging Animation
function BodyBatteryGauge({ charge, avgCharge }: { charge: number; avgCharge: number | null }) {
  const segments = 10;
  const filledSegments = Math.round((charge / 100) * segments);

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-1 mb-2">
        {Array.from({ length: segments }).map((_, i) => {
          const isFilled = i < filledSegments;
          const color = i < 3 ? "bg-red-500" : i < 6 ? "bg-yellow-500" : "bg-green-500";

          return (
            <motion.div
              key={i}
              className={`w-3 h-6 rounded-sm ${isFilled ? color : "bg-white/10"}`}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              style={{ transformOrigin: "bottom" }}
            />
          );
        })}
      </div>
      {avgCharge !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-xs text-white/50"
        >
          +{avgCharge}% pro Nacht
        </motion.div>
      )}
    </div>
  );
}

// HRV Wave Animation
function HRVWave({ hrv, trend }: { hrv: number | null; trend: "improving" | "declining" | "stable" | null }) {
  const trendColor = trend === "improving" ? "#22c55e" : trend === "declining" ? "#ef4444" : "#8b5cf6";

  return (
    <div className="relative h-12 w-full">
      <svg viewBox="0 0 200 50" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="hrvGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={trendColor} stopOpacity="0" />
            <stop offset="50%" stopColor={trendColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={trendColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* HRV wave line */}
        <motion.path
          d="M0 25 Q10 25 20 15 T40 25 T60 35 T80 25 T100 15 T120 25 T140 35 T160 25 T180 15 T200 25"
          fill="none"
          stroke="url(#hrvGradient)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />

        {/* Animated dot */}
        <motion.circle
          r="4"
          fill={trendColor}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            cx: [0, 50, 150, 200],
            cy: [25, 15, 35, 25],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </svg>
    </div>
  );
}

// Sleep Score Ring
function SleepScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 40;
  const progress = (score / 100) * circumference;

  const getScoreColor = (s: number) => {
    if (s >= 85) return { stroke: "#22c55e", glow: "rgba(34, 197, 94, 0.4)" };
    if (s >= 70) return { stroke: "#3b82f6", glow: "rgba(59, 130, 246, 0.4)" };
    if (s >= 50) return { stroke: "#eab308", glow: "rgba(234, 179, 8, 0.4)" };
    return { stroke: "#f97316", glow: "rgba(249, 115, 22, 0.4)" };
  };

  const colors = getScoreColor(score);

  return (
    <div className="relative w-24 h-24">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <defs>
          <filter id="scoreGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background ring */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
        />

        {/* Progress ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={colors.stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          filter="url(#scoreGlow)"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        />
      </svg>

      {/* Score number in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <CountingNumber
          value={score}
          className="text-2xl font-bold text-white"
          delay={0.6}
        />
        <span className="text-[10px] text-white/50">Score</span>
      </div>
    </div>
  );
}

// Recovery Quality Assessment
function getRecoveryAssessment(
  avgSleepScore: number | null,
  avgHrv: number | null,
  hrvTrend: "improving" | "declining" | "stable" | null,
  avgBodyBatteryChange: number | null
): {
  level: string;
  description: string;
  gradient: string;
  criteria: string;
} {
  let score = 0;
  let maxScore = 0;

  // Sleep score contribution (0-40 points)
  if (avgSleepScore !== null) {
    maxScore += 40;
    if (avgSleepScore >= 85) score += 40;
    else if (avgSleepScore >= 70) score += 30;
    else if (avgSleepScore >= 55) score += 20;
    else score += 10;
  }

  // HRV contribution (0-30 points)
  if (avgHrv !== null) {
    maxScore += 30;
    if (avgHrv >= 50) score += 30;
    else if (avgHrv >= 40) score += 22;
    else if (avgHrv >= 30) score += 15;
    else score += 8;

    // HRV trend bonus
    if (hrvTrend === "improving") score += 5;
    else if (hrvTrend === "declining") score -= 5;
  }

  // Body Battery contribution (0-30 points)
  if (avgBodyBatteryChange !== null) {
    maxScore += 30;
    if (avgBodyBatteryChange >= 40) score += 30;
    else if (avgBodyBatteryChange >= 25) score += 22;
    else if (avgBodyBatteryChange >= 15) score += 15;
    else score += 8;
  }

  // Calculate percentage
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

  if (percentage >= 85) {
    return {
      level: "ELITE",
      description: "Optimale Regeneration",
      gradient: "from-emerald-500 to-green-600",
      criteria: "Sleep-Score 85+, HRV 50+ ms, Body Battery +40%",
    };
  }
  if (percentage >= 70) {
    return {
      level: "SEHR GUT",
      description: "Uberdurchschnittliche Erholung",
      gradient: "from-blue-500 to-indigo-600",
      criteria: "Sleep-Score 70+, HRV 40+ ms, Body Battery +25%",
    };
  }
  if (percentage >= 50) {
    return {
      level: "GUT",
      description: "Solide Regeneration",
      gradient: "from-cyan-500 to-blue-600",
      criteria: "Sleep-Score 55+, HRV 30+ ms, Body Battery +15%",
    };
  }
  return {
    level: "AUSBAUFAHIG",
    description: "Potenzial vorhanden",
    gradient: "from-amber-500 to-orange-600",
    criteria: "Verbesserungspotenzial bei Schlaf, HRV oder Erholung",
  };
}

export default function SleepRecoverySlide({ stats }: SleepRecoverySlideProps) {
  const wellness = stats.wellnessInsights;
  const health = stats.healthStats;

  // Extract all relevant data
  const avgSleepScore = wellness?.avgSleepScore ?? null;
  const perfectSleepDays = wellness?.perfectSleepDays ?? 0;
  const excellentSleepDays = wellness?.excellentSleepDays ?? 0;
  const avgSleepDuration = health?.avgSleepDuration ?? null;

  const avgHrv = wellness?.avgHrv ?? null;
  const hrvTrend = wellness?.hrvTrend ?? null;
  const hrvAfterActivity = wellness?.hrvAfterActivity ?? null;
  const hrvAfterRest = wellness?.hrvAfterRest ?? null;

  const avgBodyBatteryChange = wellness?.avgBodyBatteryChange ?? null;

  // Calculate recovery assessment
  const recoveryAssessment = getRecoveryAssessment(
    avgSleepScore,
    avgHrv,
    hrvTrend,
    avgBodyBatteryChange
  );

  // Estimated full charge nights (100% Body Battery)
  const estimatedFullChargeNights = avgBodyBatteryChange
    ? Math.round((avgBodyBatteryChange / 100) * 365 * (avgBodyBatteryChange >= 30 ? 0.8 : 0.5))
    : null;

  const hasData = wellness?.hasSleepData || wellness?.hasHrvData || wellness?.hasBodyBatteryData;

  if (!hasData) {
    return null;
  }

  return (
    <SlideWrapper gradient="from-[#0f0a1a] via-[#1a1040] to-[#0f0a1a]">
      <DreamBackground />

      <div className="relative z-10 text-center w-full max-w-4xl mx-auto px-4">
        {/* Header with Moon */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <AnimatedMoon sleepScore={avgSleepScore} />
          <div className="text-left">
            <AnimatedLine className="text-white/50 text-sm">
              Deine Erholung in 2025
            </AnimatedLine>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-bold text-white"
            >
              Schlaf & Regeneration
            </motion.h2>
          </div>
        </div>

        {/* Recovery Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="mb-6"
        >
          <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r ${recoveryAssessment.gradient} text-white font-bold shadow-lg`}>
            <span className="tracking-wider">{recoveryAssessment.level}</span>
          </div>
          <p className="text-white/60 text-sm mt-1">{recoveryAssessment.description}</p>
        </motion.div>

        {/* Main Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
        >
          {/* Sleep Score */}
          {avgSleepScore !== null && (
            <motion.div
              className="bg-indigo-500/15 border border-indigo-500/30 rounded-xl p-4 flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <SleepScoreRing score={avgSleepScore} />
              <div className="text-xs text-white/50 mt-2">Sleep-Score</div>
              <div className="text-[10px] text-indigo-300">
                {perfectSleepDays > 0 && `${perfectSleepDays}x 100 Punkte`}
              </div>
            </motion.div>
          )}

          {/* Sleep Duration */}
          {avgSleepDuration !== null && (
            <motion.div
              className="bg-purple-500/15 border border-purple-500/30 rounded-xl p-4 flex flex-col items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-3xl font-bold text-white">
                <CountingNumber value={avgSleepDuration} decimals={1} delay={0.8} />
                <span className="text-lg text-white/60">h</span>
              </div>
              <div className="text-xs text-white/50 mt-1">Schlaf pro Nacht</div>
              <div className="text-[10px] text-purple-300 mt-1">
                {avgSleepDuration >= 7.5 ? "Optimal (7-9h)" : avgSleepDuration >= 7 ? "Gut" : "Unter Empfehlung"}
              </div>
            </motion.div>
          )}

          {/* HRV */}
          {avgHrv !== null && (
            <motion.div
              className="bg-violet-500/15 border border-violet-500/30 rounded-xl p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="text-3xl font-bold text-white text-center">
                <CountingNumber value={avgHrv} delay={0.9} />
                <span className="text-sm text-white/60 ml-1">ms</span>
              </div>
              <div className="text-xs text-white/50 text-center mb-2">HRV</div>
              <HRVWave hrv={avgHrv} trend={hrvTrend} />
              {hrvTrend && (
                <div className={`text-[10px] text-center mt-1 ${
                  hrvTrend === "improving" ? "text-green-400" :
                  hrvTrend === "declining" ? "text-red-400" : "text-white/50"
                }`}>
                  {hrvTrend === "improving" ? "Trend: Verbessert" :
                   hrvTrend === "declining" ? "Trend: Gesunken" : "Trend: Stabil"}
                </div>
              )}
            </motion.div>
          )}

          {/* Body Battery */}
          {avgBodyBatteryChange !== null && (
            <motion.div
              className="bg-amber-500/15 border border-amber-500/30 rounded-xl p-4 flex flex-col items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="text-xs text-white/50 mb-2">Body Battery</div>
              <BodyBatteryGauge
                charge={Math.min(avgBodyBatteryChange * 2, 100)}
                avgCharge={avgBodyBatteryChange}
              />
            </motion.div>
          )}
        </motion.div>

        {/* HRV Activity vs Rest Comparison */}
        {hrvAfterActivity !== null && hrvAfterRest !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 max-w-md mx-auto"
          >
            <div className="text-xs text-white/50 mb-3">HRV-Reaktion auf Training</div>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <motion.div
                  className="text-2xl font-bold text-orange-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.1, type: "spring" }}
                >
                  {hrvAfterActivity}
                </motion.div>
                <div className="text-[10px] text-white/50">Nach Sport</div>
              </div>

              <div className="flex items-center gap-2">
                <motion.div
                  className="w-16 h-1 bg-gradient-to-r from-orange-400 to-blue-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                />
              </div>

              <div className="text-center">
                <motion.div
                  className="text-2xl font-bold text-blue-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.3, type: "spring" }}
                >
                  {hrvAfterRest}
                </motion.div>
                <div className="text-[10px] text-white/50">Nach Ruhetag</div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="text-xs text-center mt-3"
            >
              {hrvAfterActivity > hrvAfterRest ? (
                <span className="text-green-400">Dein Korper reagiert positiv auf Training</span>
              ) : hrvAfterRest > hrvAfterActivity ? (
                <span className="text-blue-400">Ruhetage unterstutzen deine Erholung</span>
              ) : (
                <span className="text-white/50">Ausgewogene HRV-Reaktion</span>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Sleep Quality Highlights */}
        {(perfectSleepDays > 0 || excellentSleepDays > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex justify-center gap-4 mb-4"
          >
            {perfectSleepDays > 0 && (
              <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-lg px-4 py-2">
                <div className="text-2xl font-bold text-yellow-400">{perfectSleepDays}</div>
                <div className="text-[10px] text-white/50">Perfekte Nachte (100)</div>
              </div>
            )}
            {excellentSleepDays > 0 && (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg px-4 py-2">
                <div className="text-2xl font-bold text-green-400">{excellentSleepDays}</div>
                <div className="text-[10px] text-white/50">Exzellente Nachte (90+)</div>
              </div>
            )}
          </motion.div>
        )}

        {/* Data Source & Criteria */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-4 flex flex-col items-center gap-1 text-[10px] text-white/30"
        >
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span>Daten: Garmin Sleep Score, HRV Status, Body Battery API</span>
          </div>
          <div className="max-w-sm text-center">
            Bewertung: {recoveryAssessment.criteria}
          </div>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
