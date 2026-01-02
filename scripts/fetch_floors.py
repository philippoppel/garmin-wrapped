#!/usr/bin/env python3
"""
Fetch yearly floor data from Garmin Connect API.
"""
import json
from datetime import datetime, timedelta
from garminconnect import Garmin
import time
import sys

def fetch_yearly_floors(email, password, year):
    client = Garmin(email, password)
    client.login()
    print("Logged in successfully")

    start_date = datetime(year, 1, 1)
    end_date = min(datetime(year, 12, 31), datetime.now())

    total_floors_up = 0
    total_floors_down = 0
    days_with_data = 0
    best_day = {"date": None, "floors": 0}
    monthly_floors = {m: 0 for m in range(1, 13)}
    weekday_floors = {d: {"total": 0, "count": 0} for d in range(7)}

    print(f"\nFetching floor data for {year} (all days)...")

    current_date = start_date
    batch_count = 0

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
        except Exception as e:
            pass

        current_date += timedelta(days=1)
        batch_count += 1

        if batch_count % 50 == 0:
            print(f"Progress: {batch_count} days...")

        if batch_count % 10 == 0:
            time.sleep(0.1)

    print("\n" + "=" * 50)
    print(f"FLOOR DATA SUMMARY FOR {year}")
    print("=" * 50)
    print(f"\nTotal days analyzed: {batch_count}")
    print(f"Days with floor data: {days_with_data}")
    print(f"\nTOTAL FLOORS ASCENDED: {int(total_floors_up)}")
    print(f"TOTAL FLOORS DESCENDED: {int(total_floors_down)}")

    if days_with_data > 0:
        avg_daily = total_floors_up / days_with_data
        bd = best_day
        print(f"\nAverage floors per active day: {avg_daily:.1f}")
        print(f"Best day: {bd['date']} with {int(bd['floors'])} floors")

        print("\n--- Monthly breakdown ---")
        month_names = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        for m in range(1, 13):
            if monthly_floors[m] > 0:
                print(f"  {month_names[m]}: {int(monthly_floors[m])} floors")

        print("\n--- Weekday averages ---")
        day_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        for d in range(7):
            if weekday_floors[d]["count"] > 0:
                avg = weekday_floors[d]["total"] / weekday_floors[d]["count"]
                print(f"  {day_names[d]}: {avg:.1f} floors/day")

    result = {
        "year": year,
        "totalFloorsAscended": int(total_floors_up),
        "totalFloorsDescended": int(total_floors_down),
        "daysWithData": days_with_data,
        "avgDailyFloors": round(total_floors_up / days_with_data, 1) if days_with_data > 0 else 0,
        "bestDay": best_day,
        "monthlyFloors": {k: int(v) for k, v in monthly_floors.items()},
        "weekdayAverages": {
            day_names[d]: round(weekday_floors[d]["total"] / weekday_floors[d]["count"], 1)
            if weekday_floors[d]["count"] > 0 else 0
            for d in range(7)
        }
    }

    print("\n--- JSON Output ---")
    print(json.dumps(result, indent=2))

    return result

if __name__ == "__main__":
    email = "philippoppel223@gmail.com"
    password = "vuzviq-doqvEn-4tibho"
    year = 2025

    fetch_yearly_floors(email, password, year)
