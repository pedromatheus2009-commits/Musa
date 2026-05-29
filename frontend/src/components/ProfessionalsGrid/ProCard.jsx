import Avatar from '../brand/Avatar'
import styles from './ProfessionalsGrid.module.css'

export default function ProCard({ profile, onClick, index = 0, className = '' }) {
  return (
    <button type="button" className={`${styles.card} ${className}`} onClick={onClick} aria-label={`Ver perfil de ${profile.nome}`}>
      <div className={styles.cardTop}>
        <Avatar name={profile.nome} src={profile.fotoUrl} index={index} size={58} />
        <div className={styles.cardInfo}>
          <div className={styles.cardName}>{profile.nome}</div>
          <div className={styles.cardRole}>{profile.role}</div>
          {profile.cidade && <div className={styles.cardCity}>{profile.cidade}</div>}
        </div>
      </div>
      <div className={styles.cardBody}>
        {profile.preco && <div className={styles.cardPrice}>{profile.preco}</div>}
        <div className={styles.serviceTags}>
          {profile.services?.slice(0, 2).map((s) => (
            <span key={s.id} className="tag tag-wine">{s.nome}</span>
          ))}
        </div>
      </div>
      <div className={styles.cardFooter}>
        <span className={styles.viewBtn}>
          Ver perfil <span className={styles.viewArrow}>→</span>
        </span>
      </div>
    </button>
  )
}
