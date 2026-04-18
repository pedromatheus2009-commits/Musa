import AnnounceSection from '../components/AnnounceSection/AnnounceSection'
import styles from './Anunciar.module.css'

export default function Anunciar({ onAuthRequired }) {
  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <div className="container">
          <p className={styles.eyebrow}>Para profissionais</p>
          <h1 className={styles.title}>Faça parte da MUSA</h1>
          <p className={styles.subtitle}>Crie seu perfil gratuito e seja encontrada por clientes em todo o Brasil</p>
        </div>
      </div>
      <AnnounceSection onAuthRequired={onAuthRequired} />
    </main>
  )
}
