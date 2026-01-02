"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import SlideWrapper from "./SlideWrapper";
import { YearStats } from "@/lib/types/activity";
import CountingNumber from "../animations/CountingNumber";

interface CyclingPowerSlideProps {
  stats: YearStats;
}

// Animated power meter/gauge
function PowerGauge({ ftp, maxScale = 400 }: { ftp: number; maxScale?: number }) {
  const percentage = Math.min(ftp / maxScale, 1);
  const rotation = -135 + percentage * 270;

  // Power level colors
  const getColor = (pct: number) => {
    if (pct >= 0.75) return "#22c55e"; // Elite - green
    if (pct >= 0.5) return "#eab308"; // Strong - yellow
    if (pct >= 0.375) return "#f97316"; // Good - orange
    return "#06b6d4"; // Building - cyan
  };

  const color = getColor(percentage);

  return (
    <div className="relative w-48 h-48 mx-auto mb-4">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="powerGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="33%" stopColor="#eab308" />
            <stop offset="66%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
          <filter id="powerGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background arc */}
        <path
          d="M 30 170 A 85 85 0 1 1 170 170"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Power arc - animated */}
        <motion.path
          d="M 30 170 A 85 85 0 1 1 170 170"
          fill="none"
          stroke="url(#powerGaugeGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="445"
          initial={{ strokeDashoffset: 445 }}
          animate={{ strokeDashoffset: 445 - percentage * 445 }}
          transition={{ delay: 0.5, duration: 2, ease: "easeOut" }}
          filter="url(#powerGlow)"
        />

        {/* Tick marks */}
        {[0, 100, 200, 300, 400].map((val) => {
          const angle = -135 + (val / maxScale) * 270;
          const rad = (angle * Math.PI) / 180;
          const innerR = 65;
          const outerR = 75;
          const labelR = 52;
          const x1 = 100 + innerR * Math.cos(rad);
          const y1 = 100 + innerR * Math.sin(rad);
          const x2 = 100 + outerR * Math.cos(rad);
          const y2 = 100 + outerR * Math.sin(rad);
          const labelX = 100 + labelR * Math.cos(rad);
          const labelY = 100 + labelR * Math.sin(rad);

          // Adjust text anchor based on position
          const textAnchor = angle < -45 ? "end" : angle > 45 ? "start" : "middle";

          return (
            <g key={val}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
              />
              <text
                x={labelX}
                y={labelY}
                fill="rgba(255,255,255,0.5)"
                fontSize="11"
                fontWeight="500"
                textAnchor={textAnchor}
                dominantBaseline="middle"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Needle */}
        <motion.g
          initial={{ rotate: -135 }}
          animate={{ rotate: rotation }}
          transition={{ delay: 0.5, duration: 2, ease: "easeOut" }}
          style={{ transformOrigin: "100px 100px" }}
        >
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="35"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#powerGlow)"
          />
        </motion.g>

        {/* Center circle */}
        <circle cx="100" cy="100" r="8" fill={color} />

        {/* Lightning bolt icon in center */}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2.2, type: "spring" }}
        >
          <path
            d="M100 75 L95 95 L102 95 L97 115 L110 90 L103 90 L108 75 Z"
            fill={color}
            opacity="0.3"
          />
        </motion.g>
      </svg>

      {/* FTP Value overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, type: "spring" }}
          className="text-center mt-4"
        >
          <div className="text-4xl font-black text-white leading-none">
            <CountingNumber value={Math.round(ftp)} delay={0.5} duration={2} />
            <span className="text-xl text-white/60 ml-0.5">W</span>
          </div>
          <div className="text-xs text-white/40 mt-1">FTP</div>
        </motion.div>
      </div>
    </div>
  );
}

// Animated electricity background
function ElectricityBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Electric pulses */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${15 + i * 15}%`,
            top: `${10 + (i % 3) * 30}%`,
          }}
        >
          <svg width="40" height="60" viewBox="0 0 40 60">
            <motion.path
              d="M20 0 L15 25 L22 25 L17 60 L30 20 L23 20 L28 0 Z"
              fill="none"
              stroke="rgba(234, 179, 8, 0.15)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.5,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            />
          </svg>
        </motion.div>
      ))}

      {/* Glowing orbs */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute w-32 h-32 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(234,179,8,0.1) 0%, transparent 70%)",
            left: `${20 + i * 20}%`,
            top: `${30 + (i % 2) * 30}%`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}

// Power zone bar with animation
function PowerZoneBar({
  zones,
  ftp,
}: {
  zones: { name: string; min: number; max: number; color: string }[];
  ftp: number;
}) {
  return (
    <div className="w-full">
      <div className="text-sm text-white/50 mb-3 text-center font-medium">Deine Trainingszonen</div>
      <div className="flex gap-1.5 h-16 rounded-2xl overflow-hidden bg-white/5 p-1.5">
        {zones.map((zone, i) => (
          <motion.div
            key={zone.name}
            className="flex-1 rounded-xl flex flex-col items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: zone.color }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
          >
            <span className="text-sm font-bold text-white">{zone.name}</span>
            <span className="text-[10px] text-white/80">
              {zone.max === Infinity ? `${zone.min}+W` : `${zone.min}-${zone.max}W`}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="text-[10px] text-white/30 mt-2 text-center">
        Z1-Z2 = Grundlage | Z3-Z4 = Tempo | Z5-Z6 = Intervalle
      </div>
    </div>
  );
}

// Get FTP level with comparison
// Based on Coggan's Power Profiling data and typical male recreational cyclist benchmarks
// Note: These are absolute values - W/kg would be more accurate but requires weight data
// Sources: Training and Racing with a Power Meter (Coggan/Allen), Intervals.icu community data
function getFTPLevel(ftp: number): {
  level: string;
  color: string;
  comparison: string;
  percentile: string;
} {
  // Coggan Cat 5 ~200W, Cat 4 ~240W, Cat 3 ~280W, Cat 2 ~320W, Cat 1 ~360W (for 75kg rider)
  if (ftp >= 300) {
    return {
      level: "Sehr stark",
      color: "text-green-400",
      comparison: "Cat 3-2 Rennfahrer-Niveau",
      percentile: "~4.0 W/kg bei 75kg",
    };
  }
  if (ftp >= 250) {
    return {
      level: "Stark",
      color: "text-blue-400",
      comparison: "Cat 4-3 Niveau",
      percentile: "~3.3 W/kg bei 75kg",
    };
  }
  if (ftp >= 200) {
    return {
      level: "Gut",
      color: "text-yellow-400",
      comparison: "Trainierter Hobbyfahrer",
      percentile: "~2.7 W/kg bei 75kg",
    };
  }
  if (ftp >= 150) {
    return {
      level: "Solide",
      color: "text-orange-400",
      comparison: "Aktiver Freizeitfahrer",
      percentile: "~2.0 W/kg bei 75kg",
    };
  }
  return {
    level: "Aufbau",
    color: "text-cyan-400",
    comparison: "Guter Einstieg",
    percentile: "< 2.0 W/kg bei 75kg",
  };
}


export default function CyclingPowerSlide({ stats }: CyclingPowerSlideProps) {
  const power = stats.cyclingPowerAnalytics;
  const garminWeight = stats.userWeight;

  // Allow user to override weight if not from Garmin or wants to change it
  const [customWeight, setCustomWeight] = useState<number | null>(null);
  const [showWeightInput, setShowWeightInput] = useState(false);

  // Use custom weight if set, otherwise use Garmin weight
  const weight = customWeight ?? garminWeight ?? null;
  const weightSource = customWeight ? "manuell" : garminWeight ? "Garmin" : null;

  if (!power || !power.hasData) {
    return null;
  }

  const ftp = power.estimatedFTP ? Math.round(power.estimatedFTP) : null;
  const maxPower = power.maxPower ? Math.round(power.maxPower) : null;
  const avgPower = power.avgPower ? Math.round(power.avgPower) : null;

  // Calculate W/kg if weight is available
  const wattsPerKg = ftp && weight ? Math.round((ftp / weight) * 10) / 10 : null;

  const ftpLevel = ftp ? getFTPLevel(ftp) : null;

  // Calculate power zones based on FTP
  const powerZones = ftp
    ? [
        { name: "Z1", min: 0, max: Math.round(ftp * 0.55), color: "rgba(156,163,175,0.8)" },
        { name: "Z2", min: Math.round(ftp * 0.55), max: Math.round(ftp * 0.75), color: "rgba(59,130,246,0.8)" },
        { name: "Z3", min: Math.round(ftp * 0.75), max: Math.round(ftp * 0.9), color: "rgba(34,197,94,0.8)" },
        { name: "Z4", min: Math.round(ftp * 0.9), max: Math.round(ftp * 1.05), color: "rgba(234,179,8,0.8)" },
        { name: "Z5", min: Math.round(ftp * 1.05), max: Math.round(ftp * 1.2), color: "rgba(249,115,22,0.8)" },
        { name: "Z6", min: Math.round(ftp * 1.2), max: Infinity, color: "rgba(239,68,68,0.8)" },
      ]
    : [];

  // Trend info with concrete values
  const details = power.ftpTrendDetails;
  const getTrendInfo = () => {
    if (power.ftpTrend === "improving" && details) {
      return {
        icon: "↗",
        color: "text-green-400",
        label: `+${Math.abs(details.changePercent)}% stärker`,
        explanation: `${details.startFTP}W (${details.startPeriod}) → ${details.endFTP}W (${details.endPeriod})`
      };
    }
    if (power.ftpTrend === "declining" && details) {
      return {
        icon: "↘",
        color: "text-orange-400",
        label: `${details.changePercent}% Rückgang`,
        explanation: `${details.startFTP}W (${details.startPeriod}) → ${details.endFTP}W (${details.endPeriod})`
      };
    }
    if (details) {
      return {
        icon: "→",
        color: "text-white/50",
        label: "Stabil",
        explanation: `Konstant bei ~${details.endFTP}W`
      };
    }
    return {
      icon: "→",
      color: "text-white/50",
      label: "Stabil",
      explanation: "Nicht genug Daten für Trendanalyse"
    };
  };

  const trend = getTrendInfo();

  return (
    <SlideWrapper gradient="from-[#1a1a0a] via-[#252510] to-[#1a1a0a]">
      {/* Electricity Background */}
      <ElectricityBackground />

      <div className="relative text-center w-full max-w-4xl mx-auto px-4 z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-2"
        >
          <motion.svg
            className="w-8 h-8 text-yellow-400"
            viewBox="0 0 24 24"
            fill="currentColor"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </motion.svg>
          <span className="text-white/60 text-lg">Deine Power-Daten</span>
        </motion.div>

        {/* FTP Gauge or Avg Power */}
        {ftp ? (
          <>
            <PowerGauge ftp={ftp} />

            {/* FTP Level Badge with W/kg */}
            {ftpLevel && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2 }}
                className="mb-4"
              >
                <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 ${ftpLevel.color}`}>
                  <span className="font-bold">{ftpLevel.level}</span>
                  <span className="text-white/40">|</span>
                  {wattsPerKg ? (
                    <span className="text-white/80 text-sm font-medium">{wattsPerKg} W/kg</span>
                  ) : (
                    <span className="text-white/60 text-sm">{ftpLevel.percentile}</span>
                  )}
                </div>
                <p className="text-white/40 text-xs mt-1">{ftpLevel.comparison}</p>

                {/* Weight info/input */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.1 }}
                  className="mt-2"
                >
                  {showWeightInput ? (
                    <div className="inline-flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1">
                      <input
                        type="number"
                        placeholder="kg"
                        className="w-16 bg-transparent text-white text-sm text-center border-b border-white/30 focus:border-yellow-400 outline-none"
                        min="40"
                        max="150"
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (val >= 40 && val <= 150) {
                            setCustomWeight(val);
                          }
                        }}
                      />
                      <button
                        onClick={() => setShowWeightInput(false)}
                        className="text-white/40 hover:text-white/60 text-xs"
                      >
                        OK
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowWeightInput(true)}
                      className="text-[10px] text-white/30 hover:text-white/50 transition-colors"
                    >
                      {weight
                        ? `Gewicht: ${weight} kg (${weightSource}) - anpassen?`
                        : "Gewicht eingeben für W/kg"}
                    </button>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* Trend */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
              className="mb-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <span className={`text-xl ${trend.color}`}>{trend.icon}</span>
                <div className="text-left">
                  <span className={`text-sm font-medium ${trend.color}`}>{trend.label}</span>
                  <p className="text-[10px] text-white/40">{trend.explanation}</p>
                </div>
              </div>
              <p className="text-[10px] text-white/30 mt-1">
                Basierend auf {power.dataPoints} Fahrten mit Powermeter
              </p>
            </motion.div>
          </>
        ) : avgPower ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="text-6xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              <CountingNumber value={avgPower} delay={0.3} />W
            </div>
            <div className="text-white/50 text-sm">Durchschnittliche Leistung</div>
          </motion.div>
        ) : null}

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4 }}
          className="grid grid-cols-3 gap-3 mb-4"
        >
          {/* Max Power */}
          {maxPower && (
            <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-3">
              <div className="flex items-center justify-center gap-1 mb-1">
                <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                <span className="text-[10px] text-white/40">Max Power</span>
              </div>
              <div className="text-2xl font-bold text-red-400">
                <CountingNumber value={maxPower} delay={2.5} />
              </div>
              <div className="text-[10px] text-white/40">Watt</div>
            </div>
          )}

          {/* Avg Power */}
          {avgPower && ftp && (
            <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-xl p-3">
              <div className="flex items-center justify-center gap-1 mb-1">
                <svg className="w-4 h-4 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span className="text-[10px] text-white/40">Ø Power</span>
              </div>
              <div className="text-2xl font-bold text-orange-400">
                <CountingNumber value={avgPower} delay={2.6} />
              </div>
              <div className="text-[10px] text-white/40">Watt</div>
            </div>
          )}

          {/* Total TSS */}
          {power.totalTSS > 0 && (
            <div className="bg-gradient-to-br from-yellow-500/20 to-green-500/20 border border-yellow-500/30 rounded-xl p-3">
              <div className="flex items-center justify-center gap-1 mb-1">
                <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                </svg>
                <span className="text-[10px] text-white/40">Gesamt TSS</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400">
                <CountingNumber value={Math.round(power.totalTSS)} delay={2.7} />
              </div>
              <div className="text-[10px] text-white/40">Training Stress</div>
            </div>
          )}
        </motion.div>

        {/* Power Zones */}
        {ftp && powerZones.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8 }}
            className="mb-4"
          >
            <PowerZoneBar zones={powerZones} ftp={ftp} />
          </motion.div>
        )}

        {/* Data Source Attribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2 }}
          className="mt-4 space-y-1"
        >
          <div className="flex items-center justify-center gap-2 text-[10px] text-white/30">
            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span>
              FTP = 20-Min-Bestleistung × 0.95 | Zonen nach Coggan-Modell | {power.dataPoints} Fahrten
            </span>
          </div>
          <div className="text-[9px] text-white/20 text-center">
            Bewertung: Coggan Power Profiling (Training and Racing with a Power Meter) |
            W/kg-Angaben basieren auf 75kg Referenzgewicht
          </div>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
