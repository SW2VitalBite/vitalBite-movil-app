import { gql } from '@apollo/client';

export const GET_ACTIVE_DIET = gql`
  query GetActiveDiet($patientId: ID!) {
    myActiveDiet(patientId: $patientId) {
      id
      name
      objective
      startDate
      endDate
      isActive
      meals {
        id
        mealType
        name
        items {
          id
          name
          quantity
          unit
          calories
          protein
          carbs
          fat
        }
      }
    }
  }
`;

export const GET_DIETS_BY_PATIENT = gql`
  query GetDietsByPatient($patientId: ID!) {
    dietsByPatient(patientId: $patientId) {
      id
      name
      objective
      startDate
      endDate
      isActive
      createdAt
    }
  }
`;

export const GET_DIET_BY_ID = gql`
  query GetDietById($id: ID!) {
    dietById(id: $id) {
      id
      name
      objective
      startDate
      endDate
      isActive
      meals {
        id
        mealType
        name
        items {
          id
          name
          quantity
          unit
          calories
          protein
          carbs
          fat
        }
      }
    }
  }
`;

export interface GqlDietItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
}

export interface GqlDietMeal {
  id: string;
  mealType: 'DESAYUNO' | 'ALMUERZO' | 'CENA' | 'MERIENDA';
  name?: string | null;
  items: GqlDietItem[];
}

export interface GqlDiet {
  id: string;
  name: string;
  objective?: string | null;
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
  createdAt?: string;
  meals?: GqlDietMeal[];
}
