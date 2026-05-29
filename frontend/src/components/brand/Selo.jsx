import styles from './Selo.module.css'

// Ornamento de gravura (line-art). kind: star | heart | crest
const PATHS = {
  star: (
    <path d="M12 1.8c.85 5.5 3.7 8.35 9.2 9.2-5.5.85-8.35 3.7-9.2 9.2-.85-5.5-3.7-8.35-9.2-9.2 5.5-.85 8.35-3.7 9.2-9.2Z" />
  ),
  heart: (
    <g>
      <path d="M12 20.5s-6.2-4-6.2-8.7a3.6 3.6 0 0 1 6.2-2.4 3.6 3.6 0 0 1 6.2 2.4c0 4.7-6.2 8.7-6.2 8.7Z" />
      <path d="M3.2 6.6 19 16.2" />
      <path d="M15.6 5.2 19.4 6l-.7 3.8" />
      <path d="M3.2 6.6 6.9 5.9M3.2 6.6 4 10.3" />
    </g>
  ),
  crest: (
    <g>
      <path d="M12 2.2 20 12l-8 9.8L4 12Z" />
      <path d="M12 7 16 12l-4 5-4-5Z" />
    </g>
  ),
}

export default function Selo({ kind = 'star', size = 22, animate = false, className = '' }) {
  return (
    <span
      className={`${styles.selo} ${animate ? styles.pop : ''} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {PATHS[kind] || PATHS.star}
      </svg>
    </span>
  )
}
