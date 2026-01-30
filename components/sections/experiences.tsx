import { Card } from "@/components/ui/card"

const experiences = [
  {
    title: "Golden Hour Dining",
    description: "Enjoy exquisite meals overlooking the sunset with fresh seafood and tropical delights",
    image: "/images/piel7.jpg",
    icon: "🍽️",
  },
  {
    title: "Beach Glamping",
    description: "Experience unique beachfront camping with modern amenities and starlit nights",
    image: "/images/piel5.jpg",
    icon: "⛺",
  },
  {
    title: "Twilight Escape",
    description: "Wade through calm waters as the sun sets, creating magical memories with loved ones",
    image: "/images/piel8.jpg",
    icon: "🌅",
  },
]

export default function Experiences() {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-blue-50/50 to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-sm font-medium rounded-full mb-4">
            ✨ Experiences
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Unforgettable Experiences</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create lasting memories with our exclusive beachfront experiences
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {experiences.map((experience, index) => (
            <Card 
              key={experience.title} 
              className="overflow-hidden hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={experience.image || "/placeholder.svg"}
                  alt={experience.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="absolute top-4 left-4 text-3xl bg-white/90 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                  {experience.icon}
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold mb-2">{experience.title}</h3>
                </div>
              </div>
              <div className="p-6 bg-white">
                <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                  {experience.description}
                </p>
                <button className="mt-4 text-primary font-semibold hover:text-primary/80 transition-colors flex items-center gap-2">
                  Learn more →
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
