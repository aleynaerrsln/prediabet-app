import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
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
import GradientHeader from '../components/GradientHeader';

const getBmiCategory = (bmi) => {
  const val = parseFloat(bmi);
  if (val < 18.5) return { label: 'Zayıf', color: '#2196F3', icon: 'arrow-down-outline', advice: 'Kilo almanız önerilir. Beslenme uzmanına danışın.' };
  if (val < 25) return { label: 'Normal', color: '#4CAF50', icon: 'checkmark-circle-outline', advice: 'Tebrikler! Sağlıklı kilonuzu koruyun.' };
  if (val < 30) return { label: 'Fazla Kilolu', color: '#FF9800', icon: 'warning-outline', advice: 'Dikkat! Fiziksel aktiviteyi artırın ve porsiyon kontrolü yapın.' };
  if (val < 35) return { label: 'Obez (Sınıf 1)', color: '#F44336', icon: 'alert-circle-outline', advice: 'Diyabet riski yüksek! Doktorunuza danışmanız önerilir.' };
  return { label: 'Obez (Sınıf 2+)', color: '#B71C1C', icon: 'alert-circle-outline', advice: 'Ciddi sağlık riski! Acil tıbbi destek alınız.' };
};

export default function BmiScreen({ navigation }) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem('bmiHistory');
      if (data) {
        setHistory(JSON.parse(data));
      }
    } catch (e) {
      console.log('BKİ geçmişi yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const calculateBmi = async () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;

    if (!w || !h || w <= 0 || h <= 0) {
      Alert.alert('Uyarı', 'Lütfen geçerli kilo ve boy değerleri giriniz.');
      return;
    }

    const bmi = (w / (h * h)).toFixed(2);
    setBmiResult(bmi);

    // Animate result
    resultAnim.setValue(0);
    Animated.spring(resultAnim, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();

    const today = new Date();
    const dateStr = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`;

    const newEntry = { bmi, date: dateStr };
    const newHistory = [newEntry, ...history].slice(0, 10);
    setHistory(newHistory);

    try {
      await AsyncStorage.setItem('bmiHistory', JSON.stringify(newHistory));
    } catch (e) {
      console.log('BKİ kaydedilemedi');
    }
  };

  const deleteEntry = async (index) => {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    try {
      await AsyncStorage.setItem('bmiHistory', JSON.stringify(newHistory));
    } catch (e) {
      console.log('Silinemedi');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const category = bmiResult ? getBmiCategory(bmiResult) : null;

  return (
    <SafeAreaView style={styles.container}>
      <GradientHeader title="BKİ Hesaplama" navigation={navigation} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Kilonuzu Giriniz</Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: 75"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Boyunuzu Giriniz</Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: 175"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        {/* Color-coded Result */}
        {bmiResult && category && (
          <Animated.View
            style={[
              styles.resultCard,
              { borderColor: category.color, transform: [{ scale: resultAnim }] },
            ]}
          >
            <View style={[styles.resultBadge, { backgroundColor: category.color }]}>
              <Ionicons name={category.icon} size={28} color={COLORS.white} />
            </View>
            <Text style={styles.resultBmiValue}>{bmiResult}</Text>
            <Text style={[styles.resultCategory, { color: category.color }]}>
              {category.label}
            </Text>
            <View style={styles.bmiScale}>
              {['#2196F3', '#4CAF50', '#FF9800', '#F44336', '#B71C1C'].map((color, i) => (
                <View
                  key={i}
                  style={[
                    styles.scaleSegment,
                    { backgroundColor: color },
                    category.color === color && styles.scaleActive,
                  ]}
                />
              ))}
            </View>
            <Text style={styles.adviceText}>{category.advice}</Text>
          </Animated.View>
        )}

        <TouchableOpacity
          style={styles.calculateButton}
          onPress={calculateBmi}
          activeOpacity={0.8}
        >
          <Text style={styles.calculateButtonText}>Hesapla</Text>
        </TouchableOpacity>

        {/* History */}
        {history.length > 0 && (
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>Geçmiş Hesaplamalar</Text>
            {history.map((item, index) => {
              const cat = getBmiCategory(item.bmi);
              return (
                <View key={index} style={styles.historyItem}>
                  <View style={[styles.historyDot, { backgroundColor: cat.color }]} />
                  <Text style={styles.historyText}>
                    BKİ Değeri: {item.bmi}
                  </Text>
                  <Text style={styles.historyDate}>{item.date}</Text>
                  <TouchableOpacity
                    onPress={() => deleteEntry(index)}
                    style={styles.deleteBtn}
                  >
                    <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        {history.length === 0 && (
          <Text style={styles.emptyText}>Henüz hesaplama yapılmadı.</Text>
        )}
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
  content: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
  },
  resultCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  resultBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultBmiValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  resultCategory: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  bmiScale: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15,
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  scaleSegment: {
    flex: 1,
    opacity: 0.3,
  },
  scaleActive: {
    opacity: 1,
    height: 12,
    marginTop: -2,
  },
  adviceText: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  calculateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 25,
    elevation: 3,
  },
  calculateButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyContainer: {
    marginTop: 10,
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
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  historyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  historyText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  historyDate: {
    fontSize: 12,
    color: COLORS.textLight,
    marginRight: 10,
  },
  deleteBtn: {
    padding: 5,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginTop: 20,
    fontSize: 14,
  },
});
