"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Palmtree, Waves, Sun, User, Mail, Lock, Eye, EyeOff, Check } from "lucide-react"

export default function StaffRegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/staff/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        router.push("/staff")
      } else {
        setError(data.error || "Registration failed")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-ocean-900 via-ocean-800 to-ocean-900">
      {/* Animated Ocean Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Sun rays */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-1/3 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
        
        {/* Ocean waves pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path 
              fill="currentColor" 
              fillOpacity="0.4"
              d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,186.7C960,213,1056,235,1152,213.3C1248,192,1344,128,1392,96L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
        
        {/* Floating bubbles */}
        <div className="absolute bottom-20 left-10 w-4 h-4 bg-white/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-6 h-6 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
        <div className="absolute bottom-32 right-1/3 w-3 h-3 bg-white/15 rounded-full animate-bounce" style={{ animationDelay: "0.6s" }}></div>
        <div className="absolute bottom-16 right-20 w-5 h-5 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: "0.9s" }}></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative w-full max-w-md p-6">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          {/* Logo with wave animation */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-amber-400/30 rounded-2xl blur-xl animate-pulse"></div>
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 rounded-2xl shadow-2xl shadow-amber-500/40 transform hover:scale-110 transition-transform duration-300">
              <Palmtree className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
            {/* Decorative wave icon */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center shadow-lg">
              <Waves className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <Link href="/" className="inline-block group">
            <h1 className="text-3xl font-bold text-white mb-2 group-hover:text-amber-400 transition-all duration-300 drop-shadow-lg">
              Piel Lighthouse
            </h1>
          </Link>
          <div className="flex items-center justify-center gap-2 text-ocean-200">
            <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-sm font-medium tracking-wide">Staff Registration</span>
            <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
        </div>

        {/* Register Form Card */}
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
          {/* Decorative top bar */}
          <div className="h-2 bg-gradient-to-r from-amber-400 via-cyan-400 to-blue-500"></div>
          
          <div className="p-8">
            {/* Welcome message */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Join Our Team</h2>
              <p className="text-slate-500 text-sm">Create your staff account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-3 animate-shake">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  {error}
                </div>
              )}

              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-semibold text-slate-700 ml-1">
                  Username
                </label>
                <div className={`relative transition-all duration-300 ${
                  focusedField === "username" ? "transform scale-[1.02]" : ""
                }`}>
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${
                    focusedField === "username" ? "text-amber-500" : "text-slate-400"
                  }`}>
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-amber-400 outline-none transition-all duration-300 hover:border-slate-300 text-slate-800 placeholder-slate-400"
                    placeholder="Choose a username"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 ml-1">
                  Email Address
                </label>
                <div className={`relative transition-all duration-300 ${
                  focusedField === "email" ? "transform scale-[1.02]" : ""
                }`}>
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${
                    focusedField === "email" ? "text-amber-500" : "text-slate-400"
                  }`}>
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-amber-400 outline-none transition-all duration-300 hover:border-slate-300 text-slate-800 placeholder-slate-400"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 ml-1">
                  Password
                </label>
                <div className={`relative transition-all duration-300 ${
                  focusedField === "password" ? "transform scale-[1.02]" : ""
                }`}>
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${
                    focusedField === "password" ? "text-amber-500" : "text-slate-400"
                  }`}>
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-14 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-amber-400 outline-none transition-all duration-300 hover:border-slate-300 text-slate-800 placeholder-slate-400"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 ml-1">
                  Confirm Password
                </label>
                <div className={`relative transition-all duration-300 ${
                  focusedField === "confirmPassword" ? "transform scale-[1.02]" : ""
                }`}>
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${
                    focusedField === "confirmPassword" ? "text-amber-500" : "text-slate-400"
                  }`}>
                    <Check className="w-5 h-5" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-amber-400 outline-none transition-all duration-300 hover:border-slate-300 text-slate-800 placeholder-slate-400"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-4 bg-gradient-to-r from-amber-500 via-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 group"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Create Account</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">or</span>
              </div>
            </div>

            {/* Login Link */}
            <Link
              href="/staff/login"
              className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-slate-200 hover:border-amber-400 text-slate-700 hover:text-amber-600 font-semibold rounded-xl transition-all duration-300 hover:bg-amber-50/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Already have an account? Sign In
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-ocean-200 hover:text-white transition-colors group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Paradise
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-ocean-300/60">© 2024 Piel Lighthouse Resort • Staff Portal</p>
        </div>
      </div>
    </div>
  )
}
