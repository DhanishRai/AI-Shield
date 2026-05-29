import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { useSettings } from '../context/SettingsContext';

import LanguageSelector from '../components/LanguageSelector';
import { translations } from '../data/translations';

import { ShieldAlert } from 'lucide-react-native';
import SettingToggle from '../components/SettingToggle';

const SettingsScreen = () => {
  const { language, simpleMode, toggleSimpleMode } = useSettings();
  const t = translations[language] || translations['English'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.globalSettings}</Text>

      <SettingToggle 
        label={t.simpleModeLabel || 'Simple Safety Mode'} 
        description={t.simpleModeDesc || 'Bigger text, simpler words, stronger warnings for elderly & beginners.'}
        icon={ShieldAlert}
      />

      <View style={styles.settingRow}>
        <Text style={styles.settingText}>{t.languageLabel || 'Language'}</Text>
        <LanguageSelector />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {simpleMode 
            ? (t.simpleModeOnInfo || 'Simple mode is ON. Interface is simplified for safety.') 
            : (t.simpleModeOffInfo || 'Simple mode is OFF. Full interface is active.')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingText: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  infoContainer: {
    marginTop: 40,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
  },
});

export default SettingsScreen;
