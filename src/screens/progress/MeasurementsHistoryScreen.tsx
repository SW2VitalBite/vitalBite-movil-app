import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientHeader from '../../components/common/GradientHeader';
import type { MainStackScreenProps } from '../../navigation/types';
import { mockMeasurements } from '../../mocks/data';
import { colors, fonts, radius, shadow } from '../../constants/theme';

export default function MeasurementsHistoryScreen({ navigation }: MainStackScreenProps<'MeasurementsHistory'>) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Historial de mediciones" onBack={() => navigation.goBack()} />

      <FlatList
        data={mockMeasurements}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => {
          const isOpen = expanded === item.id;
          const isFirst = index === 0;
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
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>
                <View style={styles.rightArea}>
                  <Text style={styles.weightText}>{item.weight} kg</Text>
                  <Text style={styles.bmiText}>IMC {item.bmi}</Text>
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
                  <View style={styles.measureGrid}>
                    <MeasureItem label="Grasa corporal" value={`${item.bodyFatPct}%`} />
                    <MeasureItem label="Masa muscular" value={`${item.muscleMassKg} kg`} />
                    <MeasureItem label="Agua corporal" value={`${item.waterPct}%`} />
                    <MeasureItem label="Masa ósea" value={`${item.boneMassKg} kg`} />
                  </View>
                  <View style={styles.circumRow}>
                    <CircumItem label="Cintura" value={`${item.waistCm} cm`} />
                    <CircumItem label="Cadera" value={`${item.hipCm} cm`} />
                    <CircumItem label="Brazo" value={`${item.armCm} cm`} />
                    <CircumItem label="Pierna" value={`${item.legCm} cm`} />
                  </View>
                  <TouchableOpacity style={styles.pdfRow} activeOpacity={0.8}>
                    <Ionicons name="document-text-outline" size={14} color={colors.gradientEnd} style={{ marginRight: 5 }} />
                    <Text style={styles.pdfLink}>Ver reporte PDF de esta sesión</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
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
  leftArea: {
    flex: 1,
    gap: 4,
  },
  latestBadge: {
    backgroundColor: colors.gradientEnd,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  latestText: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.white,
  },
  dateText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textDark,
  },
  rightArea: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 8,
  },
  weightText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.gradientEnd,
  },
  bmiText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  cardBody: {
    padding: 14,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },
  measureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingTop: 10,
  },
  measureItem: {
    width: '48%',
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
    padding: 10,
    alignItems: 'center',
  },
  measureVal: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.gradientEnd,
  },
  measureLabel: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  circumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circumItem: {
    alignItems: 'center',
  },
  circumLabel: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
  },
  circumVal: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textDark,
    marginTop: 2,
  },
  pdfRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pdfLink: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.gradientEnd,
    textDecorationLine: 'underline',
  },
});
