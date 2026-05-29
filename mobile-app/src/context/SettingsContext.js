import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [language, setLanguage] = useState('English');
  const [simpleMode, setSimpleMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on startup
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('language');
        const storedSimpleMode = await AsyncStorage.getItem('simpleMode');

        if (storedLanguage) {
          setLanguage(storedLanguage);
        }
        if (storedSimpleMode !== null) {
          setSimpleMode(JSON.parse(storedSimpleMode));
        }
      } catch (error) {
        console.error('Failed to load settings from AsyncStorage', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const changeLanguage = async (newLanguage) => {
    try {
      setLanguage(newLanguage);
      await AsyncStorage.setItem('language', newLanguage);
    } catch (error) {
      console.error('Failed to save language to AsyncStorage', error);
    }
  };

  const toggleSimpleMode = async () => {
    try {
      const newMode = !simpleMode;
      setSimpleMode(newMode);
      await AsyncStorage.setItem('simpleMode', JSON.stringify(newMode));
    } catch (error) {
      console.error('Failed to save simpleMode to AsyncStorage', error);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        language,
        simpleMode,
        isLoading,
        changeLanguage,
        toggleSimpleMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
