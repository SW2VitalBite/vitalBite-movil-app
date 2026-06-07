import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from '../../components/common/Logo';
import type { AuthScreenProps } from '../../navigation/types';
import { colors, fonts, gradientColors } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

export default function SplashScreen({ navigation }: AuthScreenProps<'Splash'>) {
  const { hasStoredSession, isLoading } = useAuth();
  const scale = new Animated.Value(0.7);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      navigation.replace(hasStoredSession ? 'BiometricAuth' : 'Onboarding');
    }, 2500);
    return () => clearTimeout(timer);
  }, [isLoading, hasStoredSession]);

  return (
    <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      <Animated.View style={[styles.logoArea, { transform: [{ scale }], opacity }]}>
        <Logo size={130} variant="white" wordmarkSize={36} />
        <Text style={styles.tagline}>Tu nutrición personalizada</Text>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Tu salud, nuestro compromiso</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoArea: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  brandName: {
    fontFamily: fonts.bold,
    fontSize: 40,
    color: colors.white,
    letterSpacing: 1,
  },
  tagline: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
  },
  footerText: {
    fontFamily: fonts.light,
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.5,
  },
});
