"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RoomDetail {
  name: string
  capacity: string
  image: string
  price: string
  period: string
  inclusions: { icon: any; text: string }[]
  popular: boolean
  features: string[]
  description: string
}

const rooms: RoomDetail[] = [
  {
    name: "Beachfront Room",
    capacity: "up to 4 pax",
    image: "/images/piel1.jpg",
    price: "₱3,500",
    period: "/night",
    inclusions: [
      { icon: "Users", text: "Direct beach access" },
      { icon: "Wind", text: "Air-conditioned" },
      { icon: "Refrigerator", text: "Mini-fridge" },
      { icon: "Tv", text: "Flat-screen TV" },
      { icon: "ShowerHead", text: "Hot shower" },
      { icon: "Wifi", text: "Free WiFi" },
    ],
    popular: true,
    features: ["Table Cottage", "Extra mattress"],
    description: "Wake up to the sound of waves in our Beachfront Room. This cozy accommodation offers direct beach access and stunning ocean views from your private terrace. Perfect for couples seeking a romantic getaway."
  },
  {
    name: "Barkada Room",
    capacity: "up to 10 pax",
    image: "/images/piel3.jpg",
    price: "₱5,500",
    period: "/night",
    inclusions: [
      { icon: "Users", text: "Spacious layout" },
      { icon: "Wind", text: "Air-conditioned" },
      { icon: "Refrigerator", text: "Mini-fridge" },
      { icon: "Tv", text: "Flat-screen TV" },
      { icon: "ShowerHead", text: "Hot shower" },
      { icon: "Wifi", text: "Free WiFi" },
    ],
    popular: false,
    features: ["Table Cottage", "Extra mattresses"],
    description: "Our spacious Barkada Room is designed for groups and families. With ample space for up to 10 guests, comfortable bedding, and modern amenities, it's the perfect choice for friends reunions or family gatherings."
  },
  {
    name: "Family Room",
    capacity: "up to 15 pax",
    image: "/images/piel2.jpg",
    price: "₱7,500",
    period: "/night",
    inclusions: [
      { icon: "Users", text: "Large family size" },
      { icon: "Wind", text: "Air-conditioned" },
      { icon: "Refrigerator", text: "Mini-fridge" },
      { icon: "Tv", text: "Flat-screen TV" },
      { icon: "ShowerHead", text: "Enclosed shower" },
      { icon: "Wifi", text: "Free WiFi" },
    ],
    popular: false,
    features: ["Private toilet", "Table Cottage"],
    description: "The ultimate family accommodation! This expansive room comfortably hosts up to 15 guests with multiple sleeping areas, a private toilet, and all the amenities needed for a comfortable family vacation."
  },
]

export default function RoomDetailsModal() {
  const [selectedRoom, setSelectedRoom] = useState<RoomDetail | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleOpenModal = (e: CustomEvent<RoomDetail>) => {
      setSelectedRoom(e.detail)
      setIsOpen(true)
    }

    window.addEventListener('open-room-modal', handleOpenModal as EventListener)
    return () => window.removeEventListener('open-room-modal', handleOpenModal as EventListener)
  }, [])

  const closeModal = () => {
    setIsOpen(false)
    setSelectedRoom(null)
  }

  const handleBookNow = () => {
    // Scroll to contact section or open booking form
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" })
    }
    closeModal()
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen || !selectedRoom) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="room-details-modal">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeModal}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image */}
        <div className="relative h-64 sm:h-80">
          <img
            src={selectedRoom.image}
            alt={selectedRoom.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Popular badge */}
          {selectedRoom.popular && (
            <div className="absolute top-4 left-4">
              <span className="bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                ⭐ Most Popular
              </span>
            </div>
          )}

          {/* Price tag */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg">
            <span className="text-3xl font-bold text-foreground">{selectedRoom.price}</span>
            <span className="text-lg text-muted-foreground">{selectedRoom.period}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                {selectedRoom.capacity}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-3">{selectedRoom.name}</h2>
            <p className="text-muted-foreground leading-relaxed">{selectedRoom.description}</p>
          </div>

          {/* Inclusions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Room Amenities</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {selectedRoom.inclusions.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Additional Features</h3>
            <div className="flex flex-wrap gap-2">
              {selectedRoom.features.map((feature, i) => (
                <span key={i} className="bg-muted text-muted-foreground px-4 py-2 rounded-full text-sm">
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleBookNow}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold rounded-xl"
            >
              Book Now
            </Button>
            <Button 
              variant="outline"
              onClick={closeModal}
              className="flex-1 py-6 text-lg rounded-xl"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { rooms }
