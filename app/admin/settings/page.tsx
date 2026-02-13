"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
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
  Clock,
  CheckCircle,
  Moon,
  Sun
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your website configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
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
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-green-700 font-medium">Settings saved successfully!</p>
        </div>
      )}

      {/* Dark Mode Toggle */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-500/25">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Dark Mode</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">Toggle between light and dark theme</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">General Settings</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">Basic website information</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={siteSettings.siteName}
                onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-0 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Site Description
              </label>
              <input
                type="text"
                value={siteSettings.siteDescription}
                onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-0 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Hero Section</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">Main banner content</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Hero Title
              </label>
              <input
                type="text"
                value={siteSettings.heroTitle}
                onChange={(e) => setSiteSettings({ ...siteSettings, heroTitle: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-0 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Hero Subtitle
              </label>
              <input
                type="text"
                value={siteSettings.heroSubtitle}
                onChange={(e) => setSiteSettings({ ...siteSettings, heroSubtitle: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-0 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Contact Information</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">How guests can reach you</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={siteSettings.contactEmail}
                onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-0 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={siteSettings.contactPhone}
                onChange={(e) => setSiteSettings({ ...siteSettings, contactPhone: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-0 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Address
              </label>
              <textarea
                value={siteSettings.contactAddress}
                onChange={(e) => setSiteSettings({ ...siteSettings, contactAddress: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-0 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Operating Hours</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">Resort operating schedule</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Operating Hours
              </label>
              <input
                type="text"
                value={siteSettings.operatingHours}
                onChange={(e) => setSiteSettings({ ...siteSettings, operatingHours: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-0 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Check-in Time
              </label>
              <input
                type="text"
                value={siteSettings.checkInTime}
                onChange={(e) => setSiteSettings({ ...siteSettings, checkInTime: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-0 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Check-out Time
              </label>
              <input
                type="text"
                value={siteSettings.checkOutTime}
                onChange={(e) => setSiteSettings({ ...siteSettings, checkOutTime: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-0 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/25">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Social Media</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">Your social media links</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                value={siteSettings.facebookUrl}
                onChange={(e) => setSiteSettings({ ...siteSettings, facebookUrl: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-0 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                value={siteSettings.instagramUrl}
                onChange={(e) => setSiteSettings({ ...siteSettings, instagramUrl: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-0 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Security</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">Admin access settings</p>
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
              To change admin credentials, modify the following environment variables:
            </p>
            <div className="space-y-2 text-sm">
              <p className="font-mono bg-white dark:bg-slate-800 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600">
                ADMIN_USERNAME=your_username
              </p>
              <p className="font-mono bg-white dark:bg-slate-800 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600">
                ADMIN_PASSWORD_HASH=your_hashed_password
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Note: Password should be hashed using SHA-256 HMAC with ADMIN_SECRET as the key.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}







