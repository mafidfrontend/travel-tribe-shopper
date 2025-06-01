
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatar?: string;
  createdAt: string;
}

const API_BASE_URL = 'https://nt-shopping-list.onrender.com/api';

export const useProfile = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && token) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [user, token]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      console.log('Profil ma\'lumotlarini olish...');
      
      const response = await fetch(`${API_BASE_URL}/auth/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Profil ma\'lumotlarini olishda xatolik');
      }

      const userData = await response.json();
      console.log('Profil ma\'lumotlari olindi:', userData);
      
      setProfile({
        id: userData._id || userData.id,
        name: userData.name,
        username: userData.username,
        email: userData.email,
        avatar: userData.avatar,
        createdAt: userData.createdAt
      });
      setError(null);
    } catch (err) {
      console.error('Profil olishda xatolik:', err);
      setError(err instanceof Error ? err.message : 'Noma\'lum xatolik');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      console.log('Profil yangilanmoqda:', updates);
      
      const response = await fetch(`${API_BASE_URL}/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Profil yangilashda xatolik');
      }

      const updatedData = await response.json();
      console.log('Profil yangilandi:', updatedData);
      
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (err) {
      console.error('Profil yangilashda xatolik:', err);
      setError(err instanceof Error ? err.message : 'Noma\'lum xatolik');
      return false;
    }
  };

  return {
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
    updateProfile
  };
};
