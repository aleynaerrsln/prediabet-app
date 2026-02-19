import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const DAILY_GOAL = 10000;

export default function StepCounterScreen({ navigation }) {
  const [currentSteps, setCurrentSteps] = useState(0);
  const [stepHistory, setStepHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stepsData = await AsyncStorage.getItem('currentSteps');
      const historyData = await AsyncStorage.getItem('stepHistory');
      if (stepsData) setCurrentSteps(parseInt(stepsData));
      if (historyData) setStepHistory(JSON.parse(historyData));
    } catch (e) {
      console.log('Adım verileri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const animatePulse = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.15, duration: 150, useNativeDriver: true }),
      Animated.spring(pulseAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
  };

  const addSteps = async (amount) => {
    const newSteps = currentSteps + amount;
    setCurrentSteps(newSteps);
    animatePulse();
    try {
      await AsyncStorage.setItem('currentSteps', newSteps.toString());
    } catch (e) {
      console.log('Adım kaydedilemedi');
    }

    if (currentSteps < DAILY_GOAL && newSteps >= DAILY_GOAL) {
      Alert.alert('Tebrikler!', 'Günlük 10.000 adım hedefinize ulaştınız!');
    }
  };

  const saveDaily = async () => {
    if (currentSteps === 0) {
      Alert.alert('Uyarı', 'Kaydetmek için önce adım ekleyin.');
      return;
    }

    const today = new Date();
    const dateStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

    const entry = { steps: currentSteps, date: dateStr };
    const newHistory = [entry, ...stepHistory].slice(0, 14);
    setStepHistory(newHistory);
    setCurrentSteps(0);

    try {
      await AsyncStorage.setItem('stepHistory', JSON.stringify(newHistory));
      await AsyncStorage.setItem('currentSteps', '0');
      Alert.alert('Kaydedildi', `${entry.steps} adım ${dateStr} tarihi için kaydedildi.`);
    } catch (e) {
      Alert.alert('Hata', 'Kayıt yapılamadı.');
    }
  };

  const progress = Math.min(currentSteps / DAILY_GOAL, 1);
  const progressPercent = Math.round(progress * 100);

  const getProgressColor = () => {
    if (progress < 0.3) return '#F44336';
    if (progress < 0.6) return '#FF9800';
    if (progress < 1) return '#FFC107';
    return '#4CAF50';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adımsayar</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.headerBtn}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Current Steps with Animation */}
        <Animated.View style={[styles.stepsCard, { transform: [{ scale: pulseAnim }] }]}>
          <Ionicons name="footsteps" size={36} color={COLORS.primary} />
          <Text style={styles.stepsLabel}>ADIM SAYISI:</Text>
          <Text style={styles.stepsValue}>{currentSteps.toLocaleString('tr-TR')}</Text>
        </Animated.View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Günlük Hedef: {DAILY_GOAL.toLocaleString('tr-TR')} adım</Text>
            <Text style={[styles.progressPercent, { color: getProgressColor() }]}>
              %{progressPercent}
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressPercent}%`, backgroundColor: getProgressColor() },
              ]}
            />
          </View>
          {progress >= 1 && (
            <View style={styles.goalReached}>
              <Ionicons name="trophy" size={20} color="#FFD700" />
              <Text style={styles.goalReachedText}>Hedefe ulaştınız!</Text>
            </View>
          )}
        </View>

        {/* Step Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.stepButton}
            onPress={() => addSteps(100)}
            activeOpacity={0.7}
          >
            <Text style={styles.stepButtonText}>+100</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.stepButton}
            onPress={() => addSteps(500)}
            activeOpacity={0.7}
          >
            <Text style={styles.stepButtonText}>+500</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.stepButton}
            onPress={() => addSteps(1000)}
            activeOpacity={0.7}
          >
            <Text style={styles.stepButtonText}>+1000</Text>
          </TouchableOpacity>
        </View>

        {/* History */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Geçmiş Adımlarım</Text>
          {stepHistory.length === 0 ? (
            <Text style={styles.emptyText}>Henüz kayıt yok.</Text>
          ) : (
            stepHistory.map((item, index) => {
              const itemProgress = Math.min(item.steps / DAILY_GOAL, 1);
              return (
                <View key={index} style={styles.historyItem}>
                  <View style={styles.historyLeft}>
                    <Text style={styles.historyLabel}>Adım Sayısı: {item.steps.toLocaleString('tr-TR')}</Text>
                    <View style={styles.miniProgressBg}>
                      <View
                        style={[
                          styles.miniProgressFill,
                          { width: `${itemProgress * 100}%`, backgroundColor: itemProgress >= 1 ? '#4CAF50' : '#FF9800' },
                        ]}
                      />
                    </View>
                  </View>
                  <Text style={styles.historyDate}>Tarih: {item.date}</Text>
                </View>
              );
            })
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveDaily}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Haftalık Adımlarım</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingTop: 40,
  },
  headerBtn: {
    padding: 5,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  stepsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 4,
  },
  stepsLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 5,
  },
  stepsValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 14,
    backgroundColor: '#E8E8E8',
    borderRadius: 7,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 7,
  },
  goalReached: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  goalReachedText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  stepButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 28,
    elevation: 2,
  },
  stepButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  historySection: {
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  historyItem: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  historyLeft: {
    flex: 1,
    marginRight: 10,
  },
  historyLabel: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 6,
  },
  miniProgressBg: {
    height: 6,
    backgroundColor: '#E8E8E8',
    borderRadius: 3,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  historyDate: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginTop: 10,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 3,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
