import { useState, useEffect } from 'react'
import { adminService } from '../../../services/admin.service'
import styles from './AdminAnalytics.module.css'

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService.getStats()
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  const cards = stats ? [
    { label: 'Usuários cadastrados', value: stats.totalUsers, cls: styles.accentGold },
    { label: 'Perfis aprovados', value: stats.totalProfiles, cls: styles.accentGreen },
    { label: 'Perfis pendentes', value: stats.pendingProfiles, cls: styles.accentBrick },
    { label: 'Avaliações recebidas', value: stats.totalReviews, cls: styles.accentWine },
  ] : []

  return (
    <div>
      <h2 className={styles.title}>Resultados</h2>
      <p className={styles.subtitle}>Visão geral da plataforma Casa Musa</p>
      {loading ? (
        <p className={styles.muted}>Carregando...</p>
      ) : (
        <div className={styles.grid}>
          {cards.map((c) => (
            <div key={c.label} className={styles.card}>
              <div className={`${styles.value} ${c.cls}`}>
                {c.value}
              </div>
              <div className={styles.label}>
                {c.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
