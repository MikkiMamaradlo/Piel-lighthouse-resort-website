"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { ThemeProvider } from "@/components/theme-provider"
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
  Users,
  Sun
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-50 via-sky-50 to-ocean-100 dark:from-ocean-950 dark:via-ocean-900 dark:to-ocean-950">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-ocean-400/30 rounded-2xl blur-xl animate-pulse"></div>
              <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-ocean-500 to-ocean-600 rounded-2xl shadow-lg shadow-ocean-500/30">
                <Ship className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-ocean-700 dark:text-ocean-300 mt-4 font-medium animate-fade-in">Loading admin panel...</p>
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
      <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-sky-50 to-ocean-100 dark:from-ocean-950 dark:via-ocean-900 dark:to-ocean-950 bg-[url('/images/piel1.jpg')] bg-cover bg-center bg-fixed bg-no-repeat">
        <div className="min-h-screen bg-white/90 dark:bg-ocean-950/90 backdrop-blur-xl">
          {/* Mobile menu overlay */}
          {mobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-ocean-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity animate-fade-in"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`fixed top-0 left-0 h-full bg-white/95 dark:bg-ocean-900/95 backdrop-blur-2xl border-r border-ocean-100 dark:border-ocean-800 shadow-xl z-50 transition-all duration-300 ${sidebarOpen ? "w-72" : "w-20"} ${
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
          >
            {/* Logo */}
            <div className="flex items-center justify-between p-5 border-b border-ocean-100/50 dark:border-ocean-700/50 bg-gradient-to-r from-ocean-600 via-ocean-500 to-teal-500">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ring-1 ring-white/30">
                  <Ship className="w-7 h-7 text-white drop-shadow-md" />
                </div>
                {sidebarOpen && (
                  <div className="text-white animate-fade-in-left">
                    <h1 className="font-bold text-lg tracking-tight">Piel Lighthouse</h1>
                    <p className="text-xs text-white/80 flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
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
            <nav className="p-4 space-y-1.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-ocean-600 to-ocean-500 text-white shadow-lg shadow-ocean-500/30"
                        : "text-ocean-700 dark:text-ocean-200 hover:bg-ocean-50 dark:hover:bg-ocean-800 hover:text-ocean-900 dark:hover:text-white"
                    }`}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-white rounded-r-full shadow-lg animate-slide-up" />
                    )}
                    <div className={`relative p-2.5 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? "bg-white/20" 
                        : "bg-ocean-100 dark:bg-ocean-800 group-hover:bg-ocean-200 dark:group-hover:bg-ocean-700"
                    }`}>
                      <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : "text-ocean-600 dark:text-ocean-400 group-hover:text-ocean-700 dark:group-hover:text-amber-400"}`} />
                    </div>
                    {sidebarOpen && (
                      <>
                        <span className="font-semibold">{item.label}</span>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-lg animate-pulse" />
                        )}
                      </>
                    )}
                    {/* Hover tooltip for collapsed state */}
                    {!sidebarOpen && (
                      <div className="absolute left-full ml-3 px-3 py-2 bg-ocean-900 dark:bg-ocean-700 text-white dark:text-ocean-200 text-sm font-medium rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl whitespace-nowrap z-50 animate-fade-in-left">
                        {item.label}
                        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-ocean-900 dark:bg-ocean-700 rounded-sm rotate-45" />
                      </div>
                    )}
                  </Link>
                )
              })}
            </nav>
          </aside>

          {/* Main content */}
          <div
            className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-72" : "lg:ml-20"}`}
          >
            {/* Top bar */}
            <header className="bg-white/80 dark:bg-ocean-900/80 backdrop-blur-2xl border-b border-ocean-100 dark:border-ocean-800 sticky top-0 z-30 shadow-sm">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="hidden lg:flex p-2.5 hover:bg-ocean-50 dark:hover:bg-ocean-800 rounded-xl transition-all duration-300 group"
                  >
                    <ChevronLeft
                      className={`w-5 h-5 text-muted-foreground transition-all duration-300 ${!sidebarOpen ? "rotate-180" : ""} group-hover:text-ocean-500 group-hover:scale-110`}
                    />
                  </button>
                  <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="lg:hidden p-2.5 hover:bg-ocean-50 dark:hover:bg-ocean-800 rounded-xl transition-all duration-300"
                  >
                    <Menu className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <div className="relative">
                    <h2 className="text-xl font-bold text-card-foreground">
                      {navItems.find((item) => item.href === pathname)?.label || "Admin"}
                    </h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-ocean-50 dark:hover:bg-ocean-800 rounded-xl transition-all duration-300 hover:shadow-md"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="hidden sm:inline">Website</span>
                  </a>
                  <div className="relative group">
                    <div className="w-11 h-11 bg-gradient-to-br from-ocean-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg shadow-ocean-500/30 ring-2 ring-white dark:ring-ocean-700 transition-transform duration-300 group-hover:scale-105">
                      A
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-teal-500 border-2 border-white dark:ring-ocean-700 rounded-full" />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-ocean-50 dark:hover:bg-ocean-800 rounded-xl transition-all duration-300 hover:shadow-md"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </div>
            </header>

            {/* Page content */}
            <main className="p-6 dark:bg-ocean-950">{children}</main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}







