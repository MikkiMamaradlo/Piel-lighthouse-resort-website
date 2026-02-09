"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Calendar, User, Mail, Phone, LogOut, ChevronLeft, ChevronRight, Send, CheckCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface GuestBooking {
  _id: string
  checkIn: string
  checkOut: string
  roomType: string
  status: string
  totalPrice: number
  guests: number
}

interface Booking {
  _id: string
  guestName: string
  checkIn: string
  checkOut: string
  status: string
  roomName?: string
}

export default function GuestDashboard() {
  const router = useRouter()
  const [guest, setGuest] = useState<any>(null)
  const [bookings, setBookings] = useState<GuestBooking[]>([])
  const [adminBookings, setAdminBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: "",
    roomType: "",
    message: "",
  })
  const [formLoading, setFormLoading] = useState(false)

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/guest/auth/check", {
        credentials: "include",
      })
      const data = await response.json()

      if (!response.ok || !data.authenticated) {
        router.push("/guest/login")
        return
      }

      setGuest(data.guest)
      setFormData(prev => ({
        ...prev,
        name: data.guest.username || "",
        email: data.guest.email || "",
        phone: data.guest.phone || "",
      }))
      fetchBookings(data.guest._id)
    } catch {
      router.push("/guest/login")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
    // Check for selected room from sessionStorage
    const selectedRoomData = sessionStorage.getItem("selectedRoom")
    if (selectedRoomData) {
      try {
        const selectedRoom = JSON.parse(selectedRoomData)
        setFormData(prev => ({
          ...prev,
          roomType: selectedRoom._id,
        }))
        // Clear the sessionStorage after using
        sessionStorage.removeItem("selectedRoom")
        // Show toast notification
        toast({
          title: "Room Selected",
          description: `You have selected ${selectedRoom.name}. Please complete your booking.`,
        })
      } catch (e) {
        console.error("Failed to parse selected room", e)
      }
    }
  }, [])

  // Scroll to quick-booking anchor when hash is present
  useEffect(() => {
    const scrollToBooking = () => {
      if (window.location.hash === "#quick-booking") {
        const element = document.getElementById("quick-booking")
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }
    }
    
    // Try immediately
    scrollToBooking()
    
    // Also try after a short delay to ensure DOM is ready
    const timeout = setTimeout(scrollToBooking, 100)
    
    return () => clearTimeout(timeout)
  }, [])

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

  // Fetch all bookings for calendar availability
  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const res = await fetch("/api/admin/bookings")
        const data = await res.json()
        setAdminBookings(data.bookings || [])
      } catch (error) {
        console.error("Failed to fetch all bookings:", error)
      }
    }
    fetchAllBookings()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/guest/auth", { method: "DELETE" })
      router.push("/guest/login")
    } catch {
      console.error("Logout failed")
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const roomOptions = [
    { id: "room1", value: "beachfront", label: "Beachfront Room (up to 4 pax)" },
    { id: "room2", value: "barkada", label: "Barkada Room (up to 10 pax)" },
    { id: "room3", value: "family", label: "Family Room (up to 15 pax)" },
  ]

  const getRoomDisplayName = (value: string) => {
    const room = roomOptions.find(r => r.value === value)
    return room ? room.label : "Not specified"
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn)
      const checkOutDate = new Date(formData.checkOut)
      if (checkOutDate <= checkInDate) {
        toast({
          title: "Validation Error",
          description: "Check-out date must be after check-in date",
          variant: "destructive",
        })
        setFormLoading(false)
        return
      }
    }

    const roomOption = roomOptions.find(r => r.value === formData.roomType)
    
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          roomId: roomOption?.id || "",
          roomType: getRoomDisplayName(formData.roomType),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit booking")
      }

      toast({
        title: "✓ Booking Submitted!",
        description: "We'll contact you within 24 hours. Check your email for confirmation.",
        duration: 5000,
      })

      setFormData({
        name: guest?.username || "",
        email: guest?.email || "",
        phone: guest?.phone || "",
        checkIn: "",
        checkOut: "",
        guests: "",
        roomType: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

  // Calendar functions
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
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return adminBookings.filter((booking) => {
      const checkIn = new Date(booking.checkIn).toISOString().split("T")[0]
      const checkOut = new Date(booking.checkOut).toISOString().split("T")[0]
      return dateStr >= checkIn && dateStr <= checkOut
    })
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const { daysInMonth: daysInCurrentMonth, startingDay } = getDaysInMonth(currentMonth)
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    )
  }

  const isPastDate = (day: number) => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const date = new Date(dateStr)
    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)
    return date < todayDate
  }

  const getDateStatus = (day: number) => {
    const bookingsForDay = getBookingsForDate(day)
    if (bookingsForDay.length === 0) return "available"
    
    // Check if all bookings are confirmed
    const allConfirmed = bookingsForDay.every(b => b.status === "confirmed")
    const allPending = bookingsForDay.every(b => b.status === "pending")
    
    if (allConfirmed) return "booked"
    if (allPending) return "reserved"
    return "mixed"
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

  const isDateBooked = (day: number) => {
    const bookingsForDay = getBookingsForDate(day)
    return bookingsForDay.length > 0
  }

  const handleDateClick = (day: number) => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setSelectedDate(dateStr)
    setFormData(prev => ({ ...prev, checkIn: dateStr }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-900 via-ocean-800 to-ocean-900">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-amber-400/30 rounded-2xl blur-xl animate-pulse"></div>
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 rounded-2xl shadow-2xl shadow-amber-500/40 overflow-hidden">
              <Image 
                src="/images/PielLogo.jpg" 
                alt="Piel Lighthouse Logo" 
                width={80} 
                height={80}
                className="object-cover"
              />
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
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 overflow-hidden">
              <Image 
                src="/images/PielLogo.jpg" 
                alt="Piel Lighthouse Logo" 
                width={40} 
                height={40}
                className="object-cover"
              />
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
            <li>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30"
              >
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Book Your Stay</span>
              </button>
            </li>
            <li>
              <Link
                href="/guest/rooms"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-600 hover:bg-slate-100"
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Available Rooms</span>
              </Link>
            </li>
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
              <Calendar className="w-6 h-6" />
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
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Welcome Banner */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 text-slate-800 shadow-lg border border-white/50 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
                  <path fill="currentColor" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,186.7C960,213,1056,235,1152,213.3C1248,192,1344,128,1392,96L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
              </div>
              <div className="relative">
                <h2 className="text-2xl font-bold mb-2">Welcome back, {guest?.username}! 🌴</h2>
                <p className="text-slate-600">Select an available date and book your perfect beach getaway.</p>
              </div>
            </div>

            {/* Calendar Section */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800">Availability Calendar</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevMonth}
                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                  </button>
                  <span className="font-semibold text-slate-800 min-w-[120px] text-center text-sm">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </span>
                  <button
                    onClick={nextMonth}
                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-slate-500 py-1">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for days before the start of month */}
                  {Array.from({ length: startingDay }).map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square" />
                  ))}
                  
                  {/* Days of the month */}
                  {Array.from({ length: daysInCurrentMonth }).map((_, index) => {
                    const day = index + 1
                    const dayStatus = getDateStatus(day)
                    const dayBookings = getBookingsForDate(day)
                    const dateStatus = dayStatus
                    const booked = dateStatus === "booked" || dateStatus === "reserved" || dateStatus === "mixed"
                    const selected = selectedDate === `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                    const isPast = isPastDate(day)

                    return (
                      <button
                        key={day}
                        onClick={() => handleDateClick(day)}
                        disabled={booked || isPast}
                        className={`
                          aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all relative
                          ${isToday(day) ? "ring-2 ring-amber-500" : ""}
                          ${isPast ? "bg-slate-50 text-slate-300 cursor-not-allowed" : selected
                            ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                            : dateStatus === "booked"
                              ? "bg-red-100 text-red-400 cursor-not-allowed"
                              : dateStatus === "reserved"
                                ? "bg-amber-100 text-amber-600 cursor-not-allowed"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }
                        `}
                      >
                        {day}
                        {/* Status indicator dots */}
                        <div className={`absolute bottom-1 flex gap-0.5 ${isToday(day) ? "opacity-80" : ""}`}>
                          {dayBookings.length > 0 ? (
                            <>
                              <div className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(dayStatus)}`} />
                              {dayBookings.length > 1 && (
                                <div className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(dayStatus)}`} />
                              )}
                              {dayBookings.length > 2 && (
                                <div className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(dayStatus)}`} />
                              )}
                            </>
                          ) : (
                            <div className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor("available")}`} />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="px-4 pb-4 border-t border-slate-100">
                <div className="flex items-center justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-slate-600">Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                    <span className="text-slate-600">Reserved</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <span className="text-slate-600">Booked</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Booking Form */}
            <div id="quick-booking" className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Quick Booking</h3>
                <p className="text-sm text-slate-500">Fill in your details to request a booking</p>
              </div>
              
              <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        placeholder="+63 9xx xxx xxxx"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Number of Guests</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="number"
                        name="guests"
                        value={formData.guests}
                        onChange={handleFormChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        placeholder="1"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Check-in Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="date"
                        name="checkIn"
                        value={formData.checkIn}
                        onChange={handleFormChange}
                        min={todayStr}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Check-out Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="date"
                        name="checkOut"
                        value={formData.checkOut}
                        onChange={handleFormChange}
                        min={formData.checkIn || todayStr}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Room Type</label>
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    required
                  >
                    <option value="">Select a room type</option>
                    {roomOptions.map((room) => (
                      <option key={room.id} value={room.value}>
                        {room.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Special Requests</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
                    placeholder="Any special requests or questions?"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Booking Request
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-slate-500 text-center">
                  We'll contact you within 24 hours to confirm your booking
                </p>
              </form>
            </div>

            {/* Your Bookings */}
            {bookings.length > 0 && (
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800">Your Bookings</h3>
                </div>
                
                <div className="p-6 space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="bg-slate-50 rounded-xl p-4 border border-slate-200"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-slate-800">{booking.roomType}</p>
                          <p className="text-sm text-slate-600">
                            {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-slate-500">{booking.guests} guests</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : booking.status === "pending"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-700"
                          }`}>
                            {booking.status === "confirmed" && <CheckCircle className="w-3 h-3" />}
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                          <p className="text-lg font-bold text-slate-800 mt-1">₱{booking.totalPrice.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  )
}
