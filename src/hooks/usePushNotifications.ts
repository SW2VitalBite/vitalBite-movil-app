import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
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

// Expo Go (storeClient) dejó de soportar push REMOTAS en SDK 53+. Allí
// `getExpoPushTokenAsync` falla; hay que usar un development build.
const isExpoGo = Constants.executionEnvironment === 'storeClient';

/** projectId de EAS (necesario para el token de push en development build). */
function getProjectId(): string | undefined {
  return (
    (Constants.expoConfig?.extra as any)?.eas?.projectId ??
    (Constants as any).easConfig?.projectId
  );
}

export function usePushNotifications() {
  const { patientId } = useAuth();
  const [registerToken] = useMutation(REGISTER_PUSH_TOKEN);
  const registered = useRef(false);

  useEffect(() => {
    if (!patientId || registered.current) return;

    (async () => {
      // Canal de Android (también lo usan las notificaciones locales)
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#2196A0',
        });
      }

      const { status: existing } = await Notifications.getPermissionsAsync();
      let finalStatus = existing;
      if (existing !== 'granted') {
        finalStatus = (await Notifications.requestPermissionsAsync()).status;
      }
      if (finalStatus !== 'granted') return;

      // Las push remotas requieren un development build (no Expo Go).
      if (isExpoGo) {
        console.log(
          '[push] Expo Go ya no soporta notificaciones push remotas (SDK 53+). ' +
            'Genera un development build para habilitarlas.',
        );
        return;
      }

      const projectId = getProjectId();
      if (!projectId) {
        console.warn(
          '[push] Falta el projectId de EAS. Ejecuta "eas init" (o agrega ' +
            'extra.eas.projectId en app.json) para registrar el token de push.',
        );
        return;
      }

      try {
        const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
        // Útil para probar el envío directo desde https://expo.dev/notifications
        console.log('[push] Expo push token:', tokenData.data);
        await registerToken({ variables: { token: tokenData.data } });
        registered.current = true;
      } catch (e) {
        // No es crítico para el resto de la app: solo se pierde el push remoto.
        console.warn('[push] No se pudo obtener/registrar el token de push:', e);
      }
    })();
  }, [patientId]);
}
