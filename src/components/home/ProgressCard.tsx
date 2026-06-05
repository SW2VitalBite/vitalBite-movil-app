import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, gradientColors, radius, shadow } from '../../constants/theme';

interface ProgressCardProps {
  currentWeight: number;
  goalWeight: number;
  bmi: number;
}

export default function ProgressCard({ currentWeight, goalWeight, bmi }: ProgressCardProps) {
  const totalLoss = currentWeight - goalWeight;
  const progress = Math.max(0, Math.min(1, 1 - (currentWeight - goalWeight) / (74 - goalWeight)));

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Mi Progreso</Text>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{currentWeight} kg</Text>
          <Text style={styles.statLabel}>Peso actual</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{goalWeight} kg</Text>
          <Text style={styles.statLabel}>Objetivo</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{bmi}</Text>
          <Text style={styles.statLabel}>IMC</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressLabel}>Progreso hacia el objetivo</Text>
          <Text style={styles.progressPct}>{Math.round(progress * 100)}%</Text>
        </View>
        <View style={styles.track}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]}
          />
        </View>
        <Text style={styles.remaining}>Faltan {(currentWeight - goalWeight).toFixed(1)} kg</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    ...shadow.card,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textDark,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.gradientEnd,
  },
  statLabel: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  progressSection: {
    gap: 6,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  progressPct: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.gradientEnd,
  },
  track: {
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  remaining: {
    fontFamily: fonts.light,
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'right',
  },
});
