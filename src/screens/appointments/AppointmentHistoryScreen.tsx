import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientHeader from '../../components/common/GradientHeader';
import StatusBadge from '../../components/common/StatusBadge';
import type { MainStackScreenProps } from '../../navigation/types';
import { pastAppointments } from '../../mocks/data';
import { colors, fonts, radius, shadow } from '../../constants/theme';

const DATE_MAP: Record<string, string> = {
  'apt-003': 'Jue 28 May 2026',
  'apt-004': 'Jue 30 Abr 2026',
  'apt-005': 'Mié 25 Mar 2026',
};

export default function AppointmentHistoryScreen({ navigation }: MainStackScreenProps<'AppointmentHistory'>) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Historial de Citas" onBack={() => navigation.goBack()} />

      <FlatList
        data={pastAppointments}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isOpen = expanded === item.id;
          return (
            <View style={styles.historyCard}>
              <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => setExpanded(isOpen ? null : item.id)}
                activeOpacity={0.8}
              >
                <View style={styles.dateArea}>
                  <Ionicons name="calendar-outline" size={16} color={colors.gradientEnd} style={{ marginRight: 6 }} />
                  <Text style={styles.dateText}>{DATE_MAP[item.id] ?? item.date}</Text>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <View style={styles.rightArea}>
                  <StatusBadge status={item.status} />
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
                  {item.weightRecorded ? (
                    <View style={styles.detailRow}>
                      <Ionicons name="scale-outline" size={15} color={colors.textMuted} style={{ marginRight: 6 }} />
                      <Text style={styles.detailLabel}>Peso registrado:</Text>
                      <Text style={styles.detailValue}>{item.weightRecorded} kg</Text>
                    </View>
                  ) : null}
                  <TouchableOpacity
                    style={styles.pdfRow}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="document-text-outline" size={15} color={colors.gradientEnd} style={{ marginRight: 6 }} />
                    <Text style={styles.pdfLink}>Descargar resumen de sesión (PDF)</Text>
                    <Ionicons name="download-outline" size={15} color={colors.gradientEnd} style={{ marginLeft: 4 }} />
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

const styles = StyleSheet.create({
  list: {
    padding: 20,
    paddingBottom: 48,
  },
  historyCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  dateArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dateText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textDark,
    marginRight: 8,
  },
  timeText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  rightArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardBody: {
    padding: 14,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginRight: 4,
  },
  detailValue: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textDark,
  },
  pdfRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pdfLink: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.gradientEnd,
    flex: 1,
  },
});
