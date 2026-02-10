"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  LayoutDashboard,
  CalendarCheck,
  BedDouble,
  Image,
  MessageSquareQuote,
  MapPin,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Ship,
  Sparkles,
  Clock,
  Users
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/staff", label: "Staff", icon: Users },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/attendance", label: "Attendance", icon: Clock },
  { href: "/admin/accommodations", label: "Rooms", icon: BedDouble },
  { href: "/admin/activities", label: "Activities", icon: MapPin },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/testimonials", label: "Reviews", icon: MessageSquareQuote },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        // is logged in ( First check if staffblock staff from admin)
        const staffAuth = document.cookie.split('; ').find(row => row.startsWith('staff_auth='))
        if (staffAuth) {
          router.push("/staff")
          return
        }

        const response = await fetch("/api/admin/auth/check")
        const data = await response.json()
        
        if (!data.authenticated) {
          router.push("/admin/login")
        } else {
          setIsAuthenticated(true)
        }
      } catch {
        router.push("/admin/login")
      } finally {
        setLoading(false)
      }
    }

    // Skip auth check for login page
    if (pathname !== "/admin/login") {
      checkAuth()
    } else {
      setLoading(false)
    }
  }, [pathname])

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" })
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full dark:border-blue-800" />
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin dark:border-blue-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-4 font-medium">Loading admin panel...</p>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  // Don't render layout for login page
  if (pathname === "/admin/login") {
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-[url('/images/piel1.jpg')] bg-cover bg-center bg-fixed">
        <div className="min-h-screen bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          {/* Mobile menu overlay */}
          {mobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`fixed top-0 left-0 h-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700 shadow-2xl z-50 transition-all duration-300 ${sidebarOpen ? "w-72" : "w-20"} ${
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
          >
            {/* Logo */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100/50 dark:border-slate-700/50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ring-1 ring-white/30">
                  <Ship className="w-7 h-7 text-white drop-shadow-md" />
                </div>
                {sidebarOpen && (
                  <div className="text-white">
                    <h1 className="font-bold text-lg tracking-tight text-shadow">Piel Lighthouse</h1>
                    <p className="text-xs text-white/80 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      Admin Portal
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden p-2.5 hover:bg-white/10 rounded-xl text-white/80 hover:text-white transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg" />
                    )}
                    <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? "bg-white/20" 
                        : "bg-slate-100 dark:bg-slate-700 group-hover:bg-slate-200 dark:group-hover:bg-slate-600"
                    }`}>
                      <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-amber-400"}`} />
                    </div>
                    {sidebarOpen && (
                      <>
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-lg animate-pulse" />
                        )}
                      </>
                    )}
                    {/* Hover tooltip for collapsed state */}
                    {!sidebarOpen && (
                      <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white dark:text-slate-200 text-sm font-medium rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl whitespace-nowrap z-50">
                        {item.label}
                        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-700 rounded-sm rotate-45" />
                      </div>
                    )}
                  </Link>
                )
              })}
            </nav>
          </aside>

          {/* Main content */}
          <div
            className={`transition-all duration-300 ${
              sidebarOpen ? "lg:ml-72" : "lg:ml-20"
            }`}
          >
            {/* Top bar */}
            <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 shadow-sm">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="hidden lg:flex p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-300 group"
                  >
                    <ChevronLeft
                      className={`w-5 h-5 text-slate-600 dark:text-slate-400 transition-all duration-300 ${!sidebarOpen ? "rotate-180" : ""} group-hover:text-blue-600 dark:group-hover:text-amber-400 group-hover:scale-110`}
                    />
                  </button>
                  <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="lg:hidden p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-300"
                  >
                    <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                  <div className="relative">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {navItems.find((item) => item.href === pathname)?.label || "Admin"}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all duration-300 hover:shadow-md"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="hidden sm:inline">Website</span>
                  </a>
                  <ThemeToggle />
                  <div className="relative group">
                    <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/30 ring-2 ring-white dark:ring-slate-700 transition-transform duration-300 group-hover:scale-105">
                      A
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-700 rounded-full" />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-300 hover:shadow-md"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </div>
            </header>

            {/* Page content */}
            <main className="p-6 dark:bg-slate-900">{children}</main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
