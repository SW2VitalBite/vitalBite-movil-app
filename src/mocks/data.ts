import type { ImageSourcePropType } from 'react-native';
import { avatars } from '../constants/assets';

// ─── User / Profile ──────────────────────────────────────────────────────────

export const mockUser = {
  id: 'usr-001',
  firstName: 'María',
  lastName: 'González',
  email: 'maria.gonzalez@email.com',
  phone: '+591 71234567',
  birthDate: '1995-03-15',
  heightCm: 165,
  weightKg: 68,
  bmi: 24.9,
  allergies: ['Lactosa', 'Maní'],
  avatar: avatars.sarah as ImageSourcePropType,
};

// ─── Nutritionist ─────────────────────────────────────────────────────────────

export const mockNutritionist = {
  id: 'nut-001',
  name: 'Ana García',
  title: 'Nut. Licenciada',
  specialty: 'Nutrición Clínica y Deportiva',
  yearsExperience: 8,
  rating: 4.9,
  activePatients: 47,
  consultorio: 'Centro Nutricional VitalSalud',
  description:
    'Especialista en nutrición clínica y deportiva con 8 años de experiencia. Certificada en nutrición pediátrica y manejo de enfermedades crónicas.',
  phone: '+591 72345678',
  whatsapp: '+59172345678',
  avatar: avatars.emma as ImageSourcePropType,
  schedule: [
    { day: 'Lunes', hours: '8:00 - 18:00' },
    { day: 'Martes', hours: '8:00 - 18:00' },
    { day: 'Miércoles', hours: '8:00 - 13:00' },
    { day: 'Jueves', hours: '8:00 - 18:00' },
    { day: 'Viernes', hours: '8:00 - 16:00' },
  ],
};

// ─── Appointments ─────────────────────────────────────────────────────────────

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  weightRecorded?: number;
}

export const mockAppointments: Appointment[] = [
  {
    id: 'apt-001',
    date: '2026-06-10',
    time: '10:00 AM',
    status: 'confirmed',
    notes: 'Control de progreso mensual. Traer registro de alimentación.',
  },
  {
    id: 'apt-002',
    date: '2026-06-24',
    time: '11:30 AM',
    status: 'pending',
    notes: 'Ajuste de dieta para fase de definición.',
  },
  {
    id: 'apt-003',
    date: '2026-05-28',
    time: '10:00 AM',
    status: 'completed',
    weightRecorded: 68.5,
  },
  {
    id: 'apt-004',
    date: '2026-04-30',
    time: '10:00 AM',
    status: 'completed',
    weightRecorded: 70.2,
  },
  {
    id: 'apt-005',
    date: '2026-03-25',
    time: '09:00 AM',
    status: 'completed',
    weightRecorded: 72.1,
  },
];

export const upcomingAppointments = mockAppointments.filter(
  (a) => a.status === 'confirmed' || a.status === 'pending',
);

export const pastAppointments = mockAppointments.filter(
  (a) => a.status === 'completed' || a.status === 'cancelled',
);

// ─── Diet ─────────────────────────────────────────────────────────────────────

export interface FoodItem {
  id: string;
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealSection {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  label: string;
  icon: string;
  items: FoodItem[];
  totalCalories: number;
}

export const mockDiet = {
  id: 'diet-001',
  name: 'Plan Balance — Fase 1',
  assignedDate: '2026-05-28',
  nutritionist: 'Nut. Ana García',
  objective: 'Pérdida de grasa con preservación muscular',
  meals: [
    {
      id: 'meal-breakfast',
      type: 'breakfast' as const,
      label: 'Desayuno',
      icon: 'sunny-outline',
      totalCalories: 420,
      items: [
        { id: 'f001', name: 'Avena instantánea', portion: '80g', calories: 290, protein: 10, carbs: 52, fat: 5 },
        { id: 'f002', name: 'Banana mediana', portion: '1 unidad (120g)', calories: 90, protein: 1, carbs: 23, fat: 0 },
        { id: 'f003', name: 'Leche descremada', portion: '200ml', calories: 70, protein: 7, carbs: 10, fat: 0 },
      ],
    },
    {
      id: 'meal-lunch',
      type: 'lunch' as const,
      label: 'Almuerzo',
      icon: 'partly-sunny-outline',
      totalCalories: 580,
      items: [
        { id: 'f004', name: 'Pechuga de pollo a la plancha', portion: '150g', calories: 248, protein: 47, carbs: 0, fat: 5 },
        { id: 'f005', name: 'Arroz integral cocido', portion: '200g', calories: 218, protein: 5, carbs: 46, fat: 2 },
        { id: 'f006', name: 'Ensalada verde mixta', portion: '150g', calories: 30, protein: 2, carbs: 5, fat: 0 },
        { id: 'f007', name: 'Aceite de oliva', portion: '1 cdta (5g)', calories: 44, protein: 0, carbs: 0, fat: 5 },
      ],
    },
    {
      id: 'meal-dinner',
      type: 'dinner' as const,
      label: 'Cena',
      icon: 'moon-outline',
      totalCalories: 380,
      items: [
        { id: 'f008', name: 'Salmón al horno', portion: '120g', calories: 218, protein: 24, carbs: 0, fat: 13 },
        { id: 'f009', name: 'Brócoli al vapor', portion: '200g', calories: 68, protein: 6, carbs: 11, fat: 1 },
        { id: 'f010', name: 'Puré de camote', portion: '100g', calories: 94, protein: 2, carbs: 22, fat: 0 },
      ],
    },
    {
      id: 'meal-snack',
      type: 'snack' as const,
      label: 'Meriendas',
      icon: 'nutrition-outline',
      totalCalories: 220,
      items: [
        { id: 'f011', name: 'Almendras naturales', portion: '30g', calories: 173, protein: 6, carbs: 6, fat: 15 },
        { id: 'f012', name: 'Manzana verde', portion: '1 unidad (150g)', calories: 78, protein: 0, carbs: 21, fat: 0 },
      ],
    },
  ] as MealSection[],
};

// ─── Progress / Measurements ──────────────────────────────────────────────────

export interface BodyMeasurement {
  id: string;
  date: string;
  weight: number;
  bmi: number;
  bodyFatPct: number;
  muscleMassKg: number;
  waterPct: number;
  boneMassKg: number;
  waistCm: number;
  hipCm: number;
  armCm: number;
  legCm: number;
}

export const mockMeasurements: BodyMeasurement[] = [
  { id: 'm006', date: '2026-05-28', weight: 68.0, bmi: 24.9, bodyFatPct: 22.5, muscleMassKg: 28.3, waterPct: 55.2, boneMassKg: 2.8, waistCm: 76, hipCm: 95, armCm: 30, legCm: 56 },
  { id: 'm005', date: '2026-04-30', weight: 68.5, bmi: 25.2, bodyFatPct: 23.1, muscleMassKg: 27.9, waterPct: 54.8, boneMassKg: 2.8, waistCm: 77, hipCm: 96, armCm: 30, legCm: 56 },
  { id: 'm004', date: '2026-03-25', weight: 70.2, bmi: 25.8, bodyFatPct: 24.0, muscleMassKg: 27.5, waterPct: 54.0, boneMassKg: 2.8, waistCm: 79, hipCm: 97, armCm: 31, legCm: 57 },
  { id: 'm003', date: '2026-02-20', weight: 71.5, bmi: 26.3, bodyFatPct: 24.8, muscleMassKg: 27.2, waterPct: 53.5, boneMassKg: 2.7, waistCm: 81, hipCm: 98, armCm: 32, legCm: 57 },
  { id: 'm002', date: '2026-01-15', weight: 72.8, bmi: 26.8, bodyFatPct: 25.5, muscleMassKg: 26.8, waterPct: 53.0, boneMassKg: 2.7, waistCm: 83, hipCm: 99, armCm: 32, legCm: 58 },
  { id: 'm001', date: '2025-12-10', weight: 74.0, bmi: 27.2, bodyFatPct: 26.2, muscleMassKg: 26.5, waterPct: 52.5, boneMassKg: 2.7, waistCm: 85, hipCm: 100, armCm: 33, legCm: 58 },
];

export const latestMeasurement = mockMeasurements[0];
export const goalWeightKg = 62;

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationCategory = 'appointment' | 'diet' | 'report' | 'message';

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  icon: string;
  title: string;
  description: string;
  time: string;
  dateGroup: string;
  read: boolean;
}

export const mockNotifications: NotificationItem[] = [
  {
    id: 'n001',
    category: 'appointment',
    icon: 'calendar-outline',
    title: 'Cita programada',
    description: 'Tu cita con Nut. Ana García está confirmada para el 10 Jun a las 10:00 AM',
    time: 'Hace 5 min',
    dateGroup: 'Hoy',
    read: false,
  },
  {
    id: 'n002',
    category: 'diet',
    icon: 'nutrition-outline',
    title: 'Nueva dieta asignada',
    description: 'Nut. Ana García ha actualizado tu plan de alimentación: Plan Balance — Fase 1',
    time: 'Hace 2h',
    dateGroup: 'Hoy',
    read: false,
  },
  {
    id: 'n003',
    category: 'report',
    icon: 'document-text-outline',
    title: 'Nuevo reporte disponible',
    description: 'Tu reporte de seguimiento de Mayo 2026 está disponible para descargar',
    time: 'Hace 4h',
    dateGroup: 'Hoy',
    read: true,
  },
  {
    id: 'n004',
    category: 'appointment',
    icon: 'calendar-outline',
    title: 'Cambio de cita',
    description: 'Tu cita del 25 May fue reprogramada al 28 May a las 10:00 AM',
    time: 'Ayer 3:45 PM',
    dateGroup: 'Ayer',
    read: true,
  },
  {
    id: 'n005',
    category: 'message',
    icon: 'chatbubble-outline',
    title: 'Mensaje de tu nutricionista',
    description: 'Nut. Ana García: "Recuerda registrar tu alimentación antes de la próxima cita"',
    time: 'Ayer 10:20 AM',
    dateGroup: 'Ayer',
    read: true,
  },
  {
    id: 'n006',
    category: 'report',
    icon: 'document-text-outline',
    title: 'Nuevo reporte disponible',
    description: 'Tu reporte de seguimiento de Abril 2026 está disponible',
    time: '30 Abr 9:00 AM',
    dateGroup: '30 Abr',
    read: true,
  },
];

// ─── Scanner ──────────────────────────────────────────────────────────────────

export interface ScannedProduct {
  id: string;
  name: string;
  brand: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  portionSize: string;
  ingredients: string[];
  allergens: string[];
  scannedAt: string;
}

export const mockScanHistory: ScannedProduct[] = [
  {
    id: 'sc001',
    name: 'Yogur Natural',
    brand: 'Yoplait',
    calories: 127,
    protein: 5,
    carbs: 15,
    fat: 3,
    fiber: 0,
    sugar: 13,
    sodium: 80,
    portionSize: '100g',
    ingredients: ['Leche descremada', 'Cultivos lácticos vivos', 'Almidón modificado'],
    allergens: ['Lactosa'],
    scannedAt: '2026-06-02',
  },
  {
    id: 'sc002',
    name: 'Granola Sin Azúcar',
    brand: 'NaturFit',
    calories: 380,
    protein: 9,
    carbs: 62,
    fat: 12,
    fiber: 8,
    sugar: 4,
    sodium: 45,
    portionSize: '100g',
    ingredients: ['Avena integral', 'Semillas de girasol', 'Miel', 'Aceite de coco'],
    allergens: ['Gluten', 'Nueces'],
    scannedAt: '2026-06-01',
  },
];

export const mockScanResult: ScannedProduct = {
  id: 'sc-live',
  name: 'Yogur Natural',
  brand: 'Yoplait',
  calories: 127,
  protein: 5,
  carbs: 15,
  fat: 3,
  fiber: 0,
  sugar: 13,
  sodium: 80,
  portionSize: '100g',
  ingredients: ['Leche descremada', 'Cultivos lácticos vivos', 'Almidón modificado de maíz', 'Pectina'],
  allergens: ['Contiene lactosa'],
  scannedAt: '2026-06-03',
};

// ─── Payment Plans ────────────────────────────────────────────────────────────

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  features: string[];
  highlighted: boolean;
}

export const mockPaymentPlans: PaymentPlan[] = [
  {
    id: 'plan-basic',
    name: 'Básico',
    price: 29,
    currency: 'USD',
    period: '/mes',
    features: ['Hasta 15 pacientes', '5 GB almacenamiento', 'Reportes básicos', 'Soporte email'],
    highlighted: false,
  },
  {
    id: 'plan-pro',
    name: 'Profesional',
    price: 59,
    currency: 'USD',
    period: '/mes',
    features: ['Hasta 50 pacientes', '20 GB almacenamiento', 'Reportes avanzados', 'Bot WhatsApp', 'Soporte prioritario'],
    highlighted: true,
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    price: 120,
    currency: 'USD',
    period: '/mes',
    features: ['Pacientes ilimitados', '100 GB almacenamiento', 'IA y ML integrado', 'Multi-consultorio', 'Soporte 24/7'],
    highlighted: false,
  },
];
