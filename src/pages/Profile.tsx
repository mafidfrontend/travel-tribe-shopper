
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Globe, Palette, Type, Save, Edit2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/hooks/useSettings';
import { useProfile } from '@/hooks/useProfile';
import { toast } from '@/hooks/use-toast';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { settings, updateSetting, resetSettings } = useSettings();
  const { profile, isLoading: profileLoading, updateProfile } = useProfile();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState(settings);

  // Track original settings when component mounts
  useEffect(() => {
    setOriginalSettings(settings);
  }, []);

  // Reset changes when navigating away
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasChanges) {
        // Reset to original settings
        Object.keys(originalSettings).forEach(key => {
          updateSetting(key as keyof typeof originalSettings, originalSettings[key as keyof typeof originalSettings]);
        });
      }
    };

    // Listen for route changes (when navigating away)
    return () => {
      if (hasChanges) {
        handleBeforeUnload();
      }
    };
  }, [hasChanges, originalSettings, updateSetting]);

  const languages = [
    { value: 'english', label: 'English' },
    { value: 'russian', label: 'Русский' },
    { value: 'uzbek', label: 'O\'zbek' }
  ];

  const fonts = [
    { value: 'inter', label: 'Inter' },
    { value: 'roboto', label: 'Roboto' },
    { value: 'montserrat', label: 'Montserrat' }
  ];

  const handleSettingChange = (key: string, value: string | boolean) => {
    if (typeof value === 'boolean') {
      updateSetting(key as any, value ? 'dark' : 'light');
    } else {
      updateSetting(key as any, value);
    }
    setHasChanges(true);
  };

  const handleUsernameEdit = () => {
    setIsEditingUsername(true);
    setNewUsername(profile?.username || user?.username || '');
  };

  const handleUsernameSave = async () => {
    if (newUsername.trim() && newUsername !== profile?.username) {
      const success = await updateProfile({ username: newUsername });
      if (success) {
        toast({
          title: "Foydalanuvchi nomi yangilandi",
          description: `Foydalanuvchi nomi ${newUsername}ga o'zgartirildi`,
        });
      } else {
        toast({
          title: "Xatolik",
          description: "Foydalanuvchi nomini yangilashda xatolik yuz berdi",
          variant: "destructive",
        });
      }
    }
    setIsEditingUsername(false);
  };

  const handleUsernameCancel = () => {
    setNewUsername(profile?.username || user?.username || '');
    setIsEditingUsername(false);
  };

  const handleSave = () => {
    setOriginalSettings(settings);
    setHasChanges(false);
    toast({
      title: "Sozlamalar saqlandi",
      description: "Sizning afzalliklaringiz muvaffaqiyatli yangilandi.",
    });
  };

  const handleDiscardChanges = () => {
    // Reset to original settings
    Object.keys(originalSettings).forEach(key => {
      updateSetting(key as keyof typeof originalSettings, originalSettings[key as keyof typeof originalSettings]);
    });
    setHasChanges(false);
    toast({
      title: "O'zgarishlar bekor qilindi",
      description: "Barcha o'zgarishlar asl holatiga qaytarildi.",
    });
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg">Profil yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{profile?.name || user?.name}</h1>
          <p className="text-lg text-muted-foreground">@{profile?.username || user?.username}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Settings */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Til</span>
            </CardTitle>
            <CardDescription>
              Ilova uchun kerakli tilni tanlang
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={settings.language}
              onValueChange={(value) => handleSettingChange('language', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tilni tanlang" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="w-5 h-5" />
              <span>Ko'rinish</span>
            </CardTitle>
            <CardDescription>
              Ilovaning ko'rinishini sozlang
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="text-sm font-medium">
                Qorong'u rejim
              </Label>
              <Switch
                id="dark-mode"
                checked={settings.theme === 'dark'}
                onCheckedChange={(checked) => 
                  handleSettingChange('theme', checked)
                }
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {settings.theme === 'dark' ? 'Qorong\'u rejim yoqilgan' : 'Yorug\' rejim yoqilgan'}
            </div>
          </CardContent>
        </Card>

        {/* Font Settings */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Type className="w-5 h-5" />
              <span>Shrift</span>
            </CardTitle>
            <CardDescription>
              Kerakli shrift turini tanlang
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={settings.font}
              onValueChange={(value) => handleSettingChange('font', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Shriftni tanlang" />
              </SelectTrigger>
              <SelectContent>
                {fonts.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.label }}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Hisob ma'lumotlari</CardTitle>
            <CardDescription>
              Sizning hisob tafsilotlaringiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">To'liq ism</Label>
              <p className="text-lg font-medium">{profile?.name || user?.name}</p>
            </div>
            <Separator />
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Foydalanuvchi nomi</Label>
              {isEditingUsername ? (
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="flex-1"
                    placeholder="Foydalanuvchi nomini kiriting"
                  />
                  <Button size="sm" onClick={handleUsernameSave}>
                    Saqlash
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleUsernameCancel}>
                    Bekor qilish
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-1">
                  <p className="text-lg font-medium">@{profile?.username || user?.username}</p>
                  <Button size="sm" variant="outline" onClick={handleUsernameEdit}>
                    <Edit2 className="w-3 h-3 mr-1" />
                    Tahrirlash
                  </Button>
                </div>
              )}
            </div>
            {profile?.createdAt && (
              <>
                <Separator />
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Ro'yxatdan o'tgan sana</Label>
                  <p className="text-sm">{new Date(profile.createdAt).toLocaleDateString('uz-UZ')}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 flex space-x-3">
          <Button
            onClick={handleDiscardChanges}
            size="lg"
            variant="outline"
            className="shadow-lg"
          >
            Bekor qilish
          </Button>
          <Button
            onClick={handleSave}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
          >
            <Save className="w-4 h-4 mr-2" />
            Saqlash
          </Button>
        </div>
      )}
    </div>
  );
};

export default Profile;
