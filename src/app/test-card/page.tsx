"use client";

import FinalShareSlide from "@/components/slides/FinalShareSlide";
import { YearStats } from "@/lib/types/activity";

// Complete mock data for testing
const mockStats: YearStats = {
  year: 2025,
  totalActivities: 359,
  totalDistance: 3327.641,
  totalDuration: 287,
  totalElevation: 18320,
  totalCalories: 245000,
  byType: {
    running: {
      type: "running",
      count: 120,
      totalDistance: 890,
      totalDuration: 95,
      totalElevation: 5200,
      totalCalories: 85000,
      avgDistance: 7.4,
      avgDuration: 47,
      avgPace: 6.2,
      longestActivity: null,
      fastestActivity: null,
    },
    cycling: {
      type: "cycling",
      count: 85,
      totalDistance: 2100,
      totalDuration: 120,
      totalElevation: 12000,
      totalCalories: 95000,
      avgDistance: 24.7,
      avgDuration: 85,
      avgSpeed: 25,
      longestActivity: null,
      fastestActivity: null,
    },
  },
  records: {
    fastest5K: undefined,
    fastest10K: undefined,
    fastestHalfMarathon: undefined,
    fastestMarathon: undefined,
    longestRun: undefined,
    longestRide: undefined,
    mostElevation: undefined,
    longestStreak: 14,
  },
  monthlyStats: [],
  weekdayStats: [],
  insights: [],
  healthStats: {
    avgRestingHeartRate: 52,
    avgSleepDuration: 7.2,
    totalSteps: 4500000,
    avgDailySteps: 12500,
    totalHeartbeats: 25000000,
    hasRealData: true,
    avgTrainingHR: 145,
    maxTrainingHR: 185,
    activitiesWithHR: 300,
  },
  wellnessInsights: {
    avgDailySteps: 12500,
    estimatedYearlySteps: 4562500,
    bestStepsDay: { date: null, steps: 25000 },
    weeklyPattern: {
      best: { day: "Samstag", steps: 15000 },
      worst: { day: "Freitag", steps: 8000 },
      byDay: {},
    },
    monthlySteps: [],
    bestMonth: { name: "Juni", steps: 450000 },
    totalFloorsClimbed: 3500,
    avgDailyFloors: 12,
    floorsFromActivities: 2000,
    hasRealFloorData: false,
    avgDailySweatLossMl: 800,
    estimatedYearlySweatLossMl: 287000,
    sweatLossDataPoints: 250,
    avgSleepScore: 78,
    perfectSleepDays: 45,
    excellentSleepDays: 120,
    sleepScoreCount: 350,
    avgHrv: 55,
    hrvTrend: "stable",
    hrvAfterActivity: 48,
    hrvAfterRest: 62,
    hrvDataPoints: 300,
    avgBodyBatteryChange: -15,
    avgActivityStress: 35,
    bodyBatteryDataPoints: 300,
    vo2MaxRunning: 52,
    vo2MaxCycling: 48,
    hasStepsData: true,
    hasSleepData: true,
    hasHrvData: true,
    hasBodyBatteryData: true,
    hasSweatLossData: true,
  },
};

export default function TestCardPage() {
  return (
    <div className="min-h-screen bg-black">
      <FinalShareSlide stats={mockStats} />
    </div>
  );
}
