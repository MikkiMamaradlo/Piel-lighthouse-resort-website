import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const adminAuth = request.cookies.get("admin_auth")

    if (adminAuth && adminAuth.value === "true") {
      return NextResponse.json({ authenticated: true }, { status: 200 })
    }

    return NextResponse.json({ authenticated: false }, { status: 401 })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
