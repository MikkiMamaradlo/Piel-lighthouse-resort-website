"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Star, Calendar, Users, Check } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      // Simulate subscription success
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const quickLinks = [
    { href: "#accommodations", label: "Rooms & Pricing" },
    { href: "#experiences", label: "Experiences" },
    { href: "#amenities", label: "Amenities" },
    { href: "#activities", label: "Activities" },
    { href: "#gallery", label: "Gallery" },
    { href: "#contact", label: "Contact & Booking" },
  ]

  const roomTypes = [
    { label: "Beachfront Room", capacity: "up to 4 pax" },
    { label: "Barkada Room", capacity: "up to 10 pax" },
    { label: "Family Room", capacity: "up to 15 pax" },
  ]

  return (
    <footer className="bg-linear-to-b from-slate-900 to-slate-800 text-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid lg:grid-cols-4 gap-12 mb-12">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-linear-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                <Image 
                  src="/images/PielLogo.jpg" 
                  alt="Piel Lighthouse Logo" 
                  width={48} 
                  height={48}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">Piel Lighthouse</h3>
                <p className="text-xs text-amber-400">Beach Resort</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your tropical paradise on the shores of Batangas. Experience luxury, 
              comfort, and natural beauty in one amazing destination.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://www.facebook.com/piel.lighthouse" 
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6 text-lg flex items-center gap-2">
              <Star className="text-amber-500" size={18} />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Room Types */}
          <div>
            <h4 className="font-semibold mb-6 text-lg flex items-center gap-2">
              <Users className="text-amber-500" size={18} />
              Our Rooms
            </h4>
            <ul className="space-y-3 text-gray-300">
              {roomTypes.map((room) => (
                <li key={room.label} className="flex items-center gap-2">
                  <Calendar className="text-amber-500/60" size={14} />
                  <span>{room.label}</span>
                  <span className="text-sm text-gray-500">({room.capacity})</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-6 text-lg flex items-center gap-2">
              <MapPin className="text-amber-500" size={18} />
              Contact Info
            </h4>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin className="text-amber-500 shrink-0 mt-1" size={18} />
                <span>Sitio Aplaya, Balibago Lian, Batangas, Philippines</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-amber-500" size={18} />
                <a href="tel:09568929006" className="hover:text-white transition-colors">0956-892-9006</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-amber-500" size={18} />
                <a href="mailto:mikkimamaradlo@gmail.com" className="hover:text-white transition-colors break-all">
                  mikkimamaradlo@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-semibold text-lg mb-1">Subscribe to Our Newsletter</h4>
              <p className="text-gray-400 text-sm">Get updates on special offers and packages</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 w-full md:w-64"
              />
              <button 
                type="submit" 
                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2"
              >
                {subscribed ? (
                  <>
                    <Check size={16} />
                    Subscribed!
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-gray-300 mb-2">
            © {currentYear} Piel Lighthouse Beach Resort. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Cancellation Policy</a>
          </div>
          <p className="text-sm text-gray-600 mt-4">Made with ❤️ for beach lovers</p>
        </div>
      </div>
    </footer>
  )
}
