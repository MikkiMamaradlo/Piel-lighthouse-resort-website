"use client"

import { useEffect, useState } from "react"
import {
  CalendarCheck,
  BedDouble,
  Image,
  MessageSquareQuote,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"

const bookingStats = [
  { name: "Mon", bookings: 4 },
  { name: "Tue", bookings: 3 },
  { name: "Wed", bookings: 6 },
  { name: "Thu", bookings: 8 },
  { name: "Fri", bookings: 12 },
  { name: "Sat", bookings: 15 },
  { name: "Sun", bookings: 10 },
]

const statusData = [
  { name: "Pending", value: 8, color: "#f59e0b" },
  { name: "Confirmed", value: 15, color: "#10b981" },
  { name: "Cancelled", value: 2, color: "#ef4444" },
]

const recentActivity = [
  { id: 1, action: "New booking received", guest: "Maria Santos", time: "5 minutes ago", type: "booking" },
  { id: 2, action: "Booking confirmed", guest: "John Chen", time: "1 hour ago", type: "confirm" },
  { id: 3, action: "New testimonial added", guest: "Emily Thompson", time: "2 hours ago", type: "testimonial" },
  { id: 4, action: "Gallery image updated", guest: "Admin", time: "3 hours ago", type: "gallery" },
  { id: 5, action: "Room price updated", guest: "Admin", time: "5 hours ago", type: "room" },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalRooms: 0,
    totalGallery: 0,
    totalTestimonials: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bookingsRes, roomsRes, galleryRes, testimonialsRes] = await Promise.all([
          fetch("/api/admin/bookings"),
          fetch("/api/admin/rooms"),
          fetch("/api/admin/gallery"),
          fetch("/api/admin/testimonials"),
        ])

        const [bookingsData, roomsData, galleryData, testimonialsData] = await Promise.all([
          bookingsRes.json(),
          roomsRes.json(),
          galleryRes.json(),
          testimonialsRes.json(),
        ])

        const bookings = bookingsData.bookings || []
        const pending = bookings.filter((b: any) => b.status === "pending").length
        const confirmed = bookings.filter((b: any) => b.status === "confirmed").length

        setStats({
          totalBookings: bookings.length,
          pendingBookings: pending,
          confirmedBookings: confirmed,
          totalRooms: (roomsData.rooms || []).length,
          totalGallery: (galleryData.gallery || []).length,
          totalTestimonials: (testimonialsData.testimonials || []).length,
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: CalendarCheck,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "Pending",
      value: stats.pendingBookings,
      icon: Clock,
      color: "bg-amber-500",
      change: "Needs attention",
    },
    {
      title: "Confirmed",
      value: stats.confirmedBookings,
      icon: CheckCircle,
      color: "bg-green-500",
      change: "This month",
    },
    {
      title: "Rooms",
      value: stats.totalRooms,
      icon: BedDouble,
      color: "bg-purple-500",
      change: "Active listings",
    },
    {
      title: "Gallery Images",
      value: stats.totalGallery,
      icon: Image,
      color: "bg-pink-500",
      change: "Photos",
    },
    {
      title: "Testimonials",
      value: stats.totalTestimonials,
      icon: MessageSquareQuote,
      color: "bg-cyan-500",
      change: "Reviews",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening at your resort.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">{stat.title}</p>
              {loading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1" />
              ) : (
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Trends Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={bookingStats}>
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBookings)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                {activity.type === "booking" && <CalendarCheck className="w-5 h-5 text-blue-500" />}
                {activity.type === "confirm" && <CheckCircle className="w-5 h-5 text-green-500" />}
                {activity.type === "testimonial" && <MessageSquareQuote className="w-5 h-5 text-amber-500" />}
                {activity.type === "gallery" && <Image className="w-5 h-5 text-pink-500" />}
                {activity.type === "room" && <BedDouble className="w-5 h-5 text-purple-500" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.guest}</p>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <a
          href="/admin/bookings"
          className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
        >
          <CalendarCheck className="w-6 h-6 text-blue-600" />
          <span className="font-medium text-blue-900">Manage Bookings</span>
        </a>
        <a
          href="/admin/accommodations"
          className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
        >
          <BedDouble className="w-6 h-6 text-purple-600" />
          <span className="font-medium text-purple-900">Edit Rooms</span>
        </a>
        <a
          href="/admin/gallery"
          className="flex items-center gap-3 p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors"
        >
          <Image className="w-6 h-6 text-pink-600" />
          <span className="font-medium text-pink-900">Update Gallery</span>
        </a>
        <a
          href="/admin/settings"
          className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <TrendingUp className="w-6 h-6 text-gray-600" />
          <span className="font-medium text-gray-900">Site Settings</span>
        </a>
      </div>
    </div>
  )
}
