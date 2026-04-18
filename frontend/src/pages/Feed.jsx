import { useState, useEffect } from 'react'
import { feedService } from '../services/feed.service'
import styles from './Feed.module.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function Feed() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    feedService.list()
      .then(setPosts)
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <div className="container">
          <p className={styles.eyebrow}>Novidades</p>
          <h1 className={styles.title}>Feed MUSA</h1>
          <p className={styles.subtitle}>Acompanhe as novidades, lançamentos e histórias da plataforma</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className={styles.loading}>Carregando...</div>
          ) : posts.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>✦</div>
              <h2 className={styles.emptyTitle}>Em breve</h2>
              <p className={styles.emptyText}>
                O feed da MUSA está sendo preparado com muito carinho.<br />
                Em breve você verá aqui as novidades e histórias da plataforma.
              </p>
              <a href="https://instagram.com/musacasa" target="_blank" rel="noreferrer" className="btn btn-outline">
                ◎ Siga-nos no Instagram
              </a>
            </div>
          ) : (
            <div className={styles.grid}>
              {posts.map((post) => (
                <article key={post.id} className={styles.card}>
                  {post.imagemUrl && (
                    <div className={styles.cardImageWrap}>
                      <img src={post.imagemUrl} alt={post.titulo} className={styles.cardImage} />
                    </div>
                  )}
                  <div className={styles.cardBody}>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardAutor}>MUSA</span>
                      <span className={styles.cardDot}>·</span>
                      <span className={styles.cardDate}>{formatDate(post.createdAt)}</span>
                    </div>
                    <h2 className={styles.cardTitle}>{post.titulo}</h2>
                    {post.conteudo && (
                      <p className={styles.cardContent}>{post.conteudo}</p>
                    )}
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
