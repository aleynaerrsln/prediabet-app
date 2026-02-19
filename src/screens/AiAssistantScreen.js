import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import GradientHeader from '../components/GradientHeader';

const quickActions = [
  { label: 'Sağlık Durumum', icon: 'heart-outline', key: 'health_summary' },
  { label: 'Beslenme Önerisi', icon: 'nutrition-outline', key: 'diet_advice' },
  { label: 'Egzersiz Planı', icon: 'fitness-outline', key: 'exercise_plan' },
  { label: 'Risk Analizi', icon: 'analytics-outline', key: 'risk_analysis' },
];

const knowledgeBase = {
  prediyabet: 'Prediyabet, kan şekeri seviyelerinin normalden yüksek olduğu ancak diyabet tanısı konacak kadar yüksek olmadığı bir durumdur. Açlık kan şekeri 100-125 mg/dL arasındadır. Yaşam tarzı değişiklikleri ile diyabete ilerleme önlenebilir.',
  beslenme: 'Prediyabette beslenme önerileri:\n- Tam tahıllı ürünler tercih edin\n- Sebze ve meyve tüketimini artırın\n- Şekerli ve işlenmiş gıdalardan kaçının\n- Porsiyon kontrolü yapın\n- Günde 5-6 küçük öğün yiyin\n- Bol su için (günde 8-10 bardak)',
  egzersiz: 'DSÖ önerisi: Haftada en az 150 dakika orta yoğunlukta fiziksel aktivite yapın.\n- Günde 30 dakika tempolu yürüyüş\n- Haftada 2-3 gün güç egzersizleri\n- Merdiven kullanın, kısa mesafeleri yürüyün\n- Uzun süre oturmaktan kaçının',
  stres: 'Stres kan şekerinizi yükseltebilir. Stres yönetimi önerileri:\n- Derin nefes egzersizleri\n- Günde 10 dakika meditasyon\n- Düzenli uyku (7-8 saat)\n- Hobi edinme\n- Sosyal aktiviteler',
  su: 'Su tüketimi prediyabet yönetiminde çok önemlidir. Günde en az 2-2.5 litre su için. Su metabolizmanızı hızlandırır ve kan şekerinin dengelenmesine yardımcı olur.',
  uyku: 'Düzensiz uyku insülin direncini artırır. Her gece 7-8 saat uyumaya çalışın. Yatmadan önce ekran kullanımını azaltın ve karanlık bir ortamda uyuyun.',
  kilo: 'Fazla kilo prediyabet riskini artırır. Vücut ağırlığınızın %5-7\'sini vermek bile diyabet riskini %58 azaltabilir. Haftada 0.5-1 kg vermek sağlıklı bir hedeftir.',
};

function generateResponse(input, userData) {
  const lower = input.toLowerCase().replace(/[?!.,]/g, '');

  // Keyword matching
  if (lower.includes('prediyabet') || lower.includes('nedir') || lower.includes('gizli şeker'))
    return knowledgeBase.prediyabet;
  if (lower.includes('beslen') || lower.includes('yemek') || lower.includes('diyet') || lower.includes('ne yemeli'))
    return knowledgeBase.beslenme;
  if (lower.includes('egzersiz') || lower.includes('spor') || lower.includes('yürüyüş') || lower.includes('hareket'))
    return knowledgeBase.egzersiz;
  if (lower.includes('stres') || lower.includes('kaygı') || lower.includes('endişe'))
    return knowledgeBase.stres;
  if (lower.includes('su') || lower.includes('sıvı'))
    return knowledgeBase.su;
  if (lower.includes('uyku') || lower.includes('uyumak'))
    return knowledgeBase.uyku;
  if (lower.includes('kilo') || lower.includes('zayıfla') || lower.includes('diyet'))
    return knowledgeBase.kilo;
  if (lower.includes('merhaba') || lower.includes('selam') || lower.includes('hey'))
    return `Merhaba${userData.name ? ' ' + userData.name : ''}! Ben PREDIABET-TR Sağlık Asistanınız. Size prediyabet hakkında bilgi verebilir, kişisel sağlık verilerinizi analiz edebilirim. Nasıl yardımcı olabilirim?`;
  if (lower.includes('teşekkür') || lower.includes('sağol'))
    return 'Rica ederim! Sağlığınız için her zaman buradayım. Başka sorunuz varsa çekinmeyin.';

  return `Bu konuda size yardımcı olmak isterim. Şu konularda detaylı bilgi verebilirim:\n\n- Prediyabet nedir?\n- Beslenme önerileri\n- Egzersiz planı\n- Stres yönetimi\n- Su tüketimi\n- Uyku düzeni\n- Kilo yönetimi\n\nBu konulardan birini sormayı deneyin!`;
}

function generateQuickResponse(key, userData) {
  switch (key) {
    case 'health_summary': {
      let summary = '📊 **Sağlık Durumu Özeti**\n\n';
      if (userData.bmi) {
        const bmi = parseFloat(userData.bmi);
        const cat = bmi < 18.5 ? 'Zayıf' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Fazla Kilolu' : 'Obez';
        summary += `• BKİ Değeriniz: ${userData.bmi} (${cat})\n`;
        if (bmi >= 25) summary += '  ⚠️ Kilo vermeniz önerilir.\n';
        else if (bmi < 18.5) summary += '  ⚠️ Kilo almanız önerilir.\n';
        else summary += '  ✅ Sağlıklı aralıktasınız.\n';
      } else {
        summary += '• BKİ: Henüz hesaplanmadı. BKİ Hesaplama ekranını kullanın.\n';
      }
      if (userData.steps > 0) {
        summary += `\n• Günlük Adım: ${userData.steps.toLocaleString('tr-TR')}\n`;
        if (userData.steps >= 10000) summary += '  ✅ Harika! Günlük hedefinize ulaştınız.\n';
        else if (userData.steps >= 5000) summary += '  ⚠️ İyi gidiyorsunuz, hedefe biraz daha!\n';
        else summary += '  ❗ Daha fazla hareket etmeniz önerilir.\n';
      } else {
        summary += '\n• Adım Sayısı: Henüz veri yok. Adımsayar ekranını kullanın.\n';
      }
      summary += '\n💡 Düzenli olarak verilerinizi güncelleyin, böylece size daha iyi öneriler sunabilirim.';
      return summary;
    }
    case 'diet_advice': {
      let advice = '🥗 **Kişisel Beslenme Önerisi**\n\n';
      if (userData.bmi) {
        const bmi = parseFloat(userData.bmi);
        if (bmi >= 30) {
          advice += 'BKİ değeriniz yüksek. Öncelikli hedef: kalori açığı oluşturmak.\n\n';
          advice += '• Günlük 500 kalori azaltma hedefleyin\n';
          advice += '• Şekerli içecekleri tamamen bırakın\n';
          advice += '• Akşam 8\'den sonra yemek yemeyin\n';
          advice += '• Protein ağırlıklı beslenin (tavuk, balık, yumurta)\n';
        } else if (bmi >= 25) {
          advice += 'BKİ değeriniz biraz yüksek. Dengeli beslenme ile kilo kontrolü sağlayın.\n\n';
          advice += '• Porsiyon kontrolü yapın\n';
          advice += '• Tam tahıllı ürünler tercih edin\n';
          advice += '• Günde 5 porsiyon sebze-meyve tüketin\n';
          advice += '• Ara öğünlerde ceviz-badem tercih edin\n';
        } else {
          advice += 'BKİ değeriniz normal. Mevcut beslenme düzeninizi koruyun.\n\n';
          advice += '• Çeşitli besin gruplarından tüketin\n';
          advice += '• İşlenmiş gıdalardan kaçının\n';
          advice += '• Bol su için\n';
          advice += '• Akdeniz diyetini tercih edin\n';
        }
      } else {
        advice += 'BKİ veriniz yok. Genel prediyabet beslenme önerileri:\n\n';
        advice += '• Glisemik indeksi düşük gıdalar tercih edin\n';
        advice += '• Beyaz ekmek yerine tam buğday\n';
        advice += '• Şekerli gıdalardan uzak durun\n';
        advice += '• Lif oranı yüksek gıdalar tüketin\n';
      }
      advice += '\n📌 Daha doğru öneriler için BKİ Hesaplama ekranını kullanın.';
      return advice;
    }
    case 'exercise_plan': {
      let plan = '🏃 **Kişisel Egzersiz Planı**\n\n';
      if (userData.steps > 0) {
        if (userData.steps < 3000) {
          plan += `Günlük adımınız: ${userData.steps.toLocaleString('tr-TR')} - Başlangıç seviyesindesiniz.\n\n`;
          plan += '📅 Haftalık Plan:\n';
          plan += '• Pazartesi: 15 dk yürüyüş\n';
          plan += '• Salı: 10 dk esneme\n';
          plan += '• Çarşamba: 15 dk yürüyüş\n';
          plan += '• Perşembe: Dinlenme\n';
          plan += '• Cuma: 20 dk yürüyüş\n';
          plan += '• Cumartesi: 15 dk yürüyüş + esneme\n';
          plan += '• Pazar: Hafif aktivite\n';
        } else if (userData.steps < 7000) {
          plan += `Günlük adımınız: ${userData.steps.toLocaleString('tr-TR')} - Orta seviyesindesiniz.\n\n`;
          plan += '📅 Haftalık Plan:\n';
          plan += '• Pazartesi: 30 dk tempolu yürüyüş\n';
          plan += '• Salı: 20 dk esneme + güç\n';
          plan += '• Çarşamba: 30 dk yürüyüş\n';
          plan += '• Perşembe: 15 dk yoga\n';
          plan += '• Cuma: 30 dk yürüyüş\n';
          plan += '• Cumartesi: 40 dk yürüyüş\n';
          plan += '• Pazar: Aktif dinlenme\n';
        } else {
          plan += `Günlük adımınız: ${userData.steps.toLocaleString('tr-TR')} - Harika gidiyorsunuz!\n\n`;
          plan += '📅 Haftalık Plan (ileri seviye):\n';
          plan += '• Pazartesi: 45 dk tempolu yürüyüş\n';
          plan += '• Salı: 30 dk güç egzersizi\n';
          plan += '• Çarşamba: 40 dk yürüyüş + koşu\n';
          plan += '• Perşembe: 20 dk yoga/pilates\n';
          plan += '• Cuma: 45 dk yürüyüş\n';
          plan += '• Cumartesi: 60 dk doğa yürüyüşü\n';
          plan += '• Pazar: Esneme + dinlenme\n';
        }
      } else {
        plan += 'Adım veriniz yok. Genel başlangıç planı:\n\n';
        plan += '• Günde 30 dk yürüyüşle başlayın\n';
        plan += '• Haftada 150 dk orta yoğunluk hedefleyin\n';
        plan += '• Merdiven kullanın\n';
        plan += '• Her saat başı 5 dk ayağa kalkın\n';
      }
      plan += '\n🎯 Hedef: Günde 10.000 adım!';
      return plan;
    }
    case 'risk_analysis': {
      let analysis = '📈 **Diyabet Risk Analizi**\n\n';
      let riskFactors = 0;
      let totalFactors = 0;

      if (userData.bmi) {
        totalFactors++;
        const bmi = parseFloat(userData.bmi);
        if (bmi >= 25) { riskFactors++; analysis += '⚠️ BKİ yüksek (' + userData.bmi + ') - Risk faktörü\n'; }
        else analysis += '✅ BKİ normal (' + userData.bmi + ')\n';
      }

      if (userData.steps > 0) {
        totalFactors++;
        if (userData.steps < 5000) { riskFactors++; analysis += '⚠️ Düşük fiziksel aktivite - Risk faktörü\n'; }
        else analysis += '✅ Yeterli fiziksel aktivite\n';
      }

      totalFactors++;
      if (userData.foodCount > 0) {
        analysis += '✅ Beslenme takibi yapıyorsunuz\n';
      } else {
        riskFactors++;
        analysis += '⚠️ Beslenme takibi yapılmıyor - Risk faktörü\n';
      }

      analysis += '\n📊 Sonuç: ';
      if (totalFactors === 0) {
        analysis += 'Yeterli veri yok. Lütfen BKİ hesaplayın, adım sayın ve beslenme takibi yapın.';
      } else {
        const riskPercent = Math.round((riskFactors / totalFactors) * 100);
        if (riskPercent <= 30) analysis += 'Düşük risk! Mevcut alışkanlıklarınızı koruyun.';
        else if (riskPercent <= 60) analysis += 'Orta risk. Yaşam tarzı değişiklikleri yapmanız önerilir.';
        else analysis += 'Yüksek risk! Doktorunuza danışmanız ve acil yaşam tarzı değişiklikleri yapmanız önerilir.';
      }
      analysis += '\n\n💡 Verilerinizi düzenli güncelleyin, daha doğru analiz yapabileyim.';
      return analysis;
    }
    default:
      return 'Bu özellik yakında aktif olacaktır.';
  }
}

export default function AiAssistantScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userData, setUserData] = useState({});
  const scrollViewRef = useRef(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadUserData();
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    // Welcome message
    setTimeout(() => {
      addBotMessage('Merhaba! Ben PREDIABET-TR Yapay Zeka Sağlık Asistanınız. 🤖\n\nSize prediyabet hakkında bilgi verebilir, sağlık verilerinizi analiz edebilir ve kişisel öneriler sunabilirim.\n\nAşağıdaki hızlı butonları kullanabilir veya doğrudan soru sorabilirsiniz.');
    }, 500);
  }, []);

  const loadUserData = async () => {
    try {
      const [profile, bmiHistory, steps, foodDiary] = await Promise.all([
        AsyncStorage.getItem('profile'),
        AsyncStorage.getItem('bmiHistory'),
        AsyncStorage.getItem('currentSteps'),
        AsyncStorage.getItem('foodDiary'),
      ]);

      const data = {};
      if (profile) { const p = JSON.parse(profile); data.name = p.name; }
      if (bmiHistory) { const h = JSON.parse(bmiHistory); if (h.length > 0) data.bmi = h[0].bmi; }
      if (steps) data.steps = parseInt(steps);
      if (foodDiary) { const f = JSON.parse(foodDiary); data.foodCount = f.length; }
      setUserData(data);
    } catch (e) {}
  };

  const addBotMessage = (text) => {
    setMessages((prev) => [...prev, { id: Date.now(), text, isBot: true }]);
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), text: text.trim(), isBot: false };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const response = generateResponse(text, userData);
      addBotMessage(response);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleQuickAction = (key) => {
    const labels = { health_summary: 'Sağlık durumumu analiz et', diet_advice: 'Beslenme önerisi ver', exercise_plan: 'Egzersiz planı oluştur', risk_analysis: 'Risk analizimi yap' };
    const userMsg = { id: Date.now(), text: labels[key], isBot: false };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const response = generateQuickResponse(key, userData);
      addBotMessage(response);
      setIsTyping(false);
    }, 1000 + Math.random() * 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <GradientHeader title="AI Sağlık Asistanı" navigation={navigation} />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.chatArea}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {/* Quick Actions */}
          {messages.length <= 1 && (
            <Animated.View style={[styles.quickSection, { opacity: fadeAnim }]}>
              <Text style={styles.quickTitle}>Hızlı İşlemler</Text>
              <View style={styles.quickGrid}>
                {quickActions.map((action) => (
                  <TouchableOpacity
                    key={action.key}
                    style={styles.quickCard}
                    onPress={() => handleQuickAction(action.key)}
                    activeOpacity={0.7}
                  >
                    <LinearGradient colors={COLORS.gradient} style={styles.quickIconWrap}>
                      <Ionicons name={action.icon} size={22} color="#fff" />
                    </LinearGradient>
                    <Text style={styles.quickLabel}>{action.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Messages */}
          {messages.map((msg) => (
            <View key={msg.id} style={[styles.msgRow, msg.isBot ? styles.msgRowBot : styles.msgRowUser]}>
              {msg.isBot && (
                <View style={styles.botAvatar}>
                  <Ionicons name="medical" size={16} color={COLORS.white} />
                </View>
              )}
              <View style={[styles.msgBubble, msg.isBot ? styles.botBubble : styles.userBubble]}>
                <Text style={[styles.msgText, msg.isBot ? styles.botText : styles.userText]}>
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <View style={[styles.msgRow, styles.msgRowBot]}>
              <View style={styles.botAvatar}>
                <Ionicons name="medical" size={16} color={COLORS.white} />
              </View>
              <View style={[styles.msgBubble, styles.botBubble, styles.typingBubble]}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.typingText}>Düşünüyorum...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputArea}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Sorunuzu yazın..."
              value={inputText}
              onChangeText={setInputText}
              placeholderTextColor={COLORS.textLight}
              multiline
              maxLength={500}
              onSubmitEditing={() => sendMessage(inputText)}
            />
            <TouchableOpacity
              style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
              onPress={() => sendMessage(inputText)}
              disabled={!inputText.trim() || isTyping}
            >
              <Ionicons name="send" size={20} color={inputText.trim() ? COLORS.white : COLORS.textLight} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  chatArea: { padding: 16, paddingBottom: 10 },
  quickSection: { marginBottom: 10 },
  quickTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 12 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  quickCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  quickIconWrap: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  quickLabel: { fontSize: 12, fontWeight: '600', color: COLORS.text, textAlign: 'center' },
  msgRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end' },
  msgRowBot: { justifyContent: 'flex-start' },
  msgRowUser: { justifyContent: 'flex-end' },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  msgBubble: { maxWidth: '78%', borderRadius: 18, padding: 14 },
  botBubble: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  msgText: { fontSize: 14, lineHeight: 21 },
  botText: { color: COLORS.text },
  userText: { color: COLORS.white },
  typingBubble: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  typingText: { marginLeft: 8, fontSize: 13, color: COLORS.textLight, fontStyle: 'italic' },
  inputArea: {
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputWrap: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: COLORS.background, borderRadius: 24, paddingLeft: 16, paddingRight: 4, paddingVertical: 4 },
  input: { flex: 1, fontSize: 15, color: COLORS.text, maxHeight: 100, paddingVertical: 10 },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: { backgroundColor: COLORS.border },
});
