import { useState } from 'react'

function Insumos() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [categoryFilter, setCategoryFilter] = useState('Todos')

  const insumosDataOriginal = [
    { nome: 'Luva Nitrílica', codigo: 'Cód.003', categoria: 'EPI', estoque: { atual: 50, total: 100 }, status: 'OK' },
    { nome: 'Álcool 70%', codigo: 'Cód.005', categoria: 'Consumíveis', estoque: { atual: 15, total: 50 }, status: 'Baixo' },
    { nome: 'Seringa 5ml', codigo: 'Cód.006', categoria: 'Consumíveis', estoque: { atual: 5, total: 25 }, status: 'Crítico' },
    { nome: 'Máscara N95', codigo: 'Cód.007', categoria: 'EPI', estoque: { atual: 80, total: 100 }, status: 'OK' },
    { nome: 'Paracetamol 500mg', codigo: 'Cód.008', categoria: 'Medicamentos', estoque: { atual: 200, total: 500 }, status: 'OK' },
  ]

  const filteredData = insumosDataOriginal.filter(item => {
    const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'Todos' || item.status === statusFilter
    const matchesCategory = categoryFilter === 'Todos' || item.categoria === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const statusBadges = {
    'OK': 'bg-success',
    'Baixo': 'bg-warning text-dark',
    'Crítico': 'bg-danger'
  }

  return (
    <>
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0 text-white">Gerenciamento de Insumos</h1>
        <button className="btn btn-info">
          <i className="bi bi-plus-circle me-2"></i>Adicionar Novo Insumo
        </button>
      </header>

      <div className="card p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Buscar por nome ou código..."
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
              <option value="Todos">Status: Todos</option>
              <option value="OK">OK</option>
              <option value="Baixo">Baixo</option>
              <option value="Crítico">Crítico</option>
            </select>
          </div>
          <div className="col-md-3">
            <select 
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="Todos">Categoria: Todas</option>
              <option value="EPI">EPI</option>
              <option value="Consumíveis">Consumíveis</option>
              <option value="Medicamentos">Medicamentos</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card p-3">
        <div className="table-responsive">
          <table className="table table-borderless table-hover align-middle text-white">
            <thead>
              <tr>
                <th>Nome do Insumo</th>
                <th>Código</th>
                <th>Categoria</th>
                <th>Estoque Atual</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td><strong>{item.nome}</strong></td>
                  <td className="text-white-50">{item.codigo}</td>
                  <td className="text-white-50">{item.categoria}</td>
                  <td className="text-white-50">{item.estoque.atual} / {item.estoque.total}</td>
                  <td>
                    <span className={`badge ${statusBadges[item.status] || 'bg-secondary'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-light" title="Histórico">
                      <i className="bi bi-clock-history"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="mt-4 text-white-50 small text-center">
        © LabSync • DASA
      </footer>
    </>
  )
}

export default Insumos

