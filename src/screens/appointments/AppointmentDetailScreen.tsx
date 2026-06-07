import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation } from '@apollo/client/react';
import GradientHeader from '../../components/common/GradientHeader';
import GradientButton from '../../components/common/GradientButton';
import OutlineButton from '../../components/common/OutlineButton';
import StatusBadge from '../../components/common/StatusBadge';
import type { MainStackScreenProps } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import {
  GET_APPOINTMENT_BY_ID,
  GET_MY_APPOINTMENTS,
  CANCEL_APPOINTMENT,
  GqlAppointment,
} from '../../services/appointments.service';
import { mapBackendStatus, formatAppointmentDateLong, formatAppointmentTime } from '../../utils/appointments';
import { colors, fonts, radius, shadow } from '../../constants/theme';

export default function AppointmentDetailScreen({ navigation, route }: MainStackScreenProps<'AppointmentDetail'>) {
  const { appointmentId } = route.params;
  const { patientId } = useAuth();

  const { data, loading } = useQuery<{ appointmentById: GqlAppointment }>(GET_APPOINTMENT_BY_ID, {
    variables: { id: appointmentId },
  });

  const [cancelAppointment, { loading: cancelling }] = useMutation(CANCEL_APPOINTMENT, {
    refetchQueries: [{ query: GET_MY_APPOINTMENTS, variables: { patientId } }],
  });

  const apt: GqlAppointment | undefined = data?.appointmentById;
  const uiStatus = apt ? mapBackendStatus(apt.status) : 'pending';
  const canCancel = uiStatus === 'confirmed' || uiStatus === 'pending';

  const handleCancel = () => {
    Alert.alert(
      'Cancelar cita',
      '¿Por qué deseas cancelar esta cita?',
      [
        { text: 'Volver', style: 'cancel' },
        {
          text: 'Cancelar cita',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelAppointment({
                variables: { id: appointmentId, input: { reason: 'Cancelada por el paciente' } },
              });
              navigation.goBack();
            } catch {
              Alert.alert('Error', 'No se pudo cancelar la cita. Intenta de nuevo.');
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <GradientHeader title="Detalle de Cita" onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.gradientEnd} />
        </View>
      </View>
    );
  }

  if (!apt) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <GradientHeader title="Detalle de Cita" onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Cita no encontrada</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Detalle de Cita" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Modo de atención */}
        <View style={styles.modeCard}>
          <Ionicons
            name={apt.mode === 'VIRTUAL' ? 'videocam-outline' : 'business-outline'}
            size={28}
            color={colors.gradientEnd}
            style={{ marginRight: 12 }}
          />
          <View style={styles.modeInfo}>
            <Text style={styles.modeLabel}>{apt.mode === 'VIRTUAL' ? 'Cita Virtual' : 'Cita Presencial'}</Text>
            {apt.reason ? <Text style={styles.modeReason}>{apt.reason}</Text> : null}
          </View>
        </View>

        <View style={styles.infoCard}>
          <InfoRow icon="calendar-outline" label="Fecha" value={formatAppointmentDateLong(apt.scheduledAt)} />
          <InfoRow icon="time-outline" label="Hora" value={formatAppointmentTime(apt.scheduledAt)} />
          <InfoRow icon="hourglass-outline" label="Duración estimada" value={`${apt.durationMinutes} minutos`} />
          <View style={styles.row}>
            <Ionicons name="checkmark-circle-outline" size={18} color={colors.gradientEnd} style={styles.rowIcon} />
            <Text style={styles.rowLabel}>Estado</Text>
            <StatusBadge status={uiStatus} />
          </View>
        </View>

        {apt.notes ? (
          <View style={styles.notesCard}>
            <Text style={styles.notesTitle}>Notas</Text>
            <Text style={styles.notesText}>{apt.notes}</Text>
          </View>
        ) : null}

        {apt.cancelReason ? (
          <View style={[styles.notesCard, { borderLeftColor: colors.danger }]}>
            <Text style={[styles.notesTitle, { color: colors.danger }]}>Motivo de cancelación</Text>
            <Text style={styles.notesText}>{apt.cancelReason}</Text>
          </View>
        ) : null}

        <View style={styles.actions}>
          {uiStatus === 'completed' && (
            <GradientButton
              label="Ver dieta asociada"
              onPress={() => navigation.navigate('Diet')}
              style={{ marginBottom: 12 }}
            />
          )}
          {canCancel && (
            <OutlineButton
              label={cancelling ? 'Cancelando...' : 'Cancelar cita'}
              onPress={handleCancel}
              color={colors.danger}
              disabled={cancelling}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={18} color={colors.gradientEnd} style={styles.rowIcon} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 16,
    ...shadow.card,
  },
  modeInfo: {
    flex: 1,
  },
  modeLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.textDark,
  },
  modeReason: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 3,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 16,
    ...shadow.card,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    marginRight: 10,
  },
  rowLabel: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    flex: 1,
  },
  rowValue: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textDark,
  },
  notesCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.gradientEnd,
  },
  notesTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 8,
  },
  notesText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  actions: {
    marginTop: 8,
  },
});
