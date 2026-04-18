import { useState, useEffect } from 'react'
import { adminService } from '../../../services/admin.service'
import styles from './AdminProfiles.module.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR')
}

export default function AdminProfiles() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('all')

  function load(s = status) {
    setLoading(true)
    adminService.listProfiles({ status: s, limit: 50 })
      .then((r) => setProfiles(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  function changeStatus(s) {
    setStatus(s)
    load(s)
  }

  async function handleApprove(id) {
    await adminService.approveProfile(id)
    setProfiles((p) => p.map((x) => x.id === id ? { ...x, aprovado: true, ativo: true } : x))
  }

  async function handleReject(id) {
    await adminService.rejectProfile(id)
    setProfiles((p) => p.map((x) => x.id === id ? { ...x, aprovado: false, ativo: false } : x))
  }

  async function handleDelete(id) {
    if (!window.confirm('Excluir este perfil permanentemente?')) return
    try {
      await adminService.deleteProfile(id)
      setProfiles((p) => p.filter((x) => x.id !== id))
    } catch {
      alert('Erro ao excluir perfil')
    }
  }

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--white)', marginBottom: 4 }}>Gerenciar Perfis</h2>
      <p style={{ color: 'var(--white-muted)', fontSize: '0.88rem', marginBottom: 24 }}>Aprove, rejeite ou exclua perfis cadastrados</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all','pending','approved'].map((s) => (
          <button key={s} onClick={() => changeStatus(s)}
            className={status === s ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ fontSize: '0.78rem', padding: '6px 14px' }}>
            {s === 'all' ? 'Todos' : s === 'pending' ? 'Pendentes' : 'Aprovados'}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: 'var(--gray-light)' }}>Carregando...</p>
      ) : profiles.length === 0 ? (
        <p style={{ color: 'var(--gray-light)', fontStyle: 'italic' }}>Nenhum perfil encontrado.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {profiles.map((p) => (
            <div key={p.id} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(201,168,130,0.1)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--white)', fontWeight: 600, fontSize: '0.9rem' }}>{p.nome}</div>
                <div style={{ color: 'var(--white-muted)', fontSize: '0.78rem' }}>{p.role} · {p.cidade || '—'}</div>
                <div style={{ color: 'var(--gray-light)', fontSize: '0.72rem' }}>{p.user?.email} · {formatDate(p.createdAt)}</div>
              </div>
              <span style={{
                fontSize: '0.7rem', padding: '3px 8px', borderRadius: 4, fontWeight: 600,
                background: p.aprovado ? 'rgba(80,180,100,0.15)' : 'rgba(220,100,80,0.15)',
                color: p.aprovado ? '#7de0a0' : '#e07070',
              }}>
                {p.aprovado ? 'Aprovado' : 'Pendente'}
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                {!p.aprovado && (
                  <button onClick={() => handleApprove(p.id)}
                    style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'rgba(80,180,100,0.2)', color: '#7de0a0', border: '1px solid rgba(80,180,100,0.3)', borderRadius: 4 }}>
                    Aprovar
                  </button>
                )}
                {p.aprovado && (
                  <button onClick={() => handleReject(p.id)}
                    style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'rgba(220,100,80,0.15)', color: '#e07070', border: '1px solid rgba(220,100,80,0.3)', borderRadius: 4 }}>
                    Suspender
                  </button>
                )}
                <button onClick={() => handleDelete(p.id)}
                  style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'rgba(255,80,80,0.1)', color: '#e07070', border: '1px solid rgba(220,80,80,0.3)', borderRadius: 4 }}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
