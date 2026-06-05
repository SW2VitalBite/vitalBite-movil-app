import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SquareIconButton from './SquareIconButton';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, shadow } from '../../constants/theme';
import type { NotificationCategory } from '../../mocks/data';

interface NotificationItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  time: string;
  read: boolean;
  onPress?: () => void;
}

export default function NotificationItem({
  icon,
  title,
  description,
  time,
  read,
  onPress,
}: NotificationItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.container, !read && styles.unread]}
    >
      <SquareIconButton icon={icon} size={48} gradient={!read} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.title, !read && styles.titleUnread]} numberOfLines={1}>
            {title}
          </Text>
          {!read && <View style={styles.dot} />}
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        <Text style={styles.time}>{time}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 10,
    ...shadow.card,
  },
  unread: {
    backgroundColor: colors.surfaceLight,
    borderLeftWidth: 3,
    borderLeftColor: colors.gradientEnd,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
    marginRight: 6,
  },
  titleUnread: {
    fontFamily: fonts.semiBold,
    color: colors.textDark,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 3,
    lineHeight: 17,
  },
  time: {
    fontFamily: fonts.light,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gradientEnd,
  },
});
