"use client";

import { useState, useCallback, useEffect, useMemo, lazy, Suspense, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, Share2, Home } from "lucide-react";
import Link from "next/link";
import { YearStats } from "@/lib/types/activity";
import Button from "@/components/ui/Button";

// Eagerly load first 2 slides for instant display
import IntroSlide from "@/components/slides/IntroSlide";
import TotalStatsSlide from "@/components/slides/TotalStatsSlide";

// Lazy load all other slides
const DistanceSlide = lazy(() => import("@/components/slides/DistanceSlide"));
const SportBreakdownSlide = lazy(() => import("@/components/slides/SportBreakdownSlide"));
const RecordsSlide = lazy(() => import("@/components/slides/RecordsSlide"));
const MonthlyChartSlide = lazy(() => import("@/components/slides/MonthlyChartSlide"));
const HeartRateSlide = lazy(() => import("@/components/slides/HeartRateSlide"));
const EpicMomentsSlide = lazy(() => import("@/components/slides/EpicMomentsSlide"));
const RunningDeepDiveSlide = lazy(() => import("@/components/slides/RunningDeepDiveSlide"));
const CyclingDeepDiveSlide = lazy(() => import("@/components/slides/CyclingDeepDiveSlide"));
const SwimmingDeepDiveSlide = lazy(() => import("@/components/slides/SwimmingDeepDiveSlide"));
const CyclingPowerSlide = lazy(() => import("@/components/slides/CyclingPowerSlide"));
const SleepRecoverySlide = lazy(() => import("@/components/slides/SleepRecoverySlide"));
const ComparisonSlide = lazy(() => import("@/components/slides/ComparisonSlide"));
const FinalShareSlide = lazy(() => import("@/components/slides/FinalShareSlide"));
const YearComparisonSlide = lazy(() => import("@/components/slides/YearComparisonSlide"));
const StepsSlide = lazy(() => import("@/components/slides/StepsSlide"));
const SweatLossSlide = lazy(() => import("@/components/slides/SweatLossSlide"));
const RunningFormSlide = lazy(() => import("@/components/slides/RunningFormSlide"));
const BadgesSlide = lazy(() => import("@/components/slides/BadgesSlide"));

// Loading fallback for lazy slides
function SlideLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-garmin-dark to-[#0f1629]">
      <motion.div
        className="w-12 h-12 border-2 border-garmin-blue border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
}

// Wrapper that detects empty/null slides and shows skip UI
function SlideGuard({
  children,
  onEmpty
}: {
  children: React.ReactNode;
  onEmpty: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const hasChecked = useRef(false);

  useEffect(() => {
    // Check after render if the container is empty
    if (hasChecked.current) return;

    const timer = setTimeout(() => {
      if (containerRef.current) {
        // Check if the slide rendered anything meaningful
        const hasContent = containerRef.current.children.length > 0 &&
          containerRef.current.innerHTML.trim().length > 50;

        if (!hasContent) {
          setIsEmpty(true);
          // Auto-skip after showing message
          setTimeout(onEmpty, 400);
        }
        hasChecked.current = true;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [onEmpty, children]);

  if (isEmpty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-garmin-dark to-[#0f1629]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            className="w-8 h-8 border-2 border-white/20 border-t-white/50 rounded-full mx-auto mb-3"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          <p className="text-white/30 text-sm">Weiter...</p>
        </motion.div>
      </div>
    );
  }

  return <div ref={containerRef} className="contents">{children}</div>;
}

interface WrappedViewerProps {
  stats: YearStats;
  previousYearStats?: YearStats | null;
  onExport: () => void;
  onShare?: () => void;
}

export default function WrappedViewer({ stats, previousYearStats, onExport, onShare }: WrappedViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState<Set<number>>(new Set([0, 1]));

  // Debug: Log unknown activity types to console
  useEffect(() => {
    if (stats.unknownActivityTypes && stats.unknownActivityTypes.length > 0) {
      console.log(
        "%c[Garmin Wrapped] Unbekannte Aktivitätstypen gefunden:",
        "color: #f97316; font-weight: bold",
        stats.unknownActivityTypes
      );
      console.log("Diese werden als 'Sonstiges' kategorisiert. Bitte melden für bessere Zuordnung!");
    }
  }, [stats.unknownActivityTypes]);

  // Build slides config array (lazy - only render functions, not actual elements)
  const slideConfigs = useMemo(() => {
    const configs: Array<{ key: string; render: () => React.ReactNode }> = [
      { key: "intro", render: () => <IntroSlide year={stats.year} /> },
      { key: "total", render: () => <TotalStatsSlide stats={stats} /> },
    ];

    // Add distance slide only if there's distance data
    if (stats.totalDistance > 0 && stats.totalActivities > 0) {
      configs.push({ key: "distance", render: () => <DistanceSlide stats={stats} /> });
    }

    // Add sport breakdown if there are sports with activities
    const sportsWithActivities = Object.values(stats.byType).filter(s => s && s.count > 0);
    if (sportsWithActivities.length > 0) {
      configs.push({ key: "sports", render: () => <SportBreakdownSlide stats={stats} /> });
    }

    // Add sport-specific deep dive slides
    if (stats.byType.running && stats.byType.running.count > 0) {
      configs.push({ key: "running-deep", render: () => <RunningDeepDiveSlide stats={stats} /> });
      if (stats.runningFormAnalytics?.hasData) {
        configs.push({ key: "running-form", render: () => <RunningFormSlide stats={stats} /> });
      }
    }
    if (stats.byType.cycling && stats.byType.cycling.count > 0) {
      configs.push({ key: "cycling-deep", render: () => <CyclingDeepDiveSlide stats={stats} /> });
      if (stats.cyclingPowerAnalytics?.hasData) {
        configs.push({ key: "cycling-power", render: () => <CyclingPowerSlide stats={stats} /> });
      }
    }
    if (stats.byType.swimming && stats.byType.swimming.count > 0) {
      configs.push({ key: "swimming-deep", render: () => <SwimmingDeepDiveSlide stats={stats} /> });
    }

    // Add heart rate slide if we have health stats
    if (stats.healthStats || stats.totalDuration > 10) {
      configs.push({ key: "heartrate", render: () => <HeartRateSlide stats={stats} /> });
    }

    // Add comprehensive sleep & recovery slide (replaces old SleepHealthSlide)
    if (stats.wellnessInsights?.hasSleepData || stats.wellnessInsights?.hasHrvData || stats.wellnessInsights?.hasBodyBatteryData) {
      configs.push({ key: "sleep-recovery", render: () => <SleepRecoverySlide stats={stats} /> });
    }
    // Note: SleepHealthSlide removed as fallback - only show sleep data if we have real wellness data

    // Add comprehensive steps & activity slide if data available
    if (stats.wellnessInsights?.hasStepsData) {
      configs.push({ key: "steps", render: () => <StepsSlide stats={stats} /> });
    }

    // Add sweat loss slide if data available
    if (stats.wellnessInsights?.hasSweatLossData && stats.wellnessInsights?.estimatedYearlySweatLossMl) {
      configs.push({ key: "sweat-loss", render: () => <SweatLossSlide stats={stats} /> });
    }

    // Add records if any exist
    const hasRecords =
      stats.records.fastest5K ||
      stats.records.fastest10K ||
      stats.records.longestRun ||
      stats.records.longestRide ||
      stats.records.longestStreak >= 3;

    if (hasRecords) {
      configs.push({ key: "records", render: () => <RecordsSlide stats={stats} /> });
    }

    // Add monthly chart if there are activities
    if (stats.totalActivities > 0) {
      configs.push({ key: "monthly", render: () => <MonthlyChartSlide stats={stats} /> });
    }

    // Add epic moments slide if we have activities
    const hasEpicMoment = Object.values(stats.byType).some((sport) => sport?.longestActivity);
    if (hasEpicMoment) {
      configs.push({ key: "epic", render: () => <EpicMomentsSlide stats={stats} /> });
    }

    // Add comparison with other athletes if we have data
    if (stats.totalActivities > 0) {
      configs.push({ key: "comparison", render: () => <ComparisonSlide stats={stats} /> });
    }

    // Add year-over-year comparison if previous year data exists
    if (previousYearStats && previousYearStats.totalActivities >= 10) {
      configs.push({ key: "year-comparison", render: () => <YearComparisonSlide stats={stats} previousYearStats={previousYearStats} /> });
    }

    // Add badges/achievements slide if earned any
    if (stats.achievements?.hasBadges) {
      configs.push({ key: "badges", render: () => <BadgesSlide stats={stats} /> });
    }

    // Final shareable slide with personal image upload
    configs.push({ key: "final-share", render: () => <FinalShareSlide stats={stats} /> });

    return configs;
  }, [stats, previousYearStats]);

  const totalSlides = slideConfigs.length;

  // Preload next slides when current slide changes
  useEffect(() => {
    const slidesToPreload = [currentSlide, currentSlide + 1, currentSlide + 2].filter(
      (i) => i >= 0 && i < totalSlides
    );
    setLoadedSlides((prev) => {
      const next = new Set(prev);
      slidesToPreload.forEach((i) => next.add(i));
      return next;
    });
  }, [currentSlide, totalSlides]);

  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSlides) {
        setDirection(index > currentSlide ? 1 : -1);
        setCurrentSlide(index);
      }
    },
    [currentSlide, totalSlides]
  );

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    setTouchStart(null);
  };

  const isLastSlide = currentSlide === totalSlides - 1;

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide content */}
      <div className="relative flex-1">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Suspense fallback={<SlideLoader />}>
              <SlideGuard key={`guard-${currentSlide}`} onEmpty={nextSlide}>
                {slideConfigs[currentSlide].render()}
              </SlideGuard>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation - fixed at bottom with elegant glass effect */}
      <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
        {/* Gradient fade from transparent to subtle dark */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent pointer-events-none" />

        <div className="relative px-4 py-4 md:px-8 md:py-5">
          {/* Progress indicator */}
          <div className="mb-4">
            {/* Mobile: Elegant progress bar */}
            <div className="md:hidden">
              <div className="h-0.5 bg-white/10 rounded-full overflow-hidden mx-auto max-w-xs">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500 ease-out"
                  style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
                />
              </div>
            </div>
            {/* Desktop: Minimal dots */}
            <div className="hidden md:flex justify-center gap-1.5">
              {slideConfigs.map((config, index) => (
                <button
                  key={config.key}
                  onClick={() => goToSlide(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-5 h-1.5 bg-gradient-to-r from-cyan-400 to-purple-500"
                      : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between max-w-md mx-auto">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`p-2 rounded-full transition-all duration-200 touch-manipulation ${
                currentSlide === 0
                  ? "text-white/10"
                  : "text-white/50 hover:text-white hover:bg-white/10"
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Center buttons - show export on last slide */}
            {isLastSlide ? (
              <div className="flex gap-2">
                <Button onClick={onExport} variant="primary" size="md">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Speichern</span>
                </Button>
                {onShare && (
                  <Button onClick={onShare} variant="secondary" size="md">
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Teilen</span>
                  </Button>
                )}
              </div>
            ) : (
              <button
                onClick={nextSlide}
                className="group px-6 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 text-sm font-medium transition-all duration-200 touch-manipulation"
              >
                <span className="flex items-center gap-1.5">
                  Weiter
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            )}

            <button
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              className={`p-2 rounded-full transition-all duration-200 touch-manipulation ${
                currentSlide === totalSlides - 1
                  ? "text-white/10"
                  : "text-white/50 hover:text-white hover:bg-white/10"
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Top bar - Home button and slide counter */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 py-3 md:px-4 md:py-4">
        {/* Home button */}
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm text-white/50 hover:text-white hover:bg-black/50 transition-all text-xs font-medium"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Home</span>
        </Link>

        {/* Slide counter */}
        <div className="px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white/50 text-xs font-medium">
          {currentSlide + 1} / {totalSlides}
        </div>
      </div>
    </div>
  );
}
