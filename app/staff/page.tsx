"use client"

import { useEffect, useState } from "react"

interface Booking {
  _id: string
  guestName: string
  email: string
  checkIn: string
  checkOut: string
  roomType: string
  status: string
  guests: number
}

interface Stats {
  totalBookings: number
  pendingBookings: number
  checkedIn: number
  checkedOut: number
}

// Icons for stat cards
const BookingIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const PendingIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const CheckInIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
  </svg>
)

const CompletedIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

export default function StaffDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    pendingBookings: 0,
    checkedIn: 0,
    checkedOut: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsRes = await fetch("/api/admin/bookings")
        
        if (!bookingsRes.ok) {
          throw new Error("Failed to fetch bookings")
        }
        
        const bookingsData = await bookingsRes.json()
        setBookings(bookingsData.bookings || [])

        // Calculate stats
        const today = new Date().toISOString().split("T")[0]
        const pending = bookingsData.bookings?.filter((b: Booking) => b.status === "pending")?.length || 0
        const checkedIn = bookingsData.bookings?.filter((b: Booking) => b.status === "confirmed" && b.checkIn <= today)?.length || 0
        const checkedOut = bookingsData.bookings?.filter((b: Booking) => b.status === "completed")?.length || 0

        setStats({
          totalBookings: bookingsData.bookings?.length || 0,
          pendingBookings: pending,
          checkedIn,
          checkedOut,
        })
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-sunset-100 dark:bg-sunset-900/30 text-sunset-700 dark:text-sunset-400 border-sunset-200 dark:border-sunset-700"
      case "confirmed":
        return "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-700"
      case "completed":
        return "bg-ocean-100 dark:bg-ocean-700 text-ocean-700 dark:text-ocean-300 border-ocean-200 dark:border-ocean-600"
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700"
      default:
        return "bg-ocean-100 dark:bg-ocean-700 text-ocean-700 dark:text-ocean-300 border-ocean-200 dark:border-ocean-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <PendingIcon className="w-4 h-4" />
      case "confirmed":
        return <CheckInIcon className="w-4 h-4" />
      case "completed":
        return <CompletedIcon className="w-4 h-4" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-ocean-200 dark:bg-ocean-700 rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-ocean-800 rounded-2xl p-6 shadow-sm">
              <div className="h-4 bg-ocean-200 dark:bg-ocean-700 rounded w-24 mb-4"></div>
              <div className="h-8 bg-ocean-200 dark:bg-ocean-700 rounded w-16"></div>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-ocean-800 rounded-2xl p-6 shadow-sm">
          <div className="h-6 bg-ocean-200 dark:bg-ocean-700 rounded w-40 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-ocean-100 dark:bg-ocean-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: BookingIcon,
      color: "from-ocean-500 to-ocean-600",
      bgColor: "bg-ocean-50 dark:bg-ocean-900/30",
      textColor: "text-ocean-600 dark:text-ocean-400",
    },
    {
      label: "Pending",
      value: stats.pendingBookings,
      icon: PendingIcon,
      color: "from-sunset-400 to-sunset-500",
      bgColor: "bg-sunset-50",
      textColor: "text-sunset-600",
    },
    {
      label: "Checked In",
      value: stats.checkedIn,
      icon: CheckInIcon,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-900/30",
      textColor: "text-teal-600",
    },
    {
      label: "Completed",
      value: stats.checkedOut,
      icon: CompletedIcon,
      color: "from-ocean-500 to-cyan-500",
      bgColor: "bg-ocean-50 dark:bg-ocean-700/50",
      textColor: "text-ocean-600 dark:text-ocean-400",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ocean-900 dark:text-white">Staff Dashboard</h1>
          <p className="text-ocean-600 dark:text-ocean-400 mt-1">Welcome back! Here's your overview for today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-ocean-500 dark:text-ocean-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="group bg-white dark:bg-ocean-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-ocean-100 dark:border-ocean-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
              <div className={`text-sm ${stat.textColor} font-medium mb-1`}>{stat.label}</div>
              <div className="text-4xl font-bold text-ocean-900 dark:text-white">{stat.value}</div>
            </div>
          )
        })}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white dark:bg-ocean-800 rounded-2xl shadow-sm border border-ocean-100 dark:border-ocean-700 overflow-hidden">
        <div className="p-6 border-b border-ocean-100 dark:border-ocean-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sunset-400 to-sunset-500 rounded-xl flex items-center justify-center">
              <BookingIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ocean-900 dark:text-white">Recent Bookings</h2>
              <p className="text-sm text-ocean-500 dark:text-ocean-400">Latest guest reservations</p>
            </div>
          </div>
          <a href="/staff/bookings" className="group flex items-center gap-2 text-sunset-500 hover:text-sunset-600 font-medium text-sm transition-colors">
            View All
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-ocean-50 dark:bg-ocean-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-ocean-500 dark:text-ocean-400 uppercase tracking-wider">Guest</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-ocean-500 dark:text-ocean-400 uppercase tracking-wider">Room</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-ocean-500 dark:text-ocean-400 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-ocean-500 dark:text-ocean-400 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-ocean-500 dark:text-ocean-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ocean-100 dark:divide-ocean-700">
              {bookings.slice(0, 5).map((booking, index) => (
                <tr
                  key={booking._id}
                  className="hover:bg-ocean-50 dark:hover:bg-ocean-700/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-ocean-200 to-ocean-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-ocean-700 dark:text-ocean-300">
                          {(booking.guestName || "G").charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-ocean-900 dark:text-white">{booking.guestName}</div>
                        <div className="text-xs text-ocean-500 dark:text-ocean-400">{booking.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-ocean-700 dark:text-ocean-300 font-medium">{booking.roomType}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-ocean-600 dark:text-ocean-400">{formatDate(booking.checkIn)}</td>
                  <td className="px-6 py-4 text-sm text-ocean-600 dark:text-ocean-400">{formatDate(booking.checkOut)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {bookings.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-ocean-100 dark:bg-ocean-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookingIcon className="w-8 h-8 text-ocean-400 dark:text-ocean-500" />
            </div>
            <div className="text-ocean-500 dark:text-ocean-400">No bookings found</div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Manage Bookings", description: "View and update all guest bookings", href: "/staff/bookings", icon: BookingIcon, color: "from-ocean-500 to-ocean-600" },
          { title: "Room Availability", description: "Check room status and availability", href: "/staff/rooms", icon: BookingIcon, color: "from-sunset-400 to-sunset-500" },
          { title: "Guest Information", description: "Access guest profiles and history", href: "/staff/guests", icon: BookingIcon, color: "from-teal-500 to-teal-600" },
        ].map((action, index) => {
          const Icon = action.icon
          return (
            <a
              key={action.href}
              href={action.href}
              className="group bg-white dark:bg-ocean-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-ocean-100 dark:border-ocean-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <ArrowRightIcon className="w-5 h-5 text-ocean-300 dark:text-ocean-600 group-hover:text-sunset-500 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-semibold text-ocean-900 dark:text-white mb-2 group-hover:text-sunset-500 transition-colors">{action.title}</h3>
              <p className="text-sm text-ocean-500 dark:text-ocean-400">{action.description}</p>
            </a>
          )
        })}
      </div>
    </div>
  )
}







