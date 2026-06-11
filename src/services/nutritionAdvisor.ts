/**
 * Asesor nutricional del escáner (CU9, fase final).
 *
 * Cruza el resultado del escaneo (nutrientes OCR de una etiqueta o las
 * predicciones de un plato) con el **plan de dieta activo** y el **perfil** del
 * paciente para producir información accionable: alineación con el
 * plan/objetivo y sugerencias personalizadas.
 *
 * Es lógica pura (sin red ni estado): recibe los datos ya cargados por las
 * pantallas vía GraphQL y devuelve un modelo listo para renderizar. Así es
 * fácil de probar y no depende de llamadas entre microservicios.
 */

import type { FoodScanResult, NutrientInfo, ScanMode } from './ia.service';
import type { GqlDiet } from './diets.service';
import type { GqlMyProfile } from './nutritionist.service';

export type AlignmentVerdict = 'aligned' | 'caution' | 'off' | 'unknown';

export interface PlanAlignment {
  verdict: AlignmentVerdict;
  title: string;
  detail: string;
}

export interface NutritionInsights {
  /** Veredicto de alineación con el plan/objetivo. */
  alignment: PlanAlignment;
  /** Sugerencias personalizadas y accionables. */
  suggestions: string[];
  /** Calorías objetivo aproximadas por tiempo de comida (si el plan las define). */
  perMealCalorieTarget: number | null;
  /** Comidas del plan cuyo nombre coincide con el alimento detectado (plato). */
  matchingPlanItems: string[];
}

// ─── Utilidades internas ───────────────────────────────────────────────────────

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, ''); // sin tildes para comparar de forma robusta
}

/** Texto plano de todos los alimentos del plan, para cruzar con un plato. */
function planFoodTokens(diet: GqlDiet | null): { mealNames: string[]; itemNames: string[] } {
  const mealNames: string[] = [];
  const itemNames: string[] = [];
  for (const day of diet?.days ?? []) {
    for (const meal of day.meals ?? []) {
      mealNames.push(meal.name);
      for (const item of meal.items ?? []) itemNames.push(item.name);
    }
  }
  return { mealNames, itemNames };
}

/**
 * Calorías objetivo declaradas por el nutricionista a nivel de **comida**
 * (`diet_meals.targetCalories`). Es la referencia correcta para juzgar si un
 * producto encaja en un tiempo de comida; el plan en sí (`estimatedCalories`)
 * suele venir sin definir.
 */
function planMealCalorieTargets(diet: GqlDiet | null): number[] {
  const targets: number[] = [];
  for (const day of diet?.days ?? []) {
    for (const meal of day.meals ?? []) {
      if (typeof meal.targetCalories === 'number' && meal.targetCalories > 0) {
        targets.push(meal.targetCalories);
      }
    }
  }
  return targets;
}

function goalKeywords(profile: GqlMyProfile | null, diet: GqlDiet | null): string {
  return normalize([profile?.nutritionGoal ?? '', diet?.objective ?? ''].join(' '));
}

function wantsWeightLoss(goal: string): boolean {
  return /(perdida|perder|bajar|deficit|adelgaz|reducir|definicion)/.test(goal);
}

function wantsMuscleGain(goal: string): boolean {
  return /(masa|aumentar|ganar|volumen|hipertrof|fuerza)/.test(goal);
}

// ─── Alineación + sugerencias para ETIQUETAS ───────────────────────────────────

function buildLabelInsights(
  nutrients: NutrientInfo,
  diet: GqlDiet | null,
  profile: GqlMyProfile | null,
): { alignment: PlanAlignment; suggestions: string[]; perMealCalorieTarget: number | null } {
  const suggestions: string[] = [];
  const goal = goalKeywords(profile, diet);

  // Referencia de calorías por comida: primero las metas reales de cada comida
  // del plan; si no hay, se estima a partir del plan global como respaldo.
  const mealTargets = planMealCalorieTargets(diet);
  const minTarget = mealTargets.length ? Math.min(...mealTargets) : null;
  const maxTarget = mealTargets.length ? Math.max(...mealTargets) : null;
  const avgTarget = mealTargets.length
    ? Math.round(mealTargets.reduce((a, b) => a + b, 0) / mealTargets.length)
    : null;
  const fallbackPerMeal =
    diet?.estimatedCalories && diet?.mealsPerDay
      ? Math.round(diet.estimatedCalories / Math.max(1, diet.mealsPerDay))
      : null;
  const perMealCalorieTarget = avgTarget ?? fallbackPerMeal;

  const kcal = nutrients.calorias;
  let alignment: PlanAlignment;

  if (kcal == null) {
    alignment = {
      verdict: 'unknown',
      title: 'Sin calorías legibles',
      detail:
        'No pude leer las calorías de la etiqueta, así que no puedo compararlas con tu plan. Intenta reescanear enfocando la tabla nutricional.',
    };
  } else if (minTarget != null && maxTarget != null) {
    // Tenemos metas reales por comida → juzgar contra el rango del plan.
    if (kcal <= minTarget) {
      alignment = {
        verdict: 'aligned',
        title: 'Encaja en tu plan',
        detail: `Aporta ${kcal} kcal y cabe incluso en tu comida más ligera (~${minTarget} kcal). Entra sin problema en cualquier tiempo de comida.`,
      };
    } else if (kcal <= maxTarget) {
      alignment = {
        verdict: 'aligned',
        title: 'Encaja en tu comida principal',
        detail: `Aporta ${kcal} kcal. Entra en tus comidas más grandes (hasta ~${maxTarget} kcal), pero supera las ligeras (~${minTarget} kcal): resérvalo para esa comida.`,
      };
    } else if (kcal <= maxTarget * 1.25) {
      alignment = {
        verdict: 'caution',
        title: 'Justo en el límite',
        detail: `Aporta ${kcal} kcal, algo por encima de tu comida más grande (~${maxTarget} kcal). Reduce la porción para que encaje en tu plan.`,
      };
    } else {
      alignment = {
        verdict: 'off',
        title: 'Por encima de tu objetivo',
        detail: `Aporta ${kcal} kcal, bastante más que tu comida más grande (~${maxTarget} kcal). Mejor déjalo como una excepción ocasional.`,
      };
    }
  } else if (fallbackPerMeal != null) {
    // Plan sin metas por comida → usar la estimación global como referencia.
    if (kcal <= fallbackPerMeal) {
      alignment = {
        verdict: 'aligned',
        title: 'Encaja en tu plan',
        detail: `Aporta ${kcal} kcal y tu objetivo estimado por comida es ~${fallbackPerMeal} kcal. Entra cómodamente.`,
      };
    } else if (kcal <= fallbackPerMeal * 1.3) {
      alignment = {
        verdict: 'caution',
        title: 'Justo en el límite',
        detail: `Aporta ${kcal} kcal frente a las ~${fallbackPerMeal} kcal estimadas por comida. Cuida el tamaño de la porción.`,
      };
    } else {
      alignment = {
        verdict: 'off',
        title: 'Por encima de tu objetivo',
        detail: `Aporta ${kcal} kcal, bastante más que las ~${fallbackPerMeal} kcal estimadas por comida. Mejor resérvalo como excepción.`,
      };
    }
  } else {
    alignment = {
      verdict: 'unknown',
      title: diet ? 'Plan sin calorías objetivo' : 'Sin plan activo',
      detail: diet
        ? 'Tu plan aún no define calorías objetivo por comida, así que no puedo compararlo con exactitud.'
        : 'Aún no tienes un plan de alimentación activo para comparar este producto.',
    };
  }

  // Sugerencias por nutriente, moduladas por el objetivo del paciente
  if (nutrients.azucares_g != null && nutrients.azucares_g > 15) {
    suggestions.push(
      wantsWeightLoss(goal)
        ? `Tiene ${nutrients.azucares_g} g de azúcar: alto para tu meta de control de peso. Busca una versión sin azúcar añadida.`
        : `Tiene ${nutrients.azucares_g} g de azúcar. Consúmelo idealmente alrededor de tu actividad física.`,
    );
  }
  if (nutrients.sodio_mg != null && nutrients.sodio_mg > 500) {
    suggestions.push(`Aporta ${nutrients.sodio_mg} mg de sodio: acompáñalo con agua y evita agregar sal extra.`);
  }
  if (nutrients.grasas_saturadas_g != null && nutrients.grasas_saturadas_g > 6) {
    suggestions.push(`Grasas saturadas elevadas (${nutrients.grasas_saturadas_g} g): equilibra el resto del día con opciones magras.`);
  }
  if (nutrients.proteinas_g != null) {
    if (wantsMuscleGain(goal) && nutrients.proteinas_g >= 10) {
      suggestions.push(`Buen aporte de proteína (${nutrients.proteinas_g} g): útil para tu objetivo de masa muscular.`);
    } else if (wantsMuscleGain(goal) && nutrients.proteinas_g < 5) {
      suggestions.push(`Proteína baja (${nutrients.proteinas_g} g): combínalo con una fuente proteica para apoyar tu objetivo.`);
    }
  }
  if (nutrients.fibra_g != null && nutrients.fibra_g >= 5) {
    suggestions.push(`Aporta ${nutrients.fibra_g} g de fibra: favorece la saciedad y la digestión.`);
  }

  if (suggestions.length === 0) {
    suggestions.push('Los valores escaneados se ven razonables. Mantén porciones acordes a tu plan.');
  }

  return { alignment, suggestions, perMealCalorieTarget };
}

// ─── Alineación + sugerencias para PLATOS ──────────────────────────────────────

function buildPlateInsights(
  predictions: { clase: string; probabilidad: number }[],
  semaforo: string,
  diet: GqlDiet | null,
  profile: GqlMyProfile | null,
): { alignment: PlanAlignment; suggestions: string[]; matchingPlanItems: string[] } {
  const suggestions: string[] = [];
  const goal = goalKeywords(profile, diet);
  const top = predictions[0];
  const topName = top ? normalize(top.clase.replace(/_/g, ' ')) : '';

  const { itemNames } = planFoodTokens(diet);
  const matchingPlanItems = itemNames.filter((name) => {
    const n = normalize(name);
    return topName && (n.includes(topName) || topName.includes(n) ||
      topName.split(' ').some((w) => w.length > 3 && n.includes(w)));
  });

  let alignment: PlanAlignment;
  if (!diet) {
    alignment = {
      verdict: 'unknown',
      title: 'Sin plan activo',
      detail: 'No tienes un plan de alimentación activo para evaluar si este plato encaja.',
    };
  } else if (matchingPlanItems.length > 0) {
    alignment = {
      verdict: 'aligned',
      title: 'Coincide con tu plan',
      detail: `Este plato se parece a "${matchingPlanItems[0]}", que ya forma parte de tu plan «${diet.name}».`,
    };
  } else if (semaforo === 'RIESGO') {
    alignment = {
      verdict: 'off',
      title: 'Fuera de tu plan',
      detail: 'No aparece en tu plan y el análisis lo marca como de riesgo. Considera una alternativa de tu plan.',
    };
  } else {
    alignment = {
      verdict: 'caution',
      title: 'No está en tu plan',
      detail: `No encontré este plato dentro de «${diet.name}». Puede ser un extra ocasional; cuida la porción.`,
    };
  }

  // Sugerencias según objetivo
  if (wantsWeightLoss(goal)) {
    suggestions.push('Para tu meta de control de peso: prioriza vegetales y proteína magra, y modera las porciones de carbohidratos.');
  } else if (wantsMuscleGain(goal)) {
    suggestions.push('Para tu objetivo de masa muscular: asegúrate de incluir una buena fuente de proteína en este plato.');
  }
  if (top && top.probabilidad < 0.6) {
    suggestions.push('La identificación del plato no es del todo segura. Si puedes, toma otra foto más cerca y con buena luz.');
  }
  if (matchingPlanItems.length === 0 && diet) {
    const { mealNames } = planFoodTokens(diet);
    if (mealNames.length > 0) {
      suggestions.push(`Recuerda lo que sí incluye tu plan hoy: ${[...new Set(mealNames)].slice(0, 4).join(', ')}.`);
    }
  }
  if (suggestions.length === 0) {
    suggestions.push('Mantén el equilibrio entre proteína, carbohidratos y vegetales según tu plan.');
  }

  return { alignment, suggestions, matchingPlanItems };
}

// ─── API pública ───────────────────────────────────────────────────────────────

export function buildInsights(args: {
  result: FoodScanResult;
  mode: ScanMode;
  diet: GqlDiet | null;
  profile: GqlMyProfile | null;
}): NutritionInsights {
  const { result, mode, diet, profile } = args;

  if (mode === 'label') {
    const { alignment, suggestions, perMealCalorieTarget } = buildLabelInsights(
      result.nutrientes,
      diet,
      profile,
    );
    return { alignment, suggestions, perMealCalorieTarget, matchingPlanItems: [] };
  }

  const { alignment, suggestions, matchingPlanItems } = buildPlateInsights(
    result.predicciones_alimento,
    result.semaforo,
    diet,
    profile,
  );
  return { alignment, suggestions, perMealCalorieTarget: null, matchingPlanItems };
}

// ─── Información nutricional copiable ───────────────────────────────────────────

const NUTRIENT_FIELDS: { key: keyof NutrientInfo; label: string; unit: string }[] = [
  { key: 'calorias', label: 'Calorías', unit: 'kcal' },
  { key: 'proteinas_g', label: 'Proteínas', unit: 'g' },
  { key: 'carbohidratos_g', label: 'Carbohidratos', unit: 'g' },
  { key: 'azucares_g', label: 'Azúcares', unit: 'g' },
  { key: 'fibra_g', label: 'Fibra', unit: 'g' },
  { key: 'grasas_totales_g', label: 'Grasas totales', unit: 'g' },
  { key: 'grasas_saturadas_g', label: 'Grasas saturadas', unit: 'g' },
  { key: 'sodio_mg', label: 'Sodio', unit: 'mg' },
];

export interface NutrientRow {
  label: string;
  value: string;
}

/** Filas de la tabla nutricional, sólo con los campos efectivamente detectados. */
export function nutrientRows(nutrients: NutrientInfo): NutrientRow[] {
  const rows: NutrientRow[] = [];
  for (const f of NUTRIENT_FIELDS) {
    const value = nutrients[f.key];
    if (value != null) rows.push({ label: f.label, value: `${value} ${f.unit}` });
  }
  return rows;
}

/**
 * Versión en texto legible de la información nutricional, lista para copiar al
 * portapapeles y pegar en notas, chat, etc.
 */
export function buildNutrientText(nutrients: NutrientInfo): string {
  const lines: string[] = ['Información nutricional'];
  for (const row of nutrientRows(nutrients)) {
    lines.push(`${row.label}: ${row.value}`);
  }
  if (nutrients.ingredientes?.length) {
    lines.push('', `Ingredientes: ${nutrients.ingredientes.join(', ')}`);
  }
  return lines.join('\n');
}

/** Indica si hay algún dato nutricional para mostrar/copiar. */
export function hasExportableNutrients(nutrients: NutrientInfo): boolean {
  return nutrientRows(nutrients).length > 0 || (nutrients.ingredientes?.length ?? 0) > 0;
}
