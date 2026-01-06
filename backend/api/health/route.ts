import { NextResponse } from "next/server"
import connectToDatabase from "@/backend/lib/database/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    await db.collection("bookings").findOne({})

    return NextResponse.json({ status: "ok" }, { status: 200 })
  } catch (error) {
    console.error("[v0] Health check failed:", error)
    return NextResponse.json({ status: "error", error: "Database connection failed" }, { status: 500 })
  }
}
