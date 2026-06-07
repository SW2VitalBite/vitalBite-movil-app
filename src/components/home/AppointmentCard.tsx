import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from '../common/StatusBadge';
import Avatar from '../common/Avatar';
import { colors, fonts, radius, shadow } from '../../constants/theme';
import { mockNutritionist } from '../../mocks/data';
import type { AppointmentStatus } from '../../mocks/data';

interface AppointmentCardProps {
  date: string;
  time: string;
  status: AppointmentStatus;
  onPress?: () => void;
  nutritionistName?: string;
  avatar?: ImageSourcePropType;
  compact?: boolean;
}

export default function AppointmentCard({
  date,
  time,
  status,
  onPress,
  nutritionistName = 'Nutricionista',
  avatar = mockNutritionist.avatar,
  compact = false,
}: AppointmentCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.88} style={[styles.card, compact && styles.compact]}>
      <View style={styles.avatarContainer}>
        <Avatar source={avatar} size={50} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{nutritionistName}</Text>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={13} color={colors.gradientEnd} style={{ marginRight: 4 }} />
          <Text style={styles.date}>{date}</Text>
          <View style={styles.dot} />
          <Ionicons name="time-outline" size={13} color={colors.gradientEnd} style={{ marginRight: 4 }} />
          <Text style={styles.date}>{time}</Text>
        </View>
        <StatusBadge status={status} />
      </View>

      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 14,
    ...shadow.card,
  },
  compact: {
    padding: 12,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatarFallback: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.gradientEnd,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textDark,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textMuted,
    marginHorizontal: 6,
  },
});
