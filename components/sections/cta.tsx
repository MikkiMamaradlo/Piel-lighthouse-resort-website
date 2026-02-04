"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Users, ArrowRight, Clock, Star, Sparkles } from "lucide-react"

const offers = [
  {
    title: "Early Bird Special",
    discount: "15% OFF",
    description: "Book 30 days in advance and save on your beachfront getaway",
    validUntil: "March 31, 2026",
    icon: "🦅",
  },
  {
    title: "Family Package",
    discount: "FREE Extra Bed",
    description: "Stay 3 nights or more and get a free extra mattress for the kids",
    validUntil: "Ongoing",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    title: "Weekend Getaway",
    discount: "10% OFF",
    description: "Special rates for weekend stays (Friday-Sunday)",
    validUntil: "Ongoing",
    icon: "🎉",
  },
]

export default function CTASection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="py-24 bg-linear-to-br from-primary via-primary to-blue-800 relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-size-[40px_40px]" />
      </div>
      
      {/* Decorative circles */}
      <div className="absolute top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-white/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main CTA */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full mb-6 border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Limited Time Offers
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6">
            Experience Paradise
            <br />
            <span className="text-amber-400">Without Breaking the Bank</span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-10">
            Book your dream beach vacation today and create memories that last a lifetime. 
            Don't miss out on our exclusive offers!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => window.location.href = "/guest/login"}
              className="bg-amber-500 hover:bg-amber-600 text-white text-lg px-10 py-7 rounded-full shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 hover:scale-105"
            >
              Book Your Stay
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("contact")}
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50 text-lg px-10 py-7 rounded-full transition-all duration-300"
            >
              Contact Us
            </Button>
          </div>
        </div>

        {/* Special offers cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {offers.map((offer, index) => (
            <div
              key={offer.title}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{offer.icon}</span>
                <span className="bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {offer.discount}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{offer.title}</h3>
              <p className="text-white/70 mb-4">{offer.description}</p>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Clock className="w-4 h-4" />
                <span>Valid until {offer.validUntil}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center items-center gap-8 mt-16 pt-8 border-t border-white/10">
          {[
            { icon: Star, label: "5-Star Rating" },
            { icon: Calendar, label: "Instant Confirmation" },
            { icon: Users, label: "500+ Happy Guests" },
          ].map((badge, index) => (
            <div key={badge.label} className="flex items-center gap-2 text-white/70">
              <badge.icon className="w-5 h-5" />
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
