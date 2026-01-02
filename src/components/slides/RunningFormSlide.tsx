"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import SlideWrapper from "./SlideWrapper";
import { YearStats } from "@/lib/types/activity";

interface RunningFormSlideProps {
  stats: YearStats;
}

// Animated running figure SVG
function AnimatedRunner() {
  return (
    <div className="w-16 h-16">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="runnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        {/* Head */}
        <motion.circle
          cx="50"
          cy="20"
          r="8"
          fill="url(#runnerGradient)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        />
        {/* Body */}
        <motion.path
          d="M50 28 L50 55"
          stroke="url(#runnerGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        />
        {/* Arms */}
        <motion.path
          d="M50 35 L35 50 M50 35 L65 28"
          stroke="url(#runnerGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        />
        {/* Legs */}
        <motion.path
          d="M50 55 L35 80 M50 55 L65 75"
          stroke="url(#runnerGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        />
        {/* Motion lines */}
        {[0, 1, 2].map((i) => (
          <motion.line
            key={i}
            x1={15 - i * 5}
            y1={40 + i * 10}
            x2={25 - i * 5}
            y2={40 + i * 10}
            stroke="rgba(249, 115, 22, 0.4)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: [0, 0.8, 0], x: [10, 0, -10] }}
            transition={{ delay: 0.8 + i * 0.1, duration: 1, repeat: Infinity, repeatDelay: 1 }}
          />
        ))}
      </svg>
    </div>
  );
}

// Circular gauge component
function CircularGauge({ value, max = 100, color, size = 140 }: { value: number; max?: number; color: string; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="10"
      />
      {/* Progress circle */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference * (1 - progress) }}
        transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      />
    </svg>
  );
}

// Metric card with visual indicator
function MetricCard({
  label,
  value,
  unit,
  rating,
  ratingColor,
  icon,
  optimalRange,
  delay,
}: {
  label: string;
  value: number;
  unit: string;
  rating: string;
  ratingColor: string;
  icon: React.ReactNode;
  optimalRange: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/5 border border-white/10 rounded-2xl p-4 relative overflow-hidden"
    >
      {/* Animated gradient bar at top based on rating */}
      <motion.div
        className={`absolute top-0 left-0 right-0 h-1 ${
          ratingColor.includes("green") ? "bg-gradient-to-r from-green-500 to-emerald-400" :
          ratingColor.includes("blue") ? "bg-gradient-to-r from-blue-500 to-cyan-400" :
          ratingColor.includes("yellow") ? "bg-gradient-to-r from-yellow-500 to-amber-400" :
          "bg-gradient-to-r from-orange-500 to-red-400"
        }`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.5 }}
        style={{ transformOrigin: "left" }}
      />

      <div className="flex items-start justify-between mb-2">
        <div className="text-white/60">{icon}</div>
        <div className={`text-xs px-2 py-0.5 rounded-full ${
          ratingColor.includes("green") ? "bg-green-500/20 text-green-400" :
          ratingColor.includes("blue") ? "bg-blue-500/20 text-blue-400" :
          ratingColor.includes("yellow") ? "bg-yellow-500/20 text-yellow-400" :
          "bg-orange-500/20 text-orange-400"
        }`}>
          {rating}
        </div>
      </div>

      <div className="text-xs text-white/40 mb-1">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-white">{value}</span>
        <span className="text-sm text-white/50">{unit}</span>
      </div>

      <div className="text-[10px] text-white/30 mt-2">
        Optimal: {optimalRange}
      </div>
    </motion.div>
  );
}

// SVG icons for metrics
const icons = {
  groundContact: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 19v2M5 12a7 7 0 0114 0M8 15h8" strokeLinecap="round" />
    </svg>
  ),
  oscillation: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12h4l3-9 6 18 3-9h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  cadence: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" strokeLinecap="round" />
    </svg>
  ),
  stride: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12h16M4 12l4-4M4 12l4 4M20 12l-4-4M20 12l-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export default function RunningFormSlide({ stats }: RunningFormSlideProps) {
  const form = stats.runningFormAnalytics;

  if (!form || !form.hasData) {
    return null;
  }

  // Get efficiency level - score is calculated from GCT, VO, and Cadence
  // Base score 50, +15 each for elite GCT (<240ms), VO (<8cm), Cadence (180+)
  const getEfficiencyLevel = (score: number) => {
    if (score >= 80) return { label: "Elite", color: "text-green-400", gradient: "from-green-500 to-emerald-400" };
    if (score >= 65) return { label: "Sehr gut", color: "text-emerald-400", gradient: "from-emerald-500 to-teal-400" };
    if (score >= 50) return { label: "Gut", color: "text-blue-400", gradient: "from-blue-500 to-cyan-400" };
    return { label: "Entwicklung", color: "text-orange-400", gradient: "from-orange-500 to-amber-400" };
  };

  const efficiencyLevel = getEfficiencyLevel(form.efficiencyScore);

  // Get trend info
  const getTrendInfo = () => {
    if (form.trend === "improving") {
      return { icon: TrendingUp, color: "text-green-400", label: "Verbessert" };
    } else if (form.trend === "declining") {
      return { icon: TrendingDown, color: "text-red-400", label: "Rückgang" };
    }
    return { icon: Minus, color: "text-white/50", label: "Stabil" };
  };

  const trendInfo = getTrendInfo();
  const TrendIcon = trendInfo.icon;

  // Rating helpers with proper rounding
  // Sources: Garmin Connect thresholds, research by Heiderscheit et al. (2011), Jack Daniels' Running Formula

  // GCT: Elite marathoners ~180-200ms, recreational 250-300ms
  // Garmin: Excellent <208ms, Good <241ms, Fair <273ms
  const getGCTRating = (gct: number) => {
    if (gct < 220) return { label: "Elite", color: "text-green-400" };    // Elite Marathoner
    if (gct < 250) return { label: "Gut", color: "text-blue-400" };       // Trained runner
    if (gct < 280) return { label: "OK", color: "text-yellow-400" };      // Recreational
    return { label: "Lang", color: "text-orange-400" };
  };

  // VO: Elite <6cm, Good <8cm - Lower is more efficient (less energy wasted vertically)
  // Garmin: Excellent <6.7cm, Good <8.3cm, Fair <10.0cm
  const getVORating = (vo: number) => {
    if (vo < 7) return { label: "Effizient", color: "text-green-400" };   // Elite
    if (vo < 9) return { label: "Gut", color: "text-blue-400" };          // Good
    if (vo < 10.5) return { label: "OK", color: "text-yellow-400" };      // Fair
    return { label: "Hoch", color: "text-orange-400" };
  };

  // Cadence: 180 SPM from Jack Daniels' research on elite runners
  // Note: Optimal cadence increases with speed - 180 is baseline for easy pace
  const getCadenceRating = (cadence: number) => {
    if (cadence >= 180) return { label: "Optimal", color: "text-green-400" };
    if (cadence >= 170) return { label: "Gut", color: "text-blue-400" };
    if (cadence >= 160) return { label: "OK", color: "text-yellow-400" };
    return { label: "Niedrig", color: "text-orange-400" };
  };

  // Stride length: Highly individual, depends on height and speed
  // Typical range: 1.0-1.5m at race pace, shorter at easy pace
  const getStrideRating = (stride: number) => {
    if (stride >= 100 && stride <= 140) return { label: "Typisch", color: "text-green-400" };
    if (stride >= 85 && stride <= 160) return { label: "OK", color: "text-blue-400" };
    return { label: "Atypisch", color: "text-yellow-400" };
  };

  // Safe number formatting
  const formatNumber = (num: number | null | undefined, decimals: number = 0): number => {
    if (num === undefined || num === null) return 0;
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  };

  const avgGCT = formatNumber(form.avgGroundContactTime);
  const avgVO = formatNumber(form.avgVerticalOscillation, 1);
  const avgCadence = formatNumber(form.avgCadence);
  const avgStride = formatNumber(form.avgStrideLength, 2);
  const bestGCT = formatNumber(form.bestGroundContactTime);
  const bestVO = formatNumber(form.bestVerticalOscillation, 1);
  const bestCadence = formatNumber(form.bestCadence);

  return (
    <SlideWrapper gradient="from-[#1a0a0a] via-[#2a1515] to-[#1a0a0a]">
      <div className="text-center w-full max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <AnimatedRunner />
          <div className="text-left">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl md:text-2xl font-bold text-white"
            >
              Running Dynamics
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/50 text-sm"
            >
              Analyse aus {form.dataPoints} Läufen
            </motion.p>
          </div>
        </div>

        {/* Main Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative inline-block mb-2"
        >
          <CircularGauge
            value={form.efficiencyScore}
            max={100}
            color={form.efficiencyScore >= 65 ? "#10b981" : form.efficiencyScore >= 50 ? "#3b82f6" : "#f97316"}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-5xl font-black text-white"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
            >
              {form.efficiencyScore}
            </motion.span>
            <span className={`text-sm font-medium ${efficiencyLevel.color}`}>{efficiencyLevel.label}</span>
          </div>
        </motion.div>

        {/* Score explanation */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[10px] text-white/30 mb-3"
        >
          Effizienz-Score (Basis 50 + Bonuspunkte fur GCT/VO/Kadenz)
        </motion.p>

        {/* Trend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mb-5"
        >
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <TrendIcon className={`w-4 h-4 ${trendInfo.color}`} />
            <span className={`text-sm ${trendInfo.color}`}>{trendInfo.label}</span>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {form.avgGroundContactTime !== undefined && avgGCT > 0 && (
            <MetricCard
              label="Bodenkontakt"
              value={avgGCT}
              unit="ms"
              rating={getGCTRating(avgGCT).label}
              ratingColor={getGCTRating(avgGCT).color}
              icon={icons.groundContact}
              optimalRange="Elite < 240ms"
              delay={0.6}
            />
          )}
          {form.avgVerticalOscillation !== undefined && avgVO > 0 && (
            <MetricCard
              label="Oszillation"
              value={avgVO}
              unit="cm"
              rating={getVORating(avgVO).label}
              ratingColor={getVORating(avgVO).color}
              icon={icons.oscillation}
              optimalRange="Elite < 8cm"
              delay={0.7}
            />
          )}
          {form.avgCadence !== undefined && avgCadence > 0 && (
            <MetricCard
              label="Kadenz"
              value={avgCadence}
              unit="SPM"
              rating={getCadenceRating(avgCadence).label}
              ratingColor={getCadenceRating(avgCadence).color}
              icon={icons.cadence}
              optimalRange="Elite 180+ SPM"
              delay={0.8}
            />
          )}
          {form.avgStrideLength !== undefined && avgStride > 0 && (
            <MetricCard
              label="Schrittlange"
              value={avgStride}
              unit="cm"
              rating={getStrideRating(avgStride).label}
              ratingColor={getStrideRating(avgStride).color}
              icon={icons.stride}
              optimalRange="Pace-abhangig"
              delay={0.9}
            />
          )}
        </div>

        {/* Best Values */}
        {(bestGCT > 0 || bestVO > 0 || bestCadence > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-4"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-green-400" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <span className="text-sm font-medium text-green-400">Persönliche Bestleistungen</span>
            </div>
            <div className="flex justify-center gap-6 flex-wrap">
              {bestGCT > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{bestGCT}</div>
                  <div className="text-xs text-white/50">ms Bodenkontakt</div>
                </div>
              )}
              {bestVO > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{bestVO}</div>
                  <div className="text-xs text-white/50">cm Oszillation</div>
                </div>
              )}
              {bestCadence > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{bestCadence}</div>
                  <div className="text-xs text-white/50">SPM Kadenz</div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Data Source Attribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-4 space-y-1"
        >
          <div className="flex items-center justify-center gap-2 text-[10px] text-white/30">
            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span>Daten: Garmin Running Dynamics (HRM-Pro/Run oder Running Pod) | {form.dataPoints} Läufe</span>
          </div>
          <div className="text-[9px] text-white/20 text-center px-4">
            Schwellwerte: Garmin Connect + Jack Daniels&apos; Running Formula (Kadenz 180) +
            Heiderscheit et al. 2011 (GCT/Stride) | Werte variieren mit Tempo
          </div>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
