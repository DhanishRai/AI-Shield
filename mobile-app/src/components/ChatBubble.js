import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Volume2 } from 'lucide-react-native';

const severityMeta = {
  high: { label: '⚠ High Risk', color: '#B91C1C' },
  medium: { label: '⚠ High Risk', color: '#B91C1C' },
  tip: { label: 'ℹ Safety Tip', color: '#0369A1' },
};

const ChatBubble = ({ message, onSpeak, onLearnMore }) => {
  const isBot = message.sender === 'bot';
  const severity = severityMeta[message.severity] || severityMeta.tip;

  return (
    <View style={[styles.row, isBot ? styles.rowBot : styles.rowUser]}>
      <View style={[styles.bubble, isBot ? styles.botBubble : styles.userBubble]}>
        {isBot && (
          <View style={styles.metaRow}>
            <Text style={[styles.severityText, { color: severity.color }]}>{severity.label}</Text>
            <TouchableOpacity onPress={() => onSpeak(message)} style={styles.speakerBtn} activeOpacity={0.75}>
              <Volume2 size={16} color="#0066FF" />
            </TouchableOpacity>
          </View>
        )}
        <Text style={[styles.messageText, isBot ? styles.botText : styles.userText]}>{message.text}</Text>
        {isBot && message.learnLabel && (
          <TouchableOpacity
            onPress={() => onLearnMore(message.lessonKey)}
            style={styles.learnBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.learnBtnText}>{message.learnLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 10,
  },
  rowBot: {
    justifyContent: 'flex-start',
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomLeftRadius: 6,
  },
  userBubble: {
    backgroundColor: '#0066FF',
    borderBottomRightRadius: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  severityText: {
    fontSize: 11,
    fontWeight: '800',
  },
  speakerBtn: {
    padding: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  botText: {
    color: '#0F172A',
  },
  userText: {
    color: '#FFFFFF',
  },
  learnBtn: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#93C5FD',
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  learnBtnText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '800',
  },
});

export default ChatBubble;
