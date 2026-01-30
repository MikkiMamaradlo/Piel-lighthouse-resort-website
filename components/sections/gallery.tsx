"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { X, ZoomIn } from "lucide-react"

const images = [
  {
    url: "/images/piel10.jpg",
    title: "Welcome to Piel",
    category: "Resort",
  },
  {
    url: "/images/piel4.jpg",
    title: "Amenities Overview",
    category: "Amenities",
  },
  {
    url: "/images/piel1.jpg",
    title: "Beachfront Bliss",
    category: "Beach",
  },
  {
    url: "/images/piel3.jpg",
    title: "Barkada Room",
    category: "Rooms",
  },
  {
    url: "/images/piel2.jpg",
    title: "Family Room Experience",
    category: "Rooms",
  },
  {
    url: "/images/piel7.jpg",
    title: "Sunset Dining",
    category: "Dining",
  },
  {
    url: "/images/piel9.jpg",
    title: "Resort Architecture",
    category: "Resort",
  },
  {
    url: "/images/piel8.jpg",
    title: "Evening Beach Magic",
    category: "Beach",
  },
  {
    url: "/images/piel5.jpg",
    title: "Glamping Experience",
    category: "Experience",
  },
  {
    url: "/images/piel6.jpg",
    title: "Beachfront Camping",
    category: "Experience",
  },
]

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <section id="gallery" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            📸 Gallery
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Photo Gallery</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the beauty of Piel Lighthouse Beach Resort through our gallery
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <Card
              key={image.title}
              className="overflow-hidden cursor-pointer group relative"
              onClick={() => setSelectedImage(image.url)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-foreground text-xs font-semibold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {image.category}
                </span>
              </div>
              <div className="p-4 bg-white group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <p className="font-semibold">{image.title}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors flex items-center gap-2"
              >
                <span className="text-sm">Close</span>
                <X size={32} />
              </button>
              <img 
                src={selectedImage || "/placeholder.svg"} 
                alt="Full view" 
                className="w-full rounded-lg shadow-2xl"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
