import Selo from './Selo'
import styles from './Divider.module.css'

// Divisor ornamental com selo central.
export default function Divider({ ornament = true, kind = 'star', className = '' }) {
  return (
    <div className={`${styles.divider} ${className}`} role="separator" aria-hidden="true">
      <span className={styles.line} />
      {ornament && <Selo kind={kind} size={20} className={styles.selo} />}
      <span className={styles.line} />
    </div>
  )
}
