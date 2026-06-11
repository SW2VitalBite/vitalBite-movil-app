import { gql } from '@apollo/client';

// ─── GraphQL documents ────────────────────────────────────────────────────────
// El backend modela un plan de dieta como: DietPlan → days[] → meals[] → items[].
// No expone macros (proteína/carbos/grasa) ni `mealType`; sólo calorías por ítem
// y `targetCalories` por comida. El estado del plan vive en `status` (no `isActive`).

const DIET_STRUCTURE = gql`
  fragment DietStructure on DietPlan {
    id
    name
    objective
    status
    startDate
    endDate
    estimatedCalories
    mealsPerDay
    mainRestriction
    nutritionistFullName
    days {
      id
      dayLabel
      dayOrder
      meals {
        id
        name
        mealOrder
        targetCalories
        notes
        items {
          id
          name
          portion
          calories
          itemOrder
          notes
        }
      }
    }
  }
`;

export const GET_ACTIVE_DIET = gql`
  query GetActiveDiet($patientId: ID!) {
    activeDietByPatient(patientId: $patientId) {
      ...DietStructure
    }
  }
  ${DIET_STRUCTURE}
`;

export const GET_DIETS_BY_PATIENT = gql`
  query GetDietsByPatient($patientId: ID!) {
    dietsByPatient(patientId: $patientId) {
      id
      name
      objective
      status
      startDate
      endDate
      estimatedCalories
      createdAt
    }
  }
`;

export const GET_DIET_BY_ID = gql`
  query GetDietById($id: ID!) {
    dietById(id: $id) {
      ...DietStructure
    }
  }
  ${DIET_STRUCTURE}
`;

// ─── Tipos crudos del backend ──────────────────────────────────────────────────

export type DietPlanStatus = 'ACTIVE' | 'DRAFT' | 'NEEDS_ADJUSTMENT';

export interface GqlDietItem {
  id: string;
  name: string;
  portion?: string | null;
  calories?: number | null;
  itemOrder: number;
  notes?: string | null;
}

export interface GqlDietMeal {
  id: string;
  name: string;
  mealOrder: number;
  targetCalories?: number | null;
  notes?: string | null;
  items: GqlDietItem[];
}

export interface GqlDietDay {
  id: string;
  dayLabel: string;
  dayOrder: number;
  meals: GqlDietMeal[];
}

export interface GqlDiet {
  id: string;
  name: string;
  objective?: string | null;
  status: DietPlanStatus;
  startDate?: string | null;
  endDate?: string | null;
  estimatedCalories?: number | null;
  mealsPerDay?: number | null;
  mainRestriction?: string | null;
  nutritionistFullName?: string | null;
  createdAt?: string;
  days?: GqlDietDay[];
}

// ─── View models para las pantallas ────────────────────────────────────────────

export interface DietItemView {
  id: string;
  name: string;
  portion: string;
  calories: number;
  notes?: string | null;
}

export interface DietMealView {
  id: string;
  label: string;
  icon: string;
  items: DietItemView[];
  totalCalories: number;
}

/** Elige un icono según el nombre de la comida (Desayuno, Almuerzo, Cena, …). */
export function mealIcon(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('desayuno')) return 'sunny-outline';
  if (n.includes('almuerzo') || n.includes('comida')) return 'partly-sunny-outline';
  if (n.includes('cena')) return 'moon-outline';
  if (n.includes('merienda') || n.includes('snack') || n.includes('colación')) return 'nutrition-outline';
  return 'restaurant-outline';
}

/** Convierte una comida del backend en el modelo que consumen las tarjetas. */
export function toMealView(meal: GqlDietMeal): DietMealView {
  const items: DietItemView[] = [...(meal.items ?? [])]
    .sort((a, b) => a.itemOrder - b.itemOrder)
    .map((item) => ({
      id: item.id,
      name: item.name,
      portion: item.portion ?? '',
      calories: item.calories ?? 0,
      notes: item.notes,
    }));

  // Preferimos las calorías objetivo declaradas por el nutricionista; si no
  // existen, las estimamos sumando las de cada alimento.
  const summedCalories = items.reduce((s, f) => s + f.calories, 0);
  const totalCalories = meal.targetCalories ?? summedCalories;

  return {
    id: meal.id,
    label: meal.name,
    icon: mealIcon(meal.name),
    items,
    totalCalories,
  };
}
