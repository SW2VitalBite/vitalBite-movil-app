import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GradientHeader from '../../components/common/GradientHeader';
import GradientButton from '../../components/common/GradientButton';
import InputField from '../../components/common/InputField';
import type { AuthScreenProps } from '../../navigation/types';
import { colors, fonts, gradientColors, radius } from '../../constants/theme';

export default function ForgotPasswordScreen({ navigation }: AuthScreenProps<'ForgotPassword'>) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <View style={styles.successContainer}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.successIcon}
        >
          <Ionicons name="checkmark" size={44} color={colors.white} />
        </LinearGradient>
        <Text style={styles.successTitle}>¡Correo enviado!</Text>
        <Text style={styles.successBody}>
          Revisa tu bandeja de entrada. Hemos enviado un enlace de recuperación a{' '}
          <Text style={styles.emailHighlight}>{email}</Text>.
        </Text>
        <GradientButton
          label="Volver al inicio"
          onPress={() => navigation.navigate('Login')}
          style={{ marginTop: 32, width: '80%' }}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <GradientHeader title="Recuperar contraseña" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.iconArea}>
          <Ionicons name="lock-open-outline" size={60} color={colors.gradientEnd} />
        </View>
        <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
        <Text style={styles.subtitle}>
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.
        </Text>

        <InputField
          label="Correo electrónico"
          icon="mail-outline"
          placeholder="tu@email.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <GradientButton
          label="Enviar enlace de recuperación"
          onPress={() => setSent(true)}
          style={{ marginTop: 16 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.white },
  content: { padding: 24, paddingBottom: 48 },
  iconArea: {
    alignItems: 'center',
    marginVertical: 32,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.textDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 28,
  },
  successContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontFamily: fonts.bold,
    fontSize: 26,
    color: colors.textDark,
    marginBottom: 14,
  },
  successBody: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  emailHighlight: {
    fontFamily: fonts.semiBold,
    color: colors.gradientEnd,
  },
});
