import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const { width } = Dimensions.get('window');

const menuItems = [
  { title: 'Profil', icon: 'person', screen: 'Profile', colors: ['#C41E3A', '#FF6B6B'] },
  { title: 'Bilgilendirme', icon: 'information-circle', screen: 'Info', colors: ['#1E88E5', '#64B5F6'] },
  { title: 'BKİ Hesaplama', icon: 'calculator', screen: 'Bmi', colors: ['#43A047', '#81C784'] },
  { title: 'Ön Testler', icon: 'clipboard', screen: 'Survey', colors: ['#FB8C00', '#FFB74D'] },
  { title: 'Son Testler', icon: 'document-text', screen: 'Survey', colors: ['#8E24AA', '#CE93D8'] },
  { title: 'İletişim', icon: 'call', screen: 'Contact', colors: ['#00897B', '#80CBC4'] },
  { title: 'Hakkımızda', icon: 'people', screen: 'About', colors: ['#5C6BC0', '#9FA8DA'] },
  { title: 'S.S.S.', icon: 'help-circle', screen: 'Faq', colors: ['#E53935', '#EF9A9A'] },
  { title: 'Besin Ekle', icon: 'nutrition', screen: 'Food', colors: ['#7CB342', '#C5E1A5'] },
  { title: 'Adımsayar', icon: 'footsteps', screen: 'StepCounter', colors: ['#F4511E', '#FFAB91'] },
  { title: 'AI Asistan', icon: 'sparkles', screen: 'AiAssistant', colors: ['#6A1B9A', '#BA68C8'] },
];

const healthTips = [
  { tip: 'Günde en az 8 bardak su içmeyi unutmayın! Su, metabolizmanızı hızlandırır.', icon: 'water-outline' },
  { tip: 'Her gün 30 dakika yürüyüş yapın, diyabet riskinizi %58 azaltın!', icon: 'walk-outline' },
  { tip: 'Tam tahıllı ürünler kan şekerinizi dengede tutar.', icon: 'leaf-outline' },
  { tip: 'Düzenli uyku insülin direncini azaltır. Her gece 7-8 saat uyuyun.', icon: 'moon-outline' },
  { tip: 'Stresi azaltın! Meditasyon ve derin nefes egzersizleri deneyin.', icon: 'happy-outline' },
  { tip: 'Porsiyonlarınızı küçültün, daha sık ve az yiyin.', icon: 'restaurant-outline' },
  { tip: 'Lifli gıdalar tüketin: sebzeler, baklagiller, yulaf...', icon: 'nutrition-outline' },
];

const motivationalQuotes = [
  'Sağlığınız en değerli servetinizdir.',
  'Küçük adımlar büyük değişimlere yol açar.',
  'Bugün sağlığınız için bir adım atın.',
  'Her sağlıklı tercih, geleceğinize yatırımdır.',
  'Vücudunuza iyi bakın, yaşayacak tek yeriniz orası.',
];

export default function HomeScreen({ navigation }) {
  const [userName, setUserName] = useState('');
  const [dailyTip, setDailyTip] = useState(healthTips[0]);
  const [quote, setQuote] = useState(motivationalQuotes[0]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnims] = useState(menuItems.map(() => new Animated.Value(0)));

  useEffect(() => {
    loadUserName();
    pickDaily();
    startAnimations();
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => loadUserName());
    return unsub;
  }, [navigation]);

  const loadUserName = async () => {
    try {
      const data = await AsyncStorage.getItem('profile');
      if (data) {
        const p = JSON.parse(data);
        if (p.name) setUserName(p.name);
      }
    } catch (e) {}
  };

  const pickDaily = () => {
    const d = new Date().getDate();
    setDailyTip(healthTips[d % healthTips.length]);
    setQuote(motivationalQuotes[d % motivationalQuotes.length]);
  };

  const startAnimations = () => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    scaleAnims.forEach((anim, i) => {
      Animated.spring(anim, { toValue: 1, delay: i * 50, friction: 6, tension: 80, useNativeDriver: true }).start();
    });
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Günaydın';
    if (h < 18) return 'İyi Günler';
    return 'İyi Akşamlar';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryDark} barStyle="light-content" />

      {/* Gradient Header */}
      <LinearGradient colors={COLORS.gradientDark} style={styles.header}>
        <View style={styles.headerDecor} />
        <View style={styles.logoRow}>
          <View style={styles.logoCircle}>
            <Ionicons name="medical" size={28} color={COLORS.primary} />
          </View>
          <View style={styles.logoTextWrap}>
            <Text style={styles.logoText}>PREDIABET</Text>
            {userName ? (
              <Text style={styles.greeting}>{getGreeting()}, {userName}!</Text>
            ) : (
              <Text style={styles.greeting}>Sağlıklı Yaşam Rehberiniz</Text>
            )}
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Quote */}
        <Animated.View style={[styles.quoteCard, { opacity: fadeAnim }]}>
          <View style={styles.quoteIcon}>
            <Ionicons name="heart" size={16} color={COLORS.primary} />
          </View>
          <Text style={styles.quoteText}>{quote}</Text>
        </Animated.View>

        {/* Tip Card */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <LinearGradient colors={['#FFF5F5', '#FFFFFF']} style={styles.tipCard}>
            <View style={styles.tipBadge}>
              <Ionicons name={dailyTip.icon} size={20} color={COLORS.white} />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipLabel}>GÜNÜN İPUCU</Text>
              <Text style={styles.tipText}>{dailyTip.tip}</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <Animated.View key={index} style={{ width: '47%', transform: [{ scale: scaleAnims[index] }] }}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.75}
              >
                <LinearGradient colors={item.colors} style={styles.menuIconWrap}>
                  <Ionicons name={item.icon} size={24} color={COLORS.white} />
                </LinearGradient>
                <Text style={styles.menuText}>{item.title}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingTop: 45,
    paddingBottom: 22,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  headerDecor: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -60,
    right: -40,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  logoTextWrap: { marginLeft: 14 },
  logoText: { fontSize: 22, fontWeight: 'bold', color: COLORS.white, letterSpacing: 2 },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  scrollContent: { padding: 16, paddingBottom: 30 },
  quoteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  quoteIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quoteText: { flex: 1, fontSize: 13, fontStyle: 'italic', color: COLORS.textLight, lineHeight: 19 },
  tipCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  tipBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  tipContent: { flex: 1 },
  tipLabel: { fontSize: 11, fontWeight: 'bold', color: COLORS.primary, letterSpacing: 1, marginBottom: 4 },
  tipText: { fontSize: 13, lineHeight: 20, color: COLORS.text },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  menuItem: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  menuIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuText: { fontSize: 13, fontWeight: '600', color: COLORS.text, textAlign: 'center' },
});
