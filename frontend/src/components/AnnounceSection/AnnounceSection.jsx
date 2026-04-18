import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { profilesService } from '../../services/profiles.service'
import styles from './AnnounceSection.module.css'

const benefits = [
  'Perfil visível para milhares de clientes em todo o Brasil',
  'Contato direto via WhatsApp, sem intermediários',
  'Filtros de busca por categoria e cidade',
  'Cadastro gratuito — sem taxa de adesão',
]

function AnnounceForm({ onSuccess, onAuthRequired }) {
  const { user } = useAuth()
  const [form, setForm] = useState({ nome: '', role: '', cidade: '', whatsapp: '', bio: '', preco: '', services: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(k) { return (e) => setForm((f) => ({ ...f, [k]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!user) { onAuthRequired(); return }
    setLoading(true); setError('')
    try {
      const services = form.services.split(',').map((s) => s.trim()).filter(Boolean)
      await profilesService.create({ ...form, services })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar perfil. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <div className="form-group">
          <label>Nome completo</label>
          <input value={form.nome} onChange={set('nome')} placeholder="Seu nome" required />
        </div>
        <div className="form-group">
          <label>Profissão / Especialidade</label>
          <input value={form.role} onChange={set('role')} placeholder="Ex: Fotógrafa" required />
        </div>
        <div className="form-group">
          <label>Cidade</label>
          <input value={form.cidade} onChange={set('cidade')} placeholder="São Paulo, SP" />
        </div>
        <div className="form-group">
          <label>WhatsApp</label>
          <input value={form.whatsapp} onChange={set('whatsapp')} placeholder="5511999999999" />
        </div>
      </div>
      <div className={`form-group ${styles.formFull}`}>
        <label>Sobre você</label>
        <textarea value={form.bio} onChange={set('bio')} placeholder="Conte sobre sua experiência e especialidades..." />
      </div>
      <div className={styles.formGrid}>
        <div className="form-group">
          <label>Preço / Pacotes</label>
          <input value={form.preco} onChange={set('preco')} placeholder="A partir de R$ 300" />
        </div>
        <div className="form-group">
          <label>Serviços (separados por vírgula)</label>
          <input value={form.services} onChange={set('services')} placeholder="Serviço 1, Serviço 2" />
        </div>
      </div>
      {error && <p className={styles.errorMsg}>{error}</p>}
      <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
        {loading ? 'Enviando...' : user ? 'Criar meu perfil' : 'Entrar para criar perfil'}
      </button>
    </form>
  )
}

export default function AnnounceSection({ onAuthRequired }) {
  const [success, setSuccess] = useState(false)

  return (
    <section className={`section ${styles.section}`} id="anunciar">
      <div className="container">
        <div className={styles.inner}>
          <div>
            <p className={styles.eyebrow}>Para profissionais</p>
            <h2 className={styles.title}>Faça parte da MUSA</h2>
            <p className={styles.desc}>
              Junte-se às centenas de mulheres profissionais que já usam a MUSA para
              expandir sua presença digital e conquistar novos clientes.
            </p>
            <ul className={styles.benefits}>
              {benefits.map((b) => (
                <li key={b} className={styles.benefit}>
                  <span className={styles.checkIcon}>✦</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.formCard}>
            {success ? (
              <div className={styles.successMsg}>
                <div className={styles.successIcon}>✦</div>
                <h3 className={styles.successTitle}>Perfil criado!</h3>
                <p>Seu perfil já está visível na vitrine da MUSA.</p>
              </div>
            ) : (
              <>
                <h3 className={styles.formTitle}>Anunciar-se</h3>
                <p className={styles.formSubtitle}>Gratuito • Sem taxa • Visível imediatamente</p>
                <AnnounceForm onSuccess={() => setSuccess(true)} onAuthRequired={onAuthRequired} />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
