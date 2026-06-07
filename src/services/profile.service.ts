import { gql } from '@apollo/client';

export const GET_MY_PATIENT_PROFILE = gql`
  query GetPatientProfile($id: ID!) {
    patientById(id: $id) {
      id
      firstName
      lastName
      email
      phone
      birthDate
      gender
      nutritionGoal
      clinicalNotes
      status
    }
  }
`;

export const UPDATE_PATIENT = gql`
  mutation UpdatePatient($id: ID!, $input: UpdatePatientInput!) {
    updatePatient(id: $id, input: $input) {
      id
      firstName
      lastName
      phone
      birthDate
    }
  }
`;

export interface GqlPatient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  birthDate?: string | null;
  gender?: string | null;
  nutritionGoal?: string | null;
  clinicalNotes?: string | null;
  status: string;
}
