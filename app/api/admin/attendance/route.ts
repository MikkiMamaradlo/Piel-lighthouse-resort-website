import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"

interface AttendanceRecord {
  _id: string
  staffId: string
  staffName: string
  date: string
  clockIn: string | null
  clockOut: string | null
  status: "present" | "absent" | "late" | "on-leave"
  hoursWorked: number | null
  createdAt: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0]
    const staffId = searchParams.get("staffId")

    const { db } = await connectToDatabase()
    const attendanceCollection = db.collection("attendance")

    let query: Record<string, unknown> = {}

    if (date) {
      query.date = date
    }

    if (staffId) {
      query.staffId = staffId
    }

    const records = await attendanceCollection
      .find(query)
      .sort({ date: -1, clockIn: -1 })
      .toArray()

    // Get all unique staff IDs for stats
    const allRecords = await attendanceCollection
      .find({ date })
      .toArray()

    // Calculate stats
    const totalStaff = new Set(allRecords.map(r => r.staffId)).size
    const present = allRecords.filter(r => r.status === "present").length
    const late = allRecords.filter(r => r.status === "late").length
    const absent = allRecords.filter(r => r.status === "absent").length
    const onLeave = allRecords.filter(r => r.status === "on-leave").length

    return NextResponse.json({
      success: true,
      attendance: records,
      stats: {
        total: totalStaff || 0,
        present: present || 0,
        late: late || 0,
        absent: absent || 0,
        onLeave: onLeave || 0,
        attendanceRate: totalStaff > 0 ? Math.round(((present + late) / totalStaff) * 100) : 0
      }
    })
  } catch (error) {
    console.error("Get admin attendance error:", error)
    return NextResponse.json(
      { error: "Failed to fetch attendance data", success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { staffId, staffName, date, clockIn, clockOut, status, hoursWorked } = body

    if (!staffId || !date) {
      return NextResponse.json(
        { error: "Staff ID and date are required", success: false },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const attendanceCollection = db.collection("attendance")

    // Check if record exists
    const existing = await attendanceCollection.findOne({ staffId, date })

    if (existing) {
      // Update existing record
      await attendanceCollection.updateOne(
        { staffId, date },
        {
          $set: {
            clockIn: clockIn || existing.clockIn,
            clockOut: clockOut || existing.clockOut,
            status: status || existing.status,
            hoursWorked: hoursWorked || existing.hoursWorked,
            staffName: staffName || existing.staffName,
            updatedAt: new Date()
          }
        }
      )
    } else {
      // Create new record
      await attendanceCollection.insertOne({
        staffId,
        staffName: staffName || "Unknown",
        date,
        clockIn: clockIn || null,
        clockOut: clockOut || null,
        status: status || "absent",
        hoursWorked: hoursWorked || null,
        createdAt: new Date()
      })
    }

    return NextResponse.json({
      success: true,
      message: "Attendance record updated successfully"
    })
  } catch (error) {
    console.error("Update admin attendance error:", error)
    return NextResponse.json(
      { error: "Failed to update attendance", success: false },
      { status: 500 }
    )
  }
}
