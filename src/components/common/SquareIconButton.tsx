import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradientColors, radius, shadow } from '../../constants/theme';

interface SquareIconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  size?: number;
  gradient?: boolean;
  style?: ViewStyle;
  color?: string;
}

export default function SquareIconButton({
  icon,
  onPress,
  size = 48,
  gradient = true,
  style,
  color = colors.white,
}: SquareIconButtonProps) {
  const iconSize = size * 0.45;
  const br = size * 0.3;

  if (gradient) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[{ borderRadius: br, overflow: 'hidden', ...shadow.sm }, style]}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.container, { width: size, height: size, borderRadius: br }]}
        >
          <Ionicons name={icon} size={iconSize} color={color} />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.container,
        styles.outline,
        { width: size, height: size, borderRadius: br },
        style,
      ]}
    >
      <Ionicons name={icon} size={iconSize} color={colors.gradientEnd} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    borderWidth: 1.5,
    borderColor: colors.gradientEnd,
    backgroundColor: colors.surfaceLight,
  },
});
