import { useState, useRef, useEffect } from 'react'
import { postsService } from '../../../services/posts.service'
import styles from './MyPosts.module.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function MyPosts({ profile }) {
  const fileRef = useRef()
  const videoRef = useRef()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({ titulo: '', conteudo: '', imagemUrl: '', videoUrl: '' })
  const [imageUploading, setImageUploading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  useEffect(() => {
    if (!profile) return
    postsService.listByProfile(profile.id)
      .then(setPosts)
      .finally(() => setLoading(false))
  }, [profile])

  function setField(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setCreateError('')
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageUploading(true)
    try {
      const { url } = await postsService.uploadImage(file)
      setField('imagemUrl', url)
    } catch {
      setCreateError('Falha ao fazer upload da imagem')
    } finally {
      setImageUploading(false)
    }
  }

  async function handleVideoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageUploading(true)
    try {
      const { url } = await postsService.uploadVideo(file)
      setField('videoUrl', url)
    } catch {
      setCreateError('Falha ao fazer upload do vídeo')
    } finally {
      setImageUploading(false)
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.titulo && !form.conteudo && !form.imagemUrl && !form.videoUrl) {
      setCreateError('Adicione um título, texto ou imagem para publicar')
      return
    }
    setCreating(true)
    setCreateError('')
    try {
      const post = await postsService.create({
        titulo: form.titulo || undefined,
        conteudo: form.conteudo || undefined,
        imagemUrl: form.imagemUrl || undefined,
        videoUrl: form.videoUrl || undefined,
      })
      setPosts((p) => [post, ...p])
      setForm({ titulo: '', conteudo: '', imagemUrl: '', videoUrl: '' })
    } catch (err) {
      setCreateError(err.response?.data?.error || 'Erro ao publicar')
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Excluir esta publicação?')) return
    try {
      await postsService.remove(id)
      setPosts((p) => p.filter((x) => x.id !== id))
    } catch {
      alert('Erro ao excluir publicação')
    }
  }

  if (!profile) {
    return (
      <div className={styles.page}>
        <h2 className={styles.pageTitle}>Publicações</h2>
        <div className={styles.empty}>
          <span>📝</span>
          Crie seu perfil primeiro para começar a publicar.
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>Publicações</h2>
      <p className={styles.pageSubtitle}>Compartilhe seu trabalho, novidades e conteúdo com seus clientes</p>

      {/* Create post */}
      <div className={styles.createCard}>
        <h3>Nova publicação</h3>
        <form className={styles.createForm} onSubmit={handleCreate}>
          <div className="form-group">
            <label>Título</label>
            <input
              value={form.titulo}
              onChange={(e) => setField('titulo', e.target.value)}
              placeholder="Dê um título para sua publicação..."
            />
          </div>

          <div className="form-group">
            <label>Texto</label>
            <textarea
              rows={4}
              value={form.conteudo}
              onChange={(e) => setField('conteudo', e.target.value)}
              placeholder="Conte algo sobre seu trabalho, compartilhe uma novidade..."
            />
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

          <div className={styles.createActions}>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleImageUpload} />
            <button type="button" className={styles.uploadImageBtn} onClick={() => fileRef.current?.click()} disabled={imageUploading}>
              {imageUploading ? 'Enviando...' : '🖼 Adicionar imagem'}
            </button>
            <input ref={videoRef} type="file" accept="video/mp4,video/webm,video/quicktime" style={{ display: 'none' }} onChange={handleVideoUpload} />
            <button type="button" className={styles.uploadImageBtn} onClick={() => videoRef.current?.click()} disabled={imageUploading}>
              {imageUploading ? 'Enviando...' : '🎬 Adicionar vídeo'}
            </button>
            <button type="submit" className="btn btn-primary" disabled={creating} style={{ padding: '10px 24px' }}>
              {creating ? 'Publicando...' : 'Publicar'}
            </button>
            {createError && <span className={styles.createError}>{createError}</span>}
          </div>
        </form>
      </div>

      {/* Posts list */}
      <div className={styles.postsHeader}>
        <h3>Suas publicações</h3>
        {posts.length > 0 && <span className={styles.postCount}>{posts.length} {posts.length === 1 ? 'publicação' : 'publicações'}</span>}
      </div>

      {loading ? (
        <div className={styles.loading}>Carregando publicações...</div>
      ) : posts.length === 0 ? (
        <div className={styles.empty}>
          <span>✨</span>
          Nenhuma publicação ainda. Crie sua primeira acima!
        </div>
      ) : (
        <div className={styles.postsList}>
          {posts.map((post) => (
            <div key={post.id} className={styles.postCard}>
              {post.imagemUrl && (
                <img src={post.imagemUrl} alt={post.titulo || 'Imagem'} className={styles.postCardImage} />
              )}
              {post.videoUrl && (
                <video src={post.videoUrl} controls className={styles.postCardImage} style={{ width: '100%' }} />
              )}
              <div className={styles.postCardBody}>
                <div className={styles.postCardText}>
                  {post.titulo && <div className={styles.postCardTitle}>{post.titulo}</div>}
                  {post.conteudo && <div className={styles.postCardContent}>{post.conteudo}</div>}
                  <div className={styles.postCardDate}>{formatDate(post.createdAt)}</div>
                </div>
                <div className={styles.postCardActions}>
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
