import { useState } from 'react'

function Insumos() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [categoryFilter, setCategoryFilter] = useState('Todos')
  const [showModal, setShowModal] = useState(false)
  const [novoInsumo, setNovoInsumo] = useState({
    nome: '',
    codigo: '',
    categoria: 'EPI',
    estoqueAtual: '',
    estoqueTotal: ''
  })

  const [insumosData, setInsumosData] = useState([
    { nome: 'Luva Nitrílica', codigo: 'Cód.003', categoria: 'EPI', estoque: { atual: 50, total: 100 }, status: 'OK' },
    { nome: 'Álcool 70%', codigo: 'Cód.005', categoria: 'Consumíveis', estoque: { atual: 15, total: 50 }, status: 'Baixo' },
    { nome: 'Seringa 5ml', codigo: 'Cód.006', categoria: 'Consumíveis', estoque: { atual: 5, total: 25 }, status: 'Crítico' },
    { nome: 'Máscara N95', codigo: 'Cód.007', categoria: 'EPI', estoque: { atual: 80, total: 100 }, status: 'OK' },
    { nome: 'Paracetamol 500mg', codigo: 'Cód.008', categoria: 'Medicamentos', estoque: { atual: 200, total: 500 }, status: 'OK' },
  ])

  const filteredData = insumosData.filter(item => {
    const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'Todos' || item.status === statusFilter
    const matchesCategory = categoryFilter === 'Todos' || item.categoria === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const statusBadges = {
    'OK': 'bg-success',
    'Baixo': 'bg-warning',
    'Crítico': 'bg-danger'
  }

  const calcularStatus = (atual, total) => {
    const percentual = (atual / total) * 100
    if (percentual <= 20) return 'Crítico'
    if (percentual <= 40) return 'Baixo'
    return 'OK'
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNovoInsumo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAdicionarInsumo = (e) => {
    e.preventDefault()
    
    const estoqueAtual = parseInt(novoInsumo.estoqueAtual)
    const estoqueTotal = parseInt(novoInsumo.estoqueTotal)
    
    const insumo = {
      nome: novoInsumo.nome,
      codigo: novoInsumo.codigo,
      categoria: novoInsumo.categoria,
      estoque: {
        atual: estoqueAtual,
        total: estoqueTotal
      },
      status: calcularStatus(estoqueAtual, estoqueTotal)
    }
    
    setInsumosData([...insumosData, insumo])
    
    // Limpar formulário e fechar modal
    setNovoInsumo({
      nome: '',
      codigo: '',
      categoria: 'EPI',
      estoqueAtual: '',
      estoqueTotal: ''
    })
    setShowModal(false)
  }

  return (
    <>
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0 text-white">Gerenciamento de Insumos</h1>
        <button className="btn btn-info" onClick={() => setShowModal(true)}>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Adicionar Novo Insumo */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ backgroundColor: 'var(--dasa-card-bg)', color: 'white' }}>
              <div className="modal-header border-bottom border-secondary">
                <h5 className="modal-title">Adicionar Novo Insumo</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAdicionarInsumo}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="nome" className="form-label">Nome do Insumo</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nome"
                      name="nome"
                      value={novoInsumo.nome}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="codigo" className="form-label">Código</label>
                    <input
                      type="text"
                      className="form-control"
                      id="codigo"
                      name="codigo"
                      value={novoInsumo.codigo}
                      onChange={handleInputChange}
                      placeholder="Ex: Cód.009"
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="categoria" className="form-label">Categoria</label>
                    <select
                      className="form-select"
                      id="categoria"
                      name="categoria"
                      value={novoInsumo.categoria}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="EPI">EPI</option>
                      <option value="Consumíveis">Consumíveis</option>
                      <option value="Medicamentos">Medicamentos</option>
                      <option value="Manutenção">Manutenção</option>
                    </select>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="estoqueAtual" className="form-label">Estoque Atual</label>
                      <input
                        type="number"
                        className="form-control"
                        id="estoqueAtual"
                        name="estoqueAtual"
                        value={novoInsumo.estoqueAtual}
                        onChange={handleInputChange}
                        min="0"
                        required
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="estoqueTotal" className="form-label">Estoque Total</label>
                      <input
                        type="number"
                        className="form-control"
                        id="estoqueTotal"
                        name="estoqueTotal"
                        value={novoInsumo.estoqueTotal}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                    </div>
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
                    <i className="bi bi-plus-circle me-2"></i>Adicionar Insumo
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

export default Insumos

