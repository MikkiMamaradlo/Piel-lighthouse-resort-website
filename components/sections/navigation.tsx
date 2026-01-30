"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/98 backdrop-blur-md shadow-md"
          : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="hidden sm:inline font-bold text-primary text-lg group-hover:text-primary/80 transition-colors">
              Piel Lighthouse
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("accommodations")}
              className="text-foreground hover:text-primary transition-colors font-medium relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
            >
              Rooms
            </button>
            <button
              onClick={() => scrollToSection("amenities")}
              className="text-foreground hover:text-primary transition-colors font-medium relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
            >
              Amenities
            </button>
            <button
              onClick={() => scrollToSection("activities")}
              className="text-foreground hover:text-primary transition-colors font-medium relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
            >
              Activities
            </button>
            <button
              onClick={() => scrollToSection("gallery")}
              className="text-foreground hover:text-primary transition-colors font-medium relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
            >
              Gallery
            </button>
            <Button
              size="sm"
              onClick={() => scrollToSection("contact")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all"
            >
              Reserve Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => scrollToSection("accommodations")}
              className="block w-full text-left px-3 py-2 hover:bg-muted rounded-lg transition-colors font-medium"
            >
              Rooms
            </button>
            <button
              onClick={() => scrollToSection("amenities")}
              className="block w-full text-left px-3 py-2 hover:bg-muted rounded-lg transition-colors font-medium"
            >
              Amenities
            </button>
            <button
              onClick={() => scrollToSection("activities")}
              className="block w-full text-left px-3 py-2 hover:bg-muted rounded-lg transition-colors font-medium"
            >
              Activities
            </button>
            <button
              onClick={() => scrollToSection("gallery")}
              className="block w-full text-left px-3 py-2 hover:bg-muted rounded-lg transition-colors font-medium"
            >
              Gallery
            </button>
            <Button
              onClick={() => scrollToSection("contact")}
              className="w-full bg-primary hover:bg-primary/90 mt-2"
            >
              Reserve Now
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
