import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import GradientHeader from '../../components/common/GradientHeader';
import DateChip from '../../components/common/DateChip';
import ProgressChart from '../../components/progress/ProgressChart';
import type { MainStackScreenProps } from '../../navigation/types';
import { mockMeasurements } from '../../mocks/data';
import { colors, fonts, radius, shadow } from '../../constants/theme';

const METRICS = [
  { key: 'weight', label: 'Peso (kg)' },
  { key: 'bmi', label: 'IMC' },
  { key: 'bodyFatPct', label: 'Grasa %' },
  { key: 'muscleMassKg', label: 'Músculo (kg)' },
  { key: 'waterPct', label: 'Agua %' },
];

const RANGES = ['1 mes', '3 meses', '6 meses', '1 año'];

export default function ProgressChartScreen({ navigation, route }: MainStackScreenProps<'ProgressChart'>) {
  const { metric: initialMetric, metricLabel } = route.params;
  const [activeMetric, setActiveMetric] = useState(initialMetric);
  const [activeRange, setActiveRange] = useState('6 meses');

  const metricConfig = METRICS.find((m) => m.key === activeMetric) ?? METRICS[0];

  const chartData = [...mockMeasurements]
    .reverse()
    .map((m) => ({
      label: m.date.slice(5),
      value: m[activeMetric as keyof typeof m] as number,
    }));

  const latest = chartData[chartData.length - 1];
  const prev = chartData[chartData.length - 2];
  const diff = latest && prev ? (latest.value - prev.value).toFixed(2) : '0';
  const diffPositive = parseFloat(diff) >= 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Gráfica detallada" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Metric selector */}
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

        {/* Range selector */}
        <Text style={styles.sectionLabel}>Período</Text>
        <View style={styles.rangeRow}>
          {RANGES.map((r) => (
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

        {/* Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>{metricConfig.label}</Text>
          <ProgressChart data={chartData} unit="" height={140} />
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Interpretación</Text>
          <Text style={styles.summaryText}>
            Tu {metricConfig.label.toLowerCase()} {diffPositive ? 'aumentó' : 'disminuyó'}{' '}
            <Text style={[styles.diffText, { color: diffPositive ? colors.warning : colors.success }]}>
              {Math.abs(parseFloat(diff))}
            </Text>{' '}
            respecto a la sesión anterior.
          </Text>
        </View>

        {/* Data table */}
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
