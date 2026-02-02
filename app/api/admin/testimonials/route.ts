import { type NextRequest, NextResponse } from "next/server"

// Demo testimonials data
const demoTestimonials = [
  {
    _id: "test1",
    name: "Maria Santos",
    role: "Family Vacation",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    text: "Absolutely amazing experience! The beachfront room was perfect, and the staff was incredibly hospitable. Our kids loved the kiddie pool and we enjoyed the sunset dining. Will definitely be back!",
    stayDate: "December 2025",
    order: 1
  },
  {
    _id: "test2",
    name: "John & Lisa Chen",
    role: "Couple's Getaway",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    text: "We came here for our honeymoon and it exceeded all expectations. The beach glamping experience was magical, and the jacuzzi under the stars was romantic. Highly recommended for couples!",
    stayDate: "November 2025",
    order: 2
  },
  {
    _id: "test3",
    name: "Mark Rivera",
    role: "Barkada Trip",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    text: "Perfect for group trips! Our barkada room was spacious and the videoke nights were legendary. The beach volleyball and water sports kept us entertained. Great value for money!",
    stayDate: "October 2025",
    order: 3
  },
  {
    _id: "test4",
    name: "Emily Thompson",
    role: "Solo Traveler",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    text: "A peaceful retreat away from the city noise. Loved the spa services and morning beach walks. The staff made me feel so welcome. Already planning my next visit!",
    stayDate: "September 2025",
    order: 4
  },
  {
    _id: "test5",
    name: "David & Jennifer",
    role: "Anniversary Celebration",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    text: "We celebrated our anniversary here and it was perfect. The special dinner setup on the beach was romantic, and the room decoration was a lovely touch. Thank you Piel Lighthouse!",
    stayDate: "August 2025",
    order: 5
  },
  {
    _id: "test6",
    name: "Robert Garcia",
    role: "Corporate Event",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    text: "We hosted our team building here and the function hall was excellent. The amenities cater to all needs and the staff was professional. A great venue for events!",
    stayDate: "July 2025",
    order: 6
  }
]

export async function GET() {
  try {
    let testimonials: any[] = []
    let connected = false
    
    try {
      const connectToDatabase = (await import("@/lib/mongodb")).default
      const { db } = await connectToDatabase()
      testimonials = await db.collection("testimonials").find().sort({ order: 1 }).toArray()
      connected = true
    } catch (dbError) {
      console.log("MongoDB not available, using demo data")
      testimonials = demoTestimonials
    }

    return NextResponse.json({ testimonials, connected }, { status: 200 })
  } catch (error) {
    console.error("Fetch testimonials error:", error)
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    try {
      const connectToDatabase = (await import("@/lib/mongodb")).default
      const { db } = await connectToDatabase()
      
      const result = await db.collection("testimonials").insertOne({
        ...data,
        createdAt: new Date().toISOString()
      })
      
      return NextResponse.json({ 
        success: true, 
        message: "Testimonial added",
        id: result.insertedId.toString()
      }, { status: 201 })
    } catch (dbError) {
      return NextResponse.json({ 
        success: true, 
        message: "Testimonial added (demo mode)",
        id: `demo-${Date.now()}`
      }, { status: 201 })
    }
  } catch (error) {
    console.error("Add testimonial error:", error)
    return NextResponse.json({ error: "Failed to add testimonial" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: "Missing testimonial ID" }, { status: 400 })
    }

    try {
      const connectToDatabase = (await import("@/lib/mongodb")).default
      const { db } = await connectToDatabase()
      
      await db.collection("testimonials").updateOne(
        { _id: new (await import("mongodb")).ObjectId(id) },
        { $set: { ...data, updatedAt: new Date().toISOString() } }
      )
    } catch (dbError) {
      console.log("MongoDB not available, update skipped")
    }

    return NextResponse.json({ success: true, message: "Testimonial updated" }, { status: 200 })
  } catch (error) {
    console.error("Update testimonial error:", error)
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing testimonial ID" }, { status: 400 })
    }

    try {
      const connectToDatabase = (await import("@/lib/mongodb")).default
      const { db } = await connectToDatabase()
      
      await db.collection("testimonials").deleteOne({
        _id: new (await import("mongodb")).ObjectId(id)
      })
    } catch (dbError) {
      console.log("MongoDB not available, delete skipped")
    }

    return NextResponse.json({ success: true, message: "Testimonial deleted" }, { status: 200 })
  } catch (error) {
    console.error("Delete testimonial error:", error)
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 })
  }
}
