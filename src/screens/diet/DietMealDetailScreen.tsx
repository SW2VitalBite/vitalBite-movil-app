import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientHeader from '../../components/common/GradientHeader';
import FoodItem from '../../components/diet/FoodItem';
import type { MainStackScreenProps } from '../../navigation/types';
import { mealIcon } from '../../services/diets.service';
import { colors, fonts, radius, shadow } from '../../constants/theme';

export default function DietMealDetailScreen({ navigation, route }: MainStackScreenProps<'DietMealDetail'>) {
  const { mealLabel, totalCalories, items } = route.params;

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title={mealLabel} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Meal header */}
        <View style={styles.mealHeader}>
          <View style={styles.mealIconArea}>
            <Ionicons name={mealIcon(mealLabel) as any} size={32} color={colors.gradientEnd} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.mealTitle}>{mealLabel}</Text>
            <Text style={styles.itemCountText}>
              {items.length} alimento{items.length !== 1 ? 's' : ''}
            </Text>
          </View>
          {totalCalories > 0 && (
            <View style={styles.totalCalArea}>
              <Text style={styles.totalCalValue}>{totalCalories}</Text>
              <Text style={styles.totalCalUnit}>kcal</Text>
            </View>
          )}
        </View>

        {/* Food list */}
        <Text style={styles.listTitle}>Alimentos</Text>
        {items.length > 0 ? (
          <View style={styles.foodList}>
            {items.map((item) => (
              <FoodItem key={item.id} item={item} />
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>Esta comida aún no tiene alimentos registrados.</Text>
        )}

        {/* Totals */}
        {totalCalories > 0 && (
          <View style={styles.totalsCard}>
            <Text style={styles.totalsTitle}>Totales del tiempo de comida</Text>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Calorías</Text>
              <Text style={styles.totalValue}>{totalCalories} kcal</Text>
            </View>
          </View>
        )}
      </ScrollView>
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
  listTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 4,
  },
  foodList: {
    marginBottom: 20,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
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
