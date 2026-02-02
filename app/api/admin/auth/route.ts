import { type NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"

// Simple password hashing using HMAC
function hashPassword(password: string): string {
  const secret = process.env.ADMIN_SECRET || "piel-lighthouse-admin-secret"
  return createHmac("sha256", secret).update(password).digest("hex")
}

function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword
}

// Admin credentials from environment
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || hashPassword("admin123")

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Simple authentication check
    if (username === ADMIN_USERNAME && verifyPassword(password, ADMIN_PASSWORD_HASH)) {
      // In production, use proper session management with JWT or cookies
      const response = NextResponse.json({
        success: true,
        message: "Login successful",
        user: { username, role: "admin" }
      })

      // Set a simple cookie for demo (in production, use proper auth)
      response.cookies.set("admin_auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 // 24 hours
      })

      return response
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    )
  } catch (error) {
    console.error("Admin auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" })
  response.cookies.delete("admin_auth")
  return response
}
