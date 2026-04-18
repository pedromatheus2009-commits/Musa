import { useState, useRef } from 'react'
import { profilesService } from '../../../services/profiles.service'
import { PROFISSOES, CIDADES_BR } from '../../../utils/options'
import styles from './EditProfile.module.css'

export default function EditProfile({ profile, onProfileUpdated }) {
  const fileRef = useRef()
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  const [form, setForm] = useState({
    nome: profile?.nome || '',
    role: profile?.role || '',
    bio: profile?.bio || '',
    cidade: profile?.cidade || '',
    whatsapp: profile?.whatsapp || '',
    preco: profile?.preco || '',
    services: profile?.services?.map((s) => s.nome).join(', ') || '',
    fotoUrl: profile?.fotoUrl || '',
    categoria: profile?.categories?.[0]?.category?.nome || '',
  })

  function handleRoleChange(e) {
    const role = e.target.value
    const prof = PROFISSOES.find((p) => p.label === role)
    set('role', role)
    if (prof) set('categoria', prof.categoria)
  }

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setSuccess(false)
    setError('')
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUploading(true)
    try {
      const { url } = await profilesService.uploadAvatar(file)
      set('fotoUrl', url)
    } catch {
      setError('Falha ao fazer upload da foto')
    } finally {
      setAvatarUploading(false)
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      const services = form.services
        ? form.services.split(',').map((s) => s.trim()).filter(Boolean)
        : []
      const updated = await profilesService.update(profile.id, {
        nome: form.nome,
        role: form.role,
        bio: form.bio || undefined,
        cidade: form.cidade || undefined,
        whatsapp: form.whatsapp || undefined,
        preco: form.preco || undefined,
        fotoUrl: form.fotoUrl || undefined,
        categoria: form.categoria || undefined,
        services,
      })
      setSuccess(true)
      onProfileUpdated(updated)
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar perfil')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Tem certeza que deseja desativar seu perfil? Ele ficará oculto para outros usuários.')) return
    setDeleting(true)
    try {
      await profilesService.remove(profile.id)
      onProfileUpdated(null)
    } catch {
      setError('Erro ao desativar perfil')
      setDeleting(false)
    }
  }

  const initials = form.nome?.split(' ').slice(0, 2).map((w) => w[0]).join('') || '?'

  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>Meu Perfil</h2>
      <p className={styles.pageSubtitle}>Edite suas informações públicas visíveis para clientes</p>

      {/* Avatar */}
      <div className={styles.avatarSection}>
        <div className={styles.avatar}>
          {form.fotoUrl
            ? <img src={form.fotoUrl} alt={form.nome} />
            : initials}
        </div>
        <div className={styles.avatarInfo}>
          <h4>Foto de perfil</h4>
          <p>JPEG, PNG ou WebP • máx. 5 MB</p>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleAvatarChange} />
          <button className={styles.avatarUploadBtn} onClick={() => fileRef.current?.click()} disabled={avatarUploading}>
            {avatarUploading ? 'Enviando...' : '↑ Alterar foto'}
          </button>
        </div>
      </div>

      {/* Form */}
      <form className={styles.form} onSubmit={handleSave}>
        <div className={styles.row}>
          <div className="form-group">
            <label>Nome completo *</label>
            <input value={form.nome} onChange={(e) => set('nome', e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Especialidade / Profissão *</label>
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
          <textarea rows={4} value={form.bio} onChange={(e) => set('bio', e.target.value)} placeholder="Conte sua história, experiência e diferenciais..." />
        </div>

        <div className={styles.row}>
          <div className="form-group">
            <label>Cidade</label>
            <select value={form.cidade} onChange={(e) => set('cidade', e.target.value)}>
              <option value="">Selecione sua cidade</option>
              {CIDADES_BR.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>WhatsApp</label>
            <input value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="5511999999999" />
          </div>
        </div>

        <div className={styles.row}>
          <div className="form-group">
            <label>Precificação</label>
            <input value={form.preco} onChange={(e) => set('preco', e.target.value)} placeholder="Ex: A partir de R$ 500" />
          </div>
          <div className="form-group">
            <label>Serviços (separe por vírgula)</label>
            <input value={form.services} onChange={(e) => set('services', e.target.value)} placeholder="Ex: Ensaio, Casamento, Book" />
          </div>
        </div>

        <div className={styles.saveRow}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
          {success && <span className={styles.successMsg}>✓ Perfil atualizado com sucesso!</span>}
          {error && <span className={styles.errorMsg}>{error}</span>}
        </div>
      </form>

      {profile && (
        <>
          <div className={styles.divider} />
          <div className={styles.dangerZone}>
            <h4>Zona de perigo</h4>
            <p>Ao desativar seu perfil, ele ficará oculto para outros usuários. Você pode reativá-lo entrando em contato conosco.</p>
            <button className={styles.deleteBtn} onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Desativando...' : 'Desativar perfil'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
