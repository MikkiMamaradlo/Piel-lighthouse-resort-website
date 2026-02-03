import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import { ObjectId } from "mongodb"

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
    
    const result = await db.collection("staff").insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    return NextResponse.json({
      success: true,
      staffId: result.insertedId.toString()
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating staff:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create staff" },
      { status: 500 }
    )
  }
}
