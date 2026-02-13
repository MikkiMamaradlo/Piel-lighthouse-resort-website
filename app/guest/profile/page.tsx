"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { GuestProfileDropdown } from "@/components/guest-profile-dropdown"
import { ArrowLeft, User, Mail, Phone, Calendar, Sun, Waves, Umbrella, MapPin, Star } from "lucide-react"

interface Guest {
  username: string
  email: string
  phone?: string
  _id: string
}

export default function GuestProfilePage() {
  const router = useRouter()
  const [guest, setGuest] = useState<Guest | null>(null)
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
            <p className="text-white/90 text-xl font-medium tracking-wide">Loading profile...</p>
            <div className="flex items-center justify-center gap-2">
              <Umbrella className="w-5 h-5 text-amber-400 animate-bounce-slow" />
              <span className="text-white/60 text-sm">Preparing your profile</span>
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
        <div className="absolute top-40 left-10 w-40 h-40 bg-amber-300/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-40 right-10 w-60 h-60 bg-teal-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-sunset-300/10 rounded-full blur-3xl animate-pulse-glow"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white/80 dark:bg-ocean-900/80 backdrop-blur-2xl border-b border-sand-200/50 dark:border-ocean-700/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                href="/guest/dashboard"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sand-100 dark:bg-ocean-800 text-slate-600 dark:text-slate-300 hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-300 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline font-medium">Back</span>
              </Link>
              <div className="hidden sm:flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-sunset-500 to-amber-500 rounded-xl shadow-lg shadow-sunset-500/30">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800 dark:text-white">My Profile</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Umbrella className="w-3 h-3" /> Guest Information
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

      {/* Profile Content */}
      <main className="relative z-10 flex-1 p-6 overflow-auto">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-sunset-500 to-amber-500 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-br from-sunset-100 to-amber-100 dark:from-sunset-900/30 dark:to-amber-900/30 rounded-2xl">
                <Sun className="w-8 h-8 text-sunset-500 mx-auto mb-2" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Your Profile
            </h1>
            <p className="text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2">
              <Waves className="w-4 h-4 text-teal-500" />
              Manage your guest information
            </p>
          </div>
          
          {/* Profile Card */}
          <div className="bg-white/90 dark:bg-ocean-900/90 backdrop-blur-2xl rounded-3xl shadow-xl shadow-sand-200/30 dark:shadow-ocean-950/30 border border-white/50 dark:border-ocean-700/50 overflow-hidden">
            {/* Profile Header */}
            <div className="relative p-8 bg-gradient-to-r from-sunset-500 via-amber-500 to-orange-500">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl"></div>
              
              <div className="relative flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/20">
                    <span className="text-4xl font-bold text-white">
                      {guest?.username?.charAt(0).toUpperCase() || "G"}
                    </span>
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-white mb-1">{guest?.username || "Guest"}</h2>
                  <p className="text-white/80 flex items-center justify-center sm:justify-start gap-1">
                    <Mail className="w-4 h-4" />
                    {guest?.email || "No email"}
                  </p>
                </div>
              </div>
              
              {/* Wave decoration at bottom */}
              <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 60" className="w-full h-8 text-white/20" preserveAspectRatio="none">
                  <path fill="currentColor" d="M0,32L48,37.3C96,43,192,53,288,53.3C384,53,480,43,576,42.7C672,43,768,53,864,53.3C960,53,1056,43,1152,42.7C1248,43,1344,53,1392,56L1440,60L1440,60L1392,60C1344,60,1248,60,1152,60C1056,60,960,60,864,60C768,60,672,60,576,60C480,60,384,60,288,60C192,60,96,60,48,60L0,60Z"></path>
                </svg>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group p-5 bg-gradient-to-br from-sand-50 to-ocean-50 dark:from-ocean-800 dark:to-ocean-700 rounded-2xl border border-sand-200 dark:border-ocean-600 hover:border-sunset-300 dark:hover:border-sunset-500/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg shadow-amber-500/30">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Username</p>
                  </div>
                  <p className="text-lg font-bold text-slate-800 dark:text-white pl-11">{guest?.username || "N/A"}</p>
                </div>
                
                <div className="group p-5 bg-gradient-to-br from-sand-50 to-ocean-50 dark:from-ocean-800 dark:to-ocean-700 rounded-2xl border border-sand-200 dark:border-ocean-600 hover:border-teal-300 dark:hover:border-teal-500/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-teal-500 to-ocean-500 rounded-xl shadow-lg shadow-teal-500/30">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</p>
                  </div>
                  <p className="text-lg font-bold text-slate-800 dark:text-white pl-11 truncate">{guest?.email || "N/A"}</p>
                </div>
                
                <div className="group p-5 bg-gradient-to-br from-sand-50 to-ocean-50 dark:from-ocean-800 dark:to-ocean-700 rounded-2xl border border-sand-200 dark:border-ocean-600 hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/30">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone Number</p>
                  </div>
                  <p className="text-lg font-bold text-slate-800 dark:text-white pl-11">{guest?.phone || "Not provided"}</p>
                </div>
                
                <div className="group p-5 bg-gradient-to-br from-sand-50 to-ocean-50 dark:from-ocean-800 dark:to-ocean-700 rounded-2xl border border-sand-200 dark:border-ocean-600 hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/30">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Member Since</p>
                  </div>
                  <p className="text-lg font-bold text-slate-800 dark:text-white pl-11 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    2024
                  </p>
                </div>
              </div>
              
              {/* Resort badge */}
              <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-sand-100 to-ocean-100 dark:from-ocean-800 dark:to-ocean-700 rounded-2xl border border-sand-200 dark:border-ocean-600">
                <Umbrella className="w-5 h-5 text-sunset-500" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Piel Lighthouse Resort Guest</span>
                <Waves className="w-5 h-5 text-teal-500" />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white/60 dark:bg-ocean-900/60 backdrop-blur-xl border-t border-sand-200/50 dark:border-ocean-700/50 py-4 px-6 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
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
  )
}
