import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client/react';
import GradientHeader from '../../components/common/GradientHeader';
import GradientButton from '../../components/common/GradientButton';
import MetricCard from '../../components/progress/MetricCard';
import ProgressChart from '../../components/progress/ProgressChart';
import type { MainStackScreenProps } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import { GET_BODY_MEASUREMENTS, GET_LATEST_BODY_COMPOSITION, GqlBodyMeasurement, GqlBodyComposition } from '../../services/progress.service';
import { goalWeightKg } from '../../mocks/data';
import { colors, fonts, radius, shadow } from '../../constants/theme';

export default function ProgressScreen({ navigation }: MainStackScreenProps<'Progress'>) {
  const { patientId } = useAuth();

  const { data: measData, loading: measLoading } = useQuery<{ bodyMeasurementsByPatient: GqlBodyMeasurement[] }>(GET_BODY_MEASUREMENTS, {
    variables: { patientId },
    skip: !patientId,
  });

  const { data: compData, loading: compLoading } = useQuery<{ latestBodyComposition: GqlBodyComposition | null }>(GET_LATEST_BODY_COMPOSITION, {
    variables: { patientId },
    skip: !patientId,
  });

  const measurements = measData?.bodyMeasurementsByPatient ?? [];
  const latest = measurements[0];
  const composition = compData?.latestBodyComposition;

  const chartData = [...measurements]
    .reverse()
    .map((m: any) => ({
      label: new Date(m.measuredAt).toLocaleDateString('es-ES', { month: 'numeric', day: 'numeric' }),
      value: m.weightKg,
    }));

  const progressPct = latest
    ? Math.round((1 - (latest.weightKg - goalWeightKg) / (74 - goalWeightKg)) * 100)
    : 0;

  const isLoading = measLoading || compLoading;

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Mi Progreso" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.gradientEnd} />
          </View>
        ) : (
          <>
            {/* Last check card */}
            {latest ? (
              <View style={styles.lastCheckCard}>
                <Text style={styles.lastCheckTitle}>Último control</Text>
                <Text style={styles.lastCheckDate}>
                  {new Date(latest.measuredAt).toLocaleDateString('es-ES', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </Text>
                <View style={styles.weightRow}>
                  <Text style={styles.weightVal}>{latest.weightKg} kg</Text>
                  {latest.bmi ? (
                    <>
                      <Text style={styles.separator}>·</Text>
                      <Text style={styles.bmiVal}>IMC {latest.bmi.toFixed(1)}</Text>
                    </>
                  ) : null}
                  <Text style={styles.separator}>·</Text>
                  <Text style={styles.progressPct}>{progressPct}% al objetivo</Text>
                </View>
              </View>
            ) : (
              <View style={styles.lastCheckCard}>
                <Text style={styles.emptyText}>Sin mediciones registradas</Text>
              </View>
            )}

            {/* Weight chart */}
            {chartData.length > 0 && (
              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Evolución del peso</Text>
                <ProgressChart data={chartData} unit="kg" height={100} />
              </View>
            )}

            {/* Body composition */}
            <Text style={styles.sectionTitle}>Composición corporal</Text>
            {composition ? (
              <>
                <View style={styles.metricsGrid}>
                  <MetricCard
                    icon="flame-outline"
                    label="Grasa corporal"
                    value={`${composition.bodyFatPercentage ?? '—'}`}
                    unit="%"
                    trend="neutral"
                    trendValue=""
                    color="#FF7043"
                  />
                  <MetricCard
                    icon="barbell-outline"
                    label="Masa muscular"
                    value={`${composition.muscleMassKg ?? '—'}`}
                    unit="kg"
                    trend="neutral"
                    trendValue=""
                    color="#1DB954"
                  />
                </View>
                <View style={[styles.metricsGrid, { marginTop: 12 }]}>
                  <MetricCard
                    icon="water-outline"
                    label="Agua corporal"
                    value={`${composition.waterPercentage ?? '—'}`}
                    unit="%"
                    trend="neutral"
                    trendValue=""
                    color={colors.gradientEnd}
                  />
                  <MetricCard
                    icon="body-outline"
                    label="Masa ósea"
                    value={`${composition.boneMassKg ?? '—'}`}
                    unit="kg"
                    trend="neutral"
                    trendValue=""
                    color="#9B59B6"
                  />
                </View>
              </>
            ) : (
              <Text style={styles.emptyText}>Sin datos de composición registrados</Text>
            )}

            <View style={styles.btnRow}>
              <GradientButton
                label="Ver historial completo"
                onPress={() => navigation.navigate('MeasurementsHistory')}
                style={{ flex: 1, marginRight: 8 }}
              />
            </View>

            <TouchableOpacity
              style={styles.chartDetailBtn}
              onPress={() => navigation.navigate('ProgressChart', { metric: 'bmi' })}
              activeOpacity={0.8}
            >
              <Ionicons name="analytics-outline" size={18} color={colors.gradientEnd} style={{ marginRight: 8 }} />
              <Text style={styles.chartDetailText}>Ver gráficas detalladas</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.gradientEnd} style={{ marginLeft: 4 }} />
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.pdfBtn} activeOpacity={0.8}>
              <Ionicons name="download-outline" size={18} color={colors.gradientEnd} style={{ marginRight: 8 }} />
              <Text style={styles.pdfBtnText}>Descargar reporte PDF</Text>
            </TouchableOpacity> */}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 48 },
  centered: { paddingVertical: 40, alignItems: 'center' },
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
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    paddingVertical: 4,
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
