export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/connectDB";
import Record from "@/models/records";

// POST: Create a new record
export async function POST(request: NextRequest) {
  await connectMongo();
  const body = await request.json();

  try {
    const record = await Record.create(body);
    return NextResponse.json(
      { message: "Record created", record },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating record:", error);
    return NextResponse.json(
      { message: "Error creating record" },
      { status: 500 }
    );
  }
}

// GET: Fetch records with optional filtering and summary
export async function GET(request: NextRequest) {
  await connectMongo();

  const startingDate = request.nextUrl.searchParams.get("startingDate");
  const endingDate = request.nextUrl.searchParams.get("endingDate");

  if (startingDate && endingDate) {
    const start = new Date(startingDate);
    const end = new Date(endingDate);
    const diffDays = Math.ceil(
      Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays > 30) {
      return NextResponse.json(
        {
          message:
            "Duration between starting date and ending date should be less than 30 days",
        },
        { status: 400 }
      );
    }
  }

  const records = await Record.find({
    createdAt: {
      $gte: startingDate ? new Date(startingDate) : new Date("2023-01-01"),
      $lte: endingDate ? new Date(endingDate) : new Date(),
    },
  }).sort({ createdAt: -1 });

  if (!records || records.length === 0) {
    return NextResponse.json(
      { message: "No records found" },
      { status: 404 }
    );
  }

  // Initialize summary stats
  let highestTemperature = -Infinity;
  let lowestTemperature = Infinity;
  let totalTemperature = 0;

  let highestHumidity = -Infinity;
  let lowestHumidity = Infinity;
  let totalHumidity = 0;

  let highestMoisture = -Infinity;
  let lowestMoisture = Infinity;
  let totalMoisture = 0;

  records.forEach((r) => {
    totalTemperature += r.temperature;
    totalHumidity += r.humidity;
    totalMoisture += r.moisture;

    highestTemperature = Math.max(highestTemperature, r.temperature);
    lowestTemperature = Math.min(lowestTemperature, r.temperature);

    highestHumidity = Math.max(highestHumidity, r.humidity);
    lowestHumidity = Math.min(lowestHumidity, r.humidity);

    highestMoisture = Math.max(highestMoisture, r.moisture);
    lowestMoisture = Math.min(lowestMoisture, r.moisture);
  });

  const count = records.length;
  const summary = {
    averageTemperature: totalTemperature / count,
    highestTemperature,
    lowestTemperature,

    averageHumidity: totalHumidity / count,
    highestHumidity,
    lowestHumidity,

    averageMoisture: totalMoisture / count,
    highestMoisture,
    lowestMoisture,
  };

  return NextResponse.json(
    { message: "Records found", records, summary },
    { status: 200 }
  );
}
