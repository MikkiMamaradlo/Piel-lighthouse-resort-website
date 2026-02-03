"use client"

import { Card } from "@/components/ui/card"
import { 
  Waves, 
  Volleyball, 
  Sun, 
  Utensils, 
  Music, 
  Sparkles,
  Dumbbell,
  Palmtree,
  MessageCircle
} from "lucide-react"

const activities = [
  { title: "Water Sports", description: "Kayaking, paddle boarding, and water activities in crystal clear waters", icon: Waves, color: "from-blue-400 to-blue-600", accent: "text-blue-500" },
  { title: "Beach Volleyball", description: "Competitive or casual volleyball games on our sandy beach courts", icon: Volleyball, color: "from-amber-400 to-amber-600", accent: "text-amber-500" },
  { title: "Beach Relaxation", description: "Unwind on pristine sands with stunning ocean views and gentle waves", icon: Sun, color: "from-orange-400 to-orange-600", accent: "text-orange-500" },
  { title: "Dining Experience", description: "Fresh seafood and local cuisine at our beachfront restaurants", icon: Utensils, color: "from-red-400 to-red-600", accent: "text-red-500" },
  { title: "Entertainment", description: "Karaoke nights, live music, and evening entertainment by the beach", icon: Music, color: "from-purple-400 to-purple-600", accent: "text-purple-500" },
  { title: "Wellness & Spa", description: "Spa services, massage, and relaxation treatments for ultimate comfort", icon: Sparkles, color: "from-pink-400 to-pink-600", accent: "text-pink-500" },
  { title: "Beach Bonfire", description: "Evening bonfire gatherings with music and marshmallows", icon: Palmtree, color: "from-green-400 to-green-600", accent: "text-green-500" },
  { title: "Sunset Watching", description: "Breathtaking sunset views from our beachfront vantage points", icon: Dumbbell, color: "from-cyan-400 to-cyan-600", accent: "text-cyan-500" },
]

export default function Activities() {
  return (
    <section id="activities" className="py-24 bg-linear-to-b from-blue-50/50 via-white to-blue-50/30 relative" aria-labelledby="activities-heading">
      {/* Background decorations */}
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-secondary/10 text-secondary text-sm font-medium rounded-full mb-6">
            🎯 Activities
          </span>
          <h2 id="activities-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-5">
            <span className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Activities & Experiences
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Create unforgettable memories with exciting activities and relaxing experiences 
            designed for all ages and preferences.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((activity, index) => (
            <Card 
              key={activity.title} 
              className="p-6 text-center bg-white hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 group overflow-hidden relative border-0"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Background gradient decoration */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${activity.color} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-200 group-hover:opacity-10 transition-all duration-500`} />
              
              {/* Icon */}
              <div className={`relative w-20 h-20 mx-auto mb-5 rounded-2xl bg-linear-to-br ${activity.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl transition-all duration-300`}>
                <activity.icon className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                {activity.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground transition-colors duration-300">
                {activity.description}
              </p>

              {/* Hover arrow indicator */}
              <div className={`mt-4 ${activity.accent} transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0`}>
                <MessageCircle className="w-5 h-5 mx-auto" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
