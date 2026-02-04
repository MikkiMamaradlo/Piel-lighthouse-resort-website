import type { ObjectId } from "mongodb"

export interface Guest {
  _id?: ObjectId
  email: string
  password: string
  fullName: string
  phone: string
  address?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export const guestDefaults = {
  isActive: true as const,
}
