# Push Notifications — VitalBite

## Arquitectura general

Las notificaciones push se envían desde el backend NestJS a los dispositivos de los pacientes usando la **API pública de Expo Push** (`https://exp.host/--/api/v2/push/send`). No requiere ningún SDK adicional en el backend; se usa `fetch` nativo.

```
NestJS Backend
  └─ NotificationsService.createAndPush(payload)
       ├─ Crea registro en tabla `notifications` (PostgreSQL)
       └─ Llama https://exp.host/--/api/v2/push/send  →  Expo Push Gateway  →  APNs / FCM  →  Dispositivo
```

---

## Tipos de notificación soportados

| Tipo | Cuándo se dispara | Pantalla fuente |
|------|--------------------|-----------------|
| `CITA_CREADA` | Al crear una nueva cita | `AppointmentsScreen` (nutricionista) |
| `CITA_CONFIRMADA` | Al confirmar una cita | `AppointmentsScreen` (nutricionista) |
| `CITA_REPROGRAMADA` | Al reprogramar una cita | `AppointmentsScreen` (nutricionista) |
| `CITA_CANCELADA` | Al cancelar una cita | `AppointmentsScreen` (nutricionista) |
| `DIETA_ASIGNADA` | Al crear un nuevo plan de dieta | Backend (via `DietsService.create`) |

---

## Flujo técnico

### 1. Registro del token en la app (Expo SDK)

Al iniciar sesión, el hook `usePushNotifications` (en `src/hooks/usePushNotifications.ts`) se ejecuta automáticamente desde `MainNavigator`:

```typescript
// Se ejecuta una vez tras autenticarse
const tokenData = await Notifications.getExpoPushTokenAsync();
// Envía el token al backend via GraphQL
await registerToken({ variables: { token: tokenData.data } });
```

El token tiene el formato: `ExponentPushToken[xxxx-xxxx-xxxx]`

El backend lo almacena en `Patient.expoPushToken` en la base de datos.

### 2. Envío desde el backend

Cuando ocurre un evento relevante, el servicio correspondiente llama:

```typescript
void this.notificationsService.createAndPush({
  tenantId: '...',
  patientId: '...',
  type: NotificationType.CITA_CREADA,
  title: 'Cita programada',
  body: 'Tu cita del lunes 10 de junio a las 10:00 está confirmada.',
  data: { appointmentId: '...' },
});
```

El método es **fire-and-forget** (`void`) — el error en el push no aborta la transacción principal.

`NotificationsService.createAndPush` hace:
1. `prisma.notification.create(...)` — persiste en BD
2. `prisma.patient.findUnique({ id: patientId })` — busca el `expoPushToken`
3. Si hay token: `fetch('https://exp.host/--/api/v2/push/send', { body: JSON.stringify([{ to, title, body, data }]) })`

### 3. Recepción en la app

El hook también registra un listener para notificaciones recibidas mientras la app está en primer plano:

```typescript
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
```

---

## Configuración requerida

### `app.json`
```json
"plugins": [
  "expo-local-authentication",
  [
    "expo-notifications",
    {
      "icon": "./assets/notification-icon.png",
      "color": "#2196A0",
      "defaultChannel": "default"
    }
  ]
]
```

> **Nota**: Para Android se requiere hacer `npx expo prebuild` o usar una **development build** (Expo Go no soporta push notifications de producción). Para iOS se requiere cuenta de desarrollador Apple.

### Permisos en runtime
El sistema pide permisos automáticamente la primera vez que el usuario entra a la app (desde `usePushNotifications`). En iOS se muestra un diálogo del sistema. En Android 13+ también.

---

## Limitaciones del entorno Expo Go

- **Expo Go en producción**: Solo funciona con `ExpoPushToken` en modo desarrollo a través de los servidores de Expo.
- **Para producción real**: Necesitas `eas build` + configurar FCM (Android) y APNs (iOS).
- **Token de proyecto**: Si tienes un `projectId` en EAS, pasa `{ projectId: 'xxx' }` a `getExpoPushTokenAsync()`.

---

## Verificación manual

Puedes probar el endpoint del backend directamente:

```bash
curl -X POST https://exp.host/--/api/v2/push/send \
  -H "Content-Type: application/json" \
  -d '[{
    "to": "ExponentPushToken[YOUR_TOKEN]",
    "title": "Prueba",
    "body": "Notificación de prueba desde VitalBite"
  }]'
```

---

## Esquema de base de datos

La tabla `notifications` almacena todas las notificaciones enviadas:

```
id          UUID
tenantId    FK → tenants
patientId   FK → patients
type        Enum (CITA_CREADA, CITA_CANCELADA, ...)
title       String
body        String
data        JSON (metadata: appointmentId, dietId, etc.)
isRead      Boolean (default false)
createdAt   DateTime
```

---

## Pantalla de notificaciones en la app

`src/screens/notifications/NotificationScreen.tsx` consume el endpoint GraphQL `myNotifications(patientId)` y permite:
- Filtrar por período (Hoy / Ayer / Semana / Todas)
- Marcar una notificación como leída al tocarla
- Marcar todas como leídas con el botón "Marcar todo leído"
