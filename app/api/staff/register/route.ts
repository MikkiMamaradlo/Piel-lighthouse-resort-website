import { type NextRequest, NextResponse } from "next/server"
import { createHmac, randomBytes } from "crypto"
import connectToDatabase from "@/lib/mongodb"
import { type Department, type RoleByDepartment, DEPARTMENT_ROLES } from "@/backend/lib/schemas/staff"

// Password hashing using HMAC
function hashPassword(password: string): string {
  const secret = process.env.STAFF_SECRET || "piel-lighthouse-staff-secret"
  return createHmac("sha256", secret).update(password).digest("hex")
}

// Generate simple token
function generateToken(): string {
  return randomBytes(32).toString("hex")
}

// Valid departments
const VALID_DEPARTMENTS = [...Object.keys(DEPARTMENT_ROLES), "General"] as const

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password, fullName, department, role, phone } = body

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

    // Validate department
    const deptParam = department || "General"
    const isValidDepartment = VALID_DEPARTMENTS.includes(deptParam as typeof VALID_DEPARTMENTS[number])
    if (!isValidDepartment) {
      return NextResponse.json(
        { error: "Invalid department selected" },
        { status: 400 }
      )
    }

    const selectedDepartment = deptParam as Department | "General"

    // Validate role for department
    let validRoles: string[]
    if (selectedDepartment === "General") {
      validRoles = ["staff", "manager", "admin"]
    } else {
      validRoles = DEPARTMENT_ROLES[selectedDepartment as Department]
    }
    
    const roleParam = role || (selectedDepartment === "General" ? "staff" : DEPARTMENT_ROLES[selectedDepartment as Department][0])
    const selectedRole = roleParam as RoleByDepartment | "staff" | "manager" | "admin"
    
    if (!validRoles.includes(selectedRole as string)) {
      return NextResponse.json(
        { error: "Invalid role selected for the department" },
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
      department: selectedDepartment,
      role: selectedRole,
      phone: phone || "",
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
        role: selectedRole,
        department: selectedDepartment,
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
