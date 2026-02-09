import { type NextRequest, NextResponse } from "next/server"
import { sendBookingConfirmationEmail } from "@/lib/email"

interface BookingData {
  name: string
  email: string
  phone: string
  checkIn: string
  checkOut: string
  guests: string
  roomType?: string
  roomId?: string
  message?: string
}

export async function POST(request: NextRequest) {
  try {
    const data: BookingData = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.checkIn || !data.checkOut || !data.guests) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate dates are not in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkInDate = new Date(data.checkIn)
    const checkOutDate = new Date(data.checkOut)

    if (checkInDate < today) {
      return NextResponse.json({ error: "Check-in date cannot be in the past" }, { status: 400 })
    }

    if (checkOutDate < today) {
      return NextResponse.json({ error: "Check-out date cannot be in the past" }, { status: 400 })
    }

    if (checkOutDate <= checkInDate) {
      return NextResponse.json({ error: "Check-out date must be after check-in date" }, { status: 400 })
    }

    // Prepare booking data
    const booking = {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || "",
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: Number.parseInt(data.guests),
      roomType: data.roomType || "Not specified",
      roomId: data.roomId || "",
      message: data.message?.trim() || "",
      createdAt: new Date().toISOString(),
    }

    console.log("Processing booking for:", booking.email)

    // Try to save to MongoDB if available
    let bookingId: string | null = null
    try {
      const connectToDatabase = (await import("@/lib/mongodb")).default
      const { db } = await connectToDatabase()
      const result = await db.collection("bookings").insertOne({
        ...booking,
        status: "pending",
      })
      bookingId = result.insertedId.toString()
      console.log("Booking saved to MongoDB:", bookingId)
    } catch (dbError) {
      // MongoDB not available - continue with email only
      console.log("MongoDB not available, proceeding with email-only mode")
      bookingId = `demo-${Date.now()}`
    }

    // Send booking email to the resort's Gmail
    const emailSent = await sendBookingConfirmationEmail({
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      roomType: booking.roomType || "Not specified",
      message: booking.message,
    })

    if (emailSent) {
      console.log("Booking email sent successfully")
    } else {
      console.log("Booking email failed (check GMAIL credentials)")
    }

    return NextResponse.json(
      {
        success: true,
        bookingId,
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
    let bookings: any[] = []
    try {
      const connectToDatabase = (await import("@/lib/mongodb")).default
      const { db } = await connectToDatabase()
      const status = request.nextUrl.searchParams.get("status")
      const query = status ? { status } : {}
      bookings = await db.collection("bookings").find(query).sort({ createdAt: -1 }).toArray()
    } catch (dbError) {
      console.log("MongoDB not available for GET")
    }

    return NextResponse.json({ bookings }, { status: 200 })
  } catch (error) {
    console.error("Fetch bookings error:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}
