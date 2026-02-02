import type { ObjectId } from "mongodb"

// Admin schema for user authentication
export interface Admin {
  _id?: ObjectId
  username: string
  password: string
  role: "admin" | "editor"
  createdAt: Date
}

// Content schema for dynamic content management
export interface ContentItem {
  _id?: ObjectId
  key: string // e.g., "hero.title", "hero.subtitle", "accommodations.title"
  value: string
  type: "text" | "textarea" | "image" | "rich"
  section: string
  updatedAt: Date
}

// Gallery image schema
export interface GalleryImage {
  _id?: ObjectId
  url: string
  title: string
  category: string
  colSpan: "col-span-1" | "col-span-2"
  order: number
  createdAt: Date
}

// Testimonial schema
export interface Testimonial {
  _id?: ObjectId
  name: string
  role: string
  avatar: string
  rating: number
  text: string
  stayDate: string
  order: number
  createdAt: Date
}

// Room schema
export interface Room {
  _id?: ObjectId
  name: string
  capacity: string
  image: string
  price: string
  period: string
  inclusions: Array<{
    icon: string
    text: string
  }>
  popular: boolean
  features: string[]
  description: string
  order: number
  createdAt: Date
}

// Activity schema
export interface Activity {
  _id?: ObjectId
  name: string
  description: string
  image: string
  price: string
  duration: string
  order: number
  createdAt: Date
}

// Site settings schema
export interface SiteSettings {
  _id?: ObjectId
  key: string
  value: string
  section: string
  updatedAt: Date
}
