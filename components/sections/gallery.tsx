"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, ZoomIn, Grid, LayoutGrid, Filter } from "lucide-react"

const images = [
  { url: "/images/piel10.jpg", title: "Welcome to Piel", category: "Resort", colSpan: "col-span-1" },
  { url: "/images/piel4.jpg", title: "Amenities Overview", category: "Amenities", colSpan: "col-span-1" },
  { url: "/images/piel1.jpg", title: "Beachfront Bliss", category: "Beach", colSpan: "col-span-1" },
  { url: "/images/piel3.jpg", title: "Barkada Room", category: "Rooms", colSpan: "col-span-1 md:col-span-2" },
  { url: "/images/piel2.jpg", title: "Family Room", category: "Rooms", colSpan: "col-span-1" },
  { url: "/images/piel7.jpg", title: "Sunset Dining", category: "Dining", colSpan: "col-span-1" },
  { url: "/images/piel9.jpg", title: "Resort Architecture", category: "Resort", colSpan: "col-span-1" },
  { url: "/images/piel8.jpg", title: "Evening Beach", category: "Beach", colSpan: "col-span-1 md:col-span-2" },
  { url: "/images/piel5.jpg", title: "Glamping", category: "Experience", colSpan: "col-span-1" },
  { url: "/images/piel6.jpg", title: "Beach Camping", category: "Experience", colSpan: "col-span-1" },
]

const categories = ["All", "Resort", "Beach", "Rooms", "Dining", "Experience", "Amenities"]

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("All")
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const handleLoadMore = () => {
    setIsLoadingMore(true)
    // Simulate loading more photos
    setTimeout(() => {
      setIsLoadingMore(false)
      // Scroll to gallery section to show new content
      const gallerySection = document.getElementById("gallery")
      if (gallerySection) {
        gallerySection.scrollIntoView({ behavior: "smooth" })
      }
    }, 1000)
  }

  const filteredImages = useMemo(() => {
    if (activeCategory === "All") return images
    return images.filter(img => img.category === activeCategory)
  }, [activeCategory])

  return (
    <section id="gallery" className="py-24 bg-linear-to-b from-white to-blue-50/30 relative" aria-labelledby="gallery-heading">
      {/* Background decorations */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
            📸 Gallery
          </span>
          <h2 id="gallery-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-5">
            <span className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Photo Gallery
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience the beauty of Piel Lighthouse Beach Resort through our gallery. 
            Each photo tells a story of paradise.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white text-muted-foreground hover:bg-muted"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Masonry-style gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <Card
              key={image.title}
              className={`overflow-hidden cursor-pointer group relative ${image.colSpan}`}
              onClick={() => setSelectedImage(image.url)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`relative ${image.colSpan.includes('col-span-2') ? 'h-64' : 'h-64'} overflow-hidden`}>
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                </div>

                {/* Category badge */}
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-foreground text-xs font-semibold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0">
                  {image.category}
                </span>
              </div>

              {/* Title bar */}
              <div className="p-4 bg-white group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <p className="font-semibold">{image.title}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* View more button */}
        <div className="text-center mt-12">
          <Button 
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-lg"
          >
            {isLoadingMore ? "Loading..." : "Load More Photos"}
          </Button>
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-6xl w-full max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <img 
                src={selectedImage || "/placeholder.svg"} 
                alt="Full view" 
                className="max-h-[75vh] w-auto rounded-lg shadow-2xl object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors flex items-center gap-2"
              >
                <span className="text-sm">Close</span>
                <X size={32} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
