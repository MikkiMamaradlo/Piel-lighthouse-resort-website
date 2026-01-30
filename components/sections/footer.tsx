import Link from "next/link"
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Palmtree } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-foreground text-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Palmtree className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-bold">Piel Lighthouse</h3>
            </div>
            <p className="text-gray-300 mb-6">Your tropical paradise on the shores of Batangas. Experience luxury, comfort, and natural beauty.</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link href="#accommodations" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                  Accommodations
                </Link>
              </li>
              <li>
                <Link href="#amenities" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                  Amenities
                </Link>
              </li>
              <li>
                <Link href="#activities" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                  Activities
                </Link>
              </li>
              <li>
                <Link href="#gallery" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-lg">Contact Info</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin className="text-accent shrink-0 mt-1" size={18} />
                <span>Sitio Aplaya, Balibago Lian, Batangas</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-accent" size={18} />
                <span>0956-892-9006</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-accent" size={18} />
                <span>piel.lighthouseresort@gmail.com</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-lg">Hours</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-accent">•</span>
                Check-in: 2:00 PM
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">•</span>
                Check-out: 12:00 PM
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">•</span>
                Front Desk: 24/7
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-gray-300 mb-2">&copy; 2026 Piel Lighthouse Beach Resort. All rights reserved.</p>
          <p className="text-sm text-gray-400">Made with ❤️ for beach lovers</p>
        </div>
      </div>
    </footer>
  )
}
