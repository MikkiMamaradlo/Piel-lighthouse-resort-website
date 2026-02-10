"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { GuestProfileDropdown } from "@/components/guest-profile-dropdown"
import { ArrowLeft, Calendar, MapPin, Users, Clock } from "lucide-react"

interface Booking {
  _id: string
  roomName: string
  checkIn: string
  checkOut: string
  status: "confirmed" | "pending" | "completed" | "cancelled"
  guests: number
  totalPrice: number
  image?: string
}

interface Guest {
  username: string
  email: string
  phone?: string
  _id: string
}

export default function GuestBookingsPage() {
  const router = useRouter()
  const [guest, setGuest] = useState<Guest | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/guest/auth/check")
        if (!res.ok) {
          router.push("/guest/login")
          return
        }
        const data = await res.json()
        setGuest(data.guest)
      } catch {
        router.push("/guest/login")
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/guest/bookings")
        if (res.ok) {
          const data = await res.json()
          setBookings(data.bookings || [])
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error)
      }
    }
    if (guest) {
      fetchBookings()
    }
  }, [guest])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-amber-100 text-amber-700"
      case "completed":
        return "bg-blue-100 text-blue-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/guest/dashboard")}
                className="flex items-center gap-2 text-slate-600 hover:text-amber-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <h1 className="text-xl font-bold text-slate-800">My Bookings</h1>
            </div>
            <GuestProfileDropdown guest={guest} />
          </div>
        </div>
      </nav>

      {/* Bookings Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">No Bookings Yet</h2>
            <p className="text-slate-500 mb-6">You haven't made any reservations yet.</p>
            <button
              onClick={() => router.push("/guest/rooms")}
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-200"
            >
              Browse Rooms
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Room Image */}
                  <div className="w-full sm:w-48 h-32 bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-white" />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{booking.roomName}</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-amber-600">₱{booking.totalPrice.toLocaleString()}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{booking.guests} Guest{booking.guests > 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
