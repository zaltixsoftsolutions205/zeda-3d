import { useEffect, useState } from 'react'
import PersistentCanvas from './components/PersistentCanvas'
import Navbar from './components/Navbar'
import Preloader from './components/Preloader'
import DemoModal from './components/DemoModal'
import HomeSection from './sections/HomeSection'
import AboutSection from './sections/AboutSection'
import FeaturesSection from './sections/FeaturesSection'
import WhySection from './sections/WhySection'
import ClientsSection from './sections/ClientsSection'
import TestimonialsSection from './sections/TestimonialsSection'
import ContactSection from './sections/ContactSection'
import { useScrollCamera } from './hooks/useScrollCamera'

export default function App() {
  const [ready, setReady] = useState(false)
  useScrollCamera()
  // failsafe: never leave the visitor on the loader if WebGL is slow or unavailable
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 7000)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <PersistentCanvas onReady={() => setReady(true)} />
      <div className="vignette pointer-events-none fixed inset-0 z-[1]" aria-hidden />
      <Navbar />
      <main className="relative z-10">
        <HomeSection />
        <AboutSection />
        <FeaturesSection />
        <WhySection />
        <ClientsSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <DemoModal />
      <Preloader ready={ready} />
    </>
  )
}
