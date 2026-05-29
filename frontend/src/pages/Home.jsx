import Hero from '../components/Hero/Hero'
import CasaMusaHighlights from '../components/CasaMusaHighlights/CasaMusaHighlights'
import About from '../components/About/About'
import HowItWorks from '../components/HowItWorks/HowItWorks'
import AnnounceSection from '../components/AnnounceSection/AnnounceSection'

export default function Home({ onAuthRequired }) {
  return (
    <main>
      <Hero />
      <CasaMusaHighlights />
      <About />
      <HowItWorks />
      <AnnounceSection onAuthRequired={onAuthRequired} />
    </main>
  )
}
