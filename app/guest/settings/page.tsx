"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { GuestProfileDropdown } from "@/components/guest-profile-dropdown"
import { ArrowLeft, Bell, Moon, Globe, Shield, HelpCircle } from "lucide-react"

interface Guest {
  username: string
  email: string
  phone?: string
  _id: string
}

export default function GuestSettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [guest, setGuest] = useState<Guest | null>(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState(true)

  const isDarkMode = theme === "dark"

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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  const settingsSections = [
    {
      title: "Preferences",
      items: [
        {
          icon: Bell,
          label: "Notifications",
          description: "Receive booking updates and promotions",
          type: "toggle",
          value: notifications,
          onChange: () => setNotifications(!notifications),
        },
        {
          icon: Moon,
          label: "Dark Mode",
          description: "Switch to dark theme",
          type: "toggle",
          value: isDarkMode,
          onChange: () => setTheme(isDarkMode ? "light" : "dark"),
        },
        {
          icon: Globe,
          label: "Language",
          description: "English",
          type: "link",
          href: "#",
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: Shield,
          label: "Privacy Policy",
          description: "How we protect your data",
          type: "link",
          href: "#",
        },
        {
          icon: HelpCircle,
          label: "Help Center",
          description: "Get help with your bookings",
          type: "link",
          href: "#",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
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
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">Settings</h1>
            </div>
            <GuestProfileDropdown guest={guest} />
          </div>
        </div>
      </nav>

      {/* Settings Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                <h2 className="font-semibold text-slate-800 dark:text-white">{section.title}</h2>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
                        <item.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">{item.label}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                      </div>
                    </div>
                    {item.type === "toggle" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          item.onChange?.()
                        }}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                          item.value ? "bg-amber-500 dark:bg-amber-600" : "bg-slate-200 dark:bg-slate-600"
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                            item.value ? "left-7" : "left-1"
                          }`}
                        />
                      </button>
                    ) : (
                      <button className="text-slate-400 hover:text-amber-600 dark:text-slate-500 dark:hover:text-amber-400 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* App Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">Piel Lighthouse Resort</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Version 1.0.0</p>
        </div>
      </main>
    </div>
  )
}
