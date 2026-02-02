"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, Star, MapPin } from "lucide-react"

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Array<{
    left: string
    top: string
    animationDelay: string
    animationDuration: string
  }>>([])

  useEffect(() => {
    setIsLoaded(true)
    // Generate particles only on client to avoid hydration mismatch
    setParticles(
      [...Array(20)].map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${3 + Math.random() * 4}s`,
      }))
    )
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      className="relative w-full min-h-screen pt-16 overflow-hidden"
      aria-label="Hero section"
    >
      {/* Animated background with parallax */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-100 ease-out ${isLoaded ? "scale-110" : "scale-100"}`}
        style={{
          backgroundImage: "url(/images/piel7.jpg)",
          transform: `scale(1.1) translate(${mousePosition.x}px, ${mousePosition.y}px)`,
        }}
      >
        {/* Animated overlay gradients */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-900/40 to-slate-900/80" />
        
        {/* Animated wave effect */}
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-linear-to-t from-primary/30 to-transparent animate-pulse" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.animationDelay,
                animationDuration: particle.animationDuration,
              }}
            />
          ))}
        </div>
        
        {/* Sun glow effect */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
        {/* Badge */}
        <div className={`inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md text-white text-sm font-medium rounded-full mb-8 border border-white/20 transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>🌴 Now Open for Bookings</span>
          <MapPin className="w-4 h-4 text-red-400" />
          <span>Lian, Batangas</span>
        </div>

        {/* Main heading */}
        <h1 className={`text-5xl sm:text-6xl lg:text-8xl font-bold text-white mb-6 text-balance drop-shadow-2xl transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <span className="bg-linear-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
            Piel Lighthouse
          </span>
        </h1>

        {/* Subheading with typing effect */}
        <p className="text-xl sm:text-2xl lg:text-3xl text-white/90 mb-10 max-w-3xl text-pretty font-light leading-relaxed transition-all duration-700 delay-200">
          Your Tropical Paradise Awaits at Batangas
          <br />
          <span className="text-lg text-amber-300">Experience luxury by the sea</span>
        </p>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 mb-16 transition-all duration-700 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <Button
            size="lg"
            onClick={() => scrollToSection("accommodations")}
            className="bg-amber-500 hover:bg-amber-600 text-white text-lg px-10 py-7 rounded-full shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
          >
            Explore Rooms
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollToSection("contact")}
            className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50 text-lg px-10 py-7 rounded-full transition-all duration-300"
          >
            Book Now
          </Button>
        </div>

        {/* Quick stats */}
        <div className={`flex items-center gap-8 sm:gap-12 text-white/80 transition-all duration-700 delay-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white">50+</div>
            <div className="text-sm">Beachfront Rooms</div>
          </div>
          <div className="w-px h-12 bg-white/20" />
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white">9+</div>
            <div className="text-sm">Amenities</div>
          </div>
          <div className="w-px h-12 bg-white/20 hidden sm:block" />
          <div className="text-center hidden sm:block">
            <div className="text-3xl sm:text-4xl font-bold text-white">5★</div>
            <div className="text-sm">Rating</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-700 delay-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/60 text-sm">Scroll to explore</span>
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white rounded-full animate-scroll-dot" />
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="rgb(248, 250, 252)"
          />
        </svg>
      </div>
    </section>
  )
}
