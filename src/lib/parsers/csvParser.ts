import Papa from "papaparse";
import { Activity, ActivityType, GarminCSVRow } from "@/lib/types/activity";

// Map Garmin activity types to our internal types
const activityTypeMap: Record<string, ActivityType> = {
  // Running
  "Running": "running",
  "Laufen": "running",
  "Trail Running": "running",
  "Trail-Lauf": "running",
  "Treadmill Running": "running",
  "Laufband": "running",
  "Laufbandtraining": "running",
  "Indoor Running": "running",
  "Indoor-Laufen": "running",
  "Track Running": "running",
  "Bahnlauf": "running",
  "Virtual Running": "running",
  "Virtuelles Laufen": "running",
  "Ultra Running": "running",

  // Cycling
  "Cycling": "cycling",
  "Radfahren": "cycling",
  "Road Cycling": "cycling",
  "Rennrad": "cycling",
  "Mountain Biking": "cycling",
  "Mountainbiken": "cycling",
  "Gravel Cycling": "cycling",
  "Gravel-Radfahren": "cycling",
  "Indoor Cycling": "cycling",
  "Indoor-Rad": "cycling",
  "Virtual Ride": "cycling",
  "Virtuelles Radfahren": "cycling",
  "E-Bike": "cycling",
  "E-Bike Cycling": "cycling",
  "E-Bike-Fahren": "cycling",
  "Spinning": "cycling",
  "Bike": "cycling",
  "Commuting": "cycling",
  "Pendeln": "cycling",
  "BMX": "cycling",
  "Cyclocross": "cycling",

  // Swimming
  "Swimming": "swimming",
  "Schwimmen": "swimming",
  "Pool Swimming": "swimming",
  "Poolschwimmen": "swimming",
  "Open Water Swimming": "swimming",
  "Freiwasserschwimmen": "swimming",
  "Lap Swimming": "swimming",
  "Bahnschwimmen": "swimming",

  // Walking
  "Walking": "walking",
  "Gehen": "walking",
  "Casual Walking": "walking",
  "Speed Walking": "walking",

  // Hiking
  "Hiking": "hiking",
  "Wandern": "hiking",
  "Bergsteigen": "hiking",
  "Mountaineering": "hiking",

  // Strength & Fitness
  "Strength Training": "strength",
  "Krafttraining": "strength",
  "Cardio": "strength",
  "HIIT": "strength",
  "Functional Training": "strength",
  "Funktionelles Training": "strength",
  "CrossFit": "strength",
  "Bootcamp": "strength",
  "Circuit Training": "strength",
  "Zirkeltraining": "strength",
  "Elliptical": "strength",
  "Crosstrainer": "strength",
  "Stair Stepper": "strength",
  "Stepper": "strength",
  "Rowing": "strength",
  "Rudern": "strength",
  "Indoor Rowing": "strength",
  "Indoor-Rudern": "strength",
  "Pilates": "strength",
  "Breathwork": "strength",
  "Atemübungen": "strength",
  "Floor Climbing": "strength",
  "Treppensteigen": "strength",

  // Climbing / Bouldern
  "Bouldering": "strength",
  "Bouldern": "strength",
  "Indoor Climbing": "strength",
  "Indoor-Klettern": "strength",
  "Climbing": "strength",
  "Klettern": "strength",
  "Rock Climbing": "strength",

  // Ball Sports (map to other but track them)
  "Volleyball": "other",
  "Beach Volleyball": "other",
  "Beachvolleyball": "other",
  "Tennis": "other",
  "Badminton": "other",
  "Soccer": "other",
  "Fußball": "other",
  "Basketball": "other",
  "Golf": "other",
  "Squash": "other",
  "Table Tennis": "other",
  "Tischtennis": "other",

  // Yoga & Mindfulness
  "Yoga": "yoga",
  "Meditation": "yoga",
  "Stretching": "yoga",
  "Dehnen": "yoga",
};

// Track unknown activity types for debugging
const unknownTypes = new Set<string>();

function mapActivityType(garminType: string): ActivityType {
  const normalized = garminType?.trim();
  const mapped = activityTypeMap[normalized];

  if (!mapped && normalized) {
    unknownTypes.add(normalized);
    console.log(`[Garmin Wrapped] Unknown activity type: "${normalized}"`);
  }

  return mapped || "other";
}

// Export for debugging
export function getUnknownActivityTypes(): string[] {
  return Array.from(unknownTypes);
}

// Parse time string (HH:MM:SS or MM:SS) to seconds
function parseTimeToSeconds(timeStr: string): number {
  if (!timeStr || timeStr === "--") return 0;

  const parts = timeStr.split(":").map(Number);

  if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  }

  return 0;
}

// Parse pace string (MM:SS) to min/km
function parsePace(paceStr: string): number | undefined {
  if (!paceStr || paceStr === "--") return undefined;

  const parts = paceStr.split(":").map(Number);
  if (parts.length === 2) {
    return parts[0] + parts[1] / 60;
  }

  return undefined;
}

// Parse distance (handles various formats)
function parseDistance(distStr: string): number {
  if (!distStr || distStr === "--") return 0;

  // Remove units and parse
  const cleaned = distStr.replace(/[^\d.,]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

// Parse numeric value
function parseNumber(str: string): number | undefined {
  if (!str || str === "--" || str === "") return undefined;
  const cleaned = str.replace(/[^\d.,]/g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? undefined : num;
}

// Parse date string
function parseDate(dateStr: string): Date {
  // Try various formats
  // Garmin uses formats like "2024-12-31 14:30:00" or "31.12.2024 14:30"

  // ISO format
  if (dateStr.includes("-")) {
    return new Date(dateStr);
  }

  // German format DD.MM.YYYY
  const germanMatch = dateStr.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (germanMatch) {
    const [, day, month, year] = germanMatch;
    const time = dateStr.split(" ")[1] || "12:00:00";
    return new Date(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${time}`);
  }

  return new Date(dateStr);
}

// Generate unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Parse a single CSV row into Activity
function parseRow(row: GarminCSVRow): Activity | null {
  // Skip rows without date or type
  if (!row["Date"] && !row["Datum"]) return null;
  if (!row["Activity Type"] && !row["Aktivitätstyp"]) return null;

  const activityType = row["Activity Type"] || row["Aktivitätstyp"] || "";
  const type = mapActivityType(activityType);

  // Skip non-endurance activities if they have no distance
  const distanceStr = row["Distance"] || row["Distanz"] || "0";
  const distance = parseDistance(distanceStr) * 1000; // Convert km to meters

  const activity: Activity = {
    id: generateId(),
    type,
    name: row["Title"] || row["Titel"] || activityType,
    date: parseDate(row["Date"] || row["Datum"] || ""),
    distance,
    duration: parseTimeToSeconds(row["Time"] || row["Zeit"] || ""),
    calories: parseNumber(row["Calories"] || row["Kalorien"]),
    avgHeartRate: parseNumber(row["Avg HR"] || row["Durchschn. HF"]),
    maxHeartRate: parseNumber(row["Max HR"] || row["Max. HF"]),
    avgPace: parsePace(row["Avg Pace"] || row["Durchschn. Pace"]),
    avgSpeed: parseNumber(row["Avg Speed"] || row["Durchschn. Geschwindigkeit"]),
    maxSpeed: parseNumber(row["Max Speed"] || row["Max. Geschwindigkeit"]),
    elevationGain: parseNumber(row["Elev Gain"] || row["Höhengewinn"] || row["Positiver Höhenunterschied"]),
    elevationLoss: parseNumber(row["Elev Loss"] || row["Höhenverlust"] || row["Negativer Höhenunterschied"]),
    avgCadence: parseNumber(row["Avg Cadence"] || row["Durchschn. Schrittfrequenz"]),
    maxCadence: parseNumber(row["Max Cadence"] || row["Max. Schrittfrequenz"]),
    avgPower: parseNumber(row["Avg Power"] || row["Durchschn. Leistung"]),
    maxPower: parseNumber(row["Max Power"] || row["Max. Leistung"]),
    trainingEffect: parseNumber(row["Training Effect"] || row["Trainingseffekt"]),
  };

  return activity;
}

export interface ParseResult {
  activities: Activity[];
  year: number;
  errors: string[];
}

export async function parseGarminCSV(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const activities: Activity[] = [];
    const errors: string[] = [];
    const currentYear = new Date().getFullYear();

    Papa.parse<GarminCSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        for (const row of results.data) {
          try {
            const activity = parseRow(row);
            if (activity && activity.date.getFullYear() === currentYear) {
              activities.push(activity);
            }
          } catch (e) {
            errors.push(`Error parsing row: ${e}`);
          }
        }

        // Sort by date
        activities.sort((a, b) => a.date.getTime() - b.date.getTime());

        resolve({
          activities,
          year: currentYear,
          errors,
        });
      },
      error: (error) => {
        reject(new Error(`CSV parsing failed: ${error.message}`));
      },
    });
  });
}

// Export for testing
export { parseTimeToSeconds, parsePace, parseDistance, mapActivityType };
