import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, gradientColors, radius } from '../../constants/theme';

interface DateChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export default function DateChip({ label, active, onPress, style }: DateChipProps) {
  if (active) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[{ borderRadius: radius.full, overflow: 'hidden' }, style]}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.chip}
        >
          <Text style={[styles.label, styles.activeLabel]}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.chip, styles.inactiveChip, style]}
    >
      <Text style={[styles.label, styles.inactiveLabel]}>{label}</Text>
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
  inactiveChip: {
    borderWidth: 1.5,
    borderColor: colors.gradientEnd,
    backgroundColor: colors.white,
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
