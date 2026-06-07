import { gql } from '@apollo/client';

export const GET_MY_NOTIFICATIONS = gql`
  query GetMyNotifications($patientId: ID!) {
    myNotifications(patientId: $patientId) {
      id
      type
      title
      body
      isRead
      createdAt
    }
  }
`;

export const GET_UNREAD_COUNT = gql`
  query GetUnreadCount($patientId: ID!) {
    unreadNotificationsCount(patientId: $patientId)
  }
`;

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id)
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead($patientId: ID!) {
    markAllNotificationsRead(patientId: $patientId)
  }
`;

export const REGISTER_PUSH_TOKEN = gql`
  mutation RegisterPushToken($token: String!) {
    registerPushToken(token: $token)
  }
`;

export type NotificationType =
  | 'CITA_CREADA'
  | 'CITA_CANCELADA'
  | 'CITA_CONFIRMADA'
  | 'CITA_REPROGRAMADA'
  | 'DIETA_ASIGNADA'
  | 'MENSAJE'
  | 'REPORTE';

export interface GqlNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}
