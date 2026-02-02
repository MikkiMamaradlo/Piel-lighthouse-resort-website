import { Card } from "@/components/ui/card"
import { 
  Waves, 
  Volleyball, 
  Sun, 
  Utensils, 
  Music, 
  Sparkles,
  Dumbbell,
  Palmtree
} from "lucide-react"

const activities = [
  {
    title: "Water Sports",
    description: "Kayaking, paddle boarding, and water activities in crystal clear waters",
    icon: Waves,
    color: "from-blue-400 to-blue-600",
  },
  {
    title: "Beach Volleyball",
    description: "Competitive or casual volleyball games on our sandy beach courts",
    icon: Volleyball,
    color: "from-amber-400 to-amber-600",
  },
  {
    title: "Beach Relaxation",
    description: "Unwind on pristine sands with stunning ocean views and gentle waves",
    icon: Sun,
    color: "from-orange-400 to-orange-600",
  },
  {
    title: "Dining Experience",
    description: "Fresh seafood and local cuisine at our beachfront restaurants",
    icon: Utensils,
    color: "from-red-400 to-red-600",
  },
  {
    title: "Entertainment",
    description: "Karaoke nights, live music, and evening entertainment by the beach",
    icon: Music,
    color: "from-purple-400 to-purple-600",
  },
  {
    title: "Wellness",
    description: "Spa services, massage, and relaxation treatments for ultimate comfort",
    icon: Sparkles,
    color: "from-pink-400 to-pink-600",
  },
]

export default function Activities() {
  return (
    <section id="activities" className="py-24 bg-linear-to-b from-muted via-white to-muted" aria-labelledby="activities-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-medium rounded-full mb-4">
            🎯 Activities
          </span>
          <h2 id="activities-heading" className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Activities & Experiences</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create unforgettable memories with exciting activities and unforgettable experiences
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity, index) => (
            <Card 
              key={activity.title} 
              className="p-8 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group overflow-hidden relative"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Background gradient decoration */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${activity.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`} />
              
              <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br ${activity.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                <activity.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{activity.title}</h3>
              <p className="text-muted-foreground">{activity.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
