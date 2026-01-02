"use client";

import { motion } from "framer-motion";
import SlideWrapper from "./SlideWrapper";
import { YearStats, ActivityType } from "@/lib/types/activity";
import CountingNumber from "../animations/CountingNumber";
import { useMemo } from "react";

interface SportBreakdownSlideProps {
  stats: YearStats;
}

// Sport configuration for main activity types
const sportConfig: Record<ActivityType, { name: string; color: string; solidColor: string }> = {
  running: { name: "Laufen", color: "#f97316", solidColor: "#f97316" },
  cycling: { name: "Radfahren", color: "#06b6d4", solidColor: "#06b6d4" },
  swimming: { name: "Schwimmen", color: "#3b82f6", solidColor: "#3b82f6" },
  walking: { name: "Gehen", color: "#22c55e", solidColor: "#22c55e" },
  hiking: { name: "Wandern", color: "#eab308", solidColor: "#eab308" },
  strength: { name: "Kraft", color: "#ef4444", solidColor: "#ef4444" },
  yoga: { name: "Yoga", color: "#a855f7", solidColor: "#a855f7" },
  other: { name: "Sonstiges", color: "#6b7280", solidColor: "#6b7280" },
};

// Colors for "other" breakdown items
const otherColors: Record<string, string> = {
  multi_sport: "#ec4899", // Pink
  stand_up_paddleboarding_v2: "#14b8a6", // Teal
  soccer: "#84cc16", // Lime
  volleyball: "#f59e0b", // Amber
  beach_volleyball: "#fbbf24", // Yellow
  tennis: "#10b981", // Emerald
  skiing: "#60a5fa", // Blue
  snowboarding: "#818cf8", // Indigo
};

// SVG Icons for each sport
function SportIcon({ type, className = "w-8 h-8" }: { type: ActivityType; className?: string }) {
  const color = sportConfig[type]?.color || "#6b7280";

  const icons: Record<ActivityType, JSX.Element> = {
    running: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2"/>
        <path d="M7 20l3-8 2 2 4-6"/>
        <path d="M17 20l-2-6-4 2"/>
      </svg>
    ),
    cycling: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="17" r="3"/>
        <circle cx="18" cy="17" r="3"/>
        <path d="M6 17l6-8 4 4 2-2"/>
        <circle cx="12" cy="9" r="1.5" fill={color}/>
      </svg>
    ),
    swimming: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 18c1.5-1 3-1.5 4.5-.5s3 1.5 4.5.5 3-1.5 4.5-.5 3 1.5 4.5.5"/>
        <path d="M6 12l4-4 4 4"/>
        <circle cx="14" cy="6" r="2"/>
      </svg>
    ),
    walking: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="4" r="2"/>
        <path d="M12 6v6l-2 4-2 4"/>
        <path d="M12 12l2 4 2 4"/>
      </svg>
    ),
    hiking: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20l4-12 4 6 4-10 4 16"/>
      </svg>
    ),
    strength: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4v16M18 4v16M6 8h12M6 16h12M2 8h4M2 16h4M18 8h4M18 16h4"/>
      </svg>
    ),
    yoga: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2"/>
        <path d="M4 20l8-8 8 8"/>
        <path d="M12 12v-2"/>
      </svg>
    ),
    other: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
  };

  return icons[type] || icons.other;
}

// Animated Donut Chart
function DonutChart({ segments, size = 200 }: { segments: Array<{ percent: number; color: string; name: string }>; size?: number }) {
  const radius = 80;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
        <defs>
          <filter id="donutGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />

        {/* Animated segments */}
        {segments.map((segment, index) => {
          const offset = (accumulatedPercent / 100) * circumference;
          const dash = (segment.percent / 100) * circumference;
          accumulatedPercent += segment.percent;

          return (
            <motion.circle
              key={segment.name}
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              filter="url(#donutGlow)"
              strokeDasharray={`${dash} ${circumference}`}
              strokeDashoffset={-offset}
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${dash} ${circumference}` }}
              transition={{ duration: 1, delay: 0.3 + index * 0.2, ease: "easeOut" }}
            />
          );
        })}
      </svg>
    </div>
  );
}

// Determine athlete type based on sport mix
function getAthleteType(sports: Array<[string, { count: number }]>, total: number): { type: string; description: string } {
  if (sports.length === 0) return { type: "Sportler", description: "Aktiv unterwegs" };

  const topPercent = (sports[0][1].count / total) * 100;
  const topSport = sports[0][0];
  const hasStrength = sports.some(([s]) => s === "strength");
  const hasEndurance = sports.some(([s]) => ["running", "cycling", "swimming"].includes(s));
  const sportCount = sports.length;

  if (topPercent > 70) {
    if (topSport === "cycling") return { type: "Radsport-Enthusiast", description: "Das Rad ist dein Leben" };
    if (topSport === "running") return { type: "Läufer durch und durch", description: "Born to run" };
    if (topSport === "swimming") return { type: "Wasserratte", description: "Im Wasser zuhause" };
    if (topSport === "strength") return { type: "Kraft-Maschine", description: "Stärke ist dein Fokus" };
    return { type: "Spezialist", description: `${sportConfig[topSport as ActivityType]?.name} ist deine Passion` };
  }

  if (hasStrength && hasEndurance) {
    return { type: "Allrounder", description: "Kraft & Ausdauer perfekt kombiniert" };
  }

  if (sportCount >= 4) {
    return { type: "Multi-Sport Athlet", description: "Vielseitig und flexibel" };
  }

  if (hasEndurance && sportCount >= 2) {
    return { type: "Ausdauer-Typ", description: "Cardio ist dein Element" };
  }

  return { type: "Aktiver Lifestyle", description: "Bewegung ist dir wichtig" };
}

// Helper type for expanded sport items
interface ExpandedSportItem {
  key: string;
  name: string;
  count: number;
  totalDuration: number;
  color: string;
  isOther: boolean;
  originalType?: ActivityType;
}

export default function SportBreakdownSlide({ stats }: SportBreakdownSlideProps) {
  // Build expanded sports list with "other" breakdown
  const expandedSports = useMemo(() => {
    const items: ExpandedSportItem[] = [];

    // Add main sports (except "other")
    Object.entries(stats.byType)
      .filter(([type, s]) => s && s.count > 0 && type !== "other")
      .forEach(([type, sportStats]) => {
        items.push({
          key: type,
          name: sportConfig[type as ActivityType]?.name || type,
          count: sportStats.count,
          totalDuration: sportStats.totalDuration,
          color: sportConfig[type as ActivityType]?.solidColor || "#6b7280",
          isOther: false,
          originalType: type as ActivityType,
        });
      });

    // Add expanded "other" breakdown
    if (stats.otherBreakdown) {
      Object.entries(stats.otherBreakdown)
        .filter(([, data]) => data.count > 0)
        .forEach(([typeKey, data]) => {
          items.push({
            key: `other_${typeKey}`,
            name: data.displayName,
            count: data.count,
            totalDuration: data.totalDuration,
            color: otherColors[typeKey] || "#6b7280",
            isOther: true,
          });
        });
    } else if (stats.byType.other && stats.byType.other.count > 0) {
      // Fallback: show as single "Sonstiges" if no breakdown available
      items.push({
        key: "other",
        name: "Sonstiges",
        count: stats.byType.other.count,
        totalDuration: stats.byType.other.totalDuration,
        color: "#6b7280",
        isOther: true,
        originalType: "other",
      });
    }

    // Sort by count
    return items.sort((a, b) => b.count - a.count);
  }, [stats.byType, stats.otherBreakdown]);

  // Original sports for athlete type calculation (without expansion)
  const sports = useMemo(() =>
    Object.entries(stats.byType)
      .filter(([, s]) => s && s.count > 0)
      .sort(([, a], [, b]) => b.count - a.count),
    [stats.byType]
  );

  const totalActivities = stats.totalActivities;
  const topItem = expandedSports[0];
  const topSport = topItem?.originalType || "other";

  // Prepare donut chart data from expanded list
  const chartSegments = expandedSports.slice(0, 6).map((item) => ({
    percent: (item.count / totalActivities) * 100,
    color: item.color,
    name: item.name,
  }));

  // Get athlete type (uses original sports grouping)
  const athleteType = getAthleteType(sports, totalActivities);

  // Fun fact for top sport
  const funFact = useMemo(() => {
    if (!topItem) return "";
    const hours = topItem.totalDuration;
    const days = (hours / 24).toFixed(1);
    return `${Math.round(hours)}h im ${topSport === "cycling" ? "Sattel" : topSport === "swimming" ? "Wasser" : "Training"} = ${days} Tage non-stop`;
  }, [topItem, topSport]);

  return (
    <SlideWrapper gradient="from-[#0a2818] via-[#0f3d2a] to-[#0a2818]">
      <div className="text-center w-full max-w-4xl mx-auto px-4">

        {/* Athlete Type Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-2 md:mb-8"
        >
          <p className="text-white/40 text-[10px] md:text-sm uppercase tracking-wider mb-0.5 md:mb-2">Dein Athleten-Typ</p>
          <h2 className="text-xl sm:text-2xl md:text-5xl font-bold text-white mb-0.5 md:mb-2">{athleteType.type}</h2>
          <p className="text-white/50 text-xs md:text-lg">{athleteType.description}</p>
        </motion.div>

        {/* Main Content: Donut + Legend */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-12 mb-3 md:mb-8">
          {/* Donut Chart - Smaller on mobile */}
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.3, delay: 0.2 }}
            className="relative flex-shrink-0 overflow-hidden"
          >
            <div className="w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] md:w-[260px] md:h-[260px]">
              <DonutChart segments={chartSegments} size={260} />
            </div>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <SportIcon type={topSport} className="w-6 h-6 sm:w-8 sm:h-8 md:w-16 md:h-16 mb-0 md:mb-2" />
              <span className="text-white/60 text-[8px] sm:text-[10px] md:text-sm font-medium">#1</span>
            </div>
          </motion.div>

          {/* Legend */}
          <div className="relative z-10 space-y-1.5 md:space-y-3 w-full max-w-xs sm:max-w-sm md:max-w-none md:w-auto">
            {expandedSports.slice(0, 5).map((item, index) => {
              const percent = Math.round((item.count / totalActivities) * 100);

              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.08 }}
                  className="flex items-center gap-1.5 md:gap-3 bg-black/20 rounded-lg px-2 py-1.5 md:px-0 md:py-0 md:bg-transparent"
                >
                  {/* Color dot */}
                  <div
                    className="w-2 h-2 md:w-3 md:h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {item.originalType ? (
                      <SportIcon type={item.originalType} className="w-4 h-4 md:w-6 md:h-6" />
                    ) : (
                      <div className="w-4 h-4 md:w-6 md:h-6 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 md:w-4 md:h-4 rounded-full" style={{ backgroundColor: item.color, opacity: 0.6 }} />
                      </div>
                    )}
                  </div>
                  {/* Name - fixed width on mobile */}
                  <span className="text-white text-xs md:text-base font-medium w-20 md:w-auto truncate">{item.name}</span>
                  {/* Count */}
                  <span className="text-white text-xs md:text-base font-bold tabular-nums ml-auto">{item.count}x</span>
                  {/* Percent */}
                  <span className="text-white/50 text-[10px] md:text-sm tabular-nums">({percent}%)</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Fun Fact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="inline-flex items-center gap-2 md:gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2 md:px-6 md:py-3 max-w-full"
        >
          <SportIcon type={topSport} className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
          <span className="text-white/70 text-xs md:text-base truncate">{funFact}</span>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
