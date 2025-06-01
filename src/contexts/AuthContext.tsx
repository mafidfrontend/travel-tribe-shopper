
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

const API_BASE_URL = 'https://nt-shopping-list.onrender.com/api';

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
      console.log('Foydalanuvchi ma\'lumotlarini olish:', authToken);
      const response = await fetch(`${API_BASE_URL}/auth/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Auth javob status:', response.status);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('Foydalanuvchi ma\'lumotlari olindi:', userData);
        setUser({
          id: userData._id || userData.id,
          name: userData.name,
          username: userData.username
        });
      } else {
        console.error('Autentifikatsiya muvaffaqiyatsiz, token o\'chirildi');
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch (error) {
      console.error('Foydalanuvchi ma\'lumotlarini olishda xatolik:', error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    console.log('Login urinishi:', username);
    const response = await fetch(`${API_BASE_URL}/auth/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    console.log('Login javob status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Login muvaffaqiyatsiz:', errorData);
      throw new Error('Login muvaffaqiyatsiz');
    }

    const data = await response.json();
    console.log('Login javob ma\'lumotlari:', data);
    const authToken = data.token;
    
    localStorage.setItem('token', authToken);
    setToken(authToken);
    
    // Agar login javobida foydalanuvchi ma'lumotlari bo'lsa, to'g'ridan-to'g'ri o'rnatamiz
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
    console.log('Ro\'yxatdan o\'tish urinishi:', username);
    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, username, password }),
    });

    console.log('Ro\'yxatdan o\'tish javob status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Ro\'yxatdan o\'tish muvaffaqiyatsiz:', errorData);
      throw new Error('Ro\'yxatdan o\'tish muvaffaqiyatsiz');
    }

    const data = await response.json();
    console.log('Ro\'yxatdan o\'tish javob ma\'lumotlari:', data);
    const authToken = data.token;
    
    localStorage.setItem('token', authToken);
    setToken(authToken);
    
    // Agar ro'yxatdan o'tish javobida foydalanuvchi ma'lumotlari bo'lsa, to'g'ridan-to'g'ri o'rnatamiz
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
    console.log('Foydalanuvchi chiqish');
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
