import styles from './SectionLabel.module.css'

// Eyebrow uppercase com régua dourada. align: left | center
export default function SectionLabel({ children, align = 'left', className = '' }) {
  return (
    <span className={`${styles.label} ${styles[`align_${align}`]} ${className}`}>
      <span className={styles.rule} aria-hidden="true" />
      <span className={styles.text}>{children}</span>
      {align === 'center' && <span className={styles.rule} aria-hidden="true" />}
    </span>
  )
}
