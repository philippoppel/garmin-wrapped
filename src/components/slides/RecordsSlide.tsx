"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import SlideWrapper from "./SlideWrapper";
import { YearStats } from "@/lib/types/activity";
import { formatTime } from "@/lib/analytics/calculateStats";
import Confetti from "../animations/Confetti";

interface RecordsSlideProps {
  stats: YearStats;
}

// Animated trophy SVG
function AnimatedTrophy() {
  return (
    <div className="relative w-24 h-24">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="trophyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="trophyShine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0" />
            <stop offset="50%" stopColor="#fef3c7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
          </linearGradient>
          <filter id="trophyGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Trophy cup */}
        <motion.path
          d="M30 20 L70 20 L65 50 Q50 60 35 50 L30 20 Z"
          fill="url(#trophyGradient)"
          filter="url(#trophyGlow)"
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
        />

        {/* Left handle */}
        <motion.path
          d="M30 25 Q15 25 15 40 Q15 50 30 50"
          fill="none"
          stroke="url(#trophyGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />

        {/* Right handle */}
        <motion.path
          d="M70 25 Q85 25 85 40 Q85 50 70 50"
          fill="none"
          stroke="url(#trophyGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />

        {/* Stem */}
        <motion.rect
          x="45"
          y="55"
          width="10"
          height="15"
          fill="url(#trophyGradient)"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.6 }}
          style={{ transformOrigin: "50px 55px" }}
        />

        {/* Base */}
        <motion.rect
          x="35"
          y="70"
          width="30"
          height="8"
          rx="2"
          fill="url(#trophyGradient)"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7 }}
          style={{ transformOrigin: "50px 74px" }}
        />

        {/* Star on trophy */}
        <motion.path
          d="M50 28 L52 34 L58 34 L53 38 L55 44 L50 40 L45 44 L47 38 L42 34 L48 34 Z"
          fill="#fef3c7"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.8, type: "spring", bounce: 0.6 }}
          style={{ transformOrigin: "50px 36px" }}
        />

        {/* Shine effect */}
        <motion.rect
          x="32"
          y="20"
          width="8"
          height="35"
          fill="url(#trophyShine)"
          initial={{ x: 32 }}
          animate={{ x: 70 }}
          transition={{ delay: 1, duration: 0.6, ease: "easeInOut" }}
        />
      </svg>

      {/* Sparkles */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2"
          style={{
            left: `${20 + i * 20}%`,
            top: `${10 + (i % 2) * 20}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            delay: 1.2 + i * 0.15,
            duration: 0.8,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        >
          <svg viewBox="0 0 20 20" className="w-full h-full">
            <path
              d="M10 0 L11 8 L20 10 L11 12 L10 20 L9 12 L0 10 L9 8 Z"
              fill="#fef3c7"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

// Record card component
function RecordCard({
  title,
  value,
  subtitle,
  icon,
  gradient,
  delay,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  gradient: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, type: "spring", bounce: 0.3 }}
      className={`relative bg-gradient-to-br ${gradient} border border-white/10 rounded-2xl p-4 overflow-hidden`}
    >
      {/* Gradient bar at top */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.4 }}
        style={{ transformOrigin: "left" }}
      />

      {/* Icon */}
      <div className="w-10 h-10 mb-2 text-white/80">{icon}</div>

      {/* Title */}
      <div className="text-xs text-white/50 uppercase tracking-wider">{title}</div>

      {/* Value */}
      <motion.div
        className="text-2xl font-bold text-white mt-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3 }}
      >
        {value}
      </motion.div>

      {/* Subtitle */}
      {subtitle && (
        <div className="text-xs text-white/40 mt-1 truncate">{subtitle}</div>
      )}

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{ delay: delay + 0.4, duration: 0.8 }}
      />
    </motion.div>
  );
}

function MiniCalendar({ activeDays, year }: { activeDays: string[]; year: number }) {
  const activeDaySet = new Set(activeDays);

  const weeks: boolean[][] = [];
  const startDate = new Date(year, 0, 1);

  for (let week = 0; week < 52; week++) {
    const weekData: boolean[] = [];
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + week * 7 + day);
      if (currentDate.getFullYear() === year) {
        const dateStr = currentDate.toISOString().split("T")[0];
        weekData.push(activeDaySet.has(dateStr));
      } else {
        weekData.push(false);
      }
    }
    weeks.push(weekData);
  }

  return (
    <div className="w-full">
      <div className="flex gap-0.5 justify-center">
        {weeks.slice(0, 52).map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-0.5">
            {week.map((isActive, dayIndex) => (
              <motion.div
                key={dayIndex}
                className={`w-1.5 h-1.5 rounded-sm ${
                  isActive
                    ? "bg-gradient-to-br from-orange-400 to-red-500"
                    : "bg-white/10"
                }`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + weekIndex * 0.01 }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function RecordsTimeline({ monthCounts }: { monthCounts: number[] }) {
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const maxCount = Math.max(...monthCounts, 1);

  return (
    <div className="mt-3">
      <div className="flex items-end justify-between gap-1 h-10">
        {monthCounts.map((count, index) => {
          const height = (count / maxCount) * 100;
          return (
            <div key={months[index]} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full h-10 rounded-sm bg-white/10 flex items-end">
                <div
                  className="w-full rounded-sm bg-gradient-to-t from-amber-400/70 to-orange-500/80"
                  style={{ height: `${Math.max(height, count > 0 ? 12 : 6)}%` }}
                />
              </div>
              <span className="text-[8px] text-white/40">{months[index]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// SVG Icons for records
const icons = {
  run5k: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 4v16M7 4v16M3 8h4M3 12h4M3 16h4M17 8h4M17 12h4M17 16h4" strokeLinecap="round" />
      <circle cx="10" cy="10" r="1" fill="currentColor" />
    </svg>
  ),
  run10k: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 4v16M15 4v16M9 4v16" strokeLinecap="round" />
      <circle cx="19" cy="12" r="3" />
    </svg>
  ),
  distance: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h18M3 12l4-4M3 12l4 4M21 12l-4-4M21 12l-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  bike: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="5" cy="17" r="3" />
      <circle cx="19" cy="17" r="3" />
      <path d="M12 17V5l4 4M5 17l7-5 7 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  mountain: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 21l4-10 4 10M12 11V3M8 21h8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  streak: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C9.5 5 7 8 7 11c0 2.5 1.5 4.5 3.5 5.5L9 22l3-2 3 2-1.5-5.5C15.5 15.5 17 13.5 17 11c0-3-2.5-6-5-9z" />
    </svg>
  ),
};

export default function RecordsSlide({ stats }: RecordsSlideProps) {
  const { records } = stats;
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("de-DE", { day: "numeric", month: "short" });
  };

  const formatShortDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("de-DE", { day: "numeric", month: "long" });
  };

  const getRecordDate = (record: any) => {
    return record?.date || record?.startTimeLocal || record?.startTimeGMT || null;
  };

  const recordItems: Array<{
    icon: React.ReactNode;
    title: string;
    value: string;
    subtitle?: string;
    gradient: string;
    date?: Date | string | null;
  }> = [];

  if (records.fastest5K) {
    recordItems.push({
      icon: icons.run5k,
      title: "Schnellste 5K",
      value: formatTime(records.fastest5K.time),
      subtitle: formatDate(records.fastest5K.date),
      gradient: "from-orange-500/20 to-red-500/20",
      date: records.fastest5K.date,
    });
  }

  if (records.fastest10K) {
    recordItems.push({
      icon: icons.run10k,
      title: "Schnellste 10K",
      value: formatTime(records.fastest10K.time),
      subtitle: formatDate(records.fastest10K.date),
      gradient: "from-red-500/20 to-pink-500/20",
      date: records.fastest10K.date,
    });
  }

  if (records.longestRun) {
    recordItems.push({
      icon: icons.distance,
      title: "Längster Lauf",
      value: `${(records.longestRun.distance / 1000).toFixed(1)} km`,
      subtitle: records.longestRun.name || "",
      gradient: "from-blue-500/20 to-cyan-500/20",
      date: getRecordDate(records.longestRun),
    });
  }

  if (records.longestRide) {
    recordItems.push({
      icon: icons.bike,
      title: "Längste Fahrt",
      value: `${(records.longestRide.distance / 1000).toFixed(1)} km`,
      subtitle: records.longestRide.name || "",
      gradient: "from-green-500/20 to-teal-500/20",
      date: getRecordDate(records.longestRide),
    });
  }

  if (records.mostElevation) {
    recordItems.push({
      icon: icons.mountain,
      title: "Meiste Höhenmeter",
      value: `${records.mostElevation.elevationGain?.toFixed(0) || 0} m`,
      subtitle: records.mostElevation.name || "",
      gradient: "from-purple-500/20 to-indigo-500/20",
      date: getRecordDate(records.mostElevation),
    });
  }

  if (records.longestStreak >= 3) {
    recordItems.push({
      icon: icons.streak,
      title: "Längste Serie",
      value: `${records.longestStreak} Tage`,
      subtitle: "am Stück",
      gradient: "from-amber-500/20 to-orange-500/20",
      date: null,
    });
  }

  const displayRecords = recordItems.slice(0, 6);
  const activeDays = stats.trainingPatterns?.activeDays || [];
  const totalActiveDays = activeDays.length;
  const streak = records.longestStreak || 0;
  const consistency = stats.trainingPatterns?.consistency ??
    (totalActiveDays > 0 ? Math.round((totalActiveDays / 365) * 100) : 0);
  const daysPerWeek = totalActiveDays > 0 ? Math.round((totalActiveDays / 52) * 10) / 10 : 0;

  const recordDates = recordItems
    .map((item) => item.date)
    .filter((d): d is string | Date => d != null)
    .map((date) => (typeof date === "string" ? new Date(date) : date))
    .filter((date): date is Date => date != null && !Number.isNaN(date.getTime()));

  const firstRecordDate = recordDates.length > 0
    ? new Date(Math.min(...recordDates.map((d) => d.getTime())))
    : null;

  const monthCounts = new Array(12).fill(0);
  recordDates.forEach((date) => {
    monthCounts[date.getMonth()] += 1;
  });
  const bestMonthIndex = monthCounts.indexOf(Math.max(...monthCounts, 0));
  const monthNames = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
  const bestMonthLabel = monthCounts[bestMonthIndex] > 0 ? monthNames[bestMonthIndex] : "--";

  return (
    <SlideWrapper gradient="from-[#2a1a0a] via-[#3d2a0f] to-[#2a1a0a]">
      <Confetti isActive={showConfetti} duration={3000} particleCount={60} />

      <div className="text-center w-full max-w-5xl mx-auto px-4 relative z-10">
        {/* Trophy Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="flex justify-center mb-4"
        >
          <AnimatedTrophy />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-6"
        >
          Deine Rekorde
        </motion.h2>

        {/* Insights row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-orange-500/15 to-red-500/10 border border-orange-500/30 rounded-2xl p-4 text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-white/50">Längste Serie</div>
                <div className="text-3xl font-bold text-orange-300">{streak} Tage</div>
                <div className="text-[11px] text-white/40">am Stück</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white/5 border border-white/10 rounded-lg px-2 py-1">
                  <div className="text-sm font-semibold text-orange-200">{totalActiveDays}</div>
                  <div className="text-[9px] text-white/50">Aktive Tage</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg px-2 py-1">
                  <div className="text-sm font-semibold text-orange-200">{consistency}%</div>
                  <div className="text-[9px] text-white/50">Konsistenz</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg px-2 py-1">
                  <div className="text-sm font-semibold text-orange-200">{daysPerWeek}</div>
                  <div className="text-[9px] text-white/50">Tage/Woche</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-2xl p-4 text-left"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-white/50">Rekord-Überblick</div>
                <div className="text-3xl font-bold text-amber-200">{recordItems.length}</div>
                <div className="text-[11px] text-white/40">Rekorde gesamt</div>
              </div>
              <div className="text-right text-[11px] text-white/50 space-y-1">
                <div>Erster Rekord: {firstRecordDate ? formatShortDate(firstRecordDate) : "--"}</div>
                <div>Rekord-Monat: {bestMonthLabel}</div>
              </div>
            </div>
            <RecordsTimeline monthCounts={monthCounts} />
          </motion.div>
        </div>

        {/* Records Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {displayRecords.map((record, index) => (
            <RecordCard
              key={record.title}
              {...record}
              delay={0.5 + index * 0.1}
            />
          ))}
        </div>

        {displayRecords.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/50 mt-8"
          >
            Noch keine Rekorde - weiter trainieren!
          </motion.p>
        )}

        {/* Motivational footer */}
        {displayRecords.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-white/40 text-sm mt-6"
          >
            {displayRecords.length >= 5
              ? "Beeindruckende Sammlung! Du hast das Jahr dominiert."
              : "Jeder Rekord ist ein Meilenstein auf deinem Weg."}
          </motion.p>
        )}

        {/* Activity calendar */}
        {activeDays.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="bg-white/5 rounded-2xl p-4 mt-5"
          >
            <p className="text-white/40 text-xs mb-2">Dein Aktivitäts-Kalender {stats.year}</p>
            <MiniCalendar activeDays={activeDays} year={stats.year} />
          </motion.div>
        )}
      </div>
    </SlideWrapper>
  );
}
