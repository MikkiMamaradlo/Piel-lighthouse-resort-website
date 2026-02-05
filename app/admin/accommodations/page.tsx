"use client"

import { useEffect, useState } from "react"
import {
  BedDouble,
  Plus,
  Edit,
  Trash2,
  X,
  Star,
  Users,
  Wind,
  Refrigerator,
  Tv,
  ShowerHead,
  Wifi,
  DollarSign
} from "lucide-react"

interface Room {
  _id: string
  name: string
  type: "room" | "cottage"
  capacity: string
  image: string
  images?: string[]
  price: string
  period: string
  inclusions: Array<{ icon: string; text: string }>
  popular: boolean
  features: string[]
  description: string
  order: number
  status: "available" | "unavailable"
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users: Users,
  Wind: Wind,
  Refrigerator: Refrigerator,
  Tv: Tv,
  ShowerHead: ShowerHead,
  Wifi: Wifi,
}

export default function AccommodationsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "room",
    capacity: "",
    image: "",
    images: "",
    price: "",
    period: "/night",
    description: "",
    popular: false,
    features: "",
    status: "available",
    inclusions: [
      { icon: "Users", text: "" },
      { icon: "Wind", text: "" },
      { icon: "Refrigerator", text: "" },
      { icon: "Tv", text: "" },
      { icon: "ShowerHead", text: "" },
      { icon: "Wifi", text: "" },
    ],
  })

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/admin/rooms")
      const data = await response.json()
      setRooms(data.rooms || [])
    } catch (error) {
      console.error("Failed to fetch rooms:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const roomData = {
      ...formData,
      type: formData.type,
      status: formData.status,
      features: formData.features.split(",").map((f) => f.trim()).filter(Boolean),
      inclusions: formData.inclusions.filter((i) => i.text.trim()),
      images: formData.images ? formData.images.split(",").map((url) => url.trim()).filter(Boolean) : [],
    }

    try {
      if (editingRoom) {
        await fetch("/api/admin/rooms", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingRoom._id, ...roomData }),
        })
      } else {
        await fetch("/api/admin/rooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(roomData),
        })
      }
      fetchRooms()
      closeModal()
    } catch (error) {
      console.error("Failed to save room:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return
    
    try {
      await fetch(`/api/admin/rooms?id=${id}`, { method: "DELETE" })
      fetchRooms()
    } catch (error) {
      console.error("Failed to delete room:", error)
    }
  }

  const openEditModal = (room: Room) => {
    setEditingRoom(room)
    setFormData({
      name: room.name,
      type: room.type || "room",
      capacity: room.capacity,
      image: room.image,
      images: room.images?.join(", ") || "",
      price: room.price,
      period: room.period,
      description: room.description,
      popular: room.popular,
      features: room.features.join(", "),
      status: room.status || "available",
      inclusions: room.inclusions.length > 0 ? room.inclusions : [
        { icon: "Users", text: "" },
        { icon: "Wind", text: "" },
        { icon: "Refrigerator", text: "" },
        { icon: "Tv", text: "" },
        { icon: "ShowerHead", text: "" },
        { icon: "Wifi", text: "" },
      ],
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingRoom(null)
    setFormData({
      name: "",
      type: "room",
      capacity: "",
      image: "",
      images: "",
      price: "",
      period: "/night",
      description: "",
      popular: false,
      features: "",
      status: "available",
      inclusions: [
        { icon: "Users", text: "" },
        { icon: "Wind", text: "" },
        { icon: "Refrigerator", text: "" },
        { icon: "Tv", text: "" },
        { icon: "ShowerHead", text: "" },
        { icon: "Wifi", text: "" },
      ],
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rooms</h1>
          <p className="text-slate-500 mt-1">Manage your resort rooms and pricing</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
        >
          <Plus className="w-5 h-5" />
          Add Room
        </button>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-slate-500">Loading rooms...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BedDouble className="w-10 h-10 text-slate-400" />
          </div>
          <p className="text-slate-500 text-lg font-medium">No rooms added yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your first room
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300"
            >
              <div className="relative h-52 bg-slate-100 overflow-hidden">
                <img
                  src={room.image || "/placeholder.jpg"}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {room.popular && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-semibold rounded-full shadow-lg">
                    <Star className="w-3.5 h-3.5" />
                    Popular
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      room.type === "cottage" 
                        ? "bg-amber-100 text-amber-700" 
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {room.type === "cottage" ? "🏠 Cottage" : "🛏️ Room"}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      room.status === "available" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {room.status === "available" ? "✓ Available" : "✗ Unavailable"}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{room.price}</p>
                    <p className="text-xs text-slate-400">{room.period}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-slate-900">{room.name}</h3>
                  <p className="text-sm text-slate-500">{room.capacity}</p>
                </div>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{room.description}</p>
                
                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.inclusions.slice(0, 4).map((inclusion, idx) => {
                    const Icon = iconMap[inclusion.icon] || Users
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-xs text-slate-600"
                      >
                        <Icon className="w-3.5 h-3.5 text-blue-600" />
                        <span>{inclusion.text}</span>
                      </div>
                    )
                  })}
                  {room.inclusions.length > 4 && (
                    <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs text-slate-600">
                      +{room.inclusions.length - 4} more
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => openEditModal(room)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(room._id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingRoom ? "Edit Room" : "Add New Room"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Beachfront Room"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as "room" | "cottage" })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="room">Room</option>
                    <option value="cottage">Cottage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "available" | "unavailable" })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., up to 4 pax"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., ₱3,500"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Image URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., /images/piel1.jpg"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Images (comma-separated URLs)
                  </label>
                  <input
                    type="text"
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., /images/piel2.jpg, /images/piel3.jpg"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the room/cottage..."
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Table Cottage, Extra mattress"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Amenities
                </label>
                <div className="space-y-2">
                  {formData.inclusions.map((inclusion, idx) => {
                    const Icon = iconMap[inclusion.icon] || Users
                    return (
                      <div key={inclusion.icon} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="w-32 text-sm text-gray-600">{inclusion.icon}</span>
                        <input
                          type="text"
                          value={inclusion.text}
                          onChange={(e) => {
                            const newInclusions = [...formData.inclusions]
                            newInclusions[idx].text = e.target.value
                            setFormData({ ...formData, inclusions: newInclusions })
                          }}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Description"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Type & Status Toggle */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="popular"
                    checked={formData.popular}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="popular" className="text-sm font-medium text-gray-700">
                    Mark as Popular
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {editingRoom ? "Save Changes" : "Add Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
