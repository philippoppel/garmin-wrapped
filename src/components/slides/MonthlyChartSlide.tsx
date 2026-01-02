"use client";

import { motion } from "framer-motion";
import SlideWrapper, { AnimatedLine } from "./SlideWrapper";
import { YearStats } from "@/lib/types/activity";
import CountingNumber from "../animations/CountingNumber";

interface MonthlyChartSlideProps {
  stats: YearStats;
}

const MONTH_LABELS = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

const seasonThemes: Record<string, { gradient: string; glow: string }> = {
  Winter: {
    gradient: "from-[#0a1929] via-[#102a4a] to-[#1a3a5c]",
    glow: "rgba(147,197,253,0.3)",
  },
  Frühling: {
    gradient: "from-[#0f2818] via-[#1a3d25] to-[#0d2214]",
    glow: "rgba(74,222,128,0.3)",
  },
  Sommer: {
    gradient: "from-[#2d1810] via-[#3d2415] to-[#4a2c12]",
    glow: "rgba(251,191,36,0.4)",
  },
  Herbst: {
    gradient: "from-[#2a1a0a] via-[#3d2510] to-[#1f1408]",
    glow: "rgba(251,146,60,0.35)",
  },
};

function SeasonBackdrop({ season }: { season: string }) {
  if (season === "Winter") {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Hellblauer Hintergrund-Schimmer */}
        <motion.div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(147,197,253,0.15) 0%, transparent 50%, rgba(186,230,253,0.1) 100%)" }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Frostiger Glanz oben */}
        <motion.div
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(186,230,253,0.25), transparent 60%)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Schneeflocken */}
        {Array.from({ length: 45 }).map((_, i) => (
          <motion.svg
            key={`snow-${i}`}
            viewBox="0 0 24 24"
            className="absolute text-white"
            style={{
              width: 8 + (i % 4) * 5,
              height: 8 + (i % 4) * 5,
              left: `${(i * 2.3) % 100}%`,
              top: -20,
              filter: "drop-shadow(0 0 3px rgba(255,255,255,0.5))",
            }}
            animate={{
              y: [0, 800],
              x: [0, i % 2 === 0 ? 40 : -40, i % 3 === 0 ? -20 : 20],
              rotate: [0, 180, 360],
              opacity: [0, 0.9, 0.9, 0]
            }}
            transition={{
              duration: 12 + i * 0.3,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.25,
              times: [0, 0.1, 0.9, 1]
            }}
          >
            <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none">
              <path d="M12 2v20" />
              <path d="M2 12h20" />
              <path d="M4.5 4.5l15 15" />
              <path d="M19.5 4.5l-15 15" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </g>
          </motion.svg>
        ))}
        {/* Glitzernde Partikel */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${(i * 5) % 100}%`,
              top: `${(i * 7) % 100}%`,
              boxShadow: "0 0 4px rgba(255,255,255,0.8)",
            }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 2 + i * 0.1, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
          />
        ))}
      </div>
    );
  }

  if (season === "Sommer") {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Haupt-Lichtquelle oben rechts */}
        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,250,220,0.4) 0%, rgba(251,191,36,0.2) 30%, transparent 70%)",
            filter: "blur(2px)",
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Große Bokeh-Kreise */}
        {[
          { size: 180, x: "15%", y: "20%", color: "rgba(251,191,36,0.15)", delay: 0 },
          { size: 120, x: "75%", y: "60%", color: "rgba(255,220,120,0.12)", delay: 0.5 },
          { size: 200, x: "60%", y: "15%", color: "rgba(251,191,36,0.1)", delay: 1 },
          { size: 90, x: "25%", y: "70%", color: "rgba(255,200,100,0.18)", delay: 1.5 },
          { size: 150, x: "85%", y: "35%", color: "rgba(251,191,36,0.12)", delay: 0.8 },
          { size: 100, x: "40%", y: "85%", color: "rgba(255,230,150,0.15)", delay: 2 },
        ].map((bokeh, i) => (
          <motion.div
            key={`bokeh-${i}`}
            className="absolute rounded-full"
            style={{
              width: bokeh.size,
              height: bokeh.size,
              left: bokeh.x,
              top: bokeh.y,
              background: `radial-gradient(circle, ${bokeh.color} 0%, transparent 70%)`,
              filter: "blur(1px)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 5 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: bokeh.delay,
            }}
          />
        ))}

        {/* Lens Flare Streifen - diagonal */}
        <motion.div
          className="absolute top-0 right-0 w-full h-full"
          style={{
            background: "linear-gradient(135deg, transparent 30%, rgba(255,250,220,0.08) 45%, rgba(251,191,36,0.05) 50%, transparent 60%)",
          }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Kleine helle Lens Flare Punkte */}
        {[
          { x: "70%", y: "25%", size: 8 },
          { x: "55%", y: "40%", size: 5 },
          { x: "80%", y: "50%", size: 6 },
          { x: "45%", y: "30%", size: 4 },
          { x: "65%", y: "65%", size: 7 },
          { x: "30%", y: "45%", size: 5 },
          { x: "85%", y: "20%", size: 6 },
        ].map((flare, i) => (
          <motion.div
            key={`flare-${i}`}
            className="absolute rounded-full"
            style={{
              width: flare.size,
              height: flare.size,
              left: flare.x,
              top: flare.y,
              background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,250,200,0.6) 40%, transparent 70%)",
              boxShadow: "0 0 10px rgba(255,250,200,0.5), 0 0 20px rgba(251,191,36,0.3)",
            }}
            animate={{
              scale: [0.8, 1.3, 0.8],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}

        {/* Hexagonale Lens Flares */}
        {[
          { x: "50%", y: "35%", size: 25, rotation: 0 },
          { x: "72%", y: "55%", size: 18, rotation: 30 },
          { x: "35%", y: "60%", size: 20, rotation: 15 },
        ].map((hex, i) => (
          <motion.svg
            key={`hex-${i}`}
            viewBox="0 0 100 100"
            className="absolute"
            style={{
              width: hex.size,
              height: hex.size,
              left: hex.x,
              top: hex.y,
              transform: `rotate(${hex.rotation}deg)`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            <polygon
              points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
              fill="none"
              stroke="rgba(255,250,200,0.4)"
              strokeWidth="2"
            />
          </motion.svg>
        ))}

        {/* Warmer Glanz unten */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{
            background: "linear-gradient(to top, rgba(251,191,36,0.1), transparent)",
          }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    );
  }

  if (season === "Frühling") {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Frischer grüner Hintergrund */}
        <motion.div
          className="absolute inset-0"
          style={{ background: "linear-gradient(145deg, rgba(74,222,128,0.1) 0%, rgba(34,197,94,0.08) 50%, rgba(167,243,208,0.1) 100%)" }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Sanfter Lichtschein */}
        <motion.div
          className="absolute -top-20 right-1/4 w-80 h-80 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(167,243,208,0.2), transparent 60%)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Blümchen */}
        {Array.from({ length: 18 }).map((_, i) => {
          const colors = [
            { petals: "rgba(244,114,182,0.8)", center: "rgba(251,191,36,0.9)" }, // Pink
            { petals: "rgba(167,139,250,0.8)", center: "rgba(251,191,36,0.9)" }, // Lila
            { petals: "rgba(96,165,250,0.8)", center: "rgba(251,191,36,0.9)" }, // Blau
            { petals: "rgba(252,211,77,0.8)", center: "rgba(234,88,12,0.9)" }, // Gelb
            { petals: "rgba(248,113,113,0.8)", center: "rgba(251,191,36,0.9)" }, // Rot
          ];
          const color = colors[i % colors.length];
          const size = 16 + (i % 4) * 4;
          return (
            <motion.svg
              key={`flower-${i}`}
              viewBox="0 0 24 24"
              className="absolute"
              style={{
                width: size,
                height: size,
                left: `${(i * 6) % 95}%`,
                top: `${(i * 8) % 90}%`,
                filter: "drop-shadow(0 0 4px rgba(255,255,255,0.3))",
              }}
              animate={{
                scale: [0.9, 1.1, 0.9],
                rotate: [0, 10, -10, 0],
                opacity: [0.5, 0.9, 0.5]
              }}
              transition={{ duration: 4 + i * 0.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
            >
              {/* 5 Blütenblätter */}
              {[0, 72, 144, 216, 288].map((angle, j) => (
                <ellipse
                  key={j}
                  cx="12"
                  cy="6"
                  rx="3.5"
                  ry="5"
                  fill={color.petals}
                  transform={`rotate(${angle} 12 12)`}
                />
              ))}
              {/* Blütenmitte */}
              <circle cx="12" cy="12" r="3" fill={color.center} />
            </motion.svg>
          );
        })}
        {/* Kleine schwebende Blütenblätter */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={`petal-${i}`}
            className="absolute rounded-full"
            style={{
              width: 8,
              height: 5,
              background: i % 2 === 0
                ? "linear-gradient(135deg, rgba(244,114,182,0.7), rgba(244,114,182,0.3))"
                : "linear-gradient(135deg, rgba(167,139,250,0.7), rgba(167,139,250,0.3))",
              left: `${(i * 9) % 100}%`,
              top: -10,
              borderRadius: "50%",
            }}
            animate={{
              y: [0, 600],
              x: [0, i % 2 === 0 ? 60 : -60],
              rotate: [0, 180, 360],
              opacity: [0, 0.8, 0.8, 0]
            }}
            transition={{
              duration: 10 + i * 0.5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.4,
              times: [0, 0.1, 0.9, 1]
            }}
          />
        ))}
      </div>
    );
  }

  // Herbst (default)
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Warmer Herbst-Hintergrund */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "linear-gradient(150deg, rgba(251,146,60,0.12) 0%, rgba(180,83,9,0.1) 50%, rgba(120,53,15,0.08) 100%)" }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Herbstlicher Lichtschein */}
      <motion.div
        className="absolute -top-10 left-1/4 w-72 h-72 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(251,146,60,0.2), transparent 60%)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Fallende Blätter */}
      {Array.from({ length: 25 }).map((_, i) => {
        const leafColors = [
          "text-orange-400",
          "text-amber-500",
          "text-red-400",
          "text-yellow-500",
          "text-orange-500",
        ];
        const color = leafColors[i % leafColors.length];
        const size = 14 + (i % 4) * 4;
        return (
          <motion.svg
            key={`leaf-${i}`}
            viewBox="0 0 24 24"
            className={`absolute ${color}`}
            style={{
              width: size,
              height: size,
              left: `${(i * 4) % 100}%`,
              top: -30,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
            }}
            animate={{
              y: [0, 700],
              x: [0, i % 2 === 0 ? 80 : -80, i % 3 === 0 ? -40 : 40],
              rotate: [0, i % 2 === 0 ? 180 : -180, i % 2 === 0 ? 360 : -360],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 10 + i * 0.4,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.3,
              times: [0, 0.05, 0.9, 1]
            }}
          >
            <path
              d="M12 2C8 6 4 10 4 14c0 4 3.5 8 8 8s8-4 8-8c0-4-4-8-8-12z"
              fill="currentColor"
            />
            <path
              d="M12 6v14M8 10l4 4M16 12l-4 4"
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="0.5"
              fill="none"
            />
          </motion.svg>
        );
      })}
    </div>
  );
}

export default function MonthlyChartSlide({ stats }: MonthlyChartSlideProps) {
  const { monthlyStats } = stats;
  const maxActivities = Math.max(...monthlyStats.map((m) => m.activities), 1);

  const mostActiveMonth = monthlyStats.reduce((max, m) =>
    m.activities > max.activities ? m : max
  , monthlyStats[0]);
  const leastActiveMonth = monthlyStats.reduce((min, m) =>
    m.activities < min.activities ? m : min
  , monthlyStats[0]);
  const totalActivities = monthlyStats.reduce((sum, m) => sum + m.activities, 0);
  const avgPerMonth = Math.round(totalActivities / 12);
  const totalDistance = monthlyStats.reduce((sum, m) => sum + m.distance, 0);
  const totalDuration = monthlyStats.reduce((sum, m) => sum + m.duration, 0);
  const totalCalories = monthlyStats.reduce((sum, m) => sum + m.calories, 0);
  const maxDelta = monthlyStats.slice(1).reduce((max, m, i) => {
    const prev = monthlyStats[i];
    const delta = m.activities - prev.activities;
    return delta > max.delta ? { month: m.month, delta } : max;
  }, { month: 1, delta: -Infinity });

  // Seasonal breakdown
  const seasons = [
    { name: "Frühling", months: [2, 3, 4] },
    { name: "Sommer", months: [5, 6, 7] },
    { name: "Herbst", months: [8, 9, 10] },
    { name: "Winter", months: [11, 0, 1] },
  ].map(s => ({
    ...s,
    activities: s.months.reduce((sum, m) => sum + (monthlyStats[m]?.activities || 0), 0),
  }));

  const bestSeason = seasons.reduce((max, s) => s.activities > max.activities ? s : max, seasons[0]);
  const maxSeasonActivities = Math.max(...seasons.map((s) => s.activities), 1);

  const formatKm = (km: number) => {
    if (km >= 1000) return `${(km / 1000).toFixed(1)}k`;
    return `${Math.round(km)}`;
  };
  const formatHours = (hours: number) => {
    if (hours >= 100) return `${Math.round(hours)}h`;
    return `${hours.toFixed(1)}h`;
  };
  const formatCalories = (calories: number) => {
    if (calories >= 100000) return `${(calories / 1000).toFixed(0)}k`;
    return calories.toLocaleString("de-DE");
  };

  const theme = seasonThemes[bestSeason.name] || seasonThemes.Sommer;

  return (
    <SlideWrapper gradient={theme.gradient}>
      <div className="relative w-full max-w-6xl mx-auto px-4">
        <SeasonBackdrop season={bestSeason.name} />
        {/* Ambient background elements */}
        <motion.div
          aria-hidden
          className="absolute -top-16 left-1/4 w-72 h-72 bg-cyan-500/10 blur-[90px] rounded-full"
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-20 right-1/4 w-80 h-80 bg-amber-500/10 blur-[110px] rounded-full"
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.08, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />

        <div className="relative text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-white mb-2"
          >
            Dein Jahr Monat für Monat
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-sm"
          >
            {stats.year} im Überblick
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-4">
          {/* Main chart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-xs text-white/50">Aktivitäten pro Monat</div>
                <div className="text-lg font-semibold text-white/80">{stats.year}</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-white/40">Top-Monat</div>
                <div className="text-sm font-semibold text-amber-300">
                  {MONTH_LABELS[mostActiveMonth.month - 1]} · {mostActiveMonth.activities}
                </div>
              </div>
            </div>

            <div className="relative h-60 overflow-hidden">
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-px bg-white/10" />
                ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 top-6 flex items-end justify-between gap-2 z-10">
                {monthlyStats.map((month, index) => {
                  const height = (month.activities / maxActivities) * 100;
                  const isMax = month.month === mostActiveMonth.month;
                  const isMin = month.month === leastActiveMonth.month;

                  return (
                    <motion.div
                      key={month.month}
                      className="flex-1 flex flex-col items-center justify-end group h-full relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.03 }}
                    >
                      <motion.div
                        className={`w-full rounded-t-lg ${
                          isMax
                            ? "bg-gradient-to-t from-amber-500 to-yellow-300 shadow-[0_0_16px_rgba(251,191,36,0.4)]"
                            : isMin
                              ? "bg-white/20"
                              : "bg-gradient-to-t from-garmin-blue/70 to-cyan-300/70"
                        }`}
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(height, 10)}%` }}
                        transition={{ delay: 0.35 + index * 0.04, duration: 0.45 }}
                      />
                      <span className={`text-[10px] mt-2 ${isMax ? "text-amber-300 font-semibold" : "text-white/50"}`}>
                        {MONTH_LABELS[index]}
                      </span>
                      <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/70 px-2 py-1 text-[10px] text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
                        {MONTH_LABELS[index]} · {month.activities} Aktivitäten · {formatKm(month.distance)} km · {formatHours(month.duration)}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19h16M7 16V8m5 8V6m5 10V10" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <div className="text-[10px] text-white/50">Durchschnitt/Monat</div>
                  <div className="text-lg font-semibold text-white/80">{avgPerMonth}</div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-white/10 text-white/60 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 12h16M8 6v12" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <div className="text-[10px] text-white/50">Ruhigster Monat</div>
                  <div className="text-lg font-semibold text-white/80">
                    {MONTH_LABELS[leastActiveMonth.month - 1]} · {leastActiveMonth.activities}
                  </div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3l3 6 6 .8-4.4 4.2 1 6-5.6-3-5.6 3 1-6L3 9.8 9 9z" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <div className="text-[10px] text-white/50">Rekord-Monat</div>
                  <div className="text-lg font-semibold text-amber-300">
                    {MONTH_LABELS[mostActiveMonth.month - 1]}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Seasonal panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs text-white/50">Saisons im Vergleich</div>
              <div className="text-[11px] text-white/40">Total: {totalActivities}</div>
            </div>

            <div className="space-y-3">
              {seasons.map((season) => {
                const width = (season.activities / maxSeasonActivities) * 100;
                const isBest = season.name === bestSeason.name;
                return (
                  <div key={season.name}>
                    <div className="flex items-center justify-between text-[11px] text-white/60 mb-1">
                      <span className={isBest ? "text-amber-300 font-semibold" : ""}>{season.name}</span>
                      <span>{season.activities}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isBest
                            ? "bg-gradient-to-r from-amber-500 to-yellow-300"
                            : "bg-gradient-to-r from-garmin-blue/60 to-cyan-300/60"
                        }`}
                        style={{ width: `${Math.max(width, 6)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 border-t border-white/10 pt-4 space-y-3">
              <div>
                <div className="text-[11px] text-white/40">Stärkste Saison</div>
                <div className="text-xl font-semibold text-amber-300">{bestSeason.name}</div>
                <div className="text-xs text-white/50">{bestSeason.activities} Aktivitäten</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <div className="text-[10px] text-white/50">Gesamtdistanz</div>
                  <div className="text-lg font-semibold text-cyan-300">{formatKm(totalDistance)} km</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <div className="text-[10px] text-white/50">Gesamtzeit</div>
                  <div className="text-lg font-semibold text-white/80">{formatHours(totalDuration)}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <div className="text-[10px] text-white/50">Kalorien</div>
                  <div className="text-lg font-semibold text-white/80">{formatCalories(totalCalories)}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <div className="text-[10px] text-white/50">Größter Sprung</div>
                  <div className="text-lg font-semibold text-emerald-300">
                    {maxDelta.delta > 0 ? `+${maxDelta.delta}` : maxDelta.delta} · {MONTH_LABELS[maxDelta.month - 1]}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </SlideWrapper>
  );
}
