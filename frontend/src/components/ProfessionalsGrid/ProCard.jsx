import styles from './ProfessionalsGrid.module.css'

const AVATAR_COLORS = [
  'linear-gradient(135deg,#8b2c4a,#6b1f37)',
  'linear-gradient(135deg,#a8845f,#7a5c3f)',
  'linear-gradient(135deg,#6b1f37,#3d0f20)',
  'linear-gradient(135deg,#c9a882,#a8845f)',
  'linear-gradient(135deg,#5a2035,#8b2c4a)',
]

export default function ProCard({ profile, onClick, index = 0 }) {
  const initials = profile.nome?.split(' ').slice(0, 2).map((w) => w[0]).join('')

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.cardTop}>
        <div className={styles.avatar} style={{ background: AVATAR_COLORS[index % AVATAR_COLORS.length] }}>
          {profile.fotoUrl
            ? <img src={profile.fotoUrl} alt={profile.nome} className={styles.avatarImg} />
            : initials}
        </div>
        <div className={styles.cardInfo}>
          <div className={styles.cardName}>{profile.nome}</div>
          <div className={styles.cardRole}>{profile.role}</div>
          {profile.cidade && <div className={styles.cardCity}>📍 {profile.cidade}</div>}
        </div>
      </div>
      <div className={styles.cardBody}>
        {profile.preco && <div className={styles.cardPrice}>{profile.preco}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {profile.services?.slice(0, 2).map((s) => (
            <span key={s.id} className="tag tag-wine">{s.nome}</span>
          ))}
        </div>
      </div>
      <div className={styles.cardFooter}>
        <span className={styles.viewBtn}>
          Ver Perfil <span className={styles.viewArrow}>→</span>
        </span>
      </div>
    </div>
  )
}
