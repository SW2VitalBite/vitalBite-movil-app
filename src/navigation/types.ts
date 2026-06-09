import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { InfoPageKey } from '../constants/legalContent';

// ─── Root ─────────────────────────────────────────────────────────────────────
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

// ─── Auth Stack ───────────────────────────────────────────────────────────────
export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  AuthChoice: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  BiometricAuth: { force?: boolean } | undefined;
};

// ─── Main Bottom Tabs ─────────────────────────────────────────────────────────
export type MainTabParamList = {
  HomeTab: undefined;
  AppointmentsTab: undefined;
  ProfileTab: undefined;
};

// ─── Main Stack (includes tabs + modal-like screens) ─────────────────────────
export type MainStackParamList = {
  MainTabs: undefined;
  Diet: undefined;
  DietMealDetail: {
    mealLabel: string;
    totalCalories: number;
    items: { id: string; name: string; portion: string; calories: number; notes?: string | null }[];
  };
  ScannerHome: undefined;
  ScannerCamera: { mode: 'label' | 'plate' };
  ScannerResult: { imageUri: string; mode: 'label' | 'plate' };
  Progress: undefined;
  MeasurementsHistory: undefined;
  ProgressChart: { metric: string };
  Notifications: undefined;
  NutritionistProfile: undefined;
  NutritionistSchedule: undefined;
  AppointmentDetail: { appointmentId: string };
  AppointmentHistory: undefined;
  BookAppointment: undefined;
  EditProfile: undefined;
  MyDocuments: undefined;
  Settings: undefined;
  InfoPage: { page: InfoPageKey };
  PaymentPlans: undefined;
  PaymentForm: { planId: string };
  PaymentConfirm: undefined;
};

// ─── Prop types for screens ───────────────────────────────────────────────────
export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type MainStackScreenProps<T extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  NativeStackScreenProps<MainStackParamList>
>;
