import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, shadow } from '../../constants/theme';
import type { MealSection } from '../../mocks/data';

interface MealCardProps {
  meal: MealSection;
  onPress?: () => void;
}

export default function MealCard({ meal, onPress }: MealCardProps) {
  const totalProtein = meal.items.reduce((s, f) => s + f.protein, 0);
  const totalCarbs   = meal.items.reduce((s, f) => s + f.carbs, 0);
  const totalFat     = meal.items.reduce((s, f) => s + f.fat, 0);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.88} style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconBadge}>
          <Ionicons name={meal.icon as any} size={22} color={colors.gradientEnd} />
        </View>
        <View style={styles.labelArea}>
          <Text style={styles.mealLabel}>{meal.label}</Text>
          <Text style={styles.itemCount}>{meal.items.length} alimento{meal.items.length !== 1 ? 's' : ''}</Text>
        </View>
        <View style={styles.caloriesArea}>
          <Text style={styles.calories}>{meal.totalCalories}</Text>
          <Text style={styles.kcal}>kcal</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} style={{ marginLeft: 6 }} />
      </View>

      <View style={styles.macroRow}>
        <MacroPill label="P" value={`${totalProtein}g`} color="#1DB954" />
        <MacroPill label="C" value={`${totalCarbs}g`} color="#FFB800" />
        <MacroPill label="G" value={`${totalFat}g`} color="#FF7043" />
      </View>
    </TouchableOpacity>
  );
}

function MacroPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.pill, { borderColor: color + '40', backgroundColor: color + '18' }]}>
      <Text style={[styles.pillLabel, { color }]}>{label}</Text>
      <Text style={[styles.pillValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 10,
    ...shadow.card,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  labelArea: {
    flex: 1,
  },
  mealLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textDark,
  },
  itemCount: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  caloriesArea: {
    alignItems: 'flex-end',
  },
  calories: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.gradientEnd,
  },
  kcal: {
    fontFamily: fonts.light,
    fontSize: 11,
    color: colors.textMuted,
  },
  macroRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    gap: 4,
  },
  pillLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
  },
  pillValue: {
    fontFamily: fonts.medium,
    fontSize: 11,
  },
});
