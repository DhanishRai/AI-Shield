import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, BookOpen } from 'lucide-react-native';
import { translations } from '../data/translations';
import { lessons as baseLessons } from '../data/lessons';
import LessonCarousel from '../components/LessonCarousel';
import LanguageSelector from '../components/LanguageSelector';
import SettingToggle from '../components/SettingToggle';
import { useSettings } from '../context/SettingsContext';

const LearnScreen = ({ route, navigation }) => {
  const { language } = useSettings();
  const t = translations[language] || translations['English'];
  const rawInitialIndex = route.params?.initialLessonIndex || 0;
  
  const lessons = useMemo(() => {
    const translatedLessons = t.lessons || [];
    return baseLessons.map((lesson, index) => ({
      ...lesson,
      ...(translatedLessons[index] || {}),
      id: lesson.id,
      icon: lesson.icon,
    }));
  }, [t.lessons]);
  const initialIndex = Math.max(0, Math.min(rawInitialIndex, lessons.length - 1));
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const progressLabel = lessons.length > 0 ? `${currentIndex + 1}/${lessons.length}` : '0/0';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft color="#1E293B" size={24} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <BookOpen color="#0066FF" size={20} style={{ marginRight: 8 }} />
          <Text style={styles.headerTitle}>{t.learnSafety}</Text>
        </View>
        <LanguageSelector />
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 15 }}>
        <SettingToggle 
          label="Simple Mode" 
          description="Bigger text, simpler words."
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>{t.microLessons} ({progressLabel})</Text>
        <Text style={styles.description}>
          {t.swipeToLearn}
        </Text>

        <View style={styles.listContainer}>
          <LessonCarousel 
            lessons={lessons}
            t={t} 
            onIndexChange={setCurrentIndex}
            initialIndex={initialIndex}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 5,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  content: {
    flex: 1,
    paddingTop: 30,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0066FF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  listContainer: {
    flex: 1, // Adjusted to fit the LessonCard dynamically
  },
});

export default LearnScreen;
