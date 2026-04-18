import About from '../components/About/About'
import styles from './Sobre.module.css'

export default function Sobre() {
  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <div className="container">
          <p className={styles.eyebrow}>Nossa história</p>
          <h1 className={styles.title}>Sobre a MUSA</h1>
          <p className={styles.subtitle}>Conheça a plataforma que conecta talentos femininos ao Brasil</p>
        </div>
      </div>
      <About />
    </main>
  )
}
