"use client"

import { useEffect, useState } from "react"
import {
  MessageSquareQuote,
  Plus,
  Edit,
  Trash2,
  X,
  Star,
  User
} from "lucide-react"

interface Testimonial {
  _id: string
  name: string
  role: string
  avatar: string
  rating: number
  text: string
  stayDate: string
  order: number
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    avatar: "",
    rating: 5,
    text: "",
    stayDate: "",
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/admin/testimonials")
      const data = await response.json()
      setTestimonials(data.testimonials || [])
    } catch (error) {
      console.error("Failed to fetch testimonials:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingTestimonial) {
        await fetch("/api/admin/testimonials", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingTestimonial._id, ...formData }),
        })
      } else {
        await fetch("/api/admin/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, order: testimonials.length + 1 }),
        })
      }
      fetchTestimonials()
      closeModal()
    } catch (error) {
      console.error("Failed to save testimonial:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return
    
    try {
      await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" })
      fetchTestimonials()
    } catch (error) {
      console.error("Failed to delete testimonial:", error)
    }
  }

  const openEditModal = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      avatar: testimonial.avatar,
      rating: testimonial.rating,
      text: testimonial.text,
      stayDate: testimonial.stayDate,
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingTestimonial(null)
    setFormData({
      name: "",
      role: "",
      avatar: "",
      rating: 5,
      text: "",
      stayDate: "",
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reviews</h1>
          <p className="text-slate-500 mt-1">Manage guest reviews and testimonials</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/25"
        >
          <Plus className="w-5 h-5" />
          Add Testimonial
        </button>
      </div>

      {/* Testimonials Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-amber-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-slate-500">Loading testimonials...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquareQuote className="w-10 h-10 text-slate-400" />
          </div>
          <p className="text-slate-500 text-lg font-medium">No testimonials added yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
          >
            Add your first testimonial
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial._id}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-lg hover:border-amber-200 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-amber-500/25">
                  {testimonial.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{testimonial.name}</h3>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
              
              <blockquote className="text-slate-600 text-sm mb-4 line-clamp-4">
                "{testimonial.text}"
              </blockquote>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">{testimonial.stayDate}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(testimonial)}
                    className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial._id)}
                    className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
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
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Maria Santos"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role/Title
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Family Vacation"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stay Date
                  </label>
                  <input
                    type="text"
                    value={formData.stayDate}
                    onChange={(e) => setFormData({ ...formData, stayDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., December 2025"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>{num} Star{num > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Testimonial Text
                </label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What did the guest say..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., /placeholder-user.jpg"
                />
              </div>

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
                  {editingTestimonial ? "Save Changes" : "Add Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
