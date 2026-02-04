import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import { sendBookingConfirmationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.checkIn || !data.checkOut || !data.guests || !data.guestId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Prepare booking data
    const booking = {
      guestId: data.guestId,
      name: data.guestName || "",
      email: data.guestEmail || "",
      phone: data.guestPhone || "",
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: Number.parseInt(data.guests),
      roomType: data.roomType || "Not specified",
      message: data.message?.trim() || "",
      createdAt: new Date().toISOString(),
      status: "pending",
    }

    console.log("Processing guest booking for:", booking.email)

    // Save to MongoDB
    let bookingId: string | null = null
    try {
      const connectToDatabase = (await import("@/lib/mongodb")).default
      const { db } = await connectToDatabase()
      const result = await db.collection("bookings").insertOne(booking)
      bookingId = result.insertedId.toString()
      console.log("Booking saved to MongoDB:", bookingId)
    } catch (dbError) {
      console.log("MongoDB not available, proceeding with email-only mode")
      bookingId = `demo-${Date.now()}`
    }

    // Send booking email
    const emailSent = await sendBookingConfirmationEmail({
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      roomType: booking.roomType,
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
    console.error("Guest booking API error:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    let bookings: any[] = []
    try {
      const connectToDatabase = (await import("@/lib/mongodb")).default
      const { db } = await connectToDatabase()
      bookings = await db
        .collection("bookings")
        .find({ guestId: userId })
        .sort({ createdAt: -1 })
        .toArray()
    } catch (dbError) {
      console.log("MongoDB not available for GET")
    }

    return NextResponse.json({ bookings }, { status: 200 })
  } catch (error) {
    console.error("Fetch bookings error:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}
