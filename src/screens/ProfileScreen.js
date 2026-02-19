import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const data = await AsyncStorage.getItem('profile');
      if (data) {
        const p = JSON.parse(data);
        setName(p.name || '');
        setPhone(p.phone || '');
        setPassword(p.password || '');
      }
    } catch (e) {} finally { setLoading(false); }
  };

  const saveProfile = async () => {
    if (!name.trim()) { Alert.alert('Uyarı', 'Lütfen adınızı giriniz.'); return; }
    setSaving(true);
    try {
      await AsyncStorage.setItem('profile', JSON.stringify({ name, phone, password }));
      Alert.alert('Başarılı', 'Profil güncellendi!');
    } catch (e) { Alert.alert('Hata', 'Profil kaydedilemedi.'); }
    finally { setSaving(false); }
  };

  if (loading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  return (
    <SafeAreaView style={styles.container}>
      {/* Gradient Header with curved bottom */}
      <LinearGradient colors={COLORS.gradientDark} style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
            <Ionicons name="chevron-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profil</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.headerBtn}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <View style={styles.avatarOuter}>
            <View style={styles.avatarInner}>
              <Ionicons name="person" size={40} color={COLORS.primary} />
            </View>
          </View>
          <Text style={styles.avatarName}>{name || 'Kullanıcı'}</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Form Card */}
        <View style={styles.formCard}>
          <View style={styles.inputWrap}>
            <View style={styles.inputIcon}>
              <Ionicons name="person-outline" size={20} color={COLORS.primary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Adı Soyadı"
              value={name}
              onChangeText={setName}
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          <View style={styles.inputWrap}>
            <View style={styles.inputIcon}>
              <Ionicons name="call-outline" size={20} color={COLORS.primary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Telefon"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          <View style={styles.inputWrap}>
            <View style={styles.inputIcon}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Şifre"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={COLORS.textLight}
            />
          </View>
        </View>

        <TouchableOpacity onPress={saveProfile} disabled={saving} activeOpacity={0.8}>
          <LinearGradient colors={COLORS.gradient} style={styles.saveButton}>
            {saving ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.saveButtonText}>Profili Güncelle</Text>}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  headerBtn: { padding: 5 },
  headerTitle: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  avatarWrap: { alignItems: 'center' },
  avatarOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  avatarName: { color: COLORS.white, fontSize: 18, fontWeight: '600', marginTop: 10 },
  content: { padding: 20, marginTop: -10 },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 20,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 14,
    marginBottom: 14,
    paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16, color: COLORS.text },
  saveButton: {
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
});
