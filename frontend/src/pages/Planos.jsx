import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { paymentsService } from '../services/payments.service'
import { PLAN } from '../config/plan'
import StripeBackground from '../components/brand/StripeBackground'
import SectionLabel from '../components/brand/SectionLabel'
import Selo from '../components/brand/Selo'
import styles from './Planos.module.css'

const FEATURES = [
  'Perfil visível no catálogo da Casa Musa',
  'Contato direto de clientes via WhatsApp',
  'Galeria de fotos do seu trabalho',
  'Receba avaliações verificadas',
  'Publicações no feed da casa',
  'Cancele quando quiser',
]

export default function Planos({ onAuthRequired }) {
  const { user } = useAuth()
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState(true)

  useEffect(() => {
    if (!user) { setLoadingStatus(false); return }
    paymentsService.getStatus()
      .then(setStatus)
      .catch(() => setStatus(null))
      .finally(() => setLoadingStatus(false))
  }, [user])

  async function handleCheckout() {
    if (!user) { onAuthRequired(); return }
    setLoading(true)
    try {
      const { url } = await paymentsService.createCheckout()
      window.location.href = url
    } catch {
      alert('Erro ao iniciar checkout. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function handlePortal() {
    setLoading(true)
    try {
      const { url } = await paymentsService.createPortal()
      window.location.href = url
    } catch {
      alert('Erro ao abrir portal. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const isActive = status?.active
  const periodEnd = status?.periodEnd ? new Date(status.periodEnd).toLocaleDateString('pt-BR') : null

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <StripeBackground density="narrow" opacity={0.1} />
        <div className={styles.headerInner}>
          <SectionLabel align="center">Para profissionais</SectionLabel>
          <h1 className={styles.title}>Plano da vitrine</h1>
          <p className={styles.subtitle}>
            Uma assinatura simples para aparecer no catálogo e conectar-se a novos clientes.
          </p>
        </div>
      </header>

      <div className={styles.container}>
        {user && !loadingStatus && isActive && (
          <div className={styles.activeNotice}>
            <span className={styles.activeDot} />
            <span>Assinatura ativa{periodEnd ? ` — renova em ${periodEnd}` : ''}</span>
          </div>
        )}

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <p className={styles.planName}>{PLAN.name.toUpperCase()}</p>
            <div className={styles.price}>
              <span className={styles.amount}>{PLAN.price}</span>
              <span className={styles.period}>{PLAN.period}</span>
            </div>
            <p className={styles.trial}>{PLAN.trialDays} dias grátis para testar</p>
          </div>

          <ul className={styles.features}>
            {FEATURES.map((f) => (
              <li key={f}><span className={styles.check}><Selo kind="star" size={14} /></span> {f}</li>
            ))}
          </ul>

          {loadingStatus ? (
            <div className={styles.btnPlaceholder} />
          ) : isActive ? (
            <button className={styles.btnSecondary} onClick={handlePortal} disabled={loading}>
              {loading ? 'Aguarde...' : 'Gerenciar assinatura'}
            </button>
          ) : (
            <button className={styles.btnPrimary} onClick={handleCheckout} disabled={loading}>
              {loading ? 'Aguarde...' : `Começar — ${PLAN.trialDays} dias grátis`}
            </button>
          )}

          <p className={styles.guarantee}>
            Sem fidelidade · Cancele quando quiser · Pagamento seguro via Stripe
          </p>
        </div>

        <div className={styles.faq}>
          <h3>Perguntas frequentes</h3>
          <div className={styles.faqItem}>
            <strong>Preciso de cartão de crédito no trial?</strong>
            <p>Sim, mas você não é cobrada durante os {PLAN.trialDays} dias. Cancele antes para não ser debitada.</p>
          </div>
          <div className={styles.faqItem}>
            <strong>Como cancelo?</strong>
            <p>Pelo botão "Gerenciar assinatura" no seu painel ou na página de planos, em segundos.</p>
          </div>
          <div className={styles.faqItem}>
            <strong>Se eu cancelar, meu perfil some imediatamente?</strong>
            <p>Não. Você continua visível até o fim do período já pago.</p>
          </div>
          <div className={styles.faqItem}>
            <strong>Como funciona o pagamento?</strong>
            <p>A assinatura é no cartão de crédito/débito, com cobrança automática mensal pela Stripe.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
