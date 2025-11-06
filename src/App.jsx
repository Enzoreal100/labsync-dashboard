import { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Sidebar from './components/Sidebar'
import VisaoGeral from './pages/VisaoGeral'
import Insumos from './pages/Insumos'
import Usuarios from './pages/Usuarios'
import Configuracoes from './pages/Configuracoes'
import Login from './pages/Login'
import './App.css'

function DashboardContent() {
  const { isAuthenticated, loading, logout } = useAuth()
  const [currentPage, setCurrentPage] = useState('visao-geral')

  const renderPage = () => {
    switch (currentPage) {
      case 'insumos':
        return <Insumos />
      case 'usuarios':
        return <Usuarios />
      case 'configuracoes':
        return <Configuracoes />
      case 'visao-geral':
      default:
        return <VisaoGeral />
    }
  }

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: 'linear-gradient(2000deg, #259bbb, #ff914d)' }}>
        <div className="text-center text-white">
          <div className="spinner-border mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não estiver autenticado, mostrar login
  if (!isAuthenticated) {
    return <Login />
  }

  // Se autenticado, mostrar dashboard
  return (
    <div className="app-wrapper d-flex">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        onLogout={logout}
      />
      <main className="main-area flex-grow-1 p-4">
        {renderPage()}
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  )
}

export default App


