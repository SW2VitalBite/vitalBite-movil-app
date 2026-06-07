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
