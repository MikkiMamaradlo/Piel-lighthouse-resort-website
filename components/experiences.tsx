"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UtensilsCrossed, Tent, Sun, ArrowRight, Star } from "lucide-react"

const experiences = [
  {
    title: "Golden Hour Dining",
    description: "Enjoy exquisite meals overlooking the sunset with fresh seafood and tropical delights",
    image: "/images/piel7.jpg",
    icon: UtensilsCrossed,
    color: "from-amber-500 to-orange-500",
    rating: 4.9,
    reviews: 128,
  },
  {
    title: "Beach Glamping",
    description: "Experience unique beachfront camping with modern amenities and starlit nights",
    image: "/images/piel5.jpg",
    icon: Tent,
    color: "from-purple-500 to-indigo-500",
    rating: 4.8,
    reviews: 95,
  },
  {
    title: "Twilight Escape",
    description: "Wade through calm waters as the sun sets, creating magical memories with loved ones",
    image: "/images/piel8.jpg",
    icon: Sun,
    color: "from-pink-500 to-rose-500",
    rating: 5.0,
    reviews: 67,
  },
]

export default function Experiences() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="experiences" className="py-24 bg-linear-to-b dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden" aria-labelledby="experiences-heading">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-linear-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium rounded-full mb-6">
            <Star className="w-4 h-4" />
            ✨ Experiences
          </span>
          <h2 id="experiences-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-5">
            <span className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Unforgettable Experiences
            </span>
          </h2>
          <p className="text-lg text-muted-foreground dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Create lasting memories with our exclusive beachfront experiences designed for 
            relaxation, adventure, and romance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {experiences.map((experience, index) => (
            <Card 
              key={experience.title} 
              className="relative overflow-hidden bg-white dark:bg-slate-800 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 group cursor-pointer border-0 dark:border-slate-700 hover:-translate-y-2"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image with zoom effect */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={experience.image || "/placeholder.svg"}
                  alt={experience.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* Icon badge */}
                <div className={`absolute top-4 left-4 w-14 h-14 rounded-xl bg-linear-to-br ${experience.color} flex items-center justify-center shadow-lg transition-transform duration-300 ${
                  hoveredIndex === index ? "scale-110" : ""
                }`}>
                  <experience.icon className="w-7 h-7 text-white" />
                </div>

                {/* Rating badge */}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 transition-all duration-300 group-hover:scale-105">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-semibold">{experience.rating}</span>
                </div>

                {/* Title on image */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-all duration-300">
                  <h3 className="text-2xl font-bold mb-1 group-hover:translate-y-0 transition-transform">{experience.title}</h3>
                  <p className="text-white/80 text-sm group-hover:opacity-100 transition-opacity">{experience.reviews} reviews</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 bg-white dark:bg-slate-800 relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary/20 to-transparent transform -translate-y-1/2" />
                
                <p className="text-muted-foreground leading-relaxed mb-6 group-hover:text-foreground transition-colors duration-300">
                  {experience.description}
                </p>

                <Button 
                  variant="ghost" 
                  onClick={() => scrollToSection("contact")}
                  className="w-full justify-between text-primary dark:text-amber-400 hover:text-primary dark:hover:text-amber-300 hover:bg-primary/5 dark:hover:bg-slate-700 transition-all duration-300 group-hover:shadow-sm rounded-lg"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </Card>
          ))}
        </div>

        {/* View all experiences CTA */}
        <div className="text-center mt-12">
          <Button 
            onClick={() => scrollToSection("experiences")}
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
          >
            View All Experiences
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
