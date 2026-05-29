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
      <h2 className={styles.title}>Gerenciar Perfis</h2>
      <p className={styles.subtitle}>Aprove, rejeite ou exclua perfis cadastrados</p>

      <div className={styles.filters}>
        {['all','pending','approved'].map((s) => (
          <button key={s} onClick={() => changeStatus(s)}
            className={`${status === s ? 'btn btn-primary' : 'btn btn-outline'} ${styles.filterBtn}`}>
            {s === 'all' ? 'Todos' : s === 'pending' ? 'Pendentes' : 'Aprovados'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className={styles.muted}>Carregando...</p>
      ) : profiles.length === 0 ? (
        <p className={styles.empty}>Nenhum perfil encontrado.</p>
      ) : (
        <div className={styles.list}>
          {profiles.map((p) => (
            <div key={p.id} className={styles.row}>
              <div className={styles.info}>
                <div className={styles.name}>{p.nome}</div>
                <div className={styles.metaRole}>{p.role} · {p.cidade || '—'}</div>
                <div className={styles.metaSub}>{p.user?.email} · {formatDate(p.createdAt)}</div>
              </div>
              <span className={`${styles.badge} ${p.aprovado ? styles.badgeApproved : styles.badgePending}`}>
                {p.aprovado ? 'Aprovado' : 'Pendente'}
              </span>
              <div className={styles.actions}>
                {!p.aprovado && (
                  <button onClick={() => handleApprove(p.id)} className={`${styles.actionBtn} ${styles.approve}`}>
                    Aprovar
                  </button>
                )}
                {p.aprovado && (
                  <button onClick={() => handleReject(p.id)} className={`${styles.actionBtn} ${styles.suspend}`}>
                    Suspender
                  </button>
                )}
                <button onClick={() => handleDelete(p.id)} className={`${styles.actionBtn} ${styles.delete}`}>
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
