import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@apollo/client/react';
import GradientHeader from '../../components/common/GradientHeader';
import DateChip from '../../components/common/DateChip';
import ProgressChart from '../../components/progress/ProgressChart';
import type { MainStackScreenProps } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import {
  GET_BODY_MEASUREMENTS,
  GET_BODY_COMPOSITION_HISTORY,
  GqlBodyMeasurement,
  GqlBodyComposition,
} from '../../services/progress.service';
import { colors, fonts, radius, shadow } from '../../constants/theme';

const METRICS = [
  { key: 'weight', label: 'Peso (kg)', source: 'meas' as const },
  { key: 'bmi', label: 'IMC', source: 'meas' as const },
  { key: 'bodyFatPct', label: 'Grasa %', source: 'comp' as const },
  { key: 'muscleMassKg', label: 'Músculo (kg)', source: 'comp' as const },
  { key: 'waterPct', label: 'Agua %', source: 'comp' as const },
];

const RANGES_DAYS: Record<string, number> = {
  '1 mes': 30,
  '3 meses': 90,
  '6 meses': 180,
  '1 año': 365,
};

function filterByDays<T extends { measuredAt: string }>(items: T[], days: number): T[] {
  const cutoff = new Date(Date.now() - days * 86400000);
  return items.filter((m) => new Date(m.measuredAt) >= cutoff);
}

function extractMeasValue(m: GqlBodyMeasurement, key: string): number | null {
  if (key === 'weight') return m.weightKg ?? null;
  if (key === 'bmi') return m.bmi ?? null;
  return null;
}

function extractCompValue(c: GqlBodyComposition, key: string): number | null {
  if (key === 'bodyFatPct') return c.bodyFatPercentage ?? null;
  if (key === 'muscleMassKg') return c.muscleMassKg ?? null;
  if (key === 'waterPct') return c.waterPercentage ?? null;
  return null;
}

export default function ProgressChartScreen({ navigation, route }: MainStackScreenProps<'ProgressChart'>) {
  const { metric: initialMetric } = route.params;
  const { patientId } = useAuth();
  const [activeMetric, setActiveMetric] = useState(initialMetric);
  const [activeRange, setActiveRange] = useState('6 meses');

  const { data: measData, loading: measLoading } = useQuery<{
    bodyMeasurementsByPatient: GqlBodyMeasurement[];
  }>(GET_BODY_MEASUREMENTS, { variables: { patientId }, skip: !patientId, fetchPolicy: 'cache-and-network' });

  const { data: compData, loading: compLoading } = useQuery<{
    bodyCompositionByPatient: GqlBodyComposition[];
  }>(GET_BODY_COMPOSITION_HISTORY, { variables: { patientId }, skip: !patientId, fetchPolicy: 'cache-and-network' });

  const metricConfig = METRICS.find((m) => m.key === activeMetric) ?? METRICS[0];
  const loading = measLoading || compLoading;
  const days = RANGES_DAYS[activeRange] ?? 180;

  const chartData = (() => {
    if (metricConfig.source === 'meas') {
      const all = measData?.bodyMeasurementsByPatient ?? [];
      return filterByDays(all, days)
        .reverse()
        .map((m) => ({
          label: new Date(m.measuredAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
          value: extractMeasValue(m, activeMetric),
        }))
        .filter((d): d is { label: string; value: number } => d.value !== null);
    } else {
      const all = compData?.bodyCompositionByPatient ?? [];
      return filterByDays(all, days)
        .reverse()
        .map((c) => ({
          label: new Date(c.measuredAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
          value: extractCompValue(c, activeMetric),
        }))
        .filter((d): d is { label: string; value: number } => d.value !== null);
    }
  })();

  const latest = chartData[chartData.length - 1];
  const prev = chartData[chartData.length - 2];
  const diff = latest && prev ? (latest.value - prev.value).toFixed(2) : null;
  const diffPositive = diff !== null && parseFloat(diff) >= 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Gráfica detallada" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Indicador</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {METRICS.map((m) => (
            <DateChip
              key={m.key}
              label={m.label}
              active={activeMetric === m.key}
              onPress={() => setActiveMetric(m.key)}
            />
          ))}
        </ScrollView>

        <Text style={styles.sectionLabel}>Período</Text>
        <View style={styles.rangeRow}>
          {Object.keys(RANGES_DAYS).map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.rangeBtn, activeRange === r && styles.rangeBtnActive]}
              onPress={() => setActiveRange(r)}
              activeOpacity={0.8}
            >
              <Text style={[styles.rangeBtnText, activeRange === r && styles.rangeBtnTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>{metricConfig.label}</Text>
          {loading ? (
            <ActivityIndicator color={colors.gradientEnd} style={{ marginVertical: 32 }} />
          ) : chartData.length === 0 ? (
            <Text style={styles.noDataText}>Sin datos para el período seleccionado</Text>
          ) : (
            <ProgressChart data={chartData} unit="" height={140} />
          )}
        </View>

        {diff !== null && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Interpretación</Text>
            <Text style={styles.summaryText}>
              Tu {metricConfig.label.toLowerCase()} {diffPositive ? 'aumentó' : 'disminuyó'}{' '}
              <Text style={[styles.diffText, { color: diffPositive ? colors.warning : colors.success }]}>
                {Math.abs(parseFloat(diff))}
              </Text>{' '}
              respecto a la medición anterior.
            </Text>
          </View>
        )}

        <Text style={styles.sectionLabel}>Tabla de datos</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableHeaderText}>Fecha</Text>
            <Text style={styles.tableHeaderText}>{metricConfig.label}</Text>
          </View>
          {[...chartData].reverse().map((d, i) => (
            <View key={i} style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}>
              <Text style={styles.tableCellDate}>{d.label}</Text>
              <Text style={styles.tableCellVal}>{d.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 48 },
  sectionLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 8,
  },
  chipRow: {
    gap: 8,
    paddingBottom: 4,
    marginBottom: 8,
  },
  rangeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  rangeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  rangeBtnActive: {
    borderColor: colors.gradientEnd,
    backgroundColor: colors.surfaceLight,
  },
  rangeBtnText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textMuted,
  },
  rangeBtnTextActive: {
    color: colors.gradientEnd,
  },
  chartCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 16,
    ...shadow.card,
  },
  chartTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 8,
  },
  noDataText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginVertical: 24,
  },
  summaryCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: colors.gradientEnd,
  },
  summaryTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 6,
  },
  summaryText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 21,
  },
  diffText: {
    fontFamily: fonts.bold,
  },
  table: {
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },
  tableHeader: {
    backgroundColor: colors.surfaceLight,
  },
  tableHeaderText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  tableRowAlt: {
    backgroundColor: '#FAFAFA',
  },
  tableCellDate: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  tableCellVal: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.gradientEnd,
  },
});
