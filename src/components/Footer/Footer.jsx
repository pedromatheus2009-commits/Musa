import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>MU<span>SA</span></Link>
            <p className={styles.tagline}>Vitrine de mulheres extraordinárias. Conectando talentos femininos a quem precisa deles.</p>
          </div>
          <div>
            <div className={styles.colTitle}>Plataforma</div>
            <div className={styles.links}>
              <Link to="/profissionais" className={styles.link}>Profissionais</Link>
              <Link to="/anunciar" className={styles.link}>Anunciar-se</Link>
              <Link to="/feed" className={styles.link}>Feed MUSA</Link>
            </div>
          </div>
          <div>
            <div className={styles.colTitle}>Empresa</div>
            <div className={styles.links}>
              <Link to="/sobre" className={styles.link}>Sobre nós</Link>
              <Link to="/parcerias" className={styles.link}>Parcerias</Link>
            </div>
          </div>
          <div>
            <div className={styles.colTitle}>Contato</div>
            <div className={styles.links}>
              <a href="mailto:contato@musacasa.com.br" className={styles.link}>contato@musacasa.com.br</a>
              <a href="https://instagram.com/musacasa" target="_blank" rel="noreferrer" className={styles.link}>◎ Instagram</a>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <span className={styles.copy}>© {year} MUSA. Todos os direitos reservados.</span>
          <div className={styles.socials}>
            <a href="https://instagram.com/musacasa" target="_blank" rel="noreferrer" className={styles.socialLink}>
              ◎ Instagram
            </a>
            <a href="https://linkedin.com/company/musacasa" target="_blank" rel="noreferrer" className={styles.socialLink}>
              ◈ LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
