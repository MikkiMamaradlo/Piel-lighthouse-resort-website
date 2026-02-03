import type { ObjectId } from "mongodb"

export interface Staff {
  _id?: ObjectId
  username: string
  email: string
  password: string
  fullName: string
  role: "staff" | "manager" | "admin"
  department: string
  phone: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
