import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientHeader from '../../components/common/GradientHeader';
import type { MainStackScreenProps } from '../../navigation/types';
import { colors, fonts, radius, shadow } from '../../constants/theme';

export default function SettingsScreen({ navigation }: MainStackScreenProps<'Settings'>) {
  const [notifAppt, setNotifAppt] = useState(true);
  const [notifDiet, setNotifDiet] = useState(true);
  const [notifReport, setNotifReport] = useState(false);
  const [biometric, setBiometric] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Configuración" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader label="Notificaciones" />
        <View style={styles.card}>
          <ToggleRow
            icon="calendar-outline"
            label="Recordatorio de citas"
            value={notifAppt}
            onToggle={setNotifAppt}
          />
          <ToggleRow
            icon="nutrition-outline"
            label="Nueva dieta asignada"
            value={notifDiet}
            onToggle={setNotifDiet}
          />
          <ToggleRow
            icon="document-text-outline"
            label="Nuevo reporte disponible"
            value={notifReport}
            onToggle={setNotifReport}
          />
        </View>

        <SectionHeader label="Seguridad" />
        <View style={styles.card}>
          <ToggleRow
            icon="finger-print-outline"
            label="Autenticación biométrica"
            value={biometric}
            onToggle={setBiometric}
          />
          <NavRow icon="lock-closed-outline" label="Cambiar contraseña" onPress={() => {}} />
        </View>

        <SectionHeader label="Apariencia" />
        <View style={styles.card}>
          <ToggleRow
            icon="moon-outline"
            label="Modo oscuro"
            value={darkMode}
            onToggle={setDarkMode}
          />
        </View>

        <SectionHeader label="Cuenta" />
        <View style={styles.card}>
          <NavRow icon="help-circle-outline" label="Centro de ayuda" onPress={() => {}} />
          <NavRow icon="document-text-outline" label="Términos y condiciones" onPress={() => {}} />
          <NavRow icon="shield-outline" label="Política de privacidad" onPress={() => {}} />
          <NavRow icon="trash-outline" label="Eliminar cuenta" onPress={() => {}} danger />
        </View>

        <Text style={styles.versionText}>VitalBite v1.0.0 · Mockup</Text>
      </ScrollView>
    </View>
  );
}

function SectionHeader({ label }: { label: string }) {
  return <Text style={styles.sectionHeader}>{label}</Text>;
}

function ToggleRow({ icon, label, value, onToggle }: { icon: any; label: string; value: boolean; onToggle: (v: boolean) => void }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={20} color={colors.gradientEnd} style={{ marginRight: 12 }} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.gradientEnd + '80' }}
        thumbColor={value ? colors.gradientEnd : '#f4f3f4'}
        ios_backgroundColor={colors.border}
      />
    </View>
  );
}

function NavRow({ icon, label, onPress, danger = false }: { icon: any; label: string; onPress: () => void; danger?: boolean }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={20} color={danger ? colors.danger : colors.textPrimary} style={{ marginRight: 12 }} />
        <Text style={[styles.rowLabel, danger && { color: colors.danger }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.border} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 48 },
  sectionHeader: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 20,
    paddingLeft: 4,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowLabel: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.textPrimary,
  },
  versionText: {
    fontFamily: fonts.light,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 28,
  },
});
