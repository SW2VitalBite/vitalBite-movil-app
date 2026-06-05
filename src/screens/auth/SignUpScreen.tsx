import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import GradientButton from '../../components/common/GradientButton';
import InputField from '../../components/common/InputField';
import GradientHeader from '../../components/common/GradientHeader';
import type { AuthScreenProps } from '../../navigation/types';
import { colors, fonts, spacing } from '../../constants/theme';

export default function SignUpScreen({ navigation }: AuthScreenProps<'SignUp'>) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    officeCode: '',
  });

  const update = (key: keyof typeof form) => (val: string) => setForm({ ...form, [key]: val });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <GradientHeader title="Crear cuenta" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Regístrate gratis</Text>
        <Text style={styles.subtitle}>Tu nutricionista te habrá dado un código de consultorio</Text>

        <View style={styles.nameRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <InputField label="Nombre" placeholder="María" value={form.firstName} onChangeText={update('firstName')} />
          </View>
          <View style={{ flex: 1 }}>
            <InputField label="Apellido" placeholder="González" value={form.lastName} onChangeText={update('lastName')} />
          </View>
        </View>

        <InputField
          label="Correo electrónico"
          icon="mail-outline"
          placeholder="tu@email.com"
          keyboardType="email-address"
          value={form.email}
          onChangeText={update('email')}
        />
        <InputField
          label="Contraseña"
          icon="lock-closed-outline"
          placeholder="Mínimo 8 caracteres"
          isPassword
          value={form.password}
          onChangeText={update('password')}
        />
        <InputField
          label="Confirmar contraseña"
          icon="lock-closed-outline"
          placeholder="Repite tu contraseña"
          isPassword
          value={form.confirmPassword}
          onChangeText={update('confirmPassword')}
        />
        <InputField
          label="Código de consultorio"
          icon="business-outline"
          placeholder="Ej: VB-2026-XYZ"
          value={form.officeCode}
          onChangeText={update('officeCode')}
        />

        <GradientButton label="Crear cuenta" onPress={() => {}} style={{ marginTop: 8 }} />

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.white },
  content: { padding: 24, paddingBottom: 48 },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.textDark,
    marginBottom: 6,
    marginTop: 8,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 24,
    lineHeight: 20,
  },
  nameRow: {
    flexDirection: 'row',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  loginLink: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.gradientEnd,
  },
});
