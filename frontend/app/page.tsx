import Hero from "@/components/sections/hero"
import Navigation from "@/components/sections/navigation"
import Amenities from "@/components/sections/amenities"
import Accommodations from "@/components/sections/accommodations"
import Activities from "@/components/sections/activities"
import Experiences from "@/components/sections/experiences"
import Gallery from "@/components/sections/gallery"
import Contact from "@/components/sections/contact"
import Footer from "@/components/sections/footer"

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Navigation />
      <Hero />
      <Accommodations />
      <Experiences />
      <Amenities />
      <Activities />
      <Gallery />
      <Contact />
      <Footer />
    </main>
  )
}
