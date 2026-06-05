import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { MainStackScreenProps } from '../../navigation/types';
import { colors, fonts, gradientColors } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

export default function ScannerCameraScreen({ navigation }: MainStackScreenProps<'ScannerCamera'>) {
  const [flashOn, setFlashOn] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleCapture = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      navigation.replace('ScannerResult');
    }, 1200);
  };

  return (
    <View style={styles.container}>
      {/* Simulated camera background */}
      <View style={styles.cameraSimulator}>
        <Text style={styles.cameraMockText}>Vista de cámara (mockup)</Text>
        <Ionicons name="camera-outline" size={64} color="rgba(255,255,255,0.3)" />
      </View>

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.topBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={28} color={colors.white} />
        </TouchableOpacity>

        <Text style={styles.topTitle}>Escáner</Text>

        <TouchableOpacity
          style={[styles.topBtn, flashOn && styles.topBtnActive]}
          onPress={() => setFlashOn(!flashOn)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name={flashOn ? 'flash' : 'flash-off-outline'} size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Scan guide overlay */}
      <View style={styles.overlay}>
        <View style={styles.scanGuide}>
          {/* Corners */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />

          {scanning && (
            <LinearGradient
              colors={[...gradientColors, 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.scanLine}
            />
          )}
        </View>

        <Text style={styles.hintText}>
          {scanning ? 'Procesando...' : 'Enfoca la etiqueta nutricional'}
        </Text>
      </View>

      {/* Bottom controls */}
      <View style={styles.bottomBar}>
        <View style={styles.sideBtn} />

        <TouchableOpacity
          style={styles.captureBtn}
          onPress={handleCapture}
          activeOpacity={0.85}
          disabled={scanning}
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.captureGradient}
          >
            {scanning ? (
              <Ionicons name="hourglass-outline" size={32} color={colors.white} />
            ) : (
              <Ionicons name="scan-circle-outline" size={38} color={colors.white} />
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.sideBtn}>
          <Ionicons name="images-outline" size={28} color={colors.white} />
        </View>
      </View>
    </View>
  );
}

const GUIDE_SIZE = width * 0.72;
const CORNER_SIZE = 28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  cameraSimulator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  cameraMockText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.3)',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  topBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBtnActive: {
    backgroundColor: colors.gradientEnd,
  },
  topTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.white,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginTop: 100,
  },
  scanGuide: {
    width: GUIDE_SIZE,
    height: GUIDE_SIZE,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: colors.gradientEnd,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    top: '30%',
    borderRadius: 2,
  },
  hintText: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.white,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingBottom: 52,
    paddingTop: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sideBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtn: {
    borderRadius: 44,
    overflow: 'hidden',
    shadowColor: colors.gradientEnd,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  captureGradient: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
