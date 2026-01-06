"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="hidden sm:inline font-bold text-primary text-lg">Piel Lighthouse</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#accommodations" className="text-foreground hover:text-primary transition">
              Rooms
            </Link>
            <Link href="#amenities" className="text-foreground hover:text-primary transition">
              Amenities
            </Link>
            <Link href="#activities" className="text-foreground hover:text-primary transition">
              Activities
            </Link>
            <Link href="#gallery" className="text-foreground hover:text-primary transition">
              Gallery
            </Link>
            <Button className="bg-primary hover:bg-primary/90">Book Now</Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="#accommodations" className="block px-3 py-2 hover:bg-muted rounded">
              Rooms
            </Link>
            <Link href="#amenities" className="block px-3 py-2 hover:bg-muted rounded">
              Amenities
            </Link>
            <Link href="#activities" className="block px-3 py-2 hover:bg-muted rounded">
              Activities
            </Link>
            <Link href="#gallery" className="block px-3 py-2 hover:bg-muted rounded">
              Gallery
            </Link>
            <Button className="w-full bg-primary hover:bg-primary/90">Book Now</Button>
          </div>
        )}
      </div>
    </nav>
  )
}
