import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius } from '../../constants/theme';

interface PaymentMethodRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

/**
 * Fila de método de pago reutilizada del Design System de Figma
 * (Add New Card / Apple Pay / Paypal / Google Pay): pastilla con ícono a la
 * izquierda, etiqueta y radio de selección a la derecha.
 */
export default function PaymentMethodRow({
  icon,
  label,
  selected = false,
  onPress,
}: PaymentMethodRowProps) {
  return (
    <TouchableOpacity
      style={[styles.row, selected && styles.rowSelected]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Ionicons
        name={icon}
        size={20}
        color={selected ? colors.gradientEnd : colors.textMuted}
        style={styles.leftIcon}
      />
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioDot} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  rowSelected: {
    borderColor: colors.gradientEnd,
  },
  leftIcon: {
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  labelSelected: {
    color: colors.gradientEnd,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.gradientEnd,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.gradientEnd,
  },
});
