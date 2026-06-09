import { gql } from '@apollo/client';

export const GET_BODY_MEASUREMENTS = gql`
  query GetBodyMeasurements($patientId: ID!) {
    bodyMeasurementsByPatient(patientId: $patientId) {
      id
      measuredAt
      weightKg
      heightCm
      bmi
      waistCm
      hipCm
    }
  }
`;

export const GET_LATEST_BODY_COMPOSITION = gql`
  query GetLatestBodyComposition($patientId: ID!) {
    latestBodyComposition(patientId: $patientId) {
      id
      measuredAt
      bodyFatPercentage
      muscleMassKg
      waterPercentage
      visceralFatLevel
      boneMassKg
      metabolicAge
    }
  }
`;

export const GET_BODY_COMPOSITION_HISTORY = gql`
  query GetBodyCompositionHistory($patientId: ID!) {
    bodyCompositionByPatient(patientId: $patientId) {
      id
      measuredAt
      bodyFatPercentage
      muscleMassKg
      waterPercentage
      boneMassKg
    }
  }
`;

// Perímetros antropométricos detallados (tabla anthropometry_measurements).
export const GET_ANTHROPOMETRY_HISTORY = gql`
  query GetAnthropometryHistory($patientId: ID!) {
    anthropometryByPatient(patientId: $patientId) {
      id
      bodyMeasurementId
      measuredAt
      neckCm
      chestThoraxCm
      rightArmCm
      leftArmCm
      rightForearmCm
      leftForearmCm
      waistCm
      abdomenCm
      hipCm
      rightThighCm
      leftThighCm
      rightCalfCm
      leftCalfCm
    }
  }
`;

export interface GqlBodyMeasurement {
  id: string;
  measuredAt: string;
  weightKg: number;
  heightCm?: number | null;
  bmi?: number | null;
  waistCm?: number | null;
  hipCm?: number | null;
}

export interface GqlBodyComposition {
  id: string;
  measuredAt: string;
  bodyFatPercentage?: number | null;
  muscleMassKg?: number | null;
  waterPercentage?: number | null;
  visceralFatLevel?: number | null;
  boneMassKg?: number | null;
  metabolicAge?: number | null;
}

export interface GqlAnthropometry {
  id: string;
  bodyMeasurementId?: string | null;
  measuredAt: string;
  neckCm?: number | null;
  chestThoraxCm?: number | null;
  rightArmCm?: number | null;
  leftArmCm?: number | null;
  rightForearmCm?: number | null;
  leftForearmCm?: number | null;
  waistCm?: number | null;
  abdomenCm?: number | null;
  hipCm?: number | null;
  rightThighCm?: number | null;
  leftThighCm?: number | null;
  rightCalfCm?: number | null;
  leftCalfCm?: number | null;
}

/** Perímetros antropométricos en orden de presentación (etiqueta + campo). */
export const ANTHROPOMETRY_FIELDS: { key: keyof GqlAnthropometry; label: string }[] = [
  { key: 'neckCm', label: 'Cuello' },
  { key: 'chestThoraxCm', label: 'Pecho / tórax' },
  { key: 'rightArmCm', label: 'Brazo der.' },
  { key: 'leftArmCm', label: 'Brazo izq.' },
  { key: 'rightForearmCm', label: 'Antebrazo der.' },
  { key: 'leftForearmCm', label: 'Antebrazo izq.' },
  { key: 'waistCm', label: 'Cintura' },
  { key: 'abdomenCm', label: 'Abdomen' },
  { key: 'hipCm', label: 'Cadera' },
  { key: 'rightThighCm', label: 'Muslo der.' },
  { key: 'leftThighCm', label: 'Muslo izq.' },
  { key: 'rightCalfCm', label: 'Pantorrilla der.' },
  { key: 'leftCalfCm', label: 'Pantorrilla izq.' },
];
