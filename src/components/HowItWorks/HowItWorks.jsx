import styles from './HowItWorks.module.css'

const steps = [
  { n: '01', icon: '✦', title: 'Cadastre seu perfil', desc: 'Crie seu perfil gratuitamente com fotos, descrição dos seus serviços e formas de contato.' },
  { n: '02', icon: '◈', title: 'Seja descoberta', desc: 'Clientes buscam por categoria, cidade e especialidade. Seu perfil aparece nos resultados.' },
  { n: '03', icon: '◇', title: 'Conecte-se', desc: 'Clientes entram em contato direto via WhatsApp. Você fecha negócio sem intermediários.' },
]

export default function HowItWorks() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <p className={styles.eyebrow}>Simples e direto</p>
          <h2 className={styles.title}>Como Funciona</h2>
          <p className={styles.subtitle}>Em três passos simples você começa a receber clientes pela MUSA</p>
        </div>
        <div className={styles.grid}>
          {steps.map((s) => (
            <div key={s.n} className={styles.card}>
              <div className={styles.accent} />
              <div className={styles.number}>{s.n}</div>
              <div className={styles.icon}>{s.icon}</div>
              <h3 className={styles.cardTitle}>{s.title}</h3>
              <p className={styles.cardDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
