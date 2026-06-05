import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientHeader from '../../components/common/GradientHeader';
import GradientButton from '../../components/common/GradientButton';
import AppointmentCard from '../../components/home/AppointmentCard';
import type { MainTabScreenProps } from '../../navigation/types';
import { upcomingAppointments, pastAppointments } from '../../mocks/data';
import { colors, fonts, radius, shadow, spacing } from '../../constants/theme';

const TABS = ['Próximas', 'Historial'];

const APT_DATE_MAP: Record<string, string> = {
  'apt-001': 'Mié 10 Jun 2026',
  'apt-002': 'Mié 24 Jun 2026',
  'apt-003': 'Jue 28 May 2026',
  'apt-004': 'Jue 30 Abr 2026',
  'apt-005': 'Mié 25 Mar 2026',
};

export default function AppointmentsScreen({ navigation }: MainTabScreenProps<'AppointmentsTab'>) {
  const [activeTab, setActiveTab] = useState(0);
  const data = activeTab === 0 ? upcomingAppointments : pastAppointments;

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

      <FlatList
        data={data}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={56} color={colors.border} />
            <Text style={styles.emptyText}>No hay citas {activeTab === 0 ? 'próximas' : 'en el historial'}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <AppointmentCard
            date={APT_DATE_MAP[item.id] ?? item.date}
            time={item.time}
            status={item.status}
            onPress={() => (navigation as any).navigate('AppointmentDetail', { appointmentId: item.id })}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={
          activeTab === 0 ? (
            <TouchableOpacity
              style={styles.whatsappBtn}
              activeOpacity={0.85}
            >
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
