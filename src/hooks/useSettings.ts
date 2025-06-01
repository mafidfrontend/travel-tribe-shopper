
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
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      
      // Apply theme immediately on load
      if (parsedSettings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Apply font immediately on load
      document.documentElement.style.fontFamily = parsedSettings.font === 'inter' ? 'Inter, sans-serif' : 
        parsedSettings.font === 'roboto' ? 'Roboto, sans-serif' : 'Montserrat, sans-serif';
    }
  }, []);

  const updateSetting = (key: keyof UserSettings, value: string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    
    // Apply theme changes immediately
    if (key === 'theme') {
      if (value === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    // Apply font changes immediately
    if (key === 'font') {
      document.documentElement.style.fontFamily = value === 'inter' ? 'Inter, sans-serif' : 
        value === 'roboto' ? 'Roboto, sans-serif' : 'Montserrat, sans-serif';
    }
  };

  const resetSettings = () => {
    const defaultSettings = {
      language: 'english',
      theme: 'light',
      font: 'inter'
    };
    setSettings(defaultSettings);
    localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
    
    // Apply default theme
    document.documentElement.classList.remove('dark');
    
    // Apply default font
    document.documentElement.style.fontFamily = 'Inter, sans-serif';
  };

  return { settings, updateSetting, resetSettings };
};
