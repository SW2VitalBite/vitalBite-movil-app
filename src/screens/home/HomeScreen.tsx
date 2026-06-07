import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@apollo/client/react';
import AppointmentCard from '../../components/home/AppointmentCard';
import ProgressCard from '../../components/home/ProgressCard';
import DietPreviewCard from '../../components/home/DietPreviewCard';
import Avatar from '../../components/common/Avatar';
import type { MainTabScreenProps } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import { GET_MY_APPOINTMENTS, GqlAppointment } from '../../services/appointments.service';
import { GET_BODY_MEASUREMENTS, GqlBodyMeasurement } from '../../services/progress.service';
import { GET_ACTIVE_DIET, GqlDiet } from '../../services/diets.service';
import { GET_MY_NUTRITIONIST, GqlNutritionist } from '../../services/nutritionist.service';
import { goalWeightKg } from '../../mocks/data';
import { mapBackendStatus, formatAppointmentDate, formatAppointmentTime } from '../../utils/appointments';
import { colors, fonts, gradientColors, radius, shadow } from '../../constants/theme';

const UPCOMING_STATUSES = ['SCHEDULED', 'CONFIRMED', 'RESCHEDULED'];

export default function HomeScreen({ navigation }: MainTabScreenProps<'HomeTab'>) {
  const insets = useSafeAreaInsets();
  const { user, patientId } = useAuth();

  const { data: apptData, loading: apptLoading } = useQuery<{ appointmentsByPatient: GqlAppointment[] }>(GET_MY_APPOINTMENTS, {
    variables: { patientId },
    skip: !patientId,
  });

  const { data: measData, loading: measLoading } = useQuery<{ bodyMeasurementsByPatient: GqlBodyMeasurement[] }>(GET_BODY_MEASUREMENTS, {
    variables: { patientId },
    skip: !patientId,
  });

  const { data: dietData } = useQuery<{ myActiveDiet: GqlDiet | null }>(GET_ACTIVE_DIET, {
    variables: { patientId },
    skip: !patientId,
    fetchPolicy: 'cache-and-network',
  });

  const { data: nutData } = useQuery<{ myNutritionist: GqlNutritionist | null }>(GET_MY_NUTRITIONIST);
  const nut = nutData?.myNutritionist;
  const nutritionistName = nut ? `Nut. ${nut.firstName} ${nut.lastName}` : undefined;

  const appointments: GqlAppointment[] = apptData?.appointmentsByPatient ?? [];
  const nextAppt = [...appointments]
    .filter((a) => UPCOMING_STATUSES.includes(a.status))
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0];

  const measurements: GqlBodyMeasurement[] = measData?.bodyMeasurementsByPatient ?? [];
  const latestMeas = measurements[0];

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      {/* Custom header */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: (Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : insets.top) + 12 }]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.avatarBtn}
            activeOpacity={0.8}
            onPress={() => (navigation as any).navigate?.('ProfileTab')}
          >
            <Avatar source={null} size={44} ring ringColor="rgba(255,255,255,0.7)" />
          </TouchableOpacity>

          <View style={styles.greetingArea}>
            <Text style={styles.greetingMuted}>Buenos días,</Text>
            <Text style={styles.greetingName}>{user?.firstName ?? '—'} ✨</Text>
          </View>

          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => (navigation as any).navigate?.('Notifications')}
            activeOpacity={0.8}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.white} />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Next appointment */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Próxima Cita</Text>
          {apptLoading ? (
            <ActivityIndicator color={colors.gradientEnd} style={{ marginVertical: 12 }} />
          ) : nextAppt ? (
            <AppointmentCard
              date={formatAppointmentDate(nextAppt.scheduledAt)}
              time={formatAppointmentTime(nextAppt.scheduledAt)}
              status={mapBackendStatus(nextAppt.status)}
              nutritionistName={nutritionistName}
              onPress={() => (navigation as any).navigate?.('AppointmentDetail', { appointmentId: nextAppt.id })}
            />
          ) : (
            <Text style={styles.emptyText}>No tienes citas próximas</Text>
          )}
        </View>

        {/* Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Mi Progreso</Text>
          {measLoading ? (
            <ActivityIndicator color={colors.gradientEnd} style={{ marginVertical: 12 }} />
          ) : (
            <ProgressCard
              currentWeight={latestMeas?.weightKg ?? 0}
              goalWeight={goalWeightKg}
              bmi={latestMeas?.bmi ?? 0}
            />
          )}
        </View>

        {/* Diet preview */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Alimentación</Text>
          <DietPreviewCard
            dietName={dietData?.myActiveDiet?.name ?? 'Sin plan activo'}
            nextMeal="Ver plan completo"
            onPress={() => (navigation as any).navigate?.('Diet')}
          />
        </View>

        {/* Quick actions */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Acceso rápido</Text>
          <View style={styles.quickGrid}>
            <QuickAction
              icon="calendar-outline"
              label="Mis Citas"
              color="#E8F6FD"
              iconColor={colors.gradientEnd}
              onPress={() => (navigation as any).navigate?.('AppointmentsTab')}
            />
            <QuickAction
              icon="bar-chart-outline"
              label="Progreso"
              color="#E8FDF9"
              iconColor="#1DB954"
              onPress={() => (navigation as any).navigate?.('Progress')}
            />
            <QuickAction
              icon="document-text-outline"
              label="Notificaciones"
              color="#FFF8E1"
              iconColor="#FFB800"
              onPress={() => (navigation as any).navigate?.('Notifications')}
            />
            <QuickAction
              icon="person-circle-outline"
              label="Nutricionista"
              color="#F3E8FD"
              iconColor="#9B59B6"
              onPress={() => (navigation as any).navigate?.('NutritionistProfile')}
            />
          </View>
        </View>
      </ScrollView>

      {/* FAB Scanner */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => (navigation as any).navigate?.('ScannerHome')}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Ionicons name="scan-outline" size={28} color={colors.white} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

function QuickAction({
  icon, label, color, iconColor, onPress,
}: {
  icon: any; label: string; color: string; iconColor: string; onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={[styles.quickCard, { backgroundColor: color }]} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name={icon} size={28} color={iconColor} />
      <Text style={[styles.quickLabel, { color: iconColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBtn: {
    marginRight: 12,
  },
  greetingArea: {
    flex: 1,
  },
  greetingMuted: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  greetingName: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.white,
  },
  notifBtn: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 10,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    paddingVertical: 8,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickCard: {
    width: '46%',
    borderRadius: radius.lg,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    ...shadow.card,
  },
  quickLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    borderRadius: 32,
    overflow: 'hidden',
    ...shadow.md,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
