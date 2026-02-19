import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.3));
  const [textAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(textAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start();

    const timer = setTimeout(() => onFinish(), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={['#8B0020', '#C41E3A', '#FF6B6B']} style={styles.container}>
      {/* Decorative circles */}
      <View style={[styles.decorCircle, styles.circle1]} />
      <View style={[styles.decorCircle, styles.circle2]} />
      <View style={[styles.decorCircle, styles.circle3]} />

      <Animated.View style={[styles.logoWrap, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.outerRing}>
          <View style={styles.innerRing}>
            <Ionicons name="medical" size={55} color={COLORS.white} />
          </View>
        </View>
      </Animated.View>

      <Animated.Text style={[styles.title, { opacity: textAnim, transform: [{ translateY: slideAnim }] }]}>
        PREDIABET-TR
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: textAnim, transform: [{ translateY: slideAnim }] }]}>
        Sağlıklı Yaşam Rehberiniz
      </Animated.Text>
      <Animated.View style={[styles.divider, { opacity: textAnim }]} />
      <Animated.Text style={[styles.tagline, { opacity: textAnim }]}>
        Prediyabeti kontrol altına alın
      </Animated.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  circle1: { width: width * 0.8, height: width * 0.8, top: -width * 0.2, right: -width * 0.3 },
  circle2: { width: width * 0.6, height: width * 0.6, bottom: -width * 0.1, left: -width * 0.2 },
  circle3: { width: width * 0.4, height: width * 0.4, top: '40%', left: -width * 0.15 },
  logoWrap: {
    marginBottom: 24,
  },
  outerRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  innerRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 8,
    letterSpacing: 1,
  },
  divider: {
    width: 50,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 2,
    marginTop: 20,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.5,
  },
});
