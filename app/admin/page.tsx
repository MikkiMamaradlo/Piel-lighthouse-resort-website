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
  XCircle,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
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
  Cell,
  BarChart,
  Bar
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's what's happening at your resort.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            All systems operational
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="group bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 
                stat.change.startsWith('-') ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {stat.change.startsWith('+') ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : stat.change.startsWith('-') ? (
                  <ArrowDownRight className="w-3 h-3" />
                ) : null}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
              {loading ? (
                <div className="h-8 w-16 bg-slate-100 animate-pulse rounded mt-1" />
              ) : (
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Trends Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Booking Trends</h3>
              <p className="text-sm text-slate-500">Weekly booking overview</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +12%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={bookingStats}>
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorBookings)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Booking Status</h3>
              <p className="text-sm text-slate-500">Current distribution</p>
            </div>
          </div>
          <div className="flex items-center">
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-slate-600">{item.name}</span>
                  <span className="text-sm font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
            <p className="text-sm text-slate-500">Latest actions on your resort</p>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </button>
        </div>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                {activity.type === "booking" && <CalendarCheck className="w-6 h-6 text-blue-600" />}
                {activity.type === "confirm" && <CheckCircle className="w-6 h-6 text-green-600" />}
                {activity.type === "testimonial" && <MessageSquareQuote className="w-6 h-6 text-amber-500" />}
                {activity.type === "gallery" && <Image className="w-6 h-6 text-pink-500" />}
                {activity.type === "room" && <BedDouble className="w-6 h-6 text-purple-500" />}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{activity.action}</p>
                <p className="text-sm text-slate-500">{activity.guest}</p>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <a
          href="/admin/bookings"
          className="group flex items-center gap-4 p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25"
        >
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="font-semibold">Manage Bookings</span>
            <p className="text-sm text-blue-100">View & confirm</p>
          </div>
        </a>
        <a
          href="/admin/accommodations"
          className="group flex items-center gap-4 p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl text-white hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/25"
        >
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <BedDouble className="w-6 h-6" />
          </div>
          <div>
            <span className="font-semibold">Edit Rooms</span>
            <p className="text-sm text-purple-100">Update listings</p>
          </div>
        </a>
        <a
          href="/admin/gallery"
          className="group flex items-center gap-4 p-4 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl text-white hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg shadow-pink-500/25"
        >
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <Image className="w-6 h-6" />
          </div>
          <div>
            <span className="font-semibold">Update Gallery</span>
            <p className="text-sm text-pink-100">Add photos</p>
          </div>
        </a>
        <a
          href="/admin/settings"
          className="group flex items-center gap-4 p-4 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl text-white hover:from-slate-700 hover:to-slate-800 transition-all shadow-lg shadow-slate-500/25"
        >
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="font-semibold">Site Settings</span>
            <p className="text-sm text-slate-200">Configure</p>
          </div>
        </a>
      </div>
    </div>
  )
}
