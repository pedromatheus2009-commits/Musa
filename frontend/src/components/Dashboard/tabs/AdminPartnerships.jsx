import { useState, useEffect } from 'react'
import { partnershipsService } from '../../../services/partnerships.service'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function AdminPartnerships() {
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  function load(f = filter) {
    setLoading(true)
    const params = f === 'unread' ? { lida: false } : f === 'read' ? { lida: true } : {}
    partnershipsService.list(params)
      .then(setProposals)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  function changeFilter(f) {
    setFilter(f)
    load(f)
  }

  async function handleRead(id) {
    await partnershipsService.markRead(id)
    setProposals((p) => p.map((x) => x.id === id ? { ...x, lida: true } : x))
  }

  async function handleDelete(id) {
    if (!window.confirm('Excluir esta proposta?')) return
    await partnershipsService.remove(id)
    setProposals((p) => p.filter((x) => x.id !== id))
  }

  const unreadCount = proposals.filter((p) => !p.lida).length

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--white)', marginBottom: 4 }}>
        Propostas de Parcerias
        {unreadCount > 0 && (
          <span style={{ marginLeft: 10, fontSize: '0.75rem', background: 'var(--wine)', color: 'var(--white)', borderRadius: 999, padding: '2px 8px' }}>
            {unreadCount} novas
          </span>
        )}
      </h2>
      <p style={{ color: 'var(--white-muted)', fontSize: '0.88rem', marginBottom: 24 }}>Propostas enviadas pelo formulário de parcerias</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['all', 'Todas'], ['unread', 'Não lidas'], ['read', 'Lidas']].map(([val, label]) => (
          <button key={val} onClick={() => changeFilter(val)}
            className={filter === val ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ fontSize: '0.78rem', padding: '6px 14px' }}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: 'var(--gray-light)' }}>Carregando...</p>
      ) : proposals.length === 0 ? (
        <p style={{ color: 'var(--gray-light)', fontStyle: 'italic' }}>Nenhuma proposta encontrada.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {proposals.map((p) => (
            <div key={p.id} style={{
              background: p.lida ? 'rgba(255,255,255,0.02)' : 'rgba(184,67,110,0.06)',
              border: `1px solid ${p.lida ? 'rgba(201,168,130,0.08)' : 'rgba(184,67,110,0.2)'}`,
              borderRadius: 'var(--radius-sm)',
              padding: '16px 20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 8 }}>
                <div>
                  <div style={{ color: 'var(--white)', fontWeight: 600 }}>{p.nome} — {p.empresa}</div>
                  <div style={{ color: 'var(--white-muted)', fontSize: '0.78rem' }}>{p.email} · {p.tipo} · {formatDate(p.createdAt)}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {!p.lida && (
                    <button onClick={() => handleRead(p.id)}
                      style={{ fontSize: '0.72rem', padding: '4px 10px', background: 'rgba(201,168,130,0.15)', color: 'var(--nude)', border: '1px solid rgba(201,168,130,0.3)', borderRadius: 4 }}>
                      Marcar lida
                    </button>
                  )}
                  <button onClick={() => handleDelete(p.id)}
                    style={{ fontSize: '0.72rem', padding: '4px 10px', background: 'rgba(255,80,80,0.1)', color: '#e07070', border: '1px solid rgba(220,80,80,0.3)', borderRadius: 4 }}>
                    Excluir
                  </button>
                </div>
              </div>
              <p style={{ color: 'var(--white-muted)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{p.mensagem}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
