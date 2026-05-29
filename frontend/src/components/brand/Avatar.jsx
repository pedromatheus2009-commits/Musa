import { getInitials } from '../../utils/initials'
import styles from './Avatar.module.css'

const GRADIENTS = [
  'linear-gradient(135deg, var(--brick), var(--wine-vin))',
  'linear-gradient(135deg, var(--wine-vin), var(--brick-deep))',
  'linear-gradient(135deg, var(--gold), var(--brick))',
  'linear-gradient(135deg, var(--brick-light), var(--brick-deep))',
]

function hashIndex(str, mod) {
  let h = 0
  const s = str || ''
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h % mod
}

// Avatar: foto (com alt) ou iniciais sobre gradiente determinístico.
export default function Avatar({ name, src, index, size = 56, className = '' }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name ? `Foto de ${name}` : ''}
        className={`${styles.avatar} ${className}`}
        style={{ width: size, height: size, objectFit: 'cover' }}
        loading="lazy"
      />
    )
  }
  const i = typeof index === 'number' ? index % GRADIENTS.length : hashIndex(name, GRADIENTS.length)
  return (
    <div
      className={`${styles.avatar} ${styles.initials} ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.36, background: GRADIENTS[i] }}
      role="img"
      aria-label={name ? `Avatar de ${name}` : 'Avatar'}
    >
      {getInitials(name)}
    </div>
  )
}
