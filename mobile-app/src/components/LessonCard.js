import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { 
  MessageSquare, 
  QrCode, 
  Key, 
  Headphones, 
  Link, 
  Lock, 
  UserCheck, 
  ShieldCheck,
  AlertTriangle,
  Info,
  Star
} from 'lucide-react-native';
import { useSettings } from '../context/SettingsContext';

const IconMap = {
  MessageSquare,
  QrCode,
  Key,
  Headphones,
  Link,
  Lock,
  UserCheck,
  ShieldCheck,
};

const LessonCard = ({ lesson, t }) => {
  const { simpleMode } = useSettings();
  const IconComponent = IconMap[lesson.icon] || ShieldCheck;

  // Default to English strings if t is not provided for some reason
  const problemTitle = t ? t.problem : 'The Problem';
  const truthTitle = t ? t.truth : 'The Truth';
  const ruleTitle = t ? t.rule : 'Golden Rule';
  const takesTimeStr = t ? t.takes30Sec : 'Takes 30 seconds to learn';

  const problemText = simpleMode && lesson.simpleProblem ? lesson.simpleProblem : lesson.problem;
  const truthText = simpleMode && lesson.simpleTruth ? lesson.simpleTruth : lesson.truth;
  const ruleText = simpleMode && lesson.simpleRule ? lesson.simpleRule : lesson.rule;

  return (
    <View style={[styles.cardContainer, simpleMode && styles.cardContainerSimple]}>
      <ScrollView
        style={styles.scrollView}
        scrollEnabled
        nestedScrollEnabled
        overScrollMode="always"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, simpleMode && { width: 60, height: 60, borderRadius: 30 }]}>
            <IconComponent color="#0066FF" size={simpleMode ? 36 : 28} />
          </View>
          <Text style={[styles.title, simpleMode && styles.titleSimple]}>{lesson.title}</Text>
        </View>

        <Text style={[styles.introText, simpleMode && styles.introTextSimple]}>{takesTimeStr}</Text>

        <View style={[styles.section, simpleMode && styles.sectionSimple]}>
          <View style={styles.sectionHeader}>
            <AlertTriangle color="#FF3B30" size={simpleMode ? 24 : 18} />
            <Text style={[styles.sectionTitle, { color: '#FF3B30' }, simpleMode && styles.sectionTitleSimple]}>{problemTitle}</Text>
          </View>
          <Text style={[styles.sectionBody, simpleMode && styles.sectionBodySimple]}>{problemText}</Text>
        </View>

        <View style={[styles.section, simpleMode && styles.sectionSimple]}>
          <View style={styles.sectionHeader}>
            <Info color="#007AFF" size={simpleMode ? 24 : 18} />
            <Text style={[styles.sectionTitle, { color: '#007AFF' }, simpleMode && styles.sectionTitleSimple]}>{truthTitle}</Text>
          </View>
          <Text style={[styles.sectionBody, simpleMode && styles.sectionBodySimple]}>{truthText}</Text>
        </View>

        <View style={[styles.section, styles.ruleSection, simpleMode && styles.ruleSectionSimple]}>
          <View style={styles.sectionHeader}>
            <Star color="#FF9500" size={simpleMode ? 24 : 18} fill="#FF9500" />
            <Text style={[styles.sectionTitle, { color: '#FF9500' }, simpleMode && styles.sectionTitleSimple]}>{ruleTitle}</Text>
          </View>
          <Text style={[styles.ruleBody, simpleMode && styles.ruleBodySimple]}>{ruleText}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  introText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 20,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 12,
  },
  ruleSection: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  sectionBody: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
  },
  ruleBody: {
    fontSize: 15,
    color: '#92400E',
    fontWeight: '600',
    lineHeight: 22,
  },
  cardContainerSimple: {
    borderWidth: 2,
    borderColor: '#0066FF',
  },
  titleSimple: {
    fontSize: 24,
  },
  introTextSimple: {
    fontSize: 16,
    color: '#1E293B',
  },
  sectionSimple: {
    padding: 20,
    marginBottom: 25,
  },
  sectionTitleSimple: {
    fontSize: 20,
  },
  sectionBodySimple: {
    fontSize: 18,
    lineHeight: 26,
    color: '#000',
    fontWeight: '500',
  },
  ruleSectionSimple: {
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  ruleBodySimple: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 26,
  },
});

export default LessonCard;
