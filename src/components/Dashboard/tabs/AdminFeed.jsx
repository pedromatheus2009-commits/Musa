import { useState, useRef, useEffect } from 'react'
import { feedService } from '../../../services/feed.service'
import styles from './AdminFeed.module.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function AdminFeed() {
  const fileRef = useRef()
  const videoRef = useRef()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({ titulo: '', conteudo: '', imagemUrl: '', videoUrl: '', publicado: true })
  const [imgUploading, setImgUploading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  useEffect(() => {
    feedService.listAll()
      .then(setPosts)
      .finally(() => setLoading(false))
  }, [])

  function setField(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setCreateError('')
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImgUploading(true)
    try {
      const { url } = await feedService.uploadImage(file)
      setField('imagemUrl', url)
    } catch {
      setCreateError('Falha ao fazer upload da imagem')
    } finally {
      setImgUploading(false)
    }
  }

  async function handleVideoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImgUploading(true)
    try {
      const { url } = await feedService.uploadVideo(file)
      setField('videoUrl', url)
    } catch {
      setCreateError('Falha ao fazer upload do vídeo')
    } finally {
      setImgUploading(false)
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.titulo.trim()) { setCreateError('Título obrigatório'); return }
    setCreating(true)
    setCreateError('')
    try {
      const post = await feedService.create({
        titulo: form.titulo,
        conteudo: form.conteudo || undefined,
        imagemUrl: form.imagemUrl || undefined,
        videoUrl: form.videoUrl || undefined,
        publicado: form.publicado,
      })
      setPosts((p) => [post, ...p])
      setForm({ titulo: '', conteudo: '', imagemUrl: '', videoUrl: '', publicado: true })
    } catch (err) {
      setCreateError(err.response?.data?.error || 'Erro ao publicar')
    } finally {
      setCreating(false)
    }
  }

  async function togglePublish(post) {
    try {
      const updated = await feedService.update(post.id, { publicado: !post.publicado })
      setPosts((p) => p.map((x) => x.id === post.id ? updated : x))
    } catch {
      alert('Erro ao alterar status')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Excluir esta publicação do feed?')) return
    try {
      await feedService.remove(id)
      setPosts((p) => p.filter((x) => x.id !== id))
    } catch {
      alert('Erro ao excluir')
    }
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>Feed MUSA</h2>
      <p className={styles.pageSubtitle}>Gerencie as publicações visíveis no feed público da plataforma</p>

      {/* Create */}
      <div className={styles.createCard}>
        <h3>Nova publicação</h3>
        <form className={styles.createForm} onSubmit={handleCreate}>
          <div className="form-group">
            <label>Título *</label>
            <input value={form.titulo} onChange={(e) => setField('titulo', e.target.value)} placeholder="Título da publicação..." />
          </div>
          <div className="form-group">
            <label>Texto</label>
            <textarea rows={4} value={form.conteudo} onChange={(e) => setField('conteudo', e.target.value)} placeholder="Conte a novidade, o lançamento, a história..." />
          </div>

          {form.imagemUrl && (
            <div className={styles.imagePreview}>
              <img src={form.imagemUrl} alt="Prévia" />
              <button type="button" className={styles.removeImg} onClick={() => setField('imagemUrl', '')}>✕</button>
            </div>
          )}

          {form.videoUrl && (
            <div className={styles.imagePreview}>
              <video src={form.videoUrl} controls style={{ width: '100%', maxHeight: 200 }} />
              <button type="button" className={styles.removeImg} onClick={() => setField('videoUrl', '')}>✕</button>
            </div>
          )}

          <label className={styles.publishRow}>
            <input type="checkbox" checked={form.publicado} onChange={(e) => setField('publicado', e.target.checked)} />
            Publicar imediatamente (desmarque para salvar como rascunho)
          </label>

          <div className={styles.formActions}>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleImageUpload} />
            <button type="button" className={styles.uploadBtn} onClick={() => fileRef.current?.click()} disabled={imgUploading}>
              {imgUploading ? 'Enviando...' : '🖼 Adicionar imagem'}
            </button>
            <input ref={videoRef} type="file" accept="video/mp4,video/webm,video/quicktime" style={{ display: 'none' }} onChange={handleVideoUpload} />
            <button type="button" className={styles.uploadBtn} onClick={() => videoRef.current?.click()} disabled={imgUploading}>
              {imgUploading ? 'Enviando...' : '🎬 Adicionar vídeo'}
            </button>
            <button type="submit" className="btn btn-primary" disabled={creating} style={{ padding: '10px 24px' }}>
              {creating ? 'Publicando...' : form.publicado ? 'Publicar' : 'Salvar rascunho'}
            </button>
            {createError && <span className={styles.errorMsg}>{createError}</span>}
          </div>
        </form>
      </div>

      {/* List */}
      <div className={styles.listHeader}>
        <h3>Publicações</h3>
        {posts.length > 0 && <span className={styles.postCount}>{posts.length} no total</span>}
      </div>

      {loading ? (
        <div className={styles.empty}>Carregando...</div>
      ) : posts.length === 0 ? (
        <div className={styles.empty}>Nenhuma publicação ainda.</div>
      ) : (
        <div className={styles.list}>
          {posts.map((post) => (
            <div key={post.id} className={styles.postCard}>
              {post.imagemUrl && <img src={post.imagemUrl} alt={post.titulo} className={styles.postCardImg} />}
              {post.videoUrl && (
                <video src={post.videoUrl} controls className={styles.postCardImg} style={{ width: '100%' }} />
              )}
              <div className={styles.postCardBody}>
                <div className={styles.postCardText}>
                  <div className={styles.postCardTitle}>{post.titulo}</div>
                  {post.conteudo && <div className={styles.postCardPreview}>{post.conteudo}</div>}
                  <div className={styles.postCardMeta}>
                    <span>{formatDate(post.createdAt)}</span>
                    <span className={post.publicado ? styles.published : styles.draft}>
                      {post.publicado ? 'Publicado' : 'Rascunho'}
                    </span>
                  </div>
                </div>
                <div className={styles.postCardActions}>
                  <button className={styles.iconBtn} onClick={() => togglePublish(post)} title={post.publicado ? 'Despublicar' : 'Publicar'}>
                    {post.publicado ? '👁' : '👁‍🗨'}
                  </button>
                  <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => handleDelete(post.id)} title="Excluir">🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
