import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client/react';
import GradientHeader from '../../components/common/GradientHeader';
import GradientButton from '../../components/common/GradientButton';
import MealCard from '../../components/diet/MealCard';
import type { MainStackScreenProps } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import { GET_ACTIVE_DIET, GqlDiet, GqlDietMeal } from '../../services/diets.service';
import type { MealSection, FoodItem } from '../../mocks/data';
import { colors, fonts, radius, shadow } from '../../constants/theme';

const MEAL_META: Record<string, { type: MealSection['type']; label: string; icon: string }> = {
  DESAYUNO: { type: 'breakfast', label: 'Desayuno', icon: 'sunny-outline' },
  ALMUERZO: { type: 'lunch', label: 'Almuerzo', icon: 'partly-sunny-outline' },
  CENA: { type: 'dinner', label: 'Cena', icon: 'moon-outline' },
  MERIENDA: { type: 'snack', label: 'Merienda', icon: 'nutrition-outline' },
};

function toMealSection(meal: GqlDietMeal): MealSection {
  const meta = MEAL_META[meal.mealType] ?? { type: 'snack', label: meal.mealType, icon: 'nutrition-outline' };
  const items: FoodItem[] = (meal.items ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    portion: `${item.quantity} ${item.unit}`,
    calories: item.calories ?? 0,
    protein: item.protein ?? 0,
    carbs: item.carbs ?? 0,
    fat: item.fat ?? 0,
  }));
  const totalCalories = items.reduce((s, f) => s + f.calories, 0);
  return { id: meal.id, ...meta, items, totalCalories };
}

export default function DietScreen({ navigation }: MainStackScreenProps<'Diet'>) {
  const { patientId } = useAuth();

  const { data, loading, error } = useQuery<{ myActiveDiet: GqlDiet | null }>(GET_ACTIVE_DIET, {
    variables: { patientId },
    skip: !patientId,
    fetchPolicy: 'cache-and-network',
  });

  const diet = data?.myActiveDiet;
  const meals = (diet?.meals ?? []).map(toMealSection);
  const totalCalories = meals.reduce((s, m) => s + m.totalCalories, 0);

  if (loading && !diet) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <GradientHeader title="Mi Dieta" onBack={() => navigation.goBack()} />
        <ActivityIndicator color={colors.gradientEnd} style={{ marginTop: 40 }} />
      </View>
    );
  }

  if (!diet) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <GradientHeader title="Mi Dieta" onBack={() => navigation.goBack()} />
        <View style={styles.emptyContainer}>
          <Ionicons name="leaf-outline" size={64} color={colors.border} />
          <Text style={styles.emptyTitle}>Sin plan activo</Text>
          <Text style={styles.emptySubtitle}>
            Tu nutricionista aún no te ha asignado un plan de alimentación.
          </Text>
        </View>
      </View>
    );
  }

  const startDateLabel = new Date(diet.startDate).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Mi Dieta" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Diet info card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="leaf-outline" size={18} color={colors.gradientEnd} style={{ marginRight: 8 }} />
            <Text style={styles.infoLabel}>Plan</Text>
            <Text style={styles.infoValue}>{diet.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color={colors.gradientEnd} style={{ marginRight: 8 }} />
            <Text style={styles.infoLabel}>Desde</Text>
            <Text style={styles.infoValue}>{startDateLabel}</Text>
          </View>
          <View style={styles.calorieBanner}>
            <Text style={styles.calorieTotalLabel}>Total del día</Text>
            <View style={styles.calorieValueRow}>
              <Text style={styles.calorieValue}>{totalCalories}</Text>
              <Text style={styles.calorieUnit}> kcal</Text>
            </View>
          </View>
        </View>

        {/* Meal cards */}
        <Text style={styles.sectionTitle}>Tiempos de comida</Text>
        {meals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            onPress={() =>
              navigation.navigate('DietMealDetail', { mealId: meal.id, mealLabel: meal.label })
            }
          />
        ))}

        <GradientButton
          label="Descargar PDF de la dieta"
          onPress={() => {}}
          style={{ marginTop: 16, marginBottom: 8 }}
        />

        {diet.objective ? (
          <View style={styles.objectiveCard}>
            <Ionicons name="flag-outline" size={18} color={colors.gradientEnd} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.objLabel}>Objetivo del plan</Text>
              <Text style={styles.objValue}>{diet.objective}</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 48 },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.textDark,
  },
  emptySubtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    ...shadow.card,
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    flex: 1,
  },
  infoValue: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textDark,
    flexShrink: 1,
    textAlign: 'right',
    maxWidth: '60%',
  },
  calorieBanner: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calorieTotalLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textMuted,
  },
  calorieValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  calorieValue: {
    fontFamily: fonts.bold,
    fontSize: 26,
    color: colors.gradientEnd,
  },
  calorieUnit: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 12,
  },
  objectiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.gradientEnd,
  },
  objLabel: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.gradientEnd,
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  objValue: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
