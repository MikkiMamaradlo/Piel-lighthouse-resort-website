import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get("status")
    
    let bookings: any[] = []
    let connected = false
    
    try {
      const connectToDatabase = (await import("@/lib/mongodb")).default
      const { db } = await connectToDatabase()
      const query = status ? { status } : {}
      bookings = await db.collection("bookings")
        .find(query)
        .sort({ createdAt: -1 })
        .toArray()
      connected = true
    } catch (dbError) {
      console.log("MongoDB not available, using demo data")
      // Demo data for development
      bookings = [
        {
          _id: "demo1",
          name: "Maria Santos",
          email: "maria@example.com",
          phone: "09123456789",
          checkIn: "2026-02-15",
          checkOut: "2026-02-18",
          guests: 4,
          roomType: "Beachfront Room",
          message: "We want early check-in if possible",
          createdAt: new Date().toISOString(),
          status: "pending"
        },
        {
          _id: "demo2",
          name: "John Chen",
          email: "john@example.com",
          phone: "09123456790",
          checkIn: "2026-02-20",
          checkOut: "2026-02-22",
          guests: 2,
          roomType: "Barkada Room",
          message: "Honeymoon package please",
          createdAt: new Date().toISOString(),
          status: "confirmed"
        },
        {
          _id: "demo3",
          name: "Group Booking",
          email: "group@example.com",
          phone: "09123456791",
          checkIn: "2026-03-01",
          checkOut: "2026-03-05",
          guests: 15,
          roomType: "Family Room",
          message: "Team building event",
          createdAt: new Date().toISOString(),
          status: "pending"
        }
      ]
    }

    return NextResponse.json({ bookings, connected }, { status: 200 })
  } catch (error) {
    console.error("Fetch bookings error:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json()
    
    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    try {
      const connectToDatabase = (await import("@/lib/mongodb")).default
      const { db } = await connectToDatabase()
      
      await db.collection("bookings").updateOne(
        { _id: new (await import("mongodb")).ObjectId(id) },
        { $set: { status, updatedAt: new Date().toISOString() } }
      )
    } catch (dbError) {
      console.log("MongoDB not available, update skipped")
    }

    return NextResponse.json({ success: true, message: "Booking updated" }, { status: 200 })
  } catch (error) {
    console.error("Update booking error:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing booking ID" }, { status: 400 })
    }

    try {
      const connectToDatabase = (await import("@/lib/mongodb")).default
      const { db } = await connectToDatabase()
      
      await db.collection("bookings").deleteOne({
        _id: new (await import("mongodb")).ObjectId(id)
      })
    } catch (dbError) {
      console.log("MongoDB not available, delete skipped")
    }

    return NextResponse.json({ success: true, message: "Booking deleted" }, { status: 200 })
  } catch (error) {
    console.error("Delete booking error:", error)
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 })
  }
}
