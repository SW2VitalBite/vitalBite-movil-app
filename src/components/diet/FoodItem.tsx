import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius } from '../../constants/theme';
import type { FoodItem as FoodItemType } from '../../mocks/data';

interface FoodItemProps {
  item: FoodItemType;
}

export default function FoodItem({ item }: FoodItemProps) {
  return (
    <View style={styles.row}>
      <View style={styles.iconDot}>
        <Ionicons name="ellipse" size={8} color={colors.gradientEnd} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.portion}>{item.portion}</Text>
      </View>
      <View style={styles.macros}>
        <Text style={styles.calories}>{item.calories} kcal</Text>
        <View style={styles.macroRow}>
          <Text style={styles.macro}>P {item.protein}g</Text>
          <Text style={styles.macro}> · C {item.carbs}g</Text>
          <Text style={styles.macro}> · G {item.fat}g</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconDot: {
    marginRight: 12,
    marginTop: 2,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textDark,
  },
  portion: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  macros: {
    alignItems: 'flex-end',
  },
  calories: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.gradientEnd,
  },
  macroRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  macro: {
    fontFamily: fonts.light,
    fontSize: 11,
    color: colors.textMuted,
  },
});
