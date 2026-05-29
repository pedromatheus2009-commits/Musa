import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { eventosService } from '../services/eventos.service'
import { useReveal } from '../hooks/useReveal'
import StripeBackground from '../components/brand/StripeBackground'
import SectionLabel from '../components/brand/SectionLabel'
import Selo from '../components/brand/Selo'
import styles from './Agenda.module.css'

const fmtPreco = (c) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtData = (d) => new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })
const TIPO_LABEL = { oficina: 'Oficina', aula: 'Aula', evento: 'Evento' }

export default function Agenda() {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')
  const [params, setParams] = useSearchParams()
  const compraOk = params.get('compra') === 'sucesso'
  const gridRef = useReveal()

  useEffect(() => {
    eventosService.listAgenda()
      .then((data) => { setEventos(data); setError('') })
      .catch(() => setError('Não foi possível carregar a agenda. Tente novamente em instantes.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <StripeBackground density="narrow" opacity={0.1} />
        <div className={styles.headerInner}>
          <SectionLabel align="center">Casa Musa · Agenda</SectionLabel>
          <h1 className={styles.title}>Oficinas, aulas &amp; encontros</h1>
          <p className={styles.subtitle}>Reserve sua vaga e receba a confirmação no WhatsApp.</p>
        </div>
      </header>

      {compraOk && (
        <div className={styles.successBanner} role="status">
          <span className={styles.bannerIcon}><Selo kind="heart" size={20} /></span>
          <span>Inscrição confirmada! Você vai receber a confirmação no WhatsApp.</span>
          <button onClick={() => setParams({})} className={styles.bannerClose} aria-label="Fechar aviso">×</button>
        </div>
      )}

      <div className={styles.container}>
        {loading ? (
          <div className={styles.grid} aria-hidden="true">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className={styles.skeleton} />)}
          </div>
        ) : error ? (
          <div className={styles.state}>
            <Selo kind="star" size={30} />
            <p>{error}</p>
          </div>
        ) : eventos.length === 0 ? (
          <div className={styles.state}>
            <Selo kind="heart" size={30} />
            <p>Nenhum evento publicado no momento. Volte em breve.</p>
          </div>
        ) : (
          <div className={styles.grid} ref={gridRef}>
            {eventos.map((e) => (
              <article key={e.id} className={`${styles.card} reveal`}>
                {e.imagemUrl && (
                  <div className={styles.cardImg} role="img" aria-label={e.titulo} style={{ backgroundImage: `url(${e.imagemUrl})` }} />
                )}
                <div className={styles.cardBody}>
                  <span className="tag tag-nude">{TIPO_LABEL[e.tipo] || e.tipo}</span>
                  <h3 className={styles.cardTitle}>{e.titulo}</h3>
                  <p className={styles.cardMeta}>{fmtData(e.dataHora)}</p>
                  <p className={styles.cardMeta}>{e.online ? 'Online' : (e.local || 'A definir')}</p>
                  {e.descricao && <p className={styles.cardDesc}>{e.descricao}</p>}
                  <div className={styles.cardFooter}>
                    <span className={styles.preco}>{fmtPreco(e.preco)}</span>
                    {e.esgotado ? (
                      <span className="tag tag-wine">Esgotado</span>
                    ) : (
                      <button className={`btn btn-primary ${styles.inscreverBtn}`} onClick={() => setSelected(e)}>
                        Inscrever-se
                      </button>
                    )}
                  </div>
                  {!e.esgotado && e.vagasRestantes <= 5 && (
                    <p className={styles.vagasAlerta}>Últimas {e.vagasRestantes} vaga(s)!</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {selected && <CheckoutModal evento={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const onlyDigits = (v) => (v || '').replace(/\D/g, '')

function CheckoutModal({ evento, onClose }) {
  const [form, setForm] = useState({ nome: '', email: '', whatsapp: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (form.nome.trim().length < 2) { setError('Informe seu nome completo.'); return }
    if (!isEmail(form.email)) { setError('Informe um email válido.'); return }
    if (onlyDigits(form.whatsapp).length < 10) { setError('Informe um WhatsApp válido, com DDD.'); return }
    setLoading(true); setError('')
    try {
      const { url } = await eventosService.checkout(evento.id, form)
      window.location.href = url
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao iniciar a inscrição. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-box ${styles.modal}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Inscrição — ${evento.titulo}`}>
        <button className={styles.modalClose} onClick={onClose} aria-label="Fechar">×</button>
        <h3 className={styles.modalTitle}>{evento.titulo}</h3>
        <p className={styles.modalSub}>{fmtData(evento.dataHora)} · {fmtPreco(evento.preco)}</p>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className="form-group">
            <label>Nome completo</label>
            <input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>WhatsApp (com DDD)</label>
            <input required placeholder="15999998888" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
          </div>
          {error && <p className={styles.modalErr}>{error}</p>}
          <button className={`btn btn-primary ${styles.modalSubmit}`} disabled={loading}>
            {loading ? 'Aguarde...' : `Ir para o pagamento · ${fmtPreco(evento.preco)}`}
          </button>
          <p className={styles.modalNote}>Pagamento seguro via Stripe · Pix ou cartão</p>
        </form>
      </div>
    </div>
  )
}
