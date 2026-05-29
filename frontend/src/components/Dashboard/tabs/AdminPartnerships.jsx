import { useState, useEffect } from 'react'
import { partnershipsService } from '../../../services/partnerships.service'
import styles from './AdminPartnerships.module.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const PAGE = 12

export default function AdminPartnerships() {
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [visible, setVisible] = useState(PAGE)

  function load(f = filter) {
    setLoading(true)
    setVisible(PAGE)
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
  const shown = proposals.slice(0, visible)

  return (
    <div>
      <h2 className={styles.title}>
        Propostas de Parcerias
        {unreadCount > 0 && (
          <span className={styles.countBadge}>
            {unreadCount} novas
          </span>
        )}
      </h2>
      <p className={styles.subtitle}>Propostas enviadas pelo formulário de parcerias</p>

      <div className={styles.filters}>
        {[['all', 'Todas'], ['unread', 'Não lidas'], ['read', 'Lidas']].map(([val, label]) => (
          <button key={val} onClick={() => changeFilter(val)}
            className={`${filter === val ? 'btn btn-primary' : 'btn btn-outline'} ${styles.filterBtn}`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className={styles.muted}>Carregando...</p>
      ) : proposals.length === 0 ? (
        <p className={styles.empty}>Nenhuma proposta encontrada.</p>
      ) : (
        <>
          <div className={styles.list}>
            {shown.map((p) => (
              <div key={p.id} className={`${styles.card} ${p.lida ? '' : styles.cardUnread}`}>
                <div className={styles.cardHead}>
                  <div>
                    <div className={styles.name}>{p.nome} — {p.empresa}</div>
                    <div className={styles.meta}>{p.email} · {p.tipo} · {formatDate(p.createdAt)}</div>
                  </div>
                  <div className={styles.actions}>
                    {!p.lida && (
                      <button onClick={() => handleRead(p.id)} className={`${styles.actionBtn} ${styles.read}`}>
                        Marcar lida
                      </button>
                    )}
                    <button onClick={() => handleDelete(p.id)} className={`${styles.actionBtn} ${styles.delete}`}>
                      Excluir
                    </button>
                  </div>
                </div>
                <p className={styles.message}>{p.mensagem}</p>
              </div>
            ))}
          </div>
          {visible < proposals.length && (
            <div className={styles.loadMore}>
              <button className="btn btn-outline" onClick={() => setVisible((v) => v + PAGE)}>Carregar mais</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
