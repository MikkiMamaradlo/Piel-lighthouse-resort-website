import { type NextRequest, NextResponse } from "next/server"

// Demo gallery data
const demoGallery = [
  { _id: "img1", url: "/images/piel10.jpg", title: "Welcome to Piel", category: "Resort", colSpan: "col-span-1", order: 1 },
  { _id: "img2", url: "/images/piel4.jpg", title: "Amenities Overview", category: "Amenities", colSpan: "col-span-1", order: 2 },
  { _id: "img3", url: "/images/piel1.jpg", title: "Beachfront Bliss", category: "Beach", colSpan: "col-span-1", order: 3 },
  { _id: "img4", url: "/images/piel3.jpg", title: "Barkada Room", category: "Rooms", colSpan: "col-span-1 md:col-span-2", order: 4 },
  { _id: "img5", url: "/images/piel2.jpg", title: "Family Room", category: "Rooms", colSpan: "col-span-1", order: 5 },
  { _id: "img6", url: "/images/piel7.jpg", title: "Sunset Dining", category: "Dining", colSpan: "col-span-1", order: 6 },
  { _id: "img7", url: "/images/piel9.jpg", title: "Resort Architecture", category: "Resort", colSpan: "col-span-1", order: 7 },
  { _id: "img8", url: "/images/piel8.jpg", title: "Evening Beach", category: "Beach", colSpan: "col-span-1 md:col-span-2", order: 8 },
  { _id: "img9", url: "/images/piel5.jpg", title: "Glamping", category: "Experience", colSpan: "col-span-1", order: 9 },
  { _id: "img10", url: "/images/piel6.jpg", title: "Beach Camping", category: "Experience", colSpan: "col-span-1", order: 10 },
]

export async function GET() {
  try {
    let gallery: any[] = []
    let connected = false
    
    try {
      const connectToDatabase = (await import("@/lib/mongodb")).default
      const { db } = await connectToDatabase()
      gallery = await db.collection("gallery").find().sort({ order: 1 }).toArray()
      connected = true
    } catch (dbError) {
      console.log("MongoDB not available, using demo data")
      gallery = demoGallery
    }

    return NextResponse.json({ gallery, connected }, { status: 200 })
  } catch (error) {
    console.error("Fetch gallery error:", error)
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    try {
      const connectToDatabase = (await import("@/lib/mongodb")).default
      const { db } = await connectToDatabase()
      
      const result = await db.collection("gallery").insertOne({
        ...data,
        createdAt: new Date().toISOString()
      })
      
      return NextResponse.json({ 
        success: true, 
        message: "Image added",
        id: result.insertedId.toString()
      }, { status: 201 })
    } catch (dbError) {
      return NextResponse.json({ 
        success: true, 
        message: "Image added (demo mode)",
        id: `demo-${Date.now()}`
      }, { status: 201 })
    }
  } catch (error) {
    console.error("Add gallery image error:", error)
    return NextResponse.json({ error: "Failed to add image" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: "Missing image ID" }, { status: 400 })
    }

    try {
      const connectToDatabase = (await import("@/lib/mongodb")).default
      const { db } = await connectToDatabase()
      
      await db.collection("gallery").updateOne(
        { _id: new (await import("mongodb")).ObjectId(id) },
        { $set: { ...data, updatedAt: new Date().toISOString() } }
      )
    } catch (dbError) {
      console.log("MongoDB not available, update skipped")
    }

    return NextResponse.json({ success: true, message: "Image updated" }, { status: 200 })
  } catch (error) {
    console.error("Update gallery image error:", error)
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing image ID" }, { status: 400 })
    }

    try {
      const connectToDatabase = (await import("@/lib/mongodb")).default
      const { db } = await connectToDatabase()
      
      await db.collection("gallery").deleteOne({
        _id: new (await import("mongodb")).ObjectId(id)
      })
    } catch (dbError) {
      console.log("MongoDB not available, delete skipped")
    }

    return NextResponse.json({ success: true, message: "Image deleted" }, { status: 200 })
  } catch (error) {
    console.error("Delete gallery image error:", error)
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
  }
}
