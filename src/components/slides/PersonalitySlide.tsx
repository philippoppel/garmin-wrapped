"use client";

import { motion } from "framer-motion";
import SlideWrapper from "./SlideWrapper";
import { YearStats, TrainingPersonality } from "@/lib/types/activity";

interface PersonalitySlideProps {
  stats: YearStats;
}

// SVG Icons for each personality type
const personalityIcons: Record<TrainingPersonality, React.ReactNode> = {
  "Der Frühaufsteher": (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="sunriseGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#fef3c7" />
        </linearGradient>
      </defs>
      {/* Horizon line */}
      <motion.path
        d="M10 70 Q50 65 90 70"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />
      {/* Sun rising */}
      <motion.circle
        cx="50"
        cy="60"
        r="25"
        fill="url(#sunriseGradient)"
        initial={{ cy: 85, opacity: 0 }}
        animate={{ cy: 50, opacity: 1 }}
        transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
      />
      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <motion.line
          key={angle}
          x1="50"
          y1="50"
          x2={50 + Math.cos((angle * Math.PI) / 180) * 40}
          y2={50 + Math.sin((angle * Math.PI) / 180) * 40}
          stroke="#fbbf24"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 0.8, pathLength: 1 }}
          transition={{ delay: 0.8 + i * 0.1 }}
        />
      ))}
    </svg>
  ),
  "Der Abendläufer": (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0e7ff" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      {/* Moon */}
      <motion.circle
        cx="50"
        cy="45"
        r="25"
        fill="url(#moonGradient)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
      />
      {/* Moon shadow for crescent effect */}
      <motion.circle
        cx="60"
        cy="40"
        r="20"
        fill="#1e1b4b"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      />
      {/* Stars */}
      {[[25, 25], [75, 30], [20, 70], [80, 65], [45, 85]].map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r="2"
          fill="#fef3c7"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1, 0.8], opacity: [0, 1, 0.6] }}
          transition={{ delay: 0.6 + i * 0.1, duration: 1, repeat: Infinity, repeatDelay: 2 }}
        />
      ))}
    </svg>
  ),
  "Der Wochenend-Krieger": (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="swordGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      {/* Crossed swords */}
      <motion.path
        d="M25 75 L75 25 M70 25 L75 25 L75 30"
        stroke="url(#swordGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />
      <motion.path
        d="M75 75 L25 25 M30 25 L25 25 L25 30"
        stroke="url(#swordGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      {/* Shield */}
      <motion.path
        d="M50 45 L65 55 L50 80 L35 55 Z"
        fill="rgba(220, 38, 38, 0.3)"
        stroke="#dc2626"
        strokeWidth="2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
        style={{ transformOrigin: "50px 60px" }}
      />
    </svg>
  ),
  "Der Konsistenz-König": (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="crownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      {/* Crown */}
      <motion.path
        d="M20 70 L20 45 L35 55 L50 35 L65 55 L80 45 L80 70 Z"
        fill="url(#crownGradient)"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
      />
      {/* Gems */}
      <motion.circle cx="35" cy="55" r="4" fill="#ef4444" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} />
      <motion.circle cx="50" cy="48" r="5" fill="#3b82f6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 }} />
      <motion.circle cx="65" cy="55" r="4" fill="#10b981" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 }} />
      {/* Crown points */}
      <motion.circle cx="20" cy="42" r="3" fill="#fef3c7" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }} />
      <motion.circle cx="50" cy="32" r="4" fill="#fef3c7" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9 }} />
      <motion.circle cx="80" cy="42" r="3" fill="#fef3c7" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }} />
    </svg>
  ),
  "Der Kilometersammler": (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      {/* Winding path */}
      <motion.path
        d="M10 80 Q30 60 50 65 T90 40 Q95 30 85 20"
        stroke="url(#pathGradient)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      {/* Distance markers */}
      {[30, 55, 80].map((x, i) => (
        <motion.g key={i}>
          <motion.circle
            cx={x}
            cy={70 - i * 15}
            r="4"
            fill="#10b981"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.2 }}
          />
        </motion.g>
      ))}
      {/* Destination flag */}
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2, type: "spring" }} style={{ transformOrigin: "85px 20px" }}>
        <rect x="85" y="15" width="2" height="20" fill="#fbbf24" />
        <path d="M87 15 L97 20 L87 25 Z" fill="#ef4444" />
      </motion.g>
    </svg>
  ),
  "Der Höhenflügler": (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="eagleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {/* Mountains */}
      <motion.path
        d="M0 85 L30 45 L45 60 L70 30 L100 85 Z"
        fill="rgba(99, 102, 241, 0.2)"
        stroke="#6366f1"
        strokeWidth="2"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      {/* Eagle/bird shape */}
      <motion.path
        d="M50 35 Q35 25 20 30 Q30 35 35 40 L50 35 L65 40 Q70 35 80 30 Q65 25 50 35"
        fill="url(#eagleGradient)"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      />
      {/* Eagle body */}
      <motion.ellipse
        cx="50"
        cy="38"
        rx="5"
        ry="8"
        fill="#4f46e5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7 }}
      />
    </svg>
  ),
  "Der Allrounder": (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="targetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {/* Target rings */}
      {[35, 25, 15, 5].map((r, i) => (
        <motion.circle
          key={r}
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={i === 3 ? "#ef4444" : i % 2 === 0 ? "#ffffff" : "url(#targetGradient)"}
          strokeWidth={i === 3 ? 8 : 3}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.2 }}
          style={{ transformOrigin: "50px 50px" }}
        />
      ))}
      {/* Arrow hitting center */}
      <motion.g initial={{ x: -50, y: -50, opacity: 0 }} animate={{ x: 0, y: 0, opacity: 1 }} transition={{ delay: 0.8, type: "spring" }}>
        <path d="M50 50 L35 35" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
        <path d="M30 30 L35 35 L32 38" stroke="#fbbf24" strokeWidth="2" fill="none" />
      </motion.g>
    </svg>
  ),
  "Der Ausdauer-Champion": (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="championGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      {/* Trophy cup */}
      <motion.path
        d="M30 25 L70 25 L65 55 Q50 65 35 55 Z"
        fill="url(#championGradient)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        style={{ transformOrigin: "50px 45px" }}
      />
      {/* Handles */}
      <motion.path
        d="M30 30 Q15 30 15 45 Q15 55 30 55"
        stroke="url(#championGradient)"
        strokeWidth="4"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.4 }}
      />
      <motion.path
        d="M70 30 Q85 30 85 45 Q85 55 70 55"
        stroke="url(#championGradient)"
        strokeWidth="4"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.4 }}
      />
      {/* Base */}
      <motion.rect x="40" y="60" width="20" height="8" fill="url(#championGradient)" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.6 }} style={{ transformOrigin: "50px 60px" }} />
      <motion.rect x="35" y="68" width="30" height="6" rx="2" fill="url(#championGradient)" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.7 }} style={{ transformOrigin: "50px 71px" }} />
      {/* Star */}
      <motion.path
        d="M50 32 L52 38 L58 38 L53 42 L55 48 L50 44 L45 48 L47 42 L42 38 L48 38 Z"
        fill="#fef3c7"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.8, type: "spring" }}
        style={{ transformOrigin: "50px 40px" }}
      />
    </svg>
  ),
};

const personalityConfig: Record<
  TrainingPersonality,
  { gradient: string; description: string; traits: string[] }
> = {
  "Der Frühaufsteher": {
    gradient: "from-orange-500 via-yellow-500 to-pink-500",
    description: "Du startest den Tag, wenn andere noch schlafen",
    traits: ["Diszipliniert", "Energiegeladen", "Morgenmensch"],
  },
  "Der Abendläufer": {
    gradient: "from-purple-600 via-blue-500 to-indigo-600",
    description: "Die Nacht gehört dir und deinem Training",
    traits: ["Nachtaktiv", "Entspannt", "Stress-Abbau-Profi"],
  },
  "Der Wochenend-Krieger": {
    gradient: "from-red-500 via-orange-500 to-yellow-500",
    description: "Am Wochenende gibst du alles",
    traits: ["Intensiv", "Abenteuerlustig", "Work-Life-Balance"],
  },
  "Der Konsistenz-König": {
    gradient: "from-yellow-400 via-amber-500 to-yellow-600",
    description: "Tag für Tag, Woche für Woche - unaufhaltsam",
    traits: ["Zuverlässig", "Diszipliniert", "Unerschütterlich"],
  },
  "Der Kilometersammler": {
    gradient: "from-green-500 via-teal-500 to-cyan-500",
    description: "Distanz ist dein zweiter Vorname",
    traits: ["Ausdauernd", "Zielstrebig", "Unermüdlich"],
  },
  "Der Höhenflügler": {
    gradient: "from-blue-400 via-indigo-500 to-purple-600",
    description: "Je höher, desto besser",
    traits: ["Bergfest", "Abenteurer", "Naturverbunden"],
  },
  "Der Allrounder": {
    gradient: "from-pink-500 via-purple-500 to-indigo-500",
    description: "Vielfalt ist deine Stärke",
    traits: ["Flexibel", "Neugierig", "Multitalent"],
  },
  "Der Ausdauer-Champion": {
    gradient: "from-amber-400 via-orange-500 to-red-500",
    description: "Langstrecken sind dein Revier",
    traits: ["Mental stark", "Geduldig", "Unbesiegbar"],
  },
};

function determinePersonality(stats: YearStats): TrainingPersonality {
  const { trainingPatterns, totalDistance, totalElevation, byType, records } = stats;

  if (trainingPatterns?.trainingPersonality) {
    return trainingPatterns.trainingPersonality;
  }

  const sportTypes = Object.keys(byType);
  if (sportTypes.length >= 4) return "Der Allrounder";
  if (totalElevation > 30000) return "Der Höhenflügler";
  if (records.longestStreak >= 14) return "Der Konsistenz-König";
  if (totalDistance > 3000) return "Der Kilometersammler";
  if (trainingPatterns?.preferredTimeOfDay === "morning") return "Der Frühaufsteher";
  if (trainingPatterns?.preferredTimeOfDay === "evening" || trainingPatterns?.preferredTimeOfDay === "night")
    return "Der Abendläufer";
  if (trainingPatterns?.consistency && trainingPatterns.consistency > 70) return "Der Ausdauer-Champion";

  return "Der Wochenend-Krieger";
}

export default function PersonalitySlide({ stats }: PersonalitySlideProps) {
  const personality = determinePersonality(stats);
  const config = personalityConfig[personality];
  const icon = personalityIcons[personality];

  return (
    <SlideWrapper gradient="from-[#0a0a1a] via-[#1a1a3e] to-[#0a0a1a]">
      <div className="text-center w-full max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white/50 text-lg mb-4"
        >
          Du bist
        </motion.p>

        {/* Icon + Title Row */}
        <div className="flex items-center justify-center gap-6 mb-6">
          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative"
          >
            {/* Glow effect */}
            <motion.div
              className={`absolute inset-0 blur-2xl bg-gradient-to-r ${config.gradient} opacity-30`}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="w-28 h-28 md:w-32 md:h-32 relative">
              {icon}
            </div>
          </motion.div>

          {/* Title */}
          <div className="text-left">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`text-2xl md:text-4xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
            >
              {personality}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/60 text-sm md:text-base mt-1"
            >
              {config.description}
            </motion.p>
          </div>
        </div>

        {/* Traits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {config.traits.map((trait, index) => (
            <motion.div
              key={trait}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className={`px-5 py-2 rounded-full bg-gradient-to-r ${config.gradient} bg-opacity-10 border border-white/10`}
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
              }}
            >
              <span className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent font-medium`}>
                {trait}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
