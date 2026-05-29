import { useState, useEffect } from 'react'
import { feedService } from '../services/feed.service'
import { useReveal } from '../hooks/useReveal'
import StripeBackground from '../components/brand/StripeBackground'
import SectionLabel from '../components/brand/SectionLabel'
import Selo from '../components/brand/Selo'
import styles from './Feed.module.css'

function formatDate(iso) {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function Feed() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const gridRef = useReveal()

  useEffect(() => {
    feedService.list()
      .then((data) => { setPosts(data); setError('') })
      .catch(() => setError('Não foi possível carregar o feed. Tente novamente em instantes.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <StripeBackground density="narrow" opacity={0.1} />
        <div className={`container ${styles.headerInner}`}>
          <SectionLabel align="center">Casa Musa · Novidades</SectionLabel>
          <h1 className={styles.title}>Feed da Casa</h1>
          <p className={styles.subtitle}>Acompanhe oficinas, histórias e novidades da Casa Musa.</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className={styles.loading}>Carregando...</div>
          ) : error ? (
            <div className={styles.empty}>
              <Selo kind="star" size={34} />
              <h2 className={styles.emptyTitle}>Ops!</h2>
              <p className={styles.emptyText}>{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className={styles.empty}>
              <Selo kind="heart" size={40} />
              <h2 className={styles.emptyTitle}>Em breve</h2>
              <p className={styles.emptyText}>
                O feed da Casa Musa está sendo preparado com carinho.<br />
                Em breve você verá aqui as novidades e histórias da casa.
              </p>
              <a href="https://instagram.com/musacasa" target="_blank" rel="noreferrer noopener" className="btn btn-outline">
                Siga-nos no Instagram
              </a>
            </div>
          ) : (
            <div className={styles.grid} ref={gridRef}>
              {posts.map((post) => (
                <article key={post.id} className={`${styles.card} reveal`}>
                  {post.imagemUrl && (
                    <div className={styles.cardImageWrap}>
                      <img src={post.imagemUrl} alt={post.titulo || 'Publicação'} className={styles.cardImage} loading="lazy" />
                    </div>
                  )}
                  <div className={styles.cardBody}>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardAutor}>Casa Musa</span>
                      <span className={styles.cardDot}>·</span>
                      <span className={styles.cardDate}>{formatDate(post.createdAt)}</span>
                    </div>
                    <h2 className={styles.cardTitle}>{post.titulo}</h2>
                    {post.conteudo && <p className={styles.cardContent}>{post.conteudo}</p>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
