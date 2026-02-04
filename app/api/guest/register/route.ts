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
    const { email, password, fullName, phone, address } = await request.json()

    if (!email || !password || !fullName || !phone) {
      return NextResponse.json(
        { error: "Email, password, full name, and phone are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
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

    // Check if email already exists
    const existingGuest = await guestCollection.findOne({ email: email.toLowerCase() })
    if (existingGuest) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = hashPassword(password)

    // Create guest
    const guest = {
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      fullName: fullName.trim(),
      phone: phone.trim(),
      address: address?.trim() || "",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await guestCollection.insertOne(guest)
    const guestId = result.insertedId.toString()

    // Generate auth token
    const token = generateToken()
    await guestCollection.updateOne(
      { _id: result.insertedId },
      { $set: { authToken: token } }
    )

    const response = NextResponse.json({
      success: true,
      message: "Registration successful",
      user: {
        id: guestId,
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
    console.error("Guest registration error:", error)
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    )
  }
}
