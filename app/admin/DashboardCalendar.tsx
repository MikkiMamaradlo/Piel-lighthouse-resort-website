"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Booking {
  _id: string
  guestName: string
  checkIn: string
  checkOut: string
  status: string
  roomName?: string
}

export default function DashboardCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/admin/bookings")
        const data = await res.json()
        setBookings(data.bookings || [])
      } catch (error) {
        console.error("Failed to fetch bookings:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    return { daysInMonth, startingDay }
  }

  const getBookingsForDate = (day: number) => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return bookings.filter((booking) => {
      const checkIn = new Date(booking.checkIn).toISOString().split("T")[0]
      const checkOut = new Date(booking.checkOut).toISOString().split("T")[0]
      return dateStr >= checkIn && dateStr <= checkOut
    })
  }

  const getDateStatus = (day: number) => {
    const dayBookings = getBookingsForDate(day)
    if (dayBookings.length === 0) return "available"
    
    // Check if all bookings are confirmed
    const allConfirmed = dayBookings.every(b => b.status === "confirmed")
    const allPending = dayBookings.every(b => b.status === "pending")
    
    if (allConfirmed) return "booked"
    if (allPending) return "reserved"
    return "mixed"
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate)
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const today = new Date()
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-400"
      case "reserved":
        return "bg-amber-400"
      case "booked":
        return "bg-red-400"
      case "mixed":
        return "bg-gradient-to-r from-amber-400 to-red-400"
      default:
        return "bg-slate-300"
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">Booking Calendar</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <span className="text-sm font-semibold text-slate-900 min-w-[140px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-slate-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: startingDay }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1
          const dayStatus = getDateStatus(day)
          const dayBookings = getBookingsForDate(day)
          return (
            <div
              key={day}
              className={`aspect-square flex items-center justify-center text-sm relative ${
                isToday(day) ? "bg-blue-500 text-white rounded-lg font-semibold" : "text-slate-700 hover:bg-slate-50 rounded-lg"
              } transition-colors cursor-pointer`}
            >
              {day}
              {/* Status indicator dots */}
              <div className={`absolute bottom-1 flex gap-0.5 ${isToday(day) ? "opacity-80" : ""}`}>
                {dayBookings.length > 0 ? (
                  <>
                    <div className={`w-2 h-2 rounded-full ${getStatusDotColor(dayStatus)}`} />
                    {dayBookings.length > 1 && (
                      <div className={`w-2 h-2 rounded-full ${getStatusDotColor(dayStatus)}`} />
                    )}
                    {dayBookings.length > 2 && (
                      <div className={`w-2 h-2 rounded-full ${getStatusDotColor(dayStatus)}`} />
                    )}
                  </>
                ) : (
                  <div className={`w-2 h-2 rounded-full ${getStatusDotColor("available")}`} />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {loading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-slate-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <span className="text-slate-600">Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span className="text-slate-600">Booked</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-sm text-slate-500">{bookings.length} total bookings</span>
        <a
          href="/admin/bookings"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View all →
        </a>
      </div>
    </div>
  )
}
