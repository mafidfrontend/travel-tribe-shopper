
import { useState, useEffect } from 'react';

interface UserSettings {
  language: string;
  theme: string;
  font: string;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings>({
    language: 'english',
    theme: 'light',
    font: 'inter'
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateSetting = (key: keyof UserSettings, value: string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    
    // Apply theme changes immediately
    if (key === 'theme') {
      document.documentElement.classList.toggle('dark', value === 'dark');
    }
    
    // Apply font changes immediately
    if (key === 'font') {
      document.documentElement.style.fontFamily = value === 'inter' ? 'Inter, sans-serif' : 
        value === 'roboto' ? 'Roboto, sans-serif' : 'Montserrat, sans-serif';
    }
  };

  return { settings, updateSetting };
};
