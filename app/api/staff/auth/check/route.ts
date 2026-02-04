import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const staffAuth = request.cookies.get("staff_auth")

    if (!staffAuth || !staffAuth.value) {
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

    const staffCollection = db.collection("staff")

    // Verify token against database
    const staff = await staffCollection.findOne({ authToken: staffAuth.value })

    if (!staff) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    if (!staff.isActive) {
      return NextResponse.json({ authenticated: false, reason: "Account deactivated" }, { status: 403 })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: staff._id.toString(),
        username: staff.username,
        email: staff.email,
        fullName: staff.fullName,
        role: staff.role,
        department: staff.department,
      },
    }, { status: 200 })
  } catch (error) {
    console.error("Staff auth check error:", error)
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
