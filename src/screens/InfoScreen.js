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
import GradientHeader from '../components/GradientHeader';

const infoTopics = [
  {
    title: 'Prediyabe- TR mobil uygulaması nedir?',
    content:
      'Prediyabet-TR, prediyabetli bireylere sağlıkla ilgili konularda bilgi sunmak ve bireylerde sağlıklı yaşam biçimi davranışları oluşmasının sağlanmasını içeren bir mobil uygulamadır.',
  },
  {
    title: 'Prediyabe- TR mobil uygulamasının hedefleri nelerdir?',
    content:
      'Uygulamanın hedefleri; prediyabetli bireylerin sağlık okuryazarlığını artırmak, sağlıklı beslenme ve fiziksel aktivite alışkanlıkları kazandırmak ve diyabete geçişi önlemektir.',
  },
  {
    title: 'Prediyabet-TR mobil uygulamasının tasarımcıları kimlerdir?',
    content:
      'Prediyabet-TR mobil uygulaması, Kastamonu Üniversitesi Sağlık Bilimleri Fakültesi akademisyenleri tarafından tasarlanmıştır.',
  },
  {
    title: 'Sağlıklı Yaşam',
    content:
      'Sağlıklı yaşam; dengeli beslenme, düzenli fiziksel aktivite, yeterli uyku, stresten uzak durma ve düzenli sağlık kontrolleri ile mümkündür. Her gün en az 30 dakika yürüyüş yaparak başlayabilirsiniz.',
  },
  {
    title: 'Prediyabeti Öğrenelim',
    content:
      'Prediyabet, kan şekeri düzeylerinin normalden yüksek olduğu ancak diyabet tanısı koyduracak kadar yüksek olmadığı bir durumdur. Açlık kan şekeri 100-125 mg/dL arasında olan kişilerde prediyabet tanısı konulur.',
  },
  {
    title: 'Prediyabetin Komplikasyonları',
    content:
      'Prediyabet kontrol altına alınmazsa tip 2 diyabete, kalp damar hastalıklarına, böbrek sorunlarına ve sinir hasarına yol açabilir. Erken tanı ve yaşam tarzı değişiklikleri ile bu riskler azaltılabilir.',
  },
  {
    title: 'Tanı ve Tedavi Yöntemleri',
    content:
      'Prediyabet tanısı açlık kan şekeri, oral glukoz tolerans testi veya HbA1c testi ile konulur. Tedavide öncelik yaşam tarzı değişiklikleridir: sağlıklı beslenme, kilo verme ve fiziksel aktivite.',
  },
];

export default function InfoScreen({ navigation }) {
  const [expandedIndex, setExpandedIndex] = React.useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <GradientHeader title="Bilgilendirme" navigation={navigation} />

      <ScrollView contentContainerStyle={styles.content}>
        {infoTopics.map((topic, index) => (
          <TouchableOpacity
            key={index}
            style={styles.topicCard}
            onPress={() => toggleExpand(index)}
            activeOpacity={0.7}
          >
            <View style={styles.topicHeader}>
              <Text style={styles.topicTitle}>{topic.title}</Text>
              <Ionicons
                name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={COLORS.textLight}
              />
            </View>
            {expandedIndex === index && (
              <Text style={styles.topicContent}>{topic.content}</Text>
            )}
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
  topicCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginRight: 10,
  },
  topicContent: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textLight,
  },
});
