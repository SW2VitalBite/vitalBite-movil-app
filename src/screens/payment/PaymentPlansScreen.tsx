import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GradientHeader from '../../components/common/GradientHeader';
import GradientButton from '../../components/common/GradientButton';
import type { MainStackScreenProps } from '../../navigation/types';
import { mockPaymentPlans } from '../../mocks/data';
import { colors, fonts, gradientColors, radius, shadow } from '../../constants/theme';

export default function PaymentPlansScreen({ navigation }: MainStackScreenProps<'PaymentPlans'>) {
  const [selected, setSelected] = useState('plan-pro');

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Planes de suscripción" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Elige el plan que mejor se adapte a tu consultorio
        </Text>

        {mockPaymentPlans.map((plan) => {
          const isSelected = selected === plan.id;
          return (
            <TouchableOpacity
              key={plan.id}
              onPress={() => setSelected(plan.id)}
              activeOpacity={0.85}
              style={[styles.planCard, isSelected && styles.planCardSelected]}
            >
              {plan.highlighted && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Más popular</Text>
                </View>
              )}
              <View style={styles.planHeader}>
                <View style={styles.planNameArea}>
                  <Text style={[styles.planName, isSelected && styles.planNameSelected]}>{plan.name}</Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.gradientEnd} />
                  )}
                </View>
                <View style={styles.priceRow}>
                  <Text style={[styles.currency, isSelected && styles.priceSelected]}>{plan.currency}</Text>
                  <Text style={[styles.price, isSelected && styles.priceSelected]}>{plan.price}</Text>
                  <Text style={[styles.period, isSelected && { color: colors.gradientEnd + 'CC' }]}>{plan.period}</Text>
                </View>
              </View>

              <View style={styles.featureList}>
                {plan.features.map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Ionicons
                      name="checkmark-outline"
                      size={14}
                      color={isSelected ? colors.gradientEnd : '#1DB954'}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}

        <GradientButton
          label={`Seleccionar ${mockPaymentPlans.find((p) => p.id === selected)?.name}`}
          onPress={() => navigation.navigate('PaymentForm', { planId: selected })}
          style={{ marginTop: 8 }}
        />

        <Text style={styles.cancelNote}>
          Cancela cuando quieras · Sin cargos ocultos
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 48 },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  planCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
    ...shadow.card,
  },
  planCardSelected: {
    borderColor: colors.gradientEnd,
    backgroundColor: colors.surfaceLight,
  },
  popularBadge: {
    position: 'absolute',
    top: -1,
    right: 16,
    backgroundColor: colors.gradientEnd,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  popularText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.white,
  },
  planHeader: {
    marginBottom: 12,
  },
  planNameArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  planName: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.textDark,
  },
  planNameSelected: {
    color: colors.gradientEnd,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  currency: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textMuted,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 34,
    color: colors.textDark,
  },
  priceSelected: {
    color: colors.gradientEnd,
  },
  period: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  featureList: {
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  cancelNote: {
    fontFamily: fonts.light,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 16,
  },
});
