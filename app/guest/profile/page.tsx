"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { GuestProfileDropdown } from "@/components/guest-profile-dropdown"
import { ArrowLeft } from "lucide-react"

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
      <div className="min-h-screen bg-slate-50 dark:bg-ocean-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-ocean-950">
      {/* Navigation */}
      <nav className="bg-white dark:bg-ocean-900 border-b border-slate-200 dark:border-ocean-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/guest/dashboard")}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">My Profile</h1>
            </div>
            <div className="flex items-center gap-3">
              <GuestProfileDropdown guest={guest} />
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-ocean-900 rounded-2xl shadow-lg border border-slate-200 dark:border-ocean-700 overflow-hidden">
          {/* Profile Header */}
          <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-ocean-800 dark:to-ocean-900 border-b border-slate-100 dark:border-ocean-700">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                <span className="text-3xl font-bold text-white">
                  {guest?.username?.charAt(0).toUpperCase() || "G"}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{guest?.username || "Guest"}</h2>
                <p className="text-slate-500 dark:text-slate-400">{guest?.email || "No email"}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-ocean-800 rounded-xl">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Username</p>
                <p className="font-semibold text-slate-800 dark:text-white">{guest?.username || "N/A"}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-ocean-800 rounded-xl">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Email</p>
                <p className="font-semibold text-slate-800 dark:text-white">{guest?.email || "N/A"}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-ocean-800 rounded-xl">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Phone</p>
                <p className="font-semibold text-slate-800 dark:text-white">{guest?.phone || "Not provided"}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-ocean-800 rounded-xl">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Member Since</p>
                <p className="font-semibold text-slate-800 dark:text-white">2024</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
