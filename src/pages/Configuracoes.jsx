import { useState } from 'react'

function Configuracoes() {
  const [config, setConfig] = useState({
    // Notificações
    notifEstoqueBaixo: true,
    notifEstoqueCritico: true,
    notifEmail: true,
    limiteEstoqueBaixo: 40,
    limiteEstoqueCritico: 20,
    
    // Sistema
    idioma: 'pt-BR',
    fuso: 'America/Sao_Paulo',
    formatoData: 'DD/MM/YYYY',
    
    // Segurança
    sessaoTimeout: 30,
    autenticacao2FA: false,
    logAtividades: true
  })

  const handleChange = (campo, valor) => {
    setConfig(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  const handleSave = () => {
    console.log('Configurações salvas:', config)
    alert('Configurações salvas com sucesso!')
  }

  return (
    <>
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0 text-white">Configurações do Sistema</h1>
        <button className="btn btn-info" onClick={handleSave}>
          <i className="bi bi-save me-2"></i>Salvar Alterações
        </button>
      </header>

      <div className="row g-4">
        {/* Notificações */}
        <div className="col-12 col-lg-6">
          <div className="card p-4">
            <h5 className="mb-3 d-flex align-items-center">
              <i className="bi bi-bell-fill me-2"></i>
              Notificações
            </h5>
            
            <div className="mb-3">
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="notifEstoqueBaixo"
                  checked={config.notifEstoqueBaixo}
                  onChange={(e) => handleChange('notifEstoqueBaixo', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="notifEstoqueBaixo">
                  Alertas de Estoque Baixo
                </label>
              </div>

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="notifEstoqueCritico"
                  checked={config.notifEstoqueCritico}
                  onChange={(e) => handleChange('notifEstoqueCritico', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="notifEstoqueCritico">
                  Alertas de Estoque Crítico
                </label>
              </div>

              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="notifEmail"
                  checked={config.notifEmail}
                  onChange={(e) => handleChange('notifEmail', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="notifEmail">
                  Enviar Notificações por Email
                </label>
              </div>
            </div>

            <hr className="my-3" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

            <div className="mb-3">
              <label htmlFor="limiteEstoqueBaixo" className="form-label">
                Limite de Estoque Baixo (%)
              </label>
              <input
                type="number"
                className="form-control"
                id="limiteEstoqueBaixo"
                value={config.limiteEstoqueBaixo}
                onChange={(e) => handleChange('limiteEstoqueBaixo', parseInt(e.target.value))}
                min="0"
                max="100"
              />
            </div>

            <div className="mb-0">
              <label htmlFor="limiteEstoqueCritico" className="form-label">
                Limite de Estoque Crítico (%)
              </label>
              <input
                type="number"
                className="form-control"
                id="limiteEstoqueCritico"
                value={config.limiteEstoqueCritico}
                onChange={(e) => handleChange('limiteEstoqueCritico', parseInt(e.target.value))}
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>

        {/* Sistema */}
        <div className="col-12 col-lg-6">
          <div className="card p-4">
            <h5 className="mb-3 d-flex align-items-center">
              <i className="bi bi-gear-fill me-2"></i>
              Configurações do Sistema
            </h5>
            
            <div className="mb-3">
              <label htmlFor="idioma" className="form-label">Idioma</label>
              <select
                className="form-select"
                id="idioma"
                value={config.idioma}
                onChange={(e) => handleChange('idioma', e.target.value)}
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="fuso" className="form-label">Fuso Horário</label>
              <select
                className="form-select"
                id="fuso"
                value={config.fuso}
                onChange={(e) => handleChange('fuso', e.target.value)}
              >
                <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                <option value="America/Manaus">Manaus (GMT-4)</option>
                <option value="America/Noronha">Fernando de Noronha (GMT-2)</option>
              </select>
            </div>

            <div className="mb-0">
              <label htmlFor="formatoData" className="form-label">Formato de Data</label>
              <select
                className="form-select"
                id="formatoData"
                value={config.formatoData}
                onChange={(e) => handleChange('formatoData', e.target.value)}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Segurança */}
        <div className="col-12 col-lg-6">
          <div className="card p-4">
            <h5 className="mb-3 d-flex align-items-center">
              <i className="bi bi-shield-lock-fill me-2"></i>
              Segurança
            </h5>
            
            <div className="mb-3">
              <label htmlFor="sessaoTimeout" className="form-label">
                Tempo Limite de Sessão (minutos)
              </label>
              <input
                type="number"
                className="form-control"
                id="sessaoTimeout"
                value={config.sessaoTimeout}
                onChange={(e) => handleChange('sessaoTimeout', parseInt(e.target.value))}
                min="5"
                max="120"
              />
              <small className="text-white-50">
                Sessão expira após {config.sessaoTimeout} minutos de inatividade
              </small>
            </div>

            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="autenticacao2FA"
                checked={config.autenticacao2FA}
                onChange={(e) => handleChange('autenticacao2FA', e.target.checked)}
              />
              <label className="form-check-label" htmlFor="autenticacao2FA">
                Autenticação de Dois Fatores (2FA)
              </label>
            </div>

            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="logAtividades"
                checked={config.logAtividades}
                onChange={(e) => handleChange('logAtividades', e.target.checked)}
              />
              <label className="form-check-label" htmlFor="logAtividades">
                Registrar Log de Atividades
              </label>
            </div>
          </div>
        </div>

        {/* Informações do Sistema */}
        <div className="col-12">
          <div className="card p-4">
            <h5 className="mb-3 d-flex align-items-center">
              <i className="bi bi-info-circle-fill me-2"></i>
              Informações do Sistema
            </h5>
            
            <div className="row">
              <div className="col-md-3 mb-3">
                <small className="text-white-50">Versão</small>
                <div className="fw-bold">v1.0.0</div>
              </div>
              <div className="col-md-3 mb-3">
                <small className="text-white-50">Última Atualização</small>
                <div className="fw-bold">06/11/2025</div>
              </div>
              <div className="col-md-3 mb-3">
                <small className="text-white-50">Banco de Dados</small>
                <div className="fw-bold">MySQL 8.0</div>
              </div>
              <div className="col-md-3 mb-3">
                <small className="text-white-50">Licença</small>
                <div className="fw-bold">Ativa</div>
              </div>
            </div>

            <hr className="my-3" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

            <div className="d-flex gap-2">
              <button className="btn btn-outline-light btn-sm">
                <i className="bi bi-question-circle me-2"></i>Central de Ajuda
              </button>
              <button className="btn btn-outline-light btn-sm">
                <i className="bi bi-file-text me-2"></i>Documentação
              </button>
              <button className="btn btn-outline-light btn-sm">
                <i className="bi bi-chat-dots me-2"></i>Suporte Técnico
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-4 text-white-50 small text-center">
        © LabSync • DASA
      </footer>
    </>
  )
}

export default Configuracoes


