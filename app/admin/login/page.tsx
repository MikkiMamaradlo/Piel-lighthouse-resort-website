"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, Shield, Waves, Sun, ChevronRight, Sparkles } from "lucide-react"

export default function AdminLogin() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        router.push("/admin")
      } else {
        setError(result.error || "Invalid credentials")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-ocean-950 via-ocean-900 to-ocean-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ocean-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sunset-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white dark:bg-ocean-800/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative w-full max-w-md p-6">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-ocean-500/30 rounded-2xl blur-xl animate-pulse"></div>
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-ocean-600 via-ocean-700 to-teal-700 rounded-2xl shadow-2xl shadow-ocean-500/40 transform hover:scale-110 transition-transform duration-300 ring-4 ring-white/10">
              <Shield className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
            {/* Decorative lock icon */}
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-sunset-400 to-sunset-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/10">
              <Lock className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <Link href="/" className="inline-block group">
            <h1 className="text-3xl font-bold text-white mb-2 group-hover:text-ocean-300 transition-all duration-300 drop-shadow-lg">
              Piel Lighthouse
            </h1>
          </Link>
          <div className="flex items-center justify-center gap-2 text-ocean-300 dark:text-ocean-400">
            <Sun className="w-5 h-5 text-sunset-400 animate-pulse" />
            <span className="text-sm font-semibold tracking-wide">Admin Portal</span>
            <Sun className="w-5 h-5 text-sunset-400 animate-pulse" />
          </div>
        </div>

        {/* Login Form Card */}
        <div className="relative bg-white/95 dark:bg-ocean-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/20 dark:ring-ocean-700/50">
          {/* Decorative top bar */}
          <div className="h-2 bg-gradient-to-r from-ocean-600 via-cyan-500 to-teal-500"></div>
          
          <div className="p-8">
            {/* Welcome message */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-ocean-900 dark:text-white mb-1">Administrator</h2>
              <p className="text-ocean-600 dark:text-ocean-400 text-sm">Secure access to management dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-3 animate-shake">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  {error}
                </div>
              )}

              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-semibold text-ocean-700 dark:text-ocean-300 ml-1">
                  Username
                </label>
                <div className={`relative transition-all duration-300 ${
                  focusedField === "username" ? "transform scale-[1.02]" : ""
                }`}>
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${
                    focusedField === "username" ? "text-ocean-500" : "text-ocean-400 dark:text-ocean-500"
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-4 py-3.5 bg-ocean-50 dark:bg-ocean-800/50 border-2 border-ocean-200 dark:border-ocean-700 rounded-xl focus:ring-0 focus:border-ocean-500 outline-none transition-all duration-300 hover:border-ocean-300 text-ocean-900 dark:text-white placeholder-ocean-400 dark:placeholder-ocean-500"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-ocean-700 dark:text-ocean-300 ml-1">
                  Password
                </label>
                <div className={`relative transition-all duration-300 ${
                  focusedField === "password" ? "transform scale-[1.02]" : ""
                }`}>
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${
                    focusedField === "password" ? "text-ocean-500" : "text-ocean-400 dark:text-ocean-500"
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-14 py-3.5 bg-ocean-50 dark:bg-ocean-800/50 border-2 border-ocean-200 dark:border-ocean-700 rounded-xl focus:ring-0 focus:border-ocean-500 outline-none transition-all duration-300 hover:border-ocean-300 text-ocean-900 dark:text-white placeholder-ocean-400 dark:placeholder-ocean-500"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-ocean-400 hover:text-ocean-600 dark:hover:text-ocean-300 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-ocean-600 via-cyan-600 to-teal-600 hover:from-ocean-700 hover:via-cyan-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-ocean-500/30 hover:shadow-ocean-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 group"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Access Dashboard</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </form>

            {/* Security badge */}
            <div className="mt-6 p-4 bg-ocean-50 dark:bg-ocean-800/50 rounded-xl flex items-center justify-center gap-3">
              <Shield className="w-5 h-5 text-teal-500" />
              <span className="text-sm text-ocean-600 dark:text-ocean-400 font-medium">Secured Admin Access</span>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-ocean-300 hover:text-white transition-colors group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Website
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-ocean-500 dark:text-ocean-400/60">© 2024 Piel Lighthouse Resort • Admin Portal v2.0</p>
        </div>
      </div>
    </div>
  )
}







