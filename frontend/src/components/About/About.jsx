import styles from './About.module.css'

export default function About() {
  return (
    <section className="section" id="sobre">
      <div className="container">
        <div className={styles.inner}>
          <div>
            <p className={styles.eyebrow}>Nossa história</p>
            <h2 className={styles.title}>Nossa Missão</h2>
            <p className={styles.body}>
              A MUSA nasceu da crença de que mulheres talentosas merecem uma plataforma
              que as coloque em destaque. Em um mercado onde a visibilidade ainda é um
              desafio para profissionais femininas, criamos um espaço exclusivo para
              que seu talento seja visto, valorizado e contratado.
            </p>
            <p className={styles.body}>
              Aqui não há algoritmos que escondem. Não há taxas que pesam. Apenas
              uma vitrine limpa e elegante para que você brilhe do jeito que merece.
            </p>
            <blockquote className={styles.quote}>
              "Cada mulher na MUSA é extraordinária — e o mundo precisa saber disso."
            </blockquote>
          </div>
          <div className={styles.right}>
            <div className={styles.statCard}>
              <div className={styles.statNum}>500+</div>
              <div className={styles.statLabel}>Profissionais cadastradas</div>
            </div>
            <div className={styles.missionCard}>
              Acreditamos que quando mulheres se apoiam, o mundo fica mais bonito,
              criativo e justo — e a MUSA é o nosso jeito de tornar isso realidade.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
