"use client";

import { motion } from "framer-motion";
import SlideWrapper, { AnimatedLine } from "./SlideWrapper";
import { YearStats } from "@/lib/types/activity";
import CountingNumber from "../animations/CountingNumber";

interface StepsSlideProps {
  stats: YearStats;
}

// Animated walking footsteps background
function FootstepsBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient waves */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute w-full h-32"
          style={{
            bottom: `${10 + i * 15}%`,
            background: `linear-gradient(90deg, transparent, rgba(16, 185, 129, ${0.05 - i * 0.01}), transparent)`,
            borderRadius: "50%",
          }}
          animate={{
            x: ["-10%", "10%", "-10%"],
            scaleY: [1, 1.3, 1],
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1,
          }}
        />
      ))}

      {/* Floating step icons */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={`step-${i}`}
          className="absolute text-emerald-500/20"
          style={{
            left: `${5 + (i % 6) * 16}%`,
            top: `${10 + Math.floor(i / 6) * 40}%`,
            fontSize: 20 + Math.random() * 15,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.3, 0.1],
            rotate: i % 2 === 0 ? [0, 10, 0] : [0, -10, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        >
          {i % 2 === 0 ? "👟" : "👣"}
        </motion.div>
      ))}
    </div>
  );
}

// Animated step counter with walking person
function AnimatedStepCounter({ steps }: { steps: number }) {
  const millions = steps / 1000000;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, type: "spring" }}
      className="relative"
    >
      {/* Walking person silhouette animation */}
      <motion.div
        className="absolute -left-16 top-1/2 -translate-y-1/2"
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        <svg width="40" height="60" viewBox="0 0 40 60" fill="none">
          <motion.g
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 0.4, repeat: Infinity }}
          >
            {/* Head */}
            <circle cx="20" cy="8" r="6" fill="rgba(16, 185, 129, 0.8)" />
            {/* Body */}
            <line x1="20" y1="14" x2="20" y2="32" stroke="rgba(16, 185, 129, 0.8)" strokeWidth="3" />
            {/* Arms */}
            <motion.line
              x1="20" y1="20" x2="10" y2="28"
              stroke="rgba(16, 185, 129, 0.8)" strokeWidth="2"
              animate={{ x2: [10, 14, 10] }}
              transition={{ duration: 0.4, repeat: Infinity }}
            />
            <motion.line
              x1="20" y1="20" x2="30" y2="28"
              stroke="rgba(16, 185, 129, 0.8)" strokeWidth="2"
              animate={{ x2: [30, 26, 30] }}
              transition={{ duration: 0.4, repeat: Infinity }}
            />
            {/* Legs */}
            <motion.line
              x1="20" y1="32" x2="12" y2="50"
              stroke="rgba(16, 185, 129, 0.8)" strokeWidth="2"
              animate={{ x2: [12, 16, 12] }}
              transition={{ duration: 0.4, repeat: Infinity }}
            />
            <motion.line
              x1="20" y1="32" x2="28" y2="50"
              stroke="rgba(16, 185, 129, 0.8)" strokeWidth="2"
              animate={{ x2: [28, 24, 28] }}
              transition={{ duration: 0.4, repeat: Infinity }}
            />
          </motion.g>
        </svg>
      </motion.div>

      <div className="flex items-baseline justify-center gap-2">
        <CountingNumber
          value={millions}
          decimals={1}
          className="text-6xl md:text-8xl font-bold text-white"
          delay={0.5}
        />
        <span className="text-2xl md:text-3xl text-white/60">Mio. Schritte</span>
      </div>
    </motion.div>
  );
}

// Weekly pattern bar chart with animation
function WeeklyChart({ byDay }: { byDay: { [key: string]: number } }) {
  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const dayLabels = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const values = days.map((day) => byDay[day] || 0);
  const maxSteps = Math.max(...values, 1);
  const activeValues = values.filter((value) => value > 0);
  const minSteps = activeValues.length > 0 ? Math.min(...activeValues) : 0;
  const avgSteps = activeValues.length > 0
    ? activeValues.reduce((sum, value) => sum + value, 0) / activeValues.length
    : 0;
  const weekdayValues = values.slice(0, 5);
  const weekendValues = values.slice(5);
  const weekdayActive = weekdayValues.filter((value) => value > 0);
  const weekendActive = weekendValues.filter((value) => value > 0);
  const avgWeekday = weekdayActive.length > 0
    ? weekdayActive.reduce((sum, value) => sum + value, 0) / weekdayActive.length
    : 0;
  const avgWeekend = weekendActive.length > 0
    ? weekendActive.reduce((sum, value) => sum + value, 0) / weekendActive.length
    : 0;
  const weekendDeltaPct = avgWeekday > 0 ? ((avgWeekend - avgWeekday) / avgWeekday) * 100 : 0;
  const hasData = activeValues.length > 0;
  const bestIndex = hasData ? values.indexOf(maxSteps) : -1;
  const worstIndex = hasData ? values.indexOf(minSteps) : -1;

  const formatSteps = (steps: number) => {
    if (steps >= 10000) {
      return `${(steps / 1000).toFixed(0)}k`;
    }
    if (steps >= 1000) {
      return `${(steps / 1000).toFixed(1)}k`;
    }
    return `${Math.round(steps)}`;
  };
  const formatDelta = (delta: number) => {
    if (!Number.isFinite(delta)) {
      return "0%";
    }
    const rounded = Math.round(delta);
    const sign = rounded > 0 ? "+" : "";
    return `${sign}${rounded}%`;
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-white/50">Schritte pro Wochentag</span>
        <span className="text-[10px] text-white/60 bg-white/10 border border-white/10 px-2 py-0.5 rounded-full">
          Durchschnitt {formatSteps(avgSteps)}
        </span>
      </div>

      <div className="space-y-2">
        {days.map((day, i) => {
          const steps = values[i];
          const width = (steps / maxSteps) * 100;
          const isBest = i === bestIndex;
          const isWorst = i === worstIndex;
          const deltaPct = avgSteps > 0 ? ((steps - avgSteps) / avgSteps) * 100 : 0;
          const barClass = isBest
            ? "bg-gradient-to-r from-emerald-400 to-green-500 shadow-[0_0_10px_rgba(16,185,129,0.35)]"
            : isWorst
              ? "bg-gradient-to-r from-amber-400 to-orange-500"
              : "bg-emerald-500/45";

          return (
            <div key={day} className="grid grid-cols-[26px_1fr_48px] items-center gap-2 group">
              <span className={`text-[11px] ${isBest ? "text-emerald-300" : isWorst ? "text-amber-300" : "text-white/50"}`}>
                {dayLabels[i]}
              </span>
              <div className="relative h-3 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${barClass}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(width, steps > 0 ? 8 : 2)}%` }}
                  transition={{ delay: 0.7 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                />
                <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/70 px-2 py-1 text-[10px] text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
                  {dayLabels[i]}: {formatSteps(steps)} Schritte{avgSteps > 0 ? ` · ${formatDelta(deltaPct)} vs Ø` : ""}
                </div>
              </div>
              <span className="text-[10px] text-white/60 text-right">{formatSteps(steps)}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-2 py-1 transition-all duration-200 hover:bg-white/10 hover:border-white/30">
          <span className="text-[10px] text-white/50">Wochentage</span>
          <span className="text-[11px] text-emerald-300">{formatSteps(avgWeekday)}</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-2 py-1 transition-all duration-200 hover:bg-white/10 hover:border-white/30">
          <span className="text-[10px] text-white/50">Wochenende</span>
          <span className={`text-[11px] ${weekendDeltaPct >= 0 ? "text-emerald-300" : "text-amber-300"}`}>
            {formatSteps(avgWeekend)}
            <span className="text-[9px] text-white/40 ml-1">{formatDelta(weekendDeltaPct)}</span>
          </span>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-[10px] text-white/40">
        <span>Top: {hasData ? `${dayLabels[bestIndex]} ${formatSteps(maxSteps)}` : "--"}</span>
        <span>Tief: {hasData ? `${dayLabels[worstIndex]} ${formatSteps(minSteps)}` : "--"}</span>
      </div>
    </div>
  );
}

// Monthly trend chart
function MonthlyChart({ monthlySteps, bestMonth }: { monthlySteps: number[]; bestMonth: { name: string; steps: number } }) {
  const maxSteps = Math.max(...monthlySteps, 1);
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
  const formatSteps = (steps: number) => {
    if (steps >= 10000) {
      return `${(steps / 1000).toFixed(0)}k`;
    }
    if (steps >= 1000) {
      return `${(steps / 1000).toFixed(1)}k`;
    }
    return `${Math.round(steps)}`;
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 h-full flex flex-col transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
      <div className="text-xs text-white/50 text-center">Monatlicher Trend</div>
      <div className="flex flex-col flex-1 justify-center mt-2">
        <div className="flex items-end justify-between gap-1 h-full">
          {monthlySteps.map((steps, i) => {
            const height = (steps / maxSteps) * 100;
            const isBest = monthNames[i] === bestMonth.name;

            return (
              <div key={i} className="relative flex-1 h-full group">
                <motion.div
                  className={`absolute bottom-0 w-full rounded-t ${isBest ? "bg-gradient-to-t from-cyan-500 to-blue-400" : "bg-cyan-500/30"}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, 3)}%` }}
                  transition={{ delay: 1 + i * 0.05, duration: 0.4 }}
                />
                <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/70 px-2 py-1 text-[10px] text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
                  {monthNames[i]}: {formatSteps(steps)}/Tag
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[8px] text-white/30 mt-1">
          {months.map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
      </div>
      <div className="text-center text-xs text-cyan-400 mt-3">
        Bester Monat: {bestMonth.name} ({(bestMonth.steps / 1000).toFixed(0)}k/Tag)
      </div>
    </div>
  );
}

// Floors climbed visualization with cool comparisons
function FloorsVisualization({
  totalFloors,
  avgDaily,
  weeklyFloors,
  bestFloorDay,
  totalElevation
}: {
  totalFloors: number;
  avgDaily: number;
  weeklyFloors?: { [key: string]: number };
  bestFloorDay?: { date: string | null; floors: number; activityName: string };
  totalElevation: number;
}) {
  // Famous building comparisons (floors)
  const burjKhalifaFloors = 163;
  const empireStateFloors = 102;
  const eiffelTowerFloors = 108; // Approximate (to observation deck)
  const bigBenFloors = 334 / 3; // 334 steps ≈ 111 floors

  const burjKhalifaClimbs = totalFloors / burjKhalifaFloors;
  const empireStateClimbs = totalFloors / empireStateFloors;
  const eiffelTowerClimbs = totalFloors / eiffelTowerFloors;

  // Mountain comparisons (using actual elevation in meters)
  const mountEverest = 8849;
  const alpesHuez = 1120; // Famous cycling climb
  const stephansdom = 136.4; // Vienna cathedral tower height
  const grossglockner = 3798;

  const everestClimbs = totalElevation / mountEverest;
  const alpesHuezClimbs = totalElevation / alpesHuez;
  const stephansdomClimbs = totalElevation / stephansdom;

  // Weekday data
  const weekdays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const floorsByDay = dayKeys.map((key) => weeklyFloors?.[key] || 0);
  const hasWeekdayData = floorsByDay.some(f => f > 0);
  const maxFloors = Math.max(...floorsByDay, 1);
  const bestDayIndex = floorsByDay.indexOf(Math.max(...floorsByDay));

  // Best comparison based on total
  const primaryComparison = totalElevation >= mountEverest
    ? { emoji: "🏔️", value: everestClimbs.toFixed(1), label: "Mount Everest", color: "text-cyan-300" }
    : totalElevation >= alpesHuez * 5
      ? { emoji: "🚴", value: alpesHuezClimbs.toFixed(0), label: "Alpe d'Huez", color: "text-yellow-300" }
      : { emoji: "⛪", value: stephansdomClimbs.toFixed(0), label: "Stephansdom", color: "text-purple-300" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/30 rounded-xl p-4 transition-all duration-300 hover:border-amber-400/60 hover:shadow-[0_12px_30px_rgba(120,53,15,0.25)] hover:-translate-y-0.5"
    >
      {/* Header with main stats */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🪜</span>
            <span className="text-xs text-white/50 uppercase tracking-wider">Stockwerke erklommen</span>
          </div>
          <div className="text-4xl font-bold text-amber-400">
            <CountingNumber value={totalFloors} delay={1.3} />
          </div>
          <div className="text-sm text-white/60 mt-1">
            {totalElevation.toLocaleString("de-DE")} Höhenmeter total
          </div>
        </div>

        {/* Primary comparison highlight */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, type: "spring" }}
          className="text-right bg-white/5 rounded-lg px-3 py-2"
        >
          <div className="text-2xl mb-1">{primaryComparison.emoji}</div>
          <div className={`text-xl font-bold ${primaryComparison.color}`}>
            {primaryComparison.value}x
          </div>
          <div className="text-[10px] text-white/50">{primaryComparison.label}</div>
        </motion.div>
      </div>

      {/* Building comparisons grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="bg-white/5 rounded-lg p-2 text-center"
        >
          <div className="text-lg">🗼</div>
          <div className="text-lg font-bold text-amber-300">{burjKhalifaClimbs.toFixed(1)}x</div>
          <div className="text-[9px] text-white/40">Burj Khalifa</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          className="bg-white/5 rounded-lg p-2 text-center"
        >
          <div className="text-lg">🗽</div>
          <div className="text-lg font-bold text-orange-300">{empireStateClimbs.toFixed(1)}x</div>
          <div className="text-[9px] text-white/40">Empire State</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="bg-white/5 rounded-lg p-2 text-center"
        >
          <div className="text-lg">🗼</div>
          <div className="text-lg font-bold text-red-300">{eiffelTowerClimbs.toFixed(1)}x</div>
          <div className="text-[9px] text-white/40">Eiffelturm</div>
        </motion.div>
      </div>

      {/* Best floor day highlight */}
      {bestFloorDay && bestFloorDay.floors > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9 }}
          className="bg-gradient-to-r from-amber-500/20 to-transparent border-l-2 border-amber-400 px-3 py-2 rounded-r mb-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-white/50">Rekord-Tag: </span>
              <span className="text-sm font-medium text-amber-300">
                {Math.round(bestFloorDay.floors)} Stockwerke
              </span>
            </div>
            <div className="text-[10px] text-white/40">
              {bestFloorDay.date && new Date(bestFloorDay.date).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
            </div>
          </div>
          {bestFloorDay.activityName && (
            <div className="text-[10px] text-white/40 truncate">{bestFloorDay.activityName}</div>
          )}
        </motion.div>
      )}

      {/* Weekday distribution */}
      {hasWeekdayData && (
        <div>
          <div className="text-[10px] text-white/40 mb-2">Ø Stockwerke pro Aktivitäts-Tag</div>
          <div className="flex items-end justify-between gap-1 h-14">
            {floorsByDay.map((floors, i) => {
              const isBest = i === bestDayIndex && floors > 0;
              return (
                <div key={i} className="flex flex-col items-center flex-1 group relative">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 2.0 + i * 0.05 }}
                    className={`w-full max-w-[24px] rounded-t ${
                      isBest
                        ? "bg-gradient-to-t from-amber-500 to-yellow-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                        : "bg-gradient-to-t from-amber-700 to-amber-500"
                    }`}
                    style={{
                      height: `${(floors / maxFloors) * 40}px`,
                      transformOrigin: "bottom",
                      minHeight: floors > 0 ? "4px" : "2px"
                    }}
                  />
                  <span className={`text-[9px] mt-1 ${isBest ? "text-amber-300 font-bold" : "text-white/50"}`}>
                    {weekdays[i]}
                  </span>
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {floors.toFixed(1)} Stockwerke
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily average badge */}
      <div className="flex justify-center mt-3">
        <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
          <span className="text-[10px] text-white/50">Ø pro Aktivitäts-Tag:</span>
          <span className="text-sm font-bold text-amber-400">{avgDaily}</span>
          <span className="text-[10px] text-white/50">Stockwerke</span>
        </div>
      </div>
    </motion.div>
  );
}

// Distance walked comparison
function DistanceComparison({ totalSteps }: { totalSteps: number }) {
  // Average step length ~0.7m
  const distanceKm = (totalSteps * 0.0007);
  const earthCircumference = 40075;
  const earthPercent = (distanceKm / earthCircumference) * 100;
  const moonDistance = 384400;
  const moonPercent = (distanceKm / moonDistance) * 100;

  // Fun comparisons
  const marathons = distanceKm / 42.195;
  const berlinToMunich = distanceKm / 585; // ~585km

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4 }}
      className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4 transition-all duration-300 hover:border-blue-400/60 hover:shadow-[0_12px_30px_rgba(30,64,175,0.25)] hover:-translate-y-0.5"
    >
      <div className="text-xs text-white/50 mb-2 text-center">Zu Fuss gelaufen</div>
      <div className="text-center mb-3">
        <span className="text-3xl font-bold text-blue-400">
          <CountingNumber value={Math.round(distanceKm)} delay={1.5} />
        </span>
        <span className="text-lg text-white/60 ml-1">km</span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.6, type: "spring" }}
          className="bg-white/5 rounded-lg p-2 transition-all duration-200 hover:bg-white/10 hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
        >
          <div className="text-lg">🌍</div>
          <div className="text-xl font-bold text-cyan-400">{earthPercent.toFixed(1)}%</div>
          <div className="text-[10px] text-white/50">der Erde umrundet</div>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.7, type: "spring" }}
          className="bg-white/5 rounded-lg p-2 transition-all duration-200 hover:bg-white/10 hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
        >
          <div className="text-lg">🏃</div>
          <div className="text-xl font-bold text-purple-400">{marathons.toFixed(0)}</div>
          <div className="text-[10px] text-white/50">Marathons</div>
        </motion.div>
      </div>

      {berlinToMunich >= 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-center text-xs text-white/50 mt-2"
        >
          Das sind {berlinToMunich.toFixed(0)}x Berlin - Munchen!
        </motion.div>
      )}
    </motion.div>
  );
}

// Step rating badge
function getStepRating(avgDailySteps: number): {
  level: string;
  description: string;
  gradient: string;
  threshold: string;
} {
  if (avgDailySteps >= 15000) {
    return {
      level: "EXTREM AKTIV",
      description: "Top 5% aller Nutzer",
      gradient: "from-yellow-500 to-amber-600",
      threshold: "15.000+ Schritte/Tag",
    };
  }
  if (avgDailySteps >= 10000) {
    return {
      level: "SEHR AKTIV",
      description: "Gesundheitsziel erreicht",
      gradient: "from-emerald-500 to-green-600",
      threshold: "10.000+ Schritte/Tag (WHO-Empfehlung)",
    };
  }
  if (avgDailySteps >= 7500) {
    return {
      level: "AKTIV",
      description: "Uberdurchschnittlich",
      gradient: "from-cyan-500 to-blue-600",
      threshold: "7.500+ Schritte/Tag",
    };
  }
  if (avgDailySteps >= 5000) {
    return {
      level: "MODERAT",
      description: "Durchschnittlich aktiv",
      gradient: "from-blue-500 to-indigo-600",
      threshold: "5.000+ Schritte/Tag",
    };
  }
  return {
    level: "AUSBAUFAHIG",
    description: "Mehr Bewegung empfohlen",
    gradient: "from-purple-500 to-pink-600",
    threshold: "Unter 5.000 Schritte/Tag",
  };
}

export default function StepsSlide({ stats }: StepsSlideProps) {
  const wellness = stats.wellnessInsights;

  if (!wellness?.hasStepsData) {
    return null;
  }

  const rating = getStepRating(wellness.avgDailySteps);

  return (
    <SlideWrapper gradient="from-[#0a1a15] via-[#0f2920] to-[#0a1a15]">
      <FootstepsBackground />

      <div className="relative z-10 text-center w-full max-w-4xl mx-auto px-4">
        {/* Header */}
        <AnimatedLine className="text-white/50 text-sm mb-2">
          Deine Schritte in {stats.year}
        </AnimatedLine>

        {/* Big step counter */}
        <AnimatedStepCounter steps={wellness.estimatedYearlySteps} />

        {/* Activity Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="mt-4 mb-6"
        >
          <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r ${rating.gradient} text-white font-bold shadow-lg`}>
            <span className="tracking-wider">{rating.level}</span>
          </div>
          <p className="text-white/60 text-sm mt-1">{rating.description}</p>
        </motion.div>

        {/* Daily average highlight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center gap-6 mb-6"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">
              <CountingNumber value={wellness.avgDailySteps} delay={0.8} />
            </div>
            <div className="text-xs text-white/50">Schritte pro Tag</div>
          </div>
          <div className="w-px bg-white/20" />
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">
              <CountingNumber value={wellness.bestStepsDay.steps} delay={0.9} />
            </div>
            <div className="text-xs text-white/50">Rekord-Tag</div>
          </div>
        </motion.div>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <WeeklyChart byDay={wellness.weeklyPattern.byDay} />
          <MonthlyChart monthlySteps={wellness.monthlySteps} bestMonth={wellness.bestMonth} />
        </div>

        {/* Floors and Distance row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Floors visualization - only show if we have floor data */}
          {wellness.hasRealFloorData && wellness.totalFloorsClimbed > 0 && (
            <FloorsVisualization
              totalFloors={wellness.totalFloorsClimbed}
              avgDaily={wellness.avgDailyFloors}
              weeklyFloors={wellness.weeklyFloors}
              bestFloorDay={wellness.bestFloorDay}
              totalElevation={stats.totalElevation}
            />
          )}

          {/* Distance comparison */}
          <DistanceComparison totalSteps={wellness.estimatedYearlySteps} />
        </div>

        {/* Data source */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="flex flex-col items-center gap-1 text-[10px] text-white/30"
        >
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span>Daten: Garmin Step Counter API (hochgerechnet aus {wellness.monthlySteps.filter(s => s > 0).length * 8} Messtagen)</span>
          </div>
          <div>Bewertung: {rating.threshold}</div>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
