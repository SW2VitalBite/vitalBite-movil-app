import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientHeader from '../../components/common/GradientHeader';
import FoodItem from '../../components/diet/FoodItem';
import type { MainStackScreenProps } from '../../navigation/types';
import { mockDiet } from '../../mocks/data';
import { colors, fonts, radius, shadow } from '../../constants/theme';

export default function DietMealDetailScreen({ navigation, route }: MainStackScreenProps<'DietMealDetail'>) {
  const { mealId, mealLabel } = route.params;
  const meal = mockDiet.meals.find((m) => m.id === mealId) ?? mockDiet.meals[0];

  const totalProtein = meal.items.reduce((s, f) => s + f.protein, 0);
  const totalCarbs   = meal.items.reduce((s, f) => s + f.carbs, 0);
  const totalFat     = meal.items.reduce((s, f) => s + f.fat, 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title={mealLabel} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Meal header */}
        <View style={styles.mealHeader}>
          <View style={styles.mealIconArea}>
            <Ionicons name={meal.icon as any} size={32} color={colors.gradientEnd} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.mealTitle}>{meal.label}</Text>
            <Text style={styles.itemCountText}>{meal.items.length} alimentos</Text>
          </View>
          <View style={styles.totalCalArea}>
            <Text style={styles.totalCalValue}>{meal.totalCalories}</Text>
            <Text style={styles.totalCalUnit}>kcal</Text>
          </View>
        </View>

        {/* Macros summary */}
        <View style={styles.macroRow}>
          <MacroSummary label="Proteínas" value={`${totalProtein}g`} color="#1DB954" />
          <MacroSummary label="Carbohidratos" value={`${totalCarbs}g`} color="#FFB800" />
          <MacroSummary label="Grasas" value={`${totalFat}g`} color="#FF7043" />
        </View>

        {/* Food list */}
        <Text style={styles.listTitle}>Alimentos</Text>
        <View style={styles.foodList}>
          {meal.items.map((item) => (
            <FoodItem key={item.id} item={item} />
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsCard}>
          <Text style={styles.totalsTitle}>Totales del tiempo de comida</Text>
          <TotalRow label="Calorías" value={`${meal.totalCalories} kcal`} />
          <TotalRow label="Proteínas" value={`${totalProtein} g`} />
          <TotalRow label="Carbohidratos" value={`${totalCarbs} g`} />
          <TotalRow label="Grasas" value={`${totalFat} g`} />
        </View>
      </ScrollView>
    </View>
  );
}

function MacroSummary({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.macroCard, { borderColor: color + '40' }]}>
      <Text style={[styles.macroValue, { color }]}>{value}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.totalRow}>
      <Text style={styles.totalLabel}>{label}</Text>
      <Text style={styles.totalValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 48 },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 16,
    ...shadow.card,
  },
  mealIconArea: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mealTitle: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textDark,
  },
  itemCountText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  totalCalArea: {
    alignItems: 'flex-end',
  },
  totalCalValue: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.gradientEnd,
  },
  totalCalUnit: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  macroRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  macroCard: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  macroValue: {
    fontFamily: fonts.bold,
    fontSize: 18,
  },
  macroLabel: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 3,
    textAlign: 'center',
  },
  listTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 4,
  },
  foodList: {
    marginBottom: 20,
  },
  totalsCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    padding: 16,
    ...shadow.card,
    gap: 8,
  },
  totalsTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  totalValue: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.gradientEnd,
  },
});
