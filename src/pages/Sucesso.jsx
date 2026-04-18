import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Sucesso.module.css'

export default function Sucesso() {
  const navigate = useNavigate()
  const [count, setCount] = useState(8)

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((c) => {
        if (c <= 1) { clearInterval(timer); navigate('/'); return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [navigate])

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>✦</div>
        <h1 className={styles.title}>Bem-vinda à MUSA!</h1>
        <p className={styles.subtitle}>
          Sua assinatura foi ativada com sucesso. Seu perfil já está visível no catálogo.
        </p>
        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={() => navigate('/')}>
            Ir para o início
          </button>
          <p className={styles.redirect}>Redirecionando em {count}s...</p>
        </div>
      </div>
    </div>
  )
}
