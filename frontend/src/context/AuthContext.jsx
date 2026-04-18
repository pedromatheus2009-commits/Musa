import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/auth.service'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('musa_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(!!localStorage.getItem('musa_token'))

  useEffect(() => {
    const token = localStorage.getItem('musa_token')
    if (!token) { setLoading(false); return }
    authService.me()
      .then(setUser)
      .catch(() => { localStorage.removeItem('musa_token'); localStorage.removeItem('musa_user') })
      .finally(() => setLoading(false))
  }, [])

  function saveSession({ user: u, token }) {
    localStorage.setItem('musa_token', token)
    localStorage.setItem('musa_user', JSON.stringify(u))
    setUser(u)
  }

  async function login(data) {
    const result = await authService.login(data)
    saveSession(result)
    return result
  }

  async function register(data) {
    const result = await authService.register(data)
    saveSession(result)
    return result
  }

  function logout() {
    localStorage.removeItem('musa_token')
    localStorage.removeItem('musa_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
