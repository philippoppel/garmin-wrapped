import {
  Activity,
  ActivityType,
  YearStats,
  SportStats,
  PersonalRecords,
  MonthlyStats,
  WeekdayStats,
  Insight,
} from "@/lib/types/activity";

const WEEKDAY_NAMES = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const MONTH_NAMES = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

// Earth's circumference in km
const EARTH_CIRCUMFERENCE = 40075;
const MARATHON_DISTANCE = 42.195;

function calculateSportStats(activities: Activity[], type: ActivityType): SportStats {
  const typeActivities = activities.filter((a) => a.type === type);

  if (typeActivities.length === 0) {
    return {
      type,
      count: 0,
      totalDistance: 0,
      totalDuration: 0,
      totalElevation: 0,
      totalCalories: 0,
      avgDistance: 0,
      avgDuration: 0,
      longestActivity: null,
      fastestActivity: null,
    };
  }

  const totalDistance = typeActivities.reduce((sum, a) => sum + a.distance, 0) / 1000; // km
  const totalDuration = typeActivities.reduce((sum, a) => sum + a.duration, 0) / 3600; // hours
  const totalElevation = typeActivities.reduce((sum, a) => sum + (a.elevationGain || 0), 0);
  const totalCalories = typeActivities.reduce((sum, a) => sum + (a.calories || 0), 0);

  // Find longest activity
  const longestActivity = typeActivities.reduce((longest, current) =>
    current.distance > (longest?.distance || 0) ? current : longest
  , typeActivities[0]);

  // Find fastest activity (by pace for running, speed for cycling)
  let fastestActivity: Activity | null = null;
  if (type === "running" || type === "walking" || type === "hiking") {
    const withPace = typeActivities.filter((a) => a.avgPace && a.avgPace > 0);
    if (withPace.length > 0) {
      fastestActivity = withPace.reduce((fastest, current) =>
        (current.avgPace || 99) < (fastest?.avgPace || 99) ? current : fastest
      , withPace[0]);
    }
  } else if (type === "cycling") {
    const withSpeed = typeActivities.filter((a) => a.avgSpeed && a.avgSpeed > 0);
    if (withSpeed.length > 0) {
      fastestActivity = withSpeed.reduce((fastest, current) =>
        (current.avgSpeed || 0) > (fastest?.avgSpeed || 0) ? current : fastest
      , withSpeed[0]);
    }
  }

  // Calculate averages
  const avgPaceActivities = typeActivities.filter((a) => a.avgPace);
  const avgSpeedActivities = typeActivities.filter((a) => a.avgSpeed);

  return {
    type,
    count: typeActivities.length,
    totalDistance,
    totalDuration,
    totalElevation,
    totalCalories,
    avgDistance: totalDistance / typeActivities.length,
    avgDuration: totalDuration / typeActivities.length,
    avgPace: avgPaceActivities.length > 0
      ? avgPaceActivities.reduce((sum, a) => sum + (a.avgPace || 0), 0) / avgPaceActivities.length
      : undefined,
    avgSpeed: avgSpeedActivities.length > 0
      ? avgSpeedActivities.reduce((sum, a) => sum + (a.avgSpeed || 0), 0) / avgSpeedActivities.length
      : undefined,
    bestPace: fastestActivity?.avgPace,
    bestSpeed: fastestActivity?.avgSpeed,
    longestActivity,
    fastestActivity,
  };
}

function calculateRecords(activities: Activity[]): PersonalRecords {
  const running = activities.filter((a) => a.type === "running");
  const cycling = activities.filter((a) => a.type === "cycling");
  const swimming = activities.filter((a) => a.type === "swimming");

  // Running time records (find runs close to standard distances)
  const find5K = running.filter((a) => a.distance >= 4900 && a.distance <= 5500);
  const find10K = running.filter((a) => a.distance >= 9800 && a.distance <= 10500);
  const findHM = running.filter((a) => a.distance >= 21000 && a.distance <= 22000);
  const findMarathon = running.filter((a) => a.distance >= 42000 && a.distance <= 43000);

  const fastest5K = find5K.length > 0
    ? find5K.reduce((f, c) => c.duration < f.duration ? c : f, find5K[0])
    : undefined;

  const fastest10K = find10K.length > 0
    ? find10K.reduce((f, c) => c.duration < f.duration ? c : f, find10K[0])
    : undefined;

  const fastestHM = findHM.length > 0
    ? findHM.reduce((f, c) => c.duration < f.duration ? c : f, findHM[0])
    : undefined;

  const fastestMarathon = findMarathon.length > 0
    ? findMarathon.reduce((f, c) => c.duration < f.duration ? c : f, findMarathon[0])
    : undefined;

  // Longest activities
  const longestRun = running.length > 0
    ? running.reduce((l, c) => c.distance > l.distance ? c : l, running[0])
    : undefined;

  const longestRide = cycling.length > 0
    ? cycling.reduce((l, c) => c.distance > l.distance ? c : l, cycling[0])
    : undefined;

  const longestSwim = swimming.length > 0
    ? swimming.reduce((l, c) => c.distance > l.distance ? c : l, swimming[0])
    : undefined;

  // Most elevation
  const withElevation = activities.filter((a) => a.elevationGain && a.elevationGain > 0);
  const mostElevation = withElevation.length > 0
    ? withElevation.reduce((m, c) => (c.elevationGain || 0) > (m.elevationGain || 0) ? c : m, withElevation[0])
    : undefined;

  // Most calories
  const withCalories = activities.filter((a) => a.calories && a.calories > 0);
  const mostCalories = withCalories.length > 0
    ? withCalories.reduce((m, c) => (c.calories || 0) > (m.calories || 0) ? c : m, withCalories[0])
    : undefined;

  // Highest heart rate
  const withHR = activities.filter((a) => a.maxHeartRate && a.maxHeartRate > 0);
  const highestHR = withHR.length > 0
    ? withHR.reduce((h, c) => (c.maxHeartRate || 0) > (h.maxHeartRate || 0) ? c : h, withHR[0])
    : undefined;

  // Calculate longest streak
  const sortedDates = [...new Set(activities.map((a) =>
    a.date.toISOString().split("T")[0]
  ))].sort();

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    const diff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return {
    fastest5K: fastest5K ? { time: fastest5K.duration, date: fastest5K.date, activity: fastest5K } : undefined,
    fastest10K: fastest10K ? { time: fastest10K.duration, date: fastest10K.date, activity: fastest10K } : undefined,
    fastestHalfMarathon: fastestHM ? { time: fastestHM.duration, date: fastestHM.date, activity: fastestHM } : undefined,
    fastestMarathon: fastestMarathon ? { time: fastestMarathon.duration, date: fastestMarathon.date, activity: fastestMarathon } : undefined,
    longestRun,
    longestRide,
    longestSwim,
    mostElevation,
    mostCalories,
    highestHeartRate: highestHR ? { value: highestHR.maxHeartRate!, activity: highestHR } : undefined,
    longestStreak,
  };
}

function calculateMonthlyStats(activities: Activity[]): MonthlyStats[] {
  const stats: MonthlyStats[] = [];

  for (let month = 1; month <= 12; month++) {
    const monthActivities = activities.filter((a) => a.date.getMonth() + 1 === month);

    stats.push({
      month,
      activities: monthActivities.length,
      distance: monthActivities.reduce((sum, a) => sum + a.distance, 0) / 1000,
      duration: monthActivities.reduce((sum, a) => sum + a.duration, 0) / 3600,
      calories: monthActivities.reduce((sum, a) => sum + (a.calories || 0), 0),
    });
  }

  return stats;
}

function calculateWeekdayStats(activities: Activity[]): WeekdayStats[] {
  const stats: WeekdayStats[] = [];

  for (let day = 0; day <= 6; day++) {
    const dayActivities = activities.filter((a) => a.date.getDay() === day);
    const totalDistance = dayActivities.reduce((sum, a) => sum + a.distance, 0) / 1000;

    stats.push({
      day,
      dayName: WEEKDAY_NAMES[day],
      activities: dayActivities.length,
      totalDistance,
      avgDistance: dayActivities.length > 0 ? totalDistance / dayActivities.length : 0,
    });
  }

  return stats;
}

function generateInsights(activities: Activity[], stats: Omit<YearStats, "insights">): Insight[] {
  const insights: Insight[] = [];
  const totalDistanceKm = stats.totalDistance;

  // Earth circumference comparison
  const earthTimes = totalDistanceKm / EARTH_CIRCUMFERENCE;
  if (earthTimes >= 0.01) {
    insights.push({
      type: "fun_fact",
      title: "Um die Welt",
      value: `${(earthTimes * 100).toFixed(1)}%`,
      description: `Du bist ${totalDistanceKm.toFixed(0)} km gelaufen/gefahren - das sind ${(earthTimes * 100).toFixed(1)}% des Erdumfangs!`,
      icon: "🌍",
    });
  }

  // Marathon equivalent
  const marathons = totalDistanceKm / MARATHON_DISTANCE;
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

  if (mostActiveMonth.activities > 0) {
    insights.push({
      type: "trend",
      title: "Aktivster Monat",
      value: MONTH_NAMES[mostActiveMonth.month - 1],
      description: `Im ${MONTH_NAMES[mostActiveMonth.month - 1]} warst du mit ${mostActiveMonth.activities} Aktivitäten am aktivsten!`,
      icon: "📅",
    });
  }

  // Favorite weekday
  const favoriteDay = stats.weekdayStats.reduce((max, d) =>
    d.activities > max.activities ? d : max
  , stats.weekdayStats[0]);

  if (favoriteDay.activities > 0) {
    insights.push({
      type: "trend",
      title: "Lieblings-Tag",
      value: favoriteDay.dayName,
      description: `${favoriteDay.dayName} ist dein Sport-Tag! ${favoriteDay.activities} Aktivitäten an ${favoriteDay.dayName}en.`,
      icon: "🗓️",
    });
  }

  // Morning vs Evening analysis
  const morningActivities = activities.filter((a) => a.date.getHours() < 12).length;
  const eveningActivities = activities.filter((a) => a.date.getHours() >= 17).length;

  if (morningActivities > eveningActivities * 1.5) {
    insights.push({
      type: "trend",
      title: "Frühaufsteher",
      value: `${morningActivities} Morgen-Workouts`,
      description: "Du bist ein echter Frühsportler! Die meisten deiner Aktivitäten finden morgens statt.",
      icon: "🌅",
    });
  } else if (eveningActivities > morningActivities * 1.5) {
    insights.push({
      type: "trend",
      title: "Nachteule",
      value: `${eveningActivities} Abend-Workouts`,
      description: "Du trainierst am liebsten abends! Das passt zu deinem Rhythmus.",
      icon: "🌙",
    });
  }

  // Streak achievement
  if (stats.records.longestStreak >= 7) {
    insights.push({
      type: "achievement",
      title: "Längste Serie",
      value: `${stats.records.longestStreak} Tage`,
      description: `Deine längste Trainingsserie: ${stats.records.longestStreak} Tage am Stück!`,
      icon: "🔥",
    });
  }

  // Calories burned - pizza equivalent
  const pizzaCalories = 800;
  const pizzas = stats.totalCalories / pizzaCalories;
  if (pizzas >= 10) {
    insights.push({
      type: "fun_fact",
      title: "Pizza-Power",
      value: `${Math.floor(pizzas)} Pizzen`,
      description: `Du hast genug Kalorien verbrannt für ${Math.floor(pizzas)} Pizzen! 🍕`,
      icon: "🍕",
    });
  }

  // Elevation - Everest equivalent
  const everestHeight = 8849;
  const everests = stats.totalElevation / everestHeight;
  if (everests >= 0.5) {
    insights.push({
      type: "fun_fact",
      title: "Höhenflug",
      value: `${(everests).toFixed(1)}x Everest`,
      description: `${stats.totalElevation.toFixed(0)}m Höhenmeter - das ist ${(everests).toFixed(1)} mal der Mount Everest!`,
      icon: "🏔️",
    });
  }

  return insights;
}

export function calculateYearStats(activities: Activity[], year: number): YearStats {
  if (activities.length === 0) {
    return {
      year,
      totalActivities: 0,
      totalDistance: 0,
      totalDuration: 0,
      totalElevation: 0,
      totalCalories: 0,
      byType: {},
      records: {
        longestStreak: 0,
      },
      monthlyStats: calculateMonthlyStats([]),
      weekdayStats: calculateWeekdayStats([]),
      insights: [],
    };
  }

  const totalDistance = activities.reduce((sum, a) => sum + a.distance, 0) / 1000;
  const totalDuration = activities.reduce((sum, a) => sum + a.duration, 0) / 3600;
  const totalElevation = activities.reduce((sum, a) => sum + (a.elevationGain || 0), 0);
  const totalCalories = activities.reduce((sum, a) => sum + (a.calories || 0), 0);

  // Calculate stats by sport type
  const types: ActivityType[] = ["running", "cycling", "swimming", "walking", "hiking", "strength", "yoga", "other"];
  const byType: Record<string, SportStats> = {};

  for (const type of types) {
    const sportStats = calculateSportStats(activities, type);
    if (sportStats.count > 0) {
      byType[type] = sportStats;
    }
  }

  const records = calculateRecords(activities);
  const monthlyStats = calculateMonthlyStats(activities);
  const weekdayStats = calculateWeekdayStats(activities);

  // Calculate cycling breakdown by subtype
  const cyclingBreakdown: Record<string, { count: number; totalDistance: number; totalDuration: number; displayName: string }> = {};
  const cyclingActivities = activities.filter(a => a.type === "cycling");

  const cyclingDisplayNames: Record<string, string> = {
    "road cycling": "Rennrad",
    "rennrad": "Rennrad",
    "cycling": "Radfahren",
    "radfahren": "Radfahren",
    "mountain biking": "Mountainbike",
    "mountainbiken": "Mountainbike",
    "gravel cycling": "Gravel",
    "gravel-radfahren": "Gravel",
    "indoor cycling": "Indoor",
    "indoor-rad": "Indoor",
    "virtual ride": "Virtuell",
    "virtuelles radfahren": "Virtuell",
    "e-bike": "E-Bike",
    "e-bike cycling": "E-Bike",
    "e-bike-fahren": "E-Bike",
    "spinning": "Spinning",
    "commuting": "Pendeln",
    "pendeln": "Pendeln",
    "road_biking": "Rennrad",
    "indoor_cycling": "Indoor",
  };

  for (const activity of cyclingActivities) {
    const originalType = (activity.originalType || "cycling").toLowerCase();
    const displayName = cyclingDisplayNames[originalType] || activity.originalType || "Radfahren";
    const key = displayName.toLowerCase().replace(/\s+/g, "_");

    if (!cyclingBreakdown[key]) {
      cyclingBreakdown[key] = {
        count: 0,
        totalDistance: 0,
        totalDuration: 0,
        displayName,
      };
    }
    cyclingBreakdown[key].count++;
    cyclingBreakdown[key].totalDistance += activity.distance / 1000;
    cyclingBreakdown[key].totalDuration += activity.duration / 3600;
  }

  const baseStats = {
    year,
    totalActivities: activities.length,
    totalDistance,
    totalDuration,
    totalElevation,
    totalCalories,
    byType,
    records,
    monthlyStats,
    weekdayStats,
    cyclingBreakdown: Object.keys(cyclingBreakdown).length > 0 ? cyclingBreakdown : undefined,
  };

  const insights = generateInsights(activities, baseStats);

  return {
    ...baseStats,
    insights,
  };
}

// Helper to format time (seconds to HH:MM:SS or MM:SS)
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

// Helper to format pace (min/km)
export function formatPace(pace: number): string {
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")} /km`;
}
