import { useState } from 'react'
import { useProfessionals } from '../../hooks/useProfessionals'
import { useReveal } from '../../hooks/useReveal'
import FilterBar from './FilterBar'
import ProCard from './ProCard'
import Selo from '../brand/Selo'
import styles from './ProfessionalsGrid.module.css'

function SkeletonCard() {
  return (
    <div className={`${styles.card} ${styles.skeleton}`}>
      <div className={styles.cardTop}>
        <div className={styles.skeletonAvatar} />
        <div className={styles.skeletonInfo}>
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
  const gridRef = useReveal()

  return (
    <section className={`section ${styles.section}`} id="profissionais">
      <div className="container">
        <FilterBar onSearch={setFilters} />

        <div className={styles.grid} ref={gridRef}>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : isError ? (
            <div className={styles.empty}>
              <Selo kind="star" size={32} />
              <h3 className={styles.emptyTitle}>Não foi possível carregar</h3>
              <p>Tente novamente em instantes.</p>
            </div>
          ) : professionals.length === 0 ? (
            <div className={styles.empty}>
              <Selo kind="crest" size={32} />
              <h3 className={styles.emptyTitle}>Nenhuma profissional encontrada</h3>
              <p>Tente outros filtros ou termos de busca.</p>
            </div>
          ) : (
            professionals.map((p, i) => (
              <ProCard key={p.id} profile={p} index={i} className="reveal" onClick={() => onProfileClick(p)} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
