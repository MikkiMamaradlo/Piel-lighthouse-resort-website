import { Card } from "@/components/ui/card"

const amenities = [
  {
    name: "Crystal Kayak",
    description: "Explore crystal clear waters with our kayak rentals",
  },
  {
    name: "Table Cottages",
    description: "Beachfront dining with ocean views and comfortable seating",
  },
  {
    name: "VideoKe",
    description: "Entertainment lounge with karaoke facilities",
  },
  {
    name: "Spacious Bedrooms",
    description: "Well-appointed rooms with modern amenities",
  },
  {
    name: "Function Hall",
    description: "Perfect venue for events, conferences, and celebrations",
  },
  {
    name: "Jacuzzi",
    description: "Relax in our heated jacuzzi with ocean views",
  },
  {
    name: "Kiddie Pool",
    description: "Safe and fun pool area for children",
  },
  {
    name: "Paddle Board",
    description: "Try stand-up paddleboarding in calm waters",
  },
  {
    name: "Massage Chair",
    description: "Therapeutic massage chairs for your wellness",
  },
]

export default function Amenities() {
  return (
    <section id="amenities" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">World-Class Amenities</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enjoy a wide range of facilities and activities for the perfect beach getaway
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map((item) => (
            <Card key={item.name} className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
                <div className="w-6 h-6 bg-primary rounded-full" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{item.name}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
