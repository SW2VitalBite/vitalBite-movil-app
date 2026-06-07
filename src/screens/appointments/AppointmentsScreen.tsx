import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client/react';
import GradientHeader from '../../components/common/GradientHeader';
import AppointmentCard from '../../components/home/AppointmentCard';
import type { MainTabScreenProps } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import { GET_MY_APPOINTMENTS, GqlAppointment } from '../../services/appointments.service';
import { mapBackendStatus, formatAppointmentDate, formatAppointmentTime } from '../../utils/appointments';
import { colors, fonts, radius, shadow } from '../../constants/theme';

const TABS = ['Próximas', 'Historial'];
const UPCOMING_STATUSES = ['SCHEDULED', 'CONFIRMED', 'RESCHEDULED'];
const PAST_STATUSES = ['COMPLETED', 'CANCELLED', 'NO_SHOW'];

export default function AppointmentsScreen({ navigation }: MainTabScreenProps<'AppointmentsTab'>) {
  const [activeTab, setActiveTab] = useState(0);
  const { patientId } = useAuth();

  const { data, loading, error, refetch } = useQuery<{ appointmentsByPatient: GqlAppointment[] }>(GET_MY_APPOINTMENTS, {
    variables: { patientId },
    skip: !patientId,
  });

  const all: GqlAppointment[] = data?.appointmentsByPatient ?? [];
  const upcoming = [...all]
    .filter((a) => UPCOMING_STATUSES.includes(a.status))
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  const past = all.filter((a) => PAST_STATUSES.includes(a.status));

  const displayData = activeTab === 0 ? upcoming : past;

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader
        title="Mis Citas"
        rightIcon="calendar-outline"
      />

      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === i && styles.tabActive]}
            onPress={() => setActiveTab(i)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabLabel, activeTab === i && styles.tabLabelActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && !data ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.gradientEnd} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Error al cargar citas</Text>
          <TouchableOpacity onPress={() => refetch()} style={styles.retryBtn}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={displayData}
          keyExtractor={(a) => a.id}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={refetch}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="calendar-outline" size={56} color={colors.border} />
              <Text style={styles.emptyText}>
                No hay citas {activeTab === 0 ? 'próximas' : 'en el historial'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <AppointmentCard
              date={formatAppointmentDate(item.scheduledAt)}
              time={formatAppointmentTime(item.scheduledAt)}
              status={mapBackendStatus(item.status)}
              onPress={() => (navigation as any).navigate('AppointmentDetail', { appointmentId: item.id })}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListFooterComponent={
            activeTab === 0 ? (
              <TouchableOpacity style={styles.whatsappBtn} activeOpacity={0.85}>
                <Ionicons name="logo-whatsapp" size={20} color={colors.white} style={{ marginRight: 8 }} />
                <Text style={styles.whatsappText}>Agendar nueva cita vía WhatsApp</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.historyBtn}
                onPress={() => (navigation as any).navigate('AppointmentHistory')}
                activeOpacity={0.8}
              >
                <Text style={styles.historyBtnText}>Ver historial completo</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.gradientEnd} />
              </TouchableOpacity>
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 4,
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.white,
    ...shadow.sm,
  },
  tabLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textMuted,
  },
  tabLabelActive: {
    fontFamily: fonts.semiBold,
    color: colors.gradientEnd,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  errorText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
  },
  retryText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.gradientEnd,
  },
  list: {
    padding: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  whatsappBtn: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    borderRadius: radius.xl,
    paddingVertical: 14,
  },
  whatsappText: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.white,
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 12,
    gap: 4,
  },
  historyBtnText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.gradientEnd,
  },
});
