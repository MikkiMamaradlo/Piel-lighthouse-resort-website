"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Waves, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

export default function GuestLoginPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-ocean-50 via-sky-50 to-ocean-100 dark:from-ocean-950 dark:via-ocean-900 dark:to-ocean-950 transition-colors duration-300">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400/20 dark:bg-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-1/3 w-64 h-64 bg-cyan-400/20 dark:bg-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-orange-500/20 dark:bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="relative w-full max-w-md p-6">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="absolute top-0 right-0 p-3 rounded-xl bg-slate-100 dark:bg-ocean-800 hover:bg-slate-200 dark:hover:bg-ocean-700 transition-colors shadow-lg"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-amber-400/30 rounded-2xl blur-xl animate-pulse"></div>
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 rounded-2xl shadow-2xl shadow-amber-500/40 transform hover:scale-110 transition-transform duration-300 overflow-hidden">
              <Image 
                src="/images/PielLogo.jpg" 
                alt="Piel Lighthouse Logo" 
                width={80} 
                height={80}
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center shadow-lg">
              <Waves className="w-4 h-4 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 drop-shadow-lg">Piel Lighthouse</h1>
          <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-ocean-300">
            <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-sm font-medium tracking-wide">Guest Portal</span>
            <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
        </div>

        {/* Login Form */}
        <div className="relative bg-white/95 dark:bg-ocean-900/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
          {/* Progress bar */}
          <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"></div>

          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 text-center">Welcome Back</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-ocean-800 border-2 border-slate-200 dark:border-ocean-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
                  placeholder="Email"
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
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-ocean-800 border-2 border-slate-200 dark:border-ocean-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors pr-12"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-500 transition-colors"
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
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
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
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-ocean-700 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                New to Piel Lighthouse?{" "}
                <Link href="/guest/register" className="text-amber-500 hover:text-amber-600 font-medium transition-colors">
                  Create account
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 dark:text-ocean-300 text-sm">© 2024 Piel Lighthouse Resort. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
