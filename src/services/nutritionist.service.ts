import { gql } from '@apollo/client';

export const GET_MY_NUTRITIONIST = gql`
  query GetMyNutritionist {
    myNutritionist {
      id
      firstName
      lastName
      email
      roleCode
    }
  }
`;

export const GET_MY_PROFILE = gql`
  query GetMyProfile {
    myProfile {
      id
      firstName
      lastName
      email
      phone
      birthDate
      gender
      nutritionGoal
      heightCm
      status
    }
  }
`;

export const UPDATE_MY_PROFILE = gql`
  mutation UpdateMyProfile($input: UpdatePatientInput!) {
    updateMyProfile(input: $input) {
      id
      firstName
      lastName
      phone
      birthDate
      gender
      nutritionGoal
      heightCm
    }
  }
`;

export interface GqlNutritionist {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleCode: string;
}

export interface GqlMyProfile {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  birthDate?: string | null;
  gender?: string | null;
  nutritionGoal?: string | null;
  heightCm?: number | null;
  status: string;
}
