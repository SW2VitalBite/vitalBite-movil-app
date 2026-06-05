import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, gradientColors, radius } from '../../constants/theme';

interface DataPoint {
  label: string;
  value: number;
}

interface ProgressChartProps {
  data: DataPoint[];
  unit?: string;
  height?: number;
}

export default function ProgressChart({ data, unit = 'kg', height = 100 }: ProgressChartProps) {
  const values = data.map((d) => d.value);
  const min = Math.min(...values) - 1;
  const max = Math.max(...values) + 1;
  const range = max - min;

  const barHeight = (val: number) => ((val - min) / range) * height;

  return (
    <View style={styles.container}>
      <View style={[styles.chart, { height }]}>
        {data.map((point, i) => {
          const barH = barHeight(point.value);
          const isLast = i === data.length - 1;
          return (
            <View key={point.label} style={styles.barGroup}>
              {isLast ? (
                <LinearGradient
                  colors={gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={[styles.bar, { height: barH, borderRadius: radius.sm }]}
                />
              ) : (
                <View
                  style={[
                    styles.bar,
                    { height: barH, backgroundColor: colors.border, borderRadius: radius.sm },
                  ]}
                />
              )}
              <Text style={[styles.barValue, isLast && styles.barValueActive]}>
                {point.value}{unit}
              </Text>
              <Text style={styles.barLabel}>{point.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    marginBottom: 4,
  },
  barValue: {
    fontFamily: fonts.regular,
    fontSize: 9,
    color: colors.textMuted,
    marginBottom: 2,
  },
  barValueActive: {
    fontFamily: fonts.semiBold,
    color: colors.gradientEnd,
    fontSize: 10,
  },
  barLabel: {
    fontFamily: fonts.light,
    fontSize: 9,
    color: colors.textMuted,
  },
});
