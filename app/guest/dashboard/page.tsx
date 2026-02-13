"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Calendar, User, Mail, Phone, LogOut, ChevronLeft, ChevronRight, Send, CheckCircle, Users, Waves, Sun, Umbrella } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { GuestProfileDropdown } from "@/components/guest-profile-dropdown"

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
    { id: "room1", value: "beachfront", label: "Beachfront Room (up to 4 pax)", icon: Waves },
    { id: "room2", value: "barkada", label: "Barkada Room (up to 10 pax)", icon: Users },
    { id: "room3", value: "family", label: "Family Room (up to 15 pax)", icon: Sun },
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
        return "bg-emerald-400"
      case "reserved":
        return "bg-amber-400"
      case "booked":
        return "bg-rose-400"
      case "mixed":
        return "bg-gradient-to-r from-amber-400 to-rose-400"
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-900 via-ocean-800 to-teal-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-ocean-500/5 rounded-full blur-3xl animate-tide"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-amber-400/30 rounded-3xl blur-2xl animate-pulse"></div>
            <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-400 via-orange-500 to-sunset-500 rounded-3xl shadow-2xl shadow-amber-500/40 overflow-hidden ring-4 ring-white/10">
              <Image 
                src="/images/PielLogo.jpg" 
                alt="Piel Lighthouse Logo" 
                width={96} 
                height={96}
                className="object-cover"
              />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-white/90 text-xl font-medium tracking-wide">Loading your paradise...</p>
            <div className="flex items-center justify-center gap-2">
              <Umbrella className="w-5 h-5 text-amber-400 animate-bounce-slow" />
              <span className="text-white/60 text-sm">Preparing your experience</span>
              <Waves className="w-5 h-5 text-teal-400 animate-bounce-slow" style={{ animationDelay: "0.5s" }} />
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-white/10 border-t-amber-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-teal-400/50 rounded-full animate-spin" style={{ animationDuration: "1.5s", animationDirection: "reverse" }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-sand-50 via-ocean-50 to-teal-50 dark:from-ocean-950 dark:via-ocean-900 dark:to-teal-950 bg-[url('/images/piel10.jpg')] bg-cover bg-fixed bg-center relative">
      {/* Animated gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-white/90 via-white/70 to-white/90 dark:from-ocean-950/90 dark:via-ocean-900/80 dark:to-ocean-950/90 backdrop-blur-2xl z-0"></div>
      
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-40 left-10 w-40 h-40 bg-amber-300/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-40 right-10 w-60 h-60 bg-teal-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-sunset-300/10 rounded-full blur-3xl animate-pulse-glow"></div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-ocean-950/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white/95 dark:bg-ocean-900/95 backdrop-blur-2xl shadow-2xl lg:shadow-xl transform transition-all duration-500 lg:transform-none border-r border-sand-200/50 dark:border-ocean-700/50 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Animated top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sunset-400 via-amber-400 to-teal-400"></div>
        
        {/* Logo */}
        <div className="p-8 pb-6 relative">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-sunset-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative w-14 h-14 bg-gradient-to-br from-amber-400 via-orange-500 to-sunset-500 rounded-2xl flex items-center justify-center shadow-xl ring-2 ring-white/20 overflow-hidden">
                <Image 
                  src="/images/PielLogo.jpg" 
                  alt="Piel Lighthouse Logo" 
                  width={52} 
                  height={52}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-xl text-card-foreground tracking-tight">Piel Lighthouse</p>
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Umbrella className="w-3 h-3" />
                Guest Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="px-4 pb-6 space-y-2">
          <Link
            href="/guest/dashboard"
            className="group relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-400 bg-gradient-to-r from-sunset-500 to-amber-500 text-white shadow-lg shadow-sunset-500/30 hover:shadow-xl hover:shadow-sunset-500/40 hover:scale-[1.02]"
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-white rounded-r-full shadow-lg"></div>
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="font-semibold text-base">Book Your Stay</span>
            <div className="ml-auto w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-glow"></div>
          </Link>
          
          <Link
            href="/guest/rooms"
            className="group relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 text-muted-foreground hover:bg-gradient-to-r hover:from-sand-100 hover:to-ocean-50 dark:hover:from-ocean-800 dark:hover:to-ocean-700 hover:shadow-lg hover:shadow-sand-200/50 dark:hover:shadow-ocean-900/50"
          >
            <div className="p-2.5 rounded-xl bg-sand-100 dark:bg-ocean-800 group-hover:bg-white dark:group-hover:bg-ocean-700 transition-all duration-300 shadow-sm group-hover:shadow-md">
              <Users className="w-5 h-5 text-muted-foreground group-hover:text-sunset-500 transition-colors" />
            </div>
            <span className="font-medium text-base">Available Rooms</span>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-8px] group-hover:translate-x-0">
              <ChevronRight className="w-4 h-4 text-sunset-500" />
            </div>
          </Link>
        </nav>

        {/* Decorative wave */}
        <div className="px-4 pb-4">
          <div className="relative h-8 bg-gradient-to-r from-ocean-100 to-teal-100 dark:from-ocean-800 dark:to-ocean-700 rounded-xl overflow-hidden">
            <Waves className="absolute inset-0 w-full h-full text-ocean-300 dark:text-ocean-600 opacity-50" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10">
        {/* Header */}
        <header className="bg-white/80 dark:bg-ocean-900/80 backdrop-blur-2xl border-b border-sand-200/50 dark:border-ocean-700/50 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-3 -ml-2 text-muted-foreground hover:bg-sand-100 dark:hover:bg-ocean-800 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <Calendar className="w-6 h-6" />
            </button>

            {/* Welcome badge */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-sand-100 to-ocean-50 dark:from-ocean-800 dark:to-ocean-700 rounded-full">
              <Sun className="w-4 h-4 text-sunset-500 animate-pulse-glow" />
              <span className="text-sm font-medium text-muted-foreground">
                {new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening"}, {guest?.username}!
              </span>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <GuestProfileDropdown guest={guest} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Enhanced Welcome Banner */}
            <div className="relative bg-gradient-to-br from-sunset-500 via-amber-500 to-orange-500 rounded-3xl p-8 text-white shadow-2xl shadow-sunset-500/20 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 right-20 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
              
              {/* Wave decoration at bottom */}
              <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" className="w-full h-16 text-white/10" preserveAspectRatio="none">
                  <path fill="currentColor" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,101.3C1248,96,1344,64,1392,48L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
                </svg>
              </div>
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Umbrella className="w-6 h-6" />
                  </div>
                  <span className="text-white/80 text-sm font-medium tracking-wide uppercase">Your Beach Resort Experience</span>
                </div>
                <h2 className="text-3xl font-bold mb-3 tracking-tight">Welcome back, {guest?.username}! 🌴</h2>
                <p className="text-white/90 text-lg max-w-2xl leading-relaxed">Discover your perfect beach getaway. Select an available date and book your dream escape to paradise.</p>
                
                {/* Quick stats */}
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                    <Waves className="w-4 h-4" />
                    <span className="text-sm font-medium">{bookings.length} Bookings</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                    <Sun className="w-4 h-4" />
                    <span className="text-sm font-medium">{daysInCurrentMonth} Days Available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Calendar Section */}
            <div className="bg-white/90 dark:bg-ocean-900/90 backdrop-blur-2xl rounded-3xl shadow-xl shadow-sand-200/30 dark:shadow-ocean-950/30 border border-white/50 dark:border-ocean-700/50 overflow-hidden">
              {/* Section header */}
              <div className="px-6 py-5 border-b border-sand-100 dark:border-ocean-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-sand-50/50 to-ocean-50/50 dark:from-ocean-800/50 dark:to-ocean-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-teal-500 to-ocean-500 rounded-xl shadow-lg shadow-teal-500/30">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-card-foreground">Availability Calendar</h3>
                    <p className="text-xs text-muted-foreground">Click on available dates to select check-in</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevMonth}
                    className="p-2.5 hover:bg-sand-100 dark:hover:bg-ocean-800 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <span className="font-bold text-card-foreground min-w-[160px] text-center text-base px-4 py-2 bg-sand-100 dark:bg-ocean-800 rounded-xl">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </span>
                  <button
                    onClick={nextMonth}
                    className="p-2.5 hover:bg-sand-100 dark:hover:bg-ocean-800 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-xs font-bold text-muted-foreground py-2 uppercase tracking-wider">
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
                    const dayStatus = getDateStatus(day)
                    const dayBookings = getBookingsForDate(day)
                    const dateStatus = dayStatus
                    const booked = dateStatus === "booked" || dateStatus === "reserved" || dateStatus === "mixed"
                    const selected = selectedDate === `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                    const isPast = isPastDate(day)
                    const todayd = isToday(day)

                    return (
                      <button
                        key={day}
                        onClick={() => handleDateClick(day)}
                        disabled={booked || isPast}
                        className={`
                          aspect-square flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden
                          ${todayd ? "ring-2 ring-sunset-500 ring-offset-2 dark:ring-offset-ocean-900" : ""}
                          ${isPast 
                            ? "bg-sand-100 dark:bg-ocean-800 text-slate-300 dark:text-ocean-500 cursor-not-allowed" 
                            : selected
                              ? "bg-gradient-to-br from-sunset-500 to-amber-500 text-white shadow-lg shadow-sunset-500/30 hover:shadow-xl hover:shadow-sunset-500/40 hover:scale-105"
                              : dateStatus === "booked"
                                ? "bg-gradient-to-br from-rose-100 to-red-100 dark:from-rose-900/30 dark:to-red-900/30 text-rose-400 dark:text-rose-400 cursor-not-allowed hover:scale-105"
                                : dateStatus === "reserved"
                                  ? "bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-600 dark:text-amber-400 cursor-not-allowed hover:scale-105"
                                  : "bg-gradient-to-br from-sand-50 to-ocean-50 dark:from-ocean-800 dark:to-ocean-700 text-card-foreground hover:from-sand-100 hover:to-ocean-100 dark:hover:from-ocean-700 dark:hover:to-ocean-600 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                          }
                        `}
                      >
                        {/* Subtle gradient overlay for available days */}
                        {dateStatus === "available" && !isPast && (
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        )}
                        <span className="relative z-10">{day}</span>
                        {/* Status indicator dots */}
                        <div className={`absolute bottom-1 flex gap-1 ${todayd ? "opacity-100" : "opacity-70"}`}>
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
                          ) : !isPast && !booked && (
                            <div className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor("available")}`} />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Enhanced Legend */}
              <div className="px-6 py-4 border-t border-sand-100 dark:border-ocean-700 bg-gradient-to-r from-sand-50/50 to-ocean-50/50 dark:from-ocean-800/50 dark:to-ocean-700/50">
                <div className="flex items-center justify-center gap-6 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50"></div>
                    <span className="text-sm font-medium text-muted-foreground">Available</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50"></div>
                    <span className="text-sm font-medium text-muted-foreground">Reserved</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-rose-400 shadow-lg shadow-rose-400/50"></div>
                    <span className="text-sm font-medium text-muted-foreground">Booked</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Quick Booking Form */}
            <div id="quick-booking" className="bg-white/90 dark:bg-ocean-900/90 backdrop-blur-2xl rounded-3xl shadow-xl shadow-sand-200/30 dark:shadow-ocean-950/30 border border-white/50 dark:border-ocean-700/50 overflow-hidden">
              {/* Section header */}
              <div className="px-6 py-5 border-b border-sand-100 dark:border-ocean-700 bg-gradient-to-r from-sunset-50/50 to-amber-50/50 dark:from-ocean-800/50 dark:to-ocean-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-sunset-500 to-amber-500 rounded-xl shadow-lg shadow-sunset-500/30">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-card-foreground">Quick Booking</h3>
                    <p className="text-sm text-muted-foreground">Fill in your details to request a reservation</p>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-2.5 group">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <User className="w-4 h-4 text-sunset-500" />
                      Full Name
                    </label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-xl bg-sand-100 dark:bg-ocean-800 flex items-center justify-center group-focus-within/input:bg-sunset-100 dark:group-focus-within/input:bg-sunset-900/30 group-focus-within/input:text-sunset-500 transition-all duration-300">
                          <User className="w-5 h-5 text-muted-foreground group-focus-within/input:text-sunset-500 transition-colors" />
                        </div>
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="w-full pl-14 pr-4 py-3.5 bg-sand-50 dark:bg-ocean-800 border-2 border-transparent dark:border-ocean-700 rounded-xl focus:outline-none focus:ring-0 focus:border-sunset-500 transition-all duration-300 text-card-foreground placeholder:text-muted-foreground"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Email field */}
                  <div className="space-y-2.5 group">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-teal-500" />
                      Email Address
                    </label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-xl bg-sand-100 dark:bg-ocean-800 flex items-center justify-center group-focus-within/input:bg-teal-100 dark:group-focus-within/input:bg-teal-900/30 group-focus-within/input:text-teal-500 transition-all duration-300">
                          <Mail className="w-5 h-5 text-slate-400 dark:text-slate-300 group-focus-within/input:text-teal-500 transition-colors" />
                        </div>
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        className="w-full pl-14 pr-4 py-3.5 bg-sand-50 dark:bg-ocean-800 border-2 border-transparent dark:border-ocean-700 rounded-xl focus:outline-none focus:ring-0 focus:border-teal-500 transition-all duration-300 text-slate-800 dark:text-white placeholder:text-slate-400"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Phone field */}
                  <div className="space-y-2.5 group">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-ocean-500" />
                      Phone Number
                    </label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-xl bg-sand-100 dark:bg-ocean-800 flex items-center justify-center group-focus-within/input:bg-ocean-100 dark:group-focus-within/input:bg-ocean-900/30 group-focus-within/input:text-ocean-500 transition-all duration-300">
                          <Phone className="w-5 h-5 text-slate-400 dark:text-slate-300 group-focus-within/input:text-ocean-500 transition-colors" />
                        </div>
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        className="w-full pl-14 pr-4 py-3.5 bg-sand-50 dark:bg-ocean-800 border-2 border-transparent dark:border-ocean-700 rounded-xl focus:outline-none focus:ring-0 focus:border-ocean-500 transition-all duration-300 text-slate-800 dark:text-white placeholder:text-slate-400"
                        placeholder="+63 9xx xxx xxxx"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Guests field */}
                  <div className="space-y-2.5 group">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-500" />
                      Number of Guests
                    </label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-xl bg-sand-100 dark:bg-ocean-800 flex items-center justify-center group-focus-within/input:bg-emerald-100 dark:group-focus-within/input:bg-emerald-900/30 group-focus-within/input:text-emerald-500 transition-all duration-300">
                          <Users className="w-5 h-5 text-slate-400 dark:text-slate-300 group-focus-within/input:text-emerald-500 transition-colors" />
                        </div>
                      </div>
                      <input
                        type="number"
                        name="guests"
                        value={formData.guests}
                        onChange={handleFormChange}
                        className="w-full pl-14 pr-4 py-3.5 bg-sand-50 dark:bg-ocean-800 border-2 border-transparent dark:border-ocean-700 rounded-xl focus:outline-none focus:ring-0 focus:border-emerald-500 transition-all duration-300 text-slate-800 dark:text-white placeholder:text-slate-400"
                        placeholder="1"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Check-in field */}
                  <div className="space-y-2.5 group">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sunset-500" />
                      Check-in Date
                    </label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-xl bg-sand-100 dark:bg-ocean-800 flex items-center justify-center group-focus-within/input:bg-sunset-100 dark:group-focus-within/input:bg-sunset-900/30 group-focus-within/input:text-sunset-500 transition-all duration-300">
                          <Calendar className="w-5 h-5 text-slate-400 dark:text-slate-300 group-focus-within/input:text-sunset-500 transition-colors" />
                        </div>
                      </div>
                      <input
                        type="date"
                        name="checkIn"
                        value={formData.checkIn}
                        onChange={handleFormChange}
                        min={todayStr}
                        className="w-full pl-14 pr-4 py-3.5 bg-sand-50 dark:bg-ocean-800 border-2 border-transparent dark:border-ocean-700 rounded-xl focus:outline-none focus:ring-0 focus:border-sunset-500 transition-all duration-300 text-slate-800 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Check-out field */}
                  <div className="space-y-2.5 group">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-500" />
                      Check-out Date
                    </label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-xl bg-sand-100 dark:bg-ocean-800 flex items-center justify-center group-focus-within/input:bg-amber-100 dark:group-focus-within/input:bg-amber-900/30 group-focus-within/input:text-amber-500 transition-all duration-300">
                          <Calendar className="w-5 h-5 text-slate-400 dark:text-slate-300 group-focus-within/input:text-amber-500 transition-colors" />
                        </div>
                      </div>
                      <input
                        type="date"
                        name="checkOut"
                        value={formData.checkOut}
                        onChange={handleFormChange}
                        min={formData.checkIn || todayStr}
                        className="w-full pl-14 pr-4 py-3.5 bg-sand-50 dark:bg-ocean-800 border-2 border-transparent dark:border-ocean-700 rounded-xl focus:outline-none focus:ring-0 focus:border-amber-500 transition-all duration-300 text-slate-800 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Room Type field */}
                <div className="space-y-2.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Waves className="w-4 h-4 text-teal-500" />
                    Room Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {roomOptions.map((room) => (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, roomType: room.value }))}
                        className={`
                          relative p-4 rounded-xl border-2 transition-all duration-300 text-left
                          ${formData.roomType === room.value 
                            ? "border-sunset-500 bg-gradient-to-br from-sunset-50 to-amber-50 dark:from-sunset-900/30 dark:to-amber-900/30 shadow-lg shadow-sunset-500/20" 
                            : "border-sand-200 dark:border-ocean-700 bg-sand-50/50 dark:bg-ocean-800/50 hover:border-sand-300 dark:hover:border-ocean-600 hover:bg-sand-100 dark:hover:bg-ocean-700"
                          }
                        `}
                      >
                        <div className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 transition-all duration-300 ${formData.roomType === room.value ? "border-sunset-500 bg-sunset-500" : "border-slate-300 dark:border-slate-500"}`}>
                          {formData.roomType === room.value && (
                            <div className="absolute inset-0 m-0.5 bg-white rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${formData.roomType === room.value ? "bg-gradient-to-br from-sunset-500 to-amber-500 text-white" : "bg-sand-200 dark:bg-ocean-700 text-slate-500 dark:text-slate-300"}`}>
                          <room.icon className="w-5 h-5" />
                        </div>
                        <p className={`font-semibold text-sm ${formData.roomType === room.value ? "text-slate-800 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}>
                          {room.label.split(" (")[0]}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
                          {room.label.match(/\(.*\)/)?.[0]}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Message field */}
                <div className="space-y-2.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Send className="w-4 h-4 text-ocean-500" />
                    Special Requests
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    rows={4}
                    className="w-full px-4 py-3.5 bg-sand-50 dark:bg-ocean-800 border-2 border-transparent dark:border-ocean-700 rounded-xl focus:outline-none focus:ring-0 focus:border-ocean-500 transition-all duration-300 resize-none text-slate-800 dark:text-white placeholder:text-slate-400"
                    placeholder="Any special requests or preferences for your stay?"
                  />
                </div>
                
                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-gradient-to-r from-sunset-500 via-amber-500 to-orange-500 text-white py-4 px-6 rounded-xl font-bold text-base hover:from-sunset-600 hover:via-amber-600 hover:to-orange-600 transition-all duration-300 shadow-xl shadow-sunset-500/30 hover:shadow-2xl hover:shadow-sunset-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                >
                  {formLoading ? (
                    <>
                      <div className="relative">
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </div>
                      <span className="animate-pulse">Submitting your booking...</span>
                    </>
                  ) : (
                    <>
                      <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Send className="w-5 h-5" />
                      </div>
                      <span>Submit Booking Request</span>
                      <div className="ml-auto flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse"></div>
                        <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </>
                  )}
                </Button>
                
                {/* Info note */}
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-300 bg-sand-50 dark:bg-ocean-800/50 py-3 px-4 rounded-xl">
                  <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span>We'll contact you within 24 hours to confirm your booking</span>
                </div>
              </form>
            </div>

            {/* Enhanced Your Bookings Section */}
            {bookings.length > 0 && (
              <div className="bg-white/90 dark:bg-ocean-900/90 backdrop-blur-2xl rounded-3xl shadow-xl shadow-sand-200/30 dark:shadow-ocean-950/30 border border-white/50 dark:border-ocean-700/50 overflow-hidden">
                {/* Section header */}
                <div className="px-6 py-5 border-b border-sand-100 dark:border-ocean-700 bg-gradient-to-r from-teal-50/50 to-ocean-50/50 dark:from-ocean-800/50 dark:to-ocean-700/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-teal-500 to-ocean-500 rounded-xl shadow-lg shadow-teal-500/30">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white">Your Bookings</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-300">{bookings.length} reservation{bookings.length > 1 ? 's' : ''} found</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  {bookings.map((booking, index) => (
                    <div
                      key={booking._id}
                      className="group relative bg-gradient-to-br from-sand-50 to-ocean-50 dark:from-ocean-800 dark:to-ocean-700 rounded-2xl p-5 border border-sand-200 dark:border-ocean-600 hover:border-sunset-300 dark:hover:border-sunset-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-sand-200/30 dark:hover:shadow-ocean-900/30 hover:scale-[1.01]"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Status indicator */}
                      <div className={`absolute top-0 left-0 w-1 h-full rounded-l-2xl ${booking.status === "confirmed" ? "bg-gradient-to-b from-emerald-500 to-teal-500" : booking.status === "pending" ? "bg-gradient-to-b from-amber-500 to-orange-500" : "bg-gradient-to-b from-slate-400 to-slate-500"}`}></div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-3 pl-4">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gradient-to-br from-sunset-500 to-amber-500 rounded-lg text-white">
                              <Waves className="w-4 h-4" />
                            </div>
                            <p className="font-bold text-lg text-slate-800 dark:text-white">{booking.roomType}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-sm">
                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              <span className="text-slate-400">→</span>
                              <span>{new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                              <Users className="w-4 h-4" />
                              <span>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row sm:flex-col items-start sm:items-end gap-3">
                          <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold ${booking.status === "confirmed" ? "bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 text-emerald-700 dark:text-emerald-400" : booking.status === "pending" ? "bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 text-amber-700 dark:text-amber-400" : "bg-sand-200 dark:bg-ocean-600 text-slate-600 dark:text-slate-300"}`}>
                            {booking.status === "confirmed" && <CheckCircle className="w-4 h-4" />}
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                          <p className="text-xl font-bold bg-gradient-to-r from-sunset-500 to-amber-500 bg-clip-text text-transparent">
                            ₱{booking.totalPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      {/* Hover decoration */}
                      <div className="absolute -bottom-2 -right-2 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Umbrella className="w-full h-full text-sunset-200 dark:text-sunset-800" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white/60 dark:bg-ocean-900/60 backdrop-blur-xl border-t border-sand-200/50 dark:border-ocean-700/50 py-4 px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-teal-500" />
              <span>© 2024 Piel Lighthouse Resort. Your beach paradise awaits.</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-sunset-500" />
                Made with care
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}







