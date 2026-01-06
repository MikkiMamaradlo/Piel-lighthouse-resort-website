import { Card } from "@/components/ui/card"

const activities = [
  {
    title: "Water Sports",
    description: "Kayaking, paddle boarding, and water activities in crystal clear waters",
    icon: "🏄",
  },
  {
    title: "Beach Volleyball",
    description: "Competitive or casual volleyball games on our sandy beach courts",
    icon: "🏐",
  },
  {
    title: "Beach Relaxation",
    description: "Unwind on pristine sands with stunning ocean views and gentle waves",
    icon: "🏖️",
  },
  {
    title: "Dining Experience",
    description: "Fresh seafood and local cuisine at our beachfront restaurants",
    icon: "🍽️",
  },
  {
    title: "Entertainment",
    description: "Karaoke nights, live music, and evening entertainment by the beach",
    icon: "🎤",
  },
  {
    title: "Wellness",
    description: "Spa services, massage, and relaxation treatments for ultimate comfort",
    icon: "💆",
  },
]

export default function Activities() {
  return (
    <section id="activities" className="py-20 bg-gradient-to-b from-muted to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Activities & Experiences</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create unforgettable memories with exciting activities and unforgettable experiences
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity) => (
            <Card key={activity.title} className="p-8 text-center hover:shadow-lg transition-all hover:scale-105">
              <div className="text-5xl mb-4">{activity.icon}</div>
              <h3 className="text-xl font-bold text-foreground mb-3">{activity.title}</h3>
              <p className="text-muted-foreground">{activity.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
