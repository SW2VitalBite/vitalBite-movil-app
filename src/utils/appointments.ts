import type { AppointmentStatus } from '../mocks/data';

export function mapBackendStatus(status: string): AppointmentStatus {
  const map: Record<string, AppointmentStatus> = {
    SCHEDULED: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    RESCHEDULED: 'pending',
    NO_SHOW: 'cancelled',
  };
  return map[status] ?? 'pending';
}

export function formatAppointmentDate(iso: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

export function formatAppointmentTime(iso: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

export function formatAppointmentDateLong(iso: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));
}
