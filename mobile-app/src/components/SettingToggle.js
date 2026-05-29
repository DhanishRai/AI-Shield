import React from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { useSettings } from '../context/SettingsContext';

const SettingToggle = ({ label, description, icon: Icon }) => {
  const { simpleMode, toggleSimpleMode } = useSettings();

  return (
    <TouchableOpacity 
      style={[styles.container, simpleMode && styles.containerSimple]} 
      onPress={toggleSimpleMode}
      activeOpacity={0.8}
    >
      <View style={styles.leftContent}>
        {Icon && (
          <View style={[styles.iconBox, simpleMode && styles.iconBoxSimple]}>
            <Icon color="#0066FF" size={simpleMode ? 28 : 22} />
          </View>
        )}
        <View style={styles.textContent}>
          <Text style={[styles.label, simpleMode && styles.labelSimple]}>{label}</Text>
          {description && (
            <Text style={[styles.description, simpleMode && styles.descriptionSimple]}>
              {description}
            </Text>
          )}
        </View>
      </View>
      <Switch
        value={simpleMode}
        onValueChange={toggleSimpleMode}
        trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
        thumbColor={simpleMode ? '#2563EB' : '#F8FAFC'}
        style={simpleMode ? { transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] } : {}}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  containerSimple: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#93C5FD',
    backgroundColor: '#EFF6FF',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconBoxSimple: {
    width: 56,
    height: 56,
    borderRadius: 16,
    marginRight: 20,
  },
  textContent: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  labelSimple: {
    fontSize: 22,
    fontWeight: '900',
  },
  description: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  descriptionSimple: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 22,
    fontWeight: '500',
  },
});

export default SettingToggle;
