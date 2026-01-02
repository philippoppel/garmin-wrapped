"use client";

import { useState, useCallback, useEffect, useMemo, lazy, Suspense, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, Share2, Home } from "lucide-react";
import Link from "next/link";
import { YearStats } from "@/lib/types/activity";
import Button from "@/components/ui/Button";

// Eagerly load first 5 slides for instant display
import IntroSlide from "@/components/slides/IntroSlide";
import TotalStatsSlide from "@/components/slides/TotalStatsSlide";
import DistanceSlide from "@/components/slides/DistanceSlide";
import SportBreakdownSlide from "@/components/slides/SportBreakdownSlide";
import RunningDeepDiveSlide from "@/components/slides/RunningDeepDiveSlide";

// Lazy load remaining slides with prefetch hints
const RecordsSlide = lazy(() => import("@/components/slides/RecordsSlide"));
const MonthlyChartSlide = lazy(() => import("@/components/slides/MonthlyChartSlide"));
const HeartRateSlide = lazy(() => import("@/components/slides/HeartRateSlide"));
const EpicMomentsSlide = lazy(() => import("@/components/slides/EpicMomentsSlide"));
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

// Wrapper that detects empty/null slides and auto-skips
function SlideGuard({
  children,
  onEmpty
}: {
  children: React.ReactNode;
  onEmpty: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasChecked = useRef(false);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    // Check immediately after first render frame
    requestAnimationFrame(() => {
      if (containerRef.current) {
        const hasContent = containerRef.current.children.length > 0 &&
          containerRef.current.innerHTML.trim().length > 50;

        if (!hasContent) {
          setShowSkip(true);
          // Skip almost immediately
          setTimeout(onEmpty, 150);
        }
      }
    });
  }, [onEmpty]);

  if (showSkip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-garmin-dark to-[#0f1629]">
        <div className="w-6 h-6 border-2 border-white/30 border-t-white/60 rounded-full animate-spin" />
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
  const slideContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to top when slide changes
  useEffect(() => {
    // Reset scroll position for new slide
    if (slideContainerRef.current) {
      slideContainerRef.current.scrollTop = 0;
    }
    // Also reset window scroll just in case
    window.scrollTo(0, 0);
  }, [currentSlide]);

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

  // Preload upcoming slides for smoother transitions
  useEffect(() => {
    // Dynamically import next few slides in background
    const preloadSlide = (index: number) => {
      if (index >= 0 && index < totalSlides) {
        const key = slideConfigs[index]?.key;
        // Trigger render function to initiate lazy load
        if (key && !['intro', 'total', 'distance', 'sports', 'running-deep'].includes(key)) {
          // The lazy() import will start loading when we access the component
          slideConfigs[index].render();
        }
      }
    };

    // Preload next 3 slides
    preloadSlide(currentSlide + 1);
    preloadSlide(currentSlide + 2);
    preloadSlide(currentSlide + 3);
  }, [currentSlide, totalSlides, slideConfigs]);

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

  // Enhanced touch/swipe handling
  const touchRef = useRef<{
    startX: number;
    startY: number;
    startTime: number;
    isScrolling: boolean | null;
  } | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Ignore multi-touch
    if (e.touches.length !== 1) return;

    const touch = e.touches[0];
    touchRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      isScrolling: null, // Will be determined on first move
    };
    setSwipeOffset(0);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current || e.touches.length !== 1) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchRef.current.startX;
    const deltaY = touch.clientY - touchRef.current.startY;

    // Determine scroll direction on first significant move
    if (touchRef.current.isScrolling === null) {
      // If vertical movement is greater, user is scrolling content
      touchRef.current.isScrolling = Math.abs(deltaY) > Math.abs(deltaX);
    }

    // If scrolling vertically, don't handle as swipe
    if (touchRef.current.isScrolling) return;

    // Prevent default to stop page scroll during horizontal swipe
    e.preventDefault();

    // Apply resistance at edges
    let offset = deltaX;
    if ((currentSlide === 0 && deltaX > 0) ||
        (currentSlide === totalSlides - 1 && deltaX < 0)) {
      offset = deltaX * 0.3; // Resistance effect
    }

    setSwipeOffset(offset);
    setIsSwiping(true);
  }, [currentSlide, totalSlides]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current) return;

    const deltaX = swipeOffset;
    const deltaTime = Date.now() - touchRef.current.startTime;
    const velocity = Math.abs(deltaX) / deltaTime;

    // Reset visual offset
    setSwipeOffset(0);
    setIsSwiping(false);

    // Only process if it was a horizontal swipe
    if (touchRef.current.isScrolling) {
      touchRef.current = null;
      return;
    }

    // Threshold: Either moved enough distance OR swiped fast enough
    const distanceThreshold = 80;
    const velocityThreshold = 0.3;
    const shouldNavigate = Math.abs(deltaX) > distanceThreshold || velocity > velocityThreshold;

    if (shouldNavigate) {
      if (deltaX < 0 && currentSlide < totalSlides - 1) {
        nextSlide();
      } else if (deltaX > 0 && currentSlide > 0) {
        prevSlide();
      }
    }

    touchRef.current = null;
  }, [swipeOffset, currentSlide, totalSlides, nextSlide, prevSlide]);

  // Prevent iOS bounce/rubber-band effect during swipe
  useEffect(() => {
    const preventBounce = (e: TouchEvent) => {
      if (isSwiping) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventBounce, { passive: false });
    return () => document.removeEventListener('touchmove', preventBounce);
  }, [isSwiping]);

  const isLastSlide = currentSlide === totalSlides - 1;

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }} // Allow vertical scroll, handle horizontal ourselves
    >
      {/* Slide content */}
      <div ref={slideContainerRef} className="relative flex-1 overflow-hidden overflow-y-auto">
        {/* Tap zones for mobile navigation (Instagram Stories style) */}
        {/* Hidden on last slide (FinalShareSlide) to allow full interaction */}
        {currentSlide !== totalSlides - 1 && (
          <div className="absolute inset-0 z-10 flex md:hidden pointer-events-auto">
            {/* Left tap zone - previous */}
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="w-1/4 h-full focus:outline-none active:bg-white/5 transition-colors"
              aria-label="Vorherige Slide"
            />
            {/* Center zone - no action (allows content interaction) */}
            <div className="w-2/4 h-full pointer-events-none" />
            {/* Right tap zone - next */}
            <button
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              className="w-1/4 h-full focus:outline-none active:bg-white/5 transition-colors"
              aria-label="Nächste Slide"
            />
          </div>
        )}

        {/* Swipe direction indicators */}
        {isSwiping && (
          <>
            {/* Left indicator (previous) */}
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-16 z-20 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{
                opacity: swipeOffset > 30 && currentSlide > 0 ? 0.8 : 0,
              }}
            >
              <div className="h-full flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <ChevronLeft className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
            {/* Right indicator (next) */}
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-16 z-20 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{
                opacity: swipeOffset < -30 && currentSlide < totalSlides - 1 ? 0.8 : 0,
              }}
            >
              <div className="h-full flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <ChevronRight className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          </>
        )}

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
            animate={{
              opacity: 1,
              x: isSwiping ? swipeOffset : 0,
              scale: isSwiping ? 0.985 : 1,
            }}
            exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
            transition={isSwiping ? {
              duration: 0,
            } : {
              type: "spring",
              stiffness: 400,
              damping: 35,
              mass: 0.8,
            }}
            className="absolute inset-0 will-change-transform"
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
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                  initial={false}
                  animate={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
            {/* Previous button - larger touch target on mobile */}
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`p-3 -m-1 rounded-full transition-all duration-200 touch-manipulation active:scale-95 ${
                currentSlide === 0
                  ? "text-white/10"
                  : "text-white/50 hover:text-white hover:bg-white/10 active:bg-white/20"
              }`}
              aria-label="Vorherige Slide"
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
                className="group px-6 py-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 active:bg-white/20 active:scale-95 text-sm font-medium transition-all duration-200 touch-manipulation"
                aria-label="Weiter"
              >
                <span className="flex items-center gap-1.5">
                  Weiter
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            )}

            {/* Next button - larger touch target on mobile */}
            <button
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              className={`p-3 -m-1 rounded-full transition-all duration-200 touch-manipulation active:scale-95 ${
                currentSlide === totalSlides - 1
                  ? "text-white/10"
                  : "text-white/50 hover:text-white hover:bg-white/10 active:bg-white/20"
              }`}
              aria-label="Nächste Slide"
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
