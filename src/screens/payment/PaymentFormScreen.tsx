import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientHeader from '../../components/common/GradientHeader';
import GradientButton from '../../components/common/GradientButton';
import InputField from '../../components/common/InputField';
import PaymentCard from '../../components/payment/PaymentCard';
import PaymentMethodRow from '../../components/payment/PaymentMethodRow';
import type { MainStackScreenProps } from '../../navigation/types';
import { mockPaymentPlans } from '../../mocks/data';
import { colors, fonts, radius } from '../../constants/theme';

const METHODS: { id: string; icon: any; label: string }[] = [
  { id: 'card', icon: 'card-outline', label: 'Add New Card' },
  { id: 'apple', icon: 'logo-apple', label: 'Apple Pay' },
  { id: 'paypal', icon: 'logo-paypal', label: 'Paypal' },
  { id: 'google', icon: 'logo-google', label: 'Google Pay' },
];

export default function PaymentFormScreen({ navigation, route }: MainStackScreenProps<'PaymentForm'>) {
  const { planId } = route.params;
  const plan = mockPaymentPlans.find((p) => p.id === planId) ?? mockPaymentPlans[1];
  const [method, setMethod] = useState('card');
  const [form, setForm] = useState({ cardNumber: '', holder: '', expiry: '', cvv: '' });
  const update = (k: keyof typeof form) => (v: string) => setForm({ ...form, [k]: v });

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <GradientHeader title="Datos de pago" onBack={() => navigation.goBack()} />

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.white }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Tarjeta visual (componente Figma) */}
        <PaymentCard
          number={form.cardNumber || '000 000 000 00'}
          holder={form.holder || 'Card Holder Name'}
          expiry={form.expiry || '04/28'}
          style={{ marginBottom: 20 }}
        />

        {/* Plan summary */}
        <View style={styles.planSummary}>
          <Ionicons name="checkmark-circle" size={18} color={colors.gradientEnd} style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.planLabel}>Plan seleccionado</Text>
            <Text style={styles.planName}>{plan.name}</Text>
          </View>
          <Text style={styles.planPrice}>{plan.currency} {plan.price}{plan.period}</Text>
        </View>

        {/* Payment method */}
        <Text style={styles.sectionLabel}>Método de pago</Text>
        {METHODS.map((m) => (
          <PaymentMethodRow
            key={m.id}
            icon={m.icon}
            label={m.label}
            selected={method === m.id}
            onPress={() => setMethod(m.id)}
          />
        ))}

        {method === 'card' && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: 12 }]}>Datos de la tarjeta</Text>
            <InputField
              label="Número de tarjeta"
              icon="card-outline"
              placeholder="0000 0000 0000 0000"
              keyboardType="numeric"
              value={form.cardNumber}
              onChangeText={update('cardNumber')}
            />
            <InputField
              label="Titular de la tarjeta"
              icon="person-outline"
              placeholder="Nombre completo"
              value={form.holder}
              onChangeText={update('holder')}
              autoCapitalize="words"
            />
            <View style={styles.cardRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <InputField
                  label="Vencimiento"
                  placeholder="MM/AA"
                  value={form.expiry}
                  onChangeText={update('expiry')}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <InputField
                  label="CVV"
                  placeholder="•••"
                  value={form.cvv}
                  onChangeText={update('cvv')}
                  isPassword
                  keyboardType="numeric"
                />
              </View>
            </View>
          </>
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total a pagar</Text>
          <Text style={styles.totalValue}>{plan.currency} {plan.price}</Text>
        </View>

        <GradientButton label="Pagar ahora" onPress={() => navigation.replace('PaymentConfirm')} />

        <View style={styles.secureRow}>
          <Ionicons name="lock-closed-outline" size={14} color={colors.textMuted} style={{ marginRight: 5 }} />
          <Text style={styles.secureText}>Pago seguro con cifrado SSL</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 48 },
  planSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: colors.gradientEnd,
  },
  planLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  planName: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textDark,
  },
  planPrice: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.gradientEnd,
  },
  sectionLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textDark,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 16,
    marginTop: 8,
  },
  totalLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textDark,
  },
  totalValue: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.gradientEnd,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  secureText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
});
