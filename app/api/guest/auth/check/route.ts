import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("guest_auth")?.value

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Database mode
    let db
    try {
      const dbConnection = await connectToDatabase()
      db = dbConnection.db
    } catch (dbError) {
      console.error("Database connection error:", dbError)
      return NextResponse.json({ authenticated: false }, { status: 503 })
    }

    const guestCollection = db.collection("guests")

    // Find guest by auth token
    const guest = await guestCollection.findOne({ authToken: token })

    if (!guest) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    if (!guest.isActive) {
      return NextResponse.json({ authenticated: false, error: "Account deactivated" }, { status: 403 })
    }

    return NextResponse.json({
      authenticated: true,
      guest: {
        _id: guest._id.toString(),
        email: guest.email,
        fullName: guest.fullName,
        phone: guest.phone,
        username: guest.username,
      },
    })
  } catch (error) {
    console.error("Guest auth check error:", error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
