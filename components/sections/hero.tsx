"use client"

import { Button } from "@/components/ui/button"

export default function Hero() {
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
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed animate-fade-in"
        style={{
          backgroundImage: "url(/images/piel7.jpg)",
        }}
      >
        {/* Animated overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/20 to-black/40" />
        {/* Decorative waves */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-primary/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full mb-6 border border-white/20 animate-pulse">
          🌴 Now Open for Bookings
        </span>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 text-balance drop-shadow-lg animate-slide-up">
          Piel Lighthouse
        </h1>

        <p className="text-xl sm:text-2xl text-white/95 mb-8 max-w-2xl text-pretty drop-shadow-md font-light animate-slide-up-delay">
          Your Tropical Paradise Awaits at Batangas
        </p>

        <div className="animate-fade-in-delay">
          <Button
            size="lg"
            onClick={() => scrollToSection("accommodations")}
            className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-bounce-slow"
          >
            Explore Now
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-fade-in-delay-2">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-scroll-dot" />
        </div>
      </div>
    </section>
  )
}
