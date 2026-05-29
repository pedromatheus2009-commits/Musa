import { useState } from 'react'
import { partnershipsService } from '../services/partnerships.service'
import { useReveal } from '../hooks/useReveal'
import StripeBackground from '../components/brand/StripeBackground'
import SectionLabel from '../components/brand/SectionLabel'
import Selo from '../components/brand/Selo'
import Divider from '../components/brand/Divider'
import styles from './Parcerias.module.css'

const beneficios = [
  { kind: 'star', titulo: 'Alcance qualificado', desc: 'Acesso a uma base de profissionais e clientes altamente engajados.' },
  { kind: 'heart', titulo: 'Visibilidade de marca', desc: 'Sua marca presente em um espaço voltado a mulheres.' },
  { kind: 'crest', titulo: 'Co-criação de conteúdo', desc: 'Oportunidades de conteúdo conjunto e campanhas temáticas.' },
  { kind: 'star', titulo: 'Crescimento mútuo', desc: 'Parcerias estratégicas que impulsionam ambos os lados.' },
]

const tiposParceria = ['Patrocínio', 'Permuta / Troca', 'Collab de conteúdo', 'Desconto para membros', 'Outro']

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

export default function Parcerias() {
  const [form, setForm] = useState({ nome: '', empresa: '', email: '', tipo: '', mensagem: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const grid = useReveal()

  function set(k) { return (e) => setForm((f) => ({ ...f, [k]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isEmail(form.email)) { setError('Informe um email válido.'); return }
    setLoading(true); setError('')
    try {
      await partnershipsService.send(form)
      setSuccess(true)
    } catch {
      setError('Falha ao enviar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <StripeBackground density="narrow" opacity={0.1} />
        <div className={`container ${styles.headerInner}`}>
          <SectionLabel align="center">Crescer juntas</SectionLabel>
          <h1 className={styles.title}>Parcerias</h1>
          <p className={styles.subtitle}>Acreditamos que as parcerias certas multiplicam resultados.</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className={styles.beneficiosGrid} ref={grid}>
            {beneficios.map((b) => (
              <div key={b.titulo} className={`${styles.beneficioCard} reveal`}>
                <span className={styles.beneficioIcon}><Selo kind={b.kind} size={26} /></span>
                <h3 className={styles.beneficioTitulo}>{b.titulo}</h3>
                <p className={styles.beneficioDesc}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container"><Divider /></div>

      <section className="section">
        <div className="container">
          <div className={styles.formSection}>
            <div className={styles.formInfo}>
              <SectionLabel>Vamos conversar</SectionLabel>
              <h2 className={styles.formTitle}>Proposta de parceria</h2>
              <p className={styles.formDesc}>
                Preencha o formulário e entraremos em contato em até 3 dias úteis para conversarmos sobre possibilidades.
              </p>
              <div className={styles.contatos}>
                <div className={styles.contatoItem}>
                  <span className={styles.contatoIcon}><Selo kind="star" size={16} /></span>
                  <span>parcerias@musacasa.com.br</span>
                </div>
                <div className={styles.contatoItem}>
                  <span className={styles.contatoIcon}><Selo kind="heart" size={16} /></span>
                  <span>@musacasa</span>
                </div>
              </div>
            </div>

            {success ? (
              <div className={styles.successBox}>
                <div className={styles.successIcon}><Selo kind="heart" size={42} /></div>
                <h3 className={styles.successTitle}>Proposta recebida!</h3>
                <p>Entraremos em contato em breve. Obrigada pelo interesse em crescer com a Casa Musa.</p>
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
                      {tiposParceria.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Como podemos crescer juntas?</label>
                  <textarea rows={5} value={form.mensagem} onChange={set('mensagem')} placeholder="Descreva sua proposta, o que sua marca faz e como imagina a parceria..." required />
                </div>
                {error && <p className={styles.errorMsg}>{error}</p>}
                <button type="submit" className={`btn btn-primary ${styles.fullBtn}`} disabled={loading}>
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
