"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail, Phone, MapPin, Send, Clock, Calendar, MessageSquare, CheckCircle, User, LogIn } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Contact() {
  const router = useRouter()
  const [isGuestLoggedIn, setIsGuestLoggedIn] = useState(false)
  const [user, setUser] = useState<{ fullName: string; email: string; phone: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: "",
    roomType: "",
    message: "",
  })

  // Check if guest is logged in
  useEffect(() => {
    const checkGuestAuth = async () => {
      try {
        const response = await fetch("/api/guest/auth/check")
        const data = await response.json()
        setIsGuestLoggedIn(data.authenticated)
        if (data.user) {
          setUser(data.user)
          // Pre-fill form if logged in
          setFormData(prev => ({
            ...prev,
            name: data.user.fullName || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
          }))
        }
      } catch (error) {
        setIsGuestLoggedIn(false)
      }
    }
    checkGuestAuth()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const roomOptions = [
    { id: "room1", value: "beachfront", label: "Beachfront Room (up to 4 pax)" },
    { id: "room2", value: "barkada", label: "Barkada Room (up to 10 pax)" },
    { id: "room3", value: "family", label: "Family Room (up to 15 pax)" },
  ]

  const getRoomDisplayName = (value: string) => {
    const room = roomOptions.find(r => r.value === value)
    return room ? room.label : "Not specified"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if guest is logged in
    if (!isGuestLoggedIn) {
      router.push("/guest/login")
      return
    }
    
    setLoading(true)

    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn)
      const checkOutDate = new Date(formData.checkOut)
      if (checkOutDate <= checkInDate) {
        toast({
          title: "Validation Error",
          description: "Check-out date must be after check-in date",
          variant: "destructive",
        })
        setLoading(false)
        return
      }
    }

    // Get room display name and ID
    const roomOption = roomOptions.find(r => r.value === formData.roomType)
    
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          roomId: roomOption?.id || "",
          roomType: getRoomDisplayName(formData.roomType),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit booking")
      }

      toast({
        title: "✓ Booking Submitted!",
        description: "We'll contact you within 24 hours. Check your email for confirmation.",
        duration: 5000,
      })

      setFormData({
        name: "",
        email: "",
        phone: "",
        checkIn: "",
        checkOut: "",
        guests: "",
        roomType: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    { icon: Phone, title: "Phone", value: "0956-892-9006", subtitle: "Call us for immediate assistance" },
    { icon: Mail, title: "Email", value: "mikkimamaradlo@gmail.com", subtitle: "We'll respond within 24 hours" },
    { icon: MapPin, title: "Location", value: "Sitio Aplaya, Balibago Lian, Batangas", subtitle: "Easy to find, paradise awaits!" },
  ]

  return (
    <section id="contact" className="py-24 bg-linear-to-b from-white via-blue-50/30 to-white dark:bg-linear-to-b dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900 relative" aria-labelledby="contact-heading">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
            📞 Contact Us
          </span>
          <h2 id="contact-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-5">
            <span className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Ready to Book?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get in touch with us or make your reservation today. 
            We're here to make your dream beach vacation a reality.
          </p>
        </div>

        {/* Contact info cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <Card
              key={info.title}
              className="flex flex-col items-center text-center p-8 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-md"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-linear-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-5 shadow-lg">
                <info.icon className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{info.title}</h3>
              <p className="text-foreground font-semibold mb-1">{info.value}</p>
              <p className="text-sm text-muted-foreground">{info.subtitle}</p>
            </Card>
          ))}
        </div>

        {/* Booking Form */}
        {!isGuestLoggedIn ? (
          /* Guest Login Prompt */
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-3xl p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Login to Book Your Stay</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Please log in or create an account to make a reservation at Piel Lighthouse Resort.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => router.push("/guest/login")}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl shadow-lg"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Login
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/guest/register")}
                className="px-8 py-4 rounded-xl"
              >
                Create Account
              </Button>
            </div>
          </div>
        ) : (
          /* Booking Form for Logged In Users */
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 md:p-12 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Calendar className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Quick Booking Form</h3>
                  <p className="text-sm text-muted-foreground">Welcome back, {user?.fullName}!</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-xl border border-muted bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-xl border border-muted bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="checkIn" className="block text-sm font-semibold text-foreground mb-2">
                      Check-in <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="checkIn"
                      type="date"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-xl border border-muted bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkOut" className="block text-sm font-semibold text-foreground mb-2">
                      Check-out <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="checkOut"
                      type="date"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-xl border border-muted bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="guests" className="block text-sm font-semibold text-foreground mb-2">
                      Guests <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-xl border border-muted bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    >
                      <option value="">Select</option>
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5-10">5-10 Guests</option>
                      <option value="10+">10+ Guests</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-xl border border-muted bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="+63 912 345 6789"
                    />
                  </div>
                  <div>
                    <label htmlFor="roomType" className="block text-sm font-semibold text-foreground mb-2">
                      Available Room
                    </label>
                    <select
                      id="roomType"
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl border border-muted bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    >
                      <option value="">Select an available room</option>
                      {roomOptions.map((room) => (
                        <option key={room.id} value={room.value}>{room.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-5 py-4 rounded-xl border border-muted bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                    placeholder="Any special requests or questions?"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Required fields are marked with <span className="text-red-500">*</span>
                  </p>
                  
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-primary hover:bg-primary/90 text-lg py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 min-w-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span> Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send size={20} />
                        Submit Booking
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}







