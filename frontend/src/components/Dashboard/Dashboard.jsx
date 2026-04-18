import { useState, useEffect } from 'react'
import { profilesService } from '../../services/profiles.service'
import { useAuth } from '../../context/AuthContext'
import EditProfile from './tabs/EditProfile'
import CreateProfile from './tabs/CreateProfile'
import MyPosts from './tabs/MyPosts'
import AdminFeed from './tabs/AdminFeed'
import AdminProfiles from './tabs/AdminProfiles'
import AdminAnalytics from './tabs/AdminAnalytics'
import AdminPartnerships from './tabs/AdminPartnerships'
import Assinatura from './tabs/Assinatura'
import styles from './Dashboard.module.css'

const USER_TABS = [
  { id: 'profile', label: 'Meu Perfil', icon: '👤' },
  { id: 'posts', label: 'Publicações', icon: '📝' },
  { id: 'assinatura', label: 'Assinatura', icon: '◈' },
]

const ADMIN_TABS = [
  { id: 'profile', label: 'Meu Perfil', icon: '👤' },
  { id: 'posts', label: 'Publicações', icon: '📝' },
  { id: 'assinatura', label: 'Assinatura', icon: '◈' },
  { id: 'feed', label: 'Feed MUSA', icon: '✦', adminOnly: true },
  { id: 'perfis', label: 'Gerenciar Perfis', icon: '✔', adminOnly: true },
  { id: 'analytics', label: 'Resultados', icon: '◉', adminOnly: true },
  { id: 'parcerias', label: 'Parcerias', icon: '◇', adminOnly: true },
]

export default function Dashboard({ onClose, onOpenAnnounce }) {
  const { user } = useAuth()
  const [tab, setTab] = useState('profile')
  const [profile, setProfile] = useState(undefined)
  const [loadingProfile, setLoadingProfile] = useState(true)

  const TABS = user?.isAdmin ? ADMIN_TABS : USER_TABS

  useEffect(() => {
    profilesService.getMe()
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoadingProfile(false))
  }, [])

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className={styles.overlay}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLogo}>MU<span>SA</span></div>
        <div className={styles.headerRight}>
          {user?.isAdmin && <span className={styles.adminBadge}>Admin</span>}
          <span className={styles.userName}>{user?.nome}</span>
          <button className={styles.closeBtn} onClick={onClose}>← Voltar ao site</button>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className={styles.mobileTabs}>
        <div className={styles.mobileTabList}>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`${styles.mobileTab} ${tab === t.id ? styles.active : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.body}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`${styles.navItem} ${tab === t.id ? styles.active : ''} ${t.adminOnly ? styles.adminItem : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span className={styles.navIcon}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className={styles.content}>
          {loadingProfile ? (
            <div style={{ color: 'var(--white-muted)', padding: '48px 0' }}>Carregando...</div>
          ) : (
            <>
              {tab === 'profile' && (
                profile === null
                  ? <CreateProfile onProfileCreated={setProfile} />
                  : <EditProfile profile={profile} onProfileUpdated={setProfile} />
              )}
              {tab === 'posts' && <MyPosts profile={profile} />}
              {tab === 'assinatura' && <Assinatura />}
              {tab === 'feed' && user?.isAdmin && <AdminFeed />}
              {tab === 'perfis' && user?.isAdmin && <AdminProfiles />}
              {tab === 'analytics' && user?.isAdmin && <AdminAnalytics />}
              {tab === 'parcerias' && user?.isAdmin && <AdminPartnerships />}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
