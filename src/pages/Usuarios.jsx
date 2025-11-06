import { useState, useEffect } from 'react'

function Usuarios() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Status: Todos')
  const [functionFilter, setFunctionFilter] = useState('Função: Todas')
  const [showModal, setShowModal] = useState(false)
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    funcao: 'Enfermeira',
    depto: '',
    status: 'Ativo'
  })

  const [usuariosData, setUsuariosData] = useState([
    { nome: "Ana Silva", id: "U001", email: "ana.silva@dasa.com.br", funcao: "Enfermeira", depto: "UTI", status: "Ativo", ultimoAcesso: "2025-09-20 14:30" },
    { nome: "Bruno Costa", id: "U002", email: "bruno.costa@dasa.com.br", funcao: "Médico", depto: "Cardiologia", status: "Ativo", ultimoAcesso: "2025-09-20 13:45" },
    { nome: "Carla Mendes", id: "U003", email: "carla.mendes@dasa.com.br", funcao: "Técnica", depto: "Laboratório", status: "Pendente", ultimoAcesso: "2025-09-19 16:20" },
    { nome: "Daniel Oliveira", id: "U004", email: "daniel.oliveira@dasa.com.br", funcao: "Farmacêutico", depto: "Farmácia", status: "Inativo", ultimoAcesso: "2025-09-18 10:15" },
    { nome: "Elisa Santos", id: "U005", email: "elisa.santos@dasa.com.br", funcao: "Administrador", depto: "TI", status: "Ativo", ultimoAcesso: "2025-09-20 15:10" },
  ])

  const filteredData = usuariosData.filter(user => {
    const matchesSearch = user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'Status: Todos' || user.status === statusFilter
    const matchesFunction = functionFilter === 'Função: Todas' || user.funcao === functionFilter
    
    return matchesSearch && matchesStatus && matchesFunction
  })

  // Função para deletar usuário
  const handleDeleteUser = (userId, userName) => {
    if (window.confirm(`Tem certeza que deseja deletar o usuário ${userName}?`)) {
      setUsuariosData(usuariosData.filter(user => user.id !== userId))
    }
  }

  // Função para gerar ID único
  const gerarNovoId = () => {
    const ultimoId = usuariosData.length > 0 
      ? Math.max(...usuariosData.map(u => parseInt(u.id.replace('U', '')))) 
      : 0
    return `U${String(ultimoId + 1).padStart(3, '0')}`
  }

  // Função para obter data/hora atual formatada
  const getDataHoraAtual = () => {
    const now = new Date()
    const ano = now.getFullYear()
    const mes = String(now.getMonth() + 1).padStart(2, '0')
    const dia = String(now.getDate()).padStart(2, '0')
    const hora = String(now.getHours()).padStart(2, '0')
    const min = String(now.getMinutes()).padStart(2, '0')
    return `${ano}-${mes}-${dia} ${hora}:${min}`
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNovoUsuario(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAdicionarUsuario = (e) => {
    e.preventDefault()
    
    const usuario = {
      nome: novoUsuario.nome,
      id: gerarNovoId(),
      email: novoUsuario.email,
      funcao: novoUsuario.funcao,
      depto: novoUsuario.depto,
      status: novoUsuario.status,
      ultimoAcesso: getDataHoraAtual()
    }
    
    setUsuariosData([...usuariosData, usuario])
    
    // Limpar formulário e fechar modal
    setNovoUsuario({
      nome: '',
      email: '',
      funcao: 'Enfermeira',
      depto: '',
      status: 'Ativo'
    })
    setShowModal(false)
  }

  const [stats, setStats] = useState({
    total: 0,
    ativos: 0,
    pendentes: 0,
    percentual: 0,
    acessosHoje: 342
  })

  useEffect(() => {
    const total = filteredData.length
    const ativos = filteredData.filter(u => u.status === 'Ativo').length
    const pendentes = filteredData.filter(u => u.status === 'Pendente').length
    const percentual = total > 0 ? ((ativos / total) * 100).toFixed(0) : 0

    setStats({ total, ativos, pendentes, percentual, acessosHoje: 342 })
  }, [filteredData])

  const statusBadges = {
    'Ativo': 'bg-success',
    'Pendente': 'bg-warning',
    'Inativo': 'bg-secondary'
  }

  return (
    <>
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0 text-white">Gerenciamento de Usuários</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-light btn-sm">
            <i className="bi bi-arrow-clockwise me-2"></i>Atualizar
          </button>
          <button className="btn btn-info" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-circle me-2"></i>Adicionar Usuário
          </button>
        </div>
      </header>

      <section className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stat-card p-3 h-100">
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-white-50">Total de Usuários</small>
                <h3 className="mt-1 fw-bold">{stats.total}</h3>
              </div>
              <div className="stat-icon bg-primary text-white">
                <i className="bi bi-people-fill"></i>
              </div>
            </div>
            <div className="mt-2 small text-success">
              +12 <span className="text-white-50">este mês</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stat-card p-3 h-100">
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-white-50">Usuários Ativos</small>
                <h3 className="mt-1 fw-bold">{stats.ativos}</h3>
              </div>
              <div className="stat-icon bg-success text-white">
                <i className="bi bi-person-check-fill"></i>
              </div>
            </div>
            <div className="mt-2 small text-white-50">
              {stats.percentual}% do total
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stat-card p-3 h-100">
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-white-50">Acessos Hoje</small>
                <h3 className="mt-1 fw-bold">{stats.acessosHoje}</h3>
              </div>
              <div className="stat-icon stat-icon--accent text-white">
                <i className="bi bi-door-open-fill"></i>
              </div>
            </div>
            <div className="mt-2 small text-white-50">últimas 24h</div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stat-card p-3 h-100">
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-white-50">Pendentes</small>
                <h3 className="mt-1 fw-bold">{stats.pendentes}</h3>
              </div>
              <div className="stat-icon bg-warning text-dark">
                <i className="bi bi-person-fill-exclamation"></i>
              </div>
            </div>
            <div className="mt-2 small text-white-50">aguardando aprovação</div>
          </div>
        </div>
      </section>

      <div className="card p-3">
        <div className="row g-3 align-items-center mb-3">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 text-white-50">
                <i className="bi bi-search"></i>
              </span>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select 
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>Status: Todos</option>
              <option>Ativo</option>
              <option>Pendente</option>
              <option>Inativo</option>
            </select>
          </div>
          <div className="col-md-3">
            <select 
              className="form-select"
              value={functionFilter}
              onChange={(e) => setFunctionFilter(e.target.value)}
            >
              <option>Função: Todas</option>
              <option>Enfermeira</option>
              <option>Médico</option>
              <option>Técnica</option>
              <option>Farmacêutico</option>
              <option>Administrador</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-borderless table-hover align-middle text-white">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Função</th>
                <th>Departamento</th>
                <th>Status</th>
                <th>Último Acesso</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.nome}</strong>
                    <br />
                    <small className="text-white-50">ID: {user.id}</small>
                  </td>
                  <td className="text-white-50">{user.email}</td>
                  <td className="text-white-50">{user.funcao}</td>
                  <td className="text-white-50">{user.depto}</td>
                  <td>
                    <span className={`badge ${statusBadges[user.status] || 'bg-dark'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="text-white-50">{user.ultimoAcesso}</td>
                  <td>
                    <button 
                      className="btn btn-sm" 
                      title="Deletar usuário"
                      onClick={() => handleDeleteUser(user.id, user.nome)}
                      style={{
                        borderColor: 'var(--dasa-red-accent)',
                        color: 'var(--dasa-red-accent)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--dasa-red-accent)'
                        e.currentTarget.style.color = 'white'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = 'var(--dasa-red-accent)'
                      }}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Adicionar Novo Usuário */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ backgroundColor: 'var(--dasa-card-bg)', color: 'white' }}>
              <div className="modal-header border-bottom border-secondary">
                <h5 className="modal-title">Adicionar Novo Usuário</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAdicionarUsuario}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="nome" className="form-label">Nome Completo</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nome"
                      name="nome"
                      value={novoUsuario.nome}
                      onChange={handleInputChange}
                      placeholder="Ex: João Silva"
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={novoUsuario.email}
                      onChange={handleInputChange}
                      placeholder="Ex: joao.silva@dasa.com.br"
                      required
                    />
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="funcao" className="form-label">Função</label>
                      <select
                        className="form-select"
                        id="funcao"
                        name="funcao"
                        value={novoUsuario.funcao}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Enfermeira">Enfermeira</option>
                        <option value="Médico">Médico</option>
                        <option value="Técnica">Técnica</option>
                        <option value="Farmacêutico">Farmacêutico</option>
                        <option value="Administrador">Administrador</option>
                      </select>
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="depto" className="form-label">Departamento</label>
                      <input
                        type="text"
                        className="form-control"
                        id="depto"
                        name="depto"
                        value={novoUsuario.depto}
                        onChange={handleInputChange}
                        placeholder="Ex: UTI"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={novoUsuario.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Pendente">Pendente</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  </div>
                </div>
                
                <div className="modal-footer border-top border-secondary">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-info">
                    <i className="bi bi-plus-circle me-2"></i>Adicionar Usuário
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-4 text-white-50 small text-center">
        © LabSync • DASA
      </footer>
    </>
  )
}

export default Usuarios

