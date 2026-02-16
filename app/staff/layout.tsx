"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Ship, Sun, Waves, LogOut, ChevronLeft, ChevronRight } from "lucide-react"

interface User {
  id: string
  username: string
  email: string
  fullName: string
  role: string
  department: string
}

// Icon components for sidebar navigation
const DashboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
)

const BookingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const RoomsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const GuestsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const AttendanceIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

const LogoIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C9.24 2 7 4.24 7 7v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V7c0-2.76-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3v3H9V7c0-1.66 1.34-3 3-3zm0 10c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4-6v4c0 1.1-.9 2-2 2h-4v-8h4z"/>
  </svg>
)

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  department?: string[]
}

// Navigation items for each department
const departmentNavItems: Record<string, NavItem[]> = {
  "Front Desk": [
    { href: "/staff", label: "Dashboard", icon: DashboardIcon },
    { href: "/staff/bookings", label: "Bookings", icon: BookingsIcon },
    { href: "/staff/guests", label: "Guest Info", icon: GuestsIcon },
    { href: "/staff/rooms", label: "Rooms", icon: RoomsIcon },
    { href: "/staff/attendance", label: "Attendance", icon: AttendanceIcon },
  ],
  "Housekeeping": [
    { href: "/staff", label: "Dashboard", icon: DashboardIcon },
    { href: "/staff/rooms", label: "Room Status", icon: RoomsIcon },
    { href: "/staff/attendance", label: "Attendance", icon: AttendanceIcon },
  ],
  "Food & Beverage": [
    { href: "/staff", label: "Dashboard", icon: DashboardIcon },
    { href: "/staff/guests", label: "Guest Info", icon: GuestsIcon },
    { href: "/staff/attendance", label: "Attendance", icon: AttendanceIcon },
  ],
  "Maintenance": [
    { href: "/staff", label: "Dashboard", icon: DashboardIcon },
    { href: "/staff/rooms", label: "Room Status", icon: RoomsIcon },
    { href: "/staff/attendance", label: "Attendance", icon: AttendanceIcon },
  ],
  "Activities": [
    { href: "/staff", label: "Dashboard", icon: DashboardIcon },
    { href: "/staff/bookings", label: "Bookings", icon: BookingsIcon },
    { href: "/staff/guests", label: "Guest Info", icon: GuestsIcon },
    { href: "/staff/attendance", label: "Attendance", icon: AttendanceIcon },
  ],
  "Management": [
    { href: "/staff", label: "Dashboard", icon: DashboardIcon },
    { href: "/staff/bookings", label: "Bookings", icon: BookingsIcon },
    { href: "/staff/rooms", label: "Rooms", icon: RoomsIcon },
    { href: "/staff/guests", label: "Guest Info", icon: GuestsIcon },
    { href: "/staff/attendance", label: "Attendance", icon: AttendanceIcon },
  ],
  "General": [
    { href: "/staff", label: "Dashboard", icon: DashboardIcon },
    { href: "/staff/bookings", label: "Bookings", icon: BookingsIcon },
    { href: "/staff/rooms", label: "Rooms", icon: RoomsIcon },
    { href: "/staff/guests", label: "Guest Info", icon: GuestsIcon },
    { href: "/staff/attendance", label: "Attendance", icon: AttendanceIcon },
  ],
}

// Role display names
const roleDisplayNames: Record<string, string> = {
  "front_desk_agent": "Front Desk Agent",
  "front_desk_supervisor": "Front Desk Supervisor",
  "front_desk_manager": "Front Desk Manager",
  "housekeeper": "Housekeeper",
  "housekeeping_supervisor": "Housekeeping Supervisor",
  "housekeeping_manager": "Housekeeping Manager",
  "server": "Server",
  "bartender": "Bartender",
  "fnb_supervisor": "F&B Supervisor",
  "fnb_manager": "F&B Manager",
  "maintenance_technician": "Maintenance Technician",
  "maintenance_supervisor": "Maintenance Supervisor",
  "maintenance_manager": "Maintenance Manager",
  "activity_guide": "Activity Guide",
  "activities_supervisor": "Activities Supervisor",
  "activities_manager": "Activities Manager",
  "general_manager": "General Manager",
  "assistant_manager": "Assistant Manager",
  "staff": "Staff",
  "manager": "Manager",
  "admin": "Admin",
}

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  const isLoginPage = pathname === "/staff/login"
  const isRegisterPage = pathname === "/staff/register"
  const isPublicPage = isLoginPage || isRegisterPage

  // Get navigation items based on user's department
  const getNavItems = () => {
    if (!user) return []
    return departmentNavItems[user.department] || departmentNavItems["General"]
  }

  // Set portal theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-portal', 'staff')
    return () => document.documentElement.removeAttribute('data-portal')
  }, [])

  useEffect(() => {
    if (isPublicPage) {
      setLoading(false)
      return
    }

    const checkAuth = async () => {
      try {
        // First check if admin is logged in (block admin from staff)
        const adminAuth = document.cookie.split('; ').find(row => row.startsWith('admin_auth='))
        if (adminAuth) {
          router.push("/admin")
          return
        }

        const response = await fetch("/api/staff/auth/check")
        const data = await response.json()

        if (data.authenticated && data.user) {
          setUser(data.user)
        } else {
          router.push("/staff/login")
        }
      } catch {
        router.push("/staff/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [isPublicPage])

  // Update current time every minute
  useEffect(() => {
    if (isPublicPage) return
    
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    
    return () => clearInterval(timer)
  }, [isPublicPage])

  const handleLogout = async () => {
    await fetch("/api/staff/auth", { method: "DELETE" })
    router.push("/staff/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-jade-50 via-jade-100 to-jade-50 dark:from-jade-950 dark:via-jade-900 dark:to-jade-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-jade-400/30 rounded-2xl blur-xl animate-pulse"></div>
            <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-jade-400 to-jade-500 rounded-2xl shadow-lg shadow-jade-500/30">
              <Ship className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="text-jade-700 dark:text-jade-300 font-medium animate-fade-in">Loading Staff Portal...</div>
        </div>
      </div>
    )
  }

  if (isPublicPage) {
    return <>{children}</>
  }

  if (!user) {
    return null
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
  }

  const navItems = getNavItems()
  const roleDisplayName = roleDisplayNames[user.role] || user.role

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
    <div className="min-h-screen bg-gradient-to-br from-jade-50 via-jade-100 to-jade-50 dark:from-jade-950 dark:via-jade-900 dark:to-jade-950 bg-[url('/images/piel2.jpg')] bg-cover bg-center bg-fixed bg-no-repeat">
      <div className="min-h-screen bg-white/90 dark:bg-jade-950/90 backdrop-blur-xl">
        {/* Top Navigation */}
        <nav className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-jade-700 via-jade-600 to-emerald-600 text-white shadow-lg z-50">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg">
                  <Ship className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-lg font-bold text-white">Piel Lighthouse Resort</div>
                  <div className="text-xs text-jade-200 font-medium flex items-center gap-1">
                    <Sun className="w-3 h-3 animate-pulse" />
                    Staff Portal
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:block text-right">
                <div className="text-sm text-white/70 dark:text-white/70">{formatDate(currentTime)}</div>
                <div className="text-lg font-semibold text-white">{formatTime(currentTime)}</div>
              </div>
              
              <div className="flex items-center gap-3 pl-6 border-l border-white/20">
                <ThemeToggle />
                <div className="w-10 h-10 bg-gradient-to-br from-jade-400 to-jade-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/20">
                  <span className="text-white font-bold text-sm">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-white">{user.fullName || user.username}</div>
                  <div className="text-xs text-white/70">{roleDisplayName}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 hover:bg-white/10 rounded-xl transition-colors group"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-white/80 group-hover:text-jade-300 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex pt-16">
          {/* Sidebar */}
          <aside
            className={`fixed left-0 top-16 bottom-0 bg-white/95 dark:bg-jade-900/95 backdrop-blur-2xl shadow-2xl transition-all duration-300 z-40 border-r border-jade-100 dark:border-jade-800 ${
              isSidebarCollapsed ? "w-20" : "w-64"
            } ${isSidebarCollapsed ? "lg:w-20" : "lg:w-64"}`}
          >
            <div className="flex flex-col h-full py-6">
              <nav className="flex-1 px-3 space-y-1.5">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-jade-500 to-jade-600 text-white shadow-lg shadow-jade-500/30"
                          : "text-jade-700 dark:text-jade-200 hover:bg-jade-50 dark:hover:bg-jade-800 hover:text-jade-900 dark:hover:text-white"
                      }`}
                      title={isSidebarCollapsed ? item.label : undefined}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-white rounded-r-full shadow-lg animate-slide-up" />
                      )}
                      <div className={`relative p-2.5 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? "bg-white/20" 
                          : "bg-jade-100 dark:bg-jade-800 group-hover:bg-jade-200 dark:group-hover:bg-jade-700"
                      }`}>
                        <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : "text-muted-foreground group-hover:text-jade-500"}`} />
                      </div>
                      <span className={`font-semibold transition-all duration-200 ${isSidebarCollapsed ? "lg:hidden opacity-0 w-0" : ""}`}>
                        {item.label}
                      </span>
                      {isActive && !isSidebarCollapsed && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-lg animate-pulse" />
                      )}
                      {/* Hover tooltip for collapsed state */}
                      {isSidebarCollapsed && (
                        <div className="absolute left-full ml-3 px-3 py-2 bg-jade-900 dark:bg-jade-700 text-white text-sm font-semibold rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl whitespace-nowrap z-50 animate-fade-in-left">
                          {item.label}
                          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-jade-900 dark:bg-jade-700 rounded-sm rotate-45" />
                        </div>
                      )}
                    </Link>
                  )
                })}
              </nav>

              {/* Collapse Toggle */}
              <div className="px-3 mt-auto">
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-muted-foreground hover:bg-jade-50 dark:hover:bg-jade-800 rounded-xl transition-all duration-300 group"
                >
                  <div className="p-2.5 rounded-xl bg-jade-100 dark:bg-jade-800 group-hover:bg-jade-200 dark:group-hover:bg-jade-700 transition-all duration-300">
                    {isSidebarCollapsed ? (
                      <ChevronRight className="w-5 h-5 transition-transform duration-300" />
                    ) : (
                      <ChevronLeft className="w-5 h-5 transition-transform duration-300" />
                    )}
                  </div>
                  <span className={`text-sm font-semibold transition-all duration-200 ${isSidebarCollapsed ? "lg:hidden opacity-0 w-0" : ""}`}>
                    Collapse
                  </span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main
            className={`flex-1 transition-all duration-300 ${
              isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
            }`}
          >
            <div className="p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
    </ThemeProvider>
  )
}







