import { type NextRequest, NextResponse } from "next/server"

// Demo rooms data (only available ones)
const demoRooms = [
  {
    _id: "room1",
    name: "Beachfront Room",
    type: "room",
    capacity: "up to 4 pax",
    image: "/images/piel1.jpg",
    images: ["/images/piel1.jpg", "/images/piel2.jpg"],
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
    type: "room",
    capacity: "up to 10 pax",
    image: "/images/piel3.jpg",
    images: ["/images/piel3.jpg"],
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
    status: "available"
  },
  {
    _id: "room3",
    name: "Family Cottage",
    type: "cottage",
    capacity: "up to 15 pax",
    image: "/images/piel2.jpg",
    images: ["/images/piel2.jpg", "/images/piel4.jpg"],
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
    popular: true,
    features: ["Private toilet", "Table Cottage"],
    description: "The ultimate family accommodation! This expansive cottage comfortably hosts up to 15 guests.",
    order: 3,
    status: "available"
  }
]

export async function GET(request: NextRequest) {
  try {
    let rooms: any[] = []
    let connected = false
    
    try {
      const connectToDatabase = (await import("@/lib/mongodb")).default
      const { db } = await connectToDatabase()
      
      // Only fetch rooms that are marked as available
      rooms = await db.collection("rooms")
        .find({ status: "available" })
        .sort({ order: 1 })
        .toArray()
      
      connected = true
    } catch (dbError) {
      console.log("MongoDB not available, using demo data")
      // Filter only available rooms from demo data
      rooms = demoRooms.filter(room => room.status === "available")
    }

    return NextResponse.json({ rooms, connected }, { status: 200 })
  } catch (error) {
    console.error("Fetch available rooms error:", error)
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
  }
}
