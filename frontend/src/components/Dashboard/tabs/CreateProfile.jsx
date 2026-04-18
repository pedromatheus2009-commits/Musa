import { useState } from 'react'
import { profilesService } from '../../../services/profiles.service'
import { PROFISSOES, CIDADES_BR } from '../../../utils/options'
import styles from './CreateProfile.module.css'

export default function CreateProfile({ onProfileCreated }) {
  const [form, setForm] = useState({
    nome: '', role: '', cidade: '', whatsapp: '', bio: '', preco: '', services: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(k) {
    return (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setError('') }
  }

  function handleRoleChange(e) {
    const role = e.target.value
    const prof = PROFISSOES.find((p) => p.label === role)
    setForm((f) => ({ ...f, role, categoria: prof?.categoria || '' }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const services = form.services.split(',').map((s) => s.trim()).filter(Boolean)
      const profile = await profilesService.create({ ...form, services })
      onProfileCreated(profile)
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar perfil. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <h2 className={styles.heading}>Criar meu perfil</h2>
      <p className={styles.sub}>Preencha suas informações para aparecer no catálogo MUSA.</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <div className="form-group">
            <label>Nome completo *</label>
            <input value={form.nome} onChange={set('nome')} placeholder="Seu nome completo" required />
          </div>
          <div className="form-group">
            <label>Profissão / Especialidade *</label>
            <select value={form.role} onChange={handleRoleChange} required>
              <option value="">Selecione sua profissão</option>
              {PROFISSOES.map((p) => (
                <option key={p.label} value={p.label}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Sobre você</label>
          <textarea rows={4} value={form.bio} onChange={set('bio')} placeholder="Conte sua história, experiência e diferenciais..." />
        </div>

        <div className={styles.row}>
          <div className="form-group">
            <label>Cidade</label>
            <select value={form.cidade} onChange={set('cidade')}>
              <option value="">Selecione sua cidade</option>
              {CIDADES_BR.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>WhatsApp</label>
            <input value={form.whatsapp} onChange={set('whatsapp')} placeholder="5511999999999" />
          </div>
        </div>

        <div className={styles.row}>
          <div className="form-group">
            <label>Preço / Pacotes</label>
            <input value={form.preco} onChange={set('preco')} placeholder="Ex: A partir de R$ 300" />
          </div>
          <div className="form-group">
            <label>Serviços (separados por vírgula)</label>
            <input value={form.services} onChange={set('services')} placeholder="Ensaio, Casamento, Book" />
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Criando perfil...' : 'Criar meu perfil'}
        </button>
      </form>
    </div>
  )
}
