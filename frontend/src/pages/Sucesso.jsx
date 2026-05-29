import { useNavigate } from 'react-router-dom'
import Cartouche from '../components/brand/Cartouche'
import Selo from '../components/brand/Selo'
import StripeBackground from '../components/brand/StripeBackground'
import styles from './Sucesso.module.css'

export default function Sucesso() {
  const navigate = useNavigate()
  return (
    <div className={styles.page}>
      <StripeBackground density="wide" opacity={0.14} />
      <Cartouche variant="double" tone="gold" className={styles.card}>
        <div className={styles.icon}><Selo kind="heart" size={48} animate /></div>
        <h1 className={styles.title}>Bem-vinda à Casa Musa!</h1>
        <p className={styles.subtitle}>
          Sua assinatura foi ativada com sucesso. Seu perfil já está visível no catálogo.
        </p>
        <div className={styles.actions}>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Ir para o início</button>
          <p className={styles.note}>Você já pode fechar esta aba com tranquilidade.</p>
        </div>
      </Cartouche>
    </div>
  )
}
