import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { AuthScreenProps } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import { colors, fonts, gradientColors } from '../../constants/theme';

export default function BiometricAuthScreen({ navigation }: AuthScreenProps<'BiometricAuth'>) {
  const { restoreSession } = useAuth();
  const pulse = useRef(new Animated.Value(1)).current;
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    ).start();
  };

  useEffect(() => {
    startPulse();
    authenticate();
  }, []);

  const authenticate = async () => {
    if (isAuthenticating) return;
    setIsAuthenticating(true);

    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (!compatible || !enrolled) {
        // Si no hay biometría disponible, restaurar sesión directamente
        const ok = await restoreSession();
        if (!ok) navigation.replace('Login');
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Verifica tu identidad para continuar',
        cancelLabel: 'Usar contraseña',
        disableDeviceFallback: false,
      });

      if (result.success) {
        const ok = await restoreSession();
        if (!ok) {
          Alert.alert('Sesión expirada', 'Inicia sesión nuevamente.');
          navigation.replace('Login');
        }
        // Si ok=true, token queda seteado y AppNavigator redirige a Main automáticamente
      } else if (result.error === 'user_cancel' || result.error === 'system_cancel') {
        navigation.replace('Login');
      } else {
        Alert.alert('Autenticación fallida', 'No se pudo verificar tu identidad.');
      }
    } catch {
      Alert.alert('Error', 'Ocurrió un problema con la autenticación biométrica.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topArea}>
        <View style={styles.logoArea}>
          <Ionicons name="leaf" size={36} color={colors.gradientEnd} />
          <Text style={styles.brandName}>VitalBite</Text>
        </View>
        <Text style={styles.title}>Autenticación biométrica</Text>
        <Text style={styles.subtitle}>
          Toca el sensor de huella para ingresar de forma segura
        </Text>
      </View>

      <TouchableOpacity onPress={authenticate} disabled={isAuthenticating} activeOpacity={0.8}>
        <Animated.View style={[styles.fingerprintWrapper, { transform: [{ scale: pulse }] }]}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fingerprintCircle}
          >
            <Ionicons name="finger-print-outline" size={72} color={colors.white} />
          </LinearGradient>
          <View style={styles.pulseRing} />
        </Animated.View>
      </TouchableOpacity>

      <Text style={styles.hintText}>
        {isAuthenticating ? 'Verificando…' : 'Toca el sensor para ingresar'}
      </Text>

      <TouchableOpacity
        style={styles.passwordLink}
        onPress={() => navigation.replace('Login')}
      >
        <Text style={styles.passwordLinkText}>Usar contraseña en su lugar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 32,
    paddingTop: 80,
    paddingBottom: 64,
  },
  topArea: {
    alignItems: 'center',
  },
  logoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  brandName: {
    fontFamily: fonts.bold,
    fontSize: 26,
    color: colors.textDark,
  },
  title: {
    fontFamily: fonts.semiBold,
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
    lineHeight: 20,
    maxWidth: 260,
  },
  fingerprintWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fingerprintCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: colors.gradientEnd,
    opacity: 0.3,
  },
  hintText: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.textMuted,
  },
  passwordLink: {
    paddingVertical: 12,
  },
  passwordLinkText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.gradientEnd,
    textDecorationLine: 'underline',
  },
});
