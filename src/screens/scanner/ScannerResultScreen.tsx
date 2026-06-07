import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GradientHeader from '../../components/common/GradientHeader';
import GradientButton from '../../components/common/GradientButton';
import OutlineButton from '../../components/common/OutlineButton';
import type { MainStackScreenProps } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import { scanFood, IaServiceError, type FoodScanResult, type Semaforo } from '../../services/ia.service';
import { colors, fonts, gradientColors, radius, shadow } from '../../constants/theme';

const SEMAFORO_UI: Record<Semaforo, { color: string; icon: keyof typeof Ionicons.glyphMap; label: string }> = {
  SEGURO: { color: colors.success, icon: 'checkmark-circle', label: 'Seguro' },
  PRECAUCION: { color: colors.warning, icon: 'alert-circle', label: 'Precaución' },
  RIESGO: { color: colors.danger, icon: 'close-circle', label: 'Riesgo' },
};

function prettyClass(c: string): string {
  const s = c.replace(/_/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function ScannerResultScreen({ navigation, route }: MainStackScreenProps<'ScannerResult'>) {
  const { imageUri, mode } = route.params;
  const { patientId } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FoodScanResult | null>(null);

  const runScan = useCallback(async () => {
    if (!patientId) {
      setError('No se encontró el perfil de paciente para asociar el escaneo.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await scanFood({ imageUri, mode, patientId });
      setResult(res);
    } catch (e) {
      setError(e instanceof IaServiceError ? e.message : 'Ocurrió un error inesperado al analizar la imagen.');
    } finally {
      setLoading(false);
    }
  }, [imageUri, mode, patientId]);

  useEffect(() => {
    runScan();
  }, [runScan]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Resultado del escáner" onBack={() => navigation.goBack()} />

      {loading ? (
        <View style={styles.centerBox}>
          <Image source={{ uri: imageUri }} style={styles.previewLoading} />
          <ActivityIndicator color={colors.gradientEnd} size="large" style={{ marginTop: 24 }} />
          <Text style={styles.loadingText}>Analizando con IA...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerBox}>
          <Ionicons name="cloud-offline-outline" size={64} color={colors.textMuted} />
          <Text style={styles.errorTitle}>No se pudo analizar</Text>
          <Text style={styles.errorBody}>{error}</Text>
          <GradientButton label="Reintentar" onPress={runScan} style={{ marginTop: 20, width: '100%' }} />
          <OutlineButton label="Volver" onPress={() => navigation.goBack()} style={{ marginTop: 10 }} />
        </View>
      ) : result ? (
        <ResultContent result={result} imageUri={imageUri} mode={mode} navigation={navigation} />
      ) : null}
    </View>
  );
}

function ResultContent({
  result,
  imageUri,
  mode,
  navigation,
}: {
  result: FoodScanResult;
  imageUri: string;
  mode: 'label' | 'plate';
  navigation: MainStackScreenProps<'ScannerResult'>['navigation'];
}) {
  const sem = SEMAFORO_UI[result.semaforo];
  const n = result.nutrientes;

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: imageUri }} style={styles.preview} />

      {/* Semáforo */}
      <View style={[styles.semaforo, { backgroundColor: sem.color + '18', borderColor: sem.color }]}>
        <Ionicons name={sem.icon} size={28} color={sem.color} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.semaforoLabel, { color: sem.color }]}>{sem.label}</Text>
          <Text style={styles.semaforoConf}>Confianza: {(result.confianza * 100).toFixed(0)}%</Text>
        </View>
      </View>

      {/* Retoma por baja confianza */}
      {result.requiere_retoma && (
        <View style={styles.retomaCard}>
          <Ionicons name="camera-reverse-outline" size={20} color={colors.warning} style={{ marginRight: 8 }} />
          <Text style={styles.retomaText}>{result.mensaje_retoma ?? 'Imagen poco nítida. Intenta otra foto.'}</Text>
        </View>
      )}

      {/* Modo plato: predicciones */}
      {mode === 'plate' && result.predicciones_alimento.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alimento detectado</Text>
          {result.predicciones_alimento.map((p, i) => (
            <View key={p.clase} style={styles.predRow}>
              <Text style={[styles.predName, i === 0 && { fontFamily: fonts.bold, color: colors.textDark }]}>
                {prettyClass(p.clase)}
              </Text>
              <Text style={styles.predProb}>{(p.probabilidad * 100).toFixed(0)}%</Text>
            </View>
          ))}
        </View>
      )}

      {/* Modo etiqueta: nutrientes */}
      {mode === 'label' && (
        <>
          {n.calorias != null && (
            <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.calorieBanner}>
              <Text style={styles.calorieLabel}>Calorías</Text>
              <Text style={styles.calorieValue}>{n.calorias}</Text>
              <Text style={styles.calorieUnit}>kcal</Text>
            </LinearGradient>
          )}

          <View style={styles.macroRow}>
            {n.proteinas_g != null && <MacroChip label="Proteínas" value={`${n.proteinas_g}g`} color={colors.success} />}
            {n.carbohidratos_g != null && <MacroChip label="Carbohidratos" value={`${n.carbohidratos_g}g`} color={colors.warning} />}
            {n.grasas_totales_g != null && <MacroChip label="Grasas" value={`${n.grasas_totales_g}g`} color="#FF7043" />}
            {n.fibra_g != null && <MacroChip label="Fibra" value={`${n.fibra_g}g`} color="#9B59B6" />}
          </View>

          {(n.azucares_g != null || n.sodio_mg != null) && (
            <View style={styles.extraRow}>
              {n.azucares_g != null && <NutritionRow label="Azúcares" value={`${n.azucares_g} g`} />}
              {n.sodio_mg != null && <NutritionRow label="Sodio" value={`${n.sodio_mg} mg`} />}
            </View>
          )}

          {n.ingredientes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ingredientes</Text>
              {n.ingredientes.map((ing, i) => (
                <View key={i} style={styles.ingredientRow}>
                  <Ionicons name="ellipse" size={6} color={colors.gradientEnd} style={{ marginRight: 8, marginTop: 4 }} />
                  <Text style={styles.ingredientText}>{ing}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}

      {/* Advertencias */}
      {result.advertencias.length > 0 && (
        <View style={styles.allergenCard}>
          <Ionicons name="warning-outline" size={18} color={colors.warning} style={{ marginRight: 8 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.allergenTitle}>Advertencias</Text>
            {result.advertencias.map((a, i) => (
              <Text key={i} style={styles.allergenText}>{a}</Text>
            ))}
          </View>
        </View>
      )}

      <GradientButton label="Escanear otro" onPress={() => navigation.replace('ScannerCamera', { mode })} style={{ marginBottom: 12 }} />
      <OutlineButton label="Volver al inicio" onPress={() => navigation.navigate('ScannerHome')} />
    </ScrollView>
  );
}

function MacroChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.macroChip, { borderColor: color + '40', backgroundColor: color + '15' }]}>
      <Text style={[styles.macroChipValue, { color }]}>{value}</Text>
      <Text style={styles.macroChipLabel}>{label}</Text>
    </View>
  );
}

function NutritionRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.nutritionRow}>
      <Text style={styles.nutritionLabel}>{label}</Text>
      <Text style={styles.nutritionValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 48 },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  preview: { width: '100%', height: 180, borderRadius: radius.lg, marginBottom: 16, backgroundColor: colors.surfaceLight },
  previewLoading: { width: 140, height: 140, borderRadius: radius.lg, backgroundColor: colors.surfaceLight },
  loadingText: { fontFamily: fonts.medium, fontSize: 15, color: colors.textMuted, marginTop: 14 },
  errorTitle: { fontFamily: fonts.semiBold, fontSize: 18, color: colors.textDark, marginTop: 16 },
  errorBody: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  semaforo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 14,
  },
  semaforoLabel: { fontFamily: fonts.bold, fontSize: 20 },
  semaforoConf: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  retomaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 14,
  },
  retomaText: { flex: 1, fontFamily: fonts.regular, fontSize: 13, color: '#856404', lineHeight: 18 },
  calorieBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    paddingVertical: 20,
    marginBottom: 16,
    gap: 8,
  },
  calorieLabel: { fontFamily: fonts.medium, fontSize: 16, color: 'rgba(255,255,255,0.85)' },
  calorieValue: { fontFamily: fonts.bold, fontSize: 40, color: colors.white },
  calorieUnit: { fontFamily: fonts.medium, fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 10 },
  macroRow: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  macroChip: { flex: 1, minWidth: '21%', borderRadius: radius.md, padding: 10, alignItems: 'center', borderWidth: 1.5 },
  macroChipValue: { fontFamily: fonts.bold, fontSize: 16 },
  macroChipLabel: { fontFamily: fonts.regular, fontSize: 10, color: colors.textMuted, marginTop: 2, textAlign: 'center' },
  extraRow: { flexDirection: 'row', backgroundColor: colors.surfaceLight, borderRadius: radius.md, padding: 12, marginBottom: 16, gap: 12 },
  nutritionRow: { flex: 1, alignItems: 'center' },
  nutritionLabel: { fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted, marginBottom: 2 },
  nutritionValue: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.textDark },
  section: { marginBottom: 16 },
  sectionTitle: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.textDark, marginBottom: 10 },
  predRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 8,
  },
  predName: { fontFamily: fonts.medium, fontSize: 14, color: colors.textMuted },
  predProb: { fontFamily: fonts.bold, fontSize: 15, color: colors.gradientEnd },
  ingredientRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 5 },
  ingredientText: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, flex: 1, lineHeight: 19 },
  allergenCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF8E1',
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  allergenTitle: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.textDark, marginBottom: 4 },
  allergenText: { fontFamily: fonts.regular, fontSize: 13, color: '#856404', lineHeight: 19 },
});
