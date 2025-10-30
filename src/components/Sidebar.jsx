import './Sidebar.css'

function Sidebar({ currentPage, onNavigate }) {
  const menuItems = [
    { id: 'visao-geral', icon: 'bi-speedometer2', label: 'Visão Geral' },
    { id: 'insumos', icon: 'bi-box-seam', label: 'Insumos' },
    { id: 'usuarios', icon: 'bi-people', label: 'Usuários' },
    { id: 'configuracoes', icon: 'bi-gear', label: 'Configurações' }
  ]

  return (
    <aside className="sidebar d-flex flex-column p-3">
      <div className="brand d-flex align-items-center justify-content-center mb-2 mt-2">
        <img src="/img/logo-removebg-preview.png" alt="LabSync Logo" style={{ width: '180px', height: '180px' }} />
      </div>

      <nav className="nav flex-column mb-auto">
        {menuItems.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              onNavigate(item.id)
            }}
          >
            <i className={`bi ${item.icon} me-2`}></i>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="sidebar-footer pt-3">
        <div className="user d-flex align-items-center">
          <div>
            <div className="fw-bold">Admin</div>
            <small className="text-white-50">Teste</small>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

