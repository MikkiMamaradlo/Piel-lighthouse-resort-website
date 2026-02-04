import { type NextRequest, NextResponse } from "next/server"
import { createHmac, randomBytes } from "crypto"
import connectToDatabase from "@/lib/mongodb"

// Password hashing using HMAC
function hashPassword(password: string): string {
  const secret = process.env.GUEST_SECRET || "piel-lighthouse-guest-secret"
  return createHmac("sha256", secret).update(password).digest("hex")
}

function generateToken(): string {
  return randomBytes(32).toString("hex")
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
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

    const guestCollection = db.collection("guests")

    // Find guest by email
    const guest = await guestCollection.findOne({ email: email.toLowerCase() })

    if (!guest) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Check if account is active
    if (!guest.isActive) {
      return NextResponse.json(
        { error: "Account is deactivated. Please contact admin." },
        { status: 403 }
      )
    }

    // Verify password
    const hashedPassword = hashPassword(password)
    if (hashedPassword !== guest.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Generate new auth token
    const token = generateToken()
    await guestCollection.updateOne(
      { _id: guest._id },
      { $set: { authToken: token, updatedAt: new Date() } }
    )

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: guest._id.toString(),
        email: guest.email,
        fullName: guest.fullName,
        phone: guest.phone,
      },
    })

    // Set auth cookie
    response.cookies.set("guest_auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Guest auth error:", error)
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" })
  response.cookies.delete("guest_auth")
  return response
}
