import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import GradientButton from '../../components/common/GradientButton';
import InputField from '../../components/common/InputField';
import GradientHeader from '../../components/common/GradientHeader';
import type { AuthScreenProps } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import { colors, fonts, gradientColors, radius, spacing } from '../../constants/theme';

export default function LoginScreen({ navigation }: AuthScreenProps<'Login'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Por favor ingresa tu correo y contraseña.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await login(email.trim(), password.trim());
      // AppNavigator redirige automáticamente al detectar el token
    } catch (err: any) {
      const msg = err?.graphQLErrors?.[0]?.message ?? 'Correo o contraseña incorrectos.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <GradientHeader title="Iniciar Sesión" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.welcomeTitle}>¡Bienvenido de vuelta!</Text>
        <Text style={styles.welcomeSubtitle}>Ingresa tus credenciales para continuar</Text>

        <InputField
          label="Correo electrónico"
          icon="mail-outline"
          placeholder="tu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <InputField
          label="Contraseña"
          icon="lock-closed-outline"
          placeholder="••••••••"
          isPassword
          value={password}
          onChangeText={setPassword}
        />

        {errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.forgotLink}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <GradientButton
          label={isSubmitting ? 'Ingresando...' : 'Iniciar Sesión'}
          onPress={handleLogin}
          disabled={isSubmitting}
          style={{ marginTop: 8 }}
        />

        <View style={styles.separator}>
          <View style={styles.sepLine} />
          <Text style={styles.sepText}>o</Text>
          <View style={styles.sepLine} />
        </View>

        <TouchableOpacity
          style={styles.biometricBtn}
          onPress={() => navigation.navigate('BiometricAuth')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.biometricGradient}
          >
            <Ionicons name="finger-print-outline" size={28} color={colors.white} />
          </LinearGradient>
          <Text style={styles.biometricLabel}>Ingresar con huella digital</Text>
        </TouchableOpacity>

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  welcomeTitle: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.textDark,
    marginBottom: 6,
    marginTop: 8,
  },
  welcomeSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 28,
  },
  errorText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.danger,
    marginBottom: 8,
    marginTop: 4,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 20,
  },
  forgotText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.gradientEnd,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  sepLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  sepText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  biometricBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 14,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.gradientEnd,
    backgroundColor: colors.surfaceLight,
  },
  biometricGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  biometricLabel: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.gradientEnd,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  signupText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  signupLink: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.gradientEnd,
  },
});
