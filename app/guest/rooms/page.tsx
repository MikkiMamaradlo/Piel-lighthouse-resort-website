"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Calendar, User, LogOut, Star, Users, Wifi, Wind, Tv, Refrigerator, ShowerHead, ArrowLeft, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface Room {
  _id: string
  name: string
  type: "room" | "cottage"
  capacity: string
  image: string
  images?: string[]
  price: string
  period: string
  inclusions: Array<{ icon: string; text: string }>
  popular: boolean
  features: string[]
  description: string
  status: "available" | "unavailable"
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users: Users,
  Wind: Wind,
  Refrigerator: Refrigerator,
  Tv: Tv,
  ShowerHead: ShowerHead,
  Wifi: Wifi,
}

export default function GuestRoomsPage() {
  const router = useRouter()
  const [guest, setGuest] = useState<any>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { toast } = useToast()

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
    } catch {
      router.push("/guest/login")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/guest/rooms")
      const data = await response.json()
      setRooms(data.rooms || [])
    } catch (error) {
      console.error("Failed to fetch rooms:", error)
      toast({
        title: "Error",
        description: "Failed to load rooms. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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

  const handleReserve = (room: Room) => {
    // Store selected room in sessionStorage for the dashboard to pick up
    sessionStorage.setItem("selectedRoom", JSON.stringify(room))
    // Direct navigation with hash to ensure scrolling to booking form
    window.location.href = "/guest/dashboard#quick-booking"
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
          <p className="text-white text-lg">Loading available rooms...</p>
          <div className="mt-4 flex justify-center">
            <div className="w-10 h-10 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Blurred Background Image Layer */}
      <div className="fixed inset-0 bg-[url('/images/piel10.jpg')] bg-cover bg-fixed bg-center blur-md opacity-40 pointer-events-none"></div>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-ocean-900/50 pointer-events-none z-0"></div>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white/95 dark:bg-ocean-900/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 lg:transform-none border-r border-slate-200 dark:border-ocean-700 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-100/50 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg ring-1 ring-white/30 overflow-hidden">
              <Image 
                src="/images/PielLogo.jpg" 
                alt="Piel Lighthouse Logo" 
                width={44} 
                height={44}
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-lg text-white">Piel Lighthouse</p>
              <p className="text-xs text-white/80">Guest Portal</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <Link
            href="/guest/dashboard"
            className="group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-ocean-800"
          >
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-ocean-800 group-hover:bg-slate-200 dark:group-hover:bg-ocean-700 transition-all duration-300">
              <Calendar className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-amber-500 transition-colors" />
            </div>
            <span className="font-medium">Book Your Stay</span>
          </Link>
          <Link
            href="/guest/rooms"
            className="group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30"
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg" />
            <div className="p-2 rounded-xl bg-white/20">
              <Users className="w-5 h-5" />
            </div>
            <span className="font-medium">Available Rooms</span>
            <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
          </Link>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 dark:border-ocean-700 bg-slate-50/80 dark:bg-ocean-900/80 backdrop-blur-sm">
          <button
            onClick={handleLogout}
            className="group relative flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
          >
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-all duration-300">
              <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
            </div>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen backdrop-blur-0">
        {/* Header */}
        <header className="bg-white/80 dark:bg-ocean-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-ocean-700/50 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-ocean-800 rounded-xl"
            >
              <Users className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800 dark:text-white">{guest?.username}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Guest</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Page Header */}
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Available Rooms & Cottages
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Choose from our selection of comfortable accommodations
              </p>
            </div>

            {/* Rooms Grid */}
            {loading ? (
              <div className="bg-white dark:bg-ocean-900 rounded-2xl shadow-sm border border-slate-100 dark:border-ocean-700 p-12 text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-800 rounded-full" />
                  <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-slate-500 dark:text-slate-400">Loading rooms...</p>
              </div>
            ) : rooms.length === 0 ? (
              <div className="bg-white dark:bg-ocean-900 rounded-2xl shadow-sm border border-slate-100 dark:border-ocean-700 p-12 text-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-ocean-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">No rooms available at the moment</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">Please check back later for availability</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <div
                    key={room._id}
                    className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-56 bg-slate-100 dark:bg-ocean-800 overflow-hidden">
                      <img
                        src={room.image || "/placeholder.jpg"}
                        alt={room.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {room.popular && (
                        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-semibold rounded-full shadow-lg">
                          <Star className="w-3.5 h-3.5" />
                          Popular
                        </div>
                      )}
                      {/* Type Badge */}
                      <div className="absolute top-4 right-4 px-3 py-1.5 bg-white dark:bg-slate-700 backdrop-blur-sm text-xs font-semibold rounded-full shadow-lg text-slate-700 dark:text-white">
                        {room.type === "cottage" ? "🏠 Cottage" : "🛏️ Room"}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Content */}
                    <div className="p-6 bg-white dark:bg-white/10 backdrop-blur-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{room.name}</h3>
                          <p className="text-sm text-slate-600 dark:text-white flex items-center gap-1 mt-1">
                            <Users className="w-4 h-4" />
                            {room.capacity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {room.price}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-white">{room.period}</p>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-white mb-4 line-clamp-2">
                        {room.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {room.features.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs text-slate-600 dark:text-white"
                          >
                            {feature}
                          </span>
                        ))}
                        {room.features.length > 3 && (
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs text-slate-600 dark:text-white">
                            +{room.features.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Amenities Preview */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {room.inclusions.slice(0, 3).map((inclusion, idx) => {
                          const Icon = iconMap[inclusion.icon] || Users
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-xs text-blue-600 dark:text-blue-400"
                            >
                              <Icon className="w-3 h-3" />
                              <span>{inclusion.text}</span>
                            </div>
                          )
                        })}
                        {room.inclusions.length > 3 && (
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs text-slate-600 dark:text-white">
                            +{room.inclusions.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Reserve Button */}
                      <button
                        onClick={() => handleReserve(room)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40"
                      >
                        <Check className="w-5 h-5" />
                        Reserve Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Back to Dashboard */}
            <div className="text-center pt-8">
              <Link
                href="/guest/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 dark:bg-white/60 backdrop-blur-sm rounded-xl font-medium text-slate-600 dark:text-slate-900 hover:bg-white/80 dark:hover:bg-white/80 hover:text-slate-900 dark:hover:text-slate-900 transition-all shadow-sm border border-slate-200 dark:border-slate-300"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Booking
              </Link>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
