import AnnounceSection from '../components/AnnounceSection/AnnounceSection'
import StripeBackground from '../components/brand/StripeBackground'
import SectionLabel from '../components/brand/SectionLabel'
import styles from './Anunciar.module.css'

export default function Anunciar({ onAuthRequired }) {
  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <StripeBackground density="narrow" opacity={0.1} />
        <div className={`container ${styles.headerInner}`}>
          <SectionLabel align="center">Para profissionais</SectionLabel>
          <h1 className={styles.title}>Faça parte da Casa Musa</h1>
          <p className={styles.subtitle}>Crie seu perfil gratuito e seja encontrada por clientes em todo o Brasil.</p>
        </div>
      </header>
      <AnnounceSection onAuthRequired={onAuthRequired} />
    </main>
  )
}
