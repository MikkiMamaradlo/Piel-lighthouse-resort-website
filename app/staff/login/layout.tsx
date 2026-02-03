import type { ReactNode } from 'react'

export default function StaffLoginLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}
