import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, shadow } from '../../constants/theme';
import type { DietMealView } from '../../services/diets.service';

interface MealCardProps {
  meal: DietMealView;
  onPress?: () => void;
}

export default function MealCard({ meal, onPress }: MealCardProps) {
  const itemCount = meal.items.length;
  const previewNames = meal.items
    .slice(0, 3)
    .map((f) => f.name)
    .join(' · ');

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.88} style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconBadge}>
          <Ionicons name={meal.icon as any} size={22} color={colors.gradientEnd} />
        </View>
        <View style={styles.labelArea}>
          <Text style={styles.mealLabel}>{meal.label}</Text>
          <Text style={styles.itemCount}>{itemCount} alimento{itemCount !== 1 ? 's' : ''}</Text>
        </View>
        {meal.totalCalories > 0 && (
          <View style={styles.caloriesArea}>
            <Text style={styles.calories}>{meal.totalCalories}</Text>
            <Text style={styles.kcal}>kcal</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} style={{ marginLeft: 6 }} />
      </View>

      {previewNames ? <Text style={styles.preview} numberOfLines={1}>{previewNames}</Text> : null}
    </TouchableOpacity>
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
  preview: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 10,
  },
});
