import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, fonts, radius } from '../../constants/theme';

interface OutlineButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
  color?: string;
}

export default function OutlineButton({
  label,
  onPress,
  disabled = false,
  style,
  fullWidth = true,
  color = colors.gradientEnd,
}: OutlineButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      style={[
        styles.button,
        fullWidth && styles.fullWidth,
        { borderColor: disabled ? colors.border : color },
        style,
      ]}
    >
      <Text style={[styles.label, { color: disabled ? colors.textMuted : color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: radius.xl,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    letterSpacing: 0.3,
  },
});
