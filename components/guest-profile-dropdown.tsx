"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Calendar, Settings, LogOut, ChevronDown } from "lucide-react"

interface GuestProfileDropdownProps {
  guest: {
    username: string
    email: string
    phone?: string
    _id: string
  } | null
}

export function GuestProfileDropdown({ guest }: GuestProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/guest/auth", { method: "DELETE" })
      router.push("/guest/login")
    } catch {
      console.error("Logout failed")
    }
  }

  const menuItems = [
    {
      icon: User,
      label: "My Profile",
      href: "/guest/profile",
      description: "Manage your account",
    },
    {
      icon: Calendar,
      label: "My Bookings",
      href: "/guest/bookings",
      description: "View your reservations",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/guest/settings",
      description: "Preferences",
    },
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 transition-all duration-200 group"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-shadow">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="text-right">
          <p className="font-semibold text-slate-800 text-sm">{guest?.username || "Guest"}</p>
          <p className="text-xs text-slate-500">Guest</p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Mobile Trigger (Avatar only) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30"
      >
        <User className="w-5 h-5 text-white" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">{guest?.username || "Guest"}</p>
                <p className="text-xs text-slate-500">{guest?.email || "guest@email.com"}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  router.push(item.href)
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-slate-600 hover:bg-slate-50 hover:text-amber-600 transition-all duration-200 group"
              >
                <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-amber-100 transition-colors">
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-slate-400">{item.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100" />

          {/* Logout Button */}
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-red-600 hover:bg-red-50 transition-all duration-200 group"
            >
              <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Logout</p>
                <p className="text-xs text-red-400">Sign out of your account</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GuestProfileDropdown
