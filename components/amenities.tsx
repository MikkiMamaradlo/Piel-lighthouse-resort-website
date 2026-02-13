"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Waves, 
  UtensilsCrossed, 
  Mic2, 
  Bed, 
  Building2, 
  Bath, 
  Baby, 
  Anchor,
  Armchair,
  Sparkles,
  Wifi,
  Car
} from "lucide-react"

const amenities = [
  { name: "Crystal Kayak", description: "Explore crystal clear waters with our kayak rentals", icon: Waves, color: "bg-blue-500" },
  { name: "Table Cottages", description: "Beachfront dining with ocean views", icon: UtensilsCrossed, color: "bg-amber-500" },
  { name: "VideoKe", description: "Entertainment lounge with karaoke facilities", icon: Mic2, color: "bg-purple-500" },
  { name: "Spacious Rooms", description: "Well-appointed rooms with modern amenities", icon: Bed, color: "bg-indigo-500" },
  { name: "Function Hall", description: "Perfect venue for events and celebrations", icon: Building2, color: "bg-rose-500" },
  { name: "Jacuzzi", description: "Relax in our heated jacuzzi with ocean views", icon: Bath, color: "bg-cyan-500" },
  { name: "Kiddie Pool", description: "Safe and fun pool area for children", icon: Baby, color: "bg-pink-500" },
  { name: "Paddle Board", description: "Try stand-up paddleboarding in calm waters", icon: Anchor, color: "bg-teal-500" },
  { name: "Massage Chair", description: "Therapeutic massage chairs for your wellness", icon: Armchair, color: "bg-orange-500" },
  { name: "Free WiFi", description: "High-speed internet throughout the resort", icon: Wifi, color: "bg-green-500" },
  { name: "Parking", description: "Secure parking for guests", icon: Car, color: "bg-gray-500" },
  { name: "Clean Facilities", description: "Spotless restrooms and shower areas", icon: Sparkles, color: "bg-yellow-500" },
]

export default function Amenities() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="amenities" className="py-24 bg-linear-to-b dark:from-slate-900 dark:to-slate-800 relative" aria-labelledby="amenities-heading">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-linear-to-b from-primary/5 to-transparent rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
            🛠️ Amenities
          </span>
          <h2 id="amenities-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-5">
            <span className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              World-Class Amenities
            </span>
          </h2>
          <p className="text-lg text-muted-foreground dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Enjoy a wide range of facilities and activities for the perfect beach getaway. 
            Everything you need for relaxation and fun.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenities.map((item, index) => (
            <Card 
              key={item.name} 
              className="p-6 bg-white dark:bg-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer border border-muted dark:border-slate-700"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* View all amenities */}
        <div className="text-center mt-12">
          <Button 
            variant="ghost" 
            onClick={() => scrollToSection("amenities")}
            className="text-primary dark:text-amber-400 font-semibold hover:text-primary/80 dark:hover:text-amber-300 transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            View All Amenities
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  )
}
