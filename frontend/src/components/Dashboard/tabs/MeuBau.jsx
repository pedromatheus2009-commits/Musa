import { useState, useEffect, useRef } from 'react'
import { bauService } from '../../../services/bau.service'

const fmtPreco = (c) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const STATUS = {
  pendente: { l: 'Em análise', c: '#e0c07d' },
  aprovado: { l: 'Publicado', c: '#7de0a0' },
  vendido: { l: 'Vendido', c: '#9a948c' },
  recusado: { l: 'Recusado', c: '#e07070' },
}
const EMPTY = { titulo: '', descricao: '', tipo: 'venda', precoReais: '', categoria: '', whatsapp: '', fotos: [] }
const box = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,130,0.12)', borderRadius: 'var(--radius-sm)' }
const btnSmall = (c) => ({ fontSize: '0.74rem', padding: '4px 10px', background: `${c}22`, color: c, border: `1px solid ${c}55`, borderRadius: 4 })

export default function MeuBau() {
  const [itens, setItens] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  function load() { setLoading(true); bauService.meus().then(setItens).catch(() => setItens([])).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  async function handleFoto(e) {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try { const { url } = await bauService.uploadFoto(file); setForm((f) => ({ ...f, fotos: [...f.fotos, url] })) }
    catch { alert('Falha no upload da foto') } finally { setUploading(false) }
  }

  async function handleCreate(e) {
    e.preventDefault(); setSaving(true)
    try {
      await bauService.criar({
        titulo: form.titulo,
        descricao: form.descricao || undefined,
        tipo: form.tipo,
        preco: form.tipo === 'venda' && form.precoReais ? Math.round(parseFloat(form.precoReais) * 100) : null,
        categoria: form.categoria || undefined,
        whatsapp: form.whatsapp,
        fotos: form.fotos,
      })
      setForm(EMPTY); setShowForm(false); load()
    } catch (err) { alert(err.response?.data?.error || 'Erro ao publicar anúncio') } finally { setSaving(false) }
  }

  async function handleDelete(id) { if (!window.confirm('Excluir este anúncio?')) return; try { await bauService.remover(id); load() } catch { alert('Erro ao excluir') } }
  async function handleVendido(id) { try { await bauService.marcarVendido(id); load() } catch { alert('Erro') } }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--white)', marginBottom: 4 }}>Meu Baú</h2>
          <p style={{ color: 'var(--white-muted)', fontSize: '0.88rem' }}>Anuncie peças e objetos para vender ou trocar</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.74rem' }} onClick={() => setShowForm((v) => !v)}>{showForm ? 'Fechar' : '+ Anunciar'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ ...box, padding: 18, marginBottom: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Título</label><input required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Descrição</label><textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} /></div>
          <div className="form-group"><label>Tipo</label><select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}><option value="venda">Venda</option><option value="troca">Troca</option></select></div>
          <div className="form-group"><label>Preço (R$){form.tipo === 'troca' ? ' — opcional' : ''}</label><input type="number" min="0" step="0.01" value={form.precoReais} disabled={form.tipo === 'troca'} onChange={(e) => setForm({ ...form, precoReais: e.target.value })} /></div>
          <div className="form-group"><label>Categoria</label><input value={form.categoria} placeholder="Ex: Moda, Casa, Beleza" onChange={(e) => setForm({ ...form, categoria: e.target.value })} /></div>
          <div className="form-group"><label>WhatsApp (contato)</label><input required placeholder="11999998888" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} /></div>
          <div style={{ gridColumn: '1 / -1' }}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFoto} aria-label="Adicionar foto do anúncio" />
            <button type="button" className="btn btn-secondary" style={{ fontSize: '0.74rem', padding: '6px 14px' }} onClick={() => fileRef.current?.click()} disabled={uploading || form.fotos.length >= 6}>
              {uploading ? 'Enviando...' : '↑ Adicionar foto'}
            </button>
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              {form.fotos.map((u, i) => (<img key={i} src={u} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(201,168,130,0.2)' }} />))}
            </div>
          </div>
          <button className="btn btn-primary" disabled={saving} style={{ gridColumn: '1 / -1', justifyContent: 'center' }}>{saving ? 'Enviando...' : 'Publicar (passa por moderação)'}</button>
        </form>
      )}

      {loading ? (
        <p style={{ color: 'var(--gray-light)' }}>Carregando...</p>
      ) : itens.length === 0 ? (
        <p style={{ color: 'var(--gray-light)', fontStyle: 'italic' }}>Você ainda não anunciou nada. Que tal começar? ✦</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {itens.map((it) => {
            const st = STATUS[it.status] || STATUS.pendente
            return (
              <div key={it.id} style={{ ...box, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                <div style={{ width: 52, height: 52, borderRadius: 6, flexShrink: 0, background: 'var(--black-soft)', backgroundImage: it.fotos?.[0] ? `url(${it.fotos[0]})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ flex: 1, minWidth: 150 }}>
                  <div style={{ color: 'var(--white)', fontWeight: 600, fontSize: '0.92rem' }}>{it.titulo}</div>
                  <div style={{ color: 'var(--white-muted)', fontSize: '0.78rem' }}>{it.tipo === 'troca' ? 'Troca' : (it.preco != null ? fmtPreco(it.preco) : 'A combinar')}{it.categoria ? ` · ${it.categoria}` : ''}</div>
                </div>
                <span style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: 4, fontWeight: 600, background: `${st.c}22`, color: st.c }}>{st.l}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {it.status !== 'vendido' && <button onClick={() => handleVendido(it.id)} style={btnSmall('#9aa0a6')}>Vendido</button>}
                  <button onClick={() => handleDelete(it.id)} style={btnSmall('#e07070')}>Excluir</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
