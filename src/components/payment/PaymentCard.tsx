import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, gradientColors, radius } from '../../constants/theme';

interface PaymentCardProps {
  number?: string;
  holder?: string;
  expiry?: string;
  brand?: 'visa' | 'mastercard' | 'generic';
  style?: StyleProp<ViewStyle>;
}

/**
 * Tarjeta de crédito recreada del componente "Payment Method" del Design System
 * de Figma (gradiente teal, chip, número, titular y vencimiento).
 */
export default function PaymentCard({
  number = '000 000 000 00',
  holder = 'Card Holder Name',
  expiry = '04/28',
  brand = 'generic',
  style,
}: PaymentCardProps) {
  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, style]}
    >
      <View style={styles.topRow}>
        <View style={styles.chip}>
          <View style={styles.chipLine} />
          <View style={styles.chipLine} />
        </View>
        <Ionicons name="wifi-outline" size={22} color="rgba(255,255,255,0.9)" style={styles.contactless} />
      </View>

      <Text style={styles.number}>{number}</Text>

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.caption}>Card Holder Name</Text>
          <Text style={styles.value}>{holder}</Text>
        </View>
        <View>
          <Text style={styles.caption}>Expiry Date</Text>
          <Text style={styles.value}>{expiry}</Text>
        </View>
        <View style={styles.brandMark}>
          <View style={[styles.brandCircle, { backgroundColor: 'rgba(255,255,255,0.85)' }]} />
          <View style={[styles.brandCircle, styles.brandCircleOverlap]} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    aspectRatio: 1.7,
    borderRadius: radius.lg,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: colors.gradientEnd,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chip: {
    width: 42,
    height: 32,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.35)',
    padding: 6,
    justifyContent: 'space-between',
  },
  chipLine: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  contactless: {
    transform: [{ rotate: '90deg' }],
  },
  number: {
    fontFamily: fonts.semiBold,
    fontSize: 22,
    color: colors.white,
    letterSpacing: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  caption: {
    fontFamily: fonts.light,
    fontSize: 9,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 2,
  },
  value: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.white,
  },
  brandMark: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  brandCircleOverlap: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginLeft: -10,
  },
});
