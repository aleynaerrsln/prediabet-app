import React, { useState, useEffect, useRef } from 'react';
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
  Platform,
} from 'react-native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import GradientHeader from '../components/GradientHeader';

const DAILY_GOAL = 10000;

export default function StepCounterScreen({ navigation }) {
  const [currentSteps, setCurrentSteps] = useState(0);
  const [liveSteps, setLiveSteps] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [stepHistory, setStepHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pulseAnim] = useState(new Animated.Value(1));
  const subscriptionRef = useRef(null);

  useEffect(() => {
    loadData();
    checkPedometer();
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }
    };
  }, []);

  const checkPedometer = async () => {
    const available = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(available);
    if (available) {
      getTodaySteps();
    }
  };

  const getTodaySteps = async () => {
    const end = new Date();
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    try {
      const result = await Pedometer.getStepCountAsync(start, end);
      if (result) {
        setLiveSteps(result.steps);
      }
    } catch (e) {
      console.log('Bugünkü adımlar alınamadı');
    }
  };

  const startTracking = () => {
    setIsTracking(true);
    const baseSteps = liveSteps;
    subscriptionRef.current = Pedometer.watchStepCount((result) => {
      setLiveSteps(baseSteps + result.steps);
      animatePulse();
    });
  };

  const stopTracking = async () => {
    setIsTracking(false);
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
    const newSteps = currentSteps + liveSteps;
    setCurrentSteps(newSteps);
    setLiveSteps(0);
    try {
      await AsyncStorage.setItem('currentSteps', newSteps.toString());
    } catch (e) {}
  };

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
    } catch (e) {}
    if (currentSteps < DAILY_GOAL && newSteps >= DAILY_GOAL) {
      Alert.alert('Tebrikler!', 'Günlük 10.000 adım hedefinize ulaştınız!');
    }
  };

  const saveDaily = async () => {
    const totalSteps = currentSteps + liveSteps;
    if (totalSteps === 0) {
      Alert.alert('Uyarı', 'Kaydetmek için önce adım ekleyin.');
      return;
    }

    const today = new Date();
    const dateStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

    const entry = { steps: totalSteps, date: dateStr };
    const newHistory = [entry, ...stepHistory].slice(0, 14);
    setStepHistory(newHistory);
    setCurrentSteps(0);
    setLiveSteps(0);

    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
      setIsTracking(false);
    }

    try {
      await AsyncStorage.setItem('stepHistory', JSON.stringify(newHistory));
      await AsyncStorage.setItem('currentSteps', '0');
      Alert.alert('Kaydedildi', `${totalSteps} adım ${dateStr} tarihi için kaydedildi.`);
    } catch (e) {
      Alert.alert('Hata', 'Kayıt yapılamadı.');
    }
  };

  const totalDisplay = currentSteps + liveSteps;
  const progress = Math.min(totalDisplay / DAILY_GOAL, 1);
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
      <GradientHeader title="Adımsayar" navigation={navigation} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Pedometer Status */}
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: isPedometerAvailable ? '#4CAF50' : '#F44336' }]} />
          <Text style={styles.statusText}>
            {isPedometerAvailable === null
              ? 'Sensör kontrol ediliyor...'
              : isPedometerAvailable
              ? 'Pedometre sensörü aktif'
              : 'Pedometre sensörü bulunamadı - manuel mod'}
          </Text>
        </View>

        {/* Current Steps with Animation */}
        <Animated.View style={[styles.stepsCard, { transform: [{ scale: pulseAnim }] }]}>
          <Ionicons name="footsteps" size={36} color={COLORS.primary} />
          <Text style={styles.stepsLabel}>ADIM SAYISI:</Text>
          <Text style={styles.stepsValue}>{totalDisplay.toLocaleString('tr-TR')}</Text>
          {liveSteps > 0 && (
            <Text style={styles.liveLabel}>
              (Sensörden: +{liveSteps.toLocaleString('tr-TR')})
            </Text>
          )}
        </Animated.View>

        {/* Sensor Start/Stop Button */}
        {isPedometerAvailable && (
          <TouchableOpacity
            style={[styles.sensorButton, isTracking && styles.sensorButtonActive]}
            onPress={isTracking ? stopTracking : startTracking}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isTracking ? 'pause-circle' : 'play-circle'}
              size={24}
              color={COLORS.white}
            />
            <Text style={styles.sensorButtonText}>
              {isTracking ? 'Sensörü Durdur' : 'Sensörle Adım Say'}
            </Text>
          </TouchableOpacity>
        )}

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

        {/* Manual Step Buttons */}
        <Text style={styles.manualLabel}>Manuel Ekleme:</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.stepButton} onPress={() => addSteps(100)} activeOpacity={0.7}>
            <Text style={styles.stepButtonText}>+100</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stepButton} onPress={() => addSteps(500)} activeOpacity={0.7}>
            <Text style={styles.stepButtonText}>+500</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stepButton} onPress={() => addSteps(1000)} activeOpacity={0.7}>
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
        <TouchableOpacity style={styles.saveButton} onPress={saveDaily} activeOpacity={0.8}>
          <Text style={styles.saveButtonText}>Haftalık Adımlarım</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20, paddingBottom: 40 },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    elevation: 2,
  },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  statusText: { fontSize: 13, color: COLORS.textLight, flex: 1 },
  stepsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 4,
  },
  stepsLabel: { fontSize: 14, color: COLORS.textLight, fontWeight: '600', marginTop: 8, marginBottom: 5 },
  stepsValue: { fontSize: 40, fontWeight: 'bold', color: COLORS.primary },
  liveLabel: { fontSize: 12, color: '#4CAF50', marginTop: 4, fontWeight: '500' },
  sensorButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  sensorButtonActive: { backgroundColor: '#F44336' },
  sensorButtonText: { color: COLORS.white, fontSize: 15, fontWeight: 'bold', marginLeft: 8 },
  progressSection: { marginBottom: 20 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 13, color: COLORS.textLight, fontWeight: '500' },
  progressPercent: { fontSize: 14, fontWeight: 'bold' },
  progressBarBg: { height: 14, backgroundColor: '#E8E8E8', borderRadius: 7, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 7 },
  goalReached: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  goalReachedText: { marginLeft: 6, fontSize: 14, fontWeight: 'bold', color: '#4CAF50' },
  manualLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  stepButton: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 28, elevation: 2 },
  stepButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  historySection: { marginBottom: 20 },
  historyTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 },
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
  historyLeft: { flex: 1, marginRight: 10 },
  historyLabel: { fontSize: 14, color: COLORS.text, marginBottom: 6 },
  miniProgressBg: { height: 6, backgroundColor: '#E8E8E8', borderRadius: 3, overflow: 'hidden' },
  miniProgressFill: { height: '100%', borderRadius: 3 },
  historyDate: { fontSize: 12, color: COLORS.textLight },
  emptyText: { textAlign: 'center', color: COLORS.textLight, marginTop: 10, fontSize: 14 },
  saveButton: { backgroundColor: COLORS.primary, borderRadius: 25, paddingVertical: 15, alignItems: 'center', elevation: 3 },
  saveButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});
