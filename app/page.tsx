import Hero from "@/components/sections/hero"
import Navigation from "@/components/sections/navigation"
import Amenities from "@/components/sections/amenities"
import Accommodations from "@/components/sections/accommodations"
import Activities from "@/components/sections/activities"
import Experiences from "@/components/sections/experiences"
import Gallery from "@/components/sections/gallery"
import Contact from "@/components/sections/contact"
import Footer from "@/components/sections/footer"
import BackToTop from "@/components/sections/back-to-top"
import Testimonials from "@/components/sections/testimonials"
import CTASection from "@/components/sections/cta"
import RoomDetailsModal from "@/components/room-details-modal"

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
      <Testimonials />
      <CTASection />
      <Contact />
      <Footer />
      <BackToTop />
      <RoomDetailsModal />
    </main>
  )
}
