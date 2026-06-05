import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientButton from '../../components/common/GradientButton';
import Avatar from '../../components/common/Avatar';
import type { MainStackScreenProps } from '../../navigation/types';
import { mockNutritionist } from '../../mocks/data';
import { colors, fonts, gradientColors, radius, shadow } from '../../constants/theme';

export default function NutritionistProfileScreen({ navigation }: MainStackScreenProps<'NutritionistProfile'>) {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : insets.top;
  const nut = mockNutritionist;

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      {/* Gradient header with profile */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: topPadding + 8 }]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.white} />
        </TouchableOpacity>

        <View style={styles.profileArea}>
          <Avatar source={nut.avatar} size={96} ring style={{ marginBottom: 12 }} />
          <Text style={styles.nutName}>{nut.name}</Text>
          <Text style={styles.nutTitle}>{nut.title}</Text>
          <Text style={styles.nutSpecialty}>{nut.specialty}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatChip icon="people-outline" value={String(nut.activePatients)} label="Pacientes" />
          <StatChip icon="star-outline" value={String(nut.rating)} label="Calificación" />
          <StatChip icon="time-outline" value={`${nut.yearsExperience}a`} label="Experiencia" />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre mí</Text>
          <Text style={styles.description}>{nut.description}</Text>
        </View>

        {/* Consultorio */}
        <View style={styles.infoRow}>
          <Ionicons name="business-outline" size={18} color={colors.gradientEnd} style={{ marginRight: 10 }} />
          <Text style={styles.infoLabel}>Consultorio</Text>
          <Text style={styles.infoValue}>{nut.consultorio}</Text>
        </View>

        {/* Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horarios de atención</Text>
          {nut.schedule.map((s) => (
            <View key={s.day} style={styles.scheduleRow}>
              <Text style={styles.scheduleDay}>{s.day}</Text>
              <Text style={styles.scheduleHours}>{s.hours}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <GradientButton
          label="Agendar cita vía WhatsApp"
          onPress={() => navigation.navigate('NutritionistSchedule')}
          style={{ marginBottom: 12 }}
        />
        <TouchableOpacity style={styles.whatsappBtn} activeOpacity={0.85}>
          <Ionicons name="logo-whatsapp" size={22} color={colors.white} style={{ marginRight: 8 }} />
          <Text style={styles.whatsappText}>Enviar mensaje directo</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function StatChip({ icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <View style={styles.statChip}>
      <Ionicons name={icon} size={16} color={colors.white} style={{ marginBottom: 2 }} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileArea: {
    alignItems: 'center',
    marginBottom: 20,
  },
  nutAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  nutName: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.white,
    marginBottom: 2,
  },
  nutTitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 4,
  },
  nutSpecialty: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  statChip: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.white,
  },
  statLabel: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  content: { padding: 20, paddingBottom: 48 },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 10,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
    padding: 12,
  },
  infoLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textMuted,
    flex: 1,
  },
  infoValue: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textDark,
    maxWidth: '60%',
    textAlign: 'right',
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scheduleDay: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  scheduleHours: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  whatsappBtn: {
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
});
