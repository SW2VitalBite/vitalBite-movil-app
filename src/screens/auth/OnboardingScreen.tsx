import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { AuthScreenProps } from '../../navigation/types';
import { colors, fonts, gradientColors, radius } from '../../constants/theme';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'nutrition-outline' as const,
    title: 'Tu nutrición\npersonalizada',
    body: 'Conecta con tu nutricionista y recibe un plan de alimentación diseñado especialmente para ti.',
    bgColor: '#E8FDF9',
  },
  {
    id: '2',
    icon: 'body-outline' as const,
    title: 'Seguimiento\ninteligente',
    body: 'Visualiza tu evolución corporal con gráficas detalladas de IMC, grasa, músculo y más.',
    bgColor: '#E8F6FD',
  },
  {
    id: '3',
    icon: 'scan-outline' as const,
    title: 'Escanea lo que\nconsumes',
    body: 'Apunta la cámara a cualquier etiqueta nutricional y conoce al instante los valores de tu alimento.',
    bgColor: '#E9F0FE',
  },
];

export default function OnboardingScreen({ navigation }: AuthScreenProps<'Onboarding'>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const goNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: activeIndex + 1 });
      setActiveIndex(activeIndex + 1);
    } else {
      navigation.replace('AuthChoice');
    }
  };

  const skip = () => navigation.replace('AuthChoice');

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipBtn} onPress={skip}>
        <Text style={styles.skipText}>Omitir</Text>
      </TouchableOpacity>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(s) => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(idx);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.illustrationContainer, { backgroundColor: item.bgColor }]}>
              <Ionicons name={item.icon} size={120} color={colors.gradientEnd} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((s, i) => (
            <View
              key={s.id}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>

        <TouchableOpacity onPress={goNext} activeOpacity={0.85} style={{ borderRadius: radius.full, overflow: 'hidden' }}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextBtn}
          >
            {activeIndex < SLIDES.length - 1 ? (
              <Ionicons name="arrow-forward" size={28} color={colors.white} />
            ) : (
              <Text style={styles.startLabel}>Comenzar</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  skipBtn: {
    position: 'absolute',
    top: 56,
    right: 24,
    zIndex: 10,
  },
  skipText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textMuted,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  illustrationContainer: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 30,
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingBottom: 48,
    paddingTop: 24,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.gradientEnd,
  },
  nextBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  startLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.white,
  },
});
