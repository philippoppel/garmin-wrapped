"use client";

import { motion } from "framer-motion";
import SlideWrapper from "./SlideWrapper";
import { YearStats } from "@/lib/types/activity";
import CountingNumber from "../animations/CountingNumber";

interface CyclingDeepDiveSlideProps {
  stats: YearStats;
}

// Animated road background with moving lines
function RoadBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#0a1a1a]" />

      {/* Road perspective lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
        <defs>
          <linearGradient id="roadFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="30%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Converging road lines */}
        {[-3, -2, -1, 0, 1, 2, 3].map((offset) => (
          <motion.line
            key={offset}
            x1={`${50 + offset * 5}%`}
            y1="100%"
            x2={`${50 + offset * 20}%`}
            y2="0%"
            stroke="url(#roadFade)"
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: Math.abs(offset) * 0.1 }}
          />
        ))}
      </svg>

      {/* Floating particles (dust/wind) */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
          style={{
            left: `${10 + (i % 4) * 25}%`,
            top: `${20 + Math.floor(i / 4) * 30}%`,
          }}
          animate={{
            x: [0, -100, -200],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 3 + (i % 3),
            repeat: Infinity,
            delay: i * 0.4,
            ease: "linear",
          }}
        />
      ))}

      {/* Speed streaks */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`streak-${i}`}
          className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
          style={{
            width: `${60 + i * 20}px`,
            top: `${15 + i * 18}%`,
            right: 0,
          }}
          animate={{
            x: [200, -800],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// Animated bicycle with spinning wheels
function AnimatedBicycle() {
  return (
    <div className="w-full max-w-md mx-auto h-24 mb-6">
      <svg viewBox="0 0 200 100" className="w-full h-full">
        <defs>
          <linearGradient id="bikeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <filter id="bikeGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Road */}
        <motion.path
          d="M0,85 L200,85"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Bike Frame */}
        <motion.g
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          {/* Rear wheel */}
          <motion.circle
            cx="55"
            cy="70"
            r="15"
            fill="none"
            stroke="url(#bikeGradient)"
            strokeWidth="2.5"
            filter="url(#bikeGlow)"
          />
          <motion.circle
            cx="55"
            cy="70"
            r="10"
            fill="none"
            stroke="rgba(6,182,212,0.3)"
            strokeWidth="1"
            strokeDasharray="3 3"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "55px 70px" }}
          />

          {/* Front wheel */}
          <motion.circle
            cx="125"
            cy="70"
            r="15"
            fill="none"
            stroke="url(#bikeGradient)"
            strokeWidth="2.5"
            filter="url(#bikeGlow)"
          />
          <motion.circle
            cx="125"
            cy="70"
            r="10"
            fill="none"
            stroke="rgba(6,182,212,0.3)"
            strokeWidth="1"
            strokeDasharray="3 3"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "125px 70px" }}
          />

          {/* Frame */}
          <motion.path
            d="M55,70 L80,45 L110,45 L125,70 M80,45 L55,70 M80,45 L80,70 M110,45 L80,70"
            stroke="url(#bikeGradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Handlebar */}
          <motion.path
            d="M110,45 L115,38 L125,38"
            stroke="url(#bikeGradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Seat */}
          <motion.path
            d="M75,42 L85,42"
            stroke="url(#bikeGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Pedal animation */}
          <motion.circle
            cx="80"
            cy="70"
            r="6"
            fill="none"
            stroke="rgba(6,182,212,0.5)"
            strokeWidth="1.5"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "80px 70px" }}
          />
          <motion.circle
            cx="80"
            cy="64"
            r="2"
            fill="#06b6d4"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "80px 70px" }}
          />

          {/* Rider silhouette */}
          <motion.circle cx="85" cy="30" r="6" fill="rgba(6,182,212,0.6)" />
          <motion.path
            d="M85,36 L83,48 M83,48 L80,64 M85,38 L95,42 L115,38"
            stroke="rgba(6,182,212,0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </motion.g>

        {/* Speed lines */}
        {[20, 30, 40].map((y, i) => (
          <motion.line
            key={y}
            x1={10 + i * 5}
            y1={y + 30}
            x2={25 + i * 5}
            y2={y + 30}
            stroke="rgba(6,182,212,0.3)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: [0, 0.6, 0], x: -20 }}
            transition={{
              delay: 1 + i * 0.2,
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// Mountain silhouette for elevation
function ElevationMountain({ elevation }: { elevation: number }) {
  const everests = elevation / 8849;

  return (
    <div className="relative w-14 h-14">
      <svg viewBox="0 0 50 50" className="w-full h-full">
        <defs>
          <linearGradient id="mountainGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#0f766e" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
        <motion.path
          d="M5,45 L15,20 L25,35 L35,10 L45,45 Z"
          fill="url(#mountainGrad)"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
          style={{ transformOrigin: "bottom" }}
        />
        {/* Snow cap */}
        <motion.path
          d="M32,15 L35,10 L38,15 Z"
          fill="white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1.5 }}
        />
      </svg>
      {everests >= 1 && (
        <motion.div
          className="absolute -top-1 -right-1 bg-teal-500 text-[8px] font-bold text-white px-1 rounded"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.8, type: "spring" }}
        >
          {everests.toFixed(1)}x
        </motion.div>
      )}
    </div>
  );
}

// Speedometer gauge
function SpeedGauge({ speed }: { speed: number }) {
  const percentage = Math.min(speed / 35, 1);
  const rotation = -135 + percentage * 270;

  return (
    <div className="relative w-14 h-14">
      <svg viewBox="0 0 50 50" className="w-full h-full">
        <defs>
          <linearGradient id="speedArc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        {/* Background arc */}
        <path
          d="M 8 42 A 20 20 0 1 1 42 42"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Speed arc */}
        <motion.path
          d="M 8 42 A 20 20 0 1 1 42 42"
          fill="none"
          stroke="url(#speedArc)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="108"
          initial={{ strokeDashoffset: 108 }}
          animate={{ strokeDashoffset: 108 - percentage * 108 }}
          transition={{ delay: 0.9, duration: 1.2, ease: "easeOut" }}
        />
        {/* Needle */}
        <motion.line
          x1="25"
          y1="25"
          x2="25"
          y2="12"
          stroke="#22d3ee"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ rotate: -135 }}
          animate={{ rotate: rotation }}
          transition={{ delay: 0.9, duration: 1.2, ease: "easeOut" }}
          style={{ transformOrigin: "25px 25px" }}
        />
        <circle cx="25" cy="25" r="3" fill="#22d3ee" />
      </svg>
    </div>
  );
}

// Get cyclist personality based on data
function getCyclistPersonality(
  totalKm: number,
  totalElevation: number,
  avgSpeed: number,
  longestRide: number,
  totalRides: number
): { type: string; description: string; icon: JSX.Element } {
  const kmPerRide = totalKm / totalRides;
  const elevationPerKm = totalElevation / totalKm;

  // Century rider
  if (longestRide >= 160000) {
    return {
      type: "ULTRA-AUSDAUER",
      description: "160+ km an einem Tag - nur 1% schaffen das",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
    };
  }

  // Climber (high elevation per km)
  if (elevationPerKm > 15 && totalElevation > 20000) {
    return {
      type: "BERGZIEGE",
      description: "Die Steigung ist dein Spielplatz",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 20L8 10L12 14L16 6L20 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    };
  }

  // Speed demon
  if (avgSpeed > 28) {
    return {
      type: "SPEEDSTER",
      description: "Aerodynamik ist dein Freund",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    };
  }

  // Long distance rider
  if (kmPerRide > 50) {
    return {
      type: "LANGSTRECKENFAHRER",
      description: "Je länger, desto besser",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    };
  }

  // High volume
  if (totalKm >= 3000) {
    return {
      type: "KILOMETERSAMMLER",
      description: "Beständigkeit ist deine Stärke",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      ),
    };
  }

  // Frequent rider
  if (totalRides >= 100) {
    return {
      type: "DAILY RIDER",
      description: "Das Rad ist Teil deines Alltags",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v10l4.5 4.5" strokeLinecap="round" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      ),
    };
  }

  return {
    type: "RADFAHRER",
    description: "Jeder Tritt bringt dich weiter",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="5.5" cy="17.5" r="3.5" />
        <circle cx="18.5" cy="17.5" r="3.5" />
        <path d="M15 6a1 1 0 100-2 1 1 0 000 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
      </svg>
    ),
  };
}

// Get distance comparison
function getDistanceComparison(km: number): { text: string; detail: string } {
  if (km >= 3500) {
    return {
      text: `${(km / 3500).toFixed(1)}x Tour de France`,
      detail: "Eine Tour = 3.500 km in 21 Etappen",
    };
  }
  if (km >= 876) {
    return {
      text: `${(km / 876).toFixed(1)}x durch Deutschland`,
      detail: "876 km von Flensburg bis Garmisch",
    };
  }
  if (km >= 400) {
    return {
      text: `${Math.round(km / 200)} Wochenend-Touren`,
      detail: "Je 200 km Hin- und Rückfahrt",
    };
  }
  return {
    text: `${Math.round(km / 15)} Pendel-Wochen`,
    detail: "Bei 15 km zur Arbeit",
  };
}

// Pro cyclist comparison
function getProComparison(totalKm: number, avgSpeed: number): { text: string; subtext: string } | null {
  // Pro cyclists ride ~30,000-35,000 km/year
  const proYearlyKm = 32000;
  const percentOfPro = (totalKm / proYearlyKm) * 100;

  // Pogačar/Vingegaard avg speed in TdF ~41 km/h
  const proAvgSpeed = 41;

  if (avgSpeed > 0) {
    return {
      text: `${percentOfPro.toFixed(1)}%`,
      subtext: "eines Profi-Jahres"
    };
  }

  return null;
}

// Calculate CO2 saved vs car
function getCO2Saved(km: number): { kg: number; comparison: string } {
  // Average car: ~150g CO2/km, bike: ~21g CO2/km (including food production)
  // Net savings: ~129g CO2/km
  const kgSaved = (km * 0.129);

  if (kgSaved >= 1000) {
    return {
      kg: kgSaved,
      comparison: `${(kgSaved / 1000).toFixed(1)} Tonnen weniger als ein Auto`,
    };
  }
  if (kgSaved >= 100) {
    return {
      kg: kgSaved,
      comparison: `Wie ${Math.round(kgSaved / 22)} Bäume pro Jahr`,
    };
  }
  return {
    kg: kgSaved,
    comparison: `${Math.round(kgSaved)} kg weniger als ein Auto`,
  };
}

export default function CyclingDeepDiveSlide({ stats }: CyclingDeepDiveSlideProps) {
  const cycling = stats.byType.cycling;

  if (!cycling || cycling.count === 0) return null;

  const totalKm = cycling.totalDistance;
  const totalRides = cycling.count;
  const totalHours = cycling.totalDuration;
  const avgSpeed = totalHours > 0 ? totalKm / totalHours : 0;
  const totalElevation = cycling.totalElevation || 0;
  const longestRide = cycling.longestActivity;
  const longestRideDistance = longestRide?.distance || 0;

  const personality = getCyclistPersonality(
    totalKm,
    totalElevation,
    avgSpeed,
    longestRideDistance,
    totalRides
  );

  const distanceComparison = getDistanceComparison(totalKm);
  const co2Saved = getCO2Saved(totalKm);
  const proComp = getProComparison(totalKm, avgSpeed);

  const isUltra = longestRideDistance >= 100000;

  return (
    <SlideWrapper gradient="from-[#0a1a1a] via-[#0f2d2d] to-[#0a1a1a]">
      {/* Animated Road Background */}
      <RoadBackground />

      <div className="relative text-center w-full max-w-4xl mx-auto px-4 z-10">
        {/* Animated Bicycle */}
        <AnimatedBicycle />

        {/* Cyclist Personality Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", bounce: 0.4 }}
          className="mb-5"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/40 px-5 py-2 rounded-full">
            <span className="text-cyan-400">{personality.icon}</span>
            <span className="text-cyan-400 font-bold text-lg">{personality.type}</span>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-white/50 text-sm mt-2"
          >
            {personality.description}
          </motion.p>
        </motion.div>

        {/* Hero Stat: Total Distance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <div className="flex items-baseline justify-center gap-2">
            <CountingNumber
              value={Math.round(totalKm)}
              className="text-6xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent"
              duration={2}
              delay={0.6}
            />
            <span className="text-2xl md:text-3xl text-cyan-400/60 font-light">km</span>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-2"
          >
            <p className="text-white/60 text-sm font-medium">{distanceComparison.text}</p>
            <p className="text-white/30 text-xs">{distanceComparison.detail}</p>
          </motion.div>
        </motion.div>

        {/* Key Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          {/* Rides */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-white">
              <CountingNumber value={totalRides} delay={1} />
            </div>
            <div className="text-white/40 text-xs">Fahrten</div>
          </div>

          {/* Time */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-white">
              {Math.round(totalHours)}h
            </div>
            <div className="text-white/40 text-xs">im Sattel</div>
          </div>

          {/* Speed */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-center mb-2">
              <SpeedGauge speed={avgSpeed} />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-cyan-400">
              {avgSpeed.toFixed(1)}
            </div>
            <div className="text-white/40 text-xs">km/h Durchschnitt</div>
          </div>

          {/* Elevation */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-center mb-2">
              <ElevationMountain elevation={totalElevation} />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-teal-400">
              {totalElevation >= 1000
                ? `${(totalElevation / 1000).toFixed(1)}k`
                : Math.round(totalElevation)}
            </div>
            <div className="text-white/40 text-xs">Höhenmeter</div>
          </div>
        </motion.div>

        {/* Cycling Type Breakdown */}
        {stats.cyclingBreakdown && Object.keys(stats.cyclingBreakdown).length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mb-4"
          >
            <div className="text-white/50 text-xs mb-2">Aufschlüsselung nach Radtyp</div>
            <div className="flex flex-wrap justify-center gap-2">
              {Object.entries(stats.cyclingBreakdown)
                .sort((a, b) => b[1].totalDistance - a[1].totalDistance)
                .map(([key, data]) => {
                  const percentage = Math.round((data.totalDistance / totalKm) * 100);
                  const icons: Record<string, string> = {
                    rennrad: "🚴",
                    radfahren: "🚲",
                    mountainbike: "🚵",
                    gravel: "🛤️",
                    indoor: "🏠",
                    virtuell: "🎮",
                    "e-bike": "⚡",
                    spinning: "💫",
                    pendeln: "🏙️",
                  };
                  const icon = icons[key] || "🚲";
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10"
                    >
                      <span className="text-lg">{icon}</span>
                      <div className="text-left">
                        <div className="text-sm font-medium text-white">{data.displayName}</div>
                        <div className="text-[10px] text-white/50">
                          {Math.round(data.totalDistance)} km · {percentage}%
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        )}

        {/* Records & Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-wrap justify-center gap-3 mb-4"
        >
          {/* Longest Ride */}
          {longestRide && (
            <div className={`${isUltra
              ? "bg-gradient-to-br from-cyan-500/30 to-emerald-500/30 border-cyan-400/50"
              : "bg-cyan-500/10 border-cyan-500/30"} border rounded-2xl px-5 py-3`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/30 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold text-cyan-400">
                    {(longestRideDistance / 1000).toFixed(0)} km
                  </div>
                  <div className="text-xs text-white/50">
                    {isUltra ? "Century Ride!" : "Längste Tour"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CO2 Saved */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/30 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22c4-4 8-7.5 8-12a8 8 0 10-16 0c0 4.5 4 8 8 12z" />
                  <path d="M12 12V8M12 12l-2 2M12 12l2 2" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-emerald-400">
                  {co2Saved.kg >= 1000
                    ? `${(co2Saved.kg / 1000).toFixed(1)}t`
                    : `${Math.round(co2Saved.kg)} kg`}
                </div>
                <div className="text-xs text-white/50">CO2 gespart</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fun Comparisons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="flex flex-wrap justify-center gap-2 mb-4"
        >
          {proComp && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/20">
              <span className="text-base">🚴</span>
              <span className="text-cyan-400 font-bold text-sm">{proComp.text}</span>
              <span className="text-white/40 text-xs">{proComp.subtext}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span className="text-base">🌳</span>
            <span className="text-emerald-400 font-bold text-sm">{co2Saved.kg >= 100 ? Math.round(co2Saved.kg / 22) : Math.round(co2Saved.kg)}</span>
            <span className="text-white/40 text-xs">{co2Saved.kg >= 100 ? "Bäume/Jahr Äquivalent" : "kg CO₂ gespart"}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <span className="text-base">🐆</span>
            <span className="text-white/60 text-xs">
              Ein Gepard (110 km/h) hätte deine Distanz in <span className="text-cyan-400 font-bold">{(totalKm / 110).toFixed(1)}h</span> geschafft
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20">
            <span className="text-base">🐢</span>
            <span className="text-white/60 text-xs">
              Eine Schildkröte (0.3 km/h) bräuchte <span className="text-teal-400 font-bold">{Math.round(totalKm / 0.3 / 24 / 365 * 10) / 10} Jahre</span>
            </span>
          </div>
        </motion.div>

        {/* Data Source Attribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9 }}
          className="mt-4 flex items-center justify-center gap-2 text-[10px] text-white/30"
        >
          <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <span>
            Daten: Garmin Radaktivitäten ({totalRides} Fahrten, inkl. Indoor & Multisport) |
            CO2: ~129g/km Ersparnis vs. Auto
          </span>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
