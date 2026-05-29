import styles from './Cartouche.module.css'

// Moldura "rótulo" vintage. variant: double | dotted | plain · tone: gold | brick
export default function Cartouche({
  variant = 'double',
  tone = 'gold',
  as: Tag = 'div',
  className = '',
  children,
  ...rest
}) {
  return (
    <Tag
      className={`${styles.cartouche} ${styles[variant]} ${styles[`tone_${tone}`]} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
