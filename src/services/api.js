// Configuração base da API
// const API_BASE_URL = 'https://labsync-app-service-gxcsahdpexbcebey.brazilsouth-01.azurewebsites.net/api';
const API_BASE_URL = 'http://localhost:8080/api'
// Função para obter o token de acesso
function getAccessToken() {
  return localStorage.getItem('accessToken');
}

// Função para obter o token de refresh
function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

// Função auxiliar para fazer requisições
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const accessToken = getAccessToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
      ...options.headers,
    },
    ...options,
  };

  // Log para debug - verificar se token está sendo enviado
  console.log(`[API] ${options.method || 'GET'} ${endpoint}`, {
    hasToken: !!accessToken,
    tokenPreview: accessToken ? `${accessToken.substring(0, 20)}...` : 'sem token'
  });

  try {
    const response = await fetch(url, config);
    
    // Se receber 401 (Unauthorized), tentar renovar o token
    if (response.status === 401) {
      const renewed = await renewAccessToken();
      if (renewed) {
        // Tentar novamente com o novo token
        const newAccessToken = getAccessToken();
        config.headers['Authorization'] = `Bearer ${newAccessToken}`;
        const retryResponse = await fetch(url, config);
        
        if (!retryResponse.ok) {
          throw new Error(`HTTP error! status: ${retryResponse.status}`);
        }
        
        const data = await retryResponse.json();
        return { success: true, data };
      } else {
        // Se não conseguir renovar, apenas limpar tokens
        // O AuthContext vai detectar e redirecionar automaticamente
        localStorage.clear();
        return { 
          success: false, 
          error: 'Sessão expirada. Faça login novamente.',
          unauthorized: true 
        };
      }
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: error.message };
  }
}

// Função para renovar o token de acesso
async function renewAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    console.log('API Token refresh response:', data);
    
    // Extrair novo access token do payload
    const newAccessToken = data.accessToken || data.access_token || data.token;

    if (newAccessToken) {
      localStorage.setItem('accessToken', newAccessToken);
      return true;
    }

    console.error('Novo access token não encontrado no payload:', data);
    return false;
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    return false;
  }
}

// ==================== LOGS ====================
export const logsAPI = {
  // Buscar todos os logs
  getAll: () => fetchAPI('/logs'),
  
  // Buscar log por ID
  getById: (id) => fetchAPI(`/logs/${id}`),
  
  // Criar novo log
  create: (logData) => fetchAPI('/logs', {
    method: 'POST',
    body: JSON.stringify(logData),
  }),
  
  // Atualizar log
  update: (id, logData) => fetchAPI(`/logs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(logData),
  }),
  
  // Deletar log
  delete: (id) => fetchAPI(`/logs/${id}`, {
    method: 'DELETE',
  }),
};

// ==================== USUÁRIOS ====================
export const usersAPI = {
  // Buscar todos os usuários
  getAll: () => fetchAPI('/users'),
  
  // Buscar usuário por ID
  getById: (id) => fetchAPI(`/users/${id}`),
  
  // Criar novo usuário
  create: (userData) => fetchAPI('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // Atualizar usuário
  update: (id, userData) => fetchAPI(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  
  // Deletar usuário
  delete: (id) => fetchAPI(`/users/${id}`, {
    method: 'DELETE',
  }),
};

export default {
  logs: logsAPI,
  users: usersAPI,
};

