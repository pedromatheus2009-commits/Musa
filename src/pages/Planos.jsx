import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { paymentsService } from '../services/payments.service'
import styles from './Planos.module.css'

const PRICE = 'R$ 5,99'
const PERIOD = '/mês'

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
  const periodEnd = status?.periodEnd
    ? new Date(status.periodEnd).toLocaleDateString('pt-BR')
    : null

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <p className={styles.eyebrow}>PARA PROFISSIONAIS</p>
        <h1 className={styles.title}>Plano MUSA</h1>
        <p className={styles.subtitle}>
          Uma assinatura simples para aparecer no catálogo e conectar-se a novos clientes.
        </p>
      </div>

      <div className={styles.container}>
        {user && !loadingStatus && isActive && (
          <div className={styles.activeNotice}>
            <span className={styles.activeDot} />
            <span>Assinatura ativa{periodEnd ? ` — renova em ${periodEnd}` : ''}</span>
          </div>
        )}

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <p className={styles.planName}>PLANO MENSAL</p>
            <div className={styles.price}>
              <span className={styles.amount}>{PRICE}</span>
              <span className={styles.period}>{PERIOD}</span>
            </div>
            <p className={styles.trial}>7 dias grátis para testar</p>
          </div>

          <ul className={styles.features}>
            <li><span className={styles.check}>✦</span> Perfil visível no catálogo MUSA</li>
            <li><span className={styles.check}>✦</span> Contato direto de clientes via WhatsApp</li>
            <li><span className={styles.check}>✦</span> Galeria de fotos do seu trabalho</li>
            <li><span className={styles.check}>✦</span> Receba avaliações verificadas</li>
            <li><span className={styles.check}>✦</span> Publicações no feed MUSA</li>
            <li><span className={styles.check}>✦</span> Cancele quando quiser</li>
          </ul>

          {loadingStatus ? (
            <div className={styles.btnPlaceholder} />
          ) : isActive ? (
            <button
              className={styles.btnSecondary}
              onClick={handlePortal}
              disabled={loading}
            >
              {loading ? 'Aguarde...' : 'Gerenciar assinatura'}
            </button>
          ) : (
            <button
              className={styles.btnPrimary}
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'Aguarde...' : 'Começar — 7 dias grátis'}
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
            <p>Sim, mas você não é cobrada durante os 7 dias. Cancele antes para não ser debitada.</p>
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
            <strong>Aceitam PIX ou boleto?</strong>
            <p>Por ora somente cartão de crédito/débito. PIX será adicionado em breve.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
