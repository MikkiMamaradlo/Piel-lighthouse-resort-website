import type { ObjectId } from "mongodb"

export interface Booking {
  _id?: ObjectId
  name: string
  email: string
  phone: string
  checkIn: string
  checkOut: string
  guests: number
  roomType?: string
  message: string
  createdAt: Date
  status: "pending" | "confirmed" | "cancelled"
}

export const bookingDefaults = {
  status: "pending" as const,
}
