import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function AboutScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hakkımızda</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.headerBtn}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.description}>
            PREDIABET-TR mobil uygulamasının geliştirilmesi ve kullanılabilirliğinin değerlendirilmesidir. Bu mobil uygulama prediyabetli bireylere sağlıkla ilgili konularda bilgi sunmak ve bireylerde sağlıklı yaşam biçimi davranışları oluşmasının sağlanmasını içermektedir.
          </Text>
        </View>

        {/* Info Cards */}
        <View style={styles.infoCard}>
          <Ionicons name="medkit-outline" size={40} color={COLORS.primary} />
          <Text style={styles.infoTitle}>Sağlık Takibi</Text>
          <Text style={styles.infoText}>
            Kan şekeri, BKİ ve günlük adım sayınızı takip edin.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="nutrition-outline" size={40} color={COLORS.primary} />
          <Text style={styles.infoTitle}>Beslenme Rehberi</Text>
          <Text style={styles.infoText}>
            Prediyabet için önerilen besinleri öğrenin ve beslenmenizi planlayın.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="fitness-outline" size={40} color={COLORS.primary} />
          <Text style={styles.infoTitle}>Fiziksel Aktivite</Text>
          <Text style={styles.infoText}>
            Günlük adım hedefinizi belirleyin ve adımlarınızı takip edin.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="school-outline" size={40} color={COLORS.primary} />
          <Text style={styles.infoTitle}>Bilgilendirme</Text>
          <Text style={styles.infoText}>
            Prediyabet hakkında güncel ve güvenilir bilgilere erişin.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Kastamonu Üniversitesi Sağlık Bilimleri Fakültesi
          </Text>
          <Text style={styles.versionText}>Versiyon 1.0.0</Text>
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
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.text,
    textAlign: 'justify',
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 10,
    marginBottom: 5,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  versionText: {
    fontSize: 12,
    color: COLORS.border,
    marginTop: 5,
  },
});
