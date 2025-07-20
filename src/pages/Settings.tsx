import React, { useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Palette, User, RotateCcw, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { showNotification } from '@/components/NotificationSystem';
import { toast } from '@/hooks/use-toast';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, updateUser } = useAuth();
  const [selectedTheme, setSelectedTheme] = useState('blue');

  const themeColors = [
    { name: 'blue', color: 'bg-blue-500', label: 'Ocean Blue' },
    { name: 'purple', color: 'bg-purple-500', label: 'Royal Purple' },
    { name: 'emerald', color: 'bg-emerald-500', label: 'Forest Green' },
    { name: 'orange', color: 'bg-orange-500', label: 'Sunset Orange' },
    { name: 'pink', color: 'bg-pink-500', label: 'Cherry Blossom' },
  ];

  const handleThemeToggle = () => {
    toggleTheme();
    showNotification({
      type: 'info',
      title: `${theme === 'light' ? 'Dark' : 'Light'} Mode Activated`,
      message: `Interface switched to ${theme === 'light' ? 'dark' : 'light'} theme`,
    });
  };

  const handleThemeColorChange = (themeName: string) => {
    setSelectedTheme(themeName);
    localStorage.setItem('studentconnect_theme_color', themeName);
    
    toast({
      title: "Theme updated! 🎨",
      description: `Switched to ${themeColors.find(t => t.name === themeName)?.label} theme.`,
    });
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please choose an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const avatarUrl = e.target?.result as string;
      updateUser({ avatar: avatarUrl });
      
      toast({
        title: "Avatar updated! 📸",
        description: "Your profile picture has been saved.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleResetSettings = () => {
    // Reset theme to light
    if (theme === 'dark') {
      toggleTheme();
    }
    
    // Reset theme color
    setSelectedTheme('blue');
    localStorage.setItem('studentconnect_theme_color', 'blue');
    
    // Reset avatar
    if (user?.avatar) {
      updateUser({ avatar: undefined });
    }
    
    showNotification({
      type: 'info',
      title: 'Settings Reset',
      message: 'All settings have been restored to defaults.',
    });
    
    toast({
      title: "Settings reset successfully! 🔄",
      description: "All preferences have been restored to default values.",
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Customize your StudentConnect experience
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <Card className="shadow-card border-0 animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {theme === 'light' ? <Sun className="h-5 w-5 text-primary" /> : <Moon className="h-5 w-5 text-primary" />}
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">Dark Mode</h4>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={handleThemeToggle}
              />
            </div>

            {/* Theme Colors */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Theme Color</h4>
              <div className="grid grid-cols-5 gap-3">
                {themeColors.map((themeColor) => (
                  <button
                    key={themeColor.name}
                    onClick={() => handleThemeColorChange(themeColor.name)}
                    className={`relative w-12 h-12 rounded-lg ${themeColor.color} hover-scale transition-all ${
                      selectedTheme === themeColor.name 
                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' 
                        : ''
                    }`}
                    title={themeColor.label}
                  >
                    {selectedTheme === themeColor.name && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card className="shadow-card border-0 animate-scale-in" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">Profile Picture</h4>
                <p className="text-sm text-muted-foreground">
                  Upload a custom avatar image (max 5MB)
                </p>
              </div>
              <div>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="shadow-card border-0 animate-scale-in" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-primary" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">Reset Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Restore all settings to their default values
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleResetSettings}
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="shadow-card border-0 animate-scale-in" style={{ animationDelay: '600ms' }}>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h4 className="font-semibold text-foreground">StudentConnect</h4>
              <p className="text-sm text-muted-foreground">
                Version 1.0.0 • Built by Yuktheshwar MP (Yukii)
              </p>
              <p className="text-xs text-muted-foreground">
                A modern student productivity dashboard
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};