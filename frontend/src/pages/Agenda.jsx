import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { eventosService } from '../services/eventos.service'
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

  useEffect(() => {
    eventosService.listAgenda()
      .then((data) => { setEventos(data); setError('') })
      .catch(() => setError('Não foi possível carregar a agenda. Tente novamente em instantes.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>AGENDA MUSA</p>
        <h1 className={styles.title}>Oficinas, aulas e eventos</h1>
        <p className={styles.subtitle}>Reserve sua vaga e receba a confirmação no WhatsApp.</p>
      </div>

      {compraOk && (
        <div className={styles.successBanner}>
          <span>✦ Inscrição confirmada! Você vai receber a confirmação no WhatsApp.</span>
          <button onClick={() => setParams({})} className={styles.bannerClose} aria-label="Fechar">×</button>
        </div>
      )}

      <div className={styles.container}>
        {loading ? (
          <p className={styles.muted}>Carregando agenda...</p>
        ) : error ? (
          <p className={styles.muted}>{error}</p>
        ) : eventos.length === 0 ? (
          <p className={styles.muted}>Nenhum evento publicado no momento. Volte em breve ✦</p>
        ) : (
          <div className={styles.grid}>
            {eventos.map((e) => (
              <article key={e.id} className={styles.card}>
                {e.imagemUrl && <div className={styles.cardImg} style={{ backgroundImage: `url(${e.imagemUrl})` }} />}
                <div className={styles.cardBody}>
                  <span className="tag tag-nude">{TIPO_LABEL[e.tipo] || e.tipo}</span>
                  <h3 className={styles.cardTitle}>{e.titulo}</h3>
                  <p className={styles.cardMeta}>📅 {fmtData(e.dataHora)}</p>
                  <p className={styles.cardMeta}>📍 {e.online ? 'Online' : (e.local || 'A definir')}</p>
                  {e.descricao && <p className={styles.cardDesc}>{e.descricao}</p>}
                  <div className={styles.cardFooter}>
                    <span className={styles.preco}>{fmtPreco(e.preco)}</span>
                    {e.esgotado ? (
                      <span className="tag tag-wine">Esgotado</span>
                    ) : (
                      <button className="btn btn-primary" style={{ padding: '9px 20px', fontSize: '0.72rem' }} onClick={() => setSelected(e)}>
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

function CheckoutModal({ evento, onClose }) {
  const [form, setForm] = useState({ nome: '', email: '', whatsapp: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(ev) {
    ev.preventDefault()
    setLoading(true); setError('')
    try {
      const { url } = await eventosService.checkout(evento.id, form)
      window.location.href = url
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao iniciar a inscrição. Tente novamente.')
      setLoading(false)
    }
  }

  const fmtPrecoLocal = (c) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ padding: 28 }}>
        <h3 style={{ color: 'var(--white)', marginBottom: 4 }}>{evento.titulo}</h3>
        <p style={{ color: 'var(--white-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
          {fmtData(evento.dataHora)} · {fmtPrecoLocal(evento.preco)}
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
            <input required placeholder="11999998888" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
          </div>
          {error && <p style={{ color: '#e07070', fontSize: '0.82rem' }}>{error}</p>}
          <button className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
            {loading ? 'Aguarde...' : `Ir para o pagamento · ${fmtPrecoLocal(evento.preco)}`}
          </button>
          <p style={{ color: 'var(--gray-light)', fontSize: '0.72rem', textAlign: 'center' }}>
            Pagamento seguro via Stripe · Pix ou cartão
          </p>
        </form>
      </div>
    </div>
  )
}
