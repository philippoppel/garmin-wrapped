"use client";

import { motion } from "framer-motion";
import SlideWrapper from "./SlideWrapper";
import { YearStats } from "@/lib/types/activity";
import CountingNumber from "../animations/CountingNumber";
import { useMemo } from "react";

interface RunningDeepDiveSlideProps {
  stats: YearStats;
}

// Animated running path
function RunningPath() {
  const pathD = "M30,50 Q60,30 100,45 T170,35 Q220,25 270,40 T340,30 Q390,20 440,35 T510,25";

  return (
    <div className="w-full max-w-lg mx-auto h-20 mb-4">
      <svg viewBox="0 0 540 70" className="w-full h-full">
        <defs>
          <linearGradient id="runGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <filter id="runGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background path */}
        <path d={pathD} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" strokeLinecap="round" />

        {/* Animated path */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#runGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#runGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Running figure at the end */}
        <motion.g
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.8, duration: 0.5 }}
        >
          <motion.circle
            cx="510"
            cy="25"
            r="8"
            fill="#f97316"
            filter="url(#runGlow)"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.5 }}
          />
        </motion.g>

        {/* Footstep markers */}
        {[100, 200, 300, 400].map((x, i) => (
          <motion.circle
            key={x}
            cx={x}
            cy={45 - (i % 2) * 10}
            r="3"
            fill="rgba(249, 115, 22, 0.4)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.3 }}
          />
        ))}
      </svg>
    </div>
  );
}

// Heartbeat animation
function HeartbeatLine({ bpm }: { bpm: number }) {
  const interval = 60000 / bpm; // ms between beats

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className="text-red-500"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: interval / 1000, repeat: Infinity }}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </motion.div>
      <span className="text-red-400 font-bold">{bpm}</span>
      <span className="text-white/40 text-sm">BPM Ø</span>
    </div>
  );
}

// Get running achievement based on data
function getRunningAchievement(
  longestRun: number,
  totalKm: number,
  fastest5K?: number,
  avgPace?: number
): { title: string; subtitle: string; highlight: string } {
  // Marathon achievement (biggest!)
  if (longestRun >= 42000) {
    return {
      title: "MARATHONI",
      subtitle: "Du hast einen kompletten Marathon geschafft!",
      highlight: "42.2 km am Stück - Das schaffen nur 1% der Menschen!",
    };
  }

  // Half marathon
  if (longestRun >= 21000) {
    return {
      title: "Halbmarathon-Finisher",
      subtitle: "21.1 km - eine beeindruckende Distanz!",
      highlight: "Du gehörst zu den Top 5% der Läufer",
    };
  }

  // Sub 25 min 5K
  if (fastest5K && fastest5K < 1500) {
    return {
      title: "Speed Demon",
      subtitle: `5K in unter 25 Minuten!`,
      highlight: "Überdurchschnittlich schnell",
    };
  }

  // High volume runner
  if (totalKm >= 1000) {
    return {
      title: "Kilometersammler",
      subtitle: `${Math.round(totalKm)} km im Jahr - Wahnsinn!`,
      highlight: "Das sind über 20km pro Woche",
    };
  }

  // Consistent runner
  if (totalKm >= 500) {
    return {
      title: "Ausdauer-Held",
      subtitle: "Über 500 km im Jahr gelaufen",
      highlight: "Konstanz ist der Schlüssel zum Erfolg",
    };
  }

  return {
    title: "Läufer",
    subtitle: "Jeder Kilometer zählt",
    highlight: "Weiter so!",
  };
}

// Get distance comparison
function getDistanceComparison(km: number): string {
  if (km >= 1000) return `${(km / 876).toFixed(1)}x quer durch Deutschland`;
  if (km >= 500) return `Einmal quer durch Österreich (${Math.round(km)} km)`;
  if (km >= 300) return `Von Wien nach München und zurück`;
  if (km >= 150) return `${Math.round(km / 42.2)} Marathons`;
  return `${Math.round(km / 10)} Parkruns`;
}

// Kipchoge comparison - he runs ~12,000 km/year, marathon WR pace 2:52 min/km
function getKipchogeComparison(totalKm: number, avgPaceMinPerKm: number): { text: string; subtext: string } | null {
  // Kipchoge marathon WR pace: 2:00:35 for 42.195km = ~2.85 min/km
  const kipchogePace = 2.85;

  if (avgPaceMinPerKm > 0 && avgPaceMinPerKm < 10) {
    // On a 400m track: how many times would Kipchoge lap you during your 5K?
    const your5kTime = avgPaceMinPerKm * 5; // minutes for your 5K
    const kipchogeDistanceKm = your5kTime / kipchogePace; // km Kipchoge runs in your 5K time

    // Number of 400m laps each person completes
    const yourLaps = 5 / 0.4; // 12.5 laps
    const kipchogeLaps = kipchogeDistanceKm / 0.4;

    // How many times does he pass you (lap you)?
    const timesLapped = Math.floor(kipchogeLaps - yourLaps);

    if (timesLapped >= 1) {
      return {
        text: `${timesLapped}×`,
        subtext: "hätte Kipchoge dich überrundet"
      };
    }
  }

  // Fallback: percentage of Kipchoge's yearly km
  const kipchogeYearlyKm = 12000;
  const percentOfKipchoge = (totalKm / kipchogeYearlyKm) * 100;

  return {
    text: `${percentOfKipchoge.toFixed(1)}%`,
    subtext: "von Kipchoges Jahres-km"
  };
}

// Animal speed comparison - returns what animal you're closest to
function getAnimalComparison(avgPaceMinPerKm: number): { emoji: string; animal: string; text: string } | null {
  if (avgPaceMinPerKm <= 0 || avgPaceMinPerKm > 15) return null;

  const speedKmh = 60 / avgPaceMinPerKm;

  // Animals with their top speeds (using sustainable speeds for comparison)
  if (speedKmh >= 20) return { emoji: "🐕", animal: "Hund", text: "So schnell wie ein trabender Hund" };
  if (speedKmh >= 15) return { emoji: "🐘", animal: "Elefant", text: "Schneller als ein Elefant (15 km/h)" };
  if (speedKmh >= 12) return { emoji: "🐖", animal: "Wildschwein", text: "Auf Augenhöhe mit einem Wildschwein" };
  if (speedKmh >= 10) return { emoji: "🐔", animal: "Huhn", text: "Schneller als ein rennendes Huhn" };
  if (speedKmh >= 6) return { emoji: "🐢", animal: "Maus", text: "Schneller als eine Maus (8 km/h)" };
  return { emoji: "🚶", animal: "Mensch", text: "Gemütliches Jogging-Tempo" };
}

export default function RunningDeepDiveSlide({ stats }: RunningDeepDiveSlideProps) {
  const running = stats.byType.running;

  if (!running || running.count === 0) return null;

  const totalKm = running.totalDistance;
  const totalRuns = running.count;
  const totalHours = running.totalDuration;
  const avgPace = totalHours > 0 ? (totalHours * 60) / totalKm : 0;

  const fastest5K = stats.records?.fastest5K;
  const longestRun = running.longestActivity;
  const longestRunDistance = longestRun?.distance || 0;

  // Calculate avg heart rate if available
  const avgHR = useMemo(() => {
    // This would come from activity data - estimate based on pace
    const estimatedHR = Math.round(140 + (avgPace - 5) * 5);
    return Math.min(180, Math.max(120, estimatedHR));
  }, [avgPace]);

  const achievement = getRunningAchievement(
    longestRunDistance,
    totalKm,
    fastest5K?.time,
    avgPace
  );

  const distanceComparison = getDistanceComparison(totalKm);
  const marathons = (totalKm / 42.195).toFixed(1);
  const kipchogeComp = getKipchogeComparison(totalKm, avgPace);
  const animalComp = getAnimalComparison(avgPace);

  const formatPace = (pace: number) => {
    const mins = Math.floor(pace);
    const secs = Math.round((pace - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Is this a marathon achievement?
  const isMarathon = longestRunDistance >= 42000;

  return (
    <SlideWrapper gradient="from-[#1a0f0a] via-[#2d1810] to-[#1a0f0a]">
      <div className="text-center w-full max-w-4xl mx-auto px-4">
        {/* Animated Running Path */}
        <RunningPath />

        {/* Achievement Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", bounce: 0.4 }}
          className="mb-4 md:mb-6"
        >
          {isMarathon ? (
            // Special marathon celebration
            <div className="relative inline-block">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 rounded-full blur-xl opacity-50"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="relative bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-black font-black text-lg sm:text-2xl md:text-3xl px-5 py-2 md:px-8 md:py-3 rounded-full">
                {achievement.title}
              </div>
            </div>
          ) : (
            <div className="inline-block bg-orange-500/20 border border-orange-500/40 px-4 py-1.5 md:px-6 md:py-2 rounded-full">
              <span className="text-orange-400 font-bold text-sm md:text-lg">{achievement.title}</span>
            </div>
          )}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/60 text-xs md:text-sm mt-1.5 md:mt-2"
          >
            {achievement.subtitle}
          </motion.p>
        </motion.div>

        {/* Hero Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-4 md:mb-6"
        >
          <div className="flex items-baseline justify-center gap-1">
            <CountingNumber
              value={Math.round(totalKm)}
              className="text-5xl sm:text-6xl md:text-8xl font-black bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent"
              duration={2}
              delay={0.5}
            />
            <span className="text-xl sm:text-2xl md:text-3xl text-orange-400/60 font-light">km</span>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-white/50 text-xs md:text-sm mt-1"
          >
            {distanceComparison}
          </motion.p>
        </motion.div>

        {/* Key Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-4 gap-2 md:flex md:flex-wrap md:justify-center md:gap-6 mb-4 md:mb-6"
        >
          {/* Runs */}
          <div className="text-center">
            <div className="text-xl sm:text-2xl md:text-4xl font-bold text-white">
              <CountingNumber value={totalRuns} delay={0.9} />
            </div>
            <div className="text-white/40 text-[10px] md:text-sm">Läufe</div>
          </div>

          {/* Avg Pace */}
          <div className="text-center">
            <div className="text-xl sm:text-2xl md:text-4xl font-bold text-orange-400">
              {formatPace(avgPace)}
            </div>
            <div className="text-white/40 text-[10px] md:text-sm">min/km</div>
          </div>

          {/* Total Time */}
          <div className="text-center">
            <div className="text-xl sm:text-2xl md:text-4xl font-bold text-white">
              {Math.round(totalHours)}h
            </div>
            <div className="text-white/40 text-[10px] md:text-sm">Laufzeit</div>
          </div>

          {/* Marathons equivalent */}
          <div className="text-center">
            <div className="text-xl sm:text-2xl md:text-4xl font-bold text-amber-400">
              {marathons}x
            </div>
            <div className="text-white/40 text-[10px] md:text-sm">Marathons</div>
          </div>
        </motion.div>

        {/* Records Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex flex-wrap justify-center gap-2 md:gap-3"
        >
          {fastest5K && (
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl md:rounded-2xl px-3 py-2 md:px-5 md:py-3">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-base md:text-xl font-bold text-yellow-400">{formatTime(fastest5K.time)}</div>
                  <div className="text-[10px] md:text-xs text-white/50">Schnellste 5K</div>
                </div>
              </div>
            </div>
          )}

          {longestRun && (
            <div className={`${isMarathon ? "bg-gradient-to-br from-orange-500/30 to-red-500/30 border-orange-500/50" : "bg-orange-500/20 border-orange-500/30"} border rounded-xl md:rounded-2xl px-3 py-2 md:px-5 md:py-3`}>
              <div className="flex items-center gap-2 md:gap-3">
                <div className={`w-8 h-8 md:w-10 md:h-10 ${isMarathon ? "bg-orange-500/50" : "bg-orange-500/30"} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-base md:text-xl font-bold text-orange-400">
                    {(longestRun.distance / 1000).toFixed(1)} km
                  </div>
                  <div className="text-[10px] md:text-xs text-white/50">
                    {isMarathon ? "Marathon!" : "Längster Lauf"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Fun Comparisons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="flex flex-wrap justify-center gap-2 md:gap-3 mt-4"
        >
          {kipchogeComp && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20">
              <span className="text-base">🏃</span>
              <span className="text-orange-400 font-bold text-sm">{kipchogeComp.text}</span>
              <span className="text-white/40 text-xs">{kipchogeComp.subtext}</span>
            </div>
          )}
          {animalComp && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="text-base">{animalComp.emoji}</span>
              <span className="text-white/60 text-xs">{animalComp.text}</span>
            </div>
          )}
        </motion.div>

        {/* Fun Fact Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-3 md:mt-4"
        >
          <p className="text-white/40 text-xs md:text-sm">
            {Math.round(totalHours)} Stunden = {(totalHours / 24).toFixed(1)} Tage non-stop laufen
          </p>
        </motion.div>

        {/* Data Source Attribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7 }}
          className="mt-3 flex items-center justify-center gap-2 text-[10px] text-white/30"
        >
          <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <span>Daten: Garmin Laufaktivitaten ({totalRuns} Laufe, inkl. Multisport-Segmente)</span>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
