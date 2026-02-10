"use client"

import { useEffect, useState } from "react"

interface Room {
  _id: string
  name: string
  capacity: string
  image: string
  price: string
  period: string
  popular: boolean
  features: string[]
  description: string
  order: number
  status?: string
  currentBookingId?: string
  currentGuestName?: string
  currentCheckIn?: string
  currentCheckOut?: string
}

// Icons
const RoomIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

const PriceIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const CapacityIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const FeatureIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

export default function StaffRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsRes = await fetch("/api/admin/rooms")
        
        if (!roomsRes.ok) {
          throw new Error("Failed to fetch rooms")
        }
        
        const roomsData = await roomsRes.json()
        setRooms(roomsData.rooms || [])
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatusBadge = (status: string | undefined) => {
    if (!status || status === "available") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700">
          <CheckIcon className="w-3.5 h-3.5" />
          Available
        </span>
      )
    }
    if (status === "booked") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700">
          <CheckIcon className="w-3.5 h-3.5" />
          Booked
        </span>
      )
    }
    return null
  }

  const filteredRooms = rooms.filter(room => {
    if (statusFilter === "all") return true
    if (statusFilter === "available") return !room.status || room.status === "available"
    if (statusFilter === "booked") return room.status === "booked"
    return true
  })

  const availableCount = rooms.filter(r => !r.status || r.status === "available").length
  const bookedCount = rooms.filter(r => r.status === "booked").length

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-40"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="h-48 bg-slate-200 dark:bg-slate-700"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="flex gap-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                  ))}
                </div>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Rooms</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">View all available rooms and their details</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <RoomIcon className="w-4 h-4" />
          <span>{filteredRooms.length} rooms</span>
          <span className="text-green-600">{availableCount} available</span>
          <span className="text-amber-600">{bookedCount} booked</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:ring-0 focus:border-blue-500 transition-all"
          >
            <option value="all">All Rooms</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
          </select>
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room, index) => (
          <div
            key={room._id}
            className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 dark:border-slate-700"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              {room.image ? (
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                  <RoomIcon className="w-12 h-12 text-slate-400 dark:text-slate-400" />
                </div>
              )}
              
              {/* Popular Badge */}
              {room.popular && (
                <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-semibold rounded-full shadow-lg">
                  <StarIcon className="w-3 h-3" />
                  Popular
                </div>
              )}

              {/* Price Badge */}
              <div className="absolute top-4 right-4 px-3 py-1.5 bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg">
                <span className="text-sm font-bold text-slate-800 dark:text-white">{room.price}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">{room.period}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-amber-600 transition-colors">
                  {room.name}
                </h3>
                {getStatusBadge(room.status)}
              </div>

              {/* Booking Info (if booked) */}
              {room.status === "booked" && (
                <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
                  <div className="flex items-center gap-2 mb-2">
                    <UserIcon className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-800 dark:text-amber-400">{room.currentGuestName || "Guest"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>{room.currentCheckIn || ""} → {room.currentCheckOut || ""}</span>
                  </div>
                </div>
              )}

              {/* Capacity */}
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
                <CapacityIcon className="w-4 h-4" />
                {room.capacity}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                {room.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                {room.features?.slice(0, 4).map((feature, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg"
                  >
                    <FeatureIcon className="w-3 h-3 text-amber-500" />
                    {feature}
                  </span>
                ))}
                {room.features?.length > 4 && (
                  <span className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg">
                    +{room.features.length - 4} more
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-green-50">
                    <PriceIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Price</div>
                    <div className="text-sm font-bold text-slate-800 dark:text-white">{room.price}</div>
                  </div>
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-400">
                  {room.period}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {rooms.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <RoomIcon className="w-8 h-8 text-slate-400 dark:text-slate-400" />
          </div>
          <div className="text-slate-500 dark:text-slate-400">No rooms found</div>
        </div>
      )}
    </div>
  )
}
