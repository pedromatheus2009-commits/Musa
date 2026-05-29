import { useState, useEffect, useRef } from 'react'
import { eventosService } from '../../../services/eventos.service'
import styles from './AdminEventos.module.css'

const fmtPreco = (c) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtData = (d) => new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
const STATUS = {
  rascunho: 'Rascunho', publicado: 'Publicado', lotado: 'Lotado', encerrado: 'Encerrado', cancelado: 'Cancelado',
}
const EMPTY = { tipo: 'oficina', titulo: '', descricao: '', dataHora: '', local: '', online: false, precoReais: '', vagas: '', imagemUrl: '', status: 'publicado' }

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const onlyDigits = (v) => (v || '').replace(/\D/g, '')

function downloadCSV(titulo, inscricoes) {
  const header = ['Nome', 'Email', 'WhatsApp', 'Status', 'Origem', 'Data']
  const rows = inscricoes.map((i) => [
    i.nome, i.email || '', i.whatsapp || '', i.status, i.origem, new Date(i.createdAt).toLocaleString('pt-BR'),
  ])
  const esc = (cell) => `"${String(cell).replace(/"/g, '""')}"`
  const csv = [header, ...rows].map((r) => r.map(esc).join(',')).join('\r\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `inscritos-${titulo.replace(/[^\w]+/g, '-').toLowerCase()}.csv`
  document.body.appendChild(a); a.click(); a.remove()
  URL.revokeObjectURL(url)
}

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
    if (new Date(form.dataHora).getTime() <= Date.now()) { alert('A data do evento precisa estar no futuro.'); return }
    if (parseInt(form.vagas, 10) < 1) { alert('Informe pelo menos 1 vaga.'); return }
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
      <div className={styles.head}>
        <div>
          <h2 className={styles.title}>Oficinas &amp; Eventos</h2>
          <p className={styles.sub}>Monte a agenda, acompanhe inscrições e lotação.</p>
        </div>
        <button className={`btn btn-primary ${styles.newBtn}`} onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Fechar' : '+ Novo evento'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className={styles.form}>
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
          <div className={`form-group ${styles.full}`}>
            <label>Título</label>
            <input required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
          </div>
          <div className={`form-group ${styles.full}`}>
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
          <label className={styles.checkRow}>
            <input type="checkbox" checked={form.online} onChange={(e) => setForm({ ...form, online: e.target.checked })} />
            Evento online
          </label>
          <div className={styles.full}>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFoto} aria-label="Imagem do evento" />
            <button type="button" className={`btn btn-outline ${styles.uploadBtn}`} onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? 'Enviando...' : (form.imagemUrl ? '↻ Trocar imagem' : '↑ Adicionar imagem')}
            </button>
            {form.imagemUrl && <img src={form.imagemUrl} alt="Prévia do evento" className={styles.preview} />}
          </div>
          <button className={`btn btn-primary ${styles.submit}`} disabled={saving}>
            {saving ? 'Salvando...' : 'Criar evento'}
          </button>
        </form>
      )}

      {loading ? (
        <p className={styles.loading}>Carregando...</p>
      ) : eventos.length === 0 ? (
        <p className={styles.empty}>Nenhum evento ainda. Crie a primeira oficina.</p>
      ) : (
        <div className={styles.list}>
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
  return (
    <div className={styles.row}>
      <div className={styles.rowTop}>
        <div className={styles.rowInfo}>
          <div className={styles.rowTitle}>{e.titulo}</div>
          <div className={styles.rowMeta}>{fmtData(e.dataHora)} · {fmtPreco(e.preco)}</div>
        </div>
        <div className={styles.rowCount}>
          <div className={styles.count}>{e.confirmadas}/{e.vagas}</div>
          <div className={styles.pct}>{e.lotacaoPct}% lotado</div>
        </div>
        <span className={`${styles.badge} ${styles[`st_${e.status}`] || styles.st_rascunho}`}>{STATUS[e.status] || 'Rascunho'}</span>
        <div className={styles.rowActions}>
          <button onClick={onToggle} className={`${styles.smallBtn} ${styles.smallNeutral}`}>{expanded ? 'Fechar' : 'Inscritos'}</button>
          {e.status === 'rascunho' && <button onClick={onPublish} className={`${styles.smallBtn} ${styles.smallSuccess}`}>Publicar</button>}
          <button onClick={onDelete} className={`${styles.smallBtn} ${styles.smallDanger}`}>Excluir</button>
        </div>
      </div>
      {expanded && <Inscritos eventoId={e.id} titulo={e.titulo} />}
    </div>
  )
}

function Inscritos({ eventoId, titulo }) {
  const [data, setData] = useState(null)
  const [novo, setNovo] = useState({ nome: '', whatsapp: '', email: '' })
  const [adding, setAdding] = useState(false)
  const [err, setErr] = useState('')

  function load() { eventosService.listInscricoes(eventoId).then(setData).catch(() => setData({ inscricoes: [] })) }
  useEffect(() => { load() }, [eventoId])

  async function handleAdd(ev) {
    ev.preventDefault()
    setErr('')
    if (novo.nome.trim().length < 2) { setErr('Informe o nome.'); return }
    if (novo.email && !isEmail(novo.email)) { setErr('Email inválido.'); return }
    if (novo.whatsapp && onlyDigits(novo.whatsapp).length < 10) { setErr('WhatsApp inválido (com DDD).'); return }
    setAdding(true)
    try {
      await eventosService.addManual(eventoId, {
        nome: novo.nome,
        whatsapp: novo.whatsapp || undefined,
        email: novo.email || undefined,
      })
      setNovo({ nome: '', whatsapp: '', email: '' }); load()
    } catch (e) {
      setErr(e.response?.data?.error || 'Erro ao inscrever (talvez esteja lotado).')
    } finally { setAdding(false) }
  }

  if (!data) return <p className={styles.loading}>Carregando inscritos...</p>

  const confirmadas = data.inscricoes.filter((i) => i.status === 'confirmada')
  return (
    <div className={styles.inscritos}>
      <form onSubmit={handleAdd} className={styles.manualForm}>
        <input className={styles.inputInline} placeholder="Nome (inscrição manual)" value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })} />
        <input className={styles.inputInline} placeholder="WhatsApp (opcional)" value={novo.whatsapp} onChange={(e) => setNovo({ ...novo, whatsapp: e.target.value })} />
        <input className={styles.inputInline} placeholder="Email (opcional)" value={novo.email} onChange={(e) => setNovo({ ...novo, email: e.target.value })} />
        <button className={`btn btn-outline ${styles.manualBtn}`} disabled={adding}>{adding ? '...' : '+ Inscrever'}</button>
        {err && <p className={styles.manualErr}>{err}</p>}
      </form>

      <div className={styles.inscritosHead}>
        <span className={styles.inscritosCount}>{confirmadas.length} confirmada(s)</span>
        {data.inscricoes.length > 0 && (
          <button type="button" className={styles.csvBtn} onClick={() => downloadCSV(titulo, data.inscricoes)}>↓ Baixar CSV</button>
        )}
      </div>

      {confirmadas.length === 0 ? (
        <p className={styles.empty}>Nenhuma inscrição confirmada ainda.</p>
      ) : (
        <ol className={styles.inscritosList}>
          {confirmadas.map((i) => (
            <li key={i.id}>
              {i.nome} {i.whatsapp ? `· ${i.whatsapp}` : ''}
              {i.origem === 'manual' && <span className={styles.manualTag}> (manual)</span>}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
