import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

const links = [
  { label: 'Profissionais', to: '/profissionais' },
  { label: 'Feed', to: '/feed' },
  { label: 'Parcerias', to: '/parcerias' },
  { label: 'Sobre', to: '/sobre' },
]

export default function Navbar({ onAuthClick, user, onLogout, onDashboardClick }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setOpen(false) }, [location])

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.inner}`}>
          <Link to="/" className={styles.logo}>
            MU<span>SA</span>
          </Link>

          <div className={styles.nav}>
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`${styles.link} ${location.pathname === l.to ? styles.activeLink : ''}`}
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <div className={styles.userBtn}>
                <div className={styles.avatar}>{user.nome?.slice(0, 2).toUpperCase()}</div>
                <button className={styles.dashboardBtn} onClick={onDashboardClick}>Meu Espaço</button>
                <button className={styles.logoutBtn} onClick={onLogout}>Sair</button>
              </div>
            ) : (
              <div className={styles.authGroup}>
                <Link to="/anunciar" className={styles.announceLink}>Anunciar-se</Link>
                <button className="btn btn-outline" style={{ padding: '9px 22px', fontSize: '0.7rem' }} onClick={onAuthClick}>
                  Entrar
                </button>
              </div>
            )}
          </div>

          <button className={styles.burger} onClick={() => setOpen((v) => !v)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`${styles.drawer} ${open ? styles.open : ''}`}>
        {links.map((l) => (
          <Link key={l.to} to={l.to} className={styles.drawerLink}>{l.label}</Link>
        ))}
        <Link to="/anunciar" className={styles.drawerLink}>Anunciar-se</Link>
        {user ? (
          <>
            <button className={styles.drawerLink} onClick={onDashboardClick}>Meu Espaço</button>
            <button className={styles.drawerLink} onClick={onLogout}>Sair</button>
          </>
        ) : (
          <button className="btn btn-outline" onClick={onAuthClick}>Entrar</button>
        )}
      </div>
    </>
  )
}
