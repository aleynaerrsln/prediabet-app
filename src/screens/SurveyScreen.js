import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import GradientHeader from '../components/GradientHeader';

const questions = [
  {
    title: 'Yaşınız',
    options: [
      { label: '<45 yaş', score: 0 },
      { label: '45-54 yaş', score: 2 },
      { label: '55-64 yaş', score: 3 },
      { label: '>64 yaş', score: 4 },
    ],
  },
  {
    title: 'BKİ (Bilmiyorsanız Hesaplayın)',
    options: [
      { label: '<25 kg/m²', score: 0 },
      { label: '25-30 kg/m²', score: 1 },
      { label: '>30 kg/m²', score: 3 },
    ],
  },
  {
    title: 'Bel Çevresi (Gebelik öncesi bel çevresi\ntahmini olarak sorulacaktır)',
    options: [
      { label: '<80 cm', score: 0 },
      { label: '80-88 cm', score: 3 },
      { label: '>88 cm', score: 4 },
    ],
  },
  {
    title: 'Günde en az 30 dakika fiziksel\naktivite yapıyor musunuz?',
    options: [
      { label: 'Evet', score: 0 },
      { label: 'Hayır', score: 2 },
    ],
  },
  {
    title: 'Ne sıklıkla sebze ve meyve\nyiyorsunuz?',
    options: [
      { label: 'Her gün', score: 0 },
      { label: 'Her gün değil', score: 1 },
    ],
  },
  {
    title: 'Hiç kan şekeri yüksekliği\nsaptandı mı?',
    options: [
      { label: 'Hayır', score: 0 },
      { label: 'Evet', score: 5 },
    ],
  },
  {
    title: 'Aile bireylerinde diyabet\nvar mı?',
    options: [
      { label: 'Hayır', score: 0 },
      { label: '2. derece akraba', score: 3 },
      { label: '1. derece akraba', score: 5 },
    ],
  },
];

const riskLevels = [
  { min: 0, max: 6, text: 'Düşük Risk', color: '#4CAF50', icon: 'shield-checkmark-outline', description: '10 yıl içinde diyabet gelişme riski: %1' },
  { min: 7, max: 11, text: 'Hafif Artmış Risk', color: '#FFC107', icon: 'alert-outline', description: '10 yıl içinde diyabet gelişme riski: %4' },
  { min: 12, max: 14, text: 'Orta Derece Risk', color: '#FF9800', icon: 'warning-outline', description: '10 yıl içinde diyabet gelişme riski: %17' },
  { min: 15, max: 19, text: 'Yüksek Risk', color: '#F44336', icon: 'alert-circle-outline', description: '10 yıl içinde diyabet gelişme riski: %33' },
  { min: 20, max: 100, text: 'Çok Yüksek Risk', color: '#B71C1C', icon: 'close-circle-outline', description: '10 yıl içinde diyabet gelişme riski: %50' },
];

export default function SurveyScreen({ navigation }) {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [resultAnim] = useState(new Animated.Value(0));

  const selectAnswer = (questionIndex, optionIndex, score) => {
    setAnswers({ ...answers, [questionIndex]: { optionIndex, score } });
    setShowResult(false);
  };

  const calculateResult = () => {
    if (Object.keys(answers).length < questions.length) {
      Alert.alert('Uyarı', 'Lütfen tüm soruları cevaplayınız.');
      return;
    }
    resultAnim.setValue(0);
    setShowResult(true);
    Animated.spring(resultAnim, {
      toValue: 1,
      friction: 5,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  const totalScore = Object.values(answers).reduce((sum, a) => sum + a.score, 0);

  const getRiskLevel = (score) => {
    return riskLevels.find((r) => score >= r.min && score <= r.max) || riskLevels[0];
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <GradientHeader title="Anket Sayfası" navigation={navigation} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.surveyTitle}>
          FİNLANDİYA TİP-2 DİYABET RİSK ANKETİ{'\n'}(FINDRISK)
        </Text>

        {/* Progress Indicator */}
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>
            {answeredCount}/{questions.length} soru cevaplandı
          </Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {questions.map((question, qIndex) => (
          <View key={qIndex} style={styles.questionContainer}>
            <Text style={styles.questionTitle}>{question.title}</Text>
            {question.options.map((option, oIndex) => (
              <TouchableOpacity
                key={oIndex}
                style={[
                  styles.optionButton,
                  answers[qIndex]?.optionIndex === oIndex && styles.optionSelected,
                ]}
                onPress={() => selectAnswer(qIndex, oIndex, option.score)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    answers[qIndex]?.optionIndex === oIndex && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
                <Text
                  style={[
                    styles.optionScore,
                    answers[qIndex]?.optionIndex === oIndex && styles.optionTextSelected,
                  ]}
                >
                  {option.score}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Visual Risk Gauge */}
        {showResult && (
          <Animated.View
            style={[
              styles.resultContainer,
              {
                borderColor: getRiskLevel(totalScore).color,
                transform: [{ scale: resultAnim }],
              },
            ]}
          >
            <View
              style={[
                styles.resultIconCircle,
                { backgroundColor: getRiskLevel(totalScore).color },
              ]}
            >
              <Ionicons name={getRiskLevel(totalScore).icon} size={36} color={COLORS.white} />
            </View>

            <Text style={styles.resultTitle}>Sonuç</Text>
            <Text style={styles.resultScore}>Toplam Puan: {totalScore}</Text>
            <Text style={[styles.resultRisk, { color: getRiskLevel(totalScore).color }]}>
              {getRiskLevel(totalScore).text}
            </Text>

            {/* Risk Scale Bar */}
            <View style={styles.riskScale}>
              {riskLevels.map((level, i) => (
                <View
                  key={i}
                  style={[
                    styles.riskSegment,
                    { backgroundColor: level.color },
                    getRiskLevel(totalScore).text === level.text && styles.riskSegmentActive,
                  ]}
                />
              ))}
            </View>
            <View style={styles.riskLabels}>
              <Text style={styles.riskLabelText}>Düşük</Text>
              <Text style={styles.riskLabelText}>Yüksek</Text>
            </View>

            <Text style={styles.resultDescription}>
              {getRiskLevel(totalScore).description}
            </Text>
          </Animated.View>
        )}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={calculateResult}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  surveyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 15,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 6,
    textAlign: 'center',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.text,
  },
  optionTextSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },
  optionScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  resultContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    elevation: 4,
  },
  resultIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  resultScore: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 5,
  },
  resultRisk: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  riskScale: {
    flexDirection: 'row',
    width: '100%',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 5,
  },
  riskSegment: {
    flex: 1,
    opacity: 0.3,
  },
  riskSegmentActive: {
    opacity: 1,
    height: 14,
    marginTop: -2,
  },
  riskLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  riskLabelText: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  resultDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 3,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
