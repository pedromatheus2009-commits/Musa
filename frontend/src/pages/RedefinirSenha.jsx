import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import Cartouche from '../components/brand/Cartouche'
import Selo from '../components/brand/Selo'
import styles from './RedefinirSenha.module.css'

export default function RedefinirSenha() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token')

  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) navigate('/', { replace: true })
  }, [token, navigate])

  function set(k) { return (e) => setForm((f) => ({ ...f, [k]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      return setError('As senhas não coincidem')
    }
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/reset-password', { token, password: form.password })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Link inválido ou expirado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <Cartouche variant="double" tone="gold" className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoKicker}>Casa</span>
          <span className={styles.logoScript}>Musa</span>
        </div>

        {success ? (
          <div className={styles.successBox}>
            <div className={styles.successIcon}><Selo kind="heart" size={42} /></div>
            <h2 className={styles.successTitle}>Senha redefinida!</h2>
            <p className={styles.successDesc}>Sua senha foi alterada com sucesso. Faça login com a nova senha.</p>
            <button className={`btn btn-primary ${styles.fullBtn}`} onClick={() => navigate('/')}>
              Ir para o site
            </button>
          </div>
        ) : (
          <>
            <h2 className={styles.title}>Redefinir senha</h2>
            <p className={styles.desc}>Escolha uma nova senha para sua conta.</p>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nova senha</label>
                <input type="password" value={form.password} onChange={set('password')} placeholder="Mínimo 8 caracteres" required minLength={8} autoFocus />
              </div>
              <div className="form-group">
                <label>Confirmar nova senha</label>
                <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Repita a senha" required minLength={8} />
              </div>
              {error && <p className={styles.error}>{error}</p>}
              <button type="submit" className={`btn btn-primary ${styles.fullBtn}`} disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar nova senha'}
              </button>
            </form>
          </>
        )}
      </Cartouche>
    </main>
  )
}
