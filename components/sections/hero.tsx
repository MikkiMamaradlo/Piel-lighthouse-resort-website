import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative w-full h-screen pt-16 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/images/piel7.jpg)",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 text-balance">Piel Lighthouse</h1>
        <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-2xl text-pretty">
          Your Tropical Paradise Awaits at Batangas
        </p>
        <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8">
          Explore Now
        </Button>
      </div>
    </section>
  )
}
