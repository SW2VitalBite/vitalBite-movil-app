import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client/react';
import GradientHeader from '../../components/common/GradientHeader';
import type { MainStackScreenProps } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import {
  GET_BODY_MEASUREMENTS,
  GET_BODY_COMPOSITION_HISTORY,
  GET_ANTHROPOMETRY_HISTORY,
  ANTHROPOMETRY_FIELDS,
  GqlBodyMeasurement,
  GqlBodyComposition,
  GqlAnthropometry,
} from '../../services/progress.service';
import { colors, fonts, radius, shadow } from '../../constants/theme';

export default function MeasurementsHistoryScreen({ navigation }: MainStackScreenProps<'MeasurementsHistory'>) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { patientId } = useAuth();

  const { data: measData, loading: measLoading } = useQuery<{ bodyMeasurementsByPatient: GqlBodyMeasurement[] }>(GET_BODY_MEASUREMENTS, {
    variables: { patientId },
    skip: !patientId,
  });

  const { data: compData } = useQuery<{ bodyCompositionByPatient: GqlBodyComposition[] }>(GET_BODY_COMPOSITION_HISTORY, {
    variables: { patientId },
    skip: !patientId,
  });

  const { data: anthroData } = useQuery<{ anthropometryByPatient: GqlAnthropometry[] }>(GET_ANTHROPOMETRY_HISTORY, {
    variables: { patientId },
    skip: !patientId,
  });

  const measurements = measData?.bodyMeasurementsByPatient ?? [];
  const compositions = compData?.bodyCompositionByPatient ?? [];
  const anthropometries = anthroData?.anthropometryByPatient ?? [];

  // Join mediciones con composición por fecha aproximada (mismo día)
  const compositionByDate: Record<string, any> = {};
  for (const c of compositions) {
    const key = new Date(c.measuredAt).toDateString();
    compositionByDate[key] = c;
  }

  // Antropometría enlazada por FK (body_measurement_id) y, como respaldo, por día.
  const anthroByMeasurementId: Record<string, GqlAnthropometry> = {};
  const anthroByDate: Record<string, GqlAnthropometry> = {};
  for (const a of anthropometries) {
    if (a.bodyMeasurementId) anthroByMeasurementId[a.bodyMeasurementId] = a;
    anthroByDate[new Date(a.measuredAt).toDateString()] = a;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Historial de mediciones" onBack={() => navigation.goBack()} />

      {measLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.gradientEnd} />
        </View>
      ) : (
        <FlatList
          data={measurements}
          keyExtractor={(m: any) => m.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>Sin mediciones registradas</Text>
            </View>
          }
          renderItem={({ item, index }: { item: any; index: number }) => {
            const isOpen = expanded === item.id;
            const isFirst = index === 0;
            const dateKey = new Date(item.measuredAt).toDateString();
            const comp = compositionByDate[dateKey];
            const anthro = anthroByMeasurementId[item.id] ?? anthroByDate[dateKey];
            const anthroValues = anthro
              ? ANTHROPOMETRY_FIELDS.map((f) => ({ ...f, value: anthro[f.key] as number | null | undefined }))
                  .filter((f) => f.value != null)
              : [];

            return (
              <View style={[styles.card, isFirst && styles.cardHighlight]}>
                <TouchableOpacity
                  style={styles.cardHeader}
                  onPress={() => setExpanded(isOpen ? null : item.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.leftArea}>
                    {isFirst && (
                      <View style={styles.latestBadge}>
                        <Text style={styles.latestText}>Último</Text>
                      </View>
                    )}
                    <Text style={styles.dateText}>
                      {new Date(item.measuredAt).toLocaleDateString('es-ES', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </Text>
                  </View>
                  <View style={styles.rightArea}>
                    <Text style={styles.weightText}>{item.weightKg} kg</Text>
                    {item.bmi ? <Text style={styles.bmiText}>IMC {item.bmi.toFixed(1)}</Text> : null}
                    <Ionicons
                      name={isOpen ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={colors.textMuted}
                      style={{ marginLeft: 8 }}
                    />
                  </View>
                </TouchableOpacity>

                {isOpen && (
                  <View style={styles.cardBody}>
                    {comp ? (
                      <View style={styles.measureGrid}>
                        <MeasureItem label="Grasa corporal" value={comp.bodyFatPercentage != null ? `${comp.bodyFatPercentage}%` : '—'} />
                        <MeasureItem label="Masa muscular" value={comp.muscleMassKg != null ? `${comp.muscleMassKg} kg` : '—'} />
                        <MeasureItem label="Agua corporal" value={comp.waterPercentage != null ? `${comp.waterPercentage}%` : '—'} />
                        <MeasureItem label="Masa ósea" value={comp.boneMassKg != null ? `${comp.boneMassKg} kg` : '—'} />
                      </View>
                    ) : null}
                    {anthroValues.length > 0 ? (
                      <View style={styles.anthroSection}>
                        <Text style={styles.anthroTitle}>Perímetros corporales</Text>
                        <View style={styles.anthroGrid}>
                          {anthroValues.map((f) => (
                            <View key={f.key} style={styles.anthroItem}>
                              <Text style={styles.anthroVal}>{f.value} cm</Text>
                              <Text style={styles.anthroLabel}>{f.label}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    ) : (
                      <View style={styles.circumRow}>
                        <CircumItem label="Cintura" value={item.waistCm != null ? `${item.waistCm} cm` : '—'} />
                        <CircumItem label="Cadera" value={item.hipCm != null ? `${item.hipCm} cm` : '—'} />
                      </View>
                    )}
                    <TouchableOpacity
                      style={styles.pdfRow}
                      activeOpacity={0.8}
                      onPress={() => navigation.navigate('MyDocuments')}
                    >
                      <Ionicons name="document-text-outline" size={14} color={colors.gradientEnd} style={{ marginRight: 5 }} />
                      <Text style={styles.pdfLink}>Ver mis documentos PDF</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </View>
  );
}

function MeasureItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.measureItem}>
      <Text style={styles.measureVal}>{value}</Text>
      <Text style={styles.measureLabel}>{label}</Text>
    </View>
  );
}

function CircumItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.circumItem}>
      <Text style={styles.circumLabel}>{label}</Text>
      <Text style={styles.circumVal}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
  emptyText: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted },
  list: { padding: 16, paddingBottom: 48 },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.card,
  },
  cardHighlight: {
    borderWidth: 1.5,
    borderColor: colors.gradientEnd,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  leftArea: { flex: 1, gap: 4 },
  latestBadge: {
    backgroundColor: colors.gradientEnd,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  latestText: { fontFamily: fonts.medium, fontSize: 10, color: colors.white },
  dateText: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.textDark },
  rightArea: { alignItems: 'flex-end', flexDirection: 'row', gap: 8 },
  weightText: { fontFamily: fonts.bold, fontSize: 18, color: colors.gradientEnd },
  bmiText: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  cardBody: {
    padding: 14,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },
  measureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingTop: 10 },
  measureItem: {
    width: '48%',
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
    padding: 10,
    alignItems: 'center',
  },
  measureVal: { fontFamily: fonts.bold, fontSize: 18, color: colors.gradientEnd },
  measureLabel: { fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted, marginTop: 2 },
  anthroSection: { gap: 8 },
  anthroTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textDark,
  },
  anthroGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  anthroItem: {
    width: '31%',
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  anthroVal: { fontFamily: fonts.bold, fontSize: 14, color: colors.gradientEnd },
  anthroLabel: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  circumRow: { flexDirection: 'row', justifyContent: 'space-around' },
  circumItem: { alignItems: 'center' },
  circumLabel: { fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted },
  circumVal: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.textDark, marginTop: 2 },
  pdfRow: { flexDirection: 'row', alignItems: 'center' },
  pdfLink: { fontFamily: fonts.medium, fontSize: 13, color: colors.gradientEnd, textDecorationLine: 'underline' },
});
