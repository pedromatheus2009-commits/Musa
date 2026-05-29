import About from '../components/About/About'
import StripeBackground from '../components/brand/StripeBackground'
import SectionLabel from '../components/brand/SectionLabel'
import ScriptHeading from '../components/brand/ScriptHeading'
import styles from './Sobre.module.css'

export default function Sobre() {
  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <StripeBackground density="narrow" opacity={0.1} />
        <div className={`container ${styles.headerInner}`}>
          <SectionLabel align="center">Sorocaba/SP · desde 2024</SectionLabel>
          <ScriptHeading as="h1" size="lg" tone="brick" align="center">Sobre a Casa Musa</ScriptHeading>
          <p className={styles.subtitle}>Um espaço de mulheres: oficinas, encontros e uma vitrine de talentos femininos.</p>
        </div>
      </header>
      <About />
    </main>
  )
}
