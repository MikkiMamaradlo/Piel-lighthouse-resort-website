import { type NextRequest, NextResponse } from "next/server"
import { createHmac, randomBytes } from "crypto"
import connectToDatabase from "@/lib/mongodb"

// Demo mode: in-memory storage for testing without MongoDB
const demoUsers: Map<string, object> = new Map()

// Password hashing using HMAC
function hashPassword(password: string): string {
  const secret = process.env.STAFF_SECRET || "piel-lighthouse-staff-secret"
  return createHmac("sha256", secret).update(password).digest("hex")
}

// Generate simple token
function generateToken(): string {
  return randomBytes(32).toString("hex")
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password, fullName, department, phone } = body

    // Validate required fields
    if (!username || !email || !password || !fullName) {
      return NextResponse.json(
        { error: "Username, email, password, and full name are required" },
        { status: 400 }
      )
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    const isDemoMode = process.env.DEMO_MODE === "true"

    // Demo mode: in-memory storage
    if (isDemoMode) {
      console.log("[Staff Register] DEMO_MODE: Registering user in memory")

      // Check for existing user in demo mode
      for (const [, user] of demoUsers) {
        const u = user as { username: string; email: string }
        if (u.username === username || u.email === email) {
          return NextResponse.json(
            { error: "Username or email already exists" },
            { status: 409 }
          )
        }
      }

      // Hash password
      const hashedPassword = hashPassword(password)

      // Create staff user in memory
      const staffId = randomBytes(16).toString("hex")
      const token = generateToken()

      const staff = {
        _id: staffId,
        username,
        email,
        password: hashedPassword,
        fullName,
        department: department || "General",
        phone: phone || "",
        role: "staff",
        isActive: true,
        authToken: token,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      demoUsers.set(staffId, staff)

      // Create response with token cookie
      const response = NextResponse.json({
        success: true,
        message: "Registration successful (Demo Mode)",
        user: {
          id: staffId,
          username,
          email,
          fullName,
          role: "staff",
        },
        demoMode: true,
      })

      // Set auth cookie
      response.cookies.set("staff_auth", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 8, // 8 hours
        path: "/",
      })

      console.log("[Staff Register] DEMO_MODE: User registered successfully")
      return response
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

    // Check if username already exists
    const existingUser = await staffCollection.findOne({
      $or: [{ username }, { email }],
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = hashPassword(password)

    // Create staff user
    const staff = {
      username,
      email,
      password: hashedPassword,
      fullName,
      department: department || "General",
      phone: phone || "",
      role: "staff",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await staffCollection.insertOne(staff)

    // Generate auth token
    const token = generateToken()

    // Store token in database
    await staffCollection.updateOne(
      { _id: result.insertedId },
      { $set: { authToken: token, updatedAt: new Date() } }
    )

    // Create response with token cookie
    const response = NextResponse.json({
      success: true,
      message: "Registration successful",
      user: {
        id: result.insertedId.toString(),
        username,
        email,
        fullName,
        role: "staff",
      },
    })

    // Set auth cookie
    response.cookies.set("staff_auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Staff registration error:", error)
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    )
  }
}
