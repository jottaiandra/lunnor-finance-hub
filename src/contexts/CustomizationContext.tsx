
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
        // Use rpc call instead of direct table query to avoid type checking issues
        const { data, error } = await supabase.rpc('get_customization_settings');

        if (error) {
          console.error('Error fetching customization settings:', error);
        }

        // If we have data, use it, otherwise use defaults
        if (data) {
          // Map database column names to our camelCase property names
          setSettings({
            platformName: data.platform_name || defaultSettings.platformName,
            primaryColor: data.primary_color || defaultSettings.primaryColor,
            secondaryColor: data.secondary_color || defaultSettings.secondaryColor,
            accentColor: data.accent_color || defaultSettings.accentColor,
            positiveColor: data.positive_color || defaultSettings.positiveColor,
            negativeColor: data.negative_color || defaultSettings.negativeColor,
            topGradient: data.top_gradient || defaultSettings.topGradient,
            bottomGradient: data.bottom_gradient || defaultSettings.bottomGradient
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
      
      // Convert camelCase to snake_case for database
      const dbSettings = {
        platform_name: updatedSettings.platformName,
        primary_color: updatedSettings.primaryColor,
        secondary_color: updatedSettings.secondaryColor,
        accent_color: updatedSettings.accentColor,
        positive_color: updatedSettings.positiveColor,
        negative_color: updatedSettings.negativeColor,
        top_gradient: updatedSettings.topGradient,
        bottom_gradient: updatedSettings.bottomGradient
      };
      
      // Update using stored procedure to avoid type errors
      const { error } = await supabase.rpc('update_customization_settings', dbSettings);

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
