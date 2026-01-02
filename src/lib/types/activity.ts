// Garmin Activity Types
export type ActivityType =
  | "running"
  | "cycling"
  | "swimming"
  | "walking"
  | "hiking"
  | "strength"
  | "yoga"
  | "other";

export interface Activity {
  id: string;
  type: ActivityType;
  name: string;
  date: Date;

  // Distance & Duration
  distance: number; // in meters
  duration: number; // in seconds
  movingTime?: number; // in seconds

  // Pace & Speed
  avgPace?: number; // min/km for running
  avgSpeed?: number; // km/h for cycling
  maxSpeed?: number;

  // Heart Rate
  avgHeartRate?: number;
  maxHeartRate?: number;

  // Elevation
  elevationGain?: number; // in meters
  elevationLoss?: number;
  maxElevation?: number;
  minElevation?: number;

  // Calories
  calories?: number;

  // Swimming specific
  laps?: number;
  strokes?: number;
  poolLength?: number;

  // Cadence
  avgCadence?: number;
  maxCadence?: number;

  // Power (cycling)
  avgPower?: number;
  maxPower?: number;
  normalizedPower?: number;

  // Training metrics
  trainingEffect?: number;
  vo2Max?: number;
}

// Parsed stats from all activities
export interface YearStats {
  year: number;
  totalActivities: number;
  totalDistance: number; // km
  totalDuration: number; // hours
  totalElevation: number; // meters
  totalCalories: number;

  // By sport
  byType: {
    [key in ActivityType]?: SportStats;
  };

  // Records
  records: PersonalRecords;

  // Trends
  monthlyStats: MonthlyStats[];
  weekdayStats: WeekdayStats[];

  // Insights
  insights: Insight[];

  // New: Health & Training patterns
  healthStats?: HealthStats;
  trainingPatterns?: TrainingPatterns;
  epicMoment?: EpicMoment;
  wellnessInsights?: WellnessInsights;
  runningFormAnalytics?: RunningFormAnalytics;
  cyclingPowerAnalytics?: CyclingPowerAnalytics;
  trainingEffectAnalytics?: TrainingEffectAnalytics;
  achievements?: Achievements;

  // Debug: Unknown activity types that weren't mapped
  unknownActivityTypes?: string[];

  // Detailed breakdown of "other" activities
  otherBreakdown?: Record<string, {
    count: number;
    totalDistance: number;
    totalDuration: number;
    displayName: string;
  }>;

  // User weight from Garmin profile (kg)
  userWeight?: number | null;
}

// Comprehensive wellness insights
export interface WellnessInsights {
  // Steps
  avgDailySteps: number;
  estimatedYearlySteps: number;
  bestStepsDay: { date: Date | string | null; steps: number };
  weeklyPattern: {
    best: { day: string; steps: number };
    worst: { day: string; steps: number };
    byDay: { [key: string]: number }; // mon, tue, wed, etc.
  };
  monthlySteps: number[];
  bestMonth: { name: string; steps: number };

  // Floors
  totalFloorsClimbed: number;
  avgDailyFloors: number;
  floorsFromActivities: number; // From tracked activities

  // Hydration
  avgDailySweatLossMl: number | null;
  estimatedYearlySweatLossMl: number | null;
  sweatLossDataPoints: number;

  // Sleep
  avgSleepScore: number | null;
  perfectSleepDays: number;
  excellentSleepDays: number;
  sleepScoreCount: number;

  // HRV
  avgHrv: number | null;
  hrvTrend: "improving" | "declining" | "stable" | null;
  hrvAfterActivity: number | null;
  hrvAfterRest: number | null;
  hrvDataPoints: number;

  // Body Battery & Stress
  avgBodyBatteryChange: number | null;
  avgActivityStress: number | null;
  bodyBatteryDataPoints: number;

  // Fitness
  vo2MaxRunning: number | null;
  vo2MaxCycling: number | null;

  // Data availability flags
  hasStepsData: boolean;
  hasSleepData: boolean;
  hasHrvData: boolean;
  hasBodyBatteryData: boolean;
  hasSweatLossData: boolean;
}

// Running form analytics
export interface RunningFormAnalytics {
  dataPoints: number;
  avgGroundContactTime: number | null;
  avgVerticalOscillation: number | null;
  avgStrideLength: number | null;
  avgCadence: number | null;
  avgVerticalRatio: number | null;
  avgBalance: number | null;
  bestGroundContactTime: number | null;
  bestVerticalOscillation: number | null;
  bestCadence: number | null;
  efficiencyScore: number;
  trend: "improving" | "declining" | "stable";
  hasData: boolean;
}

// Cycling power analytics
export interface CyclingPowerAnalytics {
  dataPoints: number;
  avgPower: number | null;
  maxPower: number | null;
  estimatedFTP: number | null;
  totalTSS: number;
  avgBalance: number | null;
  ftpTrend: "improving" | "declining" | "stable";
  ftpTrendDetails?: {
    startFTP: number;
    endFTP: number;
    changePercent: number;
    startPeriod: string;
    endPeriod: string;
  } | null;
  hasData: boolean;
}

// Training effect analytics
export interface TrainingEffectAnalytics {
  dataPoints: number;
  avgAerobicEffect: number;
  avgAnaerobicEffect: number;
  maxAerobicEffect: number;
  maxAnaerobicEffect: number;
  dominantLabel: string | null;
  hasData: boolean;
}

// Badge/Achievement
export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

// Achievements collection
export interface Achievements {
  badges: Badge[];
  totalBadges: number;
  hasBadges: boolean;
}

export interface SportStats {
  type: ActivityType;
  count: number;
  totalDistance: number;
  totalDuration: number;
  totalElevation: number;
  totalCalories: number;
  avgDistance: number;
  avgDuration: number;
  avgPace?: number;
  avgSpeed?: number;
  bestPace?: number;
  bestSpeed?: number;
  longestActivity: Activity | null;
  fastestActivity: Activity | null;
}

// Record types that work with both Activity objects and API response objects
interface RecordActivity {
  name: string;
  distance: number;
  duration?: number;
  date: Date | string;
  elevationGain?: number;
}

export interface PersonalRecords {
  // Running records (time-based)
  fastest5K?: { time: number; date: Date | string; activity: Activity | { name: string } };
  fastest10K?: { time: number; date: Date | string; activity: Activity | { name: string } };
  fastestHalfMarathon?: { time: number; date: Date | string; activity: Activity | { name: string } };
  fastestMarathon?: { time: number; date: Date | string; activity: Activity | { name: string } };

  // Distance records (works with both Activity and API objects)
  longestRun?: Activity | RecordActivity;
  longestRide?: Activity | RecordActivity;
  longestSwim?: Activity;

  // Elevation record
  mostElevation?: Activity | RecordActivity;

  // Other records
  mostCalories?: Activity;
  highestHeartRate?: { value: number; activity: Activity };
  longestStreak: number; // consecutive days
}

export interface MonthlyStats {
  month: number; // 1-12
  activities: number;
  distance: number;
  duration: number;
  calories: number;
}

export interface WeekdayStats {
  day: number; // 0-6 (Sun-Sat)
  dayName: string;
  activities: number;
  avgDistance: number;
  totalDistance: number;
}

export interface Insight {
  type: "fun_fact" | "achievement" | "comparison" | "trend";
  title: string;
  value: string;
  description: string;
  icon?: string;
}

// Health & Fitness Stats from Garmin
export interface HealthStats {
  avgRestingHeartRate: number | null;
  avgSleepDuration: number | null; // hours
  totalSteps: number | null;
  avgDailySteps: number | null;
  totalHeartbeats: number; // estimated heartbeats during activities
  hasRealData: boolean; // true if data comes from Garmin API, not estimates
  // Training HR stats
  avgTrainingHR?: number | null;
  maxTrainingHR?: number | null;
  activitiesWithHR?: number;
}

// Training patterns analysis
export interface TrainingPatterns {
  preferredTimeOfDay: "morning" | "afternoon" | "evening" | "night";
  mostActiveHour: number;
  consistency: number; // 0-100 score
  trainingPersonality: TrainingPersonality;
  hourlyDistribution: number[]; // 24 values for each hour
  activeDays: string[]; // ISO date strings of active days
}

export type TrainingPersonality =
  | "Der Frühaufsteher"
  | "Der Abendläufer"
  | "Der Wochenend-Krieger"
  | "Der Konsistenz-König"
  | "Der Kilometersammler"
  | "Der Höhenflügler"
  | "Der Allrounder"
  | "Der Ausdauer-Champion";

// Epic moment - best activity of the year
export interface EpicMoment {
  activity: {
    name: string;
    type: ActivityType;
    date: Date;
    distance: number;
    duration: number;
    elevation?: number;
    calories?: number;
  };
  reason: string; // Why this is epic
  emoji: string;
}

// Garmin CSV column mappings
export interface GarminCSVRow {
  "Activity Type": string;
  "Date": string;
  "Title": string;
  "Distance": string;
  "Calories": string;
  "Time": string;
  "Avg HR": string;
  "Max HR": string;
  "Avg Pace": string;
  "Best Pace": string;
  "Avg Speed": string;
  "Max Speed": string;
  "Elev Gain": string;
  "Elev Loss": string;
  "Avg Cadence": string;
  "Max Cadence": string;
  "Avg Power": string;
  "Max Power": string;
  "Training Effect": string;
  [key: string]: string;
}

// Upload state
export interface UploadState {
  status: "idle" | "uploading" | "parsing" | "analyzing" | "complete" | "error";
  progress: number;
  error?: string;
  fileName?: string;
  activitiesFound?: number;
}
