import { NextResponse } from "next/server"
import connectToDatabase from "@/backend/lib/database/mongodb"

export async function GET() {
  console.log("[Backend Health] Checking health...")
  
  // Check if MONGODB_URI is defined
  if (!process.env.MONGODB_URI) {
    console.log("[Backend Health] ⚠ MONGODB_URI not configured - backend running without database")
    return NextResponse.json({
      status: "ok",
      services: {
        backend: "running",
        database: "not_configured"
      }
    }, { status: 200 })
  }
  
  try {
    const { db } = await connectToDatabase()
    await db.collection("bookings").findOne({})

    console.log("[Backend Health] ✓ Backend and Database are healthy")
    return NextResponse.json({
      status: "ok",
      services: {
        backend: "running",
        database: "connected"
      }
    }, { status: 200 })
  } catch (error) {
    console.error("[Backend Health] ✗ Health check failed:", error)
    return NextResponse.json({
      status: "error",
      error: "Database connection failed",
      services: {
        backend: "running",
        database: "disconnected"
      }
    }, { status: 500 })
  }
}
