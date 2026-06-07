import React from 'react';
import { View, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { MainStackParamList, MainTabParamList } from './types';

// Tab screens
import HomeScreen from '../screens/home/HomeScreen';
import AppointmentsScreen from '../screens/appointments/AppointmentsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Stack-only screens
import AppointmentDetailScreen from '../screens/appointments/AppointmentDetailScreen';
import AppointmentHistoryScreen from '../screens/appointments/AppointmentHistoryScreen';
import DietScreen from '../screens/diet/DietScreen';
import DietMealDetailScreen from '../screens/diet/DietMealDetailScreen';
import ScannerHomeScreen from '../screens/scanner/ScannerHomeScreen';
import ScannerCameraScreen from '../screens/scanner/ScannerCameraScreen';
import ScannerResultScreen from '../screens/scanner/ScannerResultScreen';
import ProgressScreen from '../screens/progress/ProgressScreen';
import MeasurementsHistoryScreen from '../screens/progress/MeasurementsHistoryScreen';
import ProgressChartScreen from '../screens/progress/ProgressChartScreen';
import NotificationScreen from '../screens/notifications/NotificationScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import NutritionistProfileScreen from '../screens/nutritionist/NutritionistProfileScreen';
import NutritionistScheduleScreen from '../screens/nutritionist/NutritionistScheduleScreen';
import PaymentPlansScreen from '../screens/payment/PaymentPlansScreen';
import PaymentFormScreen from '../screens/payment/PaymentFormScreen';
import PaymentConfirmScreen from '../screens/payment/PaymentConfirmScreen';

import { colors, fonts, gradientColors, bottomTabHeight } from '../constants/theme';
import { usePushNotifications } from '../hooks/usePushNotifications';

// ─── Bottom Tab Navigator ─────────────────────────────────────────────────────

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.gradientEnd,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          height: bottomTabHeight + (Platform.OS === 'ios' ? 10 : 0),
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: Platform.OS === 'ios' ? 12 : 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.medium,
          fontSize: 11,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'AppointmentsTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else {
            iconName = focused ? 'person' : 'person-outline';
          }

          if (focused) {
            return (
              <View style={tabIconFocusedContainer}>
                <LinearGradient
                  colors={gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={tabIconGradient}
                >
                  <Ionicons name={iconName} size={size - 2} color={colors.white} />
                </LinearGradient>
              </View>
            );
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: 'Inicio' }} />
      <Tab.Screen name="AppointmentsTab" component={AppointmentsScreen} options={{ tabBarLabel: 'Citas' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ tabBarLabel: 'Perfil' }} />
    </Tab.Navigator>
  );
}

const tabIconFocusedContainer = {
  marginBottom: 2,
};

const tabIconGradient = {
  width: 36,
  height: 36,
  borderRadius: 18,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

// ─── Main Stack Navigator ──────────────────────────────────────────────────────

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  usePushNotifications();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Diet" component={DietScreen} />
      <Stack.Screen name="DietMealDetail" component={DietMealDetailScreen} />
      <Stack.Screen name="ScannerHome" component={ScannerHomeScreen} />
      <Stack.Screen name="ScannerCamera" component={ScannerCameraScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="ScannerResult" component={ScannerResultScreen} />
      <Stack.Screen name="Progress" component={ProgressScreen} />
      <Stack.Screen name="MeasurementsHistory" component={MeasurementsHistoryScreen} />
      <Stack.Screen name="ProgressChart" component={ProgressChartScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} />
      <Stack.Screen name="AppointmentHistory" component={AppointmentHistoryScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="NutritionistProfile" component={NutritionistProfileScreen} />
      <Stack.Screen name="NutritionistSchedule" component={NutritionistScheduleScreen} />
      <Stack.Screen name="PaymentPlans" component={PaymentPlansScreen} />
      <Stack.Screen name="PaymentForm" component={PaymentFormScreen} />
      <Stack.Screen name="PaymentConfirm" component={PaymentConfirmScreen} />
    </Stack.Navigator>
  );
}
