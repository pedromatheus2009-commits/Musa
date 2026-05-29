import { Link } from 'react-router-dom'
import { useReveal } from '../../hooks/useReveal'
import SectionLabel from '../brand/SectionLabel'
import Selo from '../brand/Selo'
import styles from './CasaMusaHighlights.module.css'

const items = [
  { kind: 'star', tag: 'Agenda', title: 'Oficinas', desc: 'Leitura de baralho cigano, arte e autoconhecimento — em turmas pequenas e acolhedoras.', to: '/agenda' },
  { kind: 'heart', tag: 'Eventos', title: 'Jantares & Encontros', desc: 'Jantares para casais, rodas de conversa e celebrações dentro da casa.', to: '/agenda' },
  { kind: 'crest', tag: 'Brechó', title: 'Baú da Musa', desc: 'Um brechó afetivo: peças para vender e trocar entre as musas.', to: '/bau' },
  { kind: 'star', tag: 'Profissionais', title: 'Vitrine de talentos', desc: 'As melhores profissionais femininas, prontas para te atender.', to: '/profissionais' },
]

export default function CasaMusaHighlights() {
  const ref = useReveal()
  return (
    <section className={`section ${styles.section}`}>
      <div className="container" ref={ref}>
        <div className={styles.header}>
          <SectionLabel align="center">O que acontece na casa</SectionLabel>
          <h2 className={styles.title}>Viva a Musa</h2>
          <p className={styles.subtitle}>Um lugar para aprender, celebrar e se conectar — entre mulheres.</p>
        </div>
        <div className={styles.grid}>
          {items.map((it) => (
            <Link key={it.title} to={it.to} className={`${styles.card} reveal`}>
              <span className={styles.icon}><Selo kind={it.kind} size={28} /></span>
              <span className={styles.tag}>{it.tag}</span>
              <h3 className={styles.cardTitle}>{it.title}</h3>
              <p className={styles.cardDesc}>{it.desc}</p>
              <span className={styles.arrow}>Ver mais →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
