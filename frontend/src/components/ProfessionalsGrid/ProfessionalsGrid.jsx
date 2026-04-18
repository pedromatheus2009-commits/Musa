import { useState } from 'react'
import { useProfessionals } from '../../hooks/useProfessionals'
import FilterBar from './FilterBar'
import ProCard from './ProCard'
import styles from './ProfessionalsGrid.module.css'

function SkeletonCard() {
  return (
    <div className={`${styles.card} ${styles.skeleton}`} style={{ cursor: 'default' }}>
      <div className={styles.cardTop}>
        <div className={styles.skeletonAvatar} />
        <div style={{ flex: 1 }}>
          <div className={styles.skeletonLine} />
          <div className={`${styles.skeletonLine} ${styles.short}`} />
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.skeletonLine} />
        <div className={`${styles.skeletonLine} ${styles.short}`} />
      </div>
    </div>
  )
}

export default function ProfessionalsGrid({ onProfileClick }) {
  const [filters, setFilters] = useState({})
  const { data, isLoading, isError } = useProfessionals(filters)

  const professionals = data?.data ?? []

  return (
    <section className="section" id="profissionais">
      <div className="container">
        <div className={styles.header}>
          <p className={styles.eyebrow}>Nossa vitrine</p>
          <h2 className={styles.title}>Profissionais em Destaque</h2>
          <p className={styles.subtitle}>Encontre a especialista ideal para o seu projeto ou necessidade</p>
        </div>

        <FilterBar onSearch={setFilters} />

        <div className={styles.grid}>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : professionals.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>◈</div>
              <h3 className={styles.emptyTitle}>Nenhuma profissional encontrada</h3>
              <p>Tente outros filtros ou termos de busca.</p>
            </div>
          ) : (
            professionals.map((p, i) => (
              <ProCard key={p.id} profile={p} index={i} onClick={() => onProfileClick(p)} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
