import { type NextRequest, NextResponse } from "next/server"
import { createHmac, randomBytes } from "crypto"
import connectToDatabase from "@/lib/mongodb"

// Password hashing using HMAC
function hashPassword(password: string): string {
  const secret = process.env.STAFF_SECRET || "piel-lighthouse-staff-secret"
  return createHmac("sha256", secret).update(password).digest("hex")
}

function generateToken(): string {
  return randomBytes(32).toString("hex")
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

    // Database mode
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
