import { useState, useEffect } from 'react'
import { eventosService } from '../../../services/eventos.service'
import styles from './AdminIndicadores.module.css'

const fmtBRL = (cents) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtData = (d) => new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
const TIPO = { oficina: 'Oficinas', aula: 'Aulas', evento: 'Eventos' }

export default function AdminIndicadores() {
  const [eventos, setEventos] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    eventosService.listAdmin().then(setEventos).catch(() => setError('Não foi possível carregar os indicadores.'))
  }, [])

  if (error) return <div><h2 className={styles.title}>Indicadores</h2><p className={styles.muted}>{error}</p></div>
  if (!eventos) return <div><h2 className={styles.title}>Indicadores</h2><p className={styles.muted}>Carregando...</p></div>

  const now = Date.now()
  const total = eventos.length
  const confirmados = eventos.reduce((s, e) => s + (e.confirmadas || 0), 0)
  const receitaCents = eventos.reduce((s, e) => s + (e.confirmadas || 0) * (e.preco || 0), 0)
  const vagasTotal = eventos.reduce((s, e) => s + (e.vagas || 0), 0)
  const ocupacao = vagasTotal ? Math.round((confirmados / vagasTotal) * 100) : 0
  const esgotados = eventos.filter((e) => e.status === 'lotado' || (e.vagas && e.confirmadas >= e.vagas)).length
  const publicados = eventos.filter((e) => e.status === 'publicado').length
  const proximos = eventos
    .filter((e) => new Date(e.dataHora).getTime() > now && ['publicado', 'lotado'].includes(e.status))
    .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))

  const porTipo = ['oficina', 'aula', 'evento']
    .map((t) => {
      const list = eventos.filter((e) => e.tipo === t)
      return { tipo: t, count: list.length, inscritos: list.reduce((s, e) => s + (e.confirmadas || 0), 0) }
    })
    .filter((x) => x.count > 0)

  const cards = [
    { label: 'Oficinas & eventos', value: total, sub: `${publicados} publicados`, cls: styles.accentBrick },
    { label: 'Inscritos confirmados', value: confirmados, sub: 'no total', cls: styles.accentGreen },
    { label: 'Receita estimada', value: fmtBRL(receitaCents), sub: 'confirmadas × preço', cls: styles.accentGold, small: true },
    { label: 'Ocupação média', value: `${ocupacao}%`, sub: `${confirmados}/${vagasTotal} vagas`, cls: styles.accentWine },
    { label: 'Esgotados', value: esgotados, sub: 'lotados', cls: styles.accentBrick },
    { label: 'Próximos', value: proximos.length, sub: 'a acontecer', cls: styles.accentGreen },
  ]

  return (
    <div>
      <h2 className={styles.title}>Indicadores</h2>
      <p className={styles.subtitle}>Panorama das oficinas e eventos da Casa Musa</p>

      {total === 0 ? (
        <p className={styles.muted}>Nenhuma oficina ou evento ainda. Crie a primeira na aba "Oficinas &amp; Eventos".</p>
      ) : (
        <>
          <div className={styles.grid}>
            {cards.map((c) => (
              <div key={c.label} className={styles.card}>
                <div className={`${styles.value} ${c.cls} ${c.small ? styles.valueSmall : ''}`}>{c.value}</div>
                <div className={styles.label}>{c.label}</div>
                {c.sub && <div className={styles.sub}>{c.sub}</div>}
              </div>
            ))}
          </div>

          {porTipo.length > 0 && (
            <>
              <h3 className={styles.section}>Por tipo</h3>
              <div className={styles.tipoRow}>
                {porTipo.map((t) => (
                  <div key={t.tipo} className={styles.tipoCard}>
                    <div className={styles.tipoName}>{TIPO[t.tipo] || t.tipo}</div>
                    <div className={styles.tipoStats}><strong>{t.count}</strong> eventos · <strong>{t.inscritos}</strong> inscritos</div>
                  </div>
                ))}
              </div>
            </>
          )}

          <h3 className={styles.section}>Próximas oficinas &amp; eventos</h3>
          {proximos.length === 0 ? (
            <p className={styles.muted}>Nenhum evento futuro publicado.</p>
          ) : (
            <div className={styles.list}>
              {proximos.map((e) => {
                const pct = e.vagas ? Math.round((e.confirmadas / e.vagas) * 100) : 0
                return (
                  <div key={e.id} className={styles.row}>
                    <div className={styles.rowMain}>
                      <div className={styles.rowTitle}>{e.titulo}</div>
                      <div className={styles.rowMeta}>{fmtData(e.dataHora)} · {fmtBRL(e.preco)}</div>
                    </div>
                    <div className={styles.bar} title={`${pct}% de ocupação`}>
                      <div className={styles.barFill} style={{ width: `${Math.min(100, pct)}%` }} />
                    </div>
                    <div className={styles.rowNums}>
                      <span className={styles.count}>{e.confirmadas}/{e.vagas}</span>
                      <span className={styles.pct}>{pct}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
