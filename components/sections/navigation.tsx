"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Palmtree, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 20)
      
      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsOpen(false)
  }

  const navLinks = [
    { id: "accommodations", label: "Rooms" },
    { id: "experiences", label: "Experiences" },
    { id: "amenities", label: "Amenities" },
    { id: "activities", label: "Activities" },
    { id: "gallery", label: "Gallery" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/98 backdrop-blur-lg shadow-lg"
          : "bg-white/95 backdrop-blur-sm"
      } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      {/* Top bar */}
      <div className={`bg-primary text-white text-sm py-2 transition-all duration-300 ${scrolled ? "h-0 overflow-hidden opacity-0" : "opacity-100"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center gap-2">
          <Phone className="w-4 h-4" />
          <span>📞 0956-892-9006 | 📍 Sitio Aplaya, Balibago Lian, Batangas</span>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 bg-linear-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
              <Palmtree className="w-6 h-6 text-white" />
              <div className="absolute inset-0 rounded-full bg-primary/30 animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                Piel Lighthouse
              </span>
              <span className="block text-xs text-muted-foreground -mt-1">Beach Resort</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="relative px-4 py-2 text-foreground hover:text-primary font-medium transition-colors rounded-lg hover:bg-muted/50"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
            <Button
              size="sm"
              onClick={() => scrollToSection("contact")}
              className="ml-4 bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-full px-6"
            >
              Reserve Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors relative"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <Menu
                className={`absolute inset-0 transition-all duration-300 ${isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`}
                size={24}
              />
              <X
                className={`absolute inset-0 transition-all duration-300 ${isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`}
                size={24}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pb-6 space-y-2">
            {navLinks.map((link, index) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="block w-full text-left px-4 py-3 rounded-lg hover:bg-muted transition-all duration-200 font-medium text-foreground"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-4">
              <Button
                onClick={() => scrollToSection("contact")}
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                Reserve Now
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
