import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../../constants/theme';

export interface FoodItemData {
  id: string;
  name: string;
  portion: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  notes?: string | null;
}

interface FoodItemProps {
  item: FoodItemData;
}

export default function FoodItem({ item }: FoodItemProps) {
  const hasMacros =
    item.protein != null || item.carbs != null || item.fat != null;

  return (
    <View style={styles.row}>
      <View style={styles.iconDot}>
        <Ionicons name="ellipse" size={8} color={colors.gradientEnd} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        {item.portion ? <Text style={styles.portion}>{item.portion}</Text> : null}
        {item.notes ? <Text style={styles.portion}>{item.notes}</Text> : null}
      </View>
      <View style={styles.macros}>
        {item.calories > 0 && <Text style={styles.calories}>{item.calories} kcal</Text>}
        {hasMacros && (
          <View style={styles.macroRow}>
            <Text style={styles.macro}>P {item.protein ?? 0}g</Text>
            <Text style={styles.macro}> · C {item.carbs ?? 0}g</Text>
            <Text style={styles.macro}> · G {item.fat ?? 0}g</Text>
          </View>
        )}
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
