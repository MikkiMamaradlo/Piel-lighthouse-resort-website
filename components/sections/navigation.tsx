"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Palmtree, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [activeSection, setActiveSection] = useState("")

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

      // Update active section
      const sections = ["accommodations", "experiences", "amenities", "activities", "gallery", "contact"]
      for (const sectionId of sections.reverse()) {
        const element = document.getElementById(sectionId)
        if (element && currentScrollY >= element.offsetTop - 200) {
          setActiveSection(sectionId)
          break
        }
      }
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled
          ? "bg-white/98 backdrop-blur-lg shadow-lg border-b border-gray-100"
          : "bg-white/95 backdrop-blur-md"
      } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      {/* Top bar */}
      <div className={`bg-gradient-to-r from-primary to-primary/90 text-white text-sm py-2.5 transition-all duration-500 ease-out ${scrolled ? "h-0 overflow-hidden opacity-0" : "opacity-100"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center items-center gap-x-6 gap-y-1">
          <a href="tel:09568929006" className="flex items-center gap-2 hover:text-white/80 transition-colors">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>0956-892-9006</span>
          </a>
          <span className="hidden sm:inline text-white/60">|</span>
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>Sitio Aplaya, Balibago Lian, Batangas</span>
          </span>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="Go to homepage">
            <div className="relative">
              <div className="relative w-11 h-11 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 overflow-hidden">
                <Palmtree className="w-6 h-6 text-white relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              {/* Decorative element */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-foreground text-xl group-hover:text-primary transition-all duration-300 tracking-tight">
                Piel Lighthouse
              </span>
              <span className="block text-xs text-muted-foreground -mt-0.5 font-medium tracking-wider uppercase">Beach Resort</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:text-primary ${
                  activeSection === link.id 
                    ? "text-primary bg-primary/5" 
                    : "text-foreground/80 hover:bg-muted/50"
                }`}
              >
                {link.label}
                <span className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-primary transition-all duration-300 ${
                  activeSection === link.id ? "w-6" : "w-0 group-hover:w-6"
                }`} />
              </button>
            ))}
            <div className="h-6 w-px bg-gray-200 mx-2" />
            <Button
              size="sm"
              onClick={() => scrollToSection("contact")}
              className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-full px-6 py-2.5 font-medium"
            >
              Reserve Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 relative group"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <Menu
                className={`absolute inset-0 transition-all duration-300 ease-out ${
                  isOpen ? "rotate-90 opacity-0 scale-90" : "rotate-0 opacity-100 scale-100"
                }`}
                size={24}
              />
              <X
                className={`absolute inset-0 transition-all duration-300 ease-out ${
                  isOpen ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-90"
                }`}
                size={24}
              />
            </div>
            {/* Background pulse on mobile */}
            <div className={`absolute inset-0 rounded-xl bg-primary/10 scale-0 transition-all duration-300 ${
              isOpen ? "scale-100" : ""
            }`} />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pb-6 space-y-1">
            {navLinks.map((link, index) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`block w-full text-left px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${
                  activeSection === link.id
                    ? "text-primary bg-primary/10"
                    : "text-foreground/80 hover:bg-gray-50 hover:text-primary"
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className="flex items-center gap-3">
                  <span className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    activeSection === link.id ? "bg-primary" : "bg-gray-300"
                  }`} />
                  {link.label}
                </span>
              </button>
            ))}
            {/* Contact info in mobile menu */}
            <div className="pt-4 mt-4 border-t border-gray-100 px-4">
              <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
                <a href="tel:09568929006" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>0956-892-9006</span>
                </a>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Sitio Aplaya, Balibago Lian, Batangas</span>
                </span>
              </div>
              <Button
                onClick={() => scrollToSection("contact")}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-medium shadow-lg shadow-primary/20"
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
