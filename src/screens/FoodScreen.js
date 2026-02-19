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

const foodCategories = [
  'Çavdar unu ve kepekli ekmeğin yanı sıra buğday unu',
  'Balık Havyarı',
  'Et ve mantar et suyu, yanı sıra bunlara dayalı yemekler',
  'Yüksek içerikli süt ürünleri',
  'Siyah ve yeşil çay, bitkisel çaylar ve soğanlar, yabani gül suyu.',
  'Az yağlı balıklar (pollock, walleye, turna, hake vs.) - fırında kaynatın veya fırında pişirin',
  'Yağda konserve balık',
  'Füme, kurutulmuş ve tuzlu balık',
  'Sütlü tatlılar',
  'İç yağ',
  'Dondurma, reçeller, kremler, tatlılar',
  'Herhangi bir formda yağlı balık türleri',
];

export default function FoodScreen({ navigation }) {
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSavedFoods();
  }, []);

  const loadSavedFoods = async () => {
    try {
      const data = await AsyncStorage.getItem('selectedFoods');
      if (data) {
        setSelectedFoods(JSON.parse(data));
      }
    } catch (e) {
      console.log('Besinler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const toggleFood = (index) => {
    if (selectedFoods.includes(index)) {
      setSelectedFoods(selectedFoods.filter((i) => i !== index));
    } else {
      setSelectedFoods([...selectedFoods, index]);
    }
  };

  const saveFoods = async () => {
    setSaving(true);
    try {
      await AsyncStorage.setItem('selectedFoods', JSON.stringify(selectedFoods));
      Alert.alert('Başarılı', `${selectedFoods.length} besin kaydedildi!`);
    } catch (e) {
      Alert.alert('Hata', 'Besinler kaydedilemedi.');
    } finally {
      setSaving(false);
    }
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
        <Text style={styles.headerTitle}>Besin Ekle</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.headerBtn}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {foodCategories.map((food, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.foodItem,
              selectedFoods.includes(index) && styles.foodItemSelected,
            ]}
            onPress={() => toggleFood(index)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.foodText,
                selectedFoods.includes(index) && styles.foodTextSelected,
              ]}
            >
              {food}
            </Text>
            {selectedFoods.includes(index) && (
              <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveFoods}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.saveButtonText}>Kaydet</Text>
          )}
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
  foodItem: {
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
  foodItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF5F5',
  },
  foodText: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    marginRight: 10,
  },
  foodTextSelected: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
