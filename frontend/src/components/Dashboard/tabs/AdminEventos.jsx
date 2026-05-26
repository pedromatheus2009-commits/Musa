import { useState, useEffect, useRef } from 'react'
import { eventosService } from '../../../services/eventos.service'

const fmtPreco = (c) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtData = (d) => new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
const STATUS = {
  rascunho: { label: 'Rascunho', color: '#b0a89f' },
  publicado: { label: 'Publicado', color: '#7de0a0' },
  lotado: { label: 'Lotado', color: '#e0c07d' },
  encerrado: { label: 'Encerrado', color: '#888' },
  cancelado: { label: 'Cancelado', color: '#e07070' },
}
const EMPTY = { tipo: 'oficina', titulo: '', descricao: '', dataHora: '', local: '', online: false, precoReais: '', vagas: '', imagemUrl: '', status: 'publicado' }

const box = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,130,0.12)', borderRadius: 'var(--radius-sm)' }

export default function AdminEventos() {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const fileRef = useRef()

  function load() {
    setLoading(true)
    eventosService.listAdmin().then(setEventos).catch(() => setEventos([])).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await eventosService.create({
        tipo: form.tipo,
        titulo: form.titulo,
        descricao: form.descricao || undefined,
        dataHora: new Date(form.dataHora).toISOString(),
        local: form.local || undefined,
        online: form.online,
        preco: Math.round(parseFloat(form.precoReais || '0') * 100),
        vagas: parseInt(form.vagas, 10),
        imagemUrl: form.imagemUrl || undefined,
        status: form.status,
      })
      setForm(EMPTY); setShowForm(false); load()
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao criar evento. Confira os campos.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!window.confirm('Excluir este evento e todas as inscrições?')) return
    try { await eventosService.remove(id); load() } catch { alert('Erro ao excluir') }
  }
  async function handlePublish(id) {
    try { await eventosService.update(id, { status: 'publicado' }); load() } catch { alert('Erro ao publicar') }
  }

  async function handleFoto(e) {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try { const { url } = await eventosService.uploadFoto(file); setForm((f) => ({ ...f, imagemUrl: url })) }
    catch { alert('Falha no upload da imagem') } finally { setUploading(false) }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--white)', marginBottom: 4 }}>Eventos & Oficinas</h2>
          <p style={{ color: 'var(--white-muted)', fontSize: '0.88rem' }}>Monte a agenda, acompanhe inscrições e lotação</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.74rem' }} onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Fechar' : '+ Novo evento'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ ...box, padding: 18, marginBottom: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="form-group">
            <label>Tipo</label>
            <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
              <option value="oficina">Oficina</option>
              <option value="aula">Aula</option>
              <option value="evento">Evento</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="publicado">Publicar agora</option>
              <option value="rascunho">Salvar como rascunho</option>
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Título</label>
            <input required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Descrição</label>
            <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Data e hora</label>
            <input type="datetime-local" required min={new Date().toISOString().slice(0, 16)} value={form.dataHora} onChange={(e) => setForm({ ...form, dataHora: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Local {form.online ? '(online)' : ''}</label>
            <input value={form.local} placeholder={form.online ? 'Link enviado depois' : 'Endereço'} onChange={(e) => setForm({ ...form, local: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Preço (R$)</label>
            <input type="number" min="0" step="0.01" required value={form.precoReais} onChange={(e) => setForm({ ...form, precoReais: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Vagas</label>
            <input type="number" min="1" required value={form.vagas} onChange={(e) => setForm({ ...form, vagas: e.target.value })} />
          </div>
          <label style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--white-muted)', fontSize: '0.85rem' }}>
            <input type="checkbox" checked={form.online} onChange={(e) => setForm({ ...form, online: e.target.checked })} />
            Evento online
          </label>
          <div style={{ gridColumn: '1 / -1' }}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFoto} aria-label="Imagem do evento" />
            <button type="button" className="btn btn-secondary" style={{ fontSize: '0.74rem', padding: '6px 14px' }} onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? 'Enviando...' : (form.imagemUrl ? '↻ Trocar imagem' : '↑ Adicionar imagem')}
            </button>
            {form.imagemUrl && <img src={form.imagemUrl} alt="Prévia do evento" style={{ display: 'block', marginTop: 10, width: 120, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(201,168,130,0.2)' }} />}
          </div>
          <button className="btn btn-primary" disabled={saving} style={{ gridColumn: '1 / -1', justifyContent: 'center' }}>
            {saving ? 'Salvando...' : 'Criar evento'}
          </button>
        </form>
      )}

      {loading ? (
        <p style={{ color: 'var(--gray-light)' }}>Carregando...</p>
      ) : eventos.length === 0 ? (
        <p style={{ color: 'var(--gray-light)', fontStyle: 'italic' }}>Nenhum evento ainda. Crie o primeiro ✦</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {eventos.map((e) => (
            <EventoRow
              key={e.id}
              e={e}
              expanded={expanded === e.id}
              onToggle={() => setExpanded(expanded === e.id ? null : e.id)}
              onDelete={() => handleDelete(e.id)}
              onPublish={() => handlePublish(e.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function EventoRow({ e, expanded, onToggle, onDelete, onPublish }) {
  const st = STATUS[e.status] || STATUS.rascunho
  return (
    <div style={{ ...box, padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ color: 'var(--white)', fontWeight: 600, fontSize: '0.95rem' }}>{e.titulo}</div>
          <div style={{ color: 'var(--white-muted)', fontSize: '0.78rem' }}>{fmtData(e.dataHora)} · {fmtPreco(e.preco)}</div>
        </div>
        <div style={{ textAlign: 'center', minWidth: 90 }}>
          <div style={{ color: 'var(--nude)', fontWeight: 700 }}>{e.confirmadas}/{e.vagas}</div>
          <div style={{ color: 'var(--gray-light)', fontSize: '0.72rem' }}>{e.lotacaoPct}% lotado</div>
        </div>
        <span style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: 4, fontWeight: 600, background: `${st.color}22`, color: st.color }}>{st.label}</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={onToggle} style={btnSmall('var(--nude)')}>{expanded ? 'Fechar' : 'Inscritos'}</button>
          {e.status === 'rascunho' && <button onClick={onPublish} style={btnSmall('#7de0a0')}>Publicar</button>}
          <button onClick={onDelete} style={btnSmall('#e07070')}>Excluir</button>
        </div>
      </div>
      {expanded && <Inscritos eventoId={e.id} />}
    </div>
  )
}

function Inscritos({ eventoId }) {
  const [data, setData] = useState(null)
  const [novo, setNovo] = useState({ nome: '', whatsapp: '', email: '' })
  const [adding, setAdding] = useState(false)

  function load() { eventosService.listInscricoes(eventoId).then(setData).catch(() => setData({ inscricoes: [] })) }
  useEffect(() => { load() }, [eventoId])

  async function handleAdd(ev) {
    ev.preventDefault()
    if (!novo.nome.trim()) return
    setAdding(true)
    try {
      await eventosService.addManual(eventoId, { nome: novo.nome, whatsapp: novo.whatsapp || undefined, email: novo.email || undefined })
      setNovo({ nome: '', whatsapp: '', email: '' }); load()
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao inscrever (talvez esteja lotado).')
    } finally { setAdding(false) }
  }

  if (!data) return <p style={{ color: 'var(--gray-light)', fontSize: '0.8rem', marginTop: 12 }}>Carregando inscritos...</p>

  const confirmadas = data.inscricoes.filter((i) => i.status === 'confirmada')
  return (
    <div style={{ marginTop: 14, borderTop: '1px solid rgba(201,168,130,0.12)', paddingTop: 12 }}>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <input placeholder="Nome (inscrição manual)" value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })}
          style={inputInline} />
        <input placeholder="WhatsApp (opcional)" value={novo.whatsapp} onChange={(e) => setNovo({ ...novo, whatsapp: e.target.value })}
          style={{ ...inputInline, maxWidth: 160 }} />
        <button className="btn btn-secondary" disabled={adding} style={{ fontSize: '0.74rem', padding: '6px 14px' }}>
          {adding ? '...' : '+ Inscrever'}
        </button>
      </form>
      {confirmadas.length === 0 ? (
        <p style={{ color: 'var(--gray-light)', fontSize: '0.8rem', fontStyle: 'italic' }}>Nenhuma inscrição confirmada ainda.</p>
      ) : (
        <ol style={{ listStyle: 'decimal inside', color: 'var(--white-muted)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {confirmadas.map((i) => (
            <li key={i.id}>
              {i.nome} {i.whatsapp ? `· ${i.whatsapp}` : ''}
              {i.origem === 'manual' && <span style={{ color: 'var(--gray-light)', fontSize: '0.7rem' }}> (manual)</span>}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

const btnSmall = (color) => ({ fontSize: '0.74rem', padding: '4px 10px', background: `${color}22`, color, border: `1px solid ${color}55`, borderRadius: 4 })
const inputInline = { flex: 1, minWidth: 160, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,130,0.2)', borderRadius: 'var(--radius-sm)', color: 'var(--white)', padding: '8px 12px', fontSize: '0.82rem' }
