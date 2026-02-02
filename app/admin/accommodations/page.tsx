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
  capacity: string
  image: string
  price: string
  period: string
  inclusions: Array<{ icon: string; text: string }>
  popular: boolean
  features: string[]
  description: string
  order: number
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
    capacity: "",
    image: "",
    price: "",
    period: "/night",
    description: "",
    popular: false,
    features: "",
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
      features: formData.features.split(",").map((f) => f.trim()).filter(Boolean),
      inclusions: formData.inclusions.filter((i) => i.text.trim()),
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
      capacity: room.capacity,
      image: room.image,
      price: room.price,
      period: room.period,
      description: room.description,
      popular: room.popular,
      features: room.features.join(", "),
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
      capacity: "",
      image: "",
      price: "",
      period: "/night",
      description: "",
      popular: false,
      features: "",
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
          <h1 className="text-2xl font-bold text-gray-900">Accommodations</h1>
          <p className="text-gray-500 mt-1">Manage your resort rooms and pricing</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Room
        </button>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading rooms...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <BedDouble className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No rooms added yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Add your first room
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 bg-gray-100">
                <img
                  src={room.image || "/placeholder.jpg"}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                {room.popular && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
                    <Star className="w-3 h-3" />
                    Popular
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                    <p className="text-sm text-gray-500">{room.capacity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600">{room.price}</p>
                    <p className="text-xs text-gray-400">{room.period}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{room.description}</p>
                
                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.inclusions.slice(0, 4).map((inclusion, idx) => {
                    const Icon = iconMap[inclusion.icon] || Users
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
                      >
                        <Icon className="w-3 h-3" />
                        <span>{inclusion.text}</span>
                      </div>
                    )
                  })}
                  {room.inclusions.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                      +{room.inclusions.length - 4} more
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => openEditModal(room)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(room._id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
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
                    Room Name
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
                    Capacity
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
                    Price
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
                    Image URL
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
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the room..."
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

              {/* Popular Toggle */}
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
