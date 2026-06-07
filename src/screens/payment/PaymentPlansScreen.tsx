import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client/react';
import GradientHeader from '../../components/common/GradientHeader';
import GradientButton from '../../components/common/GradientButton';
import type { MainStackScreenProps } from '../../navigation/types';
import { GET_SUBSCRIPTION_PLANS, GqlSubscriptionPlan } from '../../services/payments.service';
import { colors, fonts, radius, shadow } from '../../constants/theme';

export default function PaymentPlansScreen({ navigation }: MainStackScreenProps<'PaymentPlans'>) {
  const [selected, setSelected] = useState<string | null>(null);

  const { data, loading, error } = useQuery<{ subscriptionPlans: GqlSubscriptionPlan[] }>(GET_SUBSCRIPTION_PLANS);
  const plans: GqlSubscriptionPlan[] = data?.subscriptionPlans ?? [];

  // Seleccionar el primero por defecto cuando llegan los datos
  React.useEffect(() => {
    if (plans.length > 0 && !selected) {
      setSelected(plans[0].code);
    }
  }, [plans]);

  const selectedPlan = plans.find((p) => p.code === selected);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Planes de suscripción" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Elige el plan que mejor se adapte a tu consultorio
        </Text>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.gradientEnd} />
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>Error al cargar los planes</Text>
          </View>
        ) : (
          <>
            {plans.map((plan, index) => {
              const isSelected = selected === plan.code;
              const isHighlighted = index === 1;
              return (
                <TouchableOpacity
                  key={plan.code}
                  onPress={() => setSelected(plan.code)}
                  activeOpacity={0.85}
                  style={[styles.planCard, isSelected && styles.planCardSelected]}
                >
                  {isHighlighted && (
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
                      <Text style={[styles.currency, isSelected && styles.priceSelected]}>USD</Text>
                      <Text style={[styles.price, isSelected && styles.priceSelected]}>{plan.priceUsd}</Text>
                      <Text style={[styles.period, isSelected && { color: colors.gradientEnd + 'CC' }]}>
                        /{plan.billingPeriod === 'MONTHLY' ? 'mes' : 'año'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.featureList}>
                    {plan.included.map((f, i) => (
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

            {selectedPlan && (
              <GradientButton
                label={`Seleccionar ${selectedPlan.name}`}
                onPress={() => navigation.navigate('PaymentForm', { planId: selectedPlan.code })}
                style={{ marginTop: 8 }}
              />
            )}

            <Text style={styles.cancelNote}>
              Cancela cuando quieras · Sin cargos ocultos
            </Text>
          </>
        )}
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
  centered: { paddingVertical: 48, alignItems: 'center' },
  errorText: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted },
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
  popularText: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.white },
  planHeader: { marginBottom: 12 },
  planNameArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  planName: { fontFamily: fonts.semiBold, fontSize: 18, color: colors.textDark },
  planNameSelected: { color: colors.gradientEnd },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 3 },
  currency: { fontFamily: fonts.medium, fontSize: 14, color: colors.textMuted },
  price: { fontFamily: fonts.bold, fontSize: 34, color: colors.textDark },
  priceSelected: { color: colors.gradientEnd },
  period: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted },
  featureList: {
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  featureRow: { flexDirection: 'row', alignItems: 'center' },
  featureText: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted },
  cancelNote: {
    fontFamily: fonts.light,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 16,
  },
});
