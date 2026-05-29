import { Link } from 'react-router-dom'
import StripeBackground from '../brand/StripeBackground'
import Cartouche from '../brand/Cartouche'
import ScriptHeading from '../brand/ScriptHeading'
import SectionLabel from '../brand/SectionLabel'
import Selo from '../brand/Selo'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero} id="home">
      <StripeBackground density="wide" opacity={0.18} className={styles.stripes} />
      <div className="container">
        <Cartouche variant="double" tone="gold" className={styles.card}>
          <div className={styles.seloWrap}><Selo kind="heart" size={46} animate /></div>
          <SectionLabel align="center">Sorocaba/SP · Casa de mulheres</SectionLabel>
          <ScriptHeading as="h1" size="lg" tone="brick" align="center" className={styles.script}>
            Casa Musa
          </ScriptHeading>
          <p className={styles.tagline}>oficinas · encontros · vitrine de talentos</p>
          <p className={styles.description}>
            Uma casa para mulheres se encontrarem: oficinas de leitura e arte, jantares,
            rodas de conversa e uma vitrine das melhores profissionais. Venha viver a Musa.
          </p>
          <div className={styles.ctas}>
            <Link to="/agenda" className="btn btn-primary">Ver a agenda</Link>
            <Link to="/sobre" className="btn btn-outline">Conhecer a casa</Link>
          </div>
        </Cartouche>
      </div>
    </section>
  )
}
