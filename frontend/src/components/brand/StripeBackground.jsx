import styles from './StripeBackground.module.css'

// Listras verticais pintadas (tijolo + rosa blush). Decorativo, fica atrás do conteúdo.
// density: wide | narrow · fade: vinheta nas bordas · opacity: 0..1
export default function StripeBackground({
  density = 'wide',
  fade = true,
  opacity,
  className = '',
}) {
  const style = opacity != null ? { '--stripe-opacity': opacity } : undefined
  return (
    <div
      aria-hidden="true"
      className={`${styles.stripes} ${styles[density]} ${fade ? styles.fade : ''} ${className}`}
      style={style}
    />
  )
}
