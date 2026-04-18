import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import AuthModal from './components/AuthModal/AuthModal'
import Dashboard from './components/Dashboard/Dashboard'

import Home from './pages/Home'
import Profissionais from './pages/Profissionais'
import Sobre from './pages/Sobre'
import Feed from './pages/Feed'
import Parcerias from './pages/Parcerias'
import Anunciar from './pages/Anunciar'
import RedefinirSenha from './pages/RedefinirSenha'
import Planos from './pages/Planos'
import Sucesso from './pages/Sucesso'

const BARE_ROUTES = ['/redefinir-senha', '/sucesso']

function AppContent() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [authOpen, setAuthOpen] = useState(false)
  const [dashboardOpen, setDashboardOpen] = useState(false)

  const isBare = BARE_ROUTES.includes(location.pathname)

  if (dashboardOpen && user) {
    return (
      <Dashboard
        onClose={() => setDashboardOpen(false)}
        onOpenAnnounce={() => setDashboardOpen(false)}
      />
    )
  }

  return (
    <>
      {!isBare && (
        <Navbar
          user={user}
          onAuthClick={() => setAuthOpen(true)}
          onLogout={logout}
          onDashboardClick={() => user ? setDashboardOpen(true) : setAuthOpen(true)}
        />
      )}

      <Routes>
        <Route path="/" element={<Home onAuthRequired={() => setAuthOpen(true)} />} />
        <Route path="/profissionais" element={<Profissionais />} />
        <Route path="/anunciar" element={<Anunciar onAuthRequired={() => setAuthOpen(true)} />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/parcerias" element={<Parcerias />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        <Route path="/planos" element={<Planos onAuthRequired={() => setAuthOpen(true)} />} />
        <Route path="/sucesso" element={<Sucesso />} />
        <Route path="*" element={<Home onAuthRequired={() => setAuthOpen(true)} />} />
      </Routes>

      {!isBare && <Footer />}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}
