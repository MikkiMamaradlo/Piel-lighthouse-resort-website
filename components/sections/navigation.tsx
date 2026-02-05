"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Phone, MapPin, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [activeSection, setActiveSection] = useState("")
  const [isGuestLoggedIn, setIsGuestLoggedIn] = useState(false)

  useEffect(() => {
    // Check if guest is logged in
    const checkGuestAuth = async () => {
      try {
        const response = await fetch("/api/guest/auth/check")
        const data = await response.json()
        setIsGuestLoggedIn(data.authenticated)
      } catch (error) {
        setIsGuestLoggedIn(false)
      }
    }
    checkGuestAuth()

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

  const handleLogout = async () => {
    try {
      await fetch("/api/guest/auth", { 
        method: "DELETE",
        credentials: "include" 
      })
      setIsGuestLoggedIn(false)
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

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
                <Image 
                  src="/images/PielLogo.jpg" 
                  alt="Piel Lighthouse Logo" 
                  width={44} 
                  height={44}
                  className="object-cover rounded-lg"
                />
              </div>
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
          </div>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center gap-3">
            {isGuestLoggedIn ? (
              <>
                <Link 
                  href="/guest/dashboard" 
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-primary transition-colors rounded-lg hover:bg-primary/5"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-red-600 transition-colors rounded-lg hover:bg-muted/50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/guest/login" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-lg hover:bg-muted/50">
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Button 
                  onClick={() => scrollToSection("contact")}
                  size="sm"
                  className="shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Book Now
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeSection === link.id 
                      ? "text-primary bg-primary/5" 
                      : "text-foreground/80 hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <div className="flex items-center gap-2 px-4 pt-2">
                {isGuestLoggedIn ? (
                  <>
                    <Link 
                      href="/guest/dashboard" 
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-primary bg-primary/5 rounded-lg transition-all duration-300"
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/guest/login" 
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-lg transition-all duration-300"
                    >
                      <User className="w-4 h-4" />
                      Login
                    </Link>
                    <Button 
                      onClick={() => scrollToSection("contact")}
                      size="sm"
                      className="flex-1 shadow-md"
                    >
                      Book Now
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
