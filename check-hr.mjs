import pkg from "garmin-connect";
const { GarminConnect } = pkg;

const GCClient = new GarminConnect({
  username: process.env.GARMIN_EMAIL,
  password: process.env.GARMIN_PASSWORD,
});

async function checkHR() {
  console.log("Logging in...");
  await GCClient.login();
  console.log("Fetching activities...");

  const activities = await GCClient.getActivities(0, 500);

  // Filter for 2025
  const year2025 = activities.filter(a => {
    const date = new Date(a.startTimeLocal);
    return date.getFullYear() === 2025;
  });

  console.log(`\nFound ${year2025.length} activities in 2025\n`);

  // Find all activities with maxHR
  const withMaxHR = year2025.filter(a => a.maxHR && a.maxHR > 0);
  console.log(`Activities with maxHR data: ${withMaxHR.length}\n`);

  // Sort by maxHR descending
  const sorted = withMaxHR.sort((a, b) => b.maxHR - a.maxHR);

  console.log("Top 10 highest max HR values:");
  console.log("=".repeat(80));

  sorted.slice(0, 10).forEach((a, i) => {
    const date = new Date(a.startTimeLocal).toLocaleDateString("de-DE");
    const type = a.activityType?.typeKey || "unknown";
    console.log(`${i+1}. ${a.maxHR} bpm - ${a.activityName} (${type}) - ${date}`);
  });

  console.log("\n" + "=".repeat(80));
  console.log("\nActivities with maxHR > 200:");
  const suspicious = sorted.filter(a => a.maxHR > 200);
  suspicious.forEach(a => {
    const date = new Date(a.startTimeLocal).toLocaleDateString("de-DE");
    const type = a.activityType?.typeKey || "unknown";
    console.log(`  ${a.maxHR} bpm - ${a.activityName} (${type}) - ${date} - avgHR: ${a.averageHR || "N/A"}`);
  });

  if (suspicious.length === 0) {
    console.log("  None found!");
  }

  // Also check average HR stats
  const avgHRs = withMaxHR.map(a => a.averageHR).filter(Boolean);
  const overallAvgHR = Math.round(avgHRs.reduce((s, v) => s + v, 0) / avgHRs.length);
  console.log(`\nOverall average training HR: ${overallAvgHR} bpm`);
}

checkHR().catch(console.error);
