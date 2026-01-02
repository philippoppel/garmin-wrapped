"use client";

import { motion } from "framer-motion";
import SlideWrapper, { AnimatedLine } from "./SlideWrapper";
import { YearStats } from "@/lib/types/activity";
import PulsingHeart, { EKGLine } from "../animations/PulsingHeart";
import CountingNumber from "../animations/CountingNumber";

interface HeartRateSlideProps {
  stats: YearStats;
}

// Animated blood vessel background
function BloodVesselBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Pulsing gradient waves */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at ${30 + i * 20}% ${40 + i * 10}%, rgba(255,71,87,${0.08 - i * 0.02}), transparent 50%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Flowing blood cells */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`cell-${i}`}
          className="absolute rounded-full"
          style={{
            width: 4 + Math.random() * 6,
            height: 4 + Math.random() * 6,
            left: `${Math.random() * 100}%`,
            top: "-10px",
            background: `radial-gradient(circle, rgba(255,71,87,0.6), rgba(200,50,70,0.3))`,
          }}
          animate={{
            y: [0, 800],
            x: [0, (Math.random() - 0.5) * 100],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: "linear",
          }}
        />
      ))}

      {/* Subtle vein lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <linearGradient id="veinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4757" stopOpacity="0" />
            <stop offset="50%" stopColor="#ff4757" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ff4757" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2].map((i) => (
          <motion.path
            key={`vein-${i}`}
            d={`M${-50 + i * 100} 0 Q${100 + i * 80} ${200 + i * 50} ${50 + i * 120} 400 Q${150 + i * 60} 600 ${100 + i * 100} 800`}
            stroke="url(#veinGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 3, delay: i * 0.5 }}
          />
        ))}
      </svg>
    </div>
  );
}

// Animal heart rate comparison
function getAnimalHeartComparison(restingHR: number): { emoji: string; animal: string; text: string } | null {
  if (!restingHR || restingHR <= 0) return null;

  // Animal resting heart rates
  if (restingHR <= 45) return { emoji: "🐘", animal: "Elefant", text: "Ruhepuls wie ein Elefant (30-40 bpm)" };
  if (restingHR <= 55) return { emoji: "🦁", animal: "Löwe", text: "Entspannt wie ein Löwe (40-50 bpm)" };
  if (restingHR <= 65) return { emoji: "🐕", animal: "Hund", text: "Ruhig wie ein entspannter Hund" };
  if (restingHR <= 75) return { emoji: "🐱", animal: "Katze", text: "Gelassen wie eine Katze (60-80 bpm)" };
  if (restingHR <= 90) return { emoji: "🐰", animal: "Hase", text: "Lebhaft wie ein Kaninchen (80-100 bpm)" };
  return { emoji: "🐹", animal: "Hamster", text: "Energetisch wie ein kleines Nagetier" };
}

// Fun heart facts
function getHeartFunFact(totalHeartbeats: number, restingHR: number): string | null {
  if (totalHeartbeats > 0) {
    // Whale heart beats ~6 times per minute
    const whaleMinutes = totalHeartbeats / 6;
    if (whaleMinutes > 60) {
      return `Ein Blauwalherz (6 bpm) bräuchte ${Math.round(whaleMinutes / 60)} Stunden für so viele Schläge`;
    }
  }
  if (restingHR && restingHR < 60) {
    return "Dein Ruhepuls ist niedriger als der Durchschnitt (60-100 bpm)";
  }
  return null;
}

// Heart fitness level based on resting HR
function getHeartFitnessLevel(restingHR: number): {
  level: string;
  description: string;
  color: string;
  gradient: string;
  range: string;
} {
  // Based on American Heart Association guidelines
  if (restingHR < 50) {
    return {
      level: "TOP 1%",
      description: "Ausdauersportler-Niveau",
      color: "text-yellow-400",
      gradient: "from-yellow-500 to-amber-600",
      range: "<50 bpm",
    };
  }
  if (restingHR < 60) {
    return {
      level: "SEHR FIT",
      description: "Gut trainiert",
      color: "text-green-400",
      gradient: "from-green-500 to-emerald-600",
      range: "50-59 bpm",
    };
  }
  if (restingHR < 70) {
    return {
      level: "FIT",
      description: "Uberdurchschnittlich",
      color: "text-cyan-400",
      gradient: "from-cyan-500 to-blue-600",
      range: "60-69 bpm",
    };
  }
  if (restingHR < 80) {
    return {
      level: "NORMAL",
      description: "Durchschnittlich",
      color: "text-blue-400",
      gradient: "from-blue-500 to-indigo-600",
      range: "70-79 bpm",
    };
  }
  return {
    level: "AUSBAUFAHIG",
    description: "Potenzial vorhanden",
    color: "text-purple-400",
    gradient: "from-purple-500 to-pink-600",
    range: "80+ bpm",
  };
}

// Age-based max HR estimation (220 - age formula)
function estimateMaxHR(age: number = 30): number {
  return 220 - age;
}

export default function HeartRateSlide({ stats }: HeartRateSlideProps) {
  // Use real data if available
  const hasRealHRData = stats.healthStats?.avgRestingHeartRate !== null &&
                        stats.healthStats?.avgRestingHeartRate !== undefined;
  const avgRestingHR = hasRealHRData ? stats.healthStats!.avgRestingHeartRate! : null;

  // Skip slide if no meaningful heart rate data available
  const hasAnyHRData = hasRealHRData ||
                       stats.healthStats?.totalHeartbeats ||
                       stats.healthStats?.avgTrainingHR ||
                       stats.healthStats?.maxTrainingHR;

  // If no HR data at all and very little training time, skip this slide
  if (!hasAnyHRData && stats.totalDuration < 5) {
    return null;
  }

  // Use totalHeartbeats from API (calculated from actual activity HR data)
  const totalHeartbeats = stats.healthStats?.totalHeartbeats || Math.round(stats.totalDuration * 60 * 140);
  const millionHeartbeats = totalHeartbeats / 1000000;

  // Get max heart rate from records
  const maxHRRecord = stats.records?.highestHeartRate;
  const maxHR = maxHRRecord?.value || stats.healthStats?.maxTrainingHR || null;

  // Get average training HR
  const avgTrainingHR = stats.healthStats?.avgTrainingHR || null;
  const activitiesWithHR = stats.healthStats?.activitiesWithHR || 0;

  // Calculate HR Reserve (fitness indicator)
  const hrReserve = (maxHR && avgRestingHR) ? maxHR - avgRestingHR : null;

  // Get fitness level
  const fitnessLevel = avgRestingHR ? getHeartFitnessLevel(avgRestingHR) : null;

  // Fun comparisons
  const animalComp = avgRestingHR ? getAnimalHeartComparison(avgRestingHR) : null;
  const heartFunFact = getHeartFunFact(totalHeartbeats, avgRestingHR || 0);

  return (
    <SlideWrapper gradient="from-[#1a0a1e] via-[#2d0a28] to-[#1a0a1e]">
      <BloodVesselBackground />

      <div className="relative z-10 text-center w-full max-w-4xl mx-auto px-4">
        {/* EKG Line at top */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-4"
        >
          <EKGLine width={350} height={60} color="#ff4757" />
        </motion.div>

        <AnimatedLine className="text-white/50 text-base md:text-lg mb-2">
          Dein Herz hat
        </AnimatedLine>

        {/* Big pulsing heart */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", bounce: 0.4 }}
          className="flex justify-center my-4"
        >
          <PulsingHeart size={80} bpm={avgRestingHR || 70} />
        </motion.div>

        {/* Heartbeats number */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-2"
        >
          <CountingNumber
            value={millionHeartbeats}
            decimals={1}
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-white"
            delay={0.6}
          />
          <span className="text-2xl sm:text-3xl md:text-4xl text-white/70 ml-1 md:ml-2">Mio.</span>
        </motion.div>

        <AnimatedLine delay={0.8} className="text-lg md:text-2xl text-white mb-2">
          mal beim Training geschlagen
        </AnimatedLine>

        {/* Fitness Level Badge */}
        {fitnessLevel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, type: "spring" }}
            className="mb-6"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${fitnessLevel.gradient} text-white font-bold text-sm shadow-lg`}>
              <span className="tracking-wider">{fitnessLevel.level}</span>
            </div>
            <p className="text-white/50 text-xs mt-1">
              {fitnessLevel.description} (Ruhepuls {fitnessLevel.range})
            </p>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto"
        >
          {/* Resting HR */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
            <div className="text-white/50 text-xs mb-1">Ruhepuls</div>
            <div className="text-2xl md:text-3xl font-bold text-red-400">
              {avgRestingHR !== null ? avgRestingHR : "—"}
            </div>
            <div className="text-xs text-white/60">bpm</div>
            <div className="text-[10px] text-white/40 mt-1">im Schlaf</div>
          </div>

          {/* Avg Training HR */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
            <div className="text-white/50 text-xs mb-1">Training</div>
            <div className="text-2xl md:text-3xl font-bold text-orange-400">
              {avgTrainingHR !== null ? avgTrainingHR : "—"}
            </div>
            <div className="text-xs text-white/60">bpm Schnitt</div>
            {activitiesWithHR > 0 && (
              <div className="text-[10px] text-white/40 mt-1">
                {activitiesWithHR} Aktivitaten
              </div>
            )}
          </div>

          {/* Max HR */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
            <div className="text-white/50 text-xs mb-1">Max HR</div>
            <div className="text-2xl md:text-3xl font-bold text-pink-400">
              {maxHR !== null ? maxHR : "—"}
            </div>
            <div className="text-xs text-white/60">bpm</div>
            {maxHRRecord?.activity && (
              <div className="text-[10px] text-white/40 mt-1 truncate">
                {(maxHRRecord.activity as any).name?.substring(0, 12) || "Aktivitat"}
              </div>
            )}
          </div>

          {/* Active Time */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
            <div className="text-white/50 text-xs mb-1">Aktiv</div>
            <div className="text-2xl md:text-3xl font-bold text-purple-400">
              {Math.round(stats.totalDuration)}
            </div>
            <div className="text-xs text-white/60">Stunden</div>
            <div className="text-[10px] text-white/40 mt-1">
              {(stats.totalDuration / 52).toFixed(1)}h pro Woche
            </div>
          </div>
        </motion.div>

        {/* Heart Rate Zones Explanation */}
        {avgRestingHR && maxHR && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4 max-w-lg mx-auto"
          >
            <div className="text-white/50 text-xs mb-2">Deine Herzfrequenz-Spanne</div>
            <div className="flex items-center justify-between gap-2">
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">{avgRestingHR}</div>
                <div className="text-[10px] text-white/50">Ruhe</div>
              </div>
              <div className="flex-1 h-2 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500 rounded-full mx-2" />
              <div className="text-center">
                <div className="text-lg font-bold text-red-400">{maxHR}</div>
                <div className="text-[10px] text-white/50">Max</div>
              </div>
            </div>
            <div className="text-center text-white/60 text-xs mt-2">
              Spanne: {hrReserve} bpm ({Math.round((avgTrainingHR || 0) / maxHR * 100)}% Auslastung beim Training)
            </div>
          </motion.div>
        )}

        {/* Fun Comparisons */}
        {(animalComp || heartFunFact) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="flex flex-wrap justify-center gap-2 mt-4"
          >
            {animalComp && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20">
                <span className="text-base">{animalComp.emoji}</span>
                <span className="text-white/60 text-xs">{animalComp.text}</span>
              </div>
            )}
            {heartFunFact && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <span className="text-base">🐋</span>
                <span className="text-white/50 text-xs">{heartFunFact}</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Data Source Attribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-4 flex flex-col items-center gap-1 text-[10px] text-white/30"
        >
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span>Daten: Garmin HR-Sensor (Aktivitaten) + Health Stats API (Ruhepuls)</span>
          </div>
          <div>
            Fitness-Kategorien: American Heart Association (Normal: 60-100 bpm, Sportler: 40-60 bpm)
          </div>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
