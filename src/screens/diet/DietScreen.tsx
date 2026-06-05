import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientHeader from '../../components/common/GradientHeader';
import GradientButton from '../../components/common/GradientButton';
import MealCard from '../../components/diet/MealCard';
import type { MainStackScreenProps } from '../../navigation/types';
import { mockDiet } from '../../mocks/data';
import { colors, fonts, radius, shadow } from '../../constants/theme';

export default function DietScreen({ navigation }: MainStackScreenProps<'Diet'>) {
  const totalCalories = mockDiet.meals.reduce((s, m) => s + m.totalCalories, 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Mi Dieta" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Diet info card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="leaf-outline" size={18} color={colors.gradientEnd} style={{ marginRight: 8 }} />
            <Text style={styles.infoLabel}>Plan</Text>
            <Text style={styles.infoValue}>{mockDiet.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={18} color={colors.gradientEnd} style={{ marginRight: 8 }} />
            <Text style={styles.infoLabel}>Asignado por</Text>
            <Text style={styles.infoValue}>{mockDiet.nutritionist}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color={colors.gradientEnd} style={{ marginRight: 8 }} />
            <Text style={styles.infoLabel}>Desde</Text>
            <Text style={styles.infoValue}>{mockDiet.assignedDate}</Text>
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
        {mockDiet.meals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            onPress={() => navigation.navigate('DietMealDetail', { mealId: meal.id, mealLabel: meal.label })}
          />
        ))}

        <GradientButton
          label="Descargar PDF de la dieta"
          onPress={() => {}}
          style={{ marginTop: 16, marginBottom: 8 }}
        />

        <View style={styles.objectiveCard}>
          <Ionicons name="flag-outline" size={18} color={colors.gradientEnd} style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.objLabel}>Objetivo del plan</Text>
            <Text style={styles.objValue}>{mockDiet.objective}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 48,
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
