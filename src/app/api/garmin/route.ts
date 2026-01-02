import { NextRequest, NextResponse } from "next/server";
import { GarminConnect } from "garmin-connect";

export async function POST(request: NextRequest) {
  try {
    const { email, password, year: requestedYear } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email und Passwort erforderlich" },
        { status: 400 }
      );
    }

    // Use requested year or default to previous year
    const currentYear = new Date().getFullYear();
    const year = requestedYear || currentYear - 1;
    console.log(`Fetching data for year: ${year}`);

    // Initialize Garmin client
    const GCClient = new GarminConnect({
      username: email,
      password: password,
    });

    // Login
    await GCClient.login();

    // Fetch all activities (up to 1500)
    const activities = await GCClient.getActivities(0, 1500);
    console.log(`Fetched ${activities.length} total activities`);

    // Filter activities for selected year
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31, 23, 59, 59);
    let yearActivities = activities.filter((activity: any) => {
      const activityDate = new Date(activity.startTimeLocal);
      return activityDate >= yearStart && activityDate <= yearEnd;
    });
    console.log(`Found ${yearActivities.length} activities for ${year}`);

    // Expand multisport activities to include child segments (for accurate record detection)
    yearActivities = await expandMultisportActivities(GCClient, yearActivities);
    console.log(`After multisport expansion: ${yearActivities.length} activities`);

    // Filter activities for previous year (for comparison)
    const prevYear = year - 1;
    const prevYearStart = new Date(prevYear, 0, 1);
    const prevYearEnd = new Date(prevYear, 11, 31, 23, 59, 59);
    const prevYearActivities = activities.filter((activity: any) => {
      const activityDate = new Date(activity.startTimeLocal);
      return activityDate >= prevYearStart && activityDate <= prevYearEnd;
    });

    // Fetch real health data from Garmin API (sample 12 days for performance)
    const healthData = await fetchHealthData(GCClient, year);

    // Fetch comprehensive wellness data (steps, sleep scores, HRV, etc.)
    const wellnessData = await fetchWellnessData(GCClient, year);

    // Fetch user settings (includes weight)
    let userWeight: number | null = null;
    try {
      const userSettings = await GCClient.getUserSettings();
      if (userSettings?.userData?.weight) {
        // Weight is in grams, convert to kg
        userWeight = Math.round((userSettings.userData.weight as number) / 1000 * 10) / 10;
        console.log(`User weight from Garmin: ${userWeight} kg`);
      }
    } catch (e) {
      console.log("Could not fetch user weight:", e);
    }

    // Process activities into stats
    const stats = processActivities(yearActivities, year, healthData, wellnessData, userWeight);

    // Process previous year stats if we have enough data (at least 10 activities)
    let previousYearStats = null;
    if (prevYearActivities.length >= 10) {
      previousYearStats = processActivities(prevYearActivities, prevYear, [], null);
    }

    return NextResponse.json({
      stats,
      previousYearStats,
      activitiesCount: yearActivities.length
    });
  } catch (error: any) {
    console.error("Garmin API error:", error);

    if (error.message?.includes("credentials") || error.message?.includes("login")) {
      return NextResponse.json(
        { error: "Login fehlgeschlagen. Bitte überprüfe deine Zugangsdaten." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Fehler beim Abrufen der Garmin-Daten: " + error.message },
      { status: 500 }
    );
  }
}

// Fetch real health data from Garmin API
async function fetchHealthData(client: any, year: number) {
  const samples: any[] = [];
  const today = new Date();

  // Sample one day per month for performance (avoids rate limits)
  for (let month = 0; month < 12; month++) {
    const sampleDate = new Date(year, month, 15);

    // Skip future months
    if (sampleDate > today) continue;

    try {
      const [sleepData, heartRateData, stepsData] = await Promise.all([
        client.getSleepData(sampleDate).catch(() => null),
        client.getHeartRate(sampleDate).catch(() => null),
        client.getSteps(sampleDate).catch(() => 0),
      ]);

      samples.push({
        date: sampleDate,
        sleep: sleepData,
        heartRate: heartRateData,
        steps: stepsData || 0,
      });
    } catch (e) {
      // Skip this day if API fails
      console.log(`Health data unavailable for ${sampleDate.toISOString()}`);
    }
  }

  return samples;
}

// Expand multisport activities to include child segments for accurate record detection
// Garmin API hides child activities (swim/bike/run in triathlon) from getActivities()
// but they can be accessed via getActivity({ activityId: childId })
async function expandMultisportActivities(client: any, activities: any[]): Promise<any[]> {
  const expandedActivities = [...activities];
  const multisportActivities = activities.filter(
    (a) => a.activityType?.typeKey === "multi_sport"
  );

  if (multisportActivities.length === 0) {
    return activities;
  }

  console.log(`Found ${multisportActivities.length} multisport activities to expand`);

  for (const multisport of multisportActivities) {
    try {
      // Fetch detailed activity data to get childIds
      const details = await client.getActivity({ activityId: multisport.activityId });
      const childIds = details?.metadataDTO?.childIds;

      if (childIds && childIds.length > 0) {
        // Fetch each child activity
        for (const childId of childIds) {
          try {
            const childDetails = await client.getActivity({ activityId: childId });

            if (childDetails?.summaryDTO && childDetails?.activityTypeDTO) {
              // Convert child activity to same format as regular activities
              const childActivity = {
                activityId: childId,
                activityName: childDetails.activityName || "Multisport Segment",
                startTimeLocal: childDetails.summaryDTO.startTimeLocal,
                activityType: {
                  typeKey: childDetails.activityTypeDTO.typeKey,
                  typeId: childDetails.activityTypeDTO.typeId,
                },
                distance: childDetails.summaryDTO.distance,
                duration: childDetails.summaryDTO.duration,
                elevationGain: childDetails.summaryDTO.elevationGain,
                calories: childDetails.summaryDTO.calories,
                averageHR: childDetails.summaryDTO.averageHR,
                maxHR: childDetails.summaryDTO.maxHR,
                averageSpeed: childDetails.summaryDTO.averageSpeed,
                // Mark as child activity from multisport
                isMultisportChild: true,
                parentActivityId: multisport.activityId,
              };

              expandedActivities.push(childActivity);
              console.log(
                `  Added child: ${childDetails.activityTypeDTO.typeKey} - ${(childDetails.summaryDTO.distance / 1000).toFixed(2)}km`
              );
            }
          } catch (childError) {
            console.log(`  Error fetching child ${childId}:`, (childError as Error).message);
          }
        }
      }
    } catch (error) {
      console.log(`Error expanding multisport ${multisport.activityId}:`, (error as Error).message);
    }
  }

  return expandedActivities;
}

// Fetch comprehensive wellness data for the entire year
async function fetchWellnessData(client: any, year: number) {
  const today = new Date();
  const wellnessData: any = {
    dailySteps: [],
    weeklySteps: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0, counts: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 } },
    monthlySteps: new Array(12).fill(0),
    monthlyCounts: new Array(12).fill(0),
    sleepScores: [],
    perfectSleepDays: 0,
    hrvValues: [],
    bodyBatteryData: [],
    stressData: [],
    bestStepsDay: { date: null, steps: 0 },
    userSettings: null,
    sweatLossSamples: [],
  };

  // Get user settings for VO2Max and other metrics
  try {
    wellnessData.userSettings = await client.getUserSettings().catch(() => null);
  } catch (e) {
    console.log("User settings unavailable");
  }

  // Sample more days - 3 days per week for step trends (approx. 156 samples)
  const weekDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  for (let week = 0; week < 52; week++) {
    // Sample 3 days per week and rotate offsets to cover all weekdays across the year
    const baseOffset = week % 7;
    const sampleOffsets = [baseOffset, (baseOffset + 2) % 7, (baseOffset + 4) % 7];

    for (const dayOffset of sampleOffsets) {
      const sampleDate = new Date(year, 0, 1 + (week * 7) + dayOffset);

      // Skip future dates
      if (sampleDate > today) continue;
      if (sampleDate.getFullYear() !== year) continue;

      try {
        const [stepsData, sleepData] = await Promise.all([
          client.getSteps(sampleDate).catch(() => 0),
          client.getSleepData(sampleDate).catch(() => null),
        ]);
        const dateStr = sampleDate.toISOString().split("T")[0];

        const hydrationData = await client.get(
          `https://connect.garmin.com/modern/proxy/usersummary-service/usersummary/hydration/allData/${dateStr}`,
          {}
        ).catch(() => null);

        const steps = stepsData || 0;
        const dayOfWeek = sampleDate.getDay();
        const month = sampleDate.getMonth();
        const dayKey = weekDays[dayOfWeek] as keyof typeof wellnessData.weeklySteps;

        // Track daily steps
        if (steps > 0) {
          wellnessData.dailySteps.push({ date: sampleDate, steps });

          // Weekly pattern
          wellnessData.weeklySteps[dayKey] += steps;
          (wellnessData.weeklySteps.counts as any)[dayKey]++;

          // Monthly totals
          wellnessData.monthlySteps[month] += steps;
          wellnessData.monthlyCounts[month]++;

          // Best day
          if (steps > wellnessData.bestStepsDay.steps) {
            wellnessData.bestStepsDay = { date: sampleDate, steps };
          }
        }

        // Sleep data with scores and HRV
        if (sleepData) {
          // Sleep score
          const sleepScore = sleepData.dailySleepDTO?.sleepScores?.overall?.value ||
                            sleepData.sleepScores?.overall?.value ||
                            sleepData.overallScore ||
                            null;

          if (sleepScore !== null) {
            wellnessData.sleepScores.push({ date: sampleDate, score: sleepScore });
            if (sleepScore === 100) {
              wellnessData.perfectSleepDays++;
            }
          }

          // HRV data
          const hrv = sleepData.avgOvernightHrv || sleepData.hrvData?.hrvValue || null;
          if (hrv !== null && hrv > 0) {
            wellnessData.hrvValues.push({ date: sampleDate, hrv });
          }

          // Body battery change during sleep
          const bodyBatteryChange = sleepData.bodyBatteryChange;
          if (bodyBatteryChange !== undefined) {
            wellnessData.bodyBatteryData.push({
              date: sampleDate,
              change: bodyBatteryChange,
              sleepStress: sleepData.avgSleepStress || null,
            });
          }
        }

        // Hydration data (expected sweat loss)
        const sweatLoss = hydrationData?.sweatLossInML;
        if (typeof sweatLoss === "number" && sweatLoss > 0) {
          wellnessData.sweatLossSamples.push({ date: sampleDate, sweatLoss });
        }
      } catch (e) {
        // Skip this day if API fails
      }
    }
  }

  // Try to get stress/body battery from custom endpoints
  try {
    // Get a sample of recent days for stress data
    for (let i = 0; i < 7; i++) {
      const sampleDate = new Date(today);
      sampleDate.setDate(sampleDate.getDate() - (i * 7));
      if (sampleDate.getFullYear() !== year) continue;

      try {
        const dateStr = sampleDate.toISOString().split("T")[0];
        // Try to get stress data via the generic request method
        const stressResponse = await client.get(
          `https://connect.garmin.com/modern/proxy/wellness-service/wellness/dailyStress/${dateStr}`,
          {}
        ).catch(() => null);

        if (stressResponse && stressResponse.overallStressLevel !== undefined) {
          wellnessData.stressData.push({
            date: sampleDate,
            overallStress: stressResponse.overallStressLevel,
            restStress: stressResponse.restStressLevel,
            activityStress: stressResponse.activityStressLevel,
            highStressDuration: stressResponse.highStressDuration,
            lowStressDuration: stressResponse.lowStressDuration,
          });
        }
      } catch (e) {
        // Stress endpoint not available
      }
    }
  } catch (e) {
    console.log("Stress data fetch failed");
  }

  // Calculate weekly averages for steps
  for (const day of weekDays) {
    const dayKey = day as keyof typeof wellnessData.weeklySteps;
    const count = (wellnessData.weeklySteps.counts as any)[dayKey];
    if (count > 0) {
      wellnessData.weeklySteps[dayKey] = Math.round(wellnessData.weeklySteps[dayKey] / count);
    }
  }

  // Floor data not available via unofficial Garmin API
  // The API endpoints return empty objects for floor data

  // Calculate monthly averages
  for (let m = 0; m < 12; m++) {
    if (wellnessData.monthlyCounts[m] > 0) {
      wellnessData.monthlySteps[m] = Math.round(
        wellnessData.monthlySteps[m] / wellnessData.monthlyCounts[m]
      );
    }
  }

  return wellnessData;
}

// Calculate real health stats from API data
function calculateRealHealthStats(healthData: any[], activities: any[], totalDuration: number) {
  let totalRestingHR = 0;
  let restingHRCount = 0;
  let totalSleepHours = 0;
  let sleepCount = 0;
  let totalSteps = 0;
  let stepsCount = 0;

  for (const sample of healthData) {
    // Resting heart rate from HeartRate API or Sleep API
    if (sample.heartRate?.restingHeartRate) {
      totalRestingHR += sample.heartRate.restingHeartRate;
      restingHRCount++;
    } else if (sample.sleep?.restingHeartRate) {
      totalRestingHR += sample.sleep.restingHeartRate;
      restingHRCount++;
    }

    // Sleep duration from Sleep API
    if (sample.sleep?.dailySleepDTO?.sleepTimeSeconds) {
      totalSleepHours += sample.sleep.dailySleepDTO.sleepTimeSeconds / 3600;
      sleepCount++;
    }

    // Steps from Steps API
    if (sample.steps && sample.steps > 0) {
      totalSteps += sample.steps;
      stepsCount++;
    }
  }

  // Calculate averages with fallbacks
  const avgRestingHR = restingHRCount > 0
    ? Math.round(totalRestingHR / restingHRCount)
    : null; // No fake data - show null if unavailable

  const avgSleepDuration = sleepCount > 0
    ? Math.round((totalSleepHours / sleepCount) * 10) / 10
    : null; // No fake data

  const avgDailySteps = stepsCount > 0
    ? Math.round(totalSteps / stepsCount)
    : null; // No fake data

  // Estimate total steps for the year (based on average)
  const estimatedTotalSteps = avgDailySteps
    ? avgDailySteps * 365
    : null;

  // Calculate activity heart rate stats
  // Filter out sensor errors - max realistic HR is ~220
  const MAX_REALISTIC_HR = 210;
  let totalActivityHR = 0;
  let activityHRCount = 0;
  let maxActivityHR = 0;
  let minActivityHR = 999;

  for (const activity of activities) {
    // Only count realistic HR values
    if (activity.averageHR && activity.averageHR > 0 && activity.averageHR <= MAX_REALISTIC_HR) {
      totalActivityHR += activity.averageHR;
      activityHRCount++;
    }
    if (activity.maxHR && activity.maxHR > maxActivityHR && activity.maxHR <= MAX_REALISTIC_HR) {
      maxActivityHR = activity.maxHR;
    }
    if (activity.averageHR && activity.averageHR > 0 && activity.averageHR < minActivityHR) {
      minActivityHR = activity.averageHR;
    }
  }
  const avgActivityHR = activityHRCount > 0 ? Math.round(totalActivityHR / activityHRCount) : 140;

  return {
    avgRestingHeartRate: avgRestingHR,
    avgSleepDuration: avgSleepDuration,
    totalSteps: estimatedTotalSteps,
    avgDailySteps: avgDailySteps,
    totalHeartbeats: Math.round(totalDuration * 60 * avgActivityHR),
    hasRealData: restingHRCount > 0 || sleepCount > 0 || stepsCount > 0,
    // New HR stats
    avgTrainingHR: activityHRCount > 0 ? avgActivityHR : null,
    maxTrainingHR: maxActivityHR > 0 ? maxActivityHR : null,
    activitiesWithHR: activityHRCount,
  };
}

function processActivities(activities: any[], year: number, healthData: any[] = [], wellnessData: any = null, userWeight: number | null = null) {
  // Activity type mapping - Garmin uses typeKey values like "running", "indoor_cycling", etc.
  const typeMap: Record<string, string> = {
    // Running
    running: "running",
    trail_running: "running",
    treadmill_running: "running",
    indoor_running: "running",
    track_running: "running",
    virtual_running: "running",
    ultra_running: "running",
    obstacle_run: "running", // Spartan, Tough Mudder, etc.

    // Cycling
    cycling: "cycling",
    road_biking: "cycling",
    mountain_biking: "cycling",
    gravel_cycling: "cycling",
    indoor_cycling: "cycling",
    virtual_ride: "cycling",
    e_bike: "cycling",
    e_bike_mountain: "cycling",
    e_bike_fitness: "cycling",
    bmx: "cycling",
    cyclocross: "cycling",
    commuting: "cycling",
    spin: "cycling",

    // Swimming
    swimming: "swimming",
    lap_swimming: "swimming",
    open_water_swimming: "swimming",
    pool_swim: "swimming",

    // Walking
    walking: "walking",
    casual_walking: "walking",
    speed_walking: "walking",

    // Hiking
    hiking: "hiking",
    mountaineering: "hiking",

    // Strength & Fitness
    strength_training: "strength",
    cardio: "strength",
    indoor_cardio: "strength",
    hiit: "strength",
    functional_training: "strength",
    crossfit: "strength",
    bootcamp: "strength",
    circuit_training: "strength",
    elliptical: "strength",
    stair_stepper: "strength",
    floor_climbing: "strength",
    rowing: "strength",
    indoor_rowing: "strength",
    pilates: "strength",
    breathwork: "strength",

    // Climbing
    bouldering: "strength",
    indoor_climbing: "strength",
    climbing: "strength",
    rock_climbing: "strength",

    // Ball Sports
    volleyball: "other",
    beach_volleyball: "other",
    tennis: "other",
    badminton: "other",
    soccer: "other",
    football: "other",
    basketball: "other",
    golf: "other",
    squash: "other",
    table_tennis: "other",

    // Yoga & Mindfulness
    yoga: "yoga",
    meditation: "yoga",
    stretching: "yoga",

    // Water Sports
    kayaking: "other",
    stand_up_paddleboarding: "other",
    stand_up_paddleboarding_v2: "other", // SUP
    surfing: "other",
    sailing: "other",

    // Winter Sports
    skiing: "other",
    snowboarding: "other",
    cross_country_skiing: "other",
    backcountry_skiing: "other",

    // Other
    other: "other",
    multi_sport: "other",
    transition: "other",
  };

  // Track unknown activity types for debugging
  const unknownTypes = new Set<string>();

  // Track detailed breakdown of "other" activities
  const otherBreakdown: Record<string, { count: number; totalDistance: number; totalDuration: number; displayName: string }> = {};
  const cyclingBreakdown: Record<string, { count: number; totalDistance: number; totalDuration: number; displayName: string }> = {};

  // Display names for specific "other" activity types
  const otherDisplayNames: Record<string, string> = {
    multi_sport: "Multisport",
    stand_up_paddleboarding: "SUP",
    stand_up_paddleboarding_v2: "SUP",
    soccer: "Fußball",
    volleyball: "Volleyball",
    beach_volleyball: "Beachvolleyball",
    tennis: "Tennis",
    badminton: "Badminton",
    basketball: "Basketball",
    golf: "Golf",
    squash: "Squash",
    table_tennis: "Tischtennis",
    kayaking: "Kajak",
    surfing: "Surfen",
    sailing: "Segeln",
    skiing: "Ski",
    snowboarding: "Snowboard",
    cross_country_skiing: "Langlauf",
    backcountry_skiing: "Skitouren",
    transition: "Wechsel",
  };

  // Initialize stats
  let totalDistance = 0;
  let totalDuration = 0;
  let totalCalories = 0;
  let totalElevation = 0;

  const byType: Record<string, any> = {};
  const monthlyStats: any[] = [];

  // Training patterns tracking
  const hourlyDistribution = new Array(24).fill(0);
  const activeDays = new Set<string>();
  let totalHeartRate = 0;
  let heartRateCount = 0;

  // Running form metrics
  const runningFormData: any[] = [];

  // Cycling power metrics
  const cyclingPowerData: any[] = [];

  // Training effect tracking
  const trainingEffects: any[] = [];

  // Temperature/weather data
  const temperatureData: any[] = [];

  // Initialize monthly stats
  for (let month = 1; month <= 12; month++) {
    monthlyStats.push({
      month,
      activities: 0,
      distance: 0,
      duration: 0,
      calories: 0,
    });
  }

  // Process each activity
  for (const activity of activities) {
    const distance = (activity.distance || 0) / 1000; // Convert to km
    const duration = (activity.duration || 0) / 3600; // Convert to hours
    const calories = activity.calories || 0;
    const elevation = activity.elevationGain || 0;

    totalDistance += distance;
    totalDuration += duration;
    totalCalories += calories;
    totalElevation += elevation;

    // Get activity type
    const activityType = activity.activityType?.typeKey?.toLowerCase() || "other";
    const mappedType = typeMap[activityType] || "other";

    // Track unknown types for debugging
    if (!typeMap[activityType] && activityType !== "other") {
      unknownTypes.add(activityType);
    }

    // Update sport stats
    if (!byType[mappedType]) {
      byType[mappedType] = {
        type: mappedType,
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

    byType[mappedType].count++;
    byType[mappedType].totalDistance += distance;
    byType[mappedType].totalDuration += duration;
    byType[mappedType].totalCalories += calories;
    byType[mappedType].totalElevation += elevation;

    // Track detailed breakdown for "other" activities
    if (mappedType === "other") {
      const displayName = otherDisplayNames[activityType] || activityType;
      if (!otherBreakdown[activityType]) {
        otherBreakdown[activityType] = {
          count: 0,
          totalDistance: 0,
          totalDuration: 0,
          displayName,
        };
      }
      otherBreakdown[activityType].count++;
      otherBreakdown[activityType].totalDistance += distance;
      otherBreakdown[activityType].totalDuration += duration;
    }

    // Track detailed breakdown for cycling subtypes
    if (mappedType === "cycling") {
      const cyclingDisplayNames: Record<string, string> = {
        road_biking: "Rennrad",
        cycling: "Radfahren",
        mountain_biking: "Mountainbike",
        gravel_cycling: "Gravel",
        indoor_cycling: "Indoor",
        virtual_ride: "Virtuell",
        e_bike: "E-Bike",
        e_bike_cycling: "E-Bike",
        spinning: "Spinning",
        commuting: "Pendeln",
        bmx: "BMX",
        cyclocross: "Cyclocross",
      };
      const displayName = cyclingDisplayNames[activityType] || activityType;
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
      cyclingBreakdown[key].totalDistance += distance;
      cyclingBreakdown[key].totalDuration += duration;
    }

    // Track longest activity
    if (!byType[mappedType].longestActivity || distance > byType[mappedType].longestActivity.distance / 1000) {
      byType[mappedType].longestActivity = {
        name: activity.activityName,
        distance: distance * 1000,
        duration: duration * 3600,
        date: new Date(activity.startTimeLocal),
      };
    }

    // Update monthly stats
    const activityDate = new Date(activity.startTimeLocal);
    const month = activityDate.getMonth(); // 0-11
    monthlyStats[month].activities++;
    monthlyStats[month].distance += distance;
    monthlyStats[month].duration += duration;
    monthlyStats[month].calories += calories;

    // Track hourly distribution
    const hour = activityDate.getHours();
    hourlyDistribution[hour]++;

    // Track active days
    const dateStr = activityDate.toISOString().split("T")[0];
    activeDays.add(dateStr);

    // Track heart rate if available
    if (activity.averageHR) {
      totalHeartRate += activity.averageHR;
      heartRateCount++;
    }

    // Extract running form metrics
    if (mappedType === "running") {
      const formData: any = {
        date: activityDate,
        distance: distance,
        duration: duration * 3600, // back to seconds
      };

      if (activity.avgGroundContactTime) formData.groundContactTime = activity.avgGroundContactTime;
      if (activity.avgVerticalOscillation) formData.verticalOscillation = activity.avgVerticalOscillation;
      if (activity.avgStrideLength) formData.strideLength = activity.avgStrideLength;
      // Garmin uses "average" not "avg" for cadence!
      if (activity.averageRunningCadenceInStepsPerMinute) {
        formData.cadence = activity.averageRunningCadenceInStepsPerMinute;
      }
      if (activity.avgVerticalRatio) formData.verticalRatio = activity.avgVerticalRatio;
      if (activity.avgGroundContactBalance) formData.groundContactBalance = activity.avgGroundContactBalance;

      // Only add if we have at least one form metric
      if (Object.keys(formData).length > 3) {
        runningFormData.push(formData);
      }
    }

    // Extract cycling power metrics
    if (mappedType === "cycling") {
      const powerData: any = {
        date: activityDate,
        distance: distance,
        duration: duration * 3600,
      };

      if (activity.avgPower) powerData.avgPower = activity.avgPower;
      if (activity.maxPower) powerData.maxPower = activity.maxPower;
      if (activity.normPower) powerData.normPower = activity.normPower;
      if (activity.max20MinPower) powerData.ftp = activity.max20MinPower;
      if (activity.trainingStressScore) powerData.tss = activity.trainingStressScore;
      if (activity.intensityFactor) powerData.intensityFactor = activity.intensityFactor;
      if (activity.leftBalance) powerData.leftBalance = activity.leftBalance;
      if (activity.rightBalance) powerData.rightBalance = activity.rightBalance;

      if (powerData.avgPower) {
        cyclingPowerData.push(powerData);
      }
    }

    // Extract training effect
    if (activity.aerobicTrainingEffect || activity.anaerobicTrainingEffect) {
      trainingEffects.push({
        date: activityDate,
        type: mappedType,
        aerobic: activity.aerobicTrainingEffect || 0,
        anaerobic: activity.anaerobicTrainingEffect || 0,
        label: activity.trainingEffectLabel || null,
      });
    }

    // Extract temperature data
    if (activity.minTemperature !== undefined || activity.maxTemperature !== undefined) {
      temperatureData.push({
        date: activityDate,
        type: mappedType,
        minTemp: activity.minTemperature,
        maxTemp: activity.maxTemperature,
        avgTemp: activity.minTemperature && activity.maxTemperature
          ? (activity.minTemperature + activity.maxTemperature) / 2
          : null,
        pace: mappedType === "running" && activity.averageSpeed
          ? 1000 / activity.averageSpeed / 60 // min/km
          : null,
      });
    }
  }

  // Calculate averages
  for (const type of Object.keys(byType)) {
    if (byType[type].count > 0) {
      byType[type].avgDistance = byType[type].totalDistance / byType[type].count;
      byType[type].avgDuration = byType[type].totalDuration / byType[type].count;
    }
  }

  // Generate insights
  const insights = generateInsights({
    totalActivities: activities.length,
    totalDistance,
    totalDuration,
    totalCalories,
    totalElevation,
    monthlyStats,
  });

  // Find records (includes multisport segments thanks to expandMultisportActivities)
  const records = findRecords(activities);

  // Calculate training patterns
  const trainingPatterns = calculateTrainingPatterns(
    hourlyDistribution,
    Array.from(activeDays),
    activities.length,
    totalDistance,
    totalElevation,
    Object.keys(byType).length,
    records.longestStreak
  );

  // Calculate real health stats from Garmin API data
  const healthStats = calculateRealHealthStats(healthData, activities, totalDuration);

  // Process wellness insights from wellnessData
  const wellnessInsights = wellnessData ? processWellnessInsights(wellnessData, activities) : null;

  // Process running form analytics
  const runningFormAnalytics = processRunningForm(runningFormData);

  // Process cycling power analytics
  const cyclingPowerAnalytics = processCyclingPower(cyclingPowerData);

  // Process training effects
  const trainingEffectAnalytics = processTrainingEffects(trainingEffects);

  // Calculate badges/achievements
  const achievements = calculateAchievements(
    activities, records, runningFormData, cyclingPowerData,
    trainingEffects, temperatureData, totalDistance, totalElevation,
    Array.from(activeDays).length
  );

  // Log unknown activity types for debugging
  if (unknownTypes.size > 0) {
    console.log(`[Garmin Wrapped] Unknown activity types found:`, Array.from(unknownTypes));
  }

  return {
    year,
    totalActivities: activities.length,
    totalDistance,
    totalDuration,
    totalElevation,
    totalCalories,
    byType,
    records,
    monthlyStats,
    weekdayStats: calculateWeekdayStats(activities),
    insights,
    trainingPatterns,
    healthStats,
    wellnessInsights,
    runningFormAnalytics,
    cyclingPowerAnalytics,
    trainingEffectAnalytics,
    achievements,
    unknownActivityTypes: Array.from(unknownTypes), // For debugging
    otherBreakdown, // Detailed breakdown of "other" activities
    cyclingBreakdown: Object.keys(cyclingBreakdown).length > 0 ? cyclingBreakdown : undefined, // Breakdown of cycling subtypes
    userWeight, // User weight from Garmin profile in kg
  };
}

// Process running form data into insights
function processRunningForm(formData: any[]) {
  if (formData.length === 0) return null;

  // Calculate averages
  let totalGCT = 0, gctCount = 0;
  let totalVO = 0, voCount = 0;
  let totalStride = 0, strideCount = 0;
  let totalCadence = 0, cadenceCount = 0;
  let totalVR = 0, vrCount = 0;
  let totalBalance = 0, balanceCount = 0;

  let bestGCT = Infinity;
  let bestVO = Infinity;
  let bestCadence = 0;

  for (const data of formData) {
    if (data.groundContactTime) {
      totalGCT += data.groundContactTime;
      gctCount++;
      if (data.groundContactTime < bestGCT) bestGCT = data.groundContactTime;
    }
    if (data.verticalOscillation) {
      totalVO += data.verticalOscillation;
      voCount++;
      if (data.verticalOscillation < bestVO) bestVO = data.verticalOscillation;
    }
    if (data.strideLength) {
      totalStride += data.strideLength;
      strideCount++;
    }
    if (data.cadence) {
      totalCadence += data.cadence;
      cadenceCount++;
      if (data.cadence > bestCadence) bestCadence = data.cadence;
    }
    if (data.verticalRatio) {
      totalVR += data.verticalRatio;
      vrCount++;
    }
    if (data.groundContactBalance) {
      totalBalance += data.groundContactBalance;
      balanceCount++;
    }
  }

  // Calculate efficiency score (0-100)
  // Based on optimal values: GCT < 240ms, VO < 8cm, Cadence 180+
  let efficiencyScore = 50; // baseline
  if (gctCount > 0) {
    const avgGCT = totalGCT / gctCount;
    efficiencyScore += avgGCT < 240 ? 15 : avgGCT < 260 ? 10 : avgGCT < 280 ? 5 : 0;
  }
  if (voCount > 0) {
    const avgVO = totalVO / voCount;
    efficiencyScore += avgVO < 8 ? 15 : avgVO < 9 ? 10 : avgVO < 10 ? 5 : 0;
  }
  if (cadenceCount > 0) {
    const avgCadence = totalCadence / cadenceCount;
    efficiencyScore += avgCadence >= 180 ? 15 : avgCadence >= 170 ? 10 : avgCadence >= 160 ? 5 : 0;
  }
  efficiencyScore = Math.min(100, Math.max(0, efficiencyScore));

  // Trend analysis (first half vs second half)
  const sorted = [...formData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
  const secondHalf = sorted.slice(Math.floor(sorted.length / 2));

  let trend: "improving" | "declining" | "stable" = "stable";
  if (gctCount >= 10) {
    const firstGCT = firstHalf.filter(d => d.groundContactTime).reduce((s, d) => s + d.groundContactTime, 0) /
                     firstHalf.filter(d => d.groundContactTime).length || 0;
    const secondGCT = secondHalf.filter(d => d.groundContactTime).reduce((s, d) => s + d.groundContactTime, 0) /
                      secondHalf.filter(d => d.groundContactTime).length || 0;
    if (firstGCT && secondGCT) {
      const diff = ((firstGCT - secondGCT) / firstGCT) * 100; // lower is better, so positive = improving
      if (diff > 3) trend = "improving";
      else if (diff < -3) trend = "declining";
    }
  }

  return {
    dataPoints: formData.length,
    avgGroundContactTime: gctCount > 0 ? Math.round(totalGCT / gctCount) : null,
    avgVerticalOscillation: voCount > 0 ? Math.round((totalVO / voCount) * 10) / 10 : null,
    avgStrideLength: strideCount > 0 ? Math.round((totalStride / strideCount) * 100) / 100 : null,
    avgCadence: cadenceCount > 0 ? Math.round(totalCadence / cadenceCount) : null,
    avgVerticalRatio: vrCount > 0 ? Math.round((totalVR / vrCount) * 10) / 10 : null,
    avgBalance: balanceCount > 0 ? Math.round((totalBalance / balanceCount) * 10) / 10 : null,
    bestGroundContactTime: bestGCT !== Infinity ? bestGCT : null,
    bestVerticalOscillation: bestVO !== Infinity ? Math.round(bestVO * 10) / 10 : null,
    bestCadence: bestCadence > 0 ? bestCadence : null,
    efficiencyScore,
    trend,
    hasData: formData.length >= 5,
  };
}

// Process cycling power data
function processCyclingPower(powerData: any[]) {
  if (powerData.length === 0) return null;

  let totalPower = 0, powerCount = 0;
  let maxPowerEver = 0;
  let maxFTP = 0;
  let totalTSS = 0, tssCount = 0;
  let totalBalance = 0, balanceCount = 0;

  for (const data of powerData) {
    if (data.avgPower) {
      totalPower += data.avgPower;
      powerCount++;
    }
    if (data.maxPower && data.maxPower > maxPowerEver) {
      maxPowerEver = data.maxPower;
    }
    if (data.ftp && data.ftp > maxFTP) {
      maxFTP = data.ftp;
    }
    if (data.tss) {
      totalTSS += data.tss;
      tssCount++;
    }
    if (data.leftBalance) {
      totalBalance += data.leftBalance;
      balanceCount++;
    }
  }

  // FTP trend with concrete values
  const sorted = [...powerData].filter(d => d.ftp).sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  let ftpTrend: "improving" | "declining" | "stable" = "stable";
  let ftpTrendDetails: {
    startFTP: number;
    endFTP: number;
    changePercent: number;
    startPeriod: string;
    endPeriod: string;
  } | null = null;

  if (sorted.length >= 4) {
    const firstEntries = sorted.slice(0, 2);
    const lastEntries = sorted.slice(-2);
    const firstFTP = Math.round(firstEntries.reduce((s, d) => s + d.ftp, 0) / 2);
    const lastFTP = Math.round(lastEntries.reduce((s, d) => s + d.ftp, 0) / 2);
    const diff = ((lastFTP - firstFTP) / firstFTP) * 100;

    // Get months for context
    const startMonth = new Date(firstEntries[0].date).toLocaleDateString("de-DE", { month: "short" });
    const endMonth = new Date(lastEntries[lastEntries.length - 1].date).toLocaleDateString("de-DE", { month: "short" });

    ftpTrendDetails = {
      startFTP: firstFTP,
      endFTP: lastFTP,
      changePercent: Math.round(diff),
      startPeriod: startMonth,
      endPeriod: endMonth,
    };

    if (diff > 3) ftpTrend = "improving";
    else if (diff < -3) ftpTrend = "declining";
  }

  return {
    dataPoints: powerData.length,
    avgPower: powerCount > 0 ? Math.round(totalPower / powerCount) : null,
    maxPower: maxPowerEver > 0 ? maxPowerEver : null,
    estimatedFTP: maxFTP > 0 ? maxFTP : null,
    totalTSS: Math.round(totalTSS),
    avgBalance: balanceCount > 0 ? Math.round(totalBalance / balanceCount) : null,
    ftpTrend,
    ftpTrendDetails,
    hasData: powerData.length >= 3,
  };
}

// Process training effects
function processTrainingEffects(effects: any[]) {
  if (effects.length === 0) return null;

  let totalAerobic = 0, totalAnaerobic = 0;
  let maxAerobic = 0, maxAnaerobic = 0;
  const labelCounts: Record<string, number> = {};

  for (const effect of effects) {
    totalAerobic += effect.aerobic;
    totalAnaerobic += effect.anaerobic;
    if (effect.aerobic > maxAerobic) maxAerobic = effect.aerobic;
    if (effect.anaerobic > maxAnaerobic) maxAnaerobic = effect.anaerobic;
    if (effect.label) {
      labelCounts[effect.label] = (labelCounts[effect.label] || 0) + 1;
    }
  }

  // Find most common training effect label
  const topLabel = Object.entries(labelCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || null;

  return {
    dataPoints: effects.length,
    avgAerobicEffect: Math.round((totalAerobic / effects.length) * 10) / 10,
    avgAnaerobicEffect: Math.round((totalAnaerobic / effects.length) * 10) / 10,
    maxAerobicEffect: maxAerobic,
    maxAnaerobicEffect: maxAnaerobic,
    dominantLabel: topLabel,
    hasData: effects.length >= 5,
  };
}

// Calculate achievements/badges
function calculateAchievements(
  activities: any[],
  records: any,
  runningForm: any[],
  cyclingPower: any[],
  trainingEffects: any[],
  temperatureData: any[],
  totalDistance: number,
  totalElevation: number,
  activeDaysCount: number
) {
  const badges: any[] = [];

  // Distance badges - gestaffelt
  if (totalDistance >= 5000) badges.push({ id: "distance_5000", name: "Weltenbummler", emoji: "🌍", description: "5.000+ km zurückgelegt" });
  else if (totalDistance >= 2500) badges.push({ id: "distance_2500", name: "Kilometerfresser", emoji: "🛤️", description: "2.500+ km zurückgelegt" });
  else if (totalDistance >= 1000) badges.push({ id: "distance_1000", name: "Tausender-Club", emoji: "🏃", description: "1.000+ km zurückgelegt" });
  else if (totalDistance >= 500) badges.push({ id: "distance_500", name: "Streckenjäger", emoji: "🚀", description: "500+ km zurückgelegt" });

  // Elevation badges - gestaffelt
  if (totalElevation >= 50000) badges.push({ id: "elevation_50k", name: "Everest x5", emoji: "🦅", description: "50.000+ Höhenmeter bezwungen" });
  else if (totalElevation >= 25000) badges.push({ id: "elevation_25k", name: "Bergziege", emoji: "🏔️", description: "25.000+ Höhenmeter bezwungen" });
  else if (totalElevation >= 10000) badges.push({ id: "elevation_10k", name: "Gipfelstürmer", emoji: "⛰️", description: "10.000+ Höhenmeter bezwungen" });
  else if (totalElevation >= 5000) badges.push({ id: "elevation_5k", name: "Hügelkönig", emoji: "🗻", description: "5.000+ Höhenmeter bezwungen" });

  // Consistency badges - gestaffelt
  if (activeDaysCount >= 300) badges.push({ id: "consistent_300", name: "Unstoppable", emoji: "👑", description: "An 300+ Tagen trainiert" });
  else if (activeDaysCount >= 200) badges.push({ id: "consistent_200", name: "Eiserner Wille", emoji: "🔩", description: "An 200+ Tagen trainiert" });
  else if (activeDaysCount >= 100) badges.push({ id: "consistent_100", name: "Konstant", emoji: "🎯", description: "An 100+ Tagen trainiert" });
  else if (activeDaysCount >= 50) badges.push({ id: "consistent_50", name: "Regelmäßig", emoji: "📅", description: "An 50+ Tagen trainiert" });

  // Streak badges
  if (records.longestStreak >= 30) badges.push({ id: "streak_30", name: "Monatskrieger", emoji: "🔥", description: "30 Tage am Stück aktiv" });
  else if (records.longestStreak >= 14) badges.push({ id: "streak_14", name: "Zwei-Wochen-Warrior", emoji: "⚡", description: "14 Tage am Stück aktiv" });
  else if (records.longestStreak >= 7) badges.push({ id: "streak_7", name: "Wochensieger", emoji: "✨", description: "7 Tage am Stück aktiv" });

  // Running form badges
  if (runningForm.length >= 10) {
    const avgGCT = runningForm.filter(r => r.groundContactTime).reduce((s, r) => s + r.groundContactTime, 0) /
                   runningForm.filter(r => r.groundContactTime).length;
    const avgCadence = runningForm.filter(r => r.cadence).reduce((s, r) => s + r.cadence, 0) /
                       runningForm.filter(r => r.cadence).length;

    if (avgGCT && avgGCT < 240) badges.push({ id: "form_gct", name: "Leichtfuß", emoji: "🦶", description: "Effiziente Lauftechnik" });
    if (avgCadence && avgCadence >= 180) badges.push({ id: "form_cadence", name: "Kadenz-König", emoji: "👟", description: "Optimale Schrittfrequenz" });
  }

  // Cycling power badges
  if (cyclingPower.length >= 5) {
    const maxPower = Math.max(...cyclingPower.filter(c => c.maxPower).map(c => c.maxPower));
    if (maxPower >= 1000) badges.push({ id: "power_1000", name: "Kraftpaket", emoji: "⚡", description: "1.000+ Watt Spitzenleistung" });
    else if (maxPower >= 500) badges.push({ id: "power_500", name: "Powerhouse", emoji: "💥", description: "500+ Watt Spitzenleistung" });
  }

  // Temperature badges
  const coldActivities = temperatureData.filter(t => t.avgTemp !== null && t.avgTemp < 5).length;
  const hotActivities = temperatureData.filter(t => t.avgTemp !== null && t.avgTemp > 25).length;
  if (coldActivities >= 10) badges.push({ id: "cold_warrior", name: "Frostbeständig", emoji: "❄️", description: "Trainiert auch bei Kälte" });
  if (hotActivities >= 10) badges.push({ id: "heat_warrior", name: "Hitzeresistent", emoji: "☀️", description: "Trainiert auch bei Hitze" });

  // Activity count badges - gestaffelt
  if (activities.length >= 500) badges.push({ id: "activities_500", name: "Maschine", emoji: "🤖", description: "500+ Workouts absolviert" });
  else if (activities.length >= 300) badges.push({ id: "activities_300", name: "Dauerbrenner", emoji: "🏆", description: "300+ Workouts absolviert" });
  else if (activities.length >= 100) badges.push({ id: "activities_100", name: "Centurion", emoji: "💯", description: "100+ Workouts absolviert" });
  else if (activities.length >= 50) badges.push({ id: "activities_50", name: "Aufsteiger", emoji: "🌱", description: "50+ Workouts absolviert" });

  // Training effect badges - KLARER formuliert
  if (trainingEffects.length >= 10) {
    const highImpact = trainingEffects.filter(t => t.aerobic >= 4 || t.anaerobic >= 4).length;
    if (highImpact >= 50) badges.push({ id: "high_impact_50", name: "Beast Mode", emoji: "🦁", description: "50+ harte Workouts" });
    else if (highImpact >= 20) badges.push({ id: "high_impact", name: "Grenzgänger", emoji: "💪", description: "20+ harte Workouts" });
    else if (highImpact >= 10) badges.push({ id: "high_impact_10", name: "Pusher", emoji: "🔋", description: "10+ harte Workouts" });
  }

  // Variety badge - gestaffelt
  const sportTypes = new Set(activities.map(a => a.activityType?.typeKey)).size;
  if (sportTypes >= 7) badges.push({ id: "variety_7", name: "Multitalent", emoji: "🎪", description: "7+ verschiedene Sportarten" });
  else if (sportTypes >= 5) badges.push({ id: "variety", name: "Allrounder", emoji: "🎯", description: "5+ verschiedene Sportarten" });
  else if (sportTypes >= 3) badges.push({ id: "variety_3", name: "Vielseitig", emoji: "🔄", description: "3+ verschiedene Sportarten" });

  // Race distance badges
  if (records.fastestMarathon) badges.push({ id: "race_marathon", name: "Marathoni", emoji: "🏆", description: "Marathon gefinished" });
  else if (records.fastestHalfMarathon) badges.push({ id: "race_half", name: "Halbmarathon", emoji: "🥇", description: "Halbmarathon gefinished" });
  if (records.fastest10K) badges.push({ id: "race_10k", name: "10K Finisher", emoji: "🥈", description: "10 km am Stück gelaufen" });
  if (records.fastest5K) badges.push({ id: "race_5k", name: "5K Finisher", emoji: "🏅", description: "5 km am Stück gelaufen" });

  // Long ride badge
  if (records.longestRide && records.longestRide.distance >= 100000) {
    badges.push({ id: "century_ride", name: "Century Rider", emoji: "🚴", description: "100+ km Radtour absolviert" });
  }

  // Sweat loss badges - based on waterEstimated from activities
  const totalSweatLossMl = activities.reduce((sum: number, a: any) => {
    return sum + (typeof a.waterEstimated === "number" ? a.waterEstimated : 0);
  }, 0);
  const totalSweatLossLiters = totalSweatLossMl / 1000;

  if (totalSweatLossLiters >= 500) badges.push({ id: "sweat_500", name: "Wasserfall", emoji: "🌊", description: "500+ Liter Schweiß verloren" });
  else if (totalSweatLossLiters >= 200) badges.push({ id: "sweat_200", name: "Schweißtreiber", emoji: "💦", description: "200+ Liter Schweiß verloren" });
  else if (totalSweatLossLiters >= 100) badges.push({ id: "sweat_100", name: "Schwitzmeister", emoji: "💧", description: "100+ Liter Schweiß verloren" });
  else if (totalSweatLossLiters >= 50) badges.push({ id: "sweat_50", name: "Tropfenfänger", emoji: "🫗", description: "50+ Liter Schweiß verloren" });

  return {
    badges,
    totalBadges: badges.length,
    hasBadges: badges.length > 0,
  };
}

// Process wellness data into actionable insights
function processWellnessInsights(wellnessData: any, activities: any[]) {
  const weekDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const weekDayLabels: Record<string, string> = {
    sun: "Sonntag", mon: "Montag", tue: "Dienstag", wed: "Mittwoch",
    thu: "Donnerstag", fri: "Freitag", sat: "Samstag"
  };

  // Find best and worst step days
  let bestStepDay = { day: "mon", steps: 0 };
  let worstStepDay = { day: "mon", steps: Infinity };

  for (const day of weekDays) {
    const steps = wellnessData.weeklySteps[day] || 0;
    if (steps > bestStepDay.steps) {
      bestStepDay = { day, steps };
    }
    if (steps > 0 && steps < worstStepDay.steps) {
      worstStepDay = { day, steps };
    }
  }

  if (worstStepDay.steps === Infinity) {
    worstStepDay = { day: "mon", steps: 0 };
  }

  // Calculate average daily steps
  const totalSampleSteps = wellnessData.dailySteps.reduce((sum: number, d: any) => sum + d.steps, 0);
  const avgDailySteps = wellnessData.dailySteps.length > 0
    ? Math.round(totalSampleSteps / wellnessData.dailySteps.length)
    : 0;

  // Calculate total estimated steps for the year
  const estimatedYearlySteps = avgDailySteps * 365;

  // Find best month for steps
  let bestMonth = { month: 0, steps: 0 };
  for (let m = 0; m < 12; m++) {
    if (wellnessData.monthlySteps[m] > bestMonth.steps) {
      bestMonth = { month: m, steps: wellnessData.monthlySteps[m] };
    }
  }

  // Sleep score analysis
  const avgSleepScore = wellnessData.sleepScores.length > 0
    ? Math.round(wellnessData.sleepScores.reduce((sum: number, s: any) => sum + s.score, 0) / wellnessData.sleepScores.length)
    : null;

  const excellentSleepDays = wellnessData.sleepScores.filter((s: any) => s.score >= 85).length;

  // HRV analysis
  const avgHrv = wellnessData.hrvValues.length > 0
    ? Math.round(wellnessData.hrvValues.reduce((sum: number, h: any) => sum + h.hrv, 0) / wellnessData.hrvValues.length)
    : null;

  // HRV trend (first half vs second half of year)
  let hrvTrend: "improving" | "declining" | "stable" | null = null;
  if (wellnessData.hrvValues.length >= 10) {
    const sorted = [...wellnessData.hrvValues].sort((a: any, b: any) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
    const secondHalf = sorted.slice(Math.floor(sorted.length / 2));

    const firstAvg = firstHalf.reduce((sum: number, h: any) => sum + h.hrv, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum: number, h: any) => sum + h.hrv, 0) / secondHalf.length;

    const diff = ((secondAvg - firstAvg) / firstAvg) * 100;
    if (diff > 5) hrvTrend = "improving";
    else if (diff < -5) hrvTrend = "declining";
    else hrvTrend = "stable";
  }

  // Body battery insights
  const avgBodyBatteryChange = wellnessData.bodyBatteryData.length > 0
    ? Math.round(wellnessData.bodyBatteryData.reduce((sum: number, b: any) => sum + (b.change || 0), 0) / wellnessData.bodyBatteryData.length)
    : null;

  // Stress insights from activities
  const activityStressData = activities
    .filter((a: any) => a.avgStress !== undefined && a.avgStress > 0)
    .map((a: any) => ({
      date: new Date(a.startTimeLocal),
      avgStress: a.avgStress,
      type: a.activityType?.typeKey,
    }));

  const avgActivityStress = activityStressData.length > 0
    ? Math.round(activityStressData.reduce((sum: number, a: any) => sum + a.avgStress, 0) / activityStressData.length)
    : null;

  // Correlation: More active days = better HRV?
  // Group HRV by whether previous day had activity
  let hrvWithActivity = 0;
  let hrvWithActivityCount = 0;
  let hrvWithoutActivity = 0;
  let hrvWithoutActivityCount = 0;

  const activityDates = new Set(activities.map((a: any) =>
    new Date(a.startTimeLocal).toISOString().split("T")[0]
  ));

  for (const hrvEntry of wellnessData.hrvValues) {
    const prevDay = new Date(hrvEntry.date);
    prevDay.setDate(prevDay.getDate() - 1);
    const prevDayStr = prevDay.toISOString().split("T")[0];

    if (activityDates.has(prevDayStr)) {
      hrvWithActivity += hrvEntry.hrv;
      hrvWithActivityCount++;
    } else {
      hrvWithoutActivity += hrvEntry.hrv;
      hrvWithoutActivityCount++;
    }
  }

  const hrvAfterActivityAvg = hrvWithActivityCount > 0 ? Math.round(hrvWithActivity / hrvWithActivityCount) : null;
  const hrvAfterRestAvg = hrvWithoutActivityCount > 0 ? Math.round(hrvWithoutActivity / hrvWithoutActivityCount) : null;

  // VO2Max from user settings
  const vo2MaxRunning = wellnessData.userSettings?.vo2MaxRunning || null;
  const vo2MaxCycling = wellnessData.userSettings?.vo2MaxCycling || null;

  // Find months sorted by steps
  const monthNames = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

  // Floor data from Garmin API is fetched separately via floorData parameter
  // This section just initializes the variables - actual data comes from fetchFloorData()
  const totalFloorsClimbed = 0;
  const avgDailyFloors = 0;
  const weeklyFloors: { [key: string]: number } = {};
  const bestFloorDay = { date: null as string | null, floors: 0, activityName: "" };
  const hasRealFloorData = false;

  // Sweat loss - try hydration data first, then fall back to activity waterEstimated
  const sweatLossSamples = wellnessData.sweatLossSamples || [];
  let avgDailySweatLossMl = sweatLossSamples.length > 0
    ? Math.round(sweatLossSamples.reduce((sum: number, s: any) => sum + s.sweatLoss, 0) / sweatLossSamples.length)
    : null;

  // Calculate sweat loss from activities (waterEstimated field = estimated fluid loss)
  let totalActivitySweatLossMl = 0;
  let activitySweatLossCount = 0;

  // Debug: Log first 3 activities to check for waterEstimated field
  console.log("Activity sample (first 3) - checking for waterEstimated:", activities.slice(0, 3).map((a: any) => ({
    name: a.activityName,
    waterEstimated: a.waterEstimated,
    calories: a.calories,
    duration: a.duration,
  })));

  for (const activity of activities) {
    if (activity.waterEstimated && typeof activity.waterEstimated === "number" && activity.waterEstimated > 0) {
      totalActivitySweatLossMl += activity.waterEstimated;
      activitySweatLossCount++;
    }
  }

  // Use activity data if no hydration data available
  // Activity waterEstimated is total for that activity, so we sum it up for the year
  const estimatedYearlySweatLossMl = avgDailySweatLossMl
    ? avgDailySweatLossMl * 365
    : (totalActivitySweatLossMl > 0 ? totalActivitySweatLossMl : null);

  const sweatLossDataPointsTotal = sweatLossSamples.length > 0 ? sweatLossSamples.length : activitySweatLossCount;

  // Debug logging for sweat loss data
  console.log("Sweat Loss Debug:", {
    hydrationApiSamples: sweatLossSamples.length,
    avgDailySweatLossMl,
    activitySweatLossCount,
    totalActivitySweatLossMl,
    estimatedYearlySweatLossMl,
    sweatLossDataPointsTotal,
    hasSweatLossData: sweatLossSamples.length >= 5 || activitySweatLossCount >= 5,
  });

  // Build byDay object for weekly pattern
  const byDay: { [key: string]: number } = {};
  for (const day of weekDays) {
    byDay[day] = wellnessData.weeklySteps[day] || 0;
  }

  return {
    // Steps
    avgDailySteps,
    estimatedYearlySteps,
    bestStepsDay: {
      date: wellnessData.bestStepsDay.date,
      steps: wellnessData.bestStepsDay.steps,
    },
    weeklyPattern: {
      best: { day: weekDayLabels[bestStepDay.day], steps: bestStepDay.steps },
      worst: { day: weekDayLabels[worstStepDay.day], steps: worstStepDay.steps },
      byDay,
    },
    monthlySteps: wellnessData.monthlySteps,
    bestMonth: { name: monthNames[bestMonth.month], steps: bestMonth.steps },

    // Floors - disabled until real Garmin floor API is integrated
    // Use scripts/get_floors.py to fetch real floor data via Python
    totalFloorsClimbed,
    avgDailyFloors,
    floorsFromActivities: 0,
    weeklyFloors,
    hasRealFloorData,

    // Hydration / Sweat Loss
    avgDailySweatLossMl,
    estimatedYearlySweatLossMl,
    sweatLossDataPoints: sweatLossDataPointsTotal,

    // Sleep
    avgSleepScore,
    perfectSleepDays: wellnessData.perfectSleepDays,
    excellentSleepDays,
    sleepScoreCount: wellnessData.sleepScores.length,

    // HRV
    avgHrv,
    hrvTrend,
    hrvAfterActivity: hrvAfterActivityAvg,
    hrvAfterRest: hrvAfterRestAvg,
    hrvDataPoints: wellnessData.hrvValues.length,

    // Body Battery & Stress
    avgBodyBatteryChange,
    avgActivityStress,
    bodyBatteryDataPoints: wellnessData.bodyBatteryData.length,

    // Fitness metrics
    vo2MaxRunning,
    vo2MaxCycling,

    // Has enough data to show
    hasStepsData: wellnessData.dailySteps.length >= 10,
    hasSleepData: wellnessData.sleepScores.length >= 5,
    hasHrvData: wellnessData.hrvValues.length >= 5,
    hasBodyBatteryData: wellnessData.bodyBatteryData.length >= 3,
    hasSweatLossData: sweatLossSamples.length >= 5 || activitySweatLossCount >= 5,
  };
}

function calculateTrainingPatterns(
  hourlyDistribution: number[],
  activeDays: string[],
  totalActivities: number,
  totalDistance: number,
  totalElevation: number,
  sportTypesCount: number,
  longestStreak: number
) {
  // Find most active hour
  const mostActiveHour = hourlyDistribution.indexOf(Math.max(...hourlyDistribution));

  // Determine time of day preference
  const morningActivities = hourlyDistribution.slice(5, 12).reduce((a, b) => a + b, 0);
  const afternoonActivities = hourlyDistribution.slice(12, 17).reduce((a, b) => a + b, 0);
  const eveningActivities = hourlyDistribution.slice(17, 21).reduce((a, b) => a + b, 0);
  const nightActivities = hourlyDistribution.slice(21, 24).reduce((a, b) => a + b, 0) +
    hourlyDistribution.slice(0, 5).reduce((a, b) => a + b, 0);

  type TimeOfDay = "morning" | "afternoon" | "evening" | "night";
  let preferredTimeOfDay: TimeOfDay = "morning";
  const maxActivities = Math.max(morningActivities, afternoonActivities, eveningActivities, nightActivities);

  if (maxActivities === afternoonActivities) preferredTimeOfDay = "afternoon";
  else if (maxActivities === eveningActivities) preferredTimeOfDay = "evening";
  else if (maxActivities === nightActivities) preferredTimeOfDay = "night";

  // Calculate consistency score (days with activity / total days in year * 100)
  const consistency = Math.min(100, Math.round((activeDays.length / 365) * 100 * 2));

  // Determine training personality
  type PersonalityType =
    | "Der Frühaufsteher"
    | "Der Abendläufer"
    | "Der Wochenend-Krieger"
    | "Der Konsistenz-König"
    | "Der Kilometersammler"
    | "Der Höhenflügler"
    | "Der Allrounder"
    | "Der Ausdauer-Champion";

  let trainingPersonality: PersonalityType = "Der Ausdauer-Champion";

  if (sportTypesCount >= 4) trainingPersonality = "Der Allrounder";
  else if (totalElevation > 30000) trainingPersonality = "Der Höhenflügler";
  else if (longestStreak >= 14) trainingPersonality = "Der Konsistenz-König";
  else if (totalDistance > 3000) trainingPersonality = "Der Kilometersammler";
  else if (preferredTimeOfDay === "morning") trainingPersonality = "Der Frühaufsteher";
  else if (preferredTimeOfDay === "evening" || preferredTimeOfDay === "night")
    trainingPersonality = "Der Abendläufer";

  return {
    preferredTimeOfDay,
    mostActiveHour,
    consistency,
    trainingPersonality,
    hourlyDistribution,
    activeDays,
  };
}

function calculateWeekdayStats(activities: any[]) {
  const WEEKDAY_NAMES = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  const stats: any[] = [];

  for (let day = 0; day <= 6; day++) {
    const dayActivities = activities.filter((a) => {
      const date = new Date(a.startTimeLocal);
      return date.getDay() === day;
    });

    const totalDistance = dayActivities.reduce((sum, a) => sum + (a.distance || 0) / 1000, 0);

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

function findRecords(activities: any[]) {
  // All running activity types
  const runningTypes = [
    "running",
    "trail_running",
    "treadmill_running",
    "indoor_running",
    "track_running",
    "virtual_running",
    "ultra_running",
    "obstacle_run",
  ];

  // STRICT running filter - include all running types
  const running = activities.filter((a) => {
    const typeKey = (a.activityType?.typeKey || "").toLowerCase();
    return runningTypes.includes(typeKey);
  });

  // All cycling activity types
  const cyclingTypes = [
    "cycling",
    "road_biking",
    "mountain_biking",
    "gravel_cycling",
    "indoor_cycling",
    "virtual_ride",
    "e_bike",
    "e_bike_mountain",
    "e_bike_fitness",
    "bmx",
    "cyclocross",
    "commuting",
    "spin",
  ];

  // STRICT cycling filter - include all cycling types
  const cycling = activities.filter((a) => {
    const typeKey = (a.activityType?.typeKey || "").toLowerCase();
    return cyclingTypes.includes(typeKey);
  });

  // Find 5K, 10K, HM - only from running activities
  const find5K = running.filter((a) => a.distance >= 4900 && a.distance <= 5500);
  const find10K = running.filter((a) => a.distance >= 9800 && a.distance <= 10500);
  const findHM = running.filter((a) => a.distance >= 21000 && a.distance <= 22000);

  const fastest5K = find5K.length > 0
    ? find5K.reduce((f, c) => (c.duration < f.duration ? c : f), find5K[0])
    : null;

  const fastest10K = find10K.length > 0
    ? find10K.reduce((f, c) => (c.duration < f.duration ? c : f), find10K[0])
    : null;

  const fastestHM = findHM.length > 0
    ? findHM.reduce((f, c) => (c.duration < f.duration ? c : f), findHM[0])
    : null;

  // Longest run
  const longestRun = running.length > 0
    ? running.reduce((l, c) => c.distance > l.distance ? c : l, running[0])
    : null;

  // Longest ride
  const longestRide = cycling.length > 0
    ? cycling.reduce((l, c) => c.distance > l.distance ? c : l, cycling[0])
    : null;

  // Most elevation in single activity
  const withElevation = activities.filter((a) => a.elevationGain && a.elevationGain > 0);
  const mostElevation = withElevation.length > 0
    ? withElevation.reduce((m, c) => c.elevationGain > m.elevationGain ? c : m, withElevation[0])
    : null;

  // Highest Heart Rate (filter out sensor errors - max realistic HR is ~220)
  const MAX_REALISTIC_HR = 210; // Filter out obvious sensor glitches
  const withHR = activities.filter((a) => a.maxHR && a.maxHR > 0 && a.maxHR <= MAX_REALISTIC_HR);
  const highestHRActivity = withHR.length > 0
    ? withHR.reduce((h, c) => (c.maxHR || 0) > (h.maxHR || 0) ? c : h, withHR[0])
    : null;

  // Longest streak
  const sortedDates = [...new Set(activities.map((a) =>
    new Date(a.startTimeLocal).toISOString().split("T")[0]
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
    fastest5K: fastest5K ? {
      time: fastest5K.duration,
      date: new Date(fastest5K.startTimeLocal),
      activity: { name: fastest5K.activityName },
    } : undefined,
    fastest10K: fastest10K ? {
      time: fastest10K.duration,
      date: new Date(fastest10K.startTimeLocal),
      activity: { name: fastest10K.activityName },
    } : undefined,
    fastestHalfMarathon: fastestHM ? {
      time: fastestHM.duration,
      date: new Date(fastestHM.startTimeLocal),
      activity: { name: fastestHM.activityName },
    } : undefined,
    longestRun: longestRun ? {
      name: longestRun.activityName,
      distance: longestRun.distance,
      duration: longestRun.duration,
      date: new Date(longestRun.startTimeLocal),
    } : undefined,
    longestRide: longestRide ? {
      name: longestRide.activityName,
      distance: longestRide.distance,
      duration: longestRide.duration,
      date: new Date(longestRide.startTimeLocal),
    } : undefined,
    mostElevation: mostElevation ? {
      name: mostElevation.activityName,
      elevationGain: mostElevation.elevationGain,
      distance: mostElevation.distance,
      date: new Date(mostElevation.startTimeLocal),
    } : undefined,
    highestHeartRate: highestHRActivity ? {
      value: highestHRActivity.maxHR,
      activity: {
        name: highestHRActivity.activityName,
        date: new Date(highestHRActivity.startTimeLocal),
        type: highestHRActivity.activityType?.typeKey,
      },
    } : undefined,
    longestStreak,
  };
}

function generateInsights(stats: any) {
  const insights: any[] = [];
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
  const MONTH_NAMES = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  const mostActiveMonth = stats.monthlyStats.reduce((max: any, m: any) =>
    m.activities > max.activities ? m : max
  , stats.monthlyStats[0]);

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
  const pizzas = stats.totalCalories / 800;
  if (pizzas >= 10) {
    insights.push({
      type: "fun_fact",
      title: "Pizza-Power",
      value: `${Math.floor(pizzas)} Pizzen`,
      description: `Du hast genug Kalorien verbrannt für ${Math.floor(pizzas)} Pizzen!`,
      icon: "🍕",
    });
  }

  // Everest
  const everests = stats.totalElevation / 8849;
  if (everests >= 0.5) {
    insights.push({
      type: "fun_fact",
      title: "Höhenflug",
      value: `${everests.toFixed(1)}x Everest`,
      description: `${stats.totalElevation.toFixed(0)}m Höhenmeter - das ist ${everests.toFixed(1)} mal der Mount Everest!`,
      icon: "🏔️",
    });
  }

  // Time
  const movies = stats.totalDuration / 2;
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
