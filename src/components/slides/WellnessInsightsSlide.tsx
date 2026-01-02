"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Heart, Moon, Zap, Activity, Droplets } from "lucide-react";
import SlideWrapper, { AnimatedLine } from "./SlideWrapper";
import { YearStats } from "@/lib/types/activity";

interface WellnessInsightsSlideProps {
  stats: YearStats;
}

export default function WellnessInsightsSlide({ stats }: WellnessInsightsSlideProps) {
  const wellness = stats.wellnessInsights;

  if (!wellness) {
    return null;
  }

  const monthNames = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

  // Find max month for step chart
  const maxMonthlySteps = Math.max(...wellness.monthlySteps.filter(s => s > 0), 1);

  // HRV trend icon and color
  const getHrvTrendInfo = () => {
    if (wellness.hrvTrend === "improving") {
      return { icon: TrendingUp, color: "text-green-400", label: "Verbessert" };
    } else if (wellness.hrvTrend === "declining") {
      return { icon: TrendingDown, color: "text-red-400", label: "Gesunken" };
    }
    return { icon: Minus, color: "text-white/50", label: "Stabil" };
  };

  const hrvTrendInfo = getHrvTrendInfo();
  const HrvIcon = hrvTrendInfo.icon;

  // Format large numbers
  const formatSteps = (steps: number) => {
    if (steps >= 1000000) {
      return `${(steps / 1000000).toFixed(1)}M`;
    } else if (steps >= 1000) {
      return `${Math.round(steps / 1000)}k`;
    }
    return steps.toString();
  };

  const formatLiters = (ml: number) => {
    const liters = ml / 1000;
    if (liters >= 1000) {
      return `${(liters / 1000).toFixed(1)}k`;
    }
    return liters.toLocaleString("de-DE", { maximumFractionDigits: 1 });
  };

  return (
    <SlideWrapper gradient="from-[#0a1a1a] via-[#0f2828] to-[#0a1a1a]">
      <div className="text-center w-full max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="text-3xl"
          >
            🧬
          </motion.div>
          <AnimatedLine className="text-white/60 text-lg">
            Deine Wellness-Daten
          </AnimatedLine>
        </div>

        {/* Steps Section */}
        {wellness.hasStepsData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-3"
          >
            {/* Big Step Number */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">👣</span>
              <span className="text-3xl md:text-4xl font-bold text-white">
                {formatSteps(wellness.estimatedYearlySteps)}
              </span>
              <span className="text-white/50 text-sm">Schritte/Jahr</span>
            </div>

            {/* Weekly Step Pattern - Mini Bar Chart */}
            <div className="bg-white/5 rounded-xl p-3 mb-2">
              <div className="text-xs text-white/40 mb-2">Ø Schritte pro Wochentag</div>
              <div className="flex items-end justify-between gap-1 h-12">
                {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day, i) => {
                  const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
                  const steps = (wellness.weeklyPattern as any)[dayKeys[i]] ||
                    (i === 0 ? wellness.weeklyPattern.best.steps : 0);
                  const maxSteps = Math.max(wellness.weeklyPattern.best.steps, 1);
                  const height = (steps / maxSteps) * 100;
                  const isBest = wellness.weeklyPattern.best.day.toLowerCase().startsWith(day.toLowerCase().substring(0, 2));

                  return (
                    <div key={day} className="flex-1 flex flex-col items-center">
                      <div
                        className={`w-full rounded-t ${isBest ? "bg-teal-400" : "bg-teal-400/40"}`}
                        style={{ height: `${Math.max(height, 10)}%` }}
                      />
                      <span className="text-[10px] text-white/40 mt-1">{day}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-teal-400">
                  Bester Tag: {wellness.weeklyPattern.best.day} ({formatSteps(wellness.weeklyPattern.best.steps)})
                </span>
              </div>
            </div>

            {/* Best Day Record */}
            {wellness.bestStepsDay.steps > 0 && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-xs">
                <span>🏆</span>
                <span className="text-teal-400 font-bold">
                  {wellness.bestStepsDay.steps.toLocaleString("de-DE")}
                </span>
                <span className="text-white/50">Schritte am stärksten Tag</span>
              </div>
            )}
          </motion.div>
        )}

        {/* 4-Column Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3"
        >
          {/* Sleep Score */}
          {wellness.hasSleepData && wellness.avgSleepScore !== null && (
            <div className="bg-indigo-500/15 border border-indigo-500/30 rounded-xl p-2">
              <div className="flex items-center gap-1 mb-1">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] text-white/40">Schlaf-Score</span>
              </div>
              <div className="text-2xl font-bold text-indigo-400">{wellness.avgSleepScore}</div>
              <div className="text-[10px] text-white/40">Ø Score</div>
              {wellness.perfectSleepDays > 0 && (
                <div className="text-[10px] text-indigo-300 mt-1">
                  {wellness.perfectSleepDays}x 💯
                </div>
              )}
            </div>
          )}

          {/* HRV */}
          {wellness.hasHrvData && wellness.avgHrv !== null && (
            <div className="bg-purple-500/15 border border-purple-500/30 rounded-xl p-2">
              <div className="flex items-center gap-1 mb-1">
                <Heart className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] text-white/40">HRV</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">{wellness.avgHrv}</div>
              <div className="text-[10px] text-white/40">Ø ms</div>
              <div className={`flex items-center gap-1 text-[10px] mt-1 ${hrvTrendInfo.color}`}>
                <HrvIcon className="w-3 h-3" />
                {hrvTrendInfo.label}
              </div>
            </div>
          )}

          {/* Body Battery */}
          {wellness.hasBodyBatteryData && wellness.avgBodyBatteryChange !== null && (
            <div className="bg-yellow-500/15 border border-yellow-500/30 rounded-xl p-2">
              <div className="flex items-center gap-1 mb-1">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-[10px] text-white/40">Body Battery</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400">
                {wellness.avgBodyBatteryChange > 0 ? "+" : ""}{wellness.avgBodyBatteryChange}
              </div>
              <div className="text-[10px] text-white/40">Ø Nacht-Ladung</div>
            </div>
          )}

          {/* Sweat Loss */}
          {wellness.hasSweatLossData && wellness.estimatedYearlySweatLossMl !== null && (
            <div className="bg-cyan-500/15 border border-cyan-500/30 rounded-xl p-2">
              <div className="flex items-center gap-1 mb-1">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] text-white/40">Schweißverlust</span>
              </div>
              <div className="text-2xl font-bold text-cyan-400">
                {formatLiters(wellness.estimatedYearlySweatLossMl)} L
              </div>
              <div className="text-[10px] text-white/40">Ø/Jahr</div>
            </div>
          )}

          {/* VO2 Max */}
          {wellness.vo2MaxRunning && (
            <div className="bg-red-500/15 border border-red-500/30 rounded-xl p-2">
              <div className="flex items-center gap-1 mb-1">
                <Activity className="w-4 h-4 text-red-400" />
                <span className="text-[10px] text-white/40">VO2 Max</span>
              </div>
              <div className="text-2xl font-bold text-red-400">{wellness.vo2MaxRunning}</div>
              <div className="text-[10px] text-white/40">ml/kg/min</div>
            </div>
          )}
        </motion.div>

        {/* HRV Insight - Activity vs Rest */}
        {wellness.hasHrvData && wellness.hrvAfterActivity !== null && wellness.hrvAfterRest !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 rounded-xl p-3 mb-3"
          >
            <div className="text-xs text-white/40 mb-2">HRV nach Sport vs. Ruhetag</div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-green-400">{wellness.hrvAfterActivity}</div>
                <div className="text-[10px] text-white/40">Nach Sport</div>
              </div>
              <div className="text-white/30">vs</div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-400">{wellness.hrvAfterRest}</div>
                <div className="text-[10px] text-white/40">Nach Ruhetag</div>
              </div>
            </div>
            {wellness.hrvAfterActivity > wellness.hrvAfterRest ? (
              <div className="text-xs text-green-400/70 mt-2">
                💪 Dein Körper reagiert positiv auf Training!
              </div>
            ) : wellness.hrvAfterRest > wellness.hrvAfterActivity ? (
              <div className="text-xs text-blue-400/70 mt-2">
                😴 Ruhetage helfen deiner Erholung
              </div>
            ) : null}
          </motion.div>
        )}

        {/* Monthly Steps Mini Chart */}
        {wellness.hasStepsData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white/5 rounded-xl p-3"
          >
            <div className="text-xs text-white/40 mb-2">Ø Schritte pro Monat</div>
            <div className="flex items-end justify-between gap-0.5 h-10">
              {wellness.monthlySteps.map((steps, i) => {
                const height = (steps / maxMonthlySteps) * 100;
                const isBest = wellness.bestMonth.name === monthNames[i];
                return (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div
                      className={`w-full rounded-t ${isBest ? "bg-teal-400" : "bg-teal-400/30"}`}
                      style={{ height: `${Math.max(height, 5)}%` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[9px] text-white/30 mt-1">
              {monthNames.map(m => <span key={m}>{m.charAt(0)}</span>)}
            </div>
            <div className="text-xs text-teal-400 mt-1">
              Bester Monat: {wellness.bestMonth.name} ({formatSteps(wellness.bestMonth.steps)} Ø/Tag)
            </div>
          </motion.div>
        )}
      </div>
    </SlideWrapper>
  );
}
