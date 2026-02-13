"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { GuestProfileDropdown } from "@/components/guest-profile-dropdown"
import { ArrowLeft, Calendar, MapPin, Users, Clock, Utensils, Waves, Sun, Umbrella, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Booking {
  _id: string
  roomName: string
  checkIn: string
  checkOut: string
  status: "confirmed" | "pending" | "completed" | "cancelled"
  guests: number
  totalPrice: number
  image?: string
}

interface Guest {
  username: string
  email: string
  phone?: string
  _id: string
}

export default function GuestBookingsPage() {
  const router = useRouter()
  const [guest, setGuest] = useState<Guest | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/guest/auth/check")
        if (!res.ok) {
          router.push("/guest/login")
          return
        }
        const data = await res.json()
        setGuest(data.guest)
      } catch {
        router.push("/guest/login")
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/guest/bookings")
        if (res.ok) {
          const data = await res.json()
          setBookings(data.bookings || [])
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error)
      }
    }
    if (guest) {
      fetchBookings()
    }
  }, [guest])

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "confirmed":
        return { 
          bg: "bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40", 
          text: "text-emerald-700 dark:text-emerald-400",
          border: "border-emerald-300 dark:border-emerald-700",
          icon: Waves
        }
      case "pending":
        return { 
          bg: "bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40", 
          text: "text-amber-700 dark:text-amber-400",
          border: "border-amber-300 dark:border-amber-700",
          icon: Clock
        }
      case "completed":
        return { 
          bg: "bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40", 
          text: "text-blue-700 dark:text-blue-400",
          border: "border-blue-300 dark:border-blue-700",
          icon: Star
        }
      case "cancelled":
        return { 
          bg: "bg-gradient-to-r from-rose-100 to-red-100 dark:from-rose-900/40 dark:to-red-900/40", 
          text: "text-rose-700 dark:text-rose-400",
          border: "border-rose-300 dark:border-rose-700",
          icon: Clock
        }
      default:
        return { 
          bg: "bg-muted dark:bg-ocean-800", 
          text: "text-muted-foreground",
          border: "border-border dark:border-ocean-600",
          icon: Clock
        }
    }
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
            <p className="text-white/90 text-xl font-medium tracking-wide">Loading your bookings...</p>
            <div className="flex items-center justify-center gap-2">
              <Umbrella className="w-5 h-5 text-amber-400 animate-bounce-slow" />
              <span className="text-white/60 text-sm">Preparing your reservations</span>
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sand-50 via-ocean-50 to-teal-50 dark:from-ocean-950 dark:via-ocean-900 dark:to-teal-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-10 w-40 h-40 bg-amber-300/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-40 right-10 w-60 h-60 bg-teal-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-sunset-300/10 rounded-full blur-3xl animate-pulse-glow"></div>
      </div>

      {/* Blurred Background Image Layer */}
      <div className="fixed inset-0 bg-[url('/images/piel10.jpg')] bg-cover bg-fixed bg-center opacity-20 pointer-events-none"></div>
      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-white/90 via-white/70 to-white/90 dark:from-ocean-950/90 dark:via-ocean-900/80 dark:to-ocean-950/90 backdrop-blur-2xl pointer-events-none"></div>

      {/* Navigation */}
      <nav className="relative z-20 bg-white/80 dark:bg-ocean-900/80 backdrop-blur-2xl border-b border-sand-200/50 dark:border-ocean-700/50 sticky top-0">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                href="/guest/dashboard"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sand-100 dark:bg-ocean-800 text-muted-foreground hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-300 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline font-medium">Back</span>
              </Link>
              <div className="hidden sm:flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-teal-500 to-ocean-500 rounded-xl shadow-lg shadow-teal-500/30">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-card-foreground">My Bookings</h1>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Umbrella className="w-3 h-3" /> Your reservations at Piel Lighthouse
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <GuestProfileDropdown guest={guest} />
            </div>
          </div>
        </div>
      </nav>

      {/* Bookings Content */}
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-sunset-500 to-amber-500 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-br from-sunset-100 to-amber-100 dark:from-sunset-900/30 dark:to-amber-900/30 rounded-2xl">
                <Sun className="w-8 h-8 text-sunset-500 mx-auto mb-2" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-card-foreground mb-2 bg-gradient-to-r from-foreground to-muted-foreground dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Your Reservations
            </h1>
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              <Waves className="w-4 h-4 text-teal-500" />
              View and manage your beach getaway bookings
            </p>
          </div>
          
          {bookings.length === 0 ? (
            <div className="bg-white/90 dark:bg-ocean-900/90 backdrop-blur-2xl rounded-3xl shadow-xl shadow-sand-200/30 dark:shadow-ocean-950/30 border border-white/50 dark:border-ocean-700/50 p-12 text-center">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-sunset-400/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-sunset-100 to-amber-100 dark:from-sunset-900/30 dark:to-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Calendar className="w-12 h-12 text-sunset-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-card-foreground mb-3">No Bookings Yet 🌴</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">You haven't made any reservations yet. Start planning your perfect beach getaway and create unforgettable memories!</p>
              <Link
                href="/guest/rooms"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-sunset-500 via-amber-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-sunset-500/30 hover:scale-105 transition-all duration-300"
              >
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Waves className="w-5 h-5" />
                </div>
                Browse Rooms
                <div className="ml-2 flex items-center gap-1">
                  <Umbrella className="w-4 h-4 opacity-60" />
                </div>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking, index) => {
                const statusConfig = getStatusConfig(booking.status)
                const StatusIcon = statusConfig.icon
                
                return (
                  <div
                    key={booking._id}
                    className="group bg-white/90 dark:bg-ocean-900/90 backdrop-blur-2xl rounded-3xl shadow-lg border border-white/50 dark:border-ocean-700/50 overflow-hidden hover:shadow-2xl hover:shadow-sunset-500/20 hover:border-sunset-200 dark:hover:border-sunset-700/50 transition-all duration-500 hover:scale-[1.01]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Room Image */}
                      <div className="w-full sm:w-56 h-48 sm:h-auto bg-gradient-to-br from-ocean-400 via-teal-500 to-amber-400 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 50 Q 25 30, 50 50 T 100 50 L 100 100 L 0 100 Z" fill="white" opacity="0.3"/>
                          </svg>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                            <Waves className="w-12 h-12 text-white" />
                          </div>
                        </div>
                        {/* Wave decoration */}
                        <div className="absolute bottom-0 left-0 right-0">
                          <svg viewBox="0 0 1440 60" className="w-full h-8 text-white/20" preserveAspectRatio="none">
                            <path fill="currentColor" d="M0,32L48,37.3C96,43,192,53,288,53.3C384,53,480,43,576,42.7C672,43,768,53,864,53.3C960,53,1056,43,1152,42.7C1248,43,1344,53,1392,56L1440,60L1440,60L1392,60C1344,60,1248,60,1152,60C1056,60,960,60,864,60C768,60,672,60,576,60C480,60,384,60,288,60C192,60,96,60,48,60L0,60Z"></path>
                          </svg>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-gradient-to-br from-sunset-500 to-amber-500 rounded-xl shadow-lg shadow-sunset-500/30 text-white">
                                <Utensils className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-sunset-600 dark:group-hover:text-sunset-400 transition-colors">{booking.roomName}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-300 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> Piel Lighthouse Resort
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3">
                              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sand-100 to-ocean-100 dark:from-ocean-800 dark:to-ocean-700 rounded-xl">
                                <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                  <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                </div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  {new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-100 to-ocean-100 dark:from-teal-900/30 dark:to-ocean-800/30 rounded-xl">
                                <div className="p-1.5 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                                  <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                </div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{booking.guests} Guest{booking.guests > 1 ? "s" : ""}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-row sm:flex-col items-start sm:items-end gap-3">
                            <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                              <StatusIcon className="w-4 h-4" />
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-amber-600">₱{booking.totalPrice.toLocaleString()}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-300 flex items-center justify-end gap-1">
                                <Umbrella className="w-3 h-3" /> Total
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white/60 dark:bg-ocean-900/60 backdrop-blur-xl border-t border-sand-200/50 dark:border-ocean-700/50 py-4 px-6 relative z-10 mt-auto">
        <div className="max-w-5xl mx-auto">
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
        </div>
      </footer>
    </div>
  )
}







