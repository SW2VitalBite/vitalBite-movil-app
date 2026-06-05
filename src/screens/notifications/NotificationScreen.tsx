import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SectionList } from 'react-native';
import GradientHeader from '../../components/common/GradientHeader';
import DateChip from '../../components/common/DateChip';
import NotificationItem from '../../components/common/NotificationItem';
import type { MainStackScreenProps } from '../../navigation/types';
import { mockNotifications } from '../../mocks/data';
import { colors, fonts, radius } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const DATE_FILTERS = ['Hoy', 'Ayer', '30 Abr'];

// Group by dateGroup
function groupNotifications(data: typeof mockNotifications, filter: string) {
  if (filter === 'Hoy') return data.filter((n) => n.dateGroup === 'Hoy');
  if (filter === 'Ayer') return data.filter((n) => n.dateGroup === 'Ayer');
  return data.filter((n) => n.dateGroup === '30 Abr');
}

export default function NotificationScreen({ navigation }: MainStackScreenProps<'Notifications'>) {
  const [activeFilter, setActiveFilter] = useState('Hoy');
  const filtered = groupNotifications(mockNotifications, activeFilter);

  const sections = Object.entries(
    filtered.reduce((acc, n) => {
      if (!acc[n.dateGroup]) acc[n.dateGroup] = [];
      acc[n.dateGroup].push(n);
      return acc;
    }, {} as Record<string, typeof mockNotifications>),
  ).map(([title, data]) => ({ title, data }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Notificaciones" onBack={() => navigation.goBack()} />

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {DATE_FILTERS.map((f) => (
          <DateChip
            key={f}
            label={f}
            active={activeFilter === f}
            onPress={() => setActiveFilter(f)}
          />
        ))}
        <TouchableOpacity style={styles.markAllBtn}>
          <Text style={styles.markAllText}>Marcar todo leído</Text>
        </TouchableOpacity>
      </View>

      {sections.length === 0 ? (
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
              icon={item.icon as any}
              title={item.title}
              description={item.description}
              time={item.time}
              read={item.read}
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
  markAllBtn: {
    marginLeft: 'auto',
  },
  markAllText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.gradientEnd,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 48,
  },
  sectionHeader: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 10,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
});
