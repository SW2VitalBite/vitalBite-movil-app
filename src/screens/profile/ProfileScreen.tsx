import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@apollo/client/react';
import Avatar from '../../components/common/Avatar';
import type { MainTabScreenProps } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import { GET_MY_PATIENT_PROFILE, GqlPatient } from '../../services/profile.service';
import { GET_BODY_MEASUREMENTS, GqlBodyMeasurement } from '../../services/progress.service';
import { colors, fonts, gradientColors, radius, shadow } from '../../constants/theme';

export default function ProfileScreen({ navigation }: MainTabScreenProps<'ProfileTab'>) {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : insets.top;
  const { user, patientId, logout } = useAuth();

  const { data: patientData } = useQuery<{ patientById: GqlPatient }>(GET_MY_PATIENT_PROFILE, {
    variables: { id: patientId },
    skip: !patientId,
  });

  const { data: measData } = useQuery<{ bodyMeasurementsByPatient: GqlBodyMeasurement[] }>(GET_BODY_MEASUREMENTS, {
    variables: { patientId },
    skip: !patientId,
  });

  const patient = patientData?.patientById;
  const latestMeas = measData?.bodyMeasurementsByPatient?.[0];

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: () => logout(),
        },
      ],
    );
  };

  const formatBirthDate = (iso?: string | null) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: topPadding + 12 }]}
      >
        <View style={styles.avatarArea}>
          <Avatar source={null} size={90} ring style={{ marginBottom: 12 }} />
          <Text style={styles.userName}>
            {user?.firstName ?? patient?.firstName ?? '—'} {user?.lastName ?? patient?.lastName ?? ''}
          </Text>
          <Text style={styles.userEmail}>{user?.email ?? '—'}</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatItem label="Peso" value={latestMeas ? `${latestMeas.weightKg} kg` : '—'} />
          <StatItem label="Altura" value={latestMeas?.heightCm ? `${latestMeas.heightCm} cm` : '—'} />
          <StatItem label="IMC" value={latestMeas?.bmi ? `${latestMeas.bmi.toFixed(1)}` : '—'} />
        </View>

        {/* Info section */}
        <View style={styles.infoCard}>
          <InfoRow icon="calendar-outline" label="Fecha de nacimiento" value={formatBirthDate(patient?.birthDate)} />
          <InfoRow icon="call-outline" label="Teléfono" value={patient?.phone ?? '—'} />
          <InfoRow icon="flag-outline" label="Objetivo" value={patient?.nutritionGoal ?? '—'} />
        </View>

        {/* Edit button */}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => (navigation as any).navigate('EditProfile')}
          activeOpacity={0.85}
        >
          <Ionicons name="pencil-outline" size={18} color={colors.gradientEnd} style={{ marginRight: 8 }} />
          <Text style={styles.editBtnText}>Editar perfil</Text>
        </TouchableOpacity>

        {/* Menu links */}
        <View style={styles.menuCard}>
          <MenuLink icon="person-outline" label="Mi nutricionista" onPress={() => (navigation as any).navigate('NutritionistProfile')} />
          <MenuLink icon="document-text-outline" label="Mis documentos" onPress={() => {}} />
          <MenuLink icon="card-outline" label="Planes de suscripción" onPress={() => (navigation as any).navigate('PaymentPlans')} />
          <MenuLink icon="settings-outline" label="Configuración" onPress={() => (navigation as any).navigate('Settings')} />
          <MenuLink icon="shield-checkmark-outline" label="Privacidad y seguridad" onPress={() => {}} />
          <MenuLink icon="help-circle-outline" label="Ayuda y soporte" onPress={() => {}} />
          <MenuLink icon="log-out-outline" label="Cerrar sesión" onPress={handleLogout} danger />
        </View>
      </ScrollView>
    </View>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={colors.gradientEnd} style={{ marginRight: 12 }} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

function MenuLink({ icon, label, onPress, danger = false }: { icon: any; label: string; onPress: () => void; danger?: boolean }) {
  return (
    <TouchableOpacity style={styles.menuLink} onPress={onPress} activeOpacity={0.75}>
      <Ionicons name={icon} size={20} color={danger ? colors.danger : colors.textPrimary} style={{ marginRight: 12 }} />
      <Text style={[styles.menuLinkLabel, danger && { color: colors.danger }]}>{label}</Text>
      {!danger && <Ionicons name="chevron-forward" size={18} color={colors.border} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  avatarArea: {
    alignItems: 'center',
    paddingTop: 8,
  },
  userName: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.white,
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  content: { padding: 20, paddingBottom: 48 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'space-around',
    ...shadow.card,
    marginTop: -20,
  },
  statItem: { alignItems: 'center' },
  statValue: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.gradientEnd,
  },
  statLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 16,
    ...shadow.card,
    gap: 14,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoLabel: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    flex: 1,
  },
  infoValue: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textDark,
    maxWidth: '55%',
    textAlign: 'right',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.gradientEnd,
    borderRadius: radius.xl,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: colors.surfaceLight,
  },
  editBtnText: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.gradientEnd,
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.card,
  },
  menuLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLinkLabel: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.textPrimary,
    flex: 1,
  },
});
