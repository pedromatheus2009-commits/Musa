import { useState, useEffect } from 'react'
import { bauService } from '../../../services/bau.service'

const fmtPreco = (c) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const box = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,130,0.12)', borderRadius: 'var(--radius-sm)' }
const btnSmall = (c) => ({ fontSize: '0.74rem', padding: '4px 10px', background: `${c}22`, color: c, border: `1px solid ${c}55`, borderRadius: 4 })

export default function AdminBau() {
  const [itens, setItens] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('pendente')

  function load(f = filtro) {
    setLoading(true)
    bauService.listAdmin(f || undefined).then(setItens).catch(() => setItens([])).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, []) // eslint-disable-line

  function changeFiltro(f) { setFiltro(f); load(f) }
  async function aprovar(id) { await bauService.aprovar(id); load() }
  async function recusar(id) { await bauService.recusar(id); load() }

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--white)', marginBottom: 4 }}>Moderar Baú</h2>
      <p style={{ color: 'var(--white-muted)', fontSize: '0.88rem', marginBottom: 20 }}>Aprove ou recuse os anúncios do bazar</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['pendente', 'Pendentes'], ['aprovado', 'Aprovados'], ['', 'Todos']].map(([v, l]) => (
          <button key={v} onClick={() => changeFiltro(v)} className={filtro === v ? 'btn btn-primary' : 'btn btn-secondary'} style={{ fontSize: '0.78rem', padding: '6px 14px' }}>{l}</button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: 'var(--gray-light)' }}>Carregando...</p>
      ) : itens.length === 0 ? (
        <p style={{ color: 'var(--gray-light)', fontStyle: 'italic' }}>Nenhum item.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {itens.map((it) => (
            <div key={it.id} style={{ ...box, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ width: 52, height: 52, borderRadius: 6, flexShrink: 0, background: 'var(--black-soft)', backgroundImage: it.fotos?.[0] ? `url(${it.fotos[0]})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ flex: 1, minWidth: 150 }}>
                <div style={{ color: 'var(--white)', fontWeight: 600, fontSize: '0.92rem' }}>{it.titulo}</div>
                <div style={{ color: 'var(--white-muted)', fontSize: '0.78rem' }}>{it.tipo === 'troca' ? 'Troca' : (it.preco != null ? fmtPreco(it.preco) : 'A combinar')} · por {it.user?.nome}</div>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--gray-light)' }}>{it.status}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {it.status !== 'aprovado' && <button onClick={() => aprovar(it.id)} style={btnSmall('#7de0a0')}>Aprovar</button>}
                {it.status !== 'recusado' && <button onClick={() => recusar(it.id)} style={btnSmall('#e07070')}>Recusar</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
