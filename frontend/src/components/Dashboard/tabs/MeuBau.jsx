import { useState, useEffect, useRef } from 'react'
import { bauService } from '../../../services/bau.service'
import styles from './MeuBau.module.css'

const fmtPreco = (c) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const STATUS = {
  pendente: { l: 'Em análise', cls: styles.stPendente },
  aprovado: { l: 'Publicado', cls: styles.stAprovado },
  vendido: { l: 'Vendido', cls: styles.stVendido },
  recusado: { l: 'Recusado', cls: styles.stRecusado },
}
const EMPTY = { titulo: '', descricao: '', tipo: 'venda', precoReais: '', categoria: '', whatsapp: '', fotos: [] }

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
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Meu Baú</h2>
          <p className={styles.subtitle}>Anuncie peças e objetos para vender ou trocar</p>
        </div>
        <button className={`btn btn-primary ${styles.addBtn}`} onClick={() => setShowForm((v) => !v)}>{showForm ? 'Fechar' : '+ Anunciar'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className={styles.form}>
          <div className={`form-group ${styles.full}`}><label>Título</label><input required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></div>
          <div className={`form-group ${styles.full}`}><label>Descrição</label><textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} /></div>
          <div className="form-group"><label>Tipo</label><select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}><option value="venda">Venda</option><option value="troca">Troca</option></select></div>
          <div className="form-group"><label>Preço (R$){form.tipo === 'troca' ? ' — opcional' : ''}</label><input type="number" min="0" step="0.01" value={form.precoReais} disabled={form.tipo === 'troca'} onChange={(e) => setForm({ ...form, precoReais: e.target.value })} /></div>
          <div className="form-group"><label>Categoria</label><input value={form.categoria} placeholder="Ex: Moda, Casa, Beleza" onChange={(e) => setForm({ ...form, categoria: e.target.value })} /></div>
          <div className="form-group"><label>WhatsApp (contato)</label><input required placeholder="11999998888" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} /></div>
          <div className={styles.full}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFoto} aria-label="Adicionar foto do anúncio" />
            <button type="button" className={styles.uploadBtn} onClick={() => fileRef.current?.click()} disabled={uploading || form.fotos.length >= 6}>
              {uploading ? 'Enviando...' : '↑ Adicionar foto'}
            </button>
            <div className={styles.thumbs}>
              {form.fotos.map((u, i) => (<img key={i} src={u} alt="" className={styles.thumb} />))}
            </div>
          </div>
          <button className={`btn btn-primary ${styles.submitBtn}`} disabled={saving}>{saving ? 'Enviando...' : 'Publicar (passa por moderação)'}</button>
        </form>
      )}

      {loading ? (
        <p className={styles.muted}>Carregando...</p>
      ) : itens.length === 0 ? (
        <p className={styles.empty}>Você ainda não anunciou nada. Que tal começar? ✦</p>
      ) : (
        <div className={styles.list}>
          {itens.map((it) => {
            const st = STATUS[it.status] || STATUS.pendente
            return (
              <div key={it.id} className={styles.itemCard}>
                <div className={styles.itemPhoto} style={it.fotos?.[0] ? { backgroundImage: `url(${it.fotos[0]})` } : undefined} />
                <div className={styles.itemMain}>
                  <div className={styles.itemTitle}>{it.titulo}</div>
                  <div className={styles.itemMeta}>{it.tipo === 'troca' ? 'Troca' : (it.preco != null ? fmtPreco(it.preco) : 'A combinar')}{it.categoria ? ` · ${it.categoria}` : ''}</div>
                </div>
                <span className={`${styles.badge} ${st.cls}`}>{st.l}</span>
                <div className={styles.actions}>
                  {it.status !== 'vendido' && <button onClick={() => handleVendido(it.id)} className={`${styles.actionBtn} ${styles.actionNeutral}`}>Vendido</button>}
                  <button onClick={() => handleDelete(it.id)} className={`${styles.actionBtn} ${styles.actionDanger}`}>Excluir</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
