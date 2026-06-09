import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as LocalAuthentication from 'expo-local-authentication';
import GradientHeader from '../../components/common/GradientHeader';
import type { MainStackScreenProps } from '../../navigation/types';
import { useSettings, type AppSettings } from '../../contexts/SettingsContext';
import { colors, fonts, radius, shadow } from '../../constants/theme';

export default function SettingsScreen({ navigation }: MainStackScreenProps<'Settings'>) {
  const { settings, setSetting } = useSettings();
  const [busy, setBusy] = useState(false);

  // Activar una notificación exige permiso del SO; si se niega, no la activamos.
  const toggleNotif = async (key: keyof AppSettings, value: boolean) => {
    if (value) {
      const { status } = await Notifications.getPermissionsAsync();
      let final = status;
      if (status !== 'granted') {
        final = (await Notifications.requestPermissionsAsync()).status;
      }
      if (final !== 'granted') {
        Alert.alert(
          'Permiso necesario',
          'Activa las notificaciones de VitalBite en los ajustes de tu teléfono para recibir estos avisos.',
        );
        return;
      }
    }
    await setSetting(key, value);
  };

  // Activar biometría: verifica hardware/registro y pide confirmar identidad.
  const toggleBiometric = async (value: boolean) => {
    if (!value) {
      await setSetting('biometricEnabled', false);
      return;
    }
    setBusy(true);
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!compatible || !enrolled) {
        Alert.alert(
          'No disponible',
          'Tu dispositivo no tiene huella o rostro configurados. Regístralos en los ajustes del sistema para usar esta opción.',
        );
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirma tu identidad para activar el ingreso biométrico',
        cancelLabel: 'Cancelar',
      });
      if (result.success) {
        await setSetting('biometricEnabled', true);
        Alert.alert('Listo', 'Usarás tu huella o rostro para ingresar a VitalBite.');
      }
    } catch {
      Alert.alert('Error', 'No se pudo configurar la autenticación biométrica.');
    } finally {
      setBusy(false);
    }
  };

  const notYet = () =>
    Alert.alert('Próximamente', 'Esta función estará disponible en una próxima actualización.');

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Eliminar cuenta',
      'Para eliminar tu cuenta y tus datos, tu solicitud debe ser gestionada por tu clínica. ¿Quieres enviar la solicitud?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar solicitud',
          style: 'destructive',
          onPress: () =>
            Alert.alert('Solicitud enviada', 'Tu clínica revisará la solicitud de eliminación.'),
        },
      ],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Configuración" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader label="Notificaciones" />
        <View style={styles.card}>
          <ToggleRow
            icon="calendar-outline"
            label="Recordatorio de citas"
            value={settings.notifAppointments}
            onToggle={(v) => toggleNotif('notifAppointments', v)}
          />
          <ToggleRow
            icon="nutrition-outline"
            label="Nueva dieta asignada"
            value={settings.notifDiet}
            onToggle={(v) => toggleNotif('notifDiet', v)}
          />
          <ToggleRow
            icon="document-text-outline"
            label="Nuevo reporte disponible"
            value={settings.notifReport}
            onToggle={(v) => toggleNotif('notifReport', v)}
          />
        </View>

        <SectionHeader label="Seguridad" />
        <View style={styles.card}>
          <ToggleRow
            icon="finger-print-outline"
            label="Autenticación biométrica"
            value={settings.biometricEnabled}
            onToggle={toggleBiometric}
            disabled={busy}
          />
          <NavRow icon="lock-closed-outline" label="Cambiar contraseña" onPress={notYet} />
        </View>

        <SectionHeader label="Cuenta" />
        <View style={styles.card}>
          <NavRow
            icon="help-circle-outline"
            label="Centro de ayuda"
            onPress={() => navigation.navigate('InfoPage', { page: 'help' })}
          />
          <NavRow
            icon="document-text-outline"
            label="Términos y condiciones"
            onPress={() => navigation.navigate('InfoPage', { page: 'terms' })}
          />
          <NavRow
            icon="shield-outline"
            label="Política de privacidad"
            onPress={() => navigation.navigate('InfoPage', { page: 'privacy' })}
          />
          <NavRow icon="trash-outline" label="Eliminar cuenta" onPress={confirmDeleteAccount} danger />
        </View>

        <Text style={styles.versionText}>VitalBite v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

function SectionHeader({ label }: { label: string }) {
  return <Text style={styles.sectionHeader}>{label}</Text>;
}

function ToggleRow({
  icon,
  label,
  value,
  onToggle,
  disabled = false,
}: {
  icon: any;
  label: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={20} color={colors.gradientEnd} style={{ marginRight: 12 }} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
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
