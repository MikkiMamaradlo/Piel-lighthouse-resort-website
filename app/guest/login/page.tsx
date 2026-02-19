"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Waves, Sun, Sparkles } from "lucide-react"


export default function GuestLoginPage() {
  const router = useRouter()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Check if already authenticated on mount only
  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      try {
        const response = await fetch("/api/guest/auth/check", { 
          cache: "no-store",
          credentials: "include" 
        })
        const data = await response.json()

        if (mounted && response.ok && data.authenticated) {
          // User is already authenticated, redirect to dashboard
          router.replace("/guest/dashboard")
        }
      } catch {
        // Network error, stay on login page
      }
    }

    checkAuth()

    return () => {
      mounted = false
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/guest/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Auth cookie is set, redirect straight to dashboard
        router.push("/guest/dashboard")
      } else {
        setError(data.error || "Login failed")
      }
    } catch {
      setError("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-sunset-50 via-sky-50 to-sunset-100 dark:from-sunset-950 dark:via-sunset-900 dark:to-sunset-950 transition-colors duration-500">
      {/* Animated beach background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Sun rays */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sunset-400/20 dark:bg-sunset-400/10 rounded-full blur-3xl animate-sun-ray"></div>
        <div className="absolute top-20 right-1/3 w-72 h-72 bg-cyan-400/20 dark:bg-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-orange-400/20 dark:bg-orange-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        
        {/* Ocean wave overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,186.7C960,213,1056,235,1152,213.3C1248,192,1344,128,1392,96L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" className="text-ocean-500"></path>
          </svg>
        </div>
      </div>

      <div className="relative w-full max-w-md p-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-sunset-400/30 rounded-2xl blur-xl animate-pulse"></div>
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sunset-400 via-sunset-500 to-orange-500 rounded-2xl shadow-2xl shadow-sunset-500/40 transform hover:scale-110 transition-transform duration-300 overflow-hidden ring-4 ring-white/20">
              <Image 
                src="/images/PielLogo.jpg" 
                alt="Piel Lighthouse Logo" 
                width={80} 
                height={80}
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
              <Waves className="w-5 h-5 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-sunset-900 dark:text-white mb-2 drop-shadow-lg">Piel Lighthouse</h1>
          <div className="flex items-center justify-center gap-2 text-sunset-600 dark:text-sunset-300">
            <Sun className="w-5 h-5 text-sunset-500 animate-pulse" />
            <span className="text-sm font-semibold tracking-wide">Guest Portal</span>
            <Sun className="w-5 h-5 text-sunset-500 animate-pulse" />
          </div>
        </div>

        {/* Login Form */}
        <div className="relative bg-white/95 dark:bg-sunset-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/50 dark:ring-sunset-700/50">
          {/* Decorative top bar with wave pattern */}
          <div className="h-2 bg-gradient-to-r from-sunset-500 via-cyan-400 to-sunset-400"></div>

          <div className="p-8">
            <h2 className="text-2xl font-bold text-sunset-900 dark:text-white mb-2 text-center">Welcome Back</h2>
            <p className="text-sunset-500 dark:text-sunset-400 text-center mb-6">Sign in to access your paradise</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 bg-sunset-50 dark:bg-sunset-800 border-2 border-sunset-200 dark:border-sunset-700 rounded-xl text-sunset-900 dark:text-white placeholder-sunset-400 focus:outline-none focus:border-sunset-400 focus:ring-4 focus:ring-sunset-400/10 transition-all duration-300"
                  placeholder="Email address"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-sunset-50 dark:bg-sunset-800 border-2 border-sunset-200 dark:border-sunset-700 rounded-xl text-sunset-900 dark:text-white placeholder-sunset-400 focus:outline-none focus:border-sunset-400 focus:ring-4 focus:ring-sunset-400/10 transition-all duration-300 pr-12"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sunset-400 hover:text-sunset-500 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.85 10.85 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" x2="23" y1="1" y2="23" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3.5 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2 animate-fade-in">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" x2="12" y1="8" y2="12" />
                    <line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-sunset-500 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-sunset-500/30 hover:shadow-xl hover:shadow-sunset-500/40 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 8 0 12a8 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 pt-6 border-t border-ocean-100 dark:border-ocean-700 text-center">
              <p className="text-ocean-600 dark:text-ocean-400">
                New to Piel Lighthouse?{" "}
                <Link href="/guest/register" className="text-sunset-500 hover:text-sunset-600 font-semibold transition-colors">
                  Create account
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-ocean-400 dark:text-ocean-500 hover:text-ocean-600 dark:hover:text-ocean-300 transition-colors inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Back to Paradise
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-ocean-500 dark:text-ocean-400 text-sm">© 2024 Piel Lighthouse Resort. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}







