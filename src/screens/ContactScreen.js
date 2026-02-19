import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import GradientHeader from '../components/GradientHeader';

const contactItems = [
  {
    icon: 'call-outline',
    label: 'Telefon: 0545 664 76 62',
    action: () => Linking.openURL('tel:05456647662'),
  },
  {
    icon: 'mail-outline',
    label: 'E-Posta : ibrahim.topuz@ksbu.edu.tr',
    action: () => Linking.openURL('mailto:ibrahim.topuz@ksbu.edu.tr'),
  },
  {
    icon: 'globe-outline',
    label: 'Website : www.prediabet-tr.com',
    action: () => Linking.openURL('https://www.prediabet-tr.com').catch(() =>
      Alert.alert('Hata', 'Web sitesi açılamadı.')
    ),
  },
  {
    icon: 'logo-whatsapp',
    label: 'Whatsapp ile yaz',
    action: () => Linking.openURL('https://wa.me/905456647662').catch(() =>
      Alert.alert('Hata', 'WhatsApp açılamadı.')
    ),
  },
  {
    icon: 'chatbubbles-outline',
    label: 'Uzmana sor',
    action: () => Alert.alert('Bilgi', 'Bu özellik yakında aktif olacaktır.'),
  },
];

export default function ContactScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <GradientHeader title="İletişim" navigation={navigation} />

      <ScrollView contentContainerStyle={styles.content}>
        {contactItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.contactCard}
            onPress={item.action}
            activeOpacity={0.7}
          >
            <Ionicons name={item.icon} size={22} color={COLORS.primary} style={styles.icon} />
            <Text style={styles.contactText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
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
  },
  contactCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },
  icon: {
    marginRight: 15,
  },
  contactText: {
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  },
});
