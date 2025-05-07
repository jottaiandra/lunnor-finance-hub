
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CustomizationSettings {
  platformName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  positiveColor: string;
  negativeColor: string;
  topGradient: string;
  bottomGradient: string;
}

interface CustomizationContextType {
  settings: CustomizationSettings;
  updateSettings: (newSettings: Partial<CustomizationSettings>) => Promise<void>;
  isLoading: boolean;
}

const defaultSettings: CustomizationSettings = {
  platformName: 'Lunnor Caixa',
  primaryColor: '#7367F0',
  secondaryColor: '#28C76F',
  accentColor: '#EA5455',
  positiveColor: '#28C76F',
  negativeColor: '#EA5455',
  topGradient: 'linear-gradient(to right, rgba(115, 103, 240, 0.2), rgba(115, 103, 240, 0.05))',
  bottomGradient: 'linear-gradient(to right, rgba(115, 103, 240, 0.1), rgba(115, 103, 240, 0.02))'
};

const CustomizationContext = createContext<CustomizationContextType>({
  settings: defaultSettings,
  updateSettings: async () => {},
  isLoading: true
});

export const useCustomization = () => useContext(CustomizationContext);

export const CustomizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CustomizationSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from database on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('customization_settings')
          .select('*')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching customization settings:', error);
        }

        // If we have data, use it, otherwise use defaults
        if (data) {
          setSettings({
            ...defaultSettings,
            ...data
          });
        }
      } catch (err) {
        console.error('Failed to fetch customization settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Apply CSS variables whenever settings change
  useEffect(() => {
    const root = document.documentElement;
    
    // Convert hex to hsl for primary color (simplified approach)
    const applyColorToRoot = (colorName: string, hexValue: string) => {
      root.style.setProperty(`--${colorName}`, hexValue);
    };

    applyColorToRoot('primary', settings.primaryColor);
    applyColorToRoot('positive', settings.positiveColor);
    applyColorToRoot('negative', settings.negativeColor);
    
    // Apply gradients
    root.style.setProperty('--top-gradient', settings.topGradient);
    root.style.setProperty('--bottom-gradient', settings.bottomGradient);
    
  }, [settings]);

  const updateSettings = async (newSettings: Partial<CustomizationSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      const { error } = await supabase
        .from('customization_settings')
        .upsert({ 
          id: 1, // Single row for settings
          ...updatedSettings
        });

      if (error) throw error;
      
      setSettings(updatedSettings);
      return;
    } catch (err) {
      console.error('Failed to update customization settings:', err);
      throw err;
    }
  };

  return (
    <CustomizationContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </CustomizationContext.Provider>
  );
};
