# Reporte de Bugs — App Móvil VitalBite

**Fecha:** 2026-06-09
**Dispositivo de prueba:** Samsung Galaxy S23+ (SM-S916B), Android 16, 1080×2340
**Herramienta:** MobAI (automatización + capturas en dispositivo físico)
**App build:** Expo SDK 54 / React Native 0.81 (New Architecture / Fabric)

Este documento lista los bugs detectados (reproducidos en dispositivo) y los hallazgos de revisión de código, con su causa raíz y la corrección propuesta. Están ordenados por severidad.

---

## 🔴 BUG-01 — Chip de filtro activo queda invisible en **Notificaciones** (CRÍTICO)

### Descripción
En la pantalla **Notificaciones**, la fila de filtros `Hoy` / `Ayer` / `Semana` / `Todas`. Al **cambiar** de un filtro a otro, el chip recién seleccionado queda **transparente / invisible** (no se ve ni el fondo de color ni el texto). El filtro sí se aplica (la lista cambia), pero el usuario no ve cuál está activo.

### Reproducción (confirmada)
1. Abrir **Inicio → Notificaciones**.
2. El filtro `Todas` aparece correctamente con su fondo degradado cian → *(OK en la carga inicial)*.
3. Tocar `Semana`.
4. **Resultado:** el chip `Semana` desaparece visualmente — queda un hueco en blanco entre `Ayer` y `Todas`. El chip `Todas` vuelve correctamente a su estado inactivo (contorno).

| Estado inicial (`Todas` activo, OK) | Tras tocar `Semana` (chip invisible) |
| --- | --- |
| `Todas` se ve con degradado y texto blanco | El chip `Semana` queda en blanco/invisible |

### Causa raíz
**Archivo:** `src/components/common/DateChip.tsx`

El componente renderiza **dos árboles de componentes distintos** según `active`:

- `active === true` → `TouchableOpacity` que contiene un `<LinearGradient>` (de `expo-linear-gradient`) con `Text` blanco encima (`activeLabel: colors.white`).
- `active === false` → `TouchableOpacity` con fondo blanco y borde.

Cuando cambia el filtro, el chip que antes estaba inactivo pasa a activo, lo que provoca el **montaje de un `LinearGradient` nuevo** (y el desmontaje del anterior). En la **New Architecture (Fabric)** de React Native + `expo-linear-gradient`, un `LinearGradient` montado como consecuencia de un cambio de estado a veces **no pinta el degradado en el primer frame** (queda transparente hasta un re-layout que aquí no ocurre). Como el texto es **blanco sobre fondo transparente**, el chip entero se vuelve invisible.

Esto explica por qué **en la carga inicial el chip activo SÍ se ve** (el gradiente se monta junto con toda la pantalla) pero **falla al cambiar de selección** (montaje aislado por cambio de estado).

### Corrección propuesta
Evitar el **montaje/desmontaje** del `LinearGradient` al cambiar de estado. El gradiente debe montarse **una sola vez** (en el render inicial de cada chip) y no volver a montarse/desmontarse. El estado activo/inactivo se controla con una capa blanca superpuesta (un `View` normal, que sí repinta de forma fiable):

```tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, gradientColors, radius } from '../../constants/theme';

interface DateChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export default function DateChip({ label, active, onPress, style }: DateChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.chip, styles.clip, style]}
    >
      {/* Gradiente montado SIEMPRE (nunca se desmonta) → evita el bug de repintado */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Capa blanca que oculta el gradiente cuando el chip está inactivo */}
      {!active && <View style={[StyleSheet.absoluteFill, styles.inactiveCover]} />}
      <Text style={[styles.label, active ? styles.activeLabel : styles.inactiveLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clip: { borderRadius: radius.full, overflow: 'hidden' },
  inactiveCover: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.gradientEnd,
    borderRadius: radius.full,
  },
  label: { fontFamily: fonts.medium, fontSize: 13 },
  activeLabel: { color: colors.white },
  inactiveLabel: { color: colors.gradientEnd },
});
```

**Alternativa más simple (si se acepta perder el degradado en el chip):** usar un fondo sólido `backgroundColor: colors.gradientEnd` para el estado activo en lugar de `LinearGradient`. Elimina el bug por completo y es 100 % fiable, a costa de no tener degradado en el chip.

### Impacto
Afecta a **todas** las pantallas que usan `DateChip` (ver BUG-02). Severidad alta: el usuario pierde la referencia visual del filtro activo.

---

## 🔴 BUG-02 — Chip indicador activo queda invisible en **Gráfica detallada** (CRÍTICO)

### Descripción
Mismo síntoma que BUG-01, en la pantalla **Gráfica detallada** (`Progreso → Ver gráficas detalladas`). En la barra de indicadores `Peso (kg)` / `IMC` / `Grasa %` / `Músculo (kg)` / `Agua %`, al cambiar de indicador el chip seleccionado queda **transparente / invisible**.

### Reproducción (confirmada)
1. Abrir **Inicio → Progreso → Ver gráficas detalladas**.
2. El chip `IMC` aparece correctamente con degradado → *(OK en la carga inicial)*.
3. Tocar `Peso (kg)`.
4. **Resultado:** la gráfica y la tabla se actualizan a "Peso (kg)", pero el chip `Peso (kg)` queda **invisible** (hueco en blanco a la izquierda de la fila).

### Causa raíz
**Idéntica a BUG-01.** Esta pantalla (`src/screens/progress/ProgressChartScreen.tsx`, líneas 104-111) usa el mismo componente `DateChip` para los indicadores.

### Corrección propuesta
**La misma de BUG-01** — al corregir `src/components/common/DateChip.tsx` se resuelven ambos bugs simultáneamente. No requiere cambios adicionales en `ProgressChartScreen.tsx`.

> ℹ️ Nota: los botones de **Período** (`1 mes` / `3 meses` / `6 meses` / `1 año`) de esta misma pantalla **NO** usan `DateChip` — usan `TouchableOpacity` con estilos condicionales (`rangeBtnActive`) y por eso **no** presentan el bug (se ven correctamente al cambiar). Esto confirma que el problema es exclusivo de `DateChip` + `LinearGradient`.

---

## 🟡 BUG-03 — Filtro "Semana" incluye notificaciones con fecha futura (MENOR / lógica)

### Descripción
**Archivo:** `src/screens/notifications/NotificationScreen.tsx`, función `filterByRange` (líneas 47-61).

```ts
if (filter === 'Semana') return diffDays < 7;
```

`diffDays` puede ser **negativo** para notificaciones con `createdAt` en el futuro (p. ej. citas programadas o desfase de zona horaria/seed). La condición `diffDays < 7` deja pasar cualquier fecha futura. El filtro "Hoy" (`=== 0`) y "Ayer" (`=== 1`) no tienen este problema.

### Corrección propuesta
Acotar el rango a `[0, 7)`:

```ts
if (filter === 'Semana') return diffDays >= 0 && diffDays < 7;
```

### Impacto
Bajo. Solo se manifiesta si existen notificaciones con fecha futura. Conviene corregirlo para consistencia del filtrado.

---

## 🟡 BUG-04 — Parámetro `metricLabel` de navegación ignorado (MENOR / código muerto)

### Descripción
**Archivo:** `src/screens/progress/ProgressScreen.tsx`, línea 150:

```tsx
onPress={() => navigation.navigate('ProgressChart', { metric: 'bmi', metricLabel: 'IMC' })}
```

Se pasa `metricLabel: 'IMC'`, pero `ProgressChartScreen` **no lo usa**: deriva la etiqueta de la constante local `METRICS` mediante `metricConfig` (línea 64). El parámetro es código muerto y puede inducir a error.

### Corrección propuesta
Eliminar `metricLabel` del `navigate` (y de la firma del route param si no se usa en otro lugar), o bien usarlo en `ProgressChartScreen`. Recomendado: eliminarlo para mantener una única fuente de verdad (`METRICS`).

### Impacto
Cosmético / mantenibilidad. No produce error en runtime.

---

## 🟡 BUG-05 — Valores faltantes se grafican como `0` (MENOR / datos)

### Descripción
**Archivo:** `src/screens/progress/ProgressChartScreen.tsx`, `extractMeasValue` (37-41) y `extractCompValue` (43-48).

Cuando un campo opcional viene `null`/`undefined` se devuelve `0`:

```ts
if (key === 'bmi') return m.bmi ?? 0;
...
if (key === 'bodyFatPct') return c.bodyFatPercentage ?? 0;
```

Esto inserta puntos con valor **0** en la gráfica y en la tabla de datos, distorsionando la tendencia y la "Interpretación" (un dato faltante aparecería como una caída brusca a 0).

### Corrección propuesta
Filtrar las mediciones sin valor para la métrica activa **antes** de construir `chartData`, en lugar de sustituir por `0`. Por ejemplo, omitir el punto cuando el campo es `null`/`undefined`.

### Impacto
Bajo-medio. Depende de la calidad de los datos del backend; con datos completos no se aprecia, pero puede generar interpretaciones engañosas.

---

## Resumen

| ID | Severidad | Pantalla / Archivo | Estado | Causa raíz |
| --- | --- | --- | --- | --- |
| BUG-01 | 🔴 Crítico | Notificaciones · `DateChip.tsx` | Reproducido en dispositivo | Remontaje de `LinearGradient` → no repinta (Fabric) |
| BUG-02 | 🔴 Crítico | Gráfica detallada · `DateChip.tsx` | Reproducido en dispositivo | Mismo `DateChip` (misma causa que BUG-01) |
| BUG-03 | 🟡 Menor | `NotificationScreen.tsx` | Detectado por revisión | `diffDays < 7` admite fechas futuras |
| BUG-04 | 🟡 Menor | `ProgressScreen.tsx` | Detectado por revisión | Param `metricLabel` no usado |
| BUG-05 | 🟡 Menor | `ProgressChartScreen.tsx` | Detectado por revisión | `?? 0` grafica datos faltantes como 0 |

**Prioridad de corrección:** BUG-01 y BUG-02 se resuelven con **un único cambio** en `src/components/common/DateChip.tsx` y deben atenderse primero (afectan la usabilidad y son visibles en demo). BUG-03 a BUG-05 son mejoras de robustez/limpieza de menor urgencia.
