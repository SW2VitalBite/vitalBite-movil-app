import { Platform } from 'react-native';

export const colors = {
  gradientStart: '#33E4DB',
  gradientEnd: '#00BBD3',
  white: '#FFFFFF',
  surfaceLight: '#E9F6FE',
  textPrimary: '#252525',
  textDark: '#070707',
  textBlack: '#000000',
  textMuted: '#8A8A8A',
  textWhite: '#FFFFFF',
  danger: '#FF5A5F',
  warning: '#FFB800',
  success: '#1DB954',
  border: '#E5E5E5',
  inputBackground: '#F5F9FE',
  overlay: 'rgba(0,0,0,0.35)',
};

export const gradientColors: [string, string] = [colors.gradientStart, colors.gradientEnd];

export const gradientProps = {
  colors: gradientColors,
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
};

export const fonts = {
  light: Platform.select({ ios: 'LeagueSpartan_300Light', android: 'LeagueSpartan_300Light' }),
  regular: Platform.select({ ios: 'LeagueSpartan_400Regular', android: 'LeagueSpartan_400Regular' }),
  medium: Platform.select({ ios: 'LeagueSpartan_500Medium', android: 'LeagueSpartan_500Medium' }),
  semiBold: Platform.select({ ios: 'LeagueSpartan_600SemiBold', android: 'LeagueSpartan_600SemiBold' }),
  bold: Platform.select({ ios: 'LeagueSpartan_700Bold', android: 'LeagueSpartan_700Bold' }),
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const shadow = {
  sm: {
    shadowColor: '#00BBD3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#00BBD3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
};

export const headerHeight = 99;
export const bottomTabHeight = 67;
