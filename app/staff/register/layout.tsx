"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (mounted) {
      const checkAuth = async () => {
        try {
          const response = await fetch("/api/staff/auth/check")
          const data = await response.json()
          if (data.authenticated) {
            router.push("/staff")
          }
        } catch {
          // Not logged in, stay on register page
        }
      }
      checkAuth()
    }
  }, [mounted, router])

  return <>{children}</>
}
