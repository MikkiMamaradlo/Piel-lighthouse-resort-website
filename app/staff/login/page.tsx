"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Waves, Sun, Sparkles, ArrowRight } from "lucide-react"

export default function StaffLoginPage() {
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
      const response = await fetch("/api/staff/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        router.push("/staff")
      } else {
        setError(data.error || "Login failed")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-jade-950 via-jade-900 to-jade-950">
      {/* Animated Ocean Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Sun rays */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-jade-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-1/3 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
        
        {/* Ocean waves pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path 
              fill="currentColor" 
              fillOpacity="0.4"
              d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,186.7C960,213,1056,235,1152,213.3C1248,192,1344,128,1392,96L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              className="text-jade-400"
            ></path>
          </svg>
        </div>
        
        {/* Floating bubbles */}
        <div className="absolute bottom-20 left-10 w-4 h-4 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-6 h-6 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
        <div className="absolute bottom-32 right-1/3 w-3 h-3 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: "0.6s" }}></div>
        <div className="absolute bottom-16 right-20 w-5 h-5 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: "0.9s" }}></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative w-full max-w-md p-6">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          {/* Logo with wave animation */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-jade-400/30 rounded-2xl blur-xl animate-pulse"></div>
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-jade-400 via-jade-500 to-emerald-500 rounded-2xl shadow-2xl shadow-jade-500/40 transform hover:scale-110 transition-transform duration-300 overflow-hidden ring-4 ring-white/20">
              <Image 
                src="/images/PielLogo.jpg" 
                alt="Piel Lighthouse Logo" 
                width={80} 
                height={80}
                className="object-cover"
              />
            </div>
            {/* Decorative wave icon */}
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-teal-400 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
              <Waves className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <Link href="/" className="inline-block group">
            <h1 className="text-3xl font-bold text-white mb-2 group-hover:text-jade-300 transition-all duration-300 drop-shadow-lg">
              Piel Lighthouse
            </h1>
          </Link>
          <div className="flex items-center justify-center gap-2 text-jade-200">
            <Sun className="w-5 h-5 text-jade-400 animate-pulse" />
            <span className="text-sm font-semibold tracking-wide">Staff Portal</span>
            <Sun className="w-5 h-5 text-jade-400 animate-pulse" />
          </div>
        </div>

        {/* Login Form Card */}
        <div className="relative bg-white/95 dark:bg-jade-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/20 dark:ring-jade-700/50">
          {/* Decorative top bar */}
          <div className="h-2 bg-gradient-to-r from-jade-400 via-teal-400 to-emerald-500"></div>
          
          <div className="p-8">
            {/* Welcome message */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-jade-900 dark:text-white mb-1">Staff Login</h2>
              <p className="text-jade-600 dark:text-jade-400 text-sm">Access your staff dashboard</p>
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
                <label htmlFor="username" className="block text-sm font-semibold text-jade-700 dark:text-jade-300 ml-1">
                  Username
                </label>
                <div className={`relative transition-all duration-300 ${
                  focusedField === "username" ? "transform scale-[1.02]" : ""
                }`}>
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${
                    focusedField === "username" ? "text-jade-500" : "text-jade-400"
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
                    className="w-full pl-12 pr-4 py-3.5 bg-jade-50 dark:bg-jade-800/50 border-2 border-jade-200 dark:border-jade-700 rounded-xl focus:ring-0 focus:border-jade-400 outline-none transition-all duration-300 hover:border-jade-300 text-jade-900 dark:text-white placeholder-jade-400"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-jade-700 dark:text-jade-300 ml-1">
                  Password
                </label>
                <div className={`relative transition-all duration-300 ${
                  focusedField === "password" ? "transform scale-[1.02]" : ""
                }`}>
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${
                    focusedField === "password" ? "text-jade-500" : "text-jade-400"
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
                    className="w-full pl-12 pr-14 py-3.5 bg-jade-50 dark:bg-jade-800/50 border-2 border-jade-200 dark:border-jade-700 rounded-xl focus:ring-0 focus:border-jade-400 outline-none transition-all duration-300 hover:border-jade-300 text-jade-900 dark:text-white placeholder-jade-400"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-jade-400 hover:text-jade-500 transition-colors"
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
                className="w-full py-3.5 px-4 bg-gradient-to-r from-jade-500 to-emerald-500 hover:from-jade-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-jade-500/30 hover:shadow-jade-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 group"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-jade-200 hover:text-white transition-colors group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Paradise
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-jade-300/60">© 2024 Piel Lighthouse Resort • Staff Portal</p>
        </div>
      </div>
    </div>
  )
}







