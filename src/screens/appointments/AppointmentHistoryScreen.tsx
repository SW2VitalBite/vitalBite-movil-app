import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client/react';
import GradientHeader from '../../components/common/GradientHeader';
import StatusBadge from '../../components/common/StatusBadge';
import type { MainStackScreenProps } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import { GET_MY_APPOINTMENTS, GqlAppointment } from '../../services/appointments.service';
import { mapBackendStatus, formatAppointmentDate, formatAppointmentTime } from '../../utils/appointments';
import { colors, fonts, radius, shadow } from '../../constants/theme';

const PAST_STATUSES = ['COMPLETED', 'CANCELLED', 'NO_SHOW'];

export default function AppointmentHistoryScreen({ navigation }: MainStackScreenProps<'AppointmentHistory'>) {
  const { patientId } = useAuth();
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data, loading } = useQuery<{ appointmentsByPatient: GqlAppointment[] }>(
    GET_MY_APPOINTMENTS,
    { variables: { patientId }, skip: !patientId, fetchPolicy: 'cache-and-network' },
  );

  const appointments = (data?.appointmentsByPatient ?? [])
    .filter((a) => PAST_STATUSES.includes(a.status))
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Historial de Citas" onBack={() => navigation.goBack()} />

      {loading && appointments.length === 0 ? (
        <ActivityIndicator color={colors.gradientEnd} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(a) => a.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="calendar-outline" size={56} color={colors.border} />
              <Text style={styles.emptyText}>Sin historial de citas</Text>
            </View>
          }
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
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color={colors.gradientEnd}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.dateText}>{formatAppointmentDate(item.scheduledAt)}</Text>
                    <Text style={styles.timeText}>{formatAppointmentTime(item.scheduledAt)}</Text>
                  </View>
                  <View style={styles.rightArea}>
                    <StatusBadge status={mapBackendStatus(item.status)} />
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
                    {item.reason ? (
                      <View style={styles.detailRow}>
                        <Ionicons
                          name="information-circle-outline"
                          size={15}
                          color={colors.textMuted}
                          style={{ marginRight: 6 }}
                        />
                        <Text style={styles.detailLabel}>Motivo:</Text>
                        <Text style={styles.detailValue}>{item.reason}</Text>
                      </View>
                    ) : null}
                    {item.cancelReason ? (
                      <View style={styles.detailRow}>
                        <Ionicons
                          name="close-circle-outline"
                          size={15}
                          color={colors.danger}
                          style={{ marginRight: 6 }}
                        />
                        <Text style={styles.detailLabel}>Cancelación:</Text>
                        <Text style={[styles.detailValue, { color: colors.danger }]}>{item.cancelReason}</Text>
                      </View>
                    ) : null}
                    {item.notes ? (
                      <View style={styles.detailRow}>
                        <Ionicons
                          name="document-text-outline"
                          size={15}
                          color={colors.textMuted}
                          style={{ marginRight: 6 }}
                        />
                        <Text style={styles.detailLabel}>Notas:</Text>
                        <Text style={styles.detailValue}>{item.notes}</Text>
                      </View>
                    ) : null}
                    <TouchableOpacity style={styles.pdfRow} activeOpacity={0.8}>
                      <Ionicons
                        name="document-text-outline"
                        size={15}
                        color={colors.gradientEnd}
                        style={{ marginRight: 6 }}
                      />
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: 20, paddingBottom: 48 },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
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
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  detailLabel: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginRight: 4,
  },
  detailValue: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textDark,
    flex: 1,
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
