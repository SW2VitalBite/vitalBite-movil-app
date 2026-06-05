import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar, Platform, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  LeagueSpartan_300Light,
  LeagueSpartan_400Regular,
  LeagueSpartan_500Medium,
  LeagueSpartan_600SemiBold,
  LeagueSpartan_700Bold,
} from '@expo-google-fonts/league-spartan';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/constants/theme';

SplashScreen.preventAutoHideAsync();

// Timeout to prevent infinite blank screen if fonts fail
const FONT_TIMEOUT_MS = 4000;

export default function App() {
  const [ready, setReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    LeagueSpartan_300Light,
    LeagueSpartan_400Regular,
    LeagueSpartan_500Medium,
    LeagueSpartan_600SemiBold,
    LeagueSpartan_700Bold,
  });

  useEffect(() => {
    // Proceed when fonts load OR when an error occurs OR after timeout
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().finally(() => setReady(true));
      return;
    }

    const timeout = setTimeout(() => {
      SplashScreen.hideAsync().finally(() => setReady(true));
    }, FONT_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, [fontsLoaded, fontError]);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.gradientEnd, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar
            barStyle="light-content"
            backgroundColor={colors.gradientEnd}
            translucent={Platform.OS === 'android'}
          />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
