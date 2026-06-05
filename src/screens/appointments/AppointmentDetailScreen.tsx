import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientHeader from '../../components/common/GradientHeader';
import GradientButton from '../../components/common/GradientButton';
import OutlineButton from '../../components/common/OutlineButton';
import StatusBadge from '../../components/common/StatusBadge';
import Avatar from '../../components/common/Avatar';
import type { MainStackScreenProps } from '../../navigation/types';
import { mockAppointments, mockNutritionist } from '../../mocks/data';
import { colors, fonts, radius, shadow } from '../../constants/theme';

const DATE_MAP: Record<string, string> = {
  'apt-001': 'Miércoles, 10 de Junio 2026',
  'apt-002': 'Miércoles, 24 de Junio 2026',
  'apt-003': 'Jueves, 28 de Mayo 2026',
};

export default function AppointmentDetailScreen({ navigation, route }: MainStackScreenProps<'AppointmentDetail'>) {
  const { appointmentId } = route.params;
  const apt = mockAppointments.find((a) => a.id === appointmentId) ?? mockAppointments[0];

  const canCancel = apt.status === 'confirmed' || apt.status === 'pending';

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Detalle de Cita" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Nutritionist card */}
        <View style={styles.nutCard}>
          <Avatar source={mockNutritionist.avatar} size={60} style={{ marginRight: 16 }} />
          <View style={styles.nutInfo}>
            <Text style={styles.nutName}>{mockNutritionist.name}</Text>
            <Text style={styles.nutSpecialty}>{mockNutritionist.specialty}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <InfoRow icon="calendar-outline" label="Fecha" value={DATE_MAP[apt.id] ?? apt.date} />
          <InfoRow icon="time-outline" label="Hora" value={apt.time} />
          <InfoRow icon="hourglass-outline" label="Duración estimada" value="45 minutos" />
          <View style={styles.row}>
            <Ionicons name="checkmark-circle-outline" size={18} color={colors.gradientEnd} style={styles.rowIcon} />
            <Text style={styles.rowLabel}>Estado</Text>
            <StatusBadge status={apt.status} />
          </View>
        </View>

        {apt.notes ? (
          <View style={styles.notesCard}>
            <Text style={styles.notesTitle}>Notas</Text>
            <Text style={styles.notesText}>{apt.notes}</Text>
          </View>
        ) : null}

        {apt.weightRecorded ? (
          <View style={styles.weightCard}>
            <Ionicons name="scale-outline" size={22} color={colors.gradientEnd} />
            <Text style={styles.weightLabel}>Peso registrado en esta sesión</Text>
            <Text style={styles.weightValue}>{apt.weightRecorded} kg</Text>
          </View>
        ) : null}

        <View style={styles.actions}>
          {apt.status === 'completed' && (
            <GradientButton
              label="Ver dieta asociada"
              onPress={() => navigation.navigate('Diet')}
              style={{ marginBottom: 12 }}
            />
          )}
          {canCancel && (
            <OutlineButton
              label="Cancelar cita"
              onPress={() => {}}
              color={colors.danger}
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
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  nutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 16,
    ...shadow.card,
  },
  nutAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.gradientEnd,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  nutInfo: {
    flex: 1,
  },
  nutName: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.textDark,
  },
  nutSpecialty: {
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
  weightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F9EE',
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 16,
    gap: 10,
  },
  weightLabel: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    flex: 1,
  },
  weightValue: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: '#1DB954',
  },
  actions: {
    marginTop: 8,
  },
});
