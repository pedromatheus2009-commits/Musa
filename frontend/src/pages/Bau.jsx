import { useState, useEffect } from 'react'
import { bauService } from '../services/bau.service'
import { useReveal } from '../hooks/useReveal'
import StripeBackground from '../components/brand/StripeBackground'
import SectionLabel from '../components/brand/SectionLabel'
import Selo from '../components/brand/Selo'
import styles from './Bau.module.css'

const fmtPreco = (c) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const waLink = (item) => {
  const msg = `Olá! Vi seu anúncio "${item.titulo}" no Baú da Casa Musa e tenho interesse.`
  return `https://wa.me/${item.whatsapp}?text=${encodeURIComponent(msg)}`
}

export default function Bau() {
  const [itens, setItens] = useState([])
  const [loading, setLoading] = useState(true)
  const [tipo, setTipo] = useState('')
  const [q, setQ] = useState('')
  const [error, setError] = useState('')
  const gridRef = useReveal()

  function load() {
    setLoading(true)
    bauService.listPublico({ tipo: tipo || undefined, q: q || undefined })
      .then((data) => { setItens(data); setError('') })
      .catch(() => setError('Não foi possível carregar o Baú. Tente novamente.'))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [tipo]) // eslint-disable-line

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <StripeBackground density="narrow" opacity={0.1} />
        <div className={styles.headerInner}>
          <SectionLabel align="center">Casa Musa · Brechó</SectionLabel>
          <h1 className={styles.title}>Baú da Musa</h1>
          <p className={styles.subtitle}>Peças e objetos com história, de mulher para mulher. Combine direto pelo WhatsApp.</p>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.toolbar}>
          <div className={styles.filters}>
            {[['', 'Tudo'], ['venda', 'À venda'], ['troca', 'Troca']].map(([v, l]) => (
              <button key={v} className={`${styles.filterBtn} ${tipo === v ? styles.active : ''}`} onClick={() => setTipo(v)}>{l}</button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); load() }} className={styles.search}>
            <input placeholder="Buscar no baú..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar no baú" />
            <button className={`btn btn-outline ${styles.searchBtn}`}>Buscar</button>
          </form>
        </div>

        {loading ? (
          <div className={styles.grid} aria-hidden="true">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className={styles.skeleton} />)}
          </div>
        ) : error ? (
          <div className={styles.state}><Selo kind="star" size={30} /><p>{error}</p></div>
        ) : itens.length === 0 ? (
          <div className={styles.state}><Selo kind="crest" size={30} /><p>Nenhum item por aqui ainda. Volte em breve.</p></div>
        ) : (
          <div className={styles.grid} ref={gridRef}>
            {itens.map((it) => (
              <article key={it.id} className={`${styles.card} reveal`}>
                <div
                  className={styles.cardImg}
                  role="img"
                  aria-label={it.titulo}
                  style={it.fotos?.[0] ? { backgroundImage: `url(${it.fotos[0]})` } : {}}
                >
                  {!it.fotos?.[0] && <span className={styles.noImg}><Selo kind="crest" size={34} /></span>}
                  <span className={`tag ${it.tipo === 'troca' ? 'tag-nude' : 'tag-wine'} ${styles.tipoTag}`}>{it.tipo === 'troca' ? 'Troca' : 'Venda'}</span>
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{it.titulo}</h3>
                  {it.categoria && <span className={styles.cat}>{it.categoria}</span>}
                  {it.descricao && <p className={styles.cardDesc}>{it.descricao}</p>}
                  <div className={styles.cardFooter}>
                    <span className={styles.preco}>{it.tipo === 'troca' ? 'Troca' : (it.preco != null ? fmtPreco(it.preco) : 'A combinar')}</span>
                    <a className={`btn btn-primary ${styles.waBtn}`} href={waLink(it)} target="_blank" rel="noreferrer noopener">WhatsApp</a>
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
