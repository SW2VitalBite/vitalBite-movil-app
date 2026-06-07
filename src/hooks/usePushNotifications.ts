import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useMutation } from '@apollo/client/react';
import { useAuth } from '../contexts/AuthContext';
import { REGISTER_PUSH_TOKEN } from '../services/notifications.service';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

export function usePushNotifications() {
  const { patientId } = useAuth();
  const [registerToken] = useMutation(REGISTER_PUSH_TOKEN);
  const registered = useRef(false);

  useEffect(() => {
    if (!patientId || registered.current) return;

    (async () => {
      const { status: existing } = await Notifications.getPermissionsAsync();
      let finalStatus = existing;

      if (existing !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') return;

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#2196A0',
        });
      }

      try {
        const tokenData = await Notifications.getExpoPushTokenAsync();
        await registerToken({ variables: { token: tokenData.data } });
        registered.current = true;
      } catch {
        // Token registration is non-critical
      }
    })();
  }, [patientId]);
}
