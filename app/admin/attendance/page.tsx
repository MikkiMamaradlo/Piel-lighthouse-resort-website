"use client"

import { useEffect, useState } from "react"
import {
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  Search,
  Filter,
  RefreshCw
} from "lucide-react"

interface AttendanceRecord {
  _id: string
  staffId: string
  staffName: string
  date: string
  clockIn: string | null
  clockOut: string | null
  status: "present" | "absent" | "late" | "on-leave"
  hoursWorked: number | null
}

interface AttendanceStats {
  total: number
  present: number
  late: number
  absent: number
  onLeave: number
}

export default function AdminAttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [stats, setStats] = useState<AttendanceStats>({
    total: 0,
    present: 0,
    late: 0,
    absent: 0,
    onLeave: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchAttendance()
  }, [selectedDate])

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/attendance?date=${selectedDate}`)
      const data = await response.json()
      
      if (data.success) {
        setAttendance(data.attendance)
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching attendance:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAttendance = attendance.filter((record) => {
    const matchesSearch = record.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.staffId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            <CheckCircle className="w-3 h-3" />
            Present
          </span>
        )
      case "late":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
            <AlertCircle className="w-3 h-3" />
            Late
          </span>
        )
      case "absent":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            <XCircle className="w-3 h-3" />
            Absent
          </span>
        )
      case "on-leave":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            <Calendar className="w-3 h-3" />
            On Leave
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 rounded-full text-sm">
            {status}
          </span>
        )
    }
  }

  const formatTime = (time: string | null) => {
    if (!time) return "-"
    return time
  }

  const isLate = (clockIn: string | null) => {
    if (!clockIn) return false
    const [hours] = clockIn.split(":").map(Number)
    return hours > 8 || (hours === 8 && parseInt(clockIn.split(":")[1]) > 0)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Staff Attendance Monitor</h1>
          <p className="text-slate-500 mt-1">Track and monitor staff attendance</p>
        </div>
        <button
          onClick={fetchAttendance}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Present</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.present}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Late</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.late}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Absent</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.absent}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or staff ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white dark:bg-slate-800"
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-slate-500 dark:text-slate-400">Loading attendance data...</p>
          </div>
        ) : filteredAttendance.length === 0 ? (
          <div className="p-8 text-center">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No attendance records found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or date</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">Staff Member</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">Clock In</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">Clock Out</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">Hours Worked</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((record) => (
                  <tr key={record._id} className="border-b border-slate-50 hover:bg-slate-50 dark:bg-slate-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          record.status === "late" ? "bg-amber-100" :
                          record.status === "absent" ? "bg-red-100" :
                          record.status === "present" ? "bg-green-100" : "bg-blue-100"
                        }`}>
                          <span className={`font-medium ${
                            record.status === "late" ? "text-amber-600" :
                            record.status === "absent" ? "text-red-600" :
                            record.status === "present" ? "text-green-600" : "text-blue-600"
                          }`}>
                            {record.staffName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-slate-900 dark:text-white">{record.staffName}</span>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{record.staffId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400 dark:text-slate-400" />
                        <span className={`${
                          record.clockIn && isLate(record.clockIn) ? "text-amber-600 font-medium" : "text-slate-900 dark:text-white"
                        }`}>
                          {formatTime(record.clockIn)}
                        </span>
                        {record.clockIn && isLate(record.clockIn) && (
                          <span className="text-xs text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
                            Late
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400 dark:text-slate-400" />
                        <span className="text-slate-900 dark:text-white">
                          {formatTime(record.clockOut)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${
                        record.hoursWorked && record.hoursWorked >= 8 ? "text-green-600" :
                        record.hoursWorked && record.hoursWorked < 4 ? "text-red-600" : "text-slate-900 dark:text-white"
                      }`}>
                        {record.hoursWorked ? `${record.hoursWorked}h` : "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(record.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center gap-2 text-blue-800">
          <Clock className="w-5 h-5" />
          <span className="font-medium">Late Policy:</span>
          <span className="text-blue-700">
            Staff are expected to clock in by 8:00 AM. Clocking in after this time will be marked as "Late".
          </span>
        </div>
      </div>
    </div>
  )
}
