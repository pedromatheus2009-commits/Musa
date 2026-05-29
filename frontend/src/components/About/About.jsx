import SectionLabel from '../brand/SectionLabel'
import Cartouche from '../brand/Cartouche'
import ScriptHeading from '../brand/ScriptHeading'
import Selo from '../brand/Selo'
import styles from './About.module.css'

export default function About() {
  return (
    <section className="section" id="sobre">
      <div className="container">
        <div className={styles.inner}>
          <div>
            <SectionLabel>Nossa história</SectionLabel>
            <h2 className={styles.title}>Uma casa feita de mulheres</h2>
            <p className={styles.body}>
              A Casa Musa nasceu para ser um espaço onde mulheres se encontram, aprendem e
              brilham. Entre oficinas, jantares e rodas de conversa, criamos um lugar afetivo
              em Sorocaba — e uma vitrine para que talentos femininos sejam vistos e valorizados.
            </p>
            <p className={styles.body}>
              Aqui não há algoritmos que escondem nem taxas que pesam. Apenas mulheres
              apoiando mulheres, com elegância e cuidado.
            </p>
            <blockquote className={styles.quote}>
              "Quando mulheres se apoiam, o mundo fica mais bonito, criativo e justo."
            </blockquote>
          </div>
          <div className={styles.right}>
            <Cartouche variant="dotted" tone="gold" className={styles.card}>
              <div className={styles.cardSelo}><Selo kind="heart" size={34} /></div>
              <ScriptHeading size="md" tone="brick" align="center" as="span">Musa</ScriptHeading>
              <p className={styles.cardLabel}>Sorocaba/SP · desde 2024</p>
            </Cartouche>
            <div className={styles.missionCard}>
              Acreditamos no encontro: toda semana, novas oficinas e experiências para
              viver de pertinho a comunidade da Musa.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
