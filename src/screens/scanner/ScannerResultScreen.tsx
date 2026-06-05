import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GradientHeader from '../../components/common/GradientHeader';
import GradientButton from '../../components/common/GradientButton';
import OutlineButton from '../../components/common/OutlineButton';
import type { MainStackScreenProps } from '../../navigation/types';
import { mockScanResult } from '../../mocks/data';
import { colors, fonts, gradientColors, radius, shadow } from '../../constants/theme';

export default function ScannerResultScreen({ navigation }: MainStackScreenProps<'ScannerResult'>) {
  const product = mockScanResult;

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <GradientHeader title="Resultado del escáner" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product header */}
        <View style={styles.productCard}>
          <View style={styles.productIconArea}>
            <Ionicons name="fast-food-outline" size={44} color={colors.gradientEnd} />
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productBrand}>{product.brand}</Text>
            <Text style={styles.productPortion}>Por {product.portionSize}</Text>
          </View>
        </View>

        {/* Main calorie metric */}
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.calorieBanner}
        >
          <Text style={styles.calorieLabel}>Calorías</Text>
          <Text style={styles.calorieValue}>{product.calories}</Text>
          <Text style={styles.calorieUnit}>kcal</Text>
        </LinearGradient>

        {/* Macro pills */}
        <View style={styles.macroRow}>
          <MacroChip label="Proteínas" value={`${product.protein}g`} color="#1DB954" />
          <MacroChip label="Carbohidratos" value={`${product.carbs}g`} color="#FFB800" />
          <MacroChip label="Grasas" value={`${product.fat}g`} color="#FF7043" />
          <MacroChip label="Fibra" value={`${product.fiber}g`} color="#9B59B6" />
        </View>

        {/* Extra nutrition */}
        <View style={styles.extraRow}>
          <NutritionRow label="Azúcares" value={`${product.sugar} g`} />
          <NutritionRow label="Sodio" value={`${product.sodium} mg`} />
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredientes</Text>
          {product.ingredients.map((ing, i) => (
            <View key={i} style={styles.ingredientRow}>
              <Ionicons name="ellipse" size={6} color={colors.gradientEnd} style={{ marginRight: 8, marginTop: 4 }} />
              <Text style={styles.ingredientText}>{ing}</Text>
            </View>
          ))}
        </View>

        {/* Allergens */}
        {product.allergens.length > 0 && (
          <View style={styles.allergenCard}>
            <Ionicons name="warning-outline" size={18} color={colors.warning} style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.allergenTitle}>Alérgenos</Text>
              {product.allergens.map((a, i) => (
                <Text key={i} style={styles.allergenText}>{a}</Text>
              ))}
            </View>
          </View>
        )}

        <GradientButton
          label="Guardar escaneo"
          onPress={() => navigation.navigate('ScannerHome')}
          style={{ marginBottom: 12 }}
        />
        <OutlineButton
          label="Escanear otro producto"
          onPress={() => navigation.replace('ScannerCamera')}
        />
      </ScrollView>
    </View>
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
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 16,
    ...shadow.card,
  },
  productIconArea: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  productInfo: { flex: 1 },
  productName: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textDark,
  },
  productBrand: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  productPortion: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.gradientEnd,
    marginTop: 4,
  },
  calorieBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    paddingVertical: 20,
    marginBottom: 16,
    gap: 8,
  },
  calorieLabel: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
  },
  calorieValue: {
    fontFamily: fonts.bold,
    fontSize: 40,
    color: colors.white,
  },
  calorieUnit: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 10,
  },
  macroRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  macroChip: {
    flex: 1,
    minWidth: '21%',
    borderRadius: radius.md,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  macroChipValue: {
    fontFamily: fonts.bold,
    fontSize: 16,
  },
  macroChipLabel: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  extraRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 16,
    gap: 12,
  },
  nutritionRow: {
    flex: 1,
    alignItems: 'center',
  },
  nutritionLabel: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 2,
  },
  nutritionValue: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textDark,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textDark,
    marginBottom: 10,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  ingredientText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    flex: 1,
    lineHeight: 19,
  },
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
  allergenTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 4,
  },
  allergenText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: '#856404',
    lineHeight: 19,
  },
});
