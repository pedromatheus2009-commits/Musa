import { useState, useEffect } from 'react'
import { paymentsService } from '../../../services/payments.service'
import styles from './Assinatura.module.css'

const STATUS_LABEL = {
  active: 'Ativa',
  trialing: 'Período de teste',
  past_due: 'Pagamento pendente',
  canceled: 'Cancelada',
  incomplete: 'Incompleta',
}

export default function Assinatura() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    paymentsService.getStatus()
      .then(setStatus)
      .catch(() => setStatus(null))
      .finally(() => setLoading(false))
  }, [])

  async function handleCheckout() {
    setActionLoading(true)
    try {
      const { url } = await paymentsService.createCheckout()
      window.location.href = url
    } catch {
      alert('Erro ao iniciar checkout. Tente novamente.')
    } finally {
      setActionLoading(false)
    }
  }

  async function handlePortal() {
    setActionLoading(true)
    try {
      const { url } = await paymentsService.createPortal()
      window.location.href = url
    } catch {
      alert('Erro ao abrir portal. Tente novamente.')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <div className={styles.loading}>Carregando...</div>

  const isActive = status?.active
  const periodEnd = status?.periodEnd
    ? new Date(status.periodEnd).toLocaleDateString('pt-BR')
    : null
  const statusLabel = STATUS_LABEL[status?.status] || null

  return (
    <div className={styles.wrap}>
      <h2 className={styles.heading}>Assinatura</h2>

      <div className={styles.card}>
        <div className={styles.planRow}>
          <span className={styles.planName}>Plano Mensal — R$ 5,99/mês</span>
          {statusLabel && (
            <span className={`${styles.badge} ${isActive ? styles.badgeActive : styles.badgeInactive}`}>
              {statusLabel}
            </span>
          )}
        </div>

        {isActive ? (
          <>
            {periodEnd && (
              <p className={styles.info}>
                {status?.status === 'trialing'
                  ? `Trial termina em ${periodEnd}`
                  : `Próxima cobrança em ${periodEnd}`}
              </p>
            )}
            <p className={styles.info}>Seu perfil está visível no catálogo MUSA.</p>
            <button
              className={styles.btnSecondary}
              onClick={handlePortal}
              disabled={actionLoading}
            >
              {actionLoading ? 'Aguarde...' : 'Gerenciar / Cancelar assinatura'}
            </button>
          </>
        ) : (
          <>
            <p className={styles.info}>
              {status?.status
                ? 'Sua assinatura não está ativa. Seu perfil está oculto do catálogo.'
                : 'Você ainda não tem uma assinatura. Assine para aparecer no catálogo.'}
            </p>
            <button
              className={styles.btnPrimary}
              onClick={handleCheckout}
              disabled={actionLoading}
            >
              {actionLoading ? 'Aguarde...' : 'Assinar — 7 dias grátis'}
            </button>
          </>
        )}
      </div>

      <p className={styles.note}>
        Pagamentos processados com segurança via Stripe. Cancele quando quiser pelo portal acima.
      </p>
    </div>
  )
}
