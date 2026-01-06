import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Piel Lighthouse</h3>
            <p className="text-gray-300">Your tropical paradise on the shores of Batangas</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="#" className="hover:text-white transition">
                  Accommodations
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Amenities
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Activities
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Phone: 0956-892-9006</li>
              <li>Email: piel.lighthouseresort@gmail.com</li>
              <li>Location: Sitio Aplaya, Balibago Lian, Batangas</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition">
                <Facebook size={24} />
              </a>
              <a href="#" className="hover:text-accent transition">
                <Instagram size={24} />
              </a>
              <a href="#" className="hover:text-accent transition">
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-gray-300">
          <p>&copy; 2026 Piel Lighthouse Beach Resort. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
