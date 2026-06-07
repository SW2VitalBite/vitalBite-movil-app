import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { logoGradientSvg, logoWhiteSvg } from '../../assets/logoSvg';
import { colors, fonts } from '../../constants/theme';

interface LogoProps {
  size?: number;
  variant?: 'gradient' | 'white';
  showWordmark?: boolean;
  wordmarkSize?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Marca de VitalBite reutilizada del Design System de Figma (App Logo).
 * `gradient` para fondos claros, `white` para fondos con gradiente teal.
 */
export default function Logo({
  size = 96,
  variant = 'gradient',
  showWordmark = true,
  wordmarkSize = 28,
  style,
}: LogoProps) {
  const xml = variant === 'white' ? logoWhiteSvg : logoGradientSvg;
  const markColor = variant === 'white' ? colors.white : colors.gradientEnd;

  return (
    <View style={[styles.container, style]}>
      <SvgXml xml={xml} width={size} height={size} />
      {showWordmark && (
        <Text style={[styles.wordmark, { fontSize: wordmarkSize }]}>
          <Text style={[styles.wordmarkBold, { color: markColor, fontSize: wordmarkSize }]}>Vital</Text>
          <Text style={[styles.wordmarkLight, { color: markColor, fontSize: wordmarkSize }]}>Bite</Text>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    marginTop: 12,
    letterSpacing: -0.5,
  },
  wordmarkBold: {
    fontFamily: fonts.bold,
  },
  wordmarkLight: {
    fontFamily: fonts.regular,
  },
});
