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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import GradientHeader from '../components/GradientHeader';

const recommendedFoods = [
  { name: 'Çavdar unu ve kepekli ekmek', icon: 'leaf-outline' },
  { name: 'Az yağlı balıklar (fırında pişirin)', icon: 'fish-outline' },
  { name: 'Siyah/yeşil çay, bitkisel çaylar', icon: 'cafe-outline' },
  { name: 'Taze sebze ve meyveler', icon: 'nutrition-outline' },
  { name: 'Yulaf ezmesi ve tam tahıllar', icon: 'leaf-outline' },
  { name: 'Baklagiller (mercimek, nohut)', icon: 'ellipse-outline' },
  { name: 'Az yağlı süt ve yoğurt', icon: 'water-outline' },
  { name: 'Zeytinyağı (soğuk sıkım)', icon: 'color-fill-outline' },
];

const avoidFoods = [
  { name: 'Yüksek yağlı süt ürünleri', icon: 'close-circle-outline' },
  { name: 'Yağda konserve balık', icon: 'close-circle-outline' },
  { name: 'Füme, kurutulmuş ve tuzlu balık', icon: 'close-circle-outline' },
  { name: 'Şekerli tatlılar ve dondurma', icon: 'close-circle-outline' },
  { name: 'İç yağ ve tereyağı', icon: 'close-circle-outline' },
  { name: 'Beyaz ekmek ve beyaz pirinç', icon: 'close-circle-outline' },
  { name: 'Gazlı ve şekerli içecekler', icon: 'close-circle-outline' },
  { name: 'Paketli atıştırmalıklar', icon: 'close-circle-outline' },
];

export default function FoodScreen({ navigation }) {
  const [selectedToday, setSelectedToday] = useState([]);
  const [diaryHistory, setDiaryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('recommended');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const todayData = await AsyncStorage.getItem('foodToday');
      const historyData = await AsyncStorage.getItem('foodDiary');
      if (todayData) setSelectedToday(JSON.parse(todayData));
      if (historyData) setDiaryHistory(JSON.parse(historyData));
    } catch (e) {} finally { setLoading(false); }
  };

  const toggleFood = (foodName) => {
    if (selectedToday.includes(foodName)) {
      setSelectedToday(selectedToday.filter((f) => f !== foodName));
    } else {
      setSelectedToday([...selectedToday, foodName]);
    }
  };

  const saveDiary = async () => {
    if (selectedToday.length === 0) {
      Alert.alert('Uyarı', 'Lütfen bugün tükettiğiniz besinleri seçin.');
      return;
    }
    setSaving(true);
    const today = new Date();
    const dateStr = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`;

    const entry = { date: dateStr, foods: selectedToday, count: selectedToday.length };
    const newHistory = [entry, ...diaryHistory].slice(0, 14);

    try {
      await AsyncStorage.setItem('foodDiary', JSON.stringify(newHistory));
      await AsyncStorage.setItem('foodToday', '[]');
      setDiaryHistory(newHistory);
      setSelectedToday([]);
      Alert.alert('Kaydedildi', `${entry.count} besin ${dateStr} için kaydedildi.`);
    } catch (e) {
      Alert.alert('Hata', 'Kayıt yapılamadı.');
    } finally { setSaving(false); }
  };

  if (loading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  const currentList = activeTab === 'recommended' ? recommendedFoods : avoidFoods;

  return (
    <SafeAreaView style={styles.container}>
      <GradientHeader title="Besin Ekle" navigation={navigation} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Tab Switcher */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'recommended' && styles.tabActiveGreen]}
            onPress={() => setActiveTab('recommended')}
          >
            <Ionicons name="checkmark-circle" size={18} color={activeTab === 'recommended' ? '#fff' : '#4CAF50'} />
            <Text style={[styles.tabText, activeTab === 'recommended' && styles.tabTextActive]}>Tüketilmeli</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'avoid' && styles.tabActiveRed]}
            onPress={() => setActiveTab('avoid')}
          >
            <Ionicons name="close-circle" size={18} color={activeTab === 'avoid' ? '#fff' : '#F44336'} />
            <Text style={[styles.tabText, activeTab === 'avoid' && styles.tabTextActive]}>Kaçınılmalı</Text>
          </TouchableOpacity>
        </View>

        {/* Info Text */}
        <Text style={styles.infoText}>
          {activeTab === 'recommended'
            ? 'Prediyabet için önerilen besinleri bugün tükettiyseniz işaretleyin.'
            : 'Bu besinlerden kaçınmanız önerilir. Bugün tükettiyseniz işaretleyin.'}
        </Text>

        {/* Food List */}
        {currentList.map((food, index) => {
          const isSelected = selectedToday.includes(food.name);
          const isGood = activeTab === 'recommended';
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.foodItem,
                isSelected && (isGood ? styles.foodItemGreen : styles.foodItemRed),
              ]}
              onPress={() => toggleFood(food.name)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={food.icon}
                size={22}
                color={isSelected ? '#fff' : (isGood ? '#4CAF50' : '#F44336')}
                style={styles.foodIcon}
              />
              <Text style={[styles.foodText, isSelected && styles.foodTextSelected]}>
                {food.name}
              </Text>
              {isSelected && (
                <Ionicons name="checkmark" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          );
        })}

        {/* Selected Count */}
        {selectedToday.length > 0 && (
          <View style={styles.countCard}>
            <Text style={styles.countText}>Bugün seçilen: {selectedToday.length} besin</Text>
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={saveDiary} disabled={saving} activeOpacity={0.8}>
          {saving ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.saveButtonText}>Günü Kaydet</Text>}
        </TouchableOpacity>

        {/* Diary History */}
        {diaryHistory.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>Beslenme Geçmişi</Text>
            {diaryHistory.map((entry, index) => (
              <View key={index} style={styles.historyItem}>
                <View>
                  <Text style={styles.historyDate}>{entry.date}</Text>
                  <Text style={styles.historyCount}>{entry.count} besin kaydedildi</Text>
                </View>
                <Ionicons name="document-text-outline" size={20} color={COLORS.textLight} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20, paddingBottom: 40 },
  tabRow: { flexDirection: 'row', marginBottom: 15, gap: 10 },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    elevation: 2,
    gap: 6,
  },
  tabActiveGreen: { backgroundColor: '#4CAF50' },
  tabActiveRed: { backgroundColor: '#F44336' },
  tabText: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  tabTextActive: { color: '#fff' },
  infoText: { fontSize: 13, color: COLORS.textLight, marginBottom: 15, lineHeight: 19 },
  foodItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 1,
  },
  foodItemGreen: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  foodItemRed: { backgroundColor: '#F44336', borderColor: '#F44336' },
  foodIcon: { marginRight: 12 },
  foodText: { fontSize: 14, color: COLORS.text, flex: 1 },
  foodTextSelected: { color: '#fff', fontWeight: '600' },
  countCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  countText: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 5,
    elevation: 3,
  },
  saveButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  historySection: { marginTop: 25 },
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
  historyDate: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  historyCount: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
});
