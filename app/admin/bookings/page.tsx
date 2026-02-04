"use client"

import { useEffect, useState } from "react"
import {
  CalendarCheck,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  Users
} from "lucide-react"

interface Booking {
  _id: string
  name: string
  email: string
  phone: string
  checkIn: string
  checkOut: string
  guests: number
  roomType: string
  roomId?: string
  message: string
  createdAt: string
  status: "pending" | "confirmed" | "cancelled"
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [statusFilter])

  const fetchBookings = async () => {
    try {
      const url = statusFilter === "all" 
        ? "/api/admin/bookings" 
        : `/api/admin/bookings?status=${statusFilter}`
      const response = await fetch(url)
      const data = await response.json()
      setBookings(data.bookings || [])
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: "confirmed" | "cancelled", booking?: Booking) => {
    try {
      await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id, 
          status,
          roomId: booking?.roomId || "",
          roomType: booking?.roomType || "",
          checkIn: booking?.checkIn || "",
          checkOut: booking?.checkOut || "",
          guestName: booking?.name || ""
        }),
      })
      fetchBookings()
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const deleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return
    
    try {
      await fetch(`/api/admin/bookings?id=${id}`, { method: "DELETE" })
      fetchBookings()
    } catch (error) {
      console.error("Failed to delete booking:", error)
    }
  }

  const filteredBookings = bookings.filter((booking) =>
    booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.phone.includes(searchTerm)
  )

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-amber-100 text-amber-700 border border-amber-200",
      confirmed: "bg-green-100 text-green-700 border border-green-200",
      cancelled: "bg-red-100 text-red-700 border border-red-200",
    }
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      cancelled: XCircle,
    }
    const Icon = icons[status as keyof typeof icons]
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        <Icon className="w-3.5 h-3.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
          <p className="text-slate-500 mt-1">Manage reservation requests from guests</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium">
            {filteredBookings.length} booking{filteredBookings.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-12 pr-8 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-blue-500 transition-all appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-slate-500">Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarCheck className="w-10 h-10 text-slate-400" />
          </div>
          <p className="text-slate-500 text-lg font-medium">No bookings found</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Guest</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Dates</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Room</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/25">
                          {booking.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{booking.name}</p>
                          <p className="text-sm text-slate-500">{booking.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-slate-900 font-medium">{booking.checkIn} → {booking.checkOut}</p>
                          <p className="text-slate-500">{booking.guests} guests</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-900 font-medium bg-slate-100 px-3 py-1.5 rounded-lg">
                        {booking.roomType || "Not specified"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() => updateStatus(booking._id, "confirmed", booking)}
                              className="p-2.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-xl transition-colors"
                              title="Confirm"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => updateStatus(booking._id, "cancelled", booking)}
                              className="p-2.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl transition-colors"
                              title="Cancel"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <button
                            onClick={() => updateStatus(booking._id, "cancelled", booking)}
                            className="p-2.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl transition-colors"
                            title="Cancel"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-xl transition-colors"
                          title="View Details"
                        >
                          <Clock className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteBooking(booking._id)}
                          className="p-2.5 bg-slate-100 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Booking Details</h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <XCircle className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/25">
                  {selectedBooking.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{selectedBooking.name}</h3>
                  {getStatusBadge(selectedBooking.status)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <CalendarCheck className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Check-in</span>
                  </div>
                  <p className="font-semibold text-slate-900">{selectedBooking.checkIn}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <CalendarCheck className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Check-out</span>
                  </div>
                  <p className="font-semibold text-slate-900">{selectedBooking.checkOut}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Guests</span>
                </div>
                <p className="font-semibold text-slate-900">{selectedBooking.guests} guests</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <span>{selectedBooking.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <span>{selectedBooking.phone || "Not provided"}</span>
                </div>
              </div>

              {selectedBooking.message && (
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <p className="text-xs font-semibold text-blue-900 mb-1 uppercase tracking-wider">Message</p>
                  <p className="text-slate-700">{selectedBooking.message}</p>
                </div>
              )}

              <div className="text-sm text-slate-500">
                Booked on {new Date(selectedBooking.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              {selectedBooking.status === "pending" && (
                <>
                  <button
                    onClick={() => {
                      updateStatus(selectedBooking._id, "confirmed", selectedBooking)
                      setSelectedBooking(null)
                    }}
                    className="flex-1 py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-500/25"
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => {
                      updateStatus(selectedBooking._id, "cancelled", selectedBooking)
                      setSelectedBooking(null)
                    }}
                    className="flex-1 py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-500/25"
                  >
                    Cancel Booking
                  </button>
                </>
              )}
              {selectedBooking.status === "confirmed" && (
                <button
                  onClick={() => {
                    updateStatus(selectedBooking._id, "cancelled", selectedBooking)
                    setSelectedBooking(null)
                  }}
                  className="flex-1 py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-500/25"
                >
                  Cancel Booking
                </button>
              )}
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
