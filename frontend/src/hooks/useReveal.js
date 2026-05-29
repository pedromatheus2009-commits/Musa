import { useEffect, useRef } from 'react'

// Revela elementos `.reveal` ao entrar na viewport, com stagger automático por índice.
// Uso: const ref = useReveal(); <div ref={ref}> ... <div className="reveal" /> ... </div>
// (ou aplique a classe `reveal` no próprio elemento do ref)
export function useReveal(options = {}) {
  const ref = useRef(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const targets = root.classList && root.classList.contains('reveal')
      ? [root]
      : Array.from(root.querySelectorAll('.reveal'))
    if (targets.length === 0) return

    if (typeof IntersectionObserver === 'undefined') {
      targets.forEach((t) => t.classList.add('in-view'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px', ...options }
    )

    targets.forEach((t, i) => {
      if (!t.style.getPropertyValue('--reveal-delay')) {
        t.style.setProperty('--reveal-delay', `${Math.min(i * 80, 480)}ms`)
      }
      io.observe(t)
    })

    return () => io.disconnect()
  }, [])
  return ref
}
