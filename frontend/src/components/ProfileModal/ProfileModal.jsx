import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useProfessional } from '../../hooks/useProfessionals'
import { reviewsService } from '../../services/reviews.service'
import Avatar from '../brand/Avatar'
import styles from './ProfileModal.module.css'

function StarRating({ value, onChange }) {
  function onKey(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); onChange(Math.min(5, value + 1)) }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); onChange(Math.max(1, value - 1)) }
  }
  return (
    <div className={styles.stars} role="radiogroup" aria-label="Nota" onKeyDown={onKey}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={n === value}
          aria-label={`${n} ${n > 1 ? 'estrelas' : 'estrela'}`}
          tabIndex={n === value ? 0 : -1}
          className={`${styles.star} ${n <= value ? styles.starActive : ''}`}
          onClick={() => onChange(n)}
        >★</button>
      ))}
    </div>
  )
}

export default function ProfileModal({ profile: fallback, profileId, isOpen, onClose }) {
  const { data: fetched, isLoading } = useProfessional(profileId)
  const profile = fetched || fallback
  const [tab, setTab] = useState('perfil')

  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewForm, setReviewForm] = useState({ autorNome: '', nota: 5, comentario: '' })
  const [submitting, setSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [reviewSuccess, setReviewSuccess] = useState(false)

  useEffect(() => {
    if (!profileId || !isOpen) return
    setTab('perfil')
    setReviewSuccess(false)
    setReviewError('')
  }, [profileId, isOpen])

  useEffect(() => {
    if (tab !== 'avaliacoes' || !profileId) return
    setReviewsLoading(true)
    reviewsService.list(profileId)
      .then(setReviews)
      .finally(() => setReviewsLoading(false))
  }, [tab, profileId])

  // Fecha no ESC
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  async function handleReviewSubmit(e) {
    e.preventDefault()
    if (!reviewForm.autorNome.trim()) { setReviewError('Informe seu nome'); return }
    setSubmitting(true)
    setReviewError('')
    try {
      const review = await reviewsService.create(profileId, reviewForm)
      setReviews((r) => [review, ...r])
      setReviewForm({ autorNome: '', nota: 5, comentario: '' })
      setReviewSuccess(true)
    } catch {
      setReviewError('Erro ao enviar avaliação. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null
  const posts = fetched?.posts || []

  return createPortal(
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal-box ${styles.modalWide}`} role="dialog" aria-modal="true" aria-label={profile?.nome ? `Perfil de ${profile.nome}` : 'Perfil'}>
        <div className={styles.inner}>
          <button className={styles.close} onClick={onClose} aria-label="Fechar">✕</button>

          {isLoading && !fallback ? (
            <div className={styles.loading}>Carregando...</div>
          ) : (
            <div className={styles.box}>
              {/* Header */}
              <div className={styles.top}>
                <Avatar name={profile?.nome} src={profile?.fotoUrl} size={80} />
                <div className={styles.info}>
                  <div className={styles.name}>{profile?.nome}</div>
                  <div className={styles.role}>{profile?.role}</div>
                  <div className={styles.meta}>
                    {profile?.cidade && <span className={styles.metaItem}>{profile.cidade}</span>}
                    {fetched?._count?.reviews > 0 && (
                      <span className={styles.metaItem}>{fetched._count.reviews} avaliações</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className={styles.tabs} role="tablist">
                {['perfil', 'portfolio', 'avaliacoes'].map((t) => (
                  <button key={t} role="tab" aria-selected={tab === t} className={`${styles.tabBtn} ${tab === t ? styles.tabActive : ''}`}
                    onClick={() => setTab(t)}>
                    {t === 'perfil' ? 'Perfil' : t === 'portfolio' ? 'Portfólio' : 'Avaliações'}
                  </button>
                ))}
              </div>

              {/* Tab: Perfil */}
              {tab === 'perfil' && (
                <>
                  {profile?.bio && (
                    <>
                      <div className={styles.sectionTitle}>Sobre</div>
                      <p className={styles.bio}>{profile.bio}</p>
                    </>
                  )}
                  {profile?.services?.length > 0 && (
                    <>
                      <div className={styles.sectionTitle}>Serviços</div>
                      <div className={styles.services}>
                        {profile.services.map((s) => (
                          <span key={s.id} className="tag tag-nude">{s.nome}</span>
                        ))}
                      </div>
                    </>
                  )}
                  {profile?.preco && (
                    <div className={styles.preco}>{profile.preco}</div>
                  )}
                  {profile?.whatsapp && (
                    <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noreferrer noopener"
                      className={`btn btn-primary ${styles.waBtn}`}>
                      Entrar em contato via WhatsApp
                    </a>
                  )}
                </>
              )}

              {/* Tab: Portfólio */}
              {tab === 'portfolio' && (
                <div className={styles.portfolio}>
                  {posts.length === 0 ? (
                    <p className={styles.empty}>Nenhuma publicação ainda.</p>
                  ) : (
                    posts.map((post) => (
                      <div key={post.id} className={styles.postCard}>
                        {post.imagemUrl && (
                          <img src={post.imagemUrl} alt={post.titulo || 'Publicação'} className={styles.postImg} loading="lazy" />
                        )}
                        {post.videoUrl && (
                          <video src={post.videoUrl} controls className={styles.postVideo} />
                        )}
                        {post.titulo && <div className={styles.postTitle}>{post.titulo}</div>}
                        {post.conteudo && <p className={styles.postContent}>{post.conteudo}</p>}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab: Avaliações */}
              {tab === 'avaliacoes' && (
                <div className={styles.reviewsWrap}>
                  {!reviewSuccess ? (
                    <form className={styles.reviewForm} onSubmit={handleReviewSubmit}>
                      <div className={styles.sectionTitle}>Deixar avaliação</div>
                      <div className="form-group">
                        <label>Seu nome</label>
                        <input value={reviewForm.autorNome}
                          onChange={(e) => setReviewForm((f) => ({ ...f, autorNome: e.target.value }))}
                          placeholder="Como você se chama?" />
                      </div>
                      <div className="form-group">
                        <label>Nota</label>
                        <StarRating value={reviewForm.nota}
                          onChange={(n) => setReviewForm((f) => ({ ...f, nota: n }))} />
                      </div>
                      <div className="form-group">
                        <label>Comentário (opcional)</label>
                        <textarea rows={3} value={reviewForm.comentario}
                          onChange={(e) => setReviewForm((f) => ({ ...f, comentario: e.target.value }))}
                          placeholder="Conte sua experiência..." />
                      </div>
                      {reviewError && <p className={styles.reviewError}>{reviewError}</p>}
                      <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? 'Enviando...' : 'Enviar avaliação'}
                      </button>
                    </form>
                  ) : (
                    <p className={styles.reviewSuccess}>Avaliação enviada! Obrigada.</p>
                  )}

                  <div className={`${styles.sectionTitle} ${styles.sectionTitleSpaced}`}>
                    Avaliações ({reviews.length})
                  </div>
                  {reviewsLoading ? (
                    <p className={styles.empty}>Carregando...</p>
                  ) : reviews.length === 0 ? (
                    <p className={styles.empty}>Nenhuma avaliação ainda. Seja a primeira!</p>
                  ) : (
                    reviews.map((r) => (
                      <div key={r.id} className={styles.reviewCard}>
                        <div className={styles.reviewTop}>
                          <span className={styles.reviewAutor}>{r.autorNome}</span>
                          <span className={styles.reviewStars} aria-label={`Nota ${r.nota} de 5`}>{'★'.repeat(r.nota)}{'☆'.repeat(5 - r.nota)}</span>
                        </div>
                        {r.comentario && <p className={styles.reviewComment}>{r.comentario}</p>}
                        <span className={styles.reviewDate}>
                          {new Date(r.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
