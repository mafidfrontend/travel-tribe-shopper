
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (name: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUserInfo(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserInfo = async (authToken: string) => {
    try {
      console.log('Fetching user info with token:', authToken);
      const response = await fetch('https://nt-shopping-list.onrender.com/api/auth/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Auth response status:', response.status);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('User data received:', userData);
        setUser({
          id: userData._id || userData.id,
          name: userData.name,
          username: userData.username
        });
      } else {
        console.error('Auth failed, removing token');
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    console.log('Attempting login for:', username);
    const response = await fetch('https://nt-shopping-list.onrender.com/api/auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    console.log('Login response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Login failed:', errorData);
      throw new Error('Login failed');
    }

    const data = await response.json();
    console.log('Login response data:', data);
    const authToken = data.token;
    
    localStorage.setItem('token', authToken);
    setToken(authToken);
    
    // Set user data directly from login response if available
    if (data.user) {
      setUser({
        id: data.user._id || data.user.id,
        name: data.user.name,
        username: data.user.username
      });
      setIsLoading(false);
    } else {
      await fetchUserInfo(authToken);
    }
  };

  const register = async (name: string, username: string, password: string) => {
    console.log('Attempting registration for:', username);
    const response = await fetch('https://nt-shopping-list.onrender.com/api/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, username, password }),
    });

    console.log('Registration response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Registration failed:', errorData);
      throw new Error('Registration failed');
    }

    const data = await response.json();
    console.log('Registration response data:', data);
    const authToken = data.token;
    
    localStorage.setItem('token', authToken);
    setToken(authToken);
    
    // Set user data directly from registration response
    if (data.user) {
      setUser({
        id: data.user._id || data.user.id,
        name: data.user.name,
        username: data.user.username
      });
      setIsLoading(false);
    } else {
      await fetchUserInfo(authToken);
    }
  };

  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
