import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Piel Lighthouse Beach Resort | Tropical Paradise in Batangas",
  description:
    "Experience luxury beachfront accommodations, water activities, and island dining at Piel Lighthouse Beach Resort. Perfect for family getaways and romantic escapes.",
  generator: "Next.js",
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/images/PielLogo.jpg",
        type: "image/jpeg",
      },
    ],
    apple: "/images/PielLogo.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
