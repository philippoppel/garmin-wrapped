#!/usr/bin/env python3
"""
Fetch floor data from Garmin Connect API.
Called as subprocess from Node.js API route.

Usage: python3 get_floors.py <email> <password> <year>
Output: JSON to stdout
"""
import json
import sys
from datetime import datetime, timedelta
from garminconnect import Garmin
import time


def fetch_floor_data(email: str, password: str, year: int) -> dict:
    """Fetch floor data for the given year."""
    try:
        client = Garmin(email, password)
        client.login()
    except Exception as e:
        return {"error": f"Login failed: {str(e)}"}

    start_date = datetime(year, 1, 1)
    end_date = min(datetime(year, 12, 31), datetime.now())

    total_floors_up = 0
    total_floors_down = 0
    days_with_data = 0
    best_day = {"date": None, "floors": 0}
    monthly_floors = {m: 0 for m in range(1, 13)}
    weekday_floors = {d: {"total": 0, "count": 0} for d in range(7)}

    current_date = start_date
    batch_count = 0

    # Sample every 3rd day for faster results (still accurate enough)
    while current_date <= end_date:
        date_str = current_date.strftime("%Y-%m-%d")

        try:
            summary = client.get_user_summary(date_str)
            if summary:
                floors_up = summary.get("floorsAscended", 0) or 0
                floors_down = summary.get("floorsDescended", 0) or 0

                total_floors_up += floors_up
                total_floors_down += floors_down

                if floors_up > 0:
                    days_with_data += 1
                    month = current_date.month
                    weekday = current_date.weekday()

                    monthly_floors[month] += floors_up
                    weekday_floors[weekday]["total"] += floors_up
                    weekday_floors[weekday]["count"] += 1

                    if floors_up > best_day["floors"]:
                        best_day = {"date": date_str, "floors": floors_up}
        except Exception:
            pass

        current_date += timedelta(days=3)  # Sample every 3rd day
        batch_count += 1

        # Small delay to avoid rate limiting
        if batch_count % 5 == 0:
            time.sleep(0.1)

    # Calculate averages and extrapolate
    day_names = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
    weekly_averages = {}
    for d in range(7):
        if weekday_floors[d]["count"] > 0:
            weekly_averages[day_names[d]] = round(
                weekday_floors[d]["total"] / weekday_floors[d]["count"], 1
            )
        else:
            weekly_averages[day_names[d]] = 0

    # Extrapolate totals (we sampled every 3rd day)
    extrapolation_factor = 3
    estimated_total_up = int(total_floors_up * extrapolation_factor)
    estimated_total_down = int(total_floors_down * extrapolation_factor)

    return {
        "success": True,
        "year": year,
        "totalFloorsAscended": estimated_total_up,
        "totalFloorsDescended": estimated_total_down,
        "daysWithData": days_with_data,
        "avgDailyFloors": round(total_floors_up / days_with_data, 1) if days_with_data > 0 else 0,
        "bestDay": best_day,
        "monthlyFloors": {k: int(v * extrapolation_factor) for k, v in monthly_floors.items()},
        "weeklyAverages": weekly_averages,
    }


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(json.dumps({"error": "Usage: get_floors.py <email> <password> <year>"}))
        sys.exit(1)

    email = sys.argv[1]
    password = sys.argv[2]
    year = int(sys.argv[3])

    result = fetch_floor_data(email, password, year)
    print(json.dumps(result))
