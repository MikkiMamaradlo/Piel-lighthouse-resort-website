import { Card } from "@/components/ui/card"
import { 
  Waves, 
  UtensilsCrossed, 
  Mic2, 
  Bed, 
  Building2, 
  Bath, 
  Baby, 
  Anchor,
  Armchair
} from "lucide-react"

const amenities = [
  {
    name: "Crystal Kayak",
    description: "Explore crystal clear waters with our kayak rentals",
    icon: Waves,
    color: "bg-blue-500",
  },
  {
    name: "Table Cottages",
    description: "Beachfront dining with ocean views and comfortable seating",
    icon: UtensilsCrossed,
    color: "bg-amber-500",
  },
  {
    name: "VideoKe",
    description: "Entertainment lounge with karaoke facilities",
    icon: Mic2,
    color: "bg-purple-500",
  },
  {
    name: "Spacious Bedrooms",
    description: "Well-appointed rooms with modern amenities",
    icon: Bed,
    color: "bg-indigo-500",
  },
  {
    name: "Function Hall",
    description: "Perfect venue for events, conferences, and celebrations",
    icon: Building2,
    color: "bg-rose-500",
  },
  {
    name: "Jacuzzi",
    description: "Relax in our heated jacuzzi with ocean views",
    icon: Bath,
    color: "bg-cyan-500",
  },
  {
    name: "Kiddie Pool",
    description: "Safe and fun pool area for children",
    icon: Baby,
    color: "bg-pink-500",
  },
  {
    name: "Paddle Board",
    description: "Try stand-up paddleboarding in calm waters",
    icon: Anchor,
    color: "bg-teal-500",
  },
  {
    name: "Massage Chair",
    description: "Therapeutic massage chairs for your wellness",
    icon: Armchair,
    color: "bg-orange-500",
  },
]

export default function Amenities() {
  return (
    <section id="amenities" className="py-24 bg-white" aria-labelledby="amenities-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            🛠️ Amenities
          </span>
          <h2 id="amenities-heading" className="text-4xl sm:text-5xl font-bold text-foreground mb-4">World-Class Amenities</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enjoy a wide range of facilities and activities for the perfect beach getaway
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map((item, index) => (
            <Card 
              key={item.name} 
              className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-2 hover:border-primary/20"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`w-14 h-14 ${item.color} rounded-xl mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
