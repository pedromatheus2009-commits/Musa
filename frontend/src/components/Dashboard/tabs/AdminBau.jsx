import { useState, useEffect } from 'react'
import { bauService } from '../../../services/bau.service'
import styles from './AdminBau.module.css'

const fmtPreco = (c) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const PAGE = 12

export default function AdminBau() {
  const [itens, setItens] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('pendente')
  const [visible, setVisible] = useState(PAGE)

  function load(f = filtro) {
    setLoading(true)
    setVisible(PAGE)
    bauService.listAdmin(f || undefined).then(setItens).catch(() => setItens([])).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, []) // eslint-disable-line

  function changeFiltro(f) { setFiltro(f); load(f) }
  async function aprovar(id) { await bauService.aprovar(id); load() }
  async function recusar(id) { await bauService.recusar(id); load() }

  const shown = itens.slice(0, visible)

  return (
    <div>
      <h2 className={styles.title}>Moderar Baú</h2>
      <p className={styles.subtitle}>Aprove ou recuse os anúncios do bazar</p>

      <div className={styles.filters}>
        {[['pendente', 'Pendentes'], ['aprovado', 'Aprovados'], ['', 'Todos']].map(([v, l]) => (
          <button key={v} onClick={() => changeFiltro(v)} className={`${filtro === v ? 'btn btn-primary' : 'btn btn-outline'} ${styles.filterBtn}`}>{l}</button>
        ))}
      </div>

      {loading ? (
        <p className={styles.muted}>Carregando...</p>
      ) : itens.length === 0 ? (
        <p className={styles.empty}>Nenhum item.</p>
      ) : (
        <>
          <div className={styles.list}>
            {shown.map((it) => (
              <div key={it.id} className={styles.itemCard}>
                <div className={styles.itemPhoto} style={it.fotos?.[0] ? { backgroundImage: `url(${it.fotos[0]})` } : undefined} />
                <div className={styles.itemMain}>
                  <div className={styles.itemTitle}>{it.titulo}</div>
                  <div className={styles.itemMeta}>{it.tipo === 'troca' ? 'Troca' : (it.preco != null ? fmtPreco(it.preco) : 'A combinar')} · por {it.user?.nome}</div>
                </div>
                <span className={styles.itemStatus}>{it.status}</span>
                <div className={styles.actions}>
                  {it.status !== 'aprovado' && <button onClick={() => aprovar(it.id)} className={`${styles.actionBtn} ${styles.approve}`}>Aprovar</button>}
                  {it.status !== 'recusado' && <button onClick={() => recusar(it.id)} className={`${styles.actionBtn} ${styles.reject}`}>Recusar</button>}
                </div>
              </div>
            ))}
          </div>
          {visible < itens.length && (
            <div className={styles.loadMore}>
              <button className="btn btn-outline" onClick={() => setVisible((v) => v + PAGE)}>Carregar mais</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
