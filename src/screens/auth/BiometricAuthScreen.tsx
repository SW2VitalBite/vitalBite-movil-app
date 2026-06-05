import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { AuthScreenProps } from '../../navigation/types';
import { colors, fonts, gradientColors } from '../../constants/theme';

export default function BiometricAuthScreen({ navigation }: AuthScreenProps<'BiometricAuth'>) {
  const pulse = new Animated.Value(1);

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    ).start();
  };

  React.useEffect(() => {
    startPulse();
  }, []);

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

      <Text style={styles.hintText}>Toca el sensor para ingresar</Text>

      <TouchableOpacity
        style={styles.passwordLink}
        onPress={() => navigation.navigate('Login')}
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
