import { useEffect, useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

const DASA_COLORS = {
  darkBlue: '#0D274D',
  redAccent: 'rgb(230, 146, 94)',
  lightBlueAccent: '#5AC3E5',
  success: '#0a0063ff',
  gray: '#c3fff2ff',
  warning: '#ffc107',
  danger: '#dc3545'
}

const API_URL = 'https://homol-labsync.ddns.net/api/logs'

function VisaoGeral() {
  const [ordersData, setOrdersData] = useState([])
  const [chartValues, setChartValues] = useState([420, 480, 530, 500, 610, 700, 740, 680, 720, 760, 800, 860])

  useEffect(() => {
    fetchAPIData()
  }, [])

  async function fetchAPIData() {
    try {
      const resp = await fetch(API_URL)
      if (!resp.ok) throw new Error(`Erro HTTP: ${resp.status}`)
      const data = await resp.json()
      
      const formattedOrders = data.slice(0, 5).map(item => ({
        id: item.id,
        user: item.user.name,
        items: item.item.length
      }))
      
      setOrdersData(formattedOrders)
    } catch (err) {
      console.error("Erro ao buscar API:", err)
      // Dados de fallback
      setOrdersData([
        { id: "PO-1001", user: "Ana Silva", items: 3 },
        { id: "PO-1002", user: "Bruno Costa", items: 5 },
        { id: "PO-1003", user: "Carla Mendes", items: 2 },
        { id: "PO-1004", user: "Daniel Oliveira", items: 4 },
        { id: "PO-1005", user: "Elisa Santos", items: 1 }
      ])
    }
  }

  const monthlyLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  
  const barChartData = {
    labels: monthlyLabels,
    datasets: [{
      label: 'Retiradas',
      data: chartValues,
      backgroundColor: chartValues.map((_, i) => 
        i >= chartValues.length - 2 ? DASA_COLORS.redAccent : DASA_COLORS.lightBlueAccent
      ),
      borderRadius: 6,
      barThickness: 20
    }]
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#fff' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#fff' },
        beginAtZero: true
      }
    }
  }

  const donutData = {
    labels: ['Consumíveis', 'Medicamentos', 'EPI', 'Manutenção'],
    datasets: [{
      data: [45, 25, 20, 10],
      backgroundColor: [
        DASA_COLORS.lightBlueAccent,
        DASA_COLORS.success,
        DASA_COLORS.redAccent,
        DASA_COLORS.gray
      ],
      hoverOffset: 8,
      borderWidth: 0
    }]
  }

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false }
    }
  }

  const activitiesData = [
    { text: 'Ana iniciou retirada #PO-1001', time: '2m' },
    { text: 'Estoque de Agulha Tipo 1 baixo', time: '12m' },
    { text: 'Bruno solicitou 1x Seringa 5ml', time: '1h' }
  ]

  const exportCSV = () => {
    let csv = 'Pedido,Usuário,Itens\n'
    ordersData.forEach(o => {
      csv += `${o.id},${o.user},${o.items}\n`
    })
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pedidos.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const refreshData = () => {
    const newValues = [...chartValues]
    newValues[newValues.length - 1] += Math.round(Math.random() * 40 - 10)
    setChartValues(newValues)
  }

  return (
    <>
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0 text-white">Dashboard</h1>
        <div className="dropdown">
          <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
            Ações
          </button>
          <ul className="dropdown-menu dropdown-menu-dark">
            <li><a className="dropdown-item" href="#" onClick={exportCSV}>Exportar CSV</a></li>
            <li><a className="dropdown-item" href="#" onClick={refreshData}>Atualizar Dados</a></li>
          </ul>
        </div>
      </header>

      <section className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stat-card h-100">
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-white-50">Valor em Estoque</small>
                <h3 className="mt-1 fw-bold">R$ 124.563</h3>
              </div>
              <div className="stat-icon bg-primary text-white">
                <i className="bi bi-currency-dollar"></i>
              </div>
            </div>
            <div className="mt-2 small text-success">
              +4.5% <span className="text-white-50">último mês</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stat-card h-100">
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-white-50">Itens Ativos</small>
                <h3 className="mt-1 fw-bold">8.549</h3>
              </div>
              <div className="stat-icon bg-info text-white">
                <i className="bi bi-box-seam-fill"></i>
              </div>
            </div>
            <div className="mt-2 small text-white-50">Disponíveis</div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stat-card h-100">
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-white-50">Retiradas Hoje</small>
                <h3 className="mt-1 fw-bold">2.847</h3>
              </div>
              <div className="stat-icon stat-icon--accent text-white">
                <i className="bi bi-basket3-fill"></i>
              </div>
            </div>
            <div className="mt-2 small text-white-50">em andamento</div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stat-card h-100">
            <div className="d-flex justify-content-between">
              <div>
                <small className="text-white-50">Acessos</small>
                <h3 className="mt-1 fw-bold">45.892</h3>
              </div>
              <div className="stat-icon bg-success text-white">
                <i className="bi bi-person-fill-check"></i>
              </div>
            </div>
            <div className="mt-2 small text-white-50">no mês</div>
          </div>
        </div>
      </section>

      <section className="row g-4 mb-4">
        <div className="col-12 col-lg-8">
          <div className="card p-3 h-100">
            <h5 className="mb-2">Visão de Retiradas</h5>
            <div className="chart-container" style={{ position: 'relative', height: '320px', width: '100%' }}>
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card p-3 h-100">
            <h5 className="mb-3">Distribuição por Categoria</h5>
            <div className="chart-container" style={{ position: 'relative', height: '260px', width: '100%' }}>
              <Doughnut data={donutData} options={donutOptions} />
            </div>
            <div className="mt-3 small d-flex flex-wrap gap-3 justify-content-center">
              {donutData.labels.map((label, i) => (
                <span key={label} className="legend-item d-flex align-items-center">
                  <span 
                    className="legend-item-swatch" 
                    style={{ backgroundColor: donutData.datasets[0].backgroundColor[i] }}
                  ></span>
                  {label} <small className="text-white ms-auto">{donutData.datasets[0].data[i]}%</small>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card p-3">
            <h5 className="mb-2">Últimas Solicitações</h5>
            <div className="table-responsive">
              <table className="table table-borderless table-hover align-middle text-white">
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Usuário</th>
                    <th>Itens</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersData.map(order => (
                    <tr key={order.id}>
                      <td><strong>{order.id}</strong></td>
                      <td>{order.user}</td>
                      <td>{order.items}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card p-3 h-100">
            <h5 className="mb-3">Atividade Recente</h5>
            <ul className="list-group list-group-flush activity-list">
              {activitiesData.map((activity, index) => (
                <li key={index} className="list-group-item bg-transparent text-white">
                  <div className="d-flex justify-content-between">
                    <div>{activity.text}</div>
                    <small className="text-white-50">{activity.time}</small>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="mt-4 text-white-50 small text-center">
        © LabSync • DASA
      </footer>
    </>
  )
}

export default VisaoGeral

