import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"

// Demo mode: Validate token against demo user
function validateDemoToken(token: string): object | null {
  if (process.env.DEMO_MODE !== "true") return null

  // Demo token validation - in demo mode, any non-empty token works
  // In a real app, this would check against stored tokens
  if (token && token.length > 0) {
    return {
      _id: "demo-user-id",
      username: process.env.DEMO_STAFF_USERNAME || "demo",
      email: "demo@piel-lighthouse.com",
      fullName: "Demo Staff",
      role: "staff",
      department: "General",
      isActive: true,
    }
  }

  return null
}

export async function GET(request: NextRequest) {
  try {
    const staffAuth = request.cookies.get("staff_auth")

    if (!staffAuth || !staffAuth.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const isDemoMode = process.env.DEMO_MODE === "true"

    // Demo mode: validate against demo user
    if (isDemoMode) {
      console.log("[Staff Auth Check] DEMO_MODE: Checking auth")
      const demoUser = validateDemoToken(staffAuth.value)

      if (demoUser) {
        const user = demoUser as {
          _id: string
          username: string
          email: string
          fullName: string
          role: string
          department: string
          isActive: boolean
        }

        return NextResponse.json({
          authenticated: true,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            department: user.department,
          },
          demoMode: true,
        }, { status: 200 })
      }

      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Real database mode
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
