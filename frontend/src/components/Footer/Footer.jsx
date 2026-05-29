import { Link } from 'react-router-dom'
import StripeBackground from '../brand/StripeBackground'
import Selo from '../brand/Selo'
import styles from './Footer.module.css'

const InstagramIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
)

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <StripeBackground density="narrow" opacity={0.1} className={styles.band} />
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo} aria-label="Casa Musa — início">
              <span className={styles.logoKicker}>Casa</span>
              <span className={styles.logoScript}>Musa</span>
            </Link>
            <p className={styles.tagline}>
              Um espaço de mulheres em Sorocaba — oficinas, encontros e uma vitrine de talentos femininos.
            </p>
            <Selo kind="heart" size={28} className={styles.brandSelo} />
          </div>
          <div>
            <div className={styles.colTitle}>A Casa</div>
            <div className={styles.links}>
              <Link to="/agenda" className={styles.link}>Agenda &amp; Oficinas</Link>
              <Link to="/bau" className={styles.link}>Baú da Musa</Link>
              <Link to="/feed" className={styles.link}>Novidades</Link>
            </div>
          </div>
          <div>
            <div className={styles.colTitle}>Profissionais</div>
            <div className={styles.links}>
              <Link to="/profissionais" className={styles.link}>Vitrine</Link>
              <Link to="/anunciar" className={styles.link}>Anunciar-se</Link>
              <Link to="/parcerias" className={styles.link}>Parcerias</Link>
            </div>
          </div>
          <div>
            <div className={styles.colTitle}>Contato</div>
            <div className={styles.links}>
              <a href="mailto:contato@musacasa.com.br" className={styles.link}>contato@musacasa.com.br</a>
              <span className={styles.address}>Rua Antônio de Oliveira, 222 — Sorocaba/SP</span>
              <a href="https://instagram.com/musacasa" target="_blank" rel="noreferrer noopener" className={styles.socialLink} aria-label="Instagram da Casa Musa">
                {InstagramIcon}<span>@musacasa</span>
              </a>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <span className={styles.copy}>© {year} Casa Musa. Feito com carinho.</span>
          <div className={styles.socials}>
            <a href="https://instagram.com/musacasa" target="_blank" rel="noreferrer noopener" className={styles.socialLink} aria-label="Instagram da Casa Musa">
              {InstagramIcon}<span>Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
