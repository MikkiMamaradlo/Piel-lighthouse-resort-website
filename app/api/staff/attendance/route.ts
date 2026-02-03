import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import connectToDatabase from "@/lib/mongodb"

interface AttendanceRecord {
  _id?: ObjectId
  staffId: string
  staffName: string
  date: string
  clockIn: string | null
  clockOut: string | null
  status: "present" | "absent" | "late" | "on-leave"
  hoursWorked: number | null
  createdAt: Date
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const staffId = searchParams.get("staffId")
    const date = searchParams.get("date")

    const { db } = await connectToDatabase()
    const attendanceCollection = db.collection("attendance")

    let query: Record<string, unknown> = {}

    if (staffId) {
      query.staffId = staffId
    }

    if (date) {
      query.date = date
    }

    const records = await attendanceCollection
      .find(query)
      .sort({ date: -1 })
      .toArray()

    return NextResponse.json({ attendance: records })
  } catch (error) {
    console.error("Get attendance error:", error)
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { staffId, staffName, action } = body

    if (!staffId || !action) {
      return NextResponse.json(
        { error: "Staff ID and action are required" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const attendanceCollection = db.collection("attendance")

    const today = new Date().toISOString().split("T")[0]
    const now = new Date().toTimeString().split(" ")[0].substring(0, 5)

    // Find existing record for today
    let record = await attendanceCollection.findOne({
      staffId,
      date: today,
    })

    if (!record) {
      // Create new attendance record
      const newRecord: AttendanceRecord = {
        staffId,
        staffName: staffName || "Staff Member",
        date: today,
        clockIn: null,
        clockOut: null,
        status: "absent",
        hoursWorked: null,
        createdAt: new Date(),
      }

      const result = await attendanceCollection.insertOne(newRecord)
      record = { ...newRecord, _id: result.insertedId }
    }

    if (action === "clock-in") {
      const clockInTime = new Date(`${today}T${now}`)
      const threshold = new Date(`${today}T08:00:00`)
      const status = clockInTime > threshold ? "late" : "present"

      await attendanceCollection.updateOne(
        { staffId, date: today },
        {
          $set: {
            clockIn: now,
            status,
            updatedAt: new Date(),
          },
        }
      )

      return NextResponse.json({
        success: true,
        record: { ...record, clockIn: now, status },
        message: "Clocked in successfully",
      })
    } else if (action === "clock-out") {
      let hoursWorked = null

      if (record.clockIn) {
        const inTime = new Date(`${today}T${record.clockIn}`)
        const outTime = new Date(`${today}T${now}`)
        const diffMs = outTime.getTime() - inTime.getTime()
        hoursWorked = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100
      }

      await attendanceCollection.updateOne(
        { staffId, date: today },
        {
          $set: {
            clockOut: now,
            hoursWorked,
            updatedAt: new Date(),
          },
        }
      )

      return NextResponse.json({
        success: true,
        record: { ...record, clockOut: now, hoursWorked },
        message: "Clocked out successfully",
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Attendance error:", error)
    return NextResponse.json({ error: "Failed to record attendance" }, { status: 500 })
  }
}
