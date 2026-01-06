import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const rooms = [
  {
    name: "Beachfront Room",
    capacity: "up to 4 pax",
    image: "/images/piel1.jpg",
    inclusions: [
      "Direct beach access",
      "Free entrance and pool access",
      "Air-conditioned",
      "Mini-fridge",
      "Flat-screen TV",
      "Toilet & bath with heater",
      "Table Cottage",
      "One extra mattress",
    ],
  },
  {
    name: "Barkada Room",
    capacity: "up to 10 pax",
    image: "/images/piel3.jpg",
    inclusions: [
      "Free entrance and pool access",
      "Air-conditioned",
      "Mini-fridge",
      "Flat-screen TV",
      "Table Cottage",
      "Toilet & bath with heater",
      "One extra mattress",
    ],
  },
  {
    name: "Family Room",
    capacity: "up to 15 pax",
    image: "/images/piel2.jpg",
    inclusions: [
      "Free entrance and pool access",
      "Air-conditioned",
      "Mini-fridge",
      "Table Cottage",
      "Flat-screen TV",
      "Enclosed shower with heater",
      "Enclosed toilet room",
      "One extra mattress",
    ],
  },
]

export default function Accommodations() {
  return (
    <section id="accommodations" className="py-20 bg-gradient-to-b from-white to-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Comfortable Accommodations</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our range of spacious rooms designed for your comfort and relaxation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <Card key={room.name} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48 bg-muted overflow-hidden">
                <img
                  src={room.image || "/placeholder.svg"}
                  alt={room.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">{room.name}</h3>
                <p className="text-primary font-semibold mb-4">{room.capacity}</p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm font-semibold text-foreground">Inclusions:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {room.inclusions.slice(0, 4).map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90">View Details</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
