import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Carregar tokens do localStorage ao iniciar
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken')
    const storedRefreshToken = localStorage.getItem('refreshToken')
    const storedUser = localStorage.getItem('user')

    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken)
      setRefreshToken(storedRefreshToken)
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
    setLoading(false)
  }, [])

  // Monitorar mudanças no localStorage (logout automático quando tokens são removidos)
  useEffect(() => {
    const handleStorageChange = () => {
      const storedAccessToken = localStorage.getItem('accessToken')
      const storedRefreshToken = localStorage.getItem('refreshToken')
      
      // Só fazer logout se tínhamos tokens antes e agora não temos mais
      if (accessToken && refreshToken && (!storedAccessToken || !storedRefreshToken)) {
        console.log('Tokens removidos, fazendo logout...')
        setAccessToken(null)
        setRefreshToken(null)
        setUser(null)
      }
    }

    // Verificar a cada 2 segundos se os tokens ainda existem
    const interval = setInterval(handleStorageChange, 2000)
    
    return () => clearInterval(interval)
  }, [accessToken, refreshToken])

  // Função de login
  const login = async (userId, password) => {
    try {
      const response = await fetch('https://labsync-app-service-gxcsahdpexbcebey.brazilsouth-01.azurewebsites.net/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: Number(userId),
          password: password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Credenciais inválidas')
      }

      const data = await response.json()
      console.log('Login response:', data)

      // Extrair tokens do payload (corpo da resposta)
      const newAccessToken = data.accessToken || data.access_token || data.token
      const newRefreshToken = data.refreshToken || data.refresh_token || data.refresh

      if (!newAccessToken || !newRefreshToken) {
        console.error('Tokens não encontrados no payload:', data)
        throw new Error('Tokens não recebidos da API')
      }

      // Extrair dados do usuário
      const userData = data.user || { 
        id: Number(userId), 
        name: data.name || data.userName || 'Usuário' 
      }

      // Armazenar tokens
      localStorage.setItem('accessToken', newAccessToken)
      localStorage.setItem('refreshToken', newRefreshToken)
      localStorage.setItem('user', JSON.stringify(userData))

      setAccessToken(newAccessToken)
      setRefreshToken(newRefreshToken)
      setUser(userData)

      return { success: true }
    } catch (error) {
      console.error('Erro no login:', error)
      return { success: false, error: error.message }
    }
  }

  // Função de logout
  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setAccessToken(null)
    setRefreshToken(null)
    setUser(null)
  }

  // Função para renovar token
  const renewToken = async () => {
    if (!refreshToken) return false

    try {
      const response = await fetch('https://labsync-app-service-gxcsahdpexbcebey.brazilsouth-01.azurewebsites.net/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao renovar token')
      }

      const data = await response.json()
      console.log('Token refresh response:', data)
      
      // Extrair novo access token do payload
      const newAccessToken = data.accessToken || data.access_token || data.token

      if (!newAccessToken) {
        console.error('Novo access token não encontrado no payload:', data)
        throw new Error('Token não recebido')
      }

      localStorage.setItem('accessToken', newAccessToken)
      setAccessToken(newAccessToken)

      return true
    } catch (error) {
      console.error('Erro ao renovar token:', error)
      logout()
      return false
    }
  }

  const value = {
    user,
    accessToken,
    refreshToken,
    loading,
    login,
    logout,
    renewToken,
    isAuthenticated: !!accessToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

