import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import Selo from '../brand/Selo'
import styles from './AuthModal.module.css'

function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth()
  // view: 'login' | 'register' | 'forgot' | 'forgot-sent'
  const [view, setView] = useState('login')
  const [form, setForm] = useState({ nome: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function reset(nextView) {
    setView(nextView)
    setError('')
    setForm({ nome: '', email: '', password: '', confirmPassword: '' })
  }

  function set(k) { return (e) => setForm((f) => ({ ...f, [k]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (view === 'register' && form.password !== form.confirmPassword) {
      return setError('As senhas não coincidem')
    }

    setLoading(true)
    try {
      if (view === 'login') {
        await login({ email: form.email, password: form.password })
        onClose()
      } else if (view === 'register') {
        await register({ nome: form.nome, email: form.email, password: form.password })
        onClose()
      } else if (view === 'forgot') {
        await api.post('/auth/forgot-password', { email: form.email })
        setView('forgot-sent')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-label="Entrar ou cadastrar">
        <div className={styles.inner}>
          <button className={styles.close} onClick={onClose} aria-label="Fechar">✕</button>
          <div className={styles.box}>
            <div className={styles.header}>
              <div className={styles.logo}>
                <span className={styles.logoKicker}>Casa</span>
                <span className={styles.logoScript}>Musa</span>
              </div>
            </div>

            {(view === 'login' || view === 'register') && (
              <div className={styles.tabs}>
                <button className={`${styles.tab} ${view === 'login' ? styles.active : ''}`} onClick={() => reset('login')}>Entrar</button>
                <button className={`${styles.tab} ${view === 'register' ? styles.active : ''}`} onClick={() => reset('register')}>Cadastrar</button>
              </div>
            )}

            {(view === 'login' || view === 'register') && (
              <form className={styles.form} onSubmit={handleSubmit}>
                {view === 'register' && (
                  <div className="form-group">
                    <label>Nome completo</label>
                    <input value={form.nome} onChange={set('nome')} placeholder="Seu nome" required />
                  </div>
                )}
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={set('email')} placeholder="seu@email.com" required />
                </div>
                <div className="form-group">
                  <label>Senha</label>
                  <input type="password" value={form.password} onChange={set('password')} placeholder={view === 'register' ? 'Mínimo 8 caracteres' : 'Sua senha'} required minLength={8} />
                </div>
                {view === 'register' && (
                  <div className="form-group">
                    <label>Confirmar senha</label>
                    <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Repita a senha" required minLength={8} />
                  </div>
                )}
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
                  {loading ? 'Aguarde...' : view === 'login' ? 'Entrar' : 'Criar conta'}
                </button>
                {view === 'login' && (
                  <button type="button" className={styles.forgotLink} onClick={() => reset('forgot')}>
                    Esqueci minha senha
                  </button>
                )}
              </form>
            )}

            {view === 'forgot' && (
              <div>
                <button className={styles.backBtn} onClick={() => reset('login')}>← Voltar</button>
                <p className={styles.forgotDesc}>Digite seu email e enviaremos um link para redefinir sua senha.</p>
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={form.email} onChange={set('email')} placeholder="seu@email.com" required autoFocus />
                  </div>
                  {error && <p className={styles.error}>{error}</p>}
                  <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar link'}
                  </button>
                </form>
              </div>
            )}

            {view === 'forgot-sent' && (
              <div className={styles.sentBox}>
                <div className={styles.sentIcon}><Selo kind="heart" size={40} /></div>
                <h3 className={styles.sentTitle}>Email enviado!</h3>
                <p className={styles.sentDesc}>
                  Se este email estiver cadastrado, você receberá um link em instantes. Verifique sua caixa de entrada.
                </p>
                <button className={`btn btn-outline ${styles.submitBtn}`} onClick={() => reset('login')}>
                  Voltar ao login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default AuthModal
