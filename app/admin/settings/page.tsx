"use client"

import { useState } from "react"
import {
  Settings,
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
  Bell,
  Lock,
  Palette,
  Eye,
  Clock
} from "lucide-react"

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  const [siteSettings, setSiteSettings] = useState({
    siteName: "Piel Lighthouse Beach Resort",
    siteDescription: "Experience paradise at Piel Lighthouse Beach Resort. A perfect getaway destination.",
    heroTitle: "Welcome to Paradise",
    heroSubtitle: "Experience the beauty of island living at its finest",
    contactEmail: "piel.lighthouse.resort@gmail.com",
    contactPhone: "+63 912 345 6789",
    contactAddress: "Brgy. Lonos, San Juan, Batangas, Philippines",
    facebookUrl: "https://facebook.com/piel.lighthouse",
    instagramUrl: "https://instagram.com/piel.lighthouse",
    operatingHours: "24/7",
    checkInTime: "2:00 PM",
    checkOutTime: "11:00 AM",
  })

  const handleSave = async () => {
    setSaving(true)
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const settingSections = [
    {
      title: "General Settings",
      icon: Globe,
      fields: [
        { key: "siteName", label: "Site Name", type: "text" },
        { key: "siteDescription", label: "Site Description", type: "textarea" },
      ]
    },
    {
      title: "Hero Section",
      icon: Eye,
      fields: [
        { key: "heroTitle", label: "Hero Title", type: "text" },
        { key: "heroSubtitle", label: "Hero Subtitle", type: "text" },
      ]
    },
    {
      title: "Contact Information",
      icon: Mail,
      fields: [
        { key: "contactEmail", label: "Email Address", type: "email" },
        { key: "contactPhone", label: "Phone Number", type: "tel" },
        { key: "contactAddress", label: "Address", type: "textarea" },
      ]
    },
    {
      title: "Operating Hours",
      icon: Clock,
      fields: [
        { key: "operatingHours", label: "Operating Hours", type: "text" },
        { key: "checkInTime", label: "Check-in Time", type: "text" },
        { key: "checkOutTime", label: "Check-out Time", type: "text" },
      ]
    },
    {
      title: "Social Media",
      icon: Globe,
      fields: [
        { key: "facebookUrl", label: "Facebook URL", type: "url" },
        { key: "instagramUrl", label: "Instagram URL", type: "url" },
      ]
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your website configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {saved && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600">Settings saved successfully!</p>
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
              <p className="text-sm text-gray-500">Basic website information</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={siteSettings.siteName}
                onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Description
              </label>
              <input
                type="text"
                value={siteSettings.siteDescription}
                onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Hero Section</h2>
              <p className="text-sm text-gray-500">Main banner content</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Title
              </label>
              <input
                type="text"
                value={siteSettings.heroTitle}
                onChange={(e) => setSiteSettings({ ...siteSettings, heroTitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Subtitle
              </label>
              <input
                type="text"
                value={siteSettings.heroSubtitle}
                onChange={(e) => setSiteSettings({ ...siteSettings, heroSubtitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
              <p className="text-sm text-gray-500">How guests can reach you</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={siteSettings.contactEmail}
                onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={siteSettings.contactPhone}
                onChange={(e) => setSiteSettings({ ...siteSettings, contactPhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={siteSettings.contactAddress}
                onChange={(e) => setSiteSettings({ ...siteSettings, contactAddress: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Operating Hours</h2>
              <p className="text-sm text-gray-500">Resort operating schedule</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operating Hours
              </label>
              <input
                type="text"
                value={siteSettings.operatingHours}
                onChange={(e) => setSiteSettings({ ...siteSettings, operatingHours: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-in Time
              </label>
              <input
                type="text"
                value={siteSettings.checkInTime}
                onChange={(e) => setSiteSettings({ ...siteSettings, checkInTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-out Time
              </label>
              <input
                type="text"
                value={siteSettings.checkOutTime}
                onChange={(e) => setSiteSettings({ ...siteSettings, checkOutTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Social Media</h2>
              <p className="text-sm text-gray-500">Your social media links</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                value={siteSettings.facebookUrl}
                onChange={(e) => setSiteSettings({ ...siteSettings, facebookUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                value={siteSettings.instagramUrl}
                onChange={(e) => setSiteSettings({ ...siteSettings, instagramUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Security</h2>
              <p className="text-sm text-gray-500">Admin access settings</p>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-3">
              To change admin credentials, modify the following environment variables:
            </p>
            <div className="space-y-2 text-sm">
              <p className="font-mono bg-white px-3 py-2 rounded border">
                ADMIN_USERNAME=your_username
              </p>
              <p className="font-mono bg-white px-3 py-2 rounded border">
                ADMIN_PASSWORD_HASH=your_hashed_password
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Note: Password should be hashed using SHA-256 HMAC with ADMIN_SECRET as the key.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
