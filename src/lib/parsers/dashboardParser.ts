import {
  YearStats,
  SportStats,
  ActivityType,
  MonthlyStats,
  WeekdayStats,
  Insight,
} from "@/lib/types/activity";

// Month name mapping (German)
const MONTH_MAP: Record<string, number> = {
  "Jan": 1, "Feb": 2, "Mrz": 3, "Mär": 3, "Apr": 4, "Mai": 5, "Jun": 6,
  "Jul": 7, "Aug": 8, "Sep": 9, "Okt": 10, "Nov": 11, "Dez": 12,
};

// Activity type mapping
const TYPE_MAP: Record<string, ActivityType> = {
  "Laufen": "running",
  "Radfahren": "cycling",
  "Schwimmen": "swimming",
  "Fitnessstudio und -geräte": "strength",
  "Teamsportarten": "other",
  "Wassersport": "swimming",
  "Sonstige": "other",
};

interface MonthlyData {
  month: number;
  type: ActivityType;
  typeName: string;
  activities: number;
  distance: number;
}

interface SummaryData {
  totalActivities: number;
  totalDistance: number;
  totalDuration: number;
  totalCalories: number;
  totalElevation: number;
  avgSpeed: number;
  avgHeartRate: number;
  maxDistance: number;
  maxDuration: number;
}

// Parse time string like "248:45:46 h:m:s" to hours
function parseTimeToHours(timeStr: string): number {
  const match = timeStr.match(/(\d+):(\d+):(\d+)/);
  if (match) {
    const [, hours, minutes, seconds] = match.map(Number);
    return hours + minutes / 60 + seconds / 3600;
  }
  return 0;
}

// Parse number - handles US format (comma=thousands, dot=decimal)
function parseNumber(str: string): number {
  if (!str) return 0;
  // Remove everything except digits, comma, dot, minus
  // Then remove commas (thousand separators in US format)
  const cleaned = str.replace(/[^\d,.-]/g, "").replace(/,/g, "");
  return parseFloat(cleaned) || 0;
}

// Parse the summary CSV (Fortschrittsübersicht)
function parseSummaryCSV(content: string): SummaryData {
  const data: SummaryData = {
    totalActivities: 0,
    totalDistance: 0,
    totalDuration: 0,
    totalCalories: 0,
    totalElevation: 0,
    avgSpeed: 0,
    avgHeartRate: 0,
    maxDistance: 0,
    maxDuration: 0,
  };

  const lines = content.split("\n");
  for (const line of lines) {
    if (!line.trim()) continue;

    // Parse CSV with quotes: "key","value"
    const match = line.match(/"([^"]+)","([^"]+)"/);
    if (!match) continue;

    const key = match[1];
    const value = match[2];

    if (key === "Aktivitäten") {
      data.totalActivities = parseNumber(value);
    } else if (key === "Gesamtstrecke") {
      data.totalDistance = parseNumber(value);
    } else if (key === "Gesamtzeit der Aktivität") {
      data.totalDuration = parseTimeToHours(value);
    } else if (key === "Aktivitätskalorien") {
      data.totalCalories = parseNumber(value);
    } else if (key === "Anstieg gesamt") {
      data.totalElevation = parseNumber(value);
    } else if (key === "Ø Geschwindigkeit") {
      data.avgSpeed = parseNumber(value);
    } else if (key === "Durchschnittliche Herzfrequenz") {
      data.avgHeartRate = parseNumber(value);
    } else if (key === "Max. Distanz") {
      data.maxDistance = parseNumber(value);
    } else if (key === "Max. Zeit") {
      data.maxDuration = parseTimeToHours(value);
    }
  }

  return data;
}

// Parse monthly activity counts or distances
function parseMonthlyCSV(content: string, isDistance: boolean = false): MonthlyData[] {
  const data: MonthlyData[] = [];
  // Skip first line (might be title like "Gesamtstrecke") and BOM
  const lines = content.replace(/^\ufeff/, "").split("\n");

  // Find where actual data starts (skip header rows)
  let startIdx = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Data lines start with month names like "Jan 2025"
    if (/^[A-Za-zäöü]{3}\s+\d{4}/.test(line.trim())) {
      startIdx = i;
      break;
    }
  }

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const parts = line.split(",");
    if (parts.length < 3) continue;

    const monthStr = parts[0].trim();
    const typeName = parts[1].trim();
    const value = parseNumber(parts[2]);

    // Parse month
    const monthMatch = monthStr.match(/([A-Za-zäöü]+)\s*(\d{4})?/);
    if (!monthMatch) continue;

    const monthName = monthMatch[1];
    const month = MONTH_MAP[monthName];
    if (!month) continue;

    const type = TYPE_MAP[typeName] || "other";

    data.push({
      month,
      type,
      typeName,
      activities: isDistance ? 0 : value,
      distance: isDistance ? value : 0,
    });
  }

  return data;
}

// Generate insights from aggregated data
function generateInsights(stats: Omit<YearStats, "insights">): Insight[] {
  const insights: Insight[] = [];
  const EARTH_CIRCUMFERENCE = 40075;
  const MARATHON_DISTANCE = 42.195;

  // Earth circumference
  const earthPercent = (stats.totalDistance / EARTH_CIRCUMFERENCE) * 100;
  if (earthPercent >= 1) {
    insights.push({
      type: "fun_fact",
      title: "Um die Welt",
      value: `${earthPercent.toFixed(1)}%`,
      description: `Du hast ${stats.totalDistance.toFixed(0)} km zurückgelegt - das sind ${earthPercent.toFixed(1)}% des Erdumfangs!`,
      icon: "🌍",
    });
  }

  // Marathon equivalent
  const marathons = stats.totalDistance / MARATHON_DISTANCE;
  if (marathons >= 1) {
    insights.push({
      type: "fun_fact",
      title: "Marathon-Äquivalent",
      value: `${marathons.toFixed(1)}x`,
      description: `Deine Gesamtdistanz entspricht ${marathons.toFixed(1)} Marathons!`,
      icon: "🏃",
    });
  }

  // Most active month
  const mostActiveMonth = stats.monthlyStats.reduce((max, m) =>
    m.activities > max.activities ? m : max
  , stats.monthlyStats[0]);

  const MONTH_NAMES = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

  if (mostActiveMonth && mostActiveMonth.activities > 0) {
    insights.push({
      type: "trend",
      title: "Aktivster Monat",
      value: MONTH_NAMES[mostActiveMonth.month - 1],
      description: `Im ${MONTH_NAMES[mostActiveMonth.month - 1]} warst du mit ${mostActiveMonth.activities} Aktivitäten am aktivsten!`,
      icon: "📅",
    });
  }

  // Pizza calories
  const pizzaCalories = 800;
  const pizzas = stats.totalCalories / pizzaCalories;
  if (pizzas >= 10) {
    insights.push({
      type: "fun_fact",
      title: "Pizza-Power",
      value: `${Math.floor(pizzas)} Pizzen`,
      description: `Du hast genug Kalorien verbrannt für ${Math.floor(pizzas)} Pizzen!`,
      icon: "🍕",
    });
  }

  // Everest equivalent
  const everestHeight = 8849;
  const everests = stats.totalElevation / everestHeight;
  if (everests >= 0.5) {
    insights.push({
      type: "fun_fact",
      title: "Höhenflug",
      value: `${everests.toFixed(1)}x Everest`,
      description: `${stats.totalElevation.toFixed(0)}m Höhenmeter - das ist ${everests.toFixed(1)} mal der Mount Everest!`,
      icon: "🏔️",
    });
  }

  // Time spent (movies equivalent)
  const movieLength = 2; // hours
  const movies = stats.totalDuration / movieLength;
  if (movies >= 20) {
    insights.push({
      type: "fun_fact",
      title: "Zeit investiert",
      value: `${stats.totalDuration.toFixed(0)} Stunden`,
      description: `Du hättest ${Math.floor(movies)} Filme schauen können - aber Sport war die bessere Wahl!`,
      icon: "⏱️",
    });
  }

  return insights;
}

export interface DashboardParseResult {
  stats: YearStats;
  year: number;
}

export async function parseDashboardFiles(files: File[]): Promise<DashboardParseResult> {
  const year = new Date().getFullYear();

  let summaryData: SummaryData | null = null;
  let activityCounts: MonthlyData[] = [];
  let distanceData: MonthlyData[] = [];

  for (const file of files) {
    const content = await file.text();
    const fileName = file.name.toLowerCase();

    if (fileName.includes("fortschritt")) {
      summaryData = parseSummaryCSV(content);
    } else if (fileName.includes("aktivität")) {
      activityCounts = [...activityCounts, ...parseMonthlyCSV(content, false)];
    } else if (fileName.includes("gesamtstrecke") || fileName.includes("strecke")) {
      distanceData = [...distanceData, ...parseMonthlyCSV(content, true)];
    }
  }

  // Combine activity counts and distances by month and type
  const combinedMonthly = new Map<string, MonthlyData>();

  for (const item of activityCounts) {
    const key = `${item.month}-${item.type}`;
    if (combinedMonthly.has(key)) {
      combinedMonthly.get(key)!.activities += item.activities;
    } else {
      combinedMonthly.set(key, { ...item });
    }
  }

  for (const item of distanceData) {
    const key = `${item.month}-${item.type}`;
    if (combinedMonthly.has(key)) {
      combinedMonthly.get(key)!.distance = item.distance;
    } else {
      combinedMonthly.set(key, { ...item });
    }
  }

  // Build sport stats
  const byType: Record<string, SportStats> = {};
  const sportTotals = new Map<ActivityType, { activities: number; distance: number }>();

  for (const item of combinedMonthly.values()) {
    const current = sportTotals.get(item.type) || { activities: 0, distance: 0 };
    current.activities += item.activities;
    current.distance += item.distance;
    sportTotals.set(item.type, current);
  }

  for (const [type, totals] of sportTotals.entries()) {
    if (totals.activities > 0) {
      byType[type] = {
        type,
        count: totals.activities,
        totalDistance: totals.distance,
        totalDuration: 0,
        totalElevation: 0,
        totalCalories: 0,
        avgDistance: totals.activities > 0 ? totals.distance / totals.activities : 0,
        avgDuration: 0,
        longestActivity: null,
        fastestActivity: null,
      };
    }
  }

  // Build monthly stats
  const monthlyStats: MonthlyStats[] = [];
  for (let month = 1; month <= 12; month++) {
    let activities = 0;
    let distance = 0;

    for (const item of combinedMonthly.values()) {
      if (item.month === month) {
        activities += item.activities;
        distance += item.distance;
      }
    }

    monthlyStats.push({
      month,
      activities,
      distance,
      duration: 0,
      calories: 0,
    });
  }

  // Use summary data or calculate from monthly
  const totalActivities = summaryData?.totalActivities || monthlyStats.reduce((sum, m) => sum + m.activities, 0);
  const totalDistance = summaryData?.totalDistance || monthlyStats.reduce((sum, m) => sum + m.distance, 0);
  const totalDuration = summaryData?.totalDuration || 0;
  const totalCalories = summaryData?.totalCalories || 0;
  const totalElevation = summaryData?.totalElevation || 0;

  // Empty weekday stats (not available in this format)
  const weekdayStats: WeekdayStats[] = [
    { day: 0, dayName: "Sonntag", activities: 0, avgDistance: 0, totalDistance: 0 },
    { day: 1, dayName: "Montag", activities: 0, avgDistance: 0, totalDistance: 0 },
    { day: 2, dayName: "Dienstag", activities: 0, avgDistance: 0, totalDistance: 0 },
    { day: 3, dayName: "Mittwoch", activities: 0, avgDistance: 0, totalDistance: 0 },
    { day: 4, dayName: "Donnerstag", activities: 0, avgDistance: 0, totalDistance: 0 },
    { day: 5, dayName: "Freitag", activities: 0, avgDistance: 0, totalDistance: 0 },
    { day: 6, dayName: "Samstag", activities: 0, avgDistance: 0, totalDistance: 0 },
  ];

  const baseStats = {
    year,
    totalActivities,
    totalDistance,
    totalDuration,
    totalElevation,
    totalCalories,
    byType,
    records: {
      longestStreak: 0,
    },
    monthlyStats,
    weekdayStats,
  };

  const insights = generateInsights(baseStats);

  return {
    stats: {
      ...baseStats,
      insights,
    },
    year,
  };
}
