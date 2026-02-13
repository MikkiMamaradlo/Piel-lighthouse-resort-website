"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Users, Wifi, Wind, Tv, Refrigerator, ShowerHead, Star } from "lucide-react"
import { openImageModal } from "@/components/room-details-modal"

const rooms = [
  {
    name: "Beachfront Room",
    capacity: "up to 4 pax",
    image: "/images/piel1.jpg",
    price: "₱3,500",
    period: "/night",
    inclusions: [
      { icon: Users, text: "Direct beach access" },
      { icon: Wind, text: "Air-conditioned" },
      { icon: Refrigerator, text: "Mini-fridge" },
      { icon: Tv, text: "Flat-screen TV" },
      { icon: ShowerHead, text: "Hot shower" },
      { icon: Wifi, text: "Free WiFi" },
    ],
    popular: true,
    features: ["Table Cottage", "Extra mattress"],
    description: "Wake up to the sound of waves in our Beachfront Room. This cozy accommodation offers direct beach access and stunning ocean views.",
  },
  {
    name: "Barkada Room",
    capacity: "up to 10 pax",
    image: "/images/piel3.jpg",
    price: "₱5,500",
    period: "/night",
    inclusions: [
      { icon: Users, text: "Spacious layout" },
      { icon: Wind, text: "Air-conditioned" },
      { icon: Refrigerator, text: "Mini-fridge" },
      { icon: Tv, text: "Flat-screen TV" },
      { icon: ShowerHead, text: "Hot shower" },
      { icon: Wifi, text: "Free WiFi" },
    ],
    popular: false,
    features: ["Table Cottage", "Extra mattresses"],
    description: "Our spacious Barkada Room is designed for groups and families with ample space for up to 10 guests.",
  },
  {
    name: "Family Room",
    capacity: "up to 15 pax",
    image: "/images/piel2.jpg",
    price: "₱7,500",
    period: "/night",
    inclusions: [
      { icon: Users, text: "Large family size" },
      { icon: Wind, text: "Air-conditioned" },
      { icon: Refrigerator, text: "Mini-fridge" },
      { icon: Tv, text: "Flat-screen TV" },
      { icon: ShowerHead, text: "Enclosed shower" },
      { icon: Wifi, text: "Free WiFi" },
    ],
    popular: false,
    features: ["Private toilet", "Table Cottage"],
    description: "The ultimate family accommodation! This expansive room comfortably hosts up to 15 guests.",
  },
]

export default function Accommodations() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="accommodations" className="py-24 bg-linear-to-b dark:from-slate-900 dark:to-slate-800 relative" aria-labelledby="accommodations-heading">
      {/* Background decorations */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
            <Star className="w-4 h-4" />
            🏠 Accommodations
          </span>
          <h2 id="accommodations-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-5">
            <span className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Comfortable Rooms
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Choose from our range of spacious rooms designed for your comfort and relaxation. 
            Each room features modern amenities with stunning ocean views.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <div
              key={room.name}
              className={`relative overflow-hidden rounded-2xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 group cursor-pointer border-0 hover:-translate-y-3 ${room.popular ? "ring-2 ring-amber-500 bg-white dark:bg-slate-800" : "bg-white dark:bg-slate-800/90"}`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Popular badge */}
              {room.popular && (
                <div className="absolute top-4 left-4 z-20">
                  <span className="bg-linear-to-r from-amber-500 to-amber-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Image container - clickable to view full image */}
              <div 
                className="relative h-72 overflow-hidden cursor-pointer"
                onClick={() => openImageModal(room.image)}
              >
                <img
                  src={room.image || "/placeholder.svg"}
                  alt={room.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                
                {/* Capacity badge */}
                <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-foreground shadow-lg flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>{room.capacity}</span>
                </div>

                {/* Price tag */}
                <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl px-5 py-2.5 shadow-xl">
                  <span className="text-2xl font-bold text-foreground">{room.price}</span>
                  <span className="text-sm text-muted-foreground ml-1">{room.period}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {room.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-5 line-clamp-2 group-hover:text-foreground/80 transition-colors">
                  {room.description}
                </p>

                {/* Inclusions */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {room.inclusions.slice(0, 6).map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                        <item.icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <span className="truncate">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {room.features.map((feature, i) => (
                    <span key={i} className="text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300 font-medium">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover effect border */}
              <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/30 rounded-2xl transition-all duration-500 pointer-events-none" />

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/0 group-hover:bg-primary/100 transition-all duration-500 rounded-b-2xl" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Not sure which room fits your needs?</p>
          <Button 
            variant="outline" 
            onClick={() => scrollToSection("contact")}
            className="rounded-full px-8"
          >
            Compare All Rooms
          </Button>
        </div>
      </div>
    </section>
  )
}