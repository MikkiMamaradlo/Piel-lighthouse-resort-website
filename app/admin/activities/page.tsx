"use client"

import { useEffect, useState } from "react"
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  X,
  Clock,
  DollarSign
} from "lucide-react"

interface Activity {
  _id: string
  name: string
  description: string
  image: string
  price: string
  duration: string
  order: number
}

// Demo activities data
const demoActivities = [
  {
    _id: "act1",
    name: "Beach Glamping",
    description: "Experience luxury camping right by the beach with our premium glamping tents.",
    image: "/images/piel5.jpg",
    price: "₱2,500",
    duration: "Per night",
    order: 1
  },
  {
    _id: "act2",
    name: "Beach Camping",
    description: "Traditional beach camping experience under the stars. Perfect for adventure seekers.",
    image: "/images/piel6.jpg",
    price: "₱1,500",
    duration: "Per night",
    order: 2
  },
  {
    _id: "act3",
    name: "Sunset Dining",
    description: "Romantic dinner setup on the beach with stunning sunset views.",
    image: "/images/piel7.jpg",
    price: "₱3,000",
    duration: "Per person",
    order: 3
  },
]

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
    duration: "Per night",
  })

  useEffect(() => {
    // For demo, use local data
    setActivities(demoActivities)
    setLoading(false)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const activityData = {
      ...formData,
      order: activities.length + 1,
    }

    try {
      // In production, save to API
      if (editingActivity) {
        setActivities(activities.map(a => 
          a._id === editingActivity._id ? { ...a, ...formData } : a
        ))
      } else {
        setActivities([...activities, { ...activityData, _id: `act${Date.now()}` }])
      }
      closeModal()
    } catch (error) {
      console.error("Failed to save activity:", error)
    }
  }

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) return
    
    setActivities(activities.filter(a => a._id !== id))
  }

  const openEditModal = (activity: Activity) => {
    setEditingActivity(activity)
    setFormData({
      name: activity.name,
      description: activity.description,
      image: activity.image,
      price: activity.price,
      duration: activity.duration,
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingActivity(null)
    setFormData({
      name: "",
      description: "",
      image: "",
      price: "",
      duration: "Per night",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Activities</h1>
          <p className="text-slate-500 mt-1">Manage resort activities and experiences</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/25"
        >
          <Plus className="w-5 h-5" />
          Add Activity
        </button>
      </div>

      {/* Activities Grid */}
      {loading ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-12 text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-emerald-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-slate-500 dark:text-slate-400">Loading activities...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-10 h-10 text-slate-400 dark:text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">No activities added yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Add your first activity
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300"
            >
              <div className="relative h-52 bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <img
                  src={activity.image || "/placeholder.jpg"}
                  alt={activity.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{activity.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{activity.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-sm">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">{activity.price}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-slate-600 dark:text-slate-400">{activity.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => openEditModal(activity)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(activity._id)}
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
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingActivity ? "Edit Activity" : "Add New Activity"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 dark:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Activity Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Beach Glamping"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the activity..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., /images/piel5.jpg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., ₱2,500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Per night">Per night</option>
                    <option value="Per person">Per person</option>
                    <option value="Per hour">Per hour</option>
                    <option value="Per session">Per session</option>
                    <option value="Per day">Per day</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {editingActivity ? "Save Changes" : "Add Activity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
