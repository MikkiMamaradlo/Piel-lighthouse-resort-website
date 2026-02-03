import { type NextRequest, NextResponse } from "next/server"
import { createHmac, randomBytes } from "crypto"
import connectToDatabase from "@/lib/mongodb"

// Import demo users from register route (shared in-memory storage)
// In production, this would be replaced by a proper database

// Password hashing using HMAC
function hashPassword(password: string): string {
  const secret = process.env.STAFF_SECRET || "piel-lighthouse-staff-secret"
  return createHmac("sha256", secret).update(password).digest("hex")
}

function generateToken(): string {
  return randomBytes(32).toString("hex")
}

// Demo mode: Check credentials against demo users
// Note: We need to share the demoUsers map between files
// For now, we'll create a simple demo user if in demo mode
function getDemoUser(username: string, password: string): object | null {
  if (process.env.DEMO_MODE !== "true") return null

  const demoUsername = process.env.DEMO_STAFF_USERNAME || "demo"
  const demoPassword = process.env.DEMO_STAFF_PASSWORD || "demo123"

  if (username === demoUsername && password === demoPassword) {
    return {
      _id: "demo-user-id",
      username: demoUsername,
      email: "demo@piel-lighthouse.com",
      fullName: "Demo Staff",
      role: "staff",
      department: "General",
      isActive: true,
      authToken: generateToken(),
    }
  }

  return null
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      )
    }

    const isDemoMode = process.env.DEMO_MODE === "true"

    // Demo mode: use demo credentials
    if (isDemoMode) {
      console.log("[Staff Auth] DEMO_MODE: Authenticating demo user")
      const demoUser = getDemoUser(username, password)

      if (demoUser) {
        const user = demoUser as {
          _id: string
          username: string
          email: string
          fullName: string
          role: string
          department: string
          authToken: string
        }

        const response = NextResponse.json({
          success: true,
          message: "Login successful (Demo Mode)",
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            department: user.department,
          },
          demoMode: true,
        })

        response.cookies.set("staff_auth", user.authToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 8,
          path: "/",
        })

        return response
      }
    }

    // Real database mode
    let db
    try {
      const dbConnection = await connectToDatabase()
      db = dbConnection.db
    } catch (dbError) {
      console.error("Database connection error:", dbError)
      return NextResponse.json(
        { error: "Database not connected. Please configure MONGODB_URI in .env.local" },
        { status: 503 }
      )
    }

    const staffCollection = db.collection("staff")

    // Find staff by username
    const staff = await staffCollection.findOne({ username })

    if (!staff) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Check if account is active
    if (!staff.isActive) {
      return NextResponse.json(
        { error: "Account is deactivated. Please contact admin." },
        { status: 403 }
      )
    }

    // Verify password
    const hashedPassword = hashPassword(password)
    if (hashedPassword !== staff.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Generate new auth token
    const token = generateToken()
    await staffCollection.updateOne(
      { _id: staff._id },
      { $set: { authToken: token, updatedAt: new Date() } }
    )

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: staff._id.toString(),
        username: staff.username,
        email: staff.email,
        fullName: staff.fullName,
        role: staff.role,
        department: staff.department,
      },
    })

    // Set auth cookie
    response.cookies.set("staff_auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Staff auth error:", error)
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" })
  response.cookies.delete("staff_auth")
  return response
}
