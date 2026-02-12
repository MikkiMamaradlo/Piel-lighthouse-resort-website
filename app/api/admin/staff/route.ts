import { type NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"
import { ObjectId } from "mongodb"
import connectToDatabase from "@/lib/mongodb"
import { DEPARTMENT_ROLES, type Department, type RoleByDepartment } from "@/lib/schemas/staff"

// Password hashing using HMAC
function hashPassword(password: string): string {
  const secret = process.env.STAFF_SECRET || "piel-lighthouse-staff-secret"
  return createHmac("sha256", secret).update(password).digest("hex")
}

// Valid departments
const VALID_DEPARTMENTS = [...Object.keys(DEPARTMENT_ROLES), "General"] as const

// GET all staff members
export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const staff = await db.collection("staff").find({}).toArray()
    
    return NextResponse.json({ 
      success: true, 
      staff: staff.map(s => ({
        ...s,
        _id: s._id.toString()
      }))
    })
  } catch (error) {
    console.error("Error fetching staff:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch staff" },
      { status: 500 }
    )
  }
}

// POST - Create new staff member
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()
    
    const { username, email, fullName, department, role, phone, password } = body
    
    // Validate required fields
    if (!username || !email || !fullName || !password) {
      return NextResponse.json(
        { success: false, error: "Username, email, full name, and password are required" },
        { status: 400 }
      )
    }
    
    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }
    
    // Check if username or email already exists
    const existingUser = await db.collection("staff").findOne({
      $or: [{ username }, { email }],
    })
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Username or email already exists" },
        { status: 409 }
      )
    }
    
    // Validate department
    const deptParam = department || "General"
    const isValidDepartment = VALID_DEPARTMENTS.includes(deptParam as typeof VALID_DEPARTMENTS[number])
    if (!isValidDepartment) {
      return NextResponse.json(
        { success: false, error: "Invalid department selected" },
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
        { success: false, error: "Invalid role selected for the department" },
        { status: 400 }
      )
    }
    
    // Hash the password provided by admin
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
    
    const result = await db.collection("staff").insertOne(staff)
    
    return NextResponse.json({
      success: true,
      staffId: result.insertedId.toString(),
      message: "Staff account created successfully"
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating staff:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create staff" },
      { status: 500 }
    )
  }
}

// PATCH - Update staff member (isActive status)
export async function PATCH(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { staffId, isActive } = body
    
    if (!staffId) {
      return NextResponse.json(
        { success: false, error: "Staff ID is required" },
        { status: 400 }
      )
    }
    
    const result = await db.collection("staff").updateOne(
      { _id: new ObjectId(staffId) },
      { 
        $set: { 
          isActive, 
          updatedAt: new Date() 
        } 
      }
    )
    
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Staff not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: isActive ? "Staff activated successfully" : "Staff deactivated successfully"
    })
  } catch (error) {
    console.error("Error updating staff:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update staff" },
      { status: 500 }
    )
  }
}
