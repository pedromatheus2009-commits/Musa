import { useReveal } from '../../hooks/useReveal'
import SectionLabel from '../brand/SectionLabel'
import Selo from '../brand/Selo'
import styles from './HowItWorks.module.css'

const steps = [
  { n: '01', kind: 'star', title: 'Crie seu perfil', desc: 'Cadastre-se gratuitamente com fotos, seus serviços e formas de contato.' },
  { n: '02', kind: 'crest', title: 'Seja descoberta', desc: 'Clientes encontram você por categoria, cidade e especialidade na vitrine da Musa.' },
  { n: '03', kind: 'heart', title: 'Conecte-se', desc: 'O contato é direto, via WhatsApp. Você fecha negócio sem intermediários.' },
]

export default function HowItWorks() {
  const ref = useReveal()
  return (
    <section className={`section ${styles.section}`}>
      <div className="container" ref={ref}>
        <div className={styles.header}>
          <SectionLabel align="center">Para profissionais</SectionLabel>
          <h2 className={styles.title}>Como funciona a vitrine</h2>
          <p className={styles.subtitle}>Em três passos simples você começa a ser encontrada pela Casa Musa.</p>
        </div>
        <div className={styles.grid}>
          {steps.map((s) => (
            <div key={s.n} className={`${styles.card} reveal`}>
              <span className={styles.number}>{s.n}</span>
              <span className={styles.icon}><Selo kind={s.kind} size={26} /></span>
              <h3 className={styles.cardTitle}>{s.title}</h3>
              <p className={styles.cardDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
