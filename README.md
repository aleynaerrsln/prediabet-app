# PREDIABET-TR

Prediyabet riski tasiyan bireyler icin gelistirilmis kapsamli saglik takip mobil uygulamasi.

## Proje Notu

### Hedef Kullanici Kitlesi
Prediyabet tanisi almis veya diyabet riski tasiyan bireyler, saglikliyasam surdurmek isteyen herkes.

### Cozulmek Istenen Problem
Prediyabet hastalarinin gunluk saglik takibini kolaylastirmak, beslenme ve egzersiz aliskanliklarin duzenlenmesine yardimci olmak, yapay zeka destekli kisisel saglik danismanligi sunmak.

### Panodan Alinan Ilham
Pinterest panosundaki PREDIABET-TR uygulama tasarimlari temel alinarak ekran yapilari, renk paleti (kirmizi tonlari) ve menu duzeni olusturuldu. Pano uzerindeki profil, BKI hesaplama, anket ve bilgilendirme ekranlari referans alinarak modern ve kullanici dostu bir arayuz tasarlandi. Bunlarin uzerine AI asistan, adimsayar ve beslenme gunlugu gibi yaratici ozellikler eklendi.

## Kurulum ve Calistirma

```bash
# 1. Repoyu klonla
git clone https://github.com/aleynaerrsln/prediabet-app.git
cd prediabet-app

# 2. Bagimliliklari yukle
npm install

# 3. Uygulamayi baslat
npx expo start
```

Telefonda **Expo Go** uygulamasini indirip QR kodu tarayarak uygulamayi acabilirsiniz.

## Ozellikler

### Ana Ekranlar
- **Profil**: Kullanici bilgileri kaydetme (ad, telefon, sifre)
- **Bilgilendirme**: Prediyabet hakkinda 7 detayli saglik bilgisi
- **BKI Hesaplama**: Vucut Kitle Indeksi hesaplayici (renk kodlu sonuc, gecmis takibi)
- **On Testler / Son Testler**: FINDRISK diyabet risk anketi (7 sorulu, puanlama sistemi)
- **Besin Ekle**: Gunluk beslenme takibi (onerilen ve kacinilmasi gereken besinler)
- **Adimsayar**: Gercek pedometre sensoru + manuel adim ekleme, gunluk 10.000 adim hedefi
- **AI Asistan**: Yapay zeka destekli saglik danismani (kisisel oneriler)
- **Iletisim**: Telefon, e-posta, web, WhatsApp ile iletisim
- **Hakkimizda**: Uygulama ve gelistirici bilgileri
- **S.S.S.**: Sik sorulan sorular

### Yaratici Ozellikler
- Animasyonlu splash ekrani (LinearGradient + fade/scale animasyonlari)
- Kisisellestirilmis karsilama (Gunaydin/Iyi Gunler/Iyi Aksamlar + kullanici adi)
- Gunluk saglik ipucu ve motivasyon sozleri
- Renk kodlu BKI sonuclari (5 kategori: Zayif - Obez)
- Gercek pedometre sensoru entegrasyonu (expo-sensors)
- Adim sayar ilerleme cubugu (renk degisen)
- Anket ilerleme gostergesi
- Beslenme gunlugu (tuketilmeli/kacinilmali kategorileri)
- AI saglik asistani (kisisel analiz, beslenme onerisi, egzersiz plani, risk analizi)
- Modern gradient tasarim (tum header'lar, menuler, butonlar)
- Spring animasyonlar ve pulse efektleri

## Teknolojiler

- **React Native** + **Expo SDK 54**
- **React Navigation** (Native Stack)
- **AsyncStorage** (veri kaliciligi)
- **expo-linear-gradient** (gradient tasarim)
- **expo-sensors** (Pedometer API)
- **@expo/vector-icons** (Ionicons)
- **Animated API** (animasyonlar)

## Proje Yapisi

```
prediabet-app/
├── App.js                          # Ana navigasyon
├── src/
│   ├── constants/
│   │   └── theme.js                # Renk paleti ve temalar
│   ├── components/
│   │   └── GradientHeader.js       # Yeniden kullanilabilir gradient header
│   └── screens/
│       ├── SplashScreen.js         # Animasyonlu acilis ekrani
│       ├── HomeScreen.js           # Ana sayfa (dashboard)
│       ├── ProfileScreen.js        # Profil yonetimi
│       ├── InfoScreen.js           # Saglik bilgilendirme
│       ├── BmiScreen.js            # BKI hesaplayici
│       ├── SurveyScreen.js         # FINDRISK anketi
│       ├── FoodScreen.js           # Beslenme takibi
│       ├── StepCounterScreen.js    # Adimsayar
│       ├── AiAssistantScreen.js    # AI saglik asistani
│       ├── ContactScreen.js        # Iletisim
│       ├── AboutScreen.js          # Hakkimizda
│       └── FaqScreen.js            # SSS
└── package.json
```

## Gelistirici

Aleyna Erarslan - Samsun Universitesi
