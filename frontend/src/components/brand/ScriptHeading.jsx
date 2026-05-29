import styles from './ScriptHeading.module.css'

// Título caligráfico (Petit Formal Script). size: sm | md | lg · tone: brick | wine | ink | gold
export default function ScriptHeading({
  children,
  size = 'md',
  tone = 'brick',
  align = 'left',
  as: Tag = 'span',
  className = '',
}) {
  return (
    <Tag
      className={`${styles.script} ${styles[size]} ${styles[`tone_${tone}`]} ${className}`}
      style={{ textAlign: align }}
    >
      {children}
    </Tag>
  )
}
