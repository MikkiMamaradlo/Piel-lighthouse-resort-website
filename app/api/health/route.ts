import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"

export async function GET() {
  console.log("[Frontend Health] Checking health...")
  
  // Check if MONGODB_URI is defined
  if (!process.env.MONGODB_URI) {
    console.log("[Frontend Health] ⚠ MONGODB_URI not configured - frontend running without database")
    return NextResponse.json({
      status: "ok",
      services: {
        frontend: "running",
        database: "not_configured"
      }
    }, { status: 200 })
  }
  
  try {
    const { db } = await connectToDatabase()
    await db.collection("bookings").findOne({})
    
    console.log("[Frontend Health] ✓ Frontend and Database are healthy")
    return NextResponse.json({
      status: "ok",
      services: {
        frontend: "running",
        database: "connected"
      }
    }, { status: 200 })
  } catch (error) {
    console.error("[Frontend Health] ✗ Health check failed:", error)
    return NextResponse.json({
      status: "error", 
      error: "Database connection failed",
      services: {
        frontend: "running",
        database: "disconnected"
      }
    }, { status: 500 })
  }
}
