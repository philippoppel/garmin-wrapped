import { GarminConnect } from "garmin-connect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, year = 2025 } = await request.json();

    const GCClient = new GarminConnect({
      username: email,
      password: password,
    });

    await GCClient.login();
    const activities = await GCClient.getActivities(0, 600);

    // Filter for year
    const yearActivities = activities.filter((a: any) => {
      const date = new Date(a.startTimeLocal);
      return date.getFullYear() === year;
    });

    // Find all activities with maxHR
    const withMaxHR = yearActivities.filter((a: any) => a.maxHR && a.maxHR > 0);

    // Sort by maxHR descending
    const sorted = withMaxHR.sort((a: any, b: any) => b.maxHR - a.maxHR);

    // Get top 15
    const top15 = sorted.slice(0, 15).map((a: any) => ({
      maxHR: a.maxHR,
      avgHR: a.averageHR,
      name: a.activityName,
      type: a.activityType?.typeKey,
      date: new Date(a.startTimeLocal).toLocaleDateString("de-DE"),
    }));

    // Activities with suspicious HR > 200
    const suspicious = sorted.filter((a: any) => a.maxHR > 200).map((a: any) => ({
      maxHR: a.maxHR,
      avgHR: a.averageHR,
      name: a.activityName,
      type: a.activityType?.typeKey,
      date: new Date(a.startTimeLocal).toLocaleDateString("de-DE"),
    }));

    // Calculate avg training HR
    const avgHRs = withMaxHR.map((a: any) => a.averageHR).filter(Boolean);
    const overallAvgHR = avgHRs.length > 0
      ? Math.round(avgHRs.reduce((s: number, v: number) => s + v, 0) / avgHRs.length)
      : null;

    return NextResponse.json({
      totalActivities: yearActivities.length,
      activitiesWithHR: withMaxHR.length,
      top15MaxHR: top15,
      suspiciousHR: suspicious,
      overallAvgTrainingHR: overallAvgHR,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
