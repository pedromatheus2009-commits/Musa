import { useState, useEffect } from 'react'
import { adminService } from '../../../services/admin.service'

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService.getStats()
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  const cards = stats ? [
    { label: 'Usuários cadastrados', value: stats.totalUsers, color: '#c9a882' },
    { label: 'Perfis aprovados', value: stats.totalProfiles, color: '#7de0a0' },
    { label: 'Perfis pendentes', value: stats.pendingProfiles, color: '#e07070' },
    { label: 'Avaliações recebidas', value: stats.totalReviews, color: '#a0c4ff' },
  ] : []

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--white)', marginBottom: 4 }}>Resultados</h2>
      <p style={{ color: 'var(--white-muted)', fontSize: '0.88rem', marginBottom: 28 }}>Visão geral da plataforma MUSA</p>
      {loading ? (
        <p style={{ color: 'var(--gray-light)' }}>Carregando...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {cards.map((c) => (
            <div key={c.label} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(201,168,130,0.1)',
              borderRadius: 'var(--radius-sm)',
              padding: '24px 20px',
            }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 700, color: c.color, fontFamily: 'var(--font-serif)', marginBottom: 6 }}>
                {c.value}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--white-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {c.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
