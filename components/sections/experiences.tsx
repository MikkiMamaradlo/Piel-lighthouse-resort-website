import { Card } from "@/components/ui/card"

const experiences = [
  {
    title: "Golden Hour Dining",
    description: "Enjoy exquisite meals overlooking the sunset with fresh seafood and tropical delights",
    image: "/images/piel7.jpg",
  },
  {
    title: "Beach Glamping",
    description: "Experience unique beachfront camping with modern amenities and starlit nights",
    image: "/images/piel5.jpg",
  },
  {
    title: "Twilight Escape",
    description: "Wade through calm waters as the sun sets, creating magical memories with loved ones",
    image: "/images/piel8.jpg",
  },
]

export default function Experiences() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Unforgettable Experiences</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create lasting memories with our exclusive beachfront experiences
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {experiences.map((experience) => (
            <Card key={experience.title} className="overflow-hidden hover:shadow-xl transition-all">
              <div className="relative h-72 overflow-hidden group">
                <img
                  src={experience.image || "/placeholder.svg"}
                  alt={experience.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-foreground mb-3">{experience.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{experience.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
