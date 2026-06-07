import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts, radius } from '../../constants/theme';
import type { AppointmentStatus } from '../../mocks/data';

interface StatusBadgeProps {
  status: AppointmentStatus;
}

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; bg: string; text: string }> = {
  confirmed: { label: 'Confirmada', bg: '#E6F9EE', text: '#1DB954' },
  pending:   { label: 'Pendiente',  bg: '#FFF8E1', text: '#FFB800' },
  completed: { label: 'Completada', bg: '#F0F0F0', text: '#8A8A8A' },
  cancelled: { label: 'Cancelada',  bg: '#FFE8E8', text: '#FF5A5F' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <View style={[styles.dot, { backgroundColor: cfg.text }]} />
      <Text style={[styles.label, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
  },
});
