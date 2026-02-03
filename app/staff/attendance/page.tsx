"use client"

import { useEffect, useState } from "react"

interface AttendanceRecord {
  _id?: string
  staffId: string
  staffName: string
  date: string
  clockIn: string | null
  clockOut: string | null
  status: "present" | "absent" | "late" | "on-leave"
  hoursWorked: number | null
}

// Icons
const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

export default function StaffAttendancePage() {
  const [user, setUser] = useState<{
    id: string
    username: string
    fullName: string
    email: string
    role: string
    department: string
  } | null>(null)
  const [currentRecord, setCurrentRecord] = useState<AttendanceRecord | null>(null)
  const [history, setHistory] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    checkAuthAndFetchAttendance()
  }, [])

  const checkAuthAndFetchAttendance = async () => {
    try {
      const authResponse = await fetch("/api/staff/auth/check")
      const authData = await authResponse.json()

      if (!authData.authenticated) {
        // Redirect to login if not authenticated
        window.location.href = "/staff/login"
        return
      }

      setUser(authData.user)
      await fetchAttendance(authData.user.id)
    } catch (error) {
      console.error("Failed to check auth:", error)
      window.location.href = "/staff/login"
    } finally {
      setLoading(false)
    }
  }

  const fetchAttendance = async (staffId: string) => {
    try {
      const response = await fetch(`/api/staff/attendance?staffId=${staffId}`)
      if (response.ok) {
        const data = await response.json()
        const records = data.attendance || []
        setHistory(records)

        // Check if already clocked in today
        const today = new Date().toISOString().split("T")[0]
        const todayRecord = records.find((r: AttendanceRecord) => r.date === today)
        setCurrentRecord(todayRecord || null)
      }
    } catch (error) {
      console.error("Failed to fetch attendance:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClockIn = async () => {
    if (!user) return
    setActionLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/staff/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId: user.id, staffName: user.fullName, action: "clock-in" }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: "Clocked in successfully! Have a great day!" })
        fetchAttendance(user?.id)
      } else {
        setMessage({ type: "error", text: data.error || "Failed to clock in" })
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred. Please try again." })
    } finally {
      setActionLoading(false)
    }
  }

  const handleClockOut = async () => {
    if (!user) return
    setActionLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/staff/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId: user.id, staffName: user.fullName, action: "clock-out" }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: "Clocked out successfully! See you tomorrow!" })
        fetchAttendance(user?.id)
      } else {
        setMessage({ type: "error", text: data.error || "Failed to clock out" })
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred. Please try again." })
    } finally {
      setActionLoading(false)
    }
  }

  const formatTime = (time: string | null) => {
    if (!time) return "--:--"
    return new Date(time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-700 border-green-200"
      case "late":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "absent":
        return "bg-red-100 text-red-700 border-red-200"
      case "on-leave":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckIcon className="w-3 h-3" />
      case "late":
        return <ClockIcon className="w-3 h-3" />
      case "absent":
        return <LogoutIcon className="w-3 h-3" />
      case "on-leave":
        return <CalendarIcon className="w-3 h-3" />
      default:
        return null
    }
  }

  const canClockIn = !currentRecord?.clockIn
  const canClockOut = currentRecord?.clockIn && !currentRecord?.clockOut

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-40"></div>
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="h-32 bg-slate-100 rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-4 bg-slate-200 rounded w-20 mb-4"></div>
              <div className="h-8 bg-slate-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Calculate stats
  const thisWeekPresent = history.filter(r => r.status !== "absent").length
  const totalPresent = history.filter(r => r.status === "present").length
  const totalLate = history.filter(r => r.status === "late").length
  const totalHours = history.reduce((sum, r) => sum + (r.hoursWorked || 0), 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Attendance</h1>
          <p className="text-slate-500 mt-1">Track your work hours and attendance</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <CalendarIcon className="w-4 h-4" />
          <span>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-xl border animate-fade-in-up ${
          message.type === "success" 
            ? "bg-green-50 border-green-200 text-green-700" 
            : "bg-red-50 border-red-200 text-red-700"
        }`}>
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckIcon className="w-5 h-5" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        </div>
      )}

      {/* Clock In/Out Card */}
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg p-8 border border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`p-4 rounded-2xl ${
              currentRecord?.clockIn ? "bg-green-100" : "bg-slate-100"
            }`}>
              <ClockIcon className={`w-8 h-8 ${
                currentRecord?.clockIn ? "text-green-600" : "text-slate-400"
              }`} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Today's Status</h2>
              <div className="space-y-1">
                {currentRecord?.clockIn ? (
                  <>
                    <p className="text-green-600 font-medium flex items-center gap-2">
                      <CheckIcon className="w-4 h-4" />
                      Clocked in at {formatTime(currentRecord.clockIn)}
                    </p>
                    {currentRecord?.clockOut && (
                      <p className="text-slate-500 flex items-center gap-2">
                        <LogoutIcon className="w-4 h-4" />
                        Clocked out at {formatTime(currentRecord.clockOut)}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-slate-500">Not clocked in yet</p>
                )}
                {!currentRecord && (
                  <p className="text-slate-400 text-sm">No record for today</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleClockIn}
              disabled={!canClockIn || actionLoading}
              className={`group relative px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                canClockIn
                  ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-1"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {actionLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    Clock In
                  </>
                )}
              </div>
            </button>

            <button
              onClick={handleClockOut}
              disabled={!canClockOut || actionLoading}
              className={`group relative px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                canClockOut
                  ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-1"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {actionLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogoutIcon className="w-5 h-5" />
                    Clock Out
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "This Week", value: thisWeekPresent, color: "from-blue-500 to-blue-600", bgColor: "bg-blue-50", textColor: "text-blue-600" },
          { label: "Present", value: totalPresent, color: "from-green-500 to-green-600", bgColor: "bg-green-50", textColor: "text-green-600" },
          { label: "Late", value: totalLate, color: "from-amber-500 to-amber-600", bgColor: "bg-amber-50", textColor: "text-amber-600" },
          { label: "Total Hours", value: `${totalHours.toFixed(1)}h`, color: "from-slate-500 to-slate-600", bgColor: "bg-slate-50", textColor: "text-slate-600" },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-slate-100"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`inline-flex p-3 rounded-xl ${stat.bgColor} mb-4`}>
              <div className={`w-6 h-6 bg-gradient-to-br ${stat.color} rounded-lg`}></div>
            </div>
            <div className={`text-sm ${stat.textColor} font-medium mb-1`}>{stat.label}</div>
            <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* History */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
            <CalendarIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Attendance History</h2>
            <p className="text-sm text-slate-500">Your recent attendance records</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Clock In</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Clock Out</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Hours</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.slice(0, 10).map((record, index) => (
                <tr
                  key={index}
                  className="hover:bg-slate-50/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{formatDate(record.date)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{formatTime(record.clockIn)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{formatTime(record.clockOut)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {record.hoursWorked ? `${record.hoursWorked}h` : "--"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {history.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-slate-400" />
            </div>
            <div className="text-slate-500">No attendance records found</div>
          </div>
        )}
      </div>
    </div>
  )
}
