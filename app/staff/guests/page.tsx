"use client"

import { useEffect, useState } from "react"

interface Booking {
  _id: string
  guestName: string
  email: string
  phone: string
  checkIn: string
  checkOut: string
  roomType: string
  guests: number
  status: string
  specialRequests: string
}

interface GuestGroup {
  email: string
  name: string
  phone: string
  totalBookings: number
  lastVisit: string
  upcoming: boolean
  bookings: Booking[]
}

// Icons
const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const GuestsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const ChevronUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
)

const VisitIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
)

export default function StaffGuestsPage() {
  const [guests, setGuests] = useState<GuestGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [expandedGuest, setExpandedGuest] = useState<string | null>(null)

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await fetch("/api/admin/bookings")
        
        if (!response.ok) {
          throw new Error("Failed to fetch bookings")
        }
        
        const data = await response.json()
        const bookings: Booking[] = data.bookings || []

        // Group bookings by email
        const guestMap = new Map<string, GuestGroup>()

        bookings.forEach((booking) => {
          const existing = guestMap.get(booking.email)
          if (existing) {
            existing.bookings.push(booking)
            existing.totalBookings++
            if (new Date(booking.checkIn) > new Date(existing.lastVisit)) {
              existing.lastVisit = booking.checkIn
            }
            existing.upcoming = existing.upcoming || 
              (booking.status === "pending" || booking.status === "confirmed")
          } else {
            guestMap.set(booking.email, {
              email: booking.email,
              name: booking.guestName,
              phone: booking.phone,
              totalBookings: 1,
              lastVisit: booking.checkIn,
              upcoming: booking.status === "pending" || booking.status === "confirmed",
              bookings: [booking],
            })
          }
        })

        setGuests(Array.from(guestMap.values()))
      } catch (error) {
        console.error("Failed to fetch guests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGuests()
  }, [])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-700"
      case "confirmed":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700"
      case "completed":
        return "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600"
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700"
      default:
        return "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600"
    }
  }

  const filteredGuests = guests.filter(
    (g) =>
      (g.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (g.email?.toLowerCase() || "").includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48"></div>
        <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-64"></div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
          <div className="p-6">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-40 mb-6"></div>
          </div>
          <div className="space-y-4 px-6 pb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-slate-100 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Guest Information</h1>
          <p className="text-slate-500 dark:text-slate-300 mt-1">View and manage guest profiles and booking history</p>
        </div>
        {/* Search */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-300" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full lg:w-80 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
              <GuestsIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-300">Total Guests</div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{guests.length}</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl">
              <VisitIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-300">With Bookings</div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">
                {guests.filter(g => g.totalBookings > 0).length}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
              <CalendarIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-300">Upcoming Stays</div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">
                {guests.filter(g => g.upcoming).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guests Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
            <GuestsIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">All Guests</h2>
            <p className="text-sm text-slate-500 dark:text-slate-300">{filteredGuests.length} guests found</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Guest</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Total Visits</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Last Visit</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredGuests.map((guest, index) => (
                <tr
                  key={guest.email}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-amber-800">
                          {guest.name?.charAt(0).toUpperCase() || "?"}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-white">{guest.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <MailIcon className="w-4 h-4 text-slate-400 dark:text-slate-300" />
                      {guest.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300 mt-1">
                      <PhoneIcon className="w-4 h-4 text-slate-400 dark:text-slate-300" />
                      {guest.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{guest.totalBookings}</span>
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-300">visits</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {formatDate(guest.lastVisit)}
                  </td>
                  <td className="px-6 py-4">
                    {guest.upcoming ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Upcoming Stay
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                        No Upcoming
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setExpandedGuest(expandedGuest === guest.email ? null : guest.email)}
                      className="group flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
                    >
                      {expandedGuest === guest.email ? (
                        <>
                          <span>Hide Bookings</span>
                          <ChevronUpIcon className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                        </>
                      ) : (
                        <>
                          <span>View Bookings</span>
                          <ChevronDownIcon className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {expandedGuest && (
                <tr className="bg-slate-50 dark:bg-slate-700/50">
                  <td colSpan={6} className="px-6 py-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 p-6 animate-fade-in">
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-amber-600" />
                        Booking History for {filteredGuests.find(g => g.email === expandedGuest)?.name}
                      </h4>
                      <div className="space-y-3">
                        {filteredGuests
                          .find(g => g.email === expandedGuest)
                          ?.bookings.slice(0, 5)
                          .map((booking) => (
                            <div
                              key={booking._id}
                              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-600">
                                  <CalendarIcon className="w-5 h-5 text-slate-400 dark:text-slate-300" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-slate-800 dark:text-white">
                                    {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                                  </div>
                                  <div className="text-xs text-slate-500 dark:text-slate-300">{booking.roomType}</div>
                                </div>
                              </div>
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredGuests.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <GuestsIcon className="w-8 h-8 text-slate-400 dark:text-slate-300" />
            </div>
            <div className="text-slate-500 dark:text-slate-300">No guests found</div>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 text-amber-600 hover:text-amber-700 font-medium text-sm"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}







