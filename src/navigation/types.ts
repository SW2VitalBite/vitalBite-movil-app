import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

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
  BiometricAuth: undefined;
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
  DietMealDetail: { mealId: string; mealLabel: string };
  ScannerHome: undefined;
  ScannerCamera: undefined;
  ScannerResult: undefined;
  Progress: undefined;
  MeasurementsHistory: undefined;
  ProgressChart: { metric: string; metricLabel: string };
  Notifications: undefined;
  NutritionistProfile: undefined;
  NutritionistSchedule: undefined;
  AppointmentDetail: { appointmentId: string };
  AppointmentHistory: undefined;
  EditProfile: undefined;
  Settings: undefined;
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
