import styles from './Hero.module.css'

export default function Hero({ onFindClick, onAnnounceClick }) {
  return (
    <section className={styles.hero} id="home">
      <div className={styles.glow} />
      <div className={styles.glowNude} />
      <div className="container">
        <div className={styles.inner}>
          <div>
            <p className={styles.eyebrow}>Plataforma para mulheres profissionais</p>
            <h1 className={styles.title}>
              MU<span className={styles.titleAccent}>SA</span>
            </h1>
            <p className={styles.subtitle}>vitrine de mulheres extraordinárias</p>
            <p className={styles.description}>
              Conectamos clientes às melhores profissionais femininas do Brasil.
              Fotografia, design, terapia, gastronomia, tecnologia e muito mais —
              tudo em um só lugar.
            </p>
            <div className={styles.ctas}>
              <button className="btn btn-primary" onClick={onFindClick}>
                Encontrar Profissional
              </button>
              <button className="btn btn-outline" onClick={onAnnounceClick}>
                Anunciar-se
              </button>
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statNum}>500+</div>
                <div className={styles.statLabel}>Profissionais</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNum}>12</div>
                <div className={styles.statLabel}>Categorias</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNum}>Brasil</div>
                <div className={styles.statLabel}>Cobertura</div>
              </div>
            </div>
          </div>

          <div className={styles.cardWrap}>
            <div className={styles.cardDecor1} />
            <div className={styles.cardDecor2} />
            <div className={styles.floatCard}>
              <div className={styles.cardAvatar}>C</div>
              <div className={styles.cardName}>Camila Rezende</div>
              <div className={styles.cardRole}>Fotógrafa</div>
              <div className={styles.cardStars}>★★★★★</div>
              <div className={styles.cardCity}>📍 São Paulo, SP</div>
              <div className={styles.cardBadge}>✦ Profissional verificada</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
