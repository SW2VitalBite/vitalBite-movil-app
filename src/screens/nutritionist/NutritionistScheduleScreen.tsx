import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GradientHeader from '../../components/common/GradientHeader';
import DateChip from '../../components/common/DateChip';
import type { MainStackScreenProps } from '../../navigation/types';
import { colors, fonts, gradientColors, radius, shadow } from '../../constants/theme';

const DAYS = ['Lun 8', 'Mar 9', 'Mié 10', 'Jue 11', 'Vie 12'];
const TIME_SLOTS = [
  { time: '08:00 AM', available: true },
  { time: '09:00 AM', available: false },
  { time: '10:00 AM', available: true },
  { time: '10:30 AM', available: true },
  { time: '11:00 AM', available: false },
  { time: '11:30 AM', available: true },
  { time: '02:00 PM', available: true },
  { time: '02:30 PM', available: true },
  { time: '03:00 PM', available: false },
  { time: '04:00 PM', available: true },
];

export default function NutritionistScheduleScreen({ navigation }: MainStackScreenProps<'NutritionistSchedule'>) {
  const [activeDay, setActiveDay] = useState(DAYS[2]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Agendar cita" onBack={() => navigation.goBack()} subtitle="Nut. Ana García" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Selecciona un día</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dayRow}
        >
          {DAYS.map((d) => (
            <DateChip key={d} label={d} active={activeDay === d} onPress={() => setActiveDay(d)} />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Horarios disponibles</Text>
        <View style={styles.slotsGrid}>
          {TIME_SLOTS.map((slot) => (
            <TouchableOpacity
              key={slot.time}
              disabled={!slot.available}
              onPress={() => setSelectedSlot(slot.time)}
              activeOpacity={0.8}
              style={[
                styles.slotBtn,
                !slot.available && styles.slotUnavailable,
                selectedSlot === slot.time && styles.slotSelected,
              ]}
            >
              <Text
                style={[
                  styles.slotText,
                  !slot.available && styles.slotTextUnavailable,
                  selectedSlot === slot.time && styles.slotTextSelected,
                ]}
              >
                {slot.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedSlot && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumen de la cita</Text>
            <View style={styles.summaryRow}>
              <Ionicons name="calendar-outline" size={16} color={colors.gradientEnd} style={{ marginRight: 8 }} />
              <Text style={styles.summaryText}>{activeDay} · Junio 2026</Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="time-outline" size={16} color={colors.gradientEnd} style={{ marginRight: 8 }} />
              <Text style={styles.summaryText}>{selectedSlot}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="person-outline" size={16} color={colors.gradientEnd} style={{ marginRight: 8 }} />
              <Text style={styles.summaryText}>Nut. Ana García</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.whatsappCta, !selectedSlot && { opacity: 0.5 }]}
          disabled={!selectedSlot}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#25D366', '#128C7E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.whatsappGradient}
          >
            <Ionicons name="logo-whatsapp" size={22} color={colors.white} style={{ marginRight: 10 }} />
            <Text style={styles.whatsappText}>Solicitar cita vía WhatsApp</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.noteText}>
          Al tocar el botón, serás redirigido al bot de WhatsApp del consultorio para confirmar tu cita.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 48 },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textDark,
    marginBottom: 12,
    marginTop: 8,
  },
  dayRow: {
    gap: 8,
    paddingBottom: 8,
    marginBottom: 8,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  slotBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.gradientEnd,
    backgroundColor: colors.surfaceLight,
    minWidth: '28%',
    alignItems: 'center',
  },
  slotUnavailable: {
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  slotSelected: {
    backgroundColor: colors.gradientEnd,
    borderColor: colors.gradientEnd,
  },
  slotText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.gradientEnd,
  },
  slotTextUnavailable: {
    color: colors.border,
    textDecorationLine: 'line-through',
  },
  slotTextSelected: {
    color: colors.white,
  },
  summaryCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 20,
    gap: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.gradientEnd,
  },
  summaryTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textPrimary,
  },
  whatsappCta: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: 12,
  },
  whatsappGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  whatsappText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.white,
  },
  noteText: {
    fontFamily: fonts.light,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
