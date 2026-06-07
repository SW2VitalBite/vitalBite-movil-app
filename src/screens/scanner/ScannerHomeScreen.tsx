import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GradientHeader from '../../components/common/GradientHeader';
import type { MainStackScreenProps } from '../../navigation/types';
import { colors, fonts, gradientColors, radius, shadow } from '../../constants/theme';

type Mode = 'plate' | 'label';

const MODES: { mode: Mode; icon: keyof typeof Ionicons.glyphMap; title: string; body: string }[] = [
  {
    mode: 'plate',
    icon: 'restaurant-outline',
    title: 'Escanear plato',
    body: 'Fotografía tu comida y la IA identificará el alimento y su nivel de riesgo.',
  },
  {
    mode: 'label',
    icon: 'pricetag-outline',
    title: 'Escanear etiqueta',
    body: 'Apunta a la tabla nutricional de un producto para extraer sus nutrientes.',
  },
];

export default function ScannerHomeScreen({ navigation }: MainStackScreenProps<'ScannerHome'>) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Escáner Nutricional" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.illustrationArea}>
          <View style={styles.scanFrame}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <Ionicons name="scan-outline" size={72} color={colors.gradientEnd} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
          </View>
          <Text style={styles.illustrationTitle}>¿Qué deseas escanear?</Text>
          <Text style={styles.illustrationBody}>
            Elige el tipo de análisis. La cámara enviará la imagen al motor de IA para su evaluación.
          </Text>
        </View>

        {MODES.map(({ mode, icon, title, body }) => (
          <TouchableOpacity
            key={mode}
            style={styles.modeCard}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('ScannerCamera', { mode })}
          >
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modeIcon}
            >
              <Ionicons name={icon} size={28} color={colors.white} />
            </LinearGradient>
            <View style={styles.modeInfo}>
              <Text style={styles.modeTitle}>{title}</Text>
              <Text style={styles.modeBody}>{body}</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const cornerStyle = {
  position: 'absolute' as const,
  width: 22,
  height: 22,
  borderColor: colors.gradientEnd,
};

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 48 },
  illustrationArea: { alignItems: 'center', marginBottom: 28, paddingTop: 12 },
  scanFrame: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 20,
    marginBottom: 22,
    position: 'relative',
  },
  cornerTL: { ...cornerStyle, top: 10, left: 10, borderTopWidth: 2.5, borderLeftWidth: 2.5 },
  cornerTR: { ...cornerStyle, top: 10, right: 10, borderTopWidth: 2.5, borderRightWidth: 2.5 },
  cornerBL: { ...cornerStyle, bottom: 10, left: 10, borderBottomWidth: 2.5, borderLeftWidth: 2.5 },
  cornerBR: { ...cornerStyle, bottom: 10, right: 10, borderBottomWidth: 2.5, borderRightWidth: 2.5 },
  illustrationTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 10,
  },
  illustrationBody: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 12,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 14,
    ...shadow.card,
  },
  modeIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  modeInfo: { flex: 1 },
  modeTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 3,
  },
  modeBody: {
    fontFamily: fonts.regular,
    fontSize: 12.5,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
