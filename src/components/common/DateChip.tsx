import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, gradientColors, radius } from '../../constants/theme';

interface DateChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export default function DateChip({ label, active, onPress, style }: DateChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.chip, styles.clip, style]}
    >
      {/* Gradiente montado SIEMPRE (nunca se desmonta) → evita el bug de repintado
          de expo-linear-gradient en Fabric al cambiar de estado activo/inactivo. */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Capa blanca que oculta el gradiente cuando el chip está inactivo. */}
      {!active && <View style={[StyleSheet.absoluteFill, styles.inactiveCover]} />}
      <Text style={[styles.label, active ? styles.activeLabel : styles.inactiveLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clip: {
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  inactiveCover: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.gradientEnd,
    borderRadius: radius.full,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 13,
  },
  activeLabel: {
    color: colors.white,
  },
  inactiveLabel: {
    color: colors.gradientEnd,
  },
});
