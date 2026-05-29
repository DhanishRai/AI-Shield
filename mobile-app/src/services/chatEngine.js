import { fraudFaqData } from '../data/faqData';

const LESSON_INDEX_BY_KEY = {
  otp: 0,
  qr: 1,
  pin: 2,
  'customer-care': 3,
  phishing: 4,
  reward: 5,
  kyc: 6,
  merchant: 7,
  refund: 2,
};

const PRIORITY_WARNING_WORDS = ['urgent', 'click link', 'otp', 'reward'];

const UNRELATED_QUERY_WORDS = ['joke', 'weather', 'movie', 'song', 'cricket score', 'recipe'];

export const getLessonIndexByKey = (lessonKey) => {
  return LESSON_INDEX_BY_KEY[lessonKey] ?? 0;
};

export const getBotReply = (message, options = {}) => {
  const normalized = String(message || '').trim().toLowerCase();
  const { simpleMode = false } = options;

  if (!normalized) {
    return {
      text: simpleMode
        ? 'Ask me about OTP, QR, PIN, KYC, or fraud links.'
        : 'Ask me any payment fraud safety question like OTP, QR scams, UPI PIN, KYC, or phishing links.',
      severity: 'tip',
      lessonKey: 'merchant',
      learnLabel: 'Learn Safety Basics',
    };
  }

  const matchedFaq = fraudFaqData.find((faq) =>
    faq.keywords.some((keyword) => normalized.includes(keyword))
  );

  const hasPriorityWarning = PRIORITY_WARNING_WORDS.some((word) => normalized.includes(word));
  const isUnrelated = UNRELATED_QUERY_WORDS.some((word) => normalized.includes(word));

  if (matchedFaq) {
    const severity = hasPriorityWarning && matchedFaq.severity !== 'tip' ? 'high' : matchedFaq.severity;
    return {
      text: simpleMode ? matchedFaq.simpleAnswer : matchedFaq.answer,
      severity,
      lessonKey: matchedFaq.lessonKey,
      learnLabel: matchedFaq.learnLabel,
    };
  }

  if (isUnrelated) {
    return {
      text: 'I help only with fraud safety questions for payments. Ask about OTP, QR scams, KYC, UPI PIN, or suspicious links.',
      severity: 'tip',
      lessonKey: null,
      learnLabel: null,
    };
  }

  return {
    text: 'I can help with payment fraud safety questions like OTP, QR scams, KYC, and phishing.',
    severity: 'tip',
    lessonKey: 'merchant',
    learnLabel: 'Learn Payment Safety',
  };
};
