import { gql } from '@apollo/client';

export const GET_MY_APPOINTMENTS = gql`
  query GetMyAppointments($patientId: ID!) {
    appointmentsByPatient(patientId: $patientId) {
      id
      scheduledAt
      durationMinutes
      status
      mode
      reason
      notes
      cancelReason
    }
  }
`;

export const GET_APPOINTMENT_BY_ID = gql`
  query GetAppointmentById($id: ID!) {
    appointmentById(id: $id) {
      id
      scheduledAt
      durationMinutes
      status
      mode
      reason
      notes
      cancelReason
    }
  }
`;

export const CREATE_APPOINTMENT = gql`
  mutation CreateAppointment($input: CreateAppointmentInput!) {
    createAppointment(input: $input) {
      id
      scheduledAt
      durationMinutes
      status
      mode
      reason
    }
  }
`;

export const CANCEL_APPOINTMENT = gql`
  mutation CancelAppointment($id: ID!, $input: CancelAppointmentInput!) {
    cancelAppointment(id: $id, input: $input) {
      id
      status
      cancelReason
    }
  }
`;

export interface GqlAppointment {
  id: string;
  scheduledAt: string;
  durationMinutes: number;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'NO_SHOW';
  mode: 'IN_PERSON' | 'VIRTUAL';
  reason?: string | null;
  notes?: string | null;
  cancelReason?: string | null;
}
