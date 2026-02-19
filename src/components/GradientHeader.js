import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function GradientHeader({ title, navigation }) {
  return (
    <LinearGradient colors={COLORS.gradientDark} style={styles.header}>
      <View style={styles.decorCircle} />
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.btn}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 42,
    paddingBottom: 18,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  decorCircle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -40,
    right: -30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btn: { padding: 5 },
  title: { color: COLORS.white, fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 },
});
