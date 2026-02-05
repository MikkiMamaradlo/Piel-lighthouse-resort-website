import { type NextRequest, NextResponse } from "next/server"

// Staff self-registration is now disabled
// Staff accounts can only be created by admins from the Admin Portal

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Staff self-registration is disabled. Please contact an administrator to create your account." },
    { status: 403 }
  )
}
