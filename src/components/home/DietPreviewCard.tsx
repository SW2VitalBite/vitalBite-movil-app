import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, shadow } from '../../constants/theme';

interface DietPreviewCardProps {
  dietName: string;
  nextMeal: string;
  onPress?: () => void;
}

export default function DietPreviewCard({ dietName, nextMeal, onPress }: DietPreviewCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.88} style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name="leaf" size={26} color={colors.gradientEnd} />
      </View>

      <View style={styles.info}>
        <Text style={styles.sectionTitle}>Mi Dieta Activa</Text>
        <Text style={styles.dietName} numberOfLines={1}>{dietName}</Text>
        <View style={styles.nextRow}>
          <Ionicons name="time-outline" size={12} color={colors.textMuted} style={{ marginRight: 3 }} />
          <Text style={styles.nextLabel}>Próx: <Text style={styles.nextMeal}>{nextMeal}</Text></Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color={colors.gradientEnd} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: colors.gradientEnd,
    ...shadow.card,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.gradientEnd,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  dietName: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textDark,
  },
  nextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  nextMeal: {
    fontFamily: fonts.medium,
    color: colors.textPrimary,
  },
});
