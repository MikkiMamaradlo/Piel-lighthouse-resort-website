import Hero from "@/components/hero"
import Navigation from "@/components/navigation"
import Amenities from "@/components/amenities"
import Accommodations from "@/components/accommodations"
import Activities from "@/components/activities"
import Experiences from "@/components/experiences"
import Gallery from "@/components/gallery"
import Footer from "@/components/footer"
import BackToTop from "@/components/back-to-top"
import Testimonials from "@/components/testimonials"
import CTASection from "@/components/cta"
import RoomDetailsModal from "@/components/room-details-modal"
import { FloatingThemeToggle } from "@/components/floating-theme-toggle"

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
      <Footer />
      <BackToTop />
      <RoomDetailsModal />
      <FloatingThemeToggle />
    </main>
  )
}







