import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client/react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientButton from '../../components/common/GradientButton';
import Avatar from '../../components/common/Avatar';
import type { MainStackScreenProps } from '../../navigation/types';
import { GET_MY_NUTRITIONIST, GqlNutritionist } from '../../services/nutritionist.service';
import { colors, fonts, gradientColors, radius, shadow } from '../../constants/theme';

export default function NutritionistProfileScreen({ navigation }: MainStackScreenProps<'NutritionistProfile'>) {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : insets.top;

  const { data, loading } = useQuery<{ myNutritionist: GqlNutritionist | null }>(
    GET_MY_NUTRITIONIST,
    { fetchPolicy: 'cache-and-network' },
  );

  const nut = data?.myNutritionist;

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: topPadding + 8 }]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.white} />
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator color={colors.white} style={{ marginVertical: 32 }} />
        ) : (
          <View style={styles.profileArea}>
            <Avatar source={null} size={96} ring style={{ marginBottom: 12 }} />
            <Text style={styles.nutName}>
              {nut ? `${nut.firstName} ${nut.lastName}` : 'Nutricionista'}
            </Text>
            <Text style={styles.nutTitle}>Nutricionista Clínica</Text>
            <Text style={styles.nutSpecialty}>
              {nut?.email ?? '—'}
            </Text>
          </View>
        )}
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!loading && nut && (
          <>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={18} color={colors.gradientEnd} style={{ marginRight: 10 }} />
              <Text style={styles.infoLabel}>Correo</Text>
              <Text style={styles.infoValue}>{nut.email}</Text>
            </View>
          </>
        )}

        {!loading && !nut && (
          <View style={styles.empty}>
            <Ionicons name="person-outline" size={56} color={colors.border} />
            <Text style={styles.emptyText}>No se encontró el nutricionista asignado</Text>
          </View>
        )}

        <GradientButton
          label="Agendar cita"
          onPress={() => navigation.navigate('NutritionistSchedule')}
          style={{ marginBottom: 12 }}
        />
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
    marginBottom: 8,
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
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
