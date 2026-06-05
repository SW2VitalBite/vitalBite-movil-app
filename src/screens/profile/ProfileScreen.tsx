import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from '../../components/common/Avatar';
import type { MainTabScreenProps } from '../../navigation/types';
import { mockUser } from '../../mocks/data';
import { colors, fonts, gradientColors, radius, shadow, spacing } from '../../constants/theme';

export default function ProfileScreen({ navigation }: MainTabScreenProps<'ProfileTab'>) {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: topPadding + 12 }]}
      >
        <View style={styles.avatarArea}>
          <Avatar source={mockUser.avatar} size={90} ring style={{ marginBottom: 12 }} />
          <Text style={styles.userName}>{mockUser.firstName} {mockUser.lastName}</Text>
          <Text style={styles.userEmail}>{mockUser.email}</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatItem label="Peso" value={`${mockUser.weightKg} kg`} />
          <StatItem label="Altura" value={`${mockUser.heightCm} cm`} />
          <StatItem label="IMC" value={`${mockUser.bmi}`} />
        </View>

        {/* Info section */}
        <View style={styles.infoCard}>
          <InfoRow icon="calendar-outline" label="Fecha de nacimiento" value={mockUser.birthDate ?? '—'} />
          <InfoRow icon="call-outline" label="Teléfono" value={mockUser.phone ?? '—'} />
          <InfoRow icon="warning-outline" label="Alergias" value={mockUser.allergies?.join(', ') ?? 'Ninguna'} />
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
          <MenuLink icon="log-out-outline" label="Cerrar sesión" onPress={() => {}} danger />
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
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
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
  statItem: {
    alignItems: 'center',
  },
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
