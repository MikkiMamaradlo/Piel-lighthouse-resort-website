"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Wifi, Wind, Tv, Refrigerator, ShowerHead, Star, Check, ArrowRight } from "lucide-react"
import { rooms } from "@/components/room-details-modal"

const accommodationsRooms = [
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
    features: ["Table Cottage", "Extra mattress"]
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
    features: ["Table Cottage", "Extra mattresses"]
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
    features: ["Private toilet", "Table Cottage"]
  },
]

export default function Accommodations() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <section id="accommodations" className="py-24 bg-linear-to-b from-slate-50 to-white relative" aria-labelledby="accommodations-heading">
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
          {accommodationsRooms.map((room, index) => (
            <Card
              key={room.name}
              className={`relative overflow-hidden bg-white hover:shadow-2xl transition-all duration-500 group cursor-pointer border-0 ${
                room.popular ? "ring-2 ring-amber-500" : ""
              }`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Popular badge */}
              {room.popular && (
                <div className="absolute top-4 left-4 z-20">
                  <span className="bg-linear-to-r from-amber-500 to-amber-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    ⭐ Most Popular
                  </span>
                </div>
              )}

              {/* Image container */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={room.image || "/placeholder.svg"}
                  alt={room.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-120"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Price tag */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                  <span className="text-2xl font-bold text-foreground">{room.price}</span>
                  <span className="text-sm text-muted-foreground">{room.period}</span>
                </div>

                {/* Quick info overlay */}
                <div className={`absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium text-foreground transition-all duration-300 ${
                  hoveredCard === index ? "opacity-0 translate-x-4" : "opacity-100"
                }`}>
                  <Users className="w-4 h-4 inline mr-1" />
                  {room.capacity}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {room.name}
                </h3>

                {/* Inclusions */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {room.inclusions.slice(0, 6).map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <item.icon className="w-4 h-4 text-primary" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {room.features.map((feature, i) => (
                    <span key={i} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Button */}
                <Button 
                  onClick={() => {
                    const modal = document.getElementById('room-details-modal')
                    if (modal) {
                      // Dispatch event to open modal
                      window.dispatchEvent(new CustomEvent('open-room-modal', { detail: room }))
                    }
                  }}
                  className={`w-full transition-all duration-300 group-hover:shadow-lg ${
                    room.popular 
                      ? "bg-amber-500 hover:bg-amber-600 text-white" 
                      : "bg-primary hover:bg-primary/90 text-primary-foreground"
                  }`}
                >
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              {/* Hover effect border */}
              <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/20 rounded-xl transition-all duration-500" />
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Not sure which room fits your needs?</p>
          <Button variant="outline" className="rounded-full px-8">
            Compare All Rooms
          </Button>
        </div>
      </div>
    </section>
  )
}
