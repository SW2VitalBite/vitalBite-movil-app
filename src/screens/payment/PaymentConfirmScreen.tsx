import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import GradientButton from '../../components/common/GradientButton';
import type { MainStackScreenProps } from '../../navigation/types';
import { colors, fonts, gradientColors, radius } from '../../constants/theme';

export default function PaymentConfirmScreen({ navigation }: MainStackScreenProps<'PaymentConfirm'>) {
  const scale = new Animated.Value(0.5);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const transactionRef = '#VB-' + Math.floor(Math.random() * 900000 + 100000);
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconArea, { transform: [{ scale }], opacity }]}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.checkCircle}
        >
          <Ionicons name="checkmark" size={52} color={colors.white} />
        </LinearGradient>
      </Animated.View>

      <Text style={styles.title}>¡Pago exitoso!</Text>
      <Text style={styles.subtitle}>Tu suscripción ha sido activada correctamente</Text>

      <View style={styles.receiptCard}>
        <ReceiptRow label="Referencia" value={transactionRef} />
        <ReceiptRow label="Fecha" value={dateStr} />
        <ReceiptRow label="Hora" value={timeStr} />
        <ReceiptRow label="Plan" value="Profesional" />
        <ReceiptRow label="Monto" value="USD 59/mes" highlight />
      </View>

      <GradientButton
        label="Volver al inicio"
        onPress={() => (navigation as any).popToTop?.() ?? navigation.goBack()}
        style={{ marginBottom: 12 }}
      />
    </View>
  );
}

function ReceiptRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.receiptRow}>
      <Text style={styles.receiptLabel}>{label}</Text>
      <Text style={[styles.receiptValue, highlight && styles.receiptHighlight]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  iconArea: {
    marginBottom: 24,
  },
  checkCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.gradientEnd,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.textDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    maxWidth: 280,
  },
  receiptCard: {
    width: '100%',
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 28,
    gap: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.gradientEnd,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptLabel: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  receiptValue: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textDark,
  },
  receiptHighlight: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.gradientEnd,
  },
});
