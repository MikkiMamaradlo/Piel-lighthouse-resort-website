"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Palmtree, Calendar, User, Mail, Phone, LogOut, ChevronLeft, ChevronRight, Send, CheckCircle, Users } from "lucide-react"
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
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    )
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
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Availability Calendar</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevMonth}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <span className="font-semibold text-slate-800 min-w-[140px] text-center">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </span>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-sm font-semibold text-slate-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Empty cells for days before the start of month */}
                  {Array.from({ length: startingDay }).map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square" />
                  ))}
                  
                  {/* Days of the month */}
                  {Array.from({ length: daysInCurrentMonth }).map((_, index) => {
                    const day = index + 1
                    const booked = isDateBooked(day)
                    const selected = selectedDate === `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                    
                    return (
                      <button
                        key={day}
                        onClick={() => handleDateClick(day)}
                        disabled={booked}
                        className={`
                          aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all
                          ${isToday(day) ? "ring-2 ring-amber-500" : ""}
                          ${selected 
                            ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30" 
                            : booked 
                              ? "bg-red-100 text-red-400 cursor-not-allowed"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }
                        `}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
                
                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-500 rounded-lg"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-slate-200 rounded-lg"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-200 rounded-lg"></div>
                    <span>Booked</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Booking Form */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Quick Booking Form</h3>
                <p className="text-sm text-slate-600">Fill in your details to reserve your stay</p>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="checkIn" className="block text-sm font-semibold text-slate-700 mb-2">
                        Check-in <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="checkIn"
                        type="date"
                        name="checkIn"
                        value={formData.checkIn}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="checkOut" className="block text-sm font-semibold text-slate-700 mb-2">
                        Check-out <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="checkOut"
                        type="date"
                        name="checkOut"
                        value={formData.checkOut}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="guests" className="block text-sm font-semibold text-slate-700 mb-2">
                        Guests <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="guests"
                        name="guests"
                        value={formData.guests}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                      >
                        <option value="">Select</option>
                        <option value="1">1 Guest</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4 Guests</option>
                        <option value="5-10">5-10 Guests</option>
                        <option value="10+">10+ Guests</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                        placeholder="+63 912 345 6789"
                      />
                    </div>
                    <div>
                      <label htmlFor="roomType" className="block text-sm font-semibold text-slate-700 mb-2">
                        Available Room
                      </label>
                      <select
                        id="roomType"
                        name="roomType"
                        value={formData.roomType}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                      >
                        <option value="">Select an available room</option>
                        {roomOptions.map((room) => (
                          <option key={room.id} value={room.value}>{room.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all resize-none"
                      placeholder="Any special requests or questions?"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Required fields are marked with <span className="text-red-500">*</span>
                    </p>
                    
                    <Button
                      type="submit"
                      disabled={formLoading}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-lg py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      {formLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin">⏳</span> Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send size={20} />
                          Submit Booking
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

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
