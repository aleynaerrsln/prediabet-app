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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const menuItems = [
  { title: 'Profil', icon: 'person-outline', screen: 'Profile' },
  { title: 'Bilgilendirme', icon: 'information-circle-outline', screen: 'Info' },
  { title: 'BKİ Hesaplama', icon: 'calculator-outline', screen: 'Bmi' },
  { title: 'Ön Testler', icon: 'clipboard-outline', screen: 'Survey' },
  { title: 'Son Testler', icon: 'document-text-outline', screen: 'Survey' },
  { title: 'İletişim', icon: 'call-outline', screen: 'Contact' },
  { title: 'Hakkımızda', icon: 'people-outline', screen: 'About' },
  { title: 'S.S.S.', icon: 'help-circle-outline', screen: 'Faq' },
  { title: 'Besin Ekle', icon: 'nutrition-outline', screen: 'Food' },
  { title: 'Adımsayar', icon: 'footsteps-outline', screen: 'StepCounter' },
];

const healthTips = [
  { tip: 'Günde en az 8 bardak su içmeyi unutmayın! Su, metabolizmanızı hızlandırır.', icon: 'water-outline' },
  { tip: 'Her gün 30 dakika yürüyüş yapın, diyabet riskinizi %58 azaltın!', icon: 'walk-outline' },
  { tip: 'Tam tahıllı ürünler kan şekerinizi dengede tutar. Beyaz ekmek yerine tam buğday tercih edin.', icon: 'leaf-outline' },
  { tip: 'Düzenli uyku insülin direncini azaltmaya yardımcı olur. Her gece 7-8 saat uyuyun.', icon: 'moon-outline' },
  { tip: 'Stresi azaltın! Meditasyon ve derin nefes egzersizleri kan şekerinizi dengeler.', icon: 'happy-outline' },
  { tip: 'Porsiyonlarınızı küçültün, daha sık ve az yiyin. Küçük tabak kullanın!', icon: 'restaurant-outline' },
  { tip: 'Lifli gıdalar tüketin: sebzeler, baklagiller, yulaf... Lif kan şekerini yavaşça yükseltir.', icon: 'nutrition-outline' },
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
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserName();
    });
    return unsubscribe;
  }, [navigation]);

  const loadUserName = async () => {
    try {
      const data = await AsyncStorage.getItem('profile');
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.name) setUserName(parsed.name);
      }
    } catch (e) {}
  };

  const pickDaily = () => {
    const dayIndex = new Date().getDate();
    setDailyTip(healthTips[dayIndex % healthTips.length]);
    setQuote(motivationalQuotes[dayIndex % motivationalQuotes.length]);
  };

  const startAnimations = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    scaleAnims.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: 1,
        delay: index * 60,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }).start();
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Günaydın';
    if (hour < 18) return 'İyi Günler';
    return 'İyi Akşamlar';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="medical-outline" size={40} color={COLORS.primary} />
          <Text style={styles.logoText}>PREDIABET</Text>
        </View>
        {userName ? (
          <Animated.Text style={[styles.greeting, { opacity: fadeAnim }]}>
            {getGreeting()}, {userName}!
          </Animated.Text>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Motivational Quote */}
        <Animated.View style={[styles.quoteCard, { opacity: fadeAnim }]}>
          <Ionicons name="heart-outline" size={18} color={COLORS.primary} />
          <Text style={styles.quoteText}>{quote}</Text>
        </Animated.View>

        {/* Daily Tip Card */}
        <Animated.View style={[styles.tipCard, { opacity: fadeAnim }]}>
          <View style={styles.tipHeader}>
            <Ionicons name={dailyTip.icon} size={24} color={COLORS.primary} />
            <Text style={styles.tipLabel}>Günün Sağlık İpucu</Text>
          </View>
          <Text style={styles.tipText}>{dailyTip.tip}</Text>
        </Animated.View>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <Animated.View
              key={index}
              style={{ width: '47%', transform: [{ scale: scaleAnims[index] }] }}
            >
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.7}
              >
                <View style={styles.iconCircle}>
                  <Ionicons name={item.icon} size={26} color={COLORS.primary} />
                </View>
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 5,
    letterSpacing: 2,
  },
  greeting: {
    marginTop: 8,
    fontSize: 15,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 30,
  },
  quoteCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFDADA',
    elevation: 1,
  },
  quoteText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: COLORS.textLight,
    marginLeft: 10,
    flex: 1,
  },
  tipCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.text,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 18,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
});
