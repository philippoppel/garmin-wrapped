"use client";

import { motion } from "framer-motion";
import SlideWrapper from "./SlideWrapper";
import { YearStats } from "@/lib/types/activity";
import CountingNumber from "../animations/CountingNumber";

interface StreakSlideProps {
  stats: YearStats;
}

// Animated fire SVG component
function AnimatedFire({ size = 60, intensity = 1 }: { size?: number; intensity?: number }) {
  const flames = intensity >= 3 ? 5 : intensity >= 2 ? 3 : 2;

  return (
    <div className="relative" style={{ width: size, height: size * 1.3 }}>
      <svg viewBox="0 0 100 130" className="w-full h-full">
        <defs>
          <linearGradient id="fireGradient1" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="40%" stopColor="#f97316" />
            <stop offset="70%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#fef3c7" />
          </linearGradient>
          <linearGradient id="fireGradient2" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#fef9c3" />
          </linearGradient>
          <filter id="fireGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main flame */}
        <motion.path
          d="M50 10 Q70 40 65 70 Q60 90 50 100 Q40 90 35 70 Q30 40 50 10"
          fill="url(#fireGradient1)"
          filter="url(#fireGlow)"
          animate={{
            d: [
              "M50 10 Q70 40 65 70 Q60 90 50 100 Q40 90 35 70 Q30 40 50 10",
              "M50 15 Q75 45 60 75 Q55 95 50 100 Q45 95 40 75 Q25 45 50 15",
              "M50 5 Q65 35 70 65 Q65 85 50 100 Q35 85 30 65 Q35 35 50 5",
              "M50 10 Q70 40 65 70 Q60 90 50 100 Q40 90 35 70 Q30 40 50 10",
            ],
          }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Inner flame */}
        <motion.path
          d="M50 35 Q60 55 55 75 Q52 90 50 95 Q48 90 45 75 Q40 55 50 35"
          fill="url(#fireGradient2)"
          animate={{
            d: [
              "M50 35 Q60 55 55 75 Q52 90 50 95 Q48 90 45 75 Q40 55 50 35",
              "M50 40 Q65 60 58 78 Q54 92 50 95 Q46 92 42 78 Q35 60 50 40",
              "M50 30 Q58 50 53 72 Q51 88 50 95 Q49 88 47 72 Q42 50 50 30",
              "M50 35 Q60 55 55 75 Q52 90 50 95 Q48 90 45 75 Q40 55 50 35",
            ],
          }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
        />

        {/* Core (brightest part) */}
        <motion.ellipse
          cx="50"
          cy="85"
          rx="8"
          ry="12"
          fill="#fef3c7"
          animate={{
            ry: [12, 15, 10, 12],
            opacity: [1, 0.9, 1, 1],
          }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Sparks */}
        {[...Array(flames)].map((_, i) => (
          <motion.circle
            key={i}
            r="2"
            fill="#fbbf24"
            initial={{ cx: 50, cy: 60, opacity: 0 }}
            animate={{
              cx: [50, 30 + i * 20, 40 + i * 10],
              cy: [60, 20, -10],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// Multiple flames for higher streaks
function FireDisplay({ streak }: { streak: number }) {
  const fireCount = streak >= 30 ? 3 : streak >= 14 ? 2 : 1;
  const intensity = streak >= 30 ? 3 : streak >= 14 ? 2 : 1;

  return (
    <div className="flex items-end gap-1">
      {[...Array(fireCount)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.15, type: "spring", bounce: 0.5 }}
        >
          <AnimatedFire
            size={i === Math.floor(fireCount / 2) ? 70 : 55}
            intensity={intensity}
          />
        </motion.div>
      ))}
    </div>
  );
}

// Calendar heatmap component
function MiniCalendar({ activeDays, year }: { activeDays: string[]; year: number }) {
  const activeDaySet = new Set(activeDays);
  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

  // Generate 12 months x ~4 weeks grid
  const weeks: boolean[][] = [];
  const startDate = new Date(year, 0, 1);

  for (let week = 0; week < 52; week++) {
    const weekData: boolean[] = [];
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + week * 7 + day);
      if (currentDate.getFullYear() === year) {
        const dateStr = currentDate.toISOString().split('T')[0];
        weekData.push(activeDaySet.has(dateStr));
      } else {
        weekData.push(false);
      }
    }
    weeks.push(weekData);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex gap-0.5">
        {weeks.slice(0, 52).map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-0.5">
            {week.map((isActive, dayIndex) => (
              <motion.div
                key={dayIndex}
                className={`w-1.5 h-1.5 rounded-sm ${
                  isActive
                    ? 'bg-gradient-to-br from-orange-400 to-red-500'
                    : 'bg-white/10'
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

export default function StreakSlide({ stats }: StreakSlideProps) {
  const streak = stats.records.longestStreak || 0;
  const activeDays = stats.trainingPatterns?.activeDays || [];
  const year = stats.year;
  const totalActiveDays = activeDays.length;
  const consistency = Math.round((totalActiveDays / 365) * 100);
  const daysPerWeek = Math.round(totalActiveDays / 52 * 10) / 10;

  // Get achievement level
  const getAchievement = () => {
    if (streak >= 30) return { title: "UNAUFHALTSAM", subtitle: "Ein Monat am Stück - absolute Maschine!", level: 3 };
    if (streak >= 14) return { title: "Zwei-Wochen-Warrior", subtitle: "Zwei Wochen durchgehalten!", level: 2 };
    if (streak >= 7) return { title: "Wochensieger", subtitle: "Eine Woche ohne Pause!", level: 1 };
    return { title: "Auf dem Weg", subtitle: `${year + 1} wird dein Jahr der Serien!`, level: 0 };
  };

  const achievement = getAchievement();

  return (
    <SlideWrapper gradient="from-[#1a0a0a] via-[#2d1a0a] to-[#1a0a0a]">
      <div className="text-center w-full max-w-4xl mx-auto px-4">
        {/* Fire Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-2"
        >
          <FireDisplay streak={streak} />
        </motion.div>

        {/* Streak Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", bounce: 0.4 }}
          className="mb-2"
        >
          <div className="flex items-baseline justify-center gap-2">
            <CountingNumber
              value={streak}
              className="text-7xl md:text-9xl font-black bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 bg-clip-text text-transparent"
              delay={0.5}
            />
            <span className="text-2xl md:text-3xl text-orange-400/60 font-light">Tage</span>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-white/50 text-sm"
          >
            längste Serie am Stück
          </motion.p>
        </motion.div>

        {/* Achievement Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          {achievement.level >= 3 ? (
            <div className="relative inline-block">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full blur-xl opacity-50"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="relative bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-black font-black text-xl md:text-2xl px-6 py-2 rounded-full">
                {achievement.title}
              </div>
            </div>
          ) : achievement.level >= 1 ? (
            <div className="inline-block bg-orange-500/20 border border-orange-500/40 px-6 py-2 rounded-full">
              <span className="text-orange-400 font-bold">{achievement.title}</span>
            </div>
          ) : null}
          <p className="text-white/40 text-sm mt-2">{achievement.subtitle}</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-4">
            <div className="text-3xl md:text-4xl font-bold text-orange-400">
              <CountingNumber value={totalActiveDays} delay={0.8} />
            </div>
            <div className="text-xs text-white/50 mt-1">Aktive Tage</div>
          </div>
          <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-2xl p-4">
            <div className="text-3xl md:text-4xl font-bold text-red-400">{consistency}%</div>
            <div className="text-xs text-white/50 mt-1">Konsistenz</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-4">
            <div className="text-3xl md:text-4xl font-bold text-yellow-400">{daysPerWeek}</div>
            <div className="text-xs text-white/50 mt-1">Tage/Woche</div>
          </div>
        </motion.div>

        {/* Mini Calendar Heatmap */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-white/5 rounded-2xl p-4"
        >
          <p className="text-white/40 text-xs mb-3">Dein Aktivitäts-Kalender {year}</p>
          <MiniCalendar activeDays={activeDays} year={year} />
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
