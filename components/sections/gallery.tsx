"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

const images = [
  {
    url: "/images/piel10.jpg",
    title: "Welcome to Piel",
  },
  {
    url: "/images/piel4.jpg",
    title: "Amenities Overview",
  },
  {
    url: "/images/piel1.jpg",
    title: "Beachfront Bliss",
  },
  {
    url: "/images/piel3.jpg",
    title: "Barkada Room",
  },
  {
    url: "/images/piel2.jpg",
    title: "Family Room Experience",
  },
  {
    url: "/images/piel7.jpg",
    title: "Sunset Dining",
  },
  {
    url: "/images/piel9.jpg",
    title: "Resort Architecture",
  },
  {
    url: "/images/piel8.jpg",
    title: "Evening Beach Magic",
  },
  {
    url: "/images/piel5.jpg",
    title: "Glamping Experience",
  },
  {
    url: "/images/piel6.jpg",
    title: "Beachfront Camping",
  },
]

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Photo Gallery</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the beauty of Piel Lighthouse Beach Resort through our gallery
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <Card
              key={image.title}
              className="overflow-hidden cursor-pointer group"
              onClick={() => setSelectedImage(image.url)}
            >
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
              <div className="p-4 bg-white">
                <p className="font-semibold text-foreground">{image.title}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-8 right-0 text-white hover:text-gray-300"
              >
                <X size={32} />
              </button>
              <img src={selectedImage || "/placeholder.svg"} alt="Full view" className="w-full rounded-lg" />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
