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

const faqData = [
  {
    question: '1- Kan şekerinizi evde ölçebileceğinizi biliyor musunuz?',
    answer:
      'Cevap- Kan şekerinizi glükometre ile ev ortamında ölçebilirsiniz. Yaklaşık 5 saniye içerisinde dijital alanda sonuç görülmektedir. Kan şekeri ölçerken ilk gelen kanı pamukla silmeli devamında gelen kan ölçüm için kullanılmalıdır.',
  },
  {
    question: '2- Prediyabet (gizli şeker) tehlikeli bir hastalık mıdır?',
    answer:
      'Cevap- Kontrol altına alındıktan sonra prediyabet tehlikeli bir hastalık değildir. Hastalığı kontrol altında tutmanın bir diğer avantajı diyabete geçiş sürecinin önlenerek hastalık riskinin düşürülmesidir. Yaşam tarzı değişiklikleri prediyabet riskinin düşürülmesinde önemlidir. Dünya Sağlık Örgütü erişkinler için günde en az 30 dakika, haftanın en az beş günü olmak kaydıyla haftada minimum 150 dakika fiziksel aktivite yapılmasını önermektedir. Akdeniz diyetine bağlı bir beslenme sürdürülmesi yine düşük hastalık riski ile ilişkilendirilmiştir. Bu önerilere uyum sağlandığı taktirde prediyabet korkulacak bir hastalık olmayacaktır.',
  },
  {
    question: '3- Prediyabeti (gizli şeker) nasıl kontrol altına alabilirim?',
    answer:
      'Cevap- Hastalığın kontrol altında tutulması sağlıklı yaşam biçimi davranışlarına uyum gösterme ile mümkündür. Düzenli fiziksel aktivite, sağlıklı beslenme, kilo kontrolü ve düzenli sağlık kontrolleri prediyabetin kontrol altına alınmasında etkilidir.',
  },
  {
    question: '4- Prediyabet tanısı aldıktan sonra ne yapmalıyım?',
    answer:
      'Cevap- Prediyabet tanısı aldıktan sonra doktorunuzun önerilerine uymalı, düzenli kan şekeri takibi yapmalı, beslenme alışkanlıklarınızı gözden geçirmeli ve fiziksel aktiviteyi artırmalısınız. Ayrıca stres yönetimi ve düzenli uyku da önemlidir.',
  },
  {
    question: '5- Prediyabette hangi besinlerden kaçınmalıyım?',
    answer:
      'Cevap- Rafine şeker, beyaz ekmek, beyaz pirinç, şekerli içecekler, paketli gıdalar ve işlenmiş et ürünlerinden mümkün olduğunca kaçınılmalıdır. Bunların yerine tam tahıllı ürünler, taze sebze ve meyveler, baklagiller ve az yağlı protein kaynakları tercih edilmelidir.',
  },
];

export default function FaqScreen({ navigation }) {
  const [expandedIndex, setExpandedIndex] = React.useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <GradientHeader title="S.S.S." navigation={navigation} />

      <ScrollView contentContainerStyle={styles.content}>
        {faqData.map((faq, index) => (
          <TouchableOpacity
            key={index}
            style={styles.faqCard}
            onPress={() => toggleExpand(index)}
            activeOpacity={0.7}
          >
            <Text style={styles.questionText}>{faq.question}</Text>
            {expandedIndex === index && (
              <Text style={styles.answerText}>{faq.answer}</Text>
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
  faqCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 22,
  },
  answerText: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 21,
    color: COLORS.textLight,
    textAlign: 'justify',
  },
});
