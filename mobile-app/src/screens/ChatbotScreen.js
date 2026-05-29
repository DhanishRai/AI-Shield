import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Tts from 'react-native-tts';
import { SendHorizontal } from 'lucide-react-native';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import ChatBubble from '../components/ChatBubble';
import SuggestedQuestions from '../components/SuggestedQuestions';
import TypingIndicator from '../components/TypingIndicator';
import { getBotReply, getLessonIndexByKey } from '../services/chatEngine';
import { useSettings } from '../context/SettingsContext';

const QUICK_QUESTIONS = [
  'Can I share OTP?',
  'Is this QR safe?',
  'KYC update scam?',
  'Can bank ask PIN?',
];

const SCAM_VOICE_WARNING = 'Warning. This may be a fraud attempt.';

const ChatbotScreen = ({ navigation }) => {
  const { simpleMode } = useSettings();
  const listRef = useRef(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'bot-welcome',
      sender: 'bot',
      text: simpleMode
        ? 'Ask me before payment. I help with OTP, QR, KYC, PIN scams.'
        : 'Ask Before You Pay. I answer only digital payment fraud safety questions for first-time users.',
      severity: 'tip',
      lessonKey: 'merchant',
      learnLabel: 'Learn Payment Safety',
    },
  ]);

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  const scrollToEnd = () => {
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollToEnd({ animated: true });
      }
    }, 80);
  };

  const speakMessage = (message) => {
    const hasTts =
      !!Tts &&
      typeof Tts.speak === 'function' &&
      typeof Tts.stop === 'function' &&
      typeof Tts.getInitStatus === 'function';

    if (!hasTts) return;

    Tts.getInitStatus()
      .then(() => {
        Tts.stop();
        if (message.severity === 'high' || message.severity === 'medium') {
          Tts.speak(SCAM_VOICE_WARNING);
        } else {
          Tts.speak(message.text);
        }
      })
      .catch(() => {});
  };

  const sendMessage = (rawText) => {
    const trimmed = String(rawText || '').trim();
    if (!trimmed) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
    };

    setInput('');
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    scrollToEnd();

    setTimeout(() => {
      const reply = getBotReply(trimmed, { simpleMode });
      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply.text,
        severity: reply.severity,
        lessonKey: reply.lessonKey,
        learnLabel: reply.learnLabel,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
      scrollToEnd();
    }, 650);
  };

  const openRelatedLesson = (lessonKey) => {
    const lessonIndex = getLessonIndexByKey(lessonKey);
    navigation.navigate('Learn', { initialLessonIndex: lessonIndex });
  };

  return (
    <ScreenContainer useGradient={false}>
      <View style={styles.container}>
        <Header title="Ask Before You Pay" showBack onBack={() => navigation.goBack()} />

        <SuggestedQuestions suggestions={QUICK_QUESTIONS} onSelect={sendMessage} />

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble message={item} onSpeak={speakMessage} onLearnMore={openRelatedLesson} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToEnd}
        />

        {isTyping && <TypingIndicator />}

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask your payment safety doubt..."
              placeholderTextColor="#94A3B8"
              style={styles.input}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
              onPress={() => sendMessage(input)}
              disabled={!canSend}
              activeOpacity={0.85}
            >
              <SendHorizontal size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    color: '#0F172A',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    maxHeight: 96,
    fontSize: 14,
    fontWeight: '600',
  },
  sendBtn: {
    marginLeft: 8,
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0066FF',
  },
  sendBtnDisabled: {
    backgroundColor: '#93C5FD',
  },
});

export default ChatbotScreen;
