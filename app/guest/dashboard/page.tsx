"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Palmtree, Waves, Sun, Calendar, User, Mail, Phone, LogOut, MapPin, Clock, Star, ChevronRight, Menu, X } from "lucide-react"

interface GuestBooking {
  _id: string
  checkIn: string
  checkOut: string
  roomType: string
  status: string
  totalPrice: number
  guests: number
}

export default function GuestDashboard() {
  const router = useRouter()
  const [guest, setGuest] = useState<any>(null)
  const [bookings, setBookings] = useState<GuestBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/guest/auth/check")
      const data = await response.json()

      if (!response.ok || !data.authenticated) {
        router.push("/guest/login")
        return
      }

      setGuest(data.guest)
      fetchBookings(data.guest._id)
    } catch {
      router.push("/guest/login")
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async (guestId: string) => {
    try {
      const response = await fetch(`/api/guest/bookings?guestId=${guestId}`)
      const data = await response.json()
      
      if (response.ok) {
        setBookings(data.bookings || [])
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/guest/auth", { method: "DELETE" })
      router.push("/guest/login")
    } catch {
      console.error("Logout failed")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-900 via-ocean-800 to-ocean-900">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-amber-400/30 rounded-2xl blur-xl animate-pulse"></div>
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 rounded-2xl shadow-2xl shadow-amber-500/40">
              <Palmtree className="w-10 h-10 text-white animate-bounce" />
            </div>
          </div>
          <p className="text-white text-lg">Loading your paradise...</p>
          <div className="mt-4 flex justify-center">
            <div className="w-10 h-10 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 text-slate-800 shadow-lg border border-white/50 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
                  <path fill="currentColor" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,186.7C960,213,1056,235,1152,213.3C1248,192,1344,128,1392,96L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
              </div>
              <div className="relative">
                <h2 className="text-2xl font-bold mb-2">Welcome back, {guest?.username}! 🌴</h2>
                <p className="text-slate-600">Your beach paradise awaits. Manage your bookings and plan your next escape.</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm">Total Bookings</p>
                    <p className="text-3xl font-bold text-slate-800">{bookings.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-slate-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm">Confirmed</p>
                    <p className="text-3xl font-bold text-slate-800">
                      {bookings.filter(b => b.status === "confirmed").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-slate-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm">Pending</p>
                    <p className="text-3xl font-bold text-slate-800">
                      {bookings.filter(b => b.status === "pending").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-slate-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Your Bookings</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {bookings.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 mb-4">No bookings yet</p>
                    <Link
                      href="/#accommodations"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
                    >
                      Book Your Stay
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  bookings.slice(0, 3).map((booking) => (
                    <div key={booking._id} className="p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                            <Palmtree className="w-6 h-6 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{booking.roomType}</p>
                            <p className="text-sm text-slate-500">
                              {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === "confirmed" 
                              ? "bg-green-100 text-green-700" 
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {booking.status}
                          </span>
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {bookings.length > 3 && (
                <div className="p-4 border-t border-slate-100">
                  <Link href="#bookings" className="text-slate-600 font-semibold text-sm flex items-center justify-center gap-1 hover:gap-2 transition-all">
                    View all bookings <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/#accommodations"
                className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 text-slate-800 shadow-lg border border-white/50 hover:shadow-xl hover:bg-white/95 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-slate-600" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-bold mb-1">New Booking</h3>
                <p className="text-slate-600 text-sm">Reserve your perfect room</p>
              </Link>

              <Link
                href="/#contact"
                className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 text-slate-800 shadow-lg border border-white/50 hover:shadow-xl hover:bg-white/95 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-slate-600" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-bold mb-1">Contact Us</h3>
                <p className="text-slate-600 text-sm">Get in touch with our team</p>
              </Link>
            </div>
          </div>
        )
      
      case "bookings":
        return (
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">All Bookings</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {bookings.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-slate-500">No bookings found</p>
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking._id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-slate-800 text-lg">{booking.roomType}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(booking.checkIn).toLocaleDateString()}
                            </span>
                            <span>to</span>
                            <span>{new Date(booking.checkOut).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-slate-500 mt-1">
                            {booking.guests} guest(s) • ₱{booking.totalPrice.toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === "confirmed" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )

      case "profile":
        return (
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Profile Information</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Username</p>
                    <p className="font-semibold text-slate-800">{guest?.username}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-semibold text-slate-800">{guest?.email}</p>
                  </div>
                </div>
                
                {guest?.phone && (
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="font-semibold text-slate-800">{guest.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-ocean-50 to-ocean-100 bg-[url('/images/piel10.jpg')] bg-cover bg-fixed bg-center">
      {/* Gradient Overlay for readability */}
      <div className="fixed inset-0 bg-ocean-50/80 backdrop-blur-sm"></div>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 lg:transform-none
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Palmtree className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-800">Piel Lighthouse</p>
              <p className="text-xs text-slate-500">Guest Portal</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {[
              { id: "dashboard", icon: Sun, label: "Dashboard" },
              { id: "bookings", icon: Calendar, label: "My Bookings" },
              { id: "profile", icon: User, label: "Profile" },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">{guest?.username}</p>
                  <p className="text-xs text-slate-500">Guest</p>
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-5xl mx-auto">
            {renderContent()}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-xl border-t border-slate-200/50 py-4 px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">© 2024 Piel Lighthouse Resort</p>
            <div className="flex items-center gap-4">
              <Link href="/#accommodations" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">
                Accommodations
              </Link>
              <Link href="/#activities" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">
                Activities
              </Link>
              <Link href="/#contact" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
