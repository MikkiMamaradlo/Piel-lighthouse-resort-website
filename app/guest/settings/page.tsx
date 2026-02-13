"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTheme } from "next-themes"
import { GuestProfileDropdown } from "@/components/guest-profile-dropdown"
import { ArrowLeft, Bell, Moon, Globe, Shield, HelpCircle, Sun, Waves, Umbrella, ChevronRight, Check } from "lucide-react"

interface Guest {
  username: string
  email: string
  phone?: string
  _id: string
}

interface SettingItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  description: string
  type: "toggle" | "link"
  value?: boolean
  onChange?: () => void
  href?: string
  gradient: string
}

interface SettingSection {
  title: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  items: SettingItem[]
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-900 via-ocean-800 to-teal-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-amber-400/30 rounded-3xl blur-2xl animate-pulse"></div>
            <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-400 via-orange-500 to-sunset-500 rounded-3xl shadow-2xl shadow-amber-500/40 overflow-hidden ring-4 ring-white/10">
              <Sun className="w-12 h-12 text-white" />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-white/90 text-xl font-medium tracking-wide">Loading settings...</p>
            <div className="flex items-center justify-center gap-2">
              <Umbrella className="w-5 h-5 text-amber-400 animate-bounce-slow" />
              <span className="text-white/60 text-sm">Preparing your preferences</span>
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

  const settingsSections: SettingSection[] = [
    {
      title: "Preferences",
      icon: Sun,
      gradient: "from-sunset-500 to-amber-500",
      items: [
        {
          icon: Bell,
          label: "Notifications",
          description: "Receive booking updates and promotions",
          type: "toggle",
          value: notifications,
          onChange: () => setNotifications(!notifications),
          gradient: "from-emerald-500 to-teal-500",
        },
        {
          icon: Moon,
          label: "Dark Mode",
          description: "Switch to dark theme",
          type: "toggle",
          value: isDarkMode,
          onChange: () => setTheme(isDarkMode ? "light" : "dark"),
          gradient: "from-indigo-500 to-purple-500",
        },
        {
          icon: Globe,
          label: "Language",
          description: "English",
          type: "link",
          href: "#",
          gradient: "from-blue-500 to-cyan-500",
        },
      ],
    },
    {
      title: "Support",
      icon: HelpCircle,
      gradient: "from-teal-500 to-ocean-500",
      items: [
        {
          icon: Shield,
          label: "Privacy Policy",
          description: "How we protect your data",
          type: "link",
          href: "#",
          gradient: "from-rose-500 to-pink-500",
        },
        {
          icon: HelpCircle,
          label: "Help Center",
          description: "Get help with your bookings",
          type: "link",
          href: "#",
          gradient: "from-amber-500 to-orange-500",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sand-50 via-ocean-50 to-teal-50 dark:from-ocean-950 dark:via-ocean-900 dark:to-teal-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-10 w-40 h-40 bg-amber-300/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-40 right-10 w-60 h-60 bg-teal-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-sunset-300/10 rounded-full blur-3xl animate-pulse-glow"></div>
      </div>

      <nav className="relative z-20 bg-white/80 dark:bg-ocean-900/80 backdrop-blur-2xl border-b border-sand-200/50 dark:border-ocean-700/50 sticky top-0">
        <div className="max-w-5xl mx-auto px-6 py-4">
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
                  <Sun className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800 dark:text-white">Settings</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Umbrella className="w-3 h-3" /> Your preferences
                  </p>
                </div>
              </div>
            </div>
            <GuestProfileDropdown guest={guest} />
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-sunset-500 to-amber-500 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-br from-sunset-100 to-amber-100 dark:from-sunset-900/30 dark:to-amber-900/30 rounded-2xl">
                <Waves className="w-8 h-8 text-sunset-500 mx-auto mb-2" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2">
              <Umbrella className="w-4 h-4 text-teal-500" />
              Customize your experience
            </p>
          </div>
          
          <div className="space-y-6">
            {settingsSections.map((section, sectionIndex) => (
              <div 
                key={sectionIndex} 
                className="bg-white/90 dark:bg-ocean-900/90 backdrop-blur-2xl rounded-3xl shadow-xl shadow-sand-200/30 dark:shadow-ocean-950/30 border border-white/50 dark:border-ocean-700/50 overflow-hidden"
              >
                <div className="p-5 border-b border-sand-100 dark:border-ocean-700 bg-gradient-to-r from-sand-50/50 to-ocean-50/50 dark:from-ocean-800/50 dark:to-ocean-700/50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 bg-gradient-to-br ${section.gradient} rounded-xl shadow-lg`}>
                      <section.icon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">{section.title}</h2>
                  </div>
                </div>
                
                <div className="divide-y divide-sand-100 dark:divide-ocean-700">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="p-5 flex items-center justify-between hover:bg-gradient-to-r hover:from-sand-50 hover:to-ocean-50 dark:hover:from-ocean-800 dark:hover:to-ocean-700 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg`}>
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-white group-hover:text-sunset-600 dark:group-hover:text-sunset-400 transition-colors">{item.label}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                        </div>
                      </div>
                      
                      {item.type === "toggle" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            item.onChange?.()
                          }}
                          className={`relative w-14 h-7.5 rounded-full transition-all duration-500 ${
                            item.value 
                              ? "bg-gradient-to-r from-sunset-500 to-amber-500 shadow-lg shadow-sunset-500/30" 
                              : "bg-sand-200 dark:bg-ocean-600"
                          }`}
                        >
                          <span
                            className={`absolute top-1 w-5.5 h-5.5 bg-white rounded-full shadow-lg transition-all duration-500 ${
                              item.value ? "left-7" : "left-1"
                            }`}
                          >
                            {item.value && (
                              <Check className="w-3 h-3 text-sunset-500 absolute top-1 left-1" />
                            )}
                          </span>
                        </button>
                      ) : (
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sand-100 dark:bg-ocean-800 text-slate-500 dark:text-slate-400 hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-300">
                          <span className="text-sm font-medium">{item.description}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-sand-100 to-ocean-100 dark:from-ocean-800 dark:to-ocean-700 rounded-2xl border border-sand-200 dark:border-ocean-600">
            <Umbrella className="w-5 h-5 text-sunset-500" />
            <div className="text-center">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Piel Lighthouse Resort</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                Version 1.0.0 • Made with <Sun className="w-3 h-3 text-amber-400 mx-1" /> for guests
              </p>
            </div>
            <Waves className="w-5 h-5 text-teal-500" />
          </div>
        </div>
      </main>
      
      <footer className="bg-white/60 dark:bg-ocean-900/60 backdrop-blur-xl border-t border-sand-200/50 dark:border-ocean-700/50 py-4 px-6 relative z-10 mt-auto">
        <div className="max-w-5xl mx-auto">
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
        </div>
      </footer>
    </div>
  )
}
