import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientHeader from '../../components/common/GradientHeader';
import GradientButton from '../../components/common/GradientButton';
import type { MainStackScreenProps } from '../../navigation/types';
import { mockScanHistory } from '../../mocks/data';
import { colors, fonts, radius, shadow } from '../../constants/theme';

export default function ScannerHomeScreen({ navigation }: MainStackScreenProps<'ScannerHome'>) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Escáner Nutricional" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Illustration */}
        <View style={styles.illustrationArea}>
          <View style={styles.scanFrame}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <Ionicons name="scan-outline" size={80} color={colors.gradientEnd} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
          </View>
          <Text style={styles.illustrationTitle}>Escanea etiquetas nutricionales</Text>
          <Text style={styles.illustrationBody}>
            Apunta la cámara al código de barras o etiqueta nutricional del producto para obtener su información al instante.
          </Text>
        </View>

        <GradientButton
          label="Abrir cámara"
          onPress={() => navigation.navigate('ScannerCamera')}
          style={{ marginBottom: 24 }}
        />

        {/* Scan history */}
        {mockScanHistory.length > 0 && (
          <>
            <Text style={styles.historyTitle}>Escaneos recientes</Text>
            {mockScanHistory.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.historyCard}
                onPress={() => navigation.navigate('ScannerResult')}
                activeOpacity={0.85}
              >
                <View style={styles.historyIconArea}>
                  <Ionicons name="barcode-outline" size={26} color={colors.gradientEnd} />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyName}>{product.name}</Text>
                  <Text style={styles.historyBrand}>{product.brand}</Text>
                  <Text style={styles.historyDate}>{product.scannedAt}</Text>
                </View>
                <View style={styles.caloriesBadge}>
                  <Text style={styles.caloriesBadgeText}>{product.calories}</Text>
                  <Text style={styles.calUnit}>kcal</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
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
  illustrationArea: {
    alignItems: 'center',
    marginBottom: 28,
    paddingTop: 12,
  },
  scanFrame: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 20,
    marginBottom: 24,
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
  historyTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 12,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 10,
    ...shadow.card,
  },
  historyIconArea: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textDark,
  },
  historyBrand: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  historyDate: {
    fontFamily: fonts.light,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 3,
  },
  caloriesBadge: {
    alignItems: 'flex-end',
  },
  caloriesBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.gradientEnd,
  },
  calUnit: {
    fontFamily: fonts.light,
    fontSize: 11,
    color: colors.textMuted,
  },
});
