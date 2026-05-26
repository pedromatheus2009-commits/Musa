import { useState, useEffect } from 'react'
import { bauService } from '../services/bau.service'
import styles from './Bau.module.css'

const fmtPreco = (c) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const waLink = (item) => {
  const msg = `Olá! Vi seu anúncio "${item.titulo}" no Baú da MUSA e tenho interesse.`
  return `https://wa.me/${item.whatsapp}?text=${encodeURIComponent(msg)}`
}

export default function Bau() {
  const [itens, setItens] = useState([])
  const [loading, setLoading] = useState(true)
  const [tipo, setTipo] = useState('')
  const [q, setQ] = useState('')
  const [error, setError] = useState('')

  function load() {
    setLoading(true)
    bauService.listPublico({ tipo: tipo || undefined, q: q || undefined })
      .then((data) => { setItens(data); setError('') }).catch(() => setError('Não foi possível carregar o Baú. Tente novamente.')).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [tipo]) // eslint-disable-line

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>BAÚ DA MUSA</p>
        <h1 className={styles.title}>Bazar de trocas e achados</h1>
        <p className={styles.subtitle}>Peças e objetos com história, de mulher para mulher. Combine direto pelo WhatsApp.</p>
      </div>

      <div className={styles.container}>
        <div className={styles.toolbar}>
          <div className={styles.filters}>
            {[['', 'Tudo'], ['venda', 'À venda'], ['troca', 'Troca']].map(([v, l]) => (
              <button key={v} className={`${styles.filterBtn} ${tipo === v ? styles.active : ''}`} onClick={() => setTipo(v)}>{l}</button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); load() }} className={styles.search}>
            <input placeholder="Buscar..." value={q} onChange={(e) => setQ(e.target.value)} />
            <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.72rem' }}>Buscar</button>
          </form>
        </div>

        {loading ? (
          <p className={styles.muted}>Carregando...</p>
        ) : error ? (
          <p className={styles.muted}>{error}</p>
        ) : itens.length === 0 ? (
          <p className={styles.muted}>Nenhum item por aqui ainda ✦</p>
        ) : (
          <div className={styles.grid}>
            {itens.map((it) => (
              <article key={it.id} className={styles.card}>
                <div className={styles.cardImg} style={it.fotos?.[0] ? { backgroundImage: `url(${it.fotos[0]})` } : {}}>
                  {!it.fotos?.[0] && <span className={styles.noImg}>✦</span>}
                  <span className={`tag ${it.tipo === 'troca' ? 'tag-nude' : 'tag-wine'} ${styles.tipoTag}`}>{it.tipo === 'troca' ? 'Troca' : 'Venda'}</span>
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{it.titulo}</h3>
                  {it.categoria && <span className={styles.cat}>{it.categoria}</span>}
                  {it.descricao && <p className={styles.cardDesc}>{it.descricao}</p>}
                  <div className={styles.cardFooter}>
                    <span className={styles.preco}>{it.tipo === 'troca' ? 'Troca' : (it.preco != null ? fmtPreco(it.preco) : 'A combinar')}</span>
                    <a className="btn btn-primary" style={{ padding: '9px 16px', fontSize: '0.7rem' }} href={waLink(it)} target="_blank" rel="noreferrer">WhatsApp</a>
                  </div>
                  <p className={styles.vendedora}>por {it.user?.nome}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
