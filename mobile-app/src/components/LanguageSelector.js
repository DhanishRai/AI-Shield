import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Globe, ChevronDown, Check } from 'lucide-react-native';
import { useSettings } from '../context/SettingsContext';

const LanguageSelector = () => {
  const { language, changeLanguage } = useSettings();
  const [modalVisible, setModalVisible] = useState(false);

  const languages = ['English', 'Hindi', 'Kannada'];

  const handleSelect = (lang) => {
    changeLanguage(lang);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity 
        style={styles.selectorButton} 
        onPress={() => setModalVisible(true)}
      >
        <Globe color="#0066FF" size={20} />
        <Text style={styles.selectorText}>{language}</Text>
        <ChevronDown color="#64748B" size={16} />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.dropdownMenu}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={styles.menuItem}
                onPress={() => handleSelect(lang)}
              >
                <Text style={[
                  styles.menuItemText,
                  language === lang && styles.activeMenuItemText
                ]}>
                  {lang}
                </Text>
                {language === lang && <Check color="#0066FF" size={18} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectorText: {
    marginHorizontal: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    width: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  menuItemText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  },
  activeMenuItemText: {
    color: '#0066FF',
    fontWeight: '700',
  },
});

export default LanguageSelector;
