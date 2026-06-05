import React from 'react';
import {
  View, Image, StyleSheet, ImageSourcePropType, StyleProp, ViewStyle, ImageStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

interface AvatarProps {
  source?: ImageSourcePropType | null;
  size?: number;
  ring?: boolean;
  ringColor?: string;
  fallbackIcon?: keyof typeof Ionicons.glyphMap;
  fallbackIconColor?: string;
  fallbackBg?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Avatar circular que reutiliza las fotos del Design System de Figma.
 * Si no recibe `source`, muestra un fallback con ícono.
 */
export default function Avatar({
  source,
  size = 50,
  ring = false,
  ringColor = 'rgba(255,255,255,0.6)',
  fallbackIcon = 'person',
  fallbackIconColor = colors.white,
  fallbackBg = colors.gradientEnd,
  style,
}: AvatarProps) {
  const dimension = { width: size, height: size, borderRadius: size / 2 };
  const ringStyle: ViewStyle = ring
    ? { borderWidth: size > 70 ? 3 : 2, borderColor: ringColor }
    : {};

  if (source) {
    return (
      <Image
        source={source}
        style={[dimension, ringStyle, style] as StyleProp<ImageStyle>}
        resizeMode="cover"
      />
    );
  }

  return (
    <View
      style={[
        dimension,
        ringStyle,
        styles.fallback,
        { backgroundColor: fallbackBg },
        style,
      ]}
    >
      <Ionicons name={fallbackIcon} size={size * 0.5} color={fallbackIconColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
