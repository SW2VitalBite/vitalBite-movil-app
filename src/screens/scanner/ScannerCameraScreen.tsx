import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import GradientButton from '../../components/common/GradientButton';
import type { MainStackScreenProps } from '../../navigation/types';
import { colors, fonts } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function ScannerCameraScreen({
  navigation,
  route,
}: MainStackScreenProps<'ScannerCamera'>) {
  const { mode } = route.params;
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [flashOn, setFlashOn] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const hint = mode === 'label' ? 'Enfoca la etiqueta nutricional' : 'Enfoca el plato de comida';

  const goToResult = (imageUri: string) =>
    navigation.replace('ScannerResult', { imageUri, mode });

  const handleCapture = async () => {
    if (!cameraRef.current || capturing) return;
    try {
      setCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (photo?.uri) goToResult(photo.uri);
    } finally {
      setCapturing(false);
    }
  };

  const handlePickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      goToResult(result.assets[0].uri);
    }
  };

  // Permiso aún cargando
  if (!permission) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color={colors.white} />
      </View>
    );
  }

  // Permiso denegado / no concedido aún
  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.center, { padding: 28 }]}>
        <Ionicons name="camera-outline" size={64} color="rgba(255,255,255,0.5)" />
        <Text style={styles.permTitle}>Permiso de cámara requerido</Text>
        <Text style={styles.permBody}>
          VitalBite necesita acceso a la cámara para escanear alimentos y etiquetas.
        </Text>
        <GradientButton label="Conceder permiso" onPress={requestPermission} style={{ marginTop: 20 }} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={styles.permCancel}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" enableTorch={flashOn} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.topBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={28} color={colors.white} />
        </TouchableOpacity>

        <Text style={styles.topTitle}>{mode === 'label' ? 'Etiqueta' : 'Plato'}</Text>

        <TouchableOpacity
          style={[styles.topBtn, flashOn && styles.topBtnActive]}
          onPress={() => setFlashOn((v) => !v)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name={flashOn ? 'flash' : 'flash-off-outline'} size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Scan guide overlay */}
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.scanGuide}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>
        <Text style={styles.hintText}>{capturing ? 'Procesando...' : hint}</Text>
      </View>

      {/* Bottom controls */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.sideBtn} onPress={handlePickFromGallery} disabled={capturing}>
          <Ionicons name="images-outline" size={28} color={colors.white} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureBtn} onPress={handleCapture} activeOpacity={0.85} disabled={capturing}>
          <View style={styles.captureInner}>
            {capturing ? (
              <ActivityIndicator color={colors.gradientEnd} />
            ) : (
              <View style={styles.captureDot} />
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.sideBtn} />
      </View>
    </View>
  );
}

const GUIDE_SIZE = width * 0.72;
const CORNER_SIZE = 28;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  center: { alignItems: 'center', justifyContent: 'center' },
  permTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.white,
    marginTop: 16,
    textAlign: 'center',
  },
  permBody: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  permCancel: { fontFamily: fonts.medium, fontSize: 14, color: 'rgba(255,255,255,0.7)' },
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
  topBtnActive: { backgroundColor: colors.gradientEnd },
  topTitle: { fontFamily: fonts.semiBold, fontSize: 18, color: colors.white },
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24 },
  scanGuide: { width: GUIDE_SIZE, height: GUIDE_SIZE, position: 'relative' },
  corner: { position: 'absolute', width: CORNER_SIZE, height: CORNER_SIZE, borderColor: colors.gradientEnd },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
  hintText: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.white,
    textShadowColor: 'rgba(0,0,0,0.6)',
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
    paddingHorizontal: 40,
    paddingBottom: 52,
    paddingTop: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sideBtn: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  captureBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureDot: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.white },
});
