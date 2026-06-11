import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation } from '@apollo/client/react';
import GradientHeader from '../../components/common/GradientHeader';
import GradientButton from '../../components/common/GradientButton';
import MealCard from '../../components/diet/MealCard';
import type { MainStackScreenProps } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import { GET_ACTIVE_DIET, GqlDiet, toMealView } from '../../services/diets.service';
import { REQUEST_DIET_PDF, GqlDietPdfDocument } from '../../services/documents.service';
import { colors, fonts, shadow } from '../../constants/theme';

export default function DietScreen({ navigation }: MainStackScreenProps<'Diet'>) {
  const { patientId } = useAuth();
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  // `activeDietByPatient` es non-null: si no hay plan activo el backend devuelve
  // un error NotFound. Con errorPolicy 'all' lo tratamos como "sin plan".
  const { data, loading } = useQuery<{ activeDietByPatient: GqlDiet | null }>(GET_ACTIVE_DIET, {
    variables: { patientId },
    skip: !patientId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const diet = data?.activeDietByPatient ?? null;

  const [requestDietPdf, { loading: pdfLoading }] = useMutation<{
    requestDietPdf: GqlDietPdfDocument;
  }>(REQUEST_DIET_PDF);

  const handleDownloadPdf = async () => {
    if (!diet) return;
    try {
      const { data: pdfData } = await requestDietPdf({ variables: { dietId: diet.id } });
      const url = pdfData?.requestDietPdf?.url;
      if (!url) throw new Error('no-url');

      // Sin compuerta canOpenURL: da falso negativo en dev build (Android 11+).
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        'No se pudo abrir el PDF',
        'No pudimos generar o abrir el plan de dieta. Inténtalo de nuevo en unos segundos.',
      );
    }
  };

  const days = useMemo(
    () => [...(diet?.days ?? [])].sort((a, b) => a.dayOrder - b.dayOrder),
    [diet],
  );

  const selectedDay =
    days.find((d) => d.id === selectedDayId) ?? days[0] ?? null;

  const meals = useMemo(
    () =>
      selectedDay
        ? [...selectedDay.meals].sort((a, b) => a.mealOrder - b.mealOrder).map(toMealView)
        : [],
    [selectedDay],
  );

  const dayCalories = meals.reduce((s, m) => s + m.totalCalories, 0);
  const totalCalories = diet?.estimatedCalories ?? dayCalories;

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

  const startDateLabel = diet.startDate
    ? new Date(diet.startDate).toLocaleDateString('es-ES', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null;

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
          {startDateLabel ? (
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={18} color={colors.gradientEnd} style={{ marginRight: 8 }} />
              <Text style={styles.infoLabel}>Desde</Text>
              <Text style={styles.infoValue}>{startDateLabel}</Text>
            </View>
          ) : null}
          {totalCalories > 0 && (
            <View style={styles.calorieBanner}>
              <Text style={styles.calorieTotalLabel}>Total del día</Text>
              <View style={styles.calorieValueRow}>
                <Text style={styles.calorieValue}>{totalCalories}</Text>
                <Text style={styles.calorieUnit}> kcal</Text>
              </View>
            </View>
          )}
        </View>

        {/* Day selector (sólo si el plan tiene más de un día) */}
        {days.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayChips}
          >
            {days.map((day) => {
              const active = selectedDay?.id === day.id;
              return (
                <TouchableOpacity
                  key={day.id}
                  onPress={() => setSelectedDayId(day.id)}
                  activeOpacity={0.85}
                  style={[styles.dayChip, active && styles.dayChipActive]}
                >
                  <Text style={[styles.dayChipText, active && styles.dayChipTextActive]}>
                    {day.dayLabel}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Meal cards */}
        <Text style={styles.sectionTitle}>Tiempos de comida</Text>
        {meals.length > 0 ? (
          meals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onPress={() =>
                navigation.navigate('DietMealDetail', {
                  mealLabel: meal.label,
                  totalCalories: meal.totalCalories,
                  items: meal.items,
                })
              }
            />
          ))
        ) : (
          <Text style={styles.emptySubtitle}>Este día aún no tiene comidas registradas.</Text>
        )}

        <GradientButton
          label={pdfLoading ? 'Generando PDF…' : 'Descargar PDF de la dieta'}
          onPress={handleDownloadPdf}
          loading={pdfLoading}
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
  dayChips: {
    gap: 8,
    paddingBottom: 16,
  },
  dayChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayChipActive: {
    backgroundColor: colors.gradientEnd,
    borderColor: colors.gradientEnd,
  },
  dayChipText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textMuted,
  },
  dayChipTextActive: {
    color: colors.white,
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
