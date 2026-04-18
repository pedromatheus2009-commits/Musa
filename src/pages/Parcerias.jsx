import { useState } from 'react'
import { partnershipsService } from '../services/partnerships.service'
import styles from './Parcerias.module.css'

const beneficios = [
  { icon: '◈', titulo: 'Alcance qualificado', desc: 'Acesso a uma base de profissionais e clientes altamente engajados.' },
  { icon: '✦', titulo: 'Visibilidade de marca', desc: 'Sua marca presente em uma plataforma voltada a mulheres profissionais.' },
  { icon: '◎', titulo: 'Co-criação de conteúdo', desc: 'Oportunidades de produção de conteúdo conjunto e campanhas temáticas.' },
  { icon: '◇', titulo: 'Crescimento mútuo', desc: 'Parcerias estratégicas que impulsionam ambos os lados.' },
]

const tiposParceria = [
  'Patrocínio',
  'Permuta / Troca',
  'Collab de conteúdo',
  'Desconto para membros',
  'Outro',
]

export default function Parcerias() {
  const [form, setForm] = useState({ nome: '', empresa: '', email: '', tipo: '', mensagem: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function set(k) { return (e) => setForm((f) => ({ ...f, [k]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await partnershipsService.send({
        nome: form.nome,
        empresa: form.empresa,
        email: form.email,
        tipo: form.tipo,
        mensagem: form.mensagem,
      })
      setSuccess(true)
    } catch {
      setError('Falha ao enviar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <div className="container">
          <p className={styles.eyebrow}>Crescer juntas</p>
          <h1 className={styles.title}>Parcerias</h1>
          <p className={styles.subtitle}>Acreditamos que parcerias certas multiplicam resultados</p>
        </div>
      </div>

      {/* Benefícios */}
      <section className="section">
        <div className="container">
          <div className={styles.beneficiosGrid}>
            {beneficios.map((b) => (
              <div key={b.titulo} className={styles.beneficioCard}>
                <div className={styles.beneficioIcon}>{b.icon}</div>
                <h3 className={styles.beneficioTitulo}>{b.titulo}</h3>
                <p className={styles.beneficioDesc}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.divider} />

      {/* Formulário */}
      <section className="section">
        <div className="container">
          <div className={styles.formSection}>
            <div className={styles.formInfo}>
              <p className={styles.formEyebrow}>Vamos conversar</p>
              <h2 className={styles.formTitle}>Proposta de parceria</h2>
              <p className={styles.formDesc}>
                Preencha o formulário e entraremos em contato em até 3 dias úteis para conversarmos sobre possibilidades.
              </p>
              <div className={styles.contatos}>
                <div className={styles.contatoItem}>
                  <span className={styles.contatoIcon}>✉</span>
                  <span>parcerias@musacasa.com.br</span>
                </div>
                <div className={styles.contatoItem}>
                  <span className={styles.contatoIcon}>◎</span>
                  <span>@musacasa</span>
                </div>
              </div>
            </div>

            {success ? (
              <div className={styles.successBox}>
                <div className={styles.successIcon}>✦</div>
                <h3 className={styles.successTitle}>Proposta recebida!</h3>
                <p>Entraremos em contato em breve. Obrigada pelo interesse em crescer com a MUSA.</p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className="form-group">
                    <label>Nome</label>
                    <input value={form.nome} onChange={set('nome')} placeholder="Seu nome" required />
                  </div>
                  <div className="form-group">
                    <label>Empresa / Marca</label>
                    <input value={form.empresa} onChange={set('empresa')} placeholder="Nome da empresa" required />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={form.email} onChange={set('email')} placeholder="seu@email.com" required />
                  </div>
                  <div className="form-group">
                    <label>Tipo de parceria</label>
                    <select value={form.tipo} onChange={set('tipo')} required>
                      <option value="">Selecione...</option>
                      {tiposParceria.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Como podemos crescer juntas?</label>
                  <textarea rows={5} value={form.mensagem} onChange={set('mensagem')} placeholder="Descreva sua proposta, o que sua marca faz e como imagina a parceria..." required />
                </div>
                {error && <p className={styles.errorMsg}>{error}</p>}
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                  {loading ? 'Enviando...' : 'Enviar proposta'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
