"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"

const testimonials = [
  {
    name: "Maria Santos",
    role: "Family Vacation",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    text: "Absolutely amazing experience! The beachfront room was perfect, and the staff was incredibly hospitable. Our kids loved the kiddie pool and we enjoyed the sunset dining. Will definitely be back!",
    stayDate: "December 2025",
  },
  {
    name: "John & Lisa Chen",
    role: "Couple's Getaway",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    text: "We came here for our honeymoon and it exceeded all expectations. The beach glamping experience was magical, and the jacuzzi under the stars was romantic. Highly recommended for couples!",
    stayDate: "November 2025",
  },
  {
    name: "Mark Rivera",
    role: "Barkada Trip",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    text: "Perfect for group trips! Our barkada room was spacious and the videoke nights were legendary. The beach volleyball and water sports kept us entertained. Great value for money!",
    stayDate: "October 2025",
  },
  {
    name: "Emily Thompson",
    role: "Solo Traveler",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    text: "A peaceful retreat away from the city noise. Loved the spa services and morning beach walks. The staff made me feel so welcome. Already planning my next visit!",
    stayDate: "September 2025",
  },
  {
    name: "David & Jennifer",
    role: "Anniversary Celebration",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    text: "We celebrated our anniversary here and it was perfect. The special dinner setup on the beach was romantic, and the room decoration was a lovely touch. Thank you Piel Lighthouse!",
    stayDate: "August 2025",
  },
  {
    name: "Robert Garcia",
    role: "Corporate Event",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    text: "We hosted our team building here and the function hall was excellent. The amenities cater to all needs and the staff was professional. A great venue for events!",
    stayDate: "July 2025",
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const current = testimonials[currentIndex]

  return (
    <section className="py-24 bg-linear-to-b dark:from-slate-900 dark:to-slate-800 relative" aria-labelledby="testimonials-heading">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium rounded-full mb-6">
            💬 Testimonials
          </span>
          <h2 id="testimonials-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-5">
            <span className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              What Our Guests Say
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what our guests have to say about 
            their unforgettable experiences at Piel Lighthouse.
          </p>
        </div>

        {/* Featured testimonial card */}
        <div className="relative">
          <Card className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 p-8 md:p-12 border-0 relative overflow-hidden hover:-translate-y-1">
            {/* Decorative quotes */}
            <Quote className="absolute top-6 left-8 w-16 h-16 text-primary/10" />
            <Quote className="absolute bottom-6 right-8 w-16 h-16 text-primary/10 transform rotate-180" />

            <div className="grid md:grid-cols-3 gap-8 items-center relative z-10">
              {/* Avatar */}
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-500/20 mb-4 group-hover:border-amber-500/40 transition-all duration-300">
                  <img
                    src={current.avatar || "/placeholder-user.jpg"}
                    alt={current.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < current.rating ? "text-amber-500 fill-amber-500" : "text-gray-300 dark:text-gray-600"}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{current.stayDate}</p>
              </div>

              {/* Content */}
              <div className="md:col-span-2 text-center md:text-left">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6 italic">
                  "{current.text}"
                </p>
                <div>
                  <h4 className="text-xl font-bold text-foreground">{current.name}</h4>
                  <p className="text-primary font-medium">{current.role}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Navigation buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white hover:shadow-xl hover:scale-110 transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-primary w-8"
                      : "bg-primary/30 hover:bg-primary/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white hover:shadow-xl hover:scale-110 transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {[
            { value: "500+", label: "Happy Guests" },
            { value: "5.0", label: "Average Rating" },
            { value: "98%", label: "Would Recommend" },
            { value: "50+", label: "5-Star Reviews" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
