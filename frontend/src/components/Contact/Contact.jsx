import { useState } from 'react'
import { contactService } from '../../services/contact.service'
import styles from './Contact.module.css'

export default function Contact() {
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function set(k) { return (e) => setForm((f) => ({ ...f, [k]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await contactService.send(form)
      setSuccess(true)
    } catch {
      setError('Falha ao enviar mensagem. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={`section ${styles.section}`} id="contato">
      <div className="container">
        <div className={styles.inner}>
          <div>
            <p className={styles.eyebrow}>Fale conosco</p>
            <h2 className={styles.title}>Contato</h2>
            <p className={styles.desc}>Tem dúvidas, sugestões ou quer saber mais sobre a MUSA? Fale com a gente.</p>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>✉</span>
                <div>
                  <div className={styles.infoLabel}>Email</div>
                  <div className={styles.infoValue}>contato@musacasa.com.br</div>
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>◎</span>
                <div>
                  <div className={styles.infoLabel}>Instagram</div>
                  <div className={styles.infoValue}>@musacasa</div>
                </div>
              </div>
            </div>
          </div>

          {success ? (
            <div className={styles.success}>
              <div className={styles.successIcon}>✦</div>
              <h3 className={styles.successTitle}>Mensagem enviada!</h3>
              <p>Entraremos em contato em breve.</p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome</label>
                <input value={form.nome} onChange={set('nome')} placeholder="Seu nome" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={set('email')} placeholder="seu@email.com" required />
              </div>
              <div className="form-group">
                <label>Mensagem</label>
                <textarea value={form.mensagem} onChange={set('mensagem')} placeholder="Sua mensagem..." required />
              </div>
              {error && <p className={styles.error}>{error}</p>}
              <button type="submit" className={`btn btn-primary ${styles.btn}`} disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
