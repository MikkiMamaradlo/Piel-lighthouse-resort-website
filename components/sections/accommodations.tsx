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
    popular: true,
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
    popular: false,
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
    popular: false,
  },
]

export default function Accommodations() {
  return (
    <section id="accommodations" className="py-24 bg-linear-to-b from-white via-blue-50/30 to-white" aria-labelledby="accommodations-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            🏠 Accommodations
          </span>
          <h2 id="accommodations-heading" className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Comfortable Accommodations</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our range of spacious rooms designed for your comfort and relaxation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <Card
              key={room.name}
              className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-56 bg-muted overflow-hidden">
                {room.popular && (
                  <span className="absolute top-4 right-4 z-10 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Popular
                  </span>
                )}
                <img
                  src={room.image || "/placeholder.svg"}
                  alt={room.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{room.name}</h3>
                <p className="text-primary font-semibold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full" />
                  {room.capacity}
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm font-semibold text-foreground">Inclusions:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {room.inclusions.slice(0, 4).map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-1 text-lg leading-none">✓</span>
                        <span className="line-clamp-1">{item}</span>
                      </li>
                    ))}
                    {room.inclusions.length > 4 && (
                      <li className="text-xs text-muted-foreground/70">
                        +{room.inclusions.length - 4} more inclusions
                      </li>
                    )}
                  </ul>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 hover:shadow-lg">
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
