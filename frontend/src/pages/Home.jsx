import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero/Hero'
import HowItWorks from '../components/HowItWorks/HowItWorks'
import AnnounceSection from '../components/AnnounceSection/AnnounceSection'
import About from '../components/About/About'

export default function Home({ onAuthRequired }) {
  const navigate = useNavigate()

  return (
    <main>
      <Hero
        onFindClick={() => navigate('/profissionais')}
        onAnnounceClick={() => navigate('/anunciar')}
      />
      <HowItWorks />
      <About />
      <AnnounceSection onAuthRequired={onAuthRequired} />
    </main>
  )
}
