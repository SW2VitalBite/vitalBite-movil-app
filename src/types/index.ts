export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: string;
  heightCm?: number;
  weightKg?: number;
  bmi?: number;
  allergies?: string[];
  avatarUrl?: string | null;
};

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

export type Appointment = {
  id: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  weightRecorded?: number;
};

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type FoodItem = {
  id: string;
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type NotificationCategory = 'appointment' | 'diet' | 'report' | 'message';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};
