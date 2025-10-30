import { useState } from 'react'
import Sidebar from './components/Sidebar'
import VisaoGeral from './pages/VisaoGeral'
import Insumos from './pages/Insumos'
import Usuarios from './pages/Usuarios'
import Configuracoes from './pages/Configuracoes'
import './App.css'

function App() {
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

  return (
    <div className="app-wrapper d-flex">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="main-area flex-grow-1 p-4">
        {renderPage()}
      </main>
    </div>
  )
}

export default App


