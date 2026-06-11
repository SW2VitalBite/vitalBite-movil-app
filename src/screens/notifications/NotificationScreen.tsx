import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SectionList, ActivityIndicator,
} from 'react-native';
import { useQuery, useMutation } from '@apollo/client/react';
import GradientHeader from '../../components/common/GradientHeader';
import DateChip from '../../components/common/DateChip';
import NotificationItem from '../../components/common/NotificationItem';
import type { MainStackScreenProps } from '../../navigation/types';
import {
  GET_MY_NOTIFICATIONS,
  MARK_NOTIFICATION_READ,
  MARK_ALL_NOTIFICATIONS_READ,
  GqlNotification,
} from '../../services/notifications.service';
import { useAuth } from '../../contexts/AuthContext';
import { colors, fonts } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

type DateFilter = 'Hoy' | 'Ayer' | 'Semana' | 'Todas';
const DATE_FILTERS: DateFilter[] = ['Hoy', 'Ayer', 'Semana', 'Todas'];

const NOTIF_ICONS: Record<string, string> = {
  CITA_CREADA: 'calendar-outline',
  CITA_CANCELADA: 'close-circle-outline',
  CITA_CONFIRMADA: 'checkmark-circle-outline',
  CITA_REPROGRAMADA: 'refresh-circle-outline',
  CITA_COMPLETADA: 'checkmark-done-circle-outline',
  CITA_NO_ASISTIO: 'alert-circle-outline',
  DIETA_ASIGNADA: 'nutrition-outline',
  MENSAJE: 'chatbubble-outline',
  REPORTE: 'document-text-outline',
};

function toDateGroup(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const notifDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  if (notifDay.getTime() === today.getTime()) return 'Hoy';
  if (notifDay.getTime() === yesterday.getTime()) return 'Ayer';
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

function filterByRange(notifications: GqlNotification[], filter: DateFilter): GqlNotification[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return notifications.filter((n) => {
    const d = new Date(n.createdAt);
    const notifDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diffDays = (today.getTime() - notifDay.getTime()) / 86400000;

    if (filter === 'Hoy') return diffDays === 0;
    if (filter === 'Ayer') return diffDays === 1;
    if (filter === 'Semana') return diffDays >= 0 && diffDays < 7;
    return true; // 'Todas'
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

export default function NotificationScreen({ navigation }: MainStackScreenProps<'Notifications'>) {
  const { patientId } = useAuth();
  const [activeFilter, setActiveFilter] = useState<DateFilter>('Todas');

  const { data, loading, refetch } = useQuery<{ myNotifications: GqlNotification[] }>(
    GET_MY_NOTIFICATIONS,
    { variables: { patientId }, skip: !patientId, fetchPolicy: 'cache-and-network' },
  );

  const [markRead] = useMutation(MARK_NOTIFICATION_READ, {
    onCompleted: () => refetch(),
  });

  const [markAll] = useMutation(MARK_ALL_NOTIFICATIONS_READ, {
    variables: { patientId },
    onCompleted: () => refetch(),
  });

  const all = data?.myNotifications ?? [];
  const filtered = filterByRange(all, activeFilter);

  const sections = Object.entries(
    filtered.reduce<Record<string, GqlNotification[]>>((acc, n) => {
      const group = toDateGroup(n.createdAt);
      if (!acc[group]) acc[group] = [];
      acc[group].push(n);
      return acc;
    }, {}),
  ).map(([title, data]) => ({ title, data }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Notificaciones" onBack={() => navigation.goBack()} />

      <View style={styles.filterRow}>
        {DATE_FILTERS.map((f) => (
          <DateChip
            key={f}
            label={f}
            active={activeFilter === f}
            onPress={() => setActiveFilter(f)}
          />
        ))}
        <TouchableOpacity style={styles.markAllBtn} onPress={() => markAll()}>
          <Text style={styles.markAllText}>Marcar todo leído</Text>
        </TouchableOpacity>
      </View>

      {loading && all.length === 0 ? (
        <ActivityIndicator color={colors.gradientEnd} style={{ marginTop: 40 }} />
      ) : sections.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="notifications-off-outline" size={56} color={colors.border} />
          <Text style={styles.emptyText}>Sin notificaciones en este período</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(n) => n.id}
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          renderItem={({ item }) => (
            <NotificationItem
              icon={(NOTIF_ICONS[item.type] ?? 'notifications-outline') as any}
              title={item.title}
              description={item.body}
              time={formatTime(item.createdAt)}
              read={item.isRead}
              onPress={() => {
                if (!item.isRead) markRead({ variables: { id: item.id } });
              }}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    flexWrap: 'wrap',
  },
  markAllBtn: { marginLeft: 'auto' },
  markAllText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.gradientEnd,
  },
  list: { paddingHorizontal: 16, paddingBottom: 48 },
  sectionHeader: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 10,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
});
