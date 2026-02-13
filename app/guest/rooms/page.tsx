"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Star, Users, Wifi, Wind, Tv, Refrigerator, ShowerHead, ArrowLeft, Check, Waves, Sun, Umbrella, Anchor } from "lucide-react"
import { GuestProfileDropdown } from "@/components/guest-profile-dropdown"
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

  const handleReserve = (room: Room) => {
    // Store selected room in sessionStorage for the dashboard to pick up
    sessionStorage.setItem("selectedRoom", JSON.stringify(room))
    // Direct navigation with hash to ensure scrolling to booking form
    window.location.href = "/guest/dashboard#quick-booking"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-900 via-ocean-800 to-teal-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative inline-block mb-6">
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
            <p className="text-white/90 text-xl font-medium tracking-wide">Loading available rooms...</p>
            <div className="flex items-center justify-center gap-2">
              <Umbrella className="w-5 h-5 text-amber-400 animate-bounce-slow" />
              <span className="text-white/60 text-sm">Finding your perfect stay</span>
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
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-sand-50 via-ocean-50 to-teal-50 dark:from-ocean-950 dark:via-ocean-900 dark:to-teal-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 right-20 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-sunset-300/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute top-40 right-1/3 w-64 h-64 bg-ocean-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-40 right-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
        <div className="absolute top-1/2 left-10 w-48 h-48 bg-teal-400/15 rounded-full blur-2xl animate-float" style={{ animationDelay: "1.5s" }}></div>
      </div>

      {/* Blurred Background Image Layer */}
      <div className="fixed inset-0 bg-[url('/images/piel10.jpg')] bg-cover bg-fixed bg-center opacity-30 pointer-events-none"></div>
      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/80 dark:from-ocean-950/80 dark:via-ocean-900/70 dark:to-ocean-950/80 backdrop-blur-md pointer-events-none"></div>

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
              <p className="font-bold text-xl text-slate-800 dark:text-white tracking-tight">Piel Lighthouse</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
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
            className="group relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 text-slate-600 dark:text-slate-300 hover:bg-gradient-to-r hover:from-sand-100 hover:to-ocean-50 dark:hover:from-ocean-800 dark:hover:to-ocean-700 hover:shadow-lg hover:shadow-sand-200/50"
          >
            <div className="p-2.5 rounded-xl bg-sand-100 dark:bg-ocean-800 group-hover:bg-white dark:group-hover:bg-ocean-700 transition-all duration-300 shadow-sm group-hover:shadow-md">
              <Calendar className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-sunset-500 transition-colors" />
            </div>
            <span className="font-medium text-base">Book Your Stay</span>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-8px] group-hover:translate-x-0">
              <ArrowLeft className="w-4 h-4 text-sunset-500" />
            </div>
          </Link>
          
          <Link
            href="/guest/rooms"
            className="group relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-400 bg-gradient-to-r from-sunset-500 to-amber-500 text-white shadow-lg shadow-sunset-500/30 hover:shadow-xl hover:shadow-sunset-500/40 hover:scale-[1.02]"
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-white rounded-r-full shadow-lg"></div>
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
              <Users className="w-5 h-5" />
            </div>
            <span className="font-semibold text-base">Available Rooms</span>
            <div className="ml-auto w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-glow"></div>
          </Link>
        </nav>

        {/* Decorative wave */}
        <div className="px-4 pb-4 pt-2">
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
              className="lg:hidden p-3 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-sand-100 dark:hover:bg-ocean-800 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <Users className="w-6 h-6" />
            </button>

            {/* Welcome badge */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-sand-100 to-ocean-50 dark:from-ocean-800 dark:to-ocean-700 rounded-full">
              <Sun className="w-4 h-4 text-sunset-500 animate-pulse-glow" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {guest?.username}'s Paradise
              </span>
            </div>

            <div className="flex items-center gap-3">
              <GuestProfileDropdown guest={guest} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="relative z-10 flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Page Header */}
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-sunset-500 to-amber-500 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
                <div className="relative p-4 bg-gradient-to-br from-sunset-100 to-amber-100 dark:from-sunset-900/30 dark:to-amber-900/30 rounded-2xl">
                  <Anchor className="w-8 h-8 text-sunset-500 mx-auto mb-2" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Available Rooms & Cottages
              </h1>
              <p className="text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2">
                <Waves className="w-5 h-5 text-teal-500" />
                Choose from our selection of comfortable accommodations for your beach paradise getaway
              </p>
            </div>

            {/* Rooms Grid */}
            {loading ? (
              <div className="bg-white/80 dark:bg-ocean-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-ocean-700/50 p-12 text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 border-4 border-sand-200 dark:border-ocean-700 rounded-full flex items-center justify-center mx-auto">
                    <div className="w-10 h-10 border-4 border-sunset-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400">Loading rooms...</p>
              </div>
            ) : rooms.length === 0 ? (
              <div className="bg-white/80 dark:bg-ocean-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-ocean-700/50 p-12 text-center">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-sunset-400/20 rounded-full blur-2xl animate-pulse"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-sunset-100 to-amber-100 dark:from-sunset-900/30 dark:to-amber-900/30 rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <Users className="w-10 h-10 text-sunset-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No rooms available at the moment</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Please check back later for availability</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room, index) => (
                  <div
                    key={room._id}
                    className="group bg-white/80 dark:bg-ocean-900/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 dark:border-ocean-700/50 overflow-hidden hover:shadow-2xl hover:shadow-sunset-500/20 dark:hover:border-sunset-700/50 transition-all duration-500 hover:scale-[1.02]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Image */}
                    <div className="relative h-56 bg-sand-100 dark:bg-ocean-800 overflow-hidden">
                      <img
                        src={room.image || "/placeholder.jpg"}
                        alt={room.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {room.popular && (
                        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-sunset-500 text-white text-xs font-bold rounded-full shadow-lg shadow-amber-500/30">
                          <Star className="w-3.5 h-3.5" />
                          Popular
                        </div>
                      )}
                      {/* Type Badge */}
                      <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 dark:bg-ocean-900/90 backdrop-blur-sm text-xs font-bold rounded-full shadow-lg text-slate-700 dark:text-white flex items-center gap-1">
                        {room.type === "cottage" ? (
                          <>
                            <Anchor className="w-3.5 h-3.5" /> Cottage
                          </>
                        ) : (
                          <>
                            <Sun className="w-3.5 h-3.5" /> Room
                          </>
                        )}
                      </div>
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      {/* Wave decoration */}
                      <div className="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1440 60" className="w-full h-6 text-white/20" preserveAspectRatio="none">
                          <path fill="currentColor" d="M0,32L48,37.3C96,43,192,53,288,53.3C384,53,480,43,576,42.7C672,43,768,53,864,53.3C960,53,1056,43,1152,42.7C1248,43,1344,53,1392,56L1440,60L1440,60L1392,60C1344,60,1248,60,1152,60C1056,60,960,60,864,60C768,60,672,60,576,60C480,60,384,60,288,60C192,60,96,60,48,60L0,60Z"></path>
                        </svg>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 bg-white/95 dark:bg-ocean-900/95 backdrop-blur-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{room.name}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-1">
                            <Users className="w-4 h-4 text-sunset-500" />
                            {room.capacity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold bg-gradient-to-r from-sunset-500 to-amber-500 bg-clip-text text-transparent">
                            {room.price}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 bg-sand-100 dark:bg-ocean-800 px-2 py-1 rounded-lg mt-1">
                            {room.period}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2 leading-relaxed">
                        {room.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {room.features.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-gradient-to-r from-sand-100 to-ocean-100 dark:from-ocean-800 dark:to-ocean-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300"
                          >
                            {feature}
                          </span>
                        ))}
                        {room.features.length > 3 && (
                          <span className="px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg text-xs font-medium text-amber-700 dark:text-amber-400">
                            +{room.features.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Amenities Preview */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        {room.inclusions.slice(0, 3).map((inclusion, idx) => {
                          const Icon = iconMap[inclusion.icon] || Users
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-100 to-ocean-100 dark:from-teal-900/30 dark:to-ocean-800/30 rounded-lg text-xs font-medium text-teal-700 dark:text-teal-400"
                            >
                              <Icon className="w-3.5 h-3.5" />
                              <span>{inclusion.text}</span>
                            </div>
                          )
                        })}
                        {room.inclusions.length > 3 && (
                          <span className="px-3 py-1.5 bg-sand-100 dark:bg-ocean-800 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400">
                            +{room.inclusions.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Reserve Button */}
                      <button
                        onClick={() => handleReserve(room)}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-sunset-500 via-amber-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-sunset-500/30 hover:scale-[1.02] transition-all duration-300"
                      >
                        <div className="p-1 bg-white/20 rounded-lg backdrop-blur-sm">
                          <Check className="w-4 h-4" />
                        </div>
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
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/80 dark:bg-white/60 backdrop-blur-sm rounded-xl font-medium text-slate-600 dark:text-slate-900 hover:bg-gradient-to-r hover:from-sand-100 hover:to-ocean-50 dark:hover:from-sand-200 dark:hover:to-ocean-100 hover:text-slate-900 dark:hover:text-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl border border-sand-200 dark:border-slate-300"
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
