import { type NextRequest, NextResponse } from "next/server"

// Demo rooms data
const demoRooms = [
  {
    _id: "room1",
    name: "Beachfront Room",
    capacity: "up to 4 pax",
    image: "/images/piel1.jpg",
    price: "₱3,500",
    period: "/night",
    inclusions: [
      { icon: "Users", text: "Direct beach access" },
      { icon: "Wind", text: "Air-conditioned" },
      { icon: "Refrigerator", text: "Mini-fridge" },
      { icon: "Tv", text: "Flat-screen TV" },
      { icon: "ShowerHead", text: "Hot shower" },
      { icon: "Wifi", text: "Free WiFi" },
    ],
    popular: true,
    features: ["Table Cottage", "Extra mattress"],
    description: "Wake up to the sound of waves in our Beachfront Room. This cozy accommodation offers direct beach access and stunning ocean views.",
    order: 1,
    status: "available"
  },
  {
    _id: "room2",
    name: "Barkada Room",
    capacity: "up to 10 pax",
    image: "/images/piel3.jpg",
    price: "₱5,500",
    period: "/night",
    inclusions: [
      { icon: "Users", text: "Spacious layout" },
      { icon: "Wind", text: "Air-conditioned" },
      { icon: "Refrigerator", text: "Mini-fridge" },
      { icon: "Tv", text: "Flat-screen TV" },
      { icon: "ShowerHead", text: "Hot shower" },
      { icon: "Wifi", text: "Free WiFi" },
    ],
    popular: false,
    features: ["Table Cottage", "Extra mattresses"],
    description: "Our spacious Barkada Room is designed for groups and families with ample space for up to 10 guests.",
    order: 2,
    status: "booked",
    currentBookingId: "demo2",
    currentGuestName: "John Chen",
    currentCheckIn: "2026-02-20",
    currentCheckOut: "2026-02-22"
  },
  {
    _id: "room3",
    name: "Family Room",
    capacity: "up to 15 pax",
    image: "/images/piel2.jpg",
    price: "₱7,500",
    period: "/night",
    inclusions: [
      { icon: "Users", text: "Large family size" },
      { icon: "Wind", text: "Air-conditioned" },
      { icon: "Refrigerator", text: "Mini-fridge" },
      { icon: "Tv", text: "Flat-screen TV" },
      { icon: "ShowerHead", text: "Enclosed shower" },
      { icon: "Wifi", text: "Free WiFi" },
    ],
    popular: false,
    features: ["Private toilet", "Table Cottage"],
    description: "The ultimate family accommodation! This expansive room comfortably hosts up to 15 guests.",
    order: 3,
    status: "available"
  }
]

export async function GET() {
  try {
    let rooms: any[] = []
    let connected = false
    
    try {
      const connectToDatabase = (await import("@/lib/mongodb")).default
      const { db } = await connectToDatabase()
      rooms = await db.collection("rooms").find().sort({ order: 1 }).toArray()
      connected = true
    } catch (dbError) {
      console.log("MongoDB not available, using demo data")
      rooms = demoRooms
    }

    return NextResponse.json({ rooms, connected }, { status: 200 })
  } catch (error) {
    console.error("Fetch rooms error:", error)
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    try {
      const connectToDatabase = (await import("@/lib/mongodb")).default
      const { db } = await connectToDatabase()
      
      const result = await db.collection("rooms").insertOne({
        ...data,
        createdAt: new Date().toISOString()
      })
      
      return NextResponse.json({ 
        success: true, 
        message: "Room created",
        id: result.insertedId.toString()
      }, { status: 201 })
    } catch (dbError) {
      console.log("MongoDB not available, room not saved")
      return NextResponse.json({ 
        success: true, 
        message: "Room created (demo mode)",
        id: `demo-${Date.now()}`
      }, { status: 201 })
    }
  } catch (error) {
    console.error("Create room error:", error)
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: "Missing room ID" }, { status: 400 })
    }

    try {
      const connectToDatabase = (await import("@/lib/mongodb")).default
      const { db } = await connectToDatabase()
      
      await db.collection("rooms").updateOne(
        { _id: new (await import("mongodb")).ObjectId(id) },
        { $set: { ...data, updatedAt: new Date().toISOString() } }
      )
    } catch (dbError) {
      console.log("MongoDB not available, update skipped")
    }

    return NextResponse.json({ success: true, message: "Room updated" }, { status: 200 })
  } catch (error) {
    console.error("Update room error:", error)
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing room ID" }, { status: 400 })
    }

    try {
      const connectToDatabase = (await import("@/lib/mongodb")).default
      const { db } = await connectToDatabase()
      
      await db.collection("rooms").deleteOne({
        _id: new (await import("mongodb")).ObjectId(id)
      })
    } catch (dbError) {
      console.log("MongoDB not available, delete skipped")
    }

    return NextResponse.json({ success: true, message: "Room deleted" }, { status: 200 })
  } catch (error) {
    console.error("Delete room error:", error)
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 })
  }
}
