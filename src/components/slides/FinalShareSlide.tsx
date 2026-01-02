"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Camera, X, Download, Sparkles, Activity, Bike, Footprints,
  Flame, Mountain, Plane, Calendar, Heart, Droplets,
  Pizza, Tv, Zap, Share2, Video, Image, Loader2, Settings2,
  Timer, Trophy, TrendingUp, Moon, Sunrise, Clock, Route,
  Target, Award, Dumbbell, Waves, Check, Home
} from "lucide-react";
import Link from "next/link";
import { YearStats } from "@/lib/types/activity";
import html2canvas from "html2canvas";
import GIF from "gif.js";

interface FinalShareSlideProps {
  stats: YearStats;
}

// ============================================
// FUN FACTS GENERATOR
// ============================================
interface FunFact {
  icon: "pizza" | "plane" | "mountain" | "tv" | "calendar" | "flame" | "heart" | "droplets" | "footprints" | "zap";
  value: string;
  label: string;
  color: string;
  iconColor: string;
}

// Icon component for Fun Facts
function FunFactIcon({ type, className }: { type: FunFact["icon"]; className?: string }) {
  const iconProps = { className: className || "w-8 h-8" };
  switch (type) {
    case "pizza": return <Pizza {...iconProps} />;
    case "plane": return <Plane {...iconProps} />;
    case "mountain": return <Mountain {...iconProps} />;
    case "tv": return <Tv {...iconProps} />;
    case "calendar": return <Calendar {...iconProps} />;
    case "flame": return <Flame {...iconProps} />;
    case "heart": return <Heart {...iconProps} />;
    case "droplets": return <Droplets {...iconProps} />;
    case "footprints": return <Footprints {...iconProps} />;
    case "zap": return <Zap {...iconProps} />;
    default: return <Sparkles {...iconProps} />;
  }
}

interface GeneratedFacts {
  heroFact: FunFact;
  gridFacts: FunFact[];
}

function generateFunFacts(stats: YearStats): GeneratedFacts {
  const calories = stats.totalCalories || stats.totalDistance * 60;
  const distanceKm = stats.totalDistance;
  const elevationM = stats.totalElevation;
  const durationHours = stats.totalDuration;
  const activities = stats.totalActivities;

  // Priority ordered facts for the grid
  const gridFacts: FunFact[] = [];

  // HERO FACT: Sweat Loss (priority) or Calories fallback
  let heroFact: FunFact;

  // Try real data first, otherwise estimate from training duration
  // Average sweat rate: ~1 liter per hour of exercise
  let sweatLossLiters = 0;

  if (stats.wellnessInsights?.estimatedYearlySweatLossMl) {
    sweatLossLiters = stats.wellnessInsights.estimatedYearlySweatLossMl / 1000;
  } else if (durationHours > 10) {
    // Estimate: ~1 liter per hour of training
    sweatLossLiters = durationHours * 1;
  }

  if (sweatLossLiters >= 10) {
    const formattedLiters = Math.round(sweatLossLiters).toLocaleString("de-DE");
    heroFact = {
      icon: "droplets",
      value: `${formattedLiters}L`,
      label: "Schweiß verloren",
      color: "from-cyan-400 to-blue-500",
      iconColor: "text-cyan-400"
    };
  } else {
    heroFact = {
      icon: "flame",
      value: Math.round(calories / 1000).toLocaleString("de-DE") + "k",
      label: "Kalorien verbrannt",
      color: "from-orange-500 to-red-500",
      iconColor: "text-orange-400"
    };
  }

  // HEART BEATS - Priority 1
  if (stats.healthStats?.avgTrainingHR && durationHours > 0) {
    const avgHR = stats.healthStats.avgTrainingHR;
    const estimatedBeats = avgHR * durationHours * 60;
    if (estimatedBeats > 100000) {
      gridFacts.push({
        icon: "heart",
        value: (estimatedBeats / 1000000).toFixed(1) + "M",
        label: "Herzschläge",
        color: "from-red-400 to-pink-500",
        iconColor: "text-red-400"
      });
    }
  }

  // MOUNT EVEREST - Priority 2
  if (elevationM >= 8849) {
    const everests = (elevationM / 8849).toFixed(1);
    gridFacts.push({
      icon: "mountain",
      value: `${everests}×`,
      label: "Mount Everest",
      color: "from-slate-200 to-blue-300",
      iconColor: "text-slate-200"
    });
  }

  // PIZZAS - Priority 3
  if (calories > 0) {
    const pizzas = Math.round(calories / 800);
    if (pizzas > 20) {
      gridFacts.push({
        icon: "pizza",
        value: pizzas.toLocaleString("de-DE"),
        label: "Pizzen verbrannt",
        color: "from-orange-500 to-red-500",
        iconColor: "text-orange-400"
      });
    }
  }

  // TRAINING DAYS - Priority 4
  if (durationHours >= 24) {
    const days = (durationHours / 24).toFixed(1);
    gridFacts.push({
      icon: "calendar",
      value: days,
      label: "Tage trainiert",
      color: "from-indigo-400 to-purple-500",
      iconColor: "text-indigo-400"
    });
  }

  // MARATHONS - Priority 5
  if (distanceKm > 0) {
    const marathons = distanceKm / 42.195;
    if (marathons >= 3) {
      gridFacts.push({
        icon: "footprints",
        value: Math.floor(marathons).toString(),
        label: "Marathon-Distanzen",
        color: "from-green-400 to-emerald-500",
        iconColor: "text-green-400"
      });
    }
  }

  // BERLIN-PARIS - Priority 6
  if (distanceKm >= 500) {
    const trips = (distanceKm / 1050).toFixed(1);
    gridFacts.push({
      icon: "plane",
      value: `${trips}×`,
      label: "Berlin → Paris",
      color: "from-sky-400 to-blue-500",
      iconColor: "text-sky-400"
    });
  }

  // NETFLIX SEASONS - Priority 7
  if (durationHours >= 30) {
    const seasons = (durationHours / 10).toFixed(1);
    gridFacts.push({
      icon: "tv",
      value: seasons,
      label: "Netflix-Staffeln",
      color: "from-red-500 to-rose-500",
      iconColor: "text-red-500"
    });
  }

  // KWH - Priority 8
  if (calories > 50000) {
    const kwh = (calories / 860).toFixed(0);
    gridFacts.push({
      icon: "zap",
      value: kwh,
      label: "kWh Energie",
      color: "from-yellow-400 to-orange-500",
      iconColor: "text-yellow-400"
    });
  }

  // Return hero + top 4 grid facts
  return {
    heroFact,
    gridFacts: gridFacts.slice(0, 4)
  };
}

// ============================================
// SHARE CARD TYPES
// ============================================
type CardType = "fun-facts" | "athletic" | "custom";

// ============================================
// CUSTOM STAT OPTIONS
// ============================================
interface CustomStat {
  id: string;
  label: string;
  icon: React.ReactNode;
  getValue: (stats: YearStats) => string | null;
  available: (stats: YearStats) => boolean;
  category: "distance" | "time" | "health" | "fun" | "records";
}

const CUSTOM_STATS: CustomStat[] = [
  // Distance & Activity
  {
    id: "total-distance",
    label: "Gesamtdistanz",
    icon: <Route className="w-5 h-5" />,
    getValue: (s) => `${s.totalDistance.toLocaleString("de-DE")} km`,
    available: () => true,
    category: "distance",
  },
  {
    id: "total-activities",
    label: "Workouts",
    icon: <Dumbbell className="w-5 h-5" />,
    getValue: (s) => s.totalActivities.toString(),
    available: () => true,
    category: "distance",
  },
  {
    id: "total-elevation",
    label: "Höhenmeter",
    icon: <Mountain className="w-5 h-5" />,
    getValue: (s) => `${Math.round(s.totalElevation).toLocaleString("de-DE")} m`,
    available: (s) => s.totalElevation > 0,
    category: "distance",
  },
  {
    id: "running-distance",
    label: "Lauf-Kilometer",
    icon: <Footprints className="w-5 h-5" />,
    getValue: (s) => s.byType.running ? `${Math.round(s.byType.running.totalDistance).toLocaleString("de-DE")} km` : null,
    available: (s) => !!s.byType.running,
    category: "distance",
  },
  {
    id: "cycling-distance",
    label: "Rad-Kilometer",
    icon: <Bike className="w-5 h-5" />,
    getValue: (s) => s.byType.cycling ? `${Math.round(s.byType.cycling.totalDistance).toLocaleString("de-DE")} km` : null,
    available: (s) => !!s.byType.cycling,
    category: "distance",
  },
  {
    id: "swimming-distance",
    label: "Schwimm-Meter",
    icon: <Waves className="w-5 h-5" />,
    getValue: (s) => s.byType.swimming ? `${Math.round(s.byType.swimming.totalDistance * 1000).toLocaleString("de-DE")} m` : null,
    available: (s) => !!s.byType.swimming,
    category: "distance",
  },
  // Time
  {
    id: "total-time",
    label: "Trainingszeit",
    icon: <Timer className="w-5 h-5" />,
    getValue: (s) => `${Math.round(s.totalDuration)} Std`,
    available: () => true,
    category: "time",
  },
  {
    id: "training-days",
    label: "Trainingstage",
    icon: <Calendar className="w-5 h-5" />,
    getValue: (s) => Math.round(s.totalDuration / 24).toString(),
    available: (s) => s.totalDuration >= 24,
    category: "time",
  },
  {
    id: "longest-streak",
    label: "Längste Serie",
    icon: <TrendingUp className="w-5 h-5" />,
    getValue: (s) => `${s.records.longestStreak} Tage`,
    available: (s) => s.records.longestStreak >= 3,
    category: "time",
  },
  // Health
  {
    id: "total-calories",
    label: "Kalorien",
    icon: <Flame className="w-5 h-5" />,
    getValue: (s) => `${Math.round(s.totalCalories / 1000)}k kcal`,
    available: (s) => s.totalCalories > 0,
    category: "health",
  },
  {
    id: "sweat-loss",
    label: "Schweißverlust",
    icon: <Droplets className="w-5 h-5" />,
    getValue: (s) => s.wellnessInsights?.estimatedYearlySweatLossMl
      ? `${Math.round(s.wellnessInsights.estimatedYearlySweatLossMl / 1000)} Liter`
      : null,
    available: (s) => !!s.wellnessInsights?.estimatedYearlySweatLossMl,
    category: "health",
  },
  {
    id: "heartbeats",
    label: "Herzschläge",
    icon: <Heart className="w-5 h-5" />,
    getValue: (s) => {
      if (!s.healthStats?.avgTrainingHR || s.totalDuration <= 0) return null;
      const beats = s.healthStats.avgTrainingHR * s.totalDuration * 60;
      return `${(beats / 1000000).toFixed(1)}M`;
    },
    available: (s) => !!s.healthStats?.avgTrainingHR && s.totalDuration > 0,
    category: "health",
  },
  {
    id: "avg-hr",
    label: "Ø Herzfrequenz",
    icon: <Heart className="w-5 h-5" />,
    getValue: (s) => s.healthStats?.avgTrainingHR ? `${Math.round(s.healthStats.avgTrainingHR)} bpm` : null,
    available: (s) => !!s.healthStats?.avgTrainingHR,
    category: "health",
  },
  {
    id: "vo2max",
    label: "VO2max",
    icon: <TrendingUp className="w-5 h-5" />,
    getValue: (s) => s.wellnessInsights?.vo2MaxRunning ? `${s.wellnessInsights.vo2MaxRunning}` : null,
    available: (s) => !!s.wellnessInsights?.vo2MaxRunning,
    category: "health",
  },
  {
    id: "steps",
    label: "Schritte",
    icon: <Footprints className="w-5 h-5" />,
    getValue: (s) => s.wellnessInsights?.estimatedYearlySteps
      ? `${(s.wellnessInsights.estimatedYearlySteps / 1000000).toFixed(1)}M`
      : null,
    available: (s) => !!s.wellnessInsights?.estimatedYearlySteps,
    category: "health",
  },
  // Fun comparisons
  {
    id: "pizzas",
    label: "Pizzen verbrannt",
    icon: <Pizza className="w-5 h-5" />,
    getValue: (s) => Math.round(s.totalCalories / 800).toString(),
    available: (s) => s.totalCalories >= 8000,
    category: "fun",
  },
  {
    id: "everest",
    label: "× Mount Everest",
    icon: <Mountain className="w-5 h-5" />,
    getValue: (s) => `${(s.totalElevation / 8849).toFixed(1)}×`,
    available: (s) => s.totalElevation >= 8849,
    category: "fun",
  },
  {
    id: "marathons",
    label: "Marathon-Distanzen",
    icon: <Trophy className="w-5 h-5" />,
    getValue: (s) => Math.floor(s.totalDistance / 42.195).toString(),
    available: (s) => s.totalDistance >= 42.195,
    category: "fun",
  },
  {
    id: "netflix",
    label: "Netflix-Staffeln",
    icon: <Tv className="w-5 h-5" />,
    getValue: (s) => (s.totalDuration / 10).toFixed(0),
    available: (s) => s.totalDuration >= 30,
    category: "fun",
  },
  {
    id: "berlin-paris",
    label: "× Berlin-Paris",
    icon: <Plane className="w-5 h-5" />,
    getValue: (s) => `${(s.totalDistance / 1050).toFixed(1)}×`,
    available: (s) => s.totalDistance >= 500,
    category: "fun",
  },
  {
    id: "energy-kwh",
    label: "kWh Energie",
    icon: <Zap className="w-5 h-5" />,
    getValue: (s) => Math.round(s.totalCalories / 860).toString(),
    available: (s) => s.totalCalories >= 50000,
    category: "fun",
  },
  {
    id: "bathtubs",
    label: "Badewannen Schweiß",
    icon: <Droplets className="w-5 h-5" />,
    getValue: (s) => {
      const sweatL = s.wellnessInsights?.estimatedYearlySweatLossMl
        ? s.wellnessInsights.estimatedYearlySweatLossMl / 1000
        : s.totalDuration * 1;
      return (sweatL / 150).toFixed(1); // ~150L per bathtub
    },
    available: (s) => {
      const sweatL = s.wellnessInsights?.estimatedYearlySweatLossMl
        ? s.wellnessInsights.estimatedYearlySweatLossMl / 1000
        : s.totalDuration * 1;
      return sweatL >= 75; // At least 0.5 bathtubs
    },
    category: "fun",
  },
  {
    id: "burgers",
    label: "Burger verbrannt",
    icon: <Flame className="w-5 h-5" />,
    getValue: (s) => Math.round(s.totalCalories / 550).toString(),
    available: (s) => s.totalCalories >= 5500,
    category: "fun",
  },
  {
    id: "beers",
    label: "Bier abtrainiert",
    icon: <Zap className="w-5 h-5" />,
    getValue: (s) => Math.round(s.totalCalories / 150).toString(),
    available: (s) => s.totalCalories >= 3000,
    category: "fun",
  },
  {
    id: "eiffel",
    label: "× Eiffelturm",
    icon: <Mountain className="w-5 h-5" />,
    getValue: (s) => `${Math.round(s.totalElevation / 324)}×`,
    available: (s) => s.totalElevation >= 324,
    category: "fun",
  },
  {
    id: "moon",
    label: "% zum Mond",
    icon: <Plane className="w-5 h-5" />,
    getValue: (s) => `${(s.totalDistance / 384400 * 100).toFixed(2)}%`,
    available: (s) => s.totalDistance >= 100,
    category: "fun",
  },
  {
    id: "chocolate",
    label: "Tafeln Schoko",
    icon: <Flame className="w-5 h-5" />,
    getValue: (s) => Math.round(s.totalCalories / 530).toString(),
    available: (s) => s.totalCalories >= 5300,
    category: "fun",
  },
  // Records
  {
    id: "fastest-5k",
    label: "Schnellste 5K",
    icon: <Timer className="w-5 h-5" />,
    getValue: (s) => {
      if (!s.records.fastest5K) return null;
      const mins = Math.floor(s.records.fastest5K.time / 60);
      const secs = Math.round(s.records.fastest5K.time % 60);
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    },
    available: (s) => !!s.records.fastest5K,
    category: "records",
  },
  {
    id: "fastest-10k",
    label: "Schnellste 10K",
    icon: <Timer className="w-5 h-5" />,
    getValue: (s) => {
      if (!s.records.fastest10K) return null;
      const mins = Math.floor(s.records.fastest10K.time / 60);
      const secs = Math.round(s.records.fastest10K.time % 60);
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    },
    available: (s) => !!s.records.fastest10K,
    category: "records",
  },
  {
    id: "longest-run",
    label: "Längster Lauf",
    icon: <Route className="w-5 h-5" />,
    getValue: (s) => s.records.longestRun ? `${(s.records.longestRun.distance / 1000).toFixed(1)} km` : null,
    available: (s) => !!s.records.longestRun,
    category: "records",
  },
  {
    id: "longest-ride",
    label: "Längste Radtour",
    icon: <Bike className="w-5 h-5" />,
    getValue: (s) => s.records.longestRide ? `${(s.records.longestRide.distance / 1000).toFixed(0)} km` : null,
    available: (s) => !!s.records.longestRide,
    category: "records",
  },
  {
    id: "most-elevation",
    label: "Meiste Höhenmeter",
    icon: <Mountain className="w-5 h-5" />,
    getValue: (s) => s.records.mostElevation?.elevationGain
      ? `${Math.round(s.records.mostElevation.elevationGain).toLocaleString("de-DE")} m`
      : null,
    available: (s) => !!s.records.mostElevation?.elevationGain,
    category: "records",
  },
];

interface CardTypeConfig {
  id: CardType;
  name: string;
  icon: React.ReactNode;
  available: (stats: YearStats) => boolean;
}

const CARD_TYPES: CardTypeConfig[] = [
  {
    id: "custom",
    name: "Custom",
    icon: <Settings2 className="w-5 h-5" />,
    available: () => true
  },
];

// ============================================
// ANIMATED BACKGROUND
// ============================================
function PartyBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Confetti particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: -20,
            backgroundColor: ["#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3", "#F38181", "#AA96DA"][i % 6],
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, Math.random() * 100 - 50],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        />
      ))}

      {/* Glowing orbs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full blur-3xl"
          style={{
            width: 150 + i * 50,
            height: 150 + i * 50,
            background: `radial-gradient(circle, ${
              ["rgba(255,107,107,0.15)", "rgba(78,205,196,0.15)", "rgba(255,230,109,0.15)", "rgba(170,150,218,0.15)"][i % 4]
            } 0%, transparent 70%)`,
            left: `${15 + i * 20}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// SHARE CARD COMPONENTS
// ============================================

interface MediaProps {
  image: string | null;
  video: string | null;
  type: "image" | "video";
  videoRef: React.RefObject<HTMLVideoElement>;
}

// Media Background Component (shared between cards)
function MediaBackground({ media }: { media: MediaProps }) {
  const hasMedia = media.image || media.video;

  if (!hasMedia) {
    return (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f0f]" />
        <div className="absolute top-20 right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
      </>
    );
  }

  return (
    <>
      <div className="absolute inset-0">
        {media.type === "video" && media.video ? (
          <video
            ref={media.videoRef}
            src={media.video}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : media.image ? (
          <img
            src={media.image}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
    </>
  );
}

// Custom Card with selectable stats
function CustomCard({ stats, media, selectedStats }: { stats: YearStats; media: MediaProps; selectedStats: string[] }) {
  const displayStats = selectedStats
    .map(id => CUSTOM_STATS.find(s => s.id === id))
    .filter((s): s is CustomStat => s !== undefined && s.available(stats))
    .slice(0, 6);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0a0a0a]">
      <MediaBackground media={media} />

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col p-6">
        {/* Hero Header */}
        <div className="text-center mb-auto pt-6">
          <div className="text-white/60 text-[10px] font-bold tracking-[0.3em] uppercase mb-1">Mein Sportjahr</div>
          <div
            className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500"
            style={{
              textShadow: "0 0 40px rgba(6, 182, 212, 0.5), 0 0 80px rgba(139, 92, 246, 0.3)",
              WebkitTextStroke: "1px rgba(255,255,255,0.1)"
            }}
          >
            {stats.year}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-auto">
          <div className="backdrop-blur-sm bg-black/10 border border-white/10 rounded-3xl p-5">
            <div className={`grid ${displayStats.length <= 4 ? "grid-cols-2" : "grid-cols-2"} gap-3`}>
              {displayStats.map((stat, i) => {
                const value = stat.getValue(stats);
                if (!value) return null;

                // First stat is hero (larger)
                const isHero = i === 0;

                return (
                  <div
                    key={stat.id}
                    className={`p-3 text-center ${isHero ? "col-span-2 py-4" : ""}`}
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className={`${isHero ? "text-cyan-400" : "text-white/50"}`}>
                        {stat.icon}
                      </span>
                    </div>
                    <div className={`font-bold text-white ${isHero ? "text-4xl" : "text-2xl"}`}>
                      {value}
                    </div>
                    <div className={`text-white/50 font-medium mt-1 ${isHero ? "text-sm" : "text-xs"}`}>
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Branding with Logo & URL */}
        <div className="flex items-center justify-center gap-2 mt-4 pb-2">
          {/* Mini Logo */}
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <Activity className="w-3 h-3 text-white" />
          </div>
          <div className="text-[11px] text-white/40 font-medium">
            <span className="text-white/60">GWRAP</span>
            <span className="mx-1.5 text-white/20">•</span>
            <span>gwrap.vercel.app</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function FinalShareSlide({ stats }: FinalShareSlideProps) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileVideo, setProfileVideo] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [selectedCard, setSelectedCard] = useState<CardType>("custom");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingProgress, setGeneratingProgress] = useState(0);
  // Initialize with available stats only
  const [selectedCustomStats, setSelectedCustomStats] = useState<string[]>(() => {
    const defaultStats = ["total-distance", "sweat-loss", "total-activities", "total-calories", "heartbeats"];
    const available = defaultStats.filter(id => {
      const stat = CUSTOM_STATS.find(s => s.id === id);
      return stat && stat.available(stats);
    });
    // If not enough defaults available, add more available stats
    if (available.length < 3) {
      const remainingAvailable = CUSTOM_STATS
        .filter(s => s.available(stats) && !available.includes(s.id))
        .map(s => s.id);
      available.push(...remainingAvailable);
    }
    return available.slice(0, 5);
  });
  const cardRef = useRef<HTMLDivElement>(null);
  const mobileCardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null!);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved image
  useEffect(() => {
    const saved = localStorage.getItem("garmin-wrapped-profile-image");
    if (saved) {
      setProfileImage(saved);
      setMediaType("image");
    }
  }, []);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith("video/");
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        if (isVideo) {
          setProfileVideo(dataUrl);
          setProfileImage(null);
          setMediaType("video");
          localStorage.removeItem("garmin-wrapped-profile-image");
        } else {
          setProfileImage(dataUrl);
          setProfileVideo(null);
          setMediaType("image");
          localStorage.setItem("garmin-wrapped-profile-image", dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setProfileImage(null);
    setProfileVideo(null);
    setMediaType("image");
    localStorage.removeItem("garmin-wrapped-profile-image");
  };

  // GIF Export for video
  const handleGifExport = useCallback(async () => {
    // Use mobile ref if on mobile, otherwise desktop ref
    const activeCardRef = window.innerWidth < 1024 ? mobileCardRef.current : cardRef.current;
    if (!activeCardRef || !videoRef.current) return;
    setIsGenerating(true);
    setGeneratingProgress(0);

    try {
      const video = videoRef.current;
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: 1080,
        height: 1920,
        workerScript: "/gif.worker.js",
      });

      const totalFrames = 15;
      const duration = Math.min(video.duration, 3);
      const frameDelay = (duration / totalFrames) * 1000;

      for (let i = 0; i < totalFrames; i++) {
        video.currentTime = (i / totalFrames) * duration;
        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(activeCardRef, {
          scale: 2,
          backgroundColor: null,
          useCORS: true,
        });

        gif.addFrame(canvas, { delay: frameDelay, copy: true });
        setGeneratingProgress(Math.round((i / totalFrames) * 80));
      }

      gif.on("finished", (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `garmin-wrapped-${stats.year}-${selectedCard}.gif`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        setIsGenerating(false);
        setGeneratingProgress(0);
      });

      gif.on("progress", (p: number) => {
        setGeneratingProgress(80 + Math.round(p * 20));
      });

      gif.render();
    } catch (error) {
      console.error("Error generating GIF:", error);
      setIsGenerating(false);
      setGeneratingProgress(0);
    }
  }, [selectedCard, stats.year]);

  // PNG Export for image
  const handleDownload = useCallback(async () => {
    // Use mobile ref if visible, otherwise desktop ref
    const activeCardRef = window.innerWidth < 1024 ? mobileCardRef.current : cardRef.current;
    if (!activeCardRef) return;

    // If video, use GIF export
    if (mediaType === "video" && profileVideo) {
      return handleGifExport();
    }

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(activeCardRef, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `garmin-wrapped-${stats.year}-${selectedCard}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error generating share card:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [selectedCard, stats.year, mediaType, profileVideo, handleGifExport]);

  // Toggle stat selection
  const toggleStat = (statId: string) => {
    setSelectedCustomStats(prev => {
      if (prev.includes(statId)) {
        return prev.filter(id => id !== statId);
      }
      if (prev.length >= 5) {
        return prev; // Max 5 stats
      }
      return [...prev, statId];
    });
  };

  // Randomize stats selection
  const randomizeStats = useCallback(() => {
    const availableStats = CUSTOM_STATS.filter(s => s.available(stats));
    const shuffled = [...availableStats].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 5).map(s => s.id);
    setSelectedCustomStats(selected);
  }, [stats]);

  // Render the card
  const renderCard = () => {
    const media = { image: profileImage, video: profileVideo, type: mediaType, videoRef };
    return <CustomCard stats={stats} media={media} selectedStats={selectedCustomStats} />;
  };

  return (
    <>
      {/* Hidden file input - accessible from both layouts */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleMediaUpload}
        className="hidden"
      />

      {/* ============================================ */}
      {/* DESKTOP LAYOUT */}
      {/* ============================================ */}
      <div className="hidden lg:block slide-container-scroll bg-gradient-to-br from-[#0f0515] via-[#150a20] to-[#0a0510]">
        <PartyBackground />

        <div className="relative z-10 w-full flex flex-row items-center justify-center gap-12 px-4">
          {/* Left Side - Controls */}
          <div className="w-auto max-w-md flex flex-col items-start flex-shrink-0">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-left mb-6"
            >
              <motion.div
                className="mb-4 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Share2 className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-5xl font-black text-white mb-2">Teile dein Jahr!</h1>
              <p className="text-white/40 text-lg">Wähle deinen Style und lade dein Bild</p>
            </motion.div>

            {/* Photo Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full mb-6"
            >
              {!profileImage && !profileVideo ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-6 rounded-2xl bg-gradient-to-r from-white/5 to-white/10 border-2 border-dashed border-white/20 hover:border-white/40 hover:bg-white/5 transition flex items-center justify-center gap-4"
                >
                  <div className="flex gap-2">
                    <Image className="w-7 h-7 text-white/70" />
                    <Video className="w-7 h-7 text-white/70" />
                  </div>
                  <div className="text-left">
                    <span className="text-white font-semibold block text-base">Foto oder Video</span>
                    <span className="text-white/40 text-sm">Video = animiertes GIF</span>
                  </div>
                </button>
              ) : (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-xl overflow-hidden ring-2 ring-white/20">
                      {mediaType === "video" && profileVideo ? (
                        <video src={profileVideo} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                      ) : profileImage ? (
                        <img src={profileImage} alt="" className="w-full h-full object-cover" />
                      ) : null}
                    </div>
                    <button
                      onClick={removeMedia}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium flex items-center gap-2 text-base">
                      {mediaType === "video" ? <Video className="w-4 h-4" /> : <Image className="w-4 h-4" />}
                      {mediaType === "video" ? "Video" : "Foto"}
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-white/50 text-sm hover:text-white/70"
                    >
                      Ändern
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Stat Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full mb-6"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-white/50 text-sm">Wähle deine Stats:</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/30">{selectedCustomStats.length}/5</span>
                  <button
                    onClick={randomizeStats}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 hover:from-purple-500/30 hover:to-pink-500/30 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Zufällig
                  </button>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl border border-white/10 p-3 max-h-[280px] overflow-y-auto">
                {(["distance", "time", "health", "fun", "records"] as const).map(category => {
                  const categoryStats = CUSTOM_STATS.filter(s => s.category === category && s.available(stats));
                  if (categoryStats.length === 0) return null;

                  const categoryLabels = {
                    distance: "Distanz & Aktivität",
                    time: "Zeit & Streak",
                    health: "Gesundheit",
                    fun: "Fun Facts",
                    records: "Rekorde",
                  };

                  return (
                    <div key={category} className="mb-3 last:mb-0">
                      <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2 px-1">
                        {categoryLabels[category]}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {categoryStats.map(stat => {
                          const isSelected = selectedCustomStats.includes(stat.id);
                          const value = stat.getValue(stats);

                          return (
                            <button
                              key={stat.id}
                              onClick={() => toggleStat(stat.id)}
                              disabled={!isSelected && selectedCustomStats.length >= 5}
                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                                isSelected
                                  ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-300"
                                  : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed"
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                              {stat.icon}
                              <span>{stat.label}</span>
                              {value && <span className="text-white/40 ml-1">({value})</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Download Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full"
            >
              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-xl flex items-center justify-center gap-3 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/25 transition disabled:opacity-70 relative overflow-hidden"
              >
                {isGenerating && generatingProgress > 0 && (
                  <div
                    className="absolute inset-0 bg-white/20 transition-all duration-300"
                    style={{ width: `${generatingProgress}%` }}
                  />
                )}
                <span className="relative flex items-center gap-3">
                  {isGenerating ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Download className="w-6 h-6" />
                  )}
                  {isGenerating
                    ? `${mediaType === "video" ? "GIF" : "PNG"} wird erstellt... ${generatingProgress}%`
                    : mediaType === "video"
                      ? "Download als GIF"
                      : "Download für Instagram"
                  }
                </span>
              </button>
              <p className="text-center text-white/30 text-sm mt-3">
                {mediaType === "video"
                  ? "Animiertes GIF aus deinem Video"
                  : "1080 × 1920px • Perfekt für Instagram Stories"
                }
              </p>

              <Link
                href="/"
                className="mt-4 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-medium text-sm flex items-center justify-center gap-2 hover:bg-white/10 hover:text-white/80 transition"
              >
                <Home className="w-4 h-4" />
                Zur Startseite
              </Link>
            </motion.div>
          </div>

          {/* Right Side - Card Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative flex-shrink-0"
          >
            <motion.div
              className="absolute -inset-8 rounded-3xl blur-3xl opacity-40"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <div
              ref={cardRef}
              className="relative overflow-hidden rounded-3xl shadow-2xl card-preview-size"
            >
              {renderCard()}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"
            >
              <span className="text-white/50 text-xs">Live-Vorschau</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ============================================ */}
      {/* MOBILE LAYOUT - Completely Redesigned */}
      {/* ============================================ */}
      <div className="lg:hidden slide-container-scroll bg-gradient-to-br from-[#0f0515] via-[#150a20] to-[#0a0510]">
        <div className="w-full max-w-md mx-auto px-4 pt-2 pb-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4"
          >
            <h1 className="text-xl font-bold text-white">Teile dein Jahr</h1>
            <p className="text-white/40 text-xs">Erstelle deine Share Card</p>
          </motion.div>

          {/* Card Preview - Centered with glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center mb-5"
          >
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-3xl blur-2xl opacity-40"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}
              />
              <div
                ref={mobileCardRef}
                className="relative overflow-hidden rounded-2xl shadow-2xl"
                style={{ width: '200px', height: '356px' }}
              >
                {renderCard()}
              </div>
            </div>
          </motion.div>

          {/* Photo/Video Upload */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4"
          >
            {!profileImage && !profileVideo ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-3 rounded-xl bg-white/5 border border-dashed border-white/20 flex items-center gap-3 active:scale-[0.98] transition"
              >
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white/60" />
                </div>
                <div className="text-left flex-1">
                  <span className="text-white text-sm font-medium block">Foto/Video hinzufügen</span>
                  <span className="text-white/40 text-xs">Optional • Video wird zu GIF</span>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  {mediaType === "video" && profileVideo ? (
                    <video src={profileVideo} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                  ) : profileImage ? (
                    <img src={profileImage} alt="" className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium flex items-center gap-1.5">
                    {mediaType === "video" ? <Video className="w-3.5 h-3.5" /> : <Image className="w-3.5 h-3.5" />}
                    {mediaType === "video" ? "Video" : "Foto"}
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-xs active:scale-95 transition"
                >
                  Ändern
                </button>
                <button
                  onClick={removeMedia}
                  className="p-1.5 rounded-lg bg-red-500/20 text-red-400 active:scale-95 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>

          {/* Stats Selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-white text-sm font-medium">Wähle 5 Stats</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded-full">{selectedCustomStats.length}/5</span>
                <button
                  onClick={randomizeStats}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-purple-500/20 border border-purple-500/30 text-purple-300 active:scale-95 transition"
                >
                  <Sparkles className="w-3 h-3" />
                  Mix
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              {(["distance", "time", "health", "fun", "records"] as const).map(category => {
                const categoryStats = CUSTOM_STATS.filter(s => s.category === category && s.available(stats));
                if (categoryStats.length === 0) return null;

                const categoryLabels = {
                  distance: "Distanz & Aktivität",
                  time: "Zeit & Streak",
                  health: "Gesundheit",
                  fun: "Fun Facts",
                  records: "Rekorde",
                };

                const categoryColors = {
                  distance: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
                  time: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
                  health: "from-red-500/20 to-orange-500/20 border-red-500/30",
                  fun: "from-yellow-500/20 to-green-500/20 border-yellow-500/30",
                  records: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
                };

                return (
                  <div key={category} className={`rounded-xl bg-gradient-to-r ${categoryColors[category]} border p-3`}>
                    <div className="text-[10px] text-white/50 uppercase tracking-wider mb-2 font-medium">
                      {categoryLabels[category]}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categoryStats.map(stat => {
                        const isSelected = selectedCustomStats.includes(stat.id);
                        const value = stat.getValue(stats);

                        return (
                          <button
                            key={stat.id}
                            onClick={() => toggleStat(stat.id)}
                            disabled={!isSelected && selectedCustomStats.length >= 5}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                              isSelected
                                ? "bg-cyan-500/30 border-2 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/20"
                                : "bg-black/20 border border-white/10 text-white/70 disabled:opacity-30"
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                            <span className="[&>svg]:w-4 [&>svg]:h-4">{stat.icon}</span>
                            <span>{stat.label}</span>
                            {value && <span className="text-white/40 text-[10px]">({value})</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Download Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition disabled:opacity-70 relative overflow-hidden shadow-xl shadow-orange-500/30"
            >
              {isGenerating && generatingProgress > 0 && (
                <div
                  className="absolute inset-0 bg-white/20 transition-all duration-300"
                  style={{ width: `${generatingProgress}%` }}
                />
              )}
              <span className="relative flex items-center gap-2">
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
                {isGenerating
                  ? `Erstelle ${mediaType === "video" ? "GIF" : "Bild"}... ${generatingProgress}%`
                  : mediaType === "video"
                    ? "Download als GIF"
                    : "Download für Instagram"
                }
              </span>
            </button>
            <p className="text-center text-white/30 text-xs mt-2">
              1080 × 1920px • Instagram Stories
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
