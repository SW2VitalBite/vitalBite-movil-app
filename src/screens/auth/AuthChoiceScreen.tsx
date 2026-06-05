import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import GradientButton from '../../components/common/GradientButton';
import OutlineButton from '../../components/common/OutlineButton';
import Logo from '../../components/common/Logo';
import type { AuthScreenProps } from '../../navigation/types';
import { colors, fonts, spacing } from '../../constants/theme';

export default function AuthChoiceScreen({ navigation }: AuthScreenProps<'AuthChoice'>) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heroSection}>
        <Logo size={120} variant="gradient" wordmarkSize={34} style={{ marginBottom: 12 }} />
        <Text style={styles.tagline}>
          Conecta con tu nutricionista y lleva el control de tu alimentación
        </Text>
      </View>

      <View style={styles.illustrationDots}>
        {[0, 1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={[
              styles.illustDot,
              { opacity: 0.15 + i * 0.17, backgroundColor: colors.gradientEnd },
            ]}
          />
        ))}
      </View>

      <View style={styles.actions}>
        <Text style={styles.welcomeText}>¡Bienvenido/a!</Text>
        <Text style={styles.subtitle}>¿Qué deseas hacer?</Text>

        <GradientButton
          label="Iniciar Sesión"
          onPress={() => navigation.navigate('Login')}
          style={{ marginBottom: spacing.md }}
        />
        <OutlineButton
          label="Crear una cuenta"
          onPress={() => navigation.navigate('SignUp')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 28,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: colors.gradientEnd,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  brandName: {
    fontFamily: fonts.bold,
    fontSize: 36,
    color: colors.textDark,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  tagline: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  illustrationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 32,
  },
  illustDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  actions: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 32,
  },
  welcomeText: {
    fontFamily: fonts.bold,
    fontSize: 26,
    color: colors.textDark,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textMuted,
    marginBottom: 28,
  },
});
