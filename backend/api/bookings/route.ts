import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/backend/lib/database/mongodb"
import type { Booking } from "@/backend/lib/schemas/booking"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.checkIn || !data.checkOut || !data.guests) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const booking: Booking = {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || "",
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: Number.parseInt(data.guests),
      roomType: data.roomType || "Not specified",
      message: data.message?.trim() || "",
      createdAt: new Date(),
      status: "pending",
    }

    const result = await db.collection("bookings").insertOne(booking)

    console.log("Booking created:", result.insertedId)

    return NextResponse.json(
      {
        success: true,
        bookingId: result.insertedId,
        message: "Booking request received! We will contact you soon.",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Booking API error:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()

    const status = request.nextUrl.searchParams.get("status")
    const query = status ? { status } : {}

    const bookings = await db.collection("bookings").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ bookings }, { status: 200 })
  } catch (error) {
    console.error("Fetch bookings error:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}
