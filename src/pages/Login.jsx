import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './Login.css'

function Login() {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(userId, password)

    if (!result.success) {
      setError(result.error || 'Erro ao fazer login. Verifique suas credenciais.')
    }

    setLoading(false)
  }

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-container">
              <img src="/img/logo-removebg-preview.png" alt="LabSync Logo" className="login-logo" />
            </div>
            <h1 className="login-title">LabSync</h1>
            <p className="login-subtitle">Sistema de Gestão Laboratorial</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="userId" className="form-label">
                <i className="bi bi-person-fill me-2"></i>
                ID do Usuário
              </label>
              <input
                type="number"
                className="form-control login-input"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Digite seu ID (numérico)"
                required
                autoFocus
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <i className="bi bi-lock-fill me-2"></i>
                Senha
              </label>
              <input
                type="password"
                className="form-control login-input"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-login w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Autenticando...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Entrar
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <small className="text-white-50">
              © 2025 LabSync • DASA
            </small>
          </div>
        </div>

        <div className="login-features">
          <div className="feature-item">
            <i className="bi bi-shield-check"></i>
            <span>Seguro</span>
          </div>
          <div className="feature-item">
            <i className="bi bi-speedometer2"></i>
            <span>Rápido</span>
          </div>
          <div className="feature-item">
            <i className="bi bi-graph-up"></i>
            <span>Eficiente</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

