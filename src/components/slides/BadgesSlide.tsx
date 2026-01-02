"use client";

import { motion } from "framer-motion";
import SlideWrapper from "./SlideWrapper";
import { YearStats, Badge } from "@/lib/types/activity";

interface BadgesSlideProps {
  stats: YearStats;
}

// Rarity levels for badges
type Rarity = "common" | "rare" | "epic" | "legendary";

interface BadgeWithRarity extends Badge {
  rarity: Rarity;
}

// Determine badge rarity based on difficulty
function getBadgeRarity(badge: Badge): Rarity {
  const id = badge.id.toLowerCase();
  // Legendary - extremely hard
  if (id.includes("marathon") || id.includes("10000") || id.includes("everest") ||
      id.includes("365") || id.includes("ironman") || id.includes("ultra")) {
    return "legendary";
  }
  // Epic - very challenging
  if (id.includes("5000") || id.includes("2500") || id.includes("100") ||
      id.includes("streak-30") || id.includes("streak-14") || id.includes("halfmarathon")) {
    return "epic";
  }
  // Rare - solid achievement
  if (id.includes("1000") || id.includes("500") || id.includes("streak-7") ||
      id.includes("50") || id.includes("consistent")) {
    return "rare";
  }
  // Common - entry level
  return "common";
}

// Rarity configurations
const rarityConfig: Record<Rarity, {
  label: string;
  gradient: string;
  glow: string;
  border: string;
  bg: string;
  textColor: string;
  particleColor: string;
}> = {
  common: {
    label: "COMMON",
    gradient: "from-slate-400 to-slate-500",
    glow: "rgba(148,163,184,0.3)",
    border: "border-slate-500/30",
    bg: "from-slate-500/10 to-slate-600/5",
    textColor: "text-slate-300",
    particleColor: "#94a3b8",
  },
  rare: {
    label: "RARE",
    gradient: "from-blue-400 to-cyan-400",
    glow: "rgba(56,189,248,0.4)",
    border: "border-cyan-500/40",
    bg: "from-cyan-500/15 to-blue-500/10",
    textColor: "text-cyan-300",
    particleColor: "#22d3ee",
  },
  epic: {
    label: "EPIC",
    gradient: "from-purple-400 to-pink-400",
    glow: "rgba(192,132,252,0.5)",
    border: "border-purple-500/50",
    bg: "from-purple-500/20 to-pink-500/10",
    textColor: "text-purple-300",
    particleColor: "#c084fc",
  },
  legendary: {
    label: "LEGENDARY",
    gradient: "from-amber-400 via-yellow-300 to-orange-400",
    glow: "rgba(251,191,36,0.6)",
    border: "border-amber-500/60",
    bg: "from-amber-500/25 to-orange-500/15",
    textColor: "text-amber-300",
    particleColor: "#fbbf24",
  },
};

// Animated celebration background
function CelebrationBackground({ badgeCount }: { badgeCount: number }) {
  const intensity = Math.min(badgeCount / 10, 1);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Radial glow from center */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 400,
          height: 400,
          background: `radial-gradient(circle, rgba(251,191,36,${0.1 * intensity}) 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating particles */}
      {[...Array(Math.floor(8 + badgeCount * 2))].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: i % 3 === 0 ? "#fbbf24" : i % 3 === 1 ? "#c084fc" : "#22d3ee",
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Shooting stars for many badges */}
      {badgeCount >= 5 && [...Array(3)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"
          style={{
            width: 60,
            top: `${20 + i * 30}%`,
            left: "-10%",
          }}
          animate={{
            x: ["0%", "120vw"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: 2 + i * 3,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

// Single badge card with epic styling
function BadgeCard({ badge, index, rarity }: { badge: Badge; index: number; rarity: Rarity }) {
  const config = rarityConfig[rarity];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotateY: -90 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{
        delay: 0.5 + index * 0.12,
        type: "spring",
        stiffness: 100,
        damping: 12,
      }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative group"
    >
      {/* Outer glow */}
      <motion.div
        className="absolute -inset-1 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: config.glow }}
        animate={rarity === "legendary" ? { opacity: [0.3, 0.6, 0.3] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Card */}
      <div className={`relative bg-gradient-to-br ${config.bg} rounded-2xl p-4 border-2 ${config.border} overflow-hidden backdrop-blur-sm`}>
        {/* Shine sweep effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          initial={{ x: "-150%" }}
          animate={{ x: "150%" }}
          transition={{
            delay: 0.8 + index * 0.15,
            duration: 0.8,
            ease: "easeInOut",
          }}
        />

        {/* Legendary sparkle effect */}
        {rarity === "legendary" && (
          <motion.div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)",
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}

        <div className="relative z-10">
          {/* Rarity label */}
          <div className="flex items-center justify-between mb-3">
            <motion.span
              className={`text-[9px] font-black tracking-widest bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
              animate={rarity === "legendary" ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {config.label}
            </motion.span>
          </div>

          {/* Emoji - Big and centered */}
          <motion.div
            className="text-4xl mb-3 text-center"
            animate={rarity !== "common" ? {
              scale: [1, 1.15, 1],
              rotate: rarity === "legendary" ? [0, 5, -5, 0] : [0, 3, -3, 0],
            } : {}}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
          >
            {badge.emoji}
          </motion.div>

          {/* Badge name */}
          <h3 className="text-base font-bold text-white text-center mb-1 leading-tight">
            {badge.name}
          </h3>

          {/* Description */}
          <p className={`text-xs ${config.textColor} text-center opacity-80`}>
            {badge.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Trophy/Rank display based on badge count
function RankDisplay({ badgeCount }: { badgeCount: number }) {
  const getRank = () => {
    if (badgeCount >= 15) return { emoji: "👑", title: "Legende", color: "from-amber-400 to-yellow-300" };
    if (badgeCount >= 10) return { emoji: "🏆", title: "Champion", color: "from-yellow-400 to-orange-400" };
    if (badgeCount >= 7) return { emoji: "⭐", title: "Aufsteiger", color: "from-purple-400 to-pink-400" };
    if (badgeCount >= 4) return { emoji: "🎯", title: "Sammler", color: "from-cyan-400 to-blue-400" };
    return { emoji: "🌟", title: "Starter", color: "from-slate-400 to-slate-300" };
  };

  const rank = getRank();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.2, type: "spring" }}
      className="mb-6"
    >
      <motion.div
        className="text-7xl mb-3"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, -5, 5, 0],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {rank.emoji}
      </motion.div>
      <motion.h2
        className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${rank.color} bg-clip-text text-transparent`}
        animate={{
          textShadow: [
            "0 0 20px rgba(251,191,36,0)",
            "0 0 40px rgba(251,191,36,0.3)",
            "0 0 20px rgba(251,191,36,0)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {rank.title}
      </motion.h2>
      <p className="text-white/50 text-sm mt-1">
        {badgeCount} {badgeCount === 1 ? "Achievement" : "Achievements"} freigeschaltet
      </p>
    </motion.div>
  );
}

export default function BadgesSlide({ stats }: BadgesSlideProps) {
  const achievements = stats.achievements;

  if (!achievements || !achievements.hasBadges) {
    return null;
  }

  const badges = achievements.badges;

  // Add rarity to badges and sort by rarity
  const badgesWithRarity: BadgeWithRarity[] = badges.map(badge => ({
    ...badge,
    rarity: getBadgeRarity(badge),
  }));

  // Sort: legendary first, then epic, rare, common
  const rarityOrder: Record<Rarity, number> = { legendary: 0, epic: 1, rare: 2, common: 3 };
  badgesWithRarity.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);

  // Count by rarity
  const rarityCounts = {
    legendary: badgesWithRarity.filter(b => b.rarity === "legendary").length,
    epic: badgesWithRarity.filter(b => b.rarity === "epic").length,
    rare: badgesWithRarity.filter(b => b.rarity === "rare").length,
    common: badgesWithRarity.filter(b => b.rarity === "common").length,
  };

  return (
    <SlideWrapper gradient="from-[#0a0a15] via-[#15152a] to-[#0a0a15]">
      <CelebrationBackground badgeCount={badges.length} />

      <div className="relative z-10 text-center w-full max-w-2xl mx-auto px-4">
        {/* Header with rank */}
        <RankDisplay badgeCount={badges.length} />

        {/* Rarity summary */}
        {badges.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-4 mb-6"
          >
            {rarityCounts.legendary > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-amber-400 text-xs font-bold">{rarityCounts.legendary}</span>
                <span className="text-amber-400/60 text-[10px]">LEGENDARY</span>
              </div>
            )}
            {rarityCounts.epic > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-purple-400 text-xs font-bold">{rarityCounts.epic}</span>
                <span className="text-purple-400/60 text-[10px]">EPIC</span>
              </div>
            )}
            {rarityCounts.rare > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-cyan-400 text-xs font-bold">{rarityCounts.rare}</span>
                <span className="text-cyan-400/60 text-[10px]">RARE</span>
              </div>
            )}
            {rarityCounts.common > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-slate-400 text-xs font-bold">{rarityCounts.common}</span>
                <span className="text-slate-400/60 text-[10px]">COMMON</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Badges Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          {badgesWithRarity.slice(0, 6).map((badge, index) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              index={index}
              rarity={badge.rarity}
            />
          ))}
        </motion.div>

        {/* More badges indicator */}
        {badgesWithRarity.length > 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-white/40 text-sm"
          >
            +{badgesWithRarity.length - 6} weitere Achievements
          </motion.div>
        )}

        {/* Motivational footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, type: "spring" }}
          className="mt-6"
        >
          {badges.length >= 10 ? (
            <p className="text-amber-400 text-lg font-bold">
              Absoluter Wahnsinn! 🔥
            </p>
          ) : badges.length >= 6 ? (
            <p className="text-purple-400 text-base font-medium">
              Beeindruckende Sammlung!
            </p>
          ) : badges.length >= 3 ? (
            <p className="text-cyan-400 text-base">
              Du bist auf dem besten Weg!
            </p>
          ) : (
            <p className="text-white/60 text-sm">
              Jede Reise beginnt mit dem ersten Schritt
            </p>
          )}
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
