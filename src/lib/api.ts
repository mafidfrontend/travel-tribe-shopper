
const API_BASE_URL = 'https://nt-shopping-list.onrender.com/api';

interface ApiOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

const apiRequest = async (endpoint: string, options: ApiOptions = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method: options.method || 'GET',
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  if (options.body) {
    config.body = options.body;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
};

// Auth API
export const authApi = {
  login: (username: string, password: string) =>
    apiRequest('/auth/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
    
  register: (name: string, username: string, password: string) =>
    apiRequest('/users/', {
      method: 'POST',
      body: JSON.stringify({ name, username, password }),
    }),
    
  getCurrentUser: () => apiRequest('/auth/'),
};

// Users API
export const usersApi = {
  searchUser: (username: string) => apiRequest(`/users/search?username=${username}`),
  deleteUser: () => apiRequest('/users/', { method: 'DELETE' }),
};

// Groups API
export const groupsApi = {
  getMyGroups: () => apiRequest('/groups/'),
  createGroup: (name: string, password: string) =>
    apiRequest('/groups/', {
      method: 'POST',
      body: JSON.stringify({ name, password }),
    }),
  deleteGroup: (groupId: string) =>
    apiRequest(`/groups/${groupId}`, { method: 'DELETE' }),
  searchGroups: (query: string) => apiRequest(`/groups/search?q=${query}`),
  joinGroup: (groupId: string, password: string) =>
    apiRequest(`/groups/${groupId}/join`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
  leaveGroup: (groupId: string) =>
    apiRequest(`/groups/${groupId}/leave`, { method: 'POST' }),
  addMember: (groupId: string, memberId: string) =>
    apiRequest('/groups/members', {
      method: 'POST',
      body: JSON.stringify({ groupId, memberId }),
    }),
  removeMember: (groupId: string, memberId: string) =>
    apiRequest(`/groups/${groupId}/members/${memberId}`, { method: 'DELETE' }),
};
