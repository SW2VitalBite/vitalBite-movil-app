import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientHeader from '../../components/common/GradientHeader';
import GradientButton from '../../components/common/GradientButton';
import MetricCard from '../../components/progress/MetricCard';
import ProgressChart from '../../components/progress/ProgressChart';
import type { MainStackScreenProps } from '../../navigation/types';
import { latestMeasurement, mockMeasurements, goalWeightKg } from '../../mocks/data';
import { colors, fonts, radius, shadow } from '../../constants/theme';

export default function ProgressScreen({ navigation }: MainStackScreenProps<'Progress'>) {
  const chartData = [...mockMeasurements]
    .reverse()
    .map((m) => ({ label: m.date.slice(5), value: m.weight }));

  const progressPct = Math.round(
    (1 - (latestMeasurement.weight - goalWeightKg) / (74 - goalWeightKg)) * 100,
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Mi Progreso" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Last check card */}
        <View style={styles.lastCheckCard}>
          <Text style={styles.lastCheckTitle}>Último control</Text>
          <Text style={styles.lastCheckDate}>{latestMeasurement.date}</Text>
          <View style={styles.weightRow}>
            <Text style={styles.weightVal}>{latestMeasurement.weight} kg</Text>
            <Text style={styles.separator}>·</Text>
            <Text style={styles.bmiVal}>IMC {latestMeasurement.bmi}</Text>
            <Text style={styles.separator}>·</Text>
            <Text style={styles.progressPct}>{progressPct}% al objetivo</Text>
          </View>
        </View>

        {/* Weight chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Evolución del peso</Text>
          <ProgressChart data={chartData} unit="kg" height={100} />
        </View>

        {/* Metrics grid */}
        <Text style={styles.sectionTitle}>Composición corporal</Text>
        <View style={styles.metricsGrid}>
          <MetricCard
            icon="flame-outline"
            label="Grasa corporal"
            value={`${latestMeasurement.bodyFatPct}`}
            unit="%"
            trend="down"
            trendValue="-0.6% vs. anterior"
            color="#FF7043"
          />
          <MetricCard
            icon="barbell-outline"
            label="Masa muscular"
            value={`${latestMeasurement.muscleMassKg}`}
            unit="kg"
            trend="up"
            trendValue="+0.4 kg vs. anterior"
            color="#1DB954"
          />
        </View>
        <View style={[styles.metricsGrid, { marginTop: 12 }]}>
          <MetricCard
            icon="water-outline"
            label="Agua corporal"
            value={`${latestMeasurement.waterPct}`}
            unit="%"
            trend="up"
            trendValue="+0.4% vs. anterior"
            color={colors.gradientEnd}
          />
          <MetricCard
            icon="body-outline"
            label="Masa ósea"
            value={`${latestMeasurement.boneMassKg}`}
            unit="kg"
            trend="neutral"
            trendValue="Sin cambio"
            color="#9B59B6"
          />
        </View>

        <View style={styles.btnRow}>
          <GradientButton
            label="Ver historial completo"
            onPress={() => navigation.navigate('MeasurementsHistory')}
            style={{ flex: 1, marginRight: 8 }}
          />
        </View>

        <TouchableOpacity
          style={styles.chartDetailBtn}
          onPress={() => navigation.navigate('ProgressChart', { metric: 'bmi', metricLabel: 'IMC' })}
          activeOpacity={0.8}
        >
          <Ionicons name="analytics-outline" size={18} color={colors.gradientEnd} style={{ marginRight: 8 }} />
          <Text style={styles.chartDetailText}>Ver gráficas detalladas</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.gradientEnd} style={{ marginLeft: 4 }} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.pdfBtn} activeOpacity={0.8}>
          <Ionicons name="download-outline" size={18} color={colors.gradientEnd} style={{ marginRight: 8 }} />
          <Text style={styles.pdfBtnText}>Descargar reporte PDF</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 48 },
  lastCheckCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...shadow.card,
  },
  lastCheckTitle: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.gradientEnd,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  lastCheckDate: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 8,
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  weightVal: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.gradientEnd,
  },
  separator: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.textMuted,
  },
  bmiVal: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  progressPct: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: '#1DB954',
  },
  chartCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    ...shadow.card,
  },
  chartTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textDark,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 12,
  },
  chartDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    marginBottom: 10,
  },
  chartDetailText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.gradientEnd,
  },
  pdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  pdfBtnText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.gradientEnd,
  },
});
