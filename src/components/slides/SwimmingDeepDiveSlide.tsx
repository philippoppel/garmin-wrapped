"use client";

import { motion } from "framer-motion";
import SlideWrapper from "./SlideWrapper";
import { YearStats } from "@/lib/types/activity";
import CountingNumber from "../animations/CountingNumber";

interface SwimmingDeepDiveSlideProps {
  stats: YearStats;
}

// Animated water background with waves, bubbles, and caustic light
function WaterBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Deep water gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-cyan-900/30 to-blue-950/40" />

      {/* Animated wave layers */}
      {[0, 1, 2].map((layer) => (
        <motion.div
          key={layer}
          className="absolute w-[200%] h-32"
          style={{
            top: `${10 + layer * 8}%`,
            left: "-50%",
          }}
          animate={{
            x: layer % 2 === 0 ? [0, -100, 0] : [-100, 0, -100],
          }}
          transition={{
            duration: 8 + layer * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            viewBox="0 0 1200 120"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              d={`M0 ${30 + layer * 10} Q150 ${10 + layer * 5} 300 ${30 + layer * 10} T600 ${30 + layer * 10} T900 ${30 + layer * 10} T1200 ${30 + layer * 10} V120 H0 Z`}
              fill={`rgba(59, 130, 246, ${0.05 - layer * 0.01})`}
            />
          </svg>
        </motion.div>
      ))}

      {/* Floating bubbles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute rounded-full"
          style={{
            width: 3 + Math.random() * 8,
            height: 3 + Math.random() * 8,
            left: `${5 + Math.random() * 90}%`,
            bottom: "-20px",
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), rgba(59,130,246,0.2))`,
          }}
          animate={{
            y: [0, -600 - Math.random() * 400],
            x: [0, (Math.random() - 0.5) * 60],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Caustic light patterns */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`caustic-${i}`}
            className="absolute w-48 h-48 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, rgba(6,182,212,0.3), transparent 70%)`,
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 2) * 30}%`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Pool lane lines (subtle) */}
      <div className="absolute inset-0 flex justify-around opacity-10">
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.div
            key={`lane-${i}`}
            className="w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          />
        ))}
      </div>
    </div>
  );
}

// Animated swimmer - clean SVG
function AnimatedSwimmer() {
  return (
    <div className="relative w-full h-20 flex items-center justify-center">
      <svg viewBox="0 0 100 30" className="w-56 h-14">
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* Legs (behind body) */}
        <motion.line
          x1="25" y1="15" x2="8" y2="12"
          stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round"
          animate={{ y2: [12, 18, 12] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />
        <motion.line
          x1="25" y1="15" x2="8" y2="18"
          stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round"
          animate={{ y2: [18, 12, 18] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />

        {/* Body */}
        <ellipse cx="45" cy="15" rx="22" ry="6" fill="url(#bodyGrad)" />

        {/* Head */}
        <circle cx="70" cy="14" r="5" fill="#f97316" />

        {/* Front arm (reaching forward) */}
        <motion.path
          d="M68 12 Q80 6 90 12"
          stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" fill="none"
          animate={{ d: ["M68 12 Q80 6 90 12", "M68 12 Q80 20 90 16", "M68 12 Q80 6 90 12"] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Back arm (recovery, above body) */}
        <motion.path
          d="M68 12 Q55 2 45 8"
          stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" fill="none"
          animate={{ d: ["M68 12 Q55 2 45 8", "M68 12 Q55 22 45 18", "M68 12 Q55 2 45 8"] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </svg>

      {/* Water bubbles */}
      <div className="absolute left-1/2 -translate-x-32 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-cyan-400/50"
            animate={{ opacity: [0.5, 0], x: [-5, -20] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

// Swimmer personality based on data
function getSwimmerPersonality(
  totalKm: number,
  avgDistance: number,
  count: number,
  avgPace: number
): { title: string; description: string; color: string } {
  // Check for open water swimmer (longer average distances)
  if (avgDistance > 1.5) {
    return {
      title: "FREIWASSER-HAI",
      description: "Lange Distanzen im offenen Wasser",
      color: "from-cyan-500 to-blue-600",
    };
  }

  // Check for endurance swimmer
  if (totalKm > 50) {
    return {
      title: "DISTANZ-MASCHINE",
      description: `${totalKm.toFixed(0)}+ km im Jahr`,
      color: "from-blue-500 to-indigo-600",
    };
  }

  // Check for frequent swimmer
  if (count > 100) {
    return {
      title: "POOL-STAMMGAST",
      description: `${count}+ Einheiten pro Jahr`,
      color: "from-teal-500 to-cyan-600",
    };
  }

  // Check for speed swimmer (fast pace)
  if (avgPace < 1.8) {
    return {
      title: "SPRINT-SPEZIALIST",
      description: "Schnelle Bahnen unter 1:50/100m",
      color: "from-orange-500 to-amber-600",
    };
  }

  // Check for consistent swimmer
  if (count >= 50 && count < 100) {
    return {
      title: "REGELM. SCHWIMMER",
      description: "Konstantes Training",
      color: "from-blue-400 to-cyan-500",
    };
  }

  // Default
  return {
    title: "WASSER-ENTHUSIAST",
    description: "Schwimmen als Ausgleich",
    color: "from-sky-500 to-blue-600",
  };
}

// Pace level assessment
function getPaceLevel(paceMinPer100m: number): { level: string; color: string } {
  // Based on typical recreational to competitive swim paces
  if (paceMinPer100m < 1.5) return { level: "Elite", color: "text-yellow-400" };
  if (paceMinPer100m < 1.75) return { level: "Sehr schnell", color: "text-cyan-400" };
  if (paceMinPer100m < 2.0) return { level: "Schnell", color: "text-blue-400" };
  if (paceMinPer100m < 2.5) return { level: "Gut", color: "text-green-400" };
  if (paceMinPer100m < 3.0) return { level: "Solide", color: "text-teal-400" };
  return { level: "Entspannt", color: "text-white/70" };
}

export default function SwimmingDeepDiveSlide({ stats }: SwimmingDeepDiveSlideProps) {
  const swimming = stats.byType.swimming;

  if (!swimming || swimming.count === 0) return null;

  const totalKm = swimming.totalDistance;
  const totalMeters = totalKm * 1000;
  const totalSwims = swimming.count;
  const avgDistanceKm = swimming.avgDistance;
  const avgDistanceM = avgDistanceKm * 1000;
  const totalHours = swimming.totalDuration;

  // Calculate pace (min per 100m)
  const avgPace = totalKm > 0 ? (totalHours * 60) / (totalKm * 10) : 0;
  const paceLevel = getPaceLevel(avgPace);

  // Pool lengths (25m pool)
  const poolLengths = Math.round(totalMeters / 25);

  // Fun comparisons
  const olympicPools = totalMeters / 50;
  const channelSwims = totalKm / 34; // English Channel ~34km

  // Format pace
  const formatPace = (pace: number) => {
    const mins = Math.floor(pace);
    const secs = Math.round((pace - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const longestSwim = swimming.longestActivity;
  const personality = getSwimmerPersonality(totalKm, avgDistanceKm, totalSwims, avgPace);

  // Calculate calories per km (approx 600-800 cal per hour swimming, adjust for pace)
  const caloriesPerKm = swimming.totalCalories / totalKm;

  return (
    <SlideWrapper gradient="from-[#0a1628] via-[#0f2847] to-[#0a1628]">
      <WaterBackground />

      <div className="relative z-10 text-center w-full max-w-4xl mx-auto px-4">
        {/* Animated Swimmer at top */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-4"
        >
          <AnimatedSwimmer />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl md:text-2xl font-bold text-white mb-2"
        >
          Schwimm-Analyse {stats.year}
        </motion.h2>

        {/* Swimmer Personality Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="mb-4"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${personality.color} text-white font-bold text-sm shadow-lg`}>
            <span className="tracking-wider">{personality.title}</span>
          </div>
          <p className="text-white/50 text-xs mt-1">{personality.description}</p>
        </motion.div>

        {/* Hero Stat - Total KM */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="mb-6"
        >
          <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
            <CountingNumber value={parseFloat(totalKm.toFixed(1))} decimals={1} delay={0.5} />
            <span className="text-3xl ml-2">km</span>
          </div>
          <div className="text-white/40 text-sm">
            {totalMeters.toLocaleString("de-DE")} Meter in {totalSwims} Einheiten
          </div>
        </motion.div>

        {/* Main Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4"
        >
          {/* Pace */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
            <div className="text-white/50 text-xs mb-1">Durchschnitt</div>
            <div className="text-2xl md:text-3xl font-bold text-cyan-400">
              {formatPace(avgPace)}
            </div>
            <div className="text-xs text-white/60">min/100m</div>
            <div className={`text-xs mt-1 ${paceLevel.color}`}>{paceLevel.level}</div>
          </div>

          {/* Avg Distance */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
            <div className="text-white/50 text-xs mb-1">Pro Einheit</div>
            <div className="text-2xl md:text-3xl font-bold text-blue-400">
              {Math.round(avgDistanceM)}
            </div>
            <div className="text-xs text-white/60">Meter</div>
            <div className="text-xs text-white/40 mt-1">
              {(avgDistanceM / 25).toFixed(0)} Bahnen
            </div>
          </div>

          {/* Time */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
            <div className="text-white/50 text-xs mb-1">Im Wasser</div>
            <div className="text-2xl md:text-3xl font-bold text-teal-400">
              {Math.round(totalHours)}
            </div>
            <div className="text-xs text-white/60">Stunden</div>
            <div className="text-xs text-white/40 mt-1">
              {(totalHours / totalSwims * 60).toFixed(0)} min/Einheit
            </div>
          </div>

          {/* Sessions */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
            <div className="text-white/50 text-xs mb-1">Einheiten</div>
            <div className="text-2xl md:text-3xl font-bold text-indigo-400">
              {totalSwims}
            </div>
            <div className="text-xs text-white/60">gesamt</div>
            <div className="text-xs text-white/40 mt-1">
              {(totalSwims / 52).toFixed(1)}x pro Woche
            </div>
          </div>
        </motion.div>

        {/* Comparisons Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-3 gap-2 mb-4"
        >
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
            <div className="text-xl md:text-2xl font-bold text-blue-400">
              {Math.round(olympicPools)}x
            </div>
            <div className="text-xs text-white/50">Olympia-Becken</div>
            <div className="text-[10px] text-white/30">50m Bahnen</div>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 text-center">
            <div className="text-xl md:text-2xl font-bold text-cyan-400">
              {poolLengths.toLocaleString("de-DE")}
            </div>
            <div className="text-xs text-white/50">Pool-Bahnen</div>
            <div className="text-[10px] text-white/30">je 25m</div>
          </div>

          <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-3 text-center">
            <div className="text-xl md:text-2xl font-bold text-teal-400">
              {(totalKm / 2857 * 100).toFixed(2)}%
            </div>
            <div className="text-xs text-white/50">der Donau</div>
            <div className="text-[10px] text-white/30">2.857 km Fluss</div>
          </div>
        </motion.div>

        {/* Fun Animal Facts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap justify-center gap-2 mb-4"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
            <span className="text-base">🐬</span>
            <span className="text-white/60 text-xs">
              Ein Delphin (32 km/h) hätte deine Distanz in <span className="text-blue-400 font-bold">{Math.round(totalKm / 32 * 60)} Minuten</span> geschafft
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <span className="text-base">🦭</span>
            <span className="text-white/60 text-xs">
              Robben schwimmen ~100km/Tag – du hast <span className="text-cyan-400 font-bold">{(totalKm / 100).toFixed(1)}</span> Robben-Tage geschwommen
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20">
            <span className="text-base">🐢</span>
            <span className="text-white/60 text-xs">
              Meeresschildkröten schwimmen ~35km/Tag – das sind <span className="text-teal-400 font-bold">{(totalKm / 35).toFixed(1)}</span> Schildkröten-Tage
            </span>
          </div>
        </motion.div>

        {/* Longest Swim Highlight */}
        {longestSwim && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 border border-cyan-500/20 rounded-xl p-4"
          >
            <div className="text-white/50 text-xs mb-2">Langste Einheit</div>
            <div className="flex items-center justify-center gap-4">
              <div>
                <div className="text-3xl font-bold text-cyan-400">
                  {/* Activity.distance is in meters */}
                  {longestSwim.distance >= 1000
                    ? `${(longestSwim.distance / 1000).toFixed(2)} km`
                    : `${Math.round(longestSwim.distance)} m`}
                </div>
                <div className="text-xs text-white/50">
                  {longestSwim.name || "Schwimmeinheit"}
                </div>
              </div>
              {longestSwim.duration && (
                <div className="text-white/30">|</div>
              )}
              {longestSwim.duration && (
                <div>
                  <div className="text-xl font-bold text-white/70">
                    {/* Duration is in seconds, format as HH:MM:SS */}
                    {Math.floor(longestSwim.duration / 3600) > 0 && (
                      <>{Math.floor(longestSwim.duration / 3600)}:</>
                    )}
                    {Math.floor((longestSwim.duration % 3600) / 60).toString().padStart(2, "0")}:
                    {Math.round(longestSwim.duration % 60).toString().padStart(2, "0")}
                  </div>
                  <div className="text-xs text-white/50">Dauer</div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Data Source */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-4 flex flex-col items-center gap-1 text-[10px] text-white/30"
        >
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span>Daten: Garmin Schwimmaktivitaten (Pool + Freiwasser)</span>
          </div>
          <div>
            Tempo-Bewertung: Vergleich mit Hobby- bis Wettkampf-Schwimmern
          </div>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
