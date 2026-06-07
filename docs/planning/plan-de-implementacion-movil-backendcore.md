# Plan de Implementación — VitalBite Móvil ↔ Backend Core

> Fecha: 2026-06-05  
> Alcance: solo `vitalBite-movil-app` ↔ `vitalBite-backend-core`. Excluye el módulo de IA.

---

## Estado actual

### Funcionalidades completamente operativas

| Funcionalidad | Pantallas móvil | Resolvers backend |
|---|---|---|
| Login | `LoginScreen` | `login` mutation |
| Ver citas / detalle / cancelar | `AppointmentsScreen`, `AppointmentDetailScreen` | `appointments`, `appointmentById`, `cancelAppointment` |
| Progreso corporal (peso, IMC) | `ProgressScreen`, `MeasurementsHistoryScreen` | `bodyMeasurementsByPatient`, `latestBodyComposition`, `bodyCompositionByPatient` |
| Consultar planes de suscripción | `PaymentPlansScreen` | `subscriptionPlans` |

---

### Funcionalidades NO operativas

| # | Funcionalidad | Móvil | Backend | Estado |
|---|---|---|---|---|
| 1 | **Dietas** | Skeleton + mock data | Módulo vacío | Inexistente en ambos |
| 2 | **Registro de paciente (SignUp)** | UI lista, handler vacío | `register` mutation existe | Sin integrar |
| 3 | **Edición de perfil del paciente** | Sin llamada real | `UPDATE_PATIENT` existe | Sin integrar (solo móvil) |
| 4 | **Perfil del nutricionista asignado** | Mock data | Sin resolver dedicado | Sin implementar |
| 5 | **Notificaciones** | Mock data | Sin backend | Inexistente en ambos |
| 6 | **Autenticación biométrica** | UI animada, sin lógica | Sin cambios requeridos | Solo móvil |
| 7 | **Recuperación de contraseña** | UI simulada | Sin endpoint | Sin implementar |
| 8 | **Historial de citas (datos reales)** | Mock data | `GET_MY_APPOINTMENTS` existe | Sin integrar (solo móvil) |
| 9 | **Gráfica de progreso (datos reales)** | Mock data | `GET_BODY_MEASUREMENTS` existe | Sin integrar (solo móvil) |
| 10 | **Pagos — flujo completo** | UI skeleton | Resolvers parciales | Sin integrar |

---

## Prioridades de implementación

---

### Prioridad 1 — Módulo Dietas (ambos lados, desde cero)

Es la funcionalidad central del app para el paciente. El backend tiene solo `diets.module.ts` vacío. El móvil usa `mockDiet` en `DietScreen`, `DietMealDetailScreen` y en la tarjeta de `HomeScreen`.

#### Backend (`vitalBite-backend-core`)

1. Agregar modelos en `prisma/schema.prisma`:
   ```prisma
   model Diet {
     id            String      @id @default(cuid())
     tenantId      String
     patientId     String
     appointmentId String?
     startDate     DateTime
     endDate       DateTime?
     isActive      Boolean     @default(true)
     pdfUrl        String?
     createdAt     DateTime    @default(now())
     updatedAt     DateTime    @updatedAt
     deletedAt     DateTime?
     meals         DietMeal[]
     patient       Patient     @relation(fields: [patientId], references: [id])
   }

   model DietMeal {
     id       String     @id @default(cuid())
     dietId   String
     mealType MealType
     name     String
     diet     Diet       @relation(fields: [dietId], references: [id])
     items    DietItem[]
   }

   model DietItem {
     id       String   @id @default(cuid())
     mealId   String
     name     String
     quantity Float
     unit     String
     calories Float?
     protein  Float?
     carbs    Float?
     fat      Float?
     meal     DietMeal @relation(fields: [mealId], references: [id])
   }

   enum MealType {
     DESAYUNO
     ALMUERZO
     CENA
     MERIENDA
   }
   ```

2. Ejecutar migración:
   ```bash
   npx prisma migrate dev --name agregar-dietas
   npx prisma generate
   ```

3. Implementar `src/modules/diets/diets.service.ts`:
   - `dietsByPatient(patientId, tenantId)` — todas las dietas del paciente
   - `activeDietByPatient(patientId, tenantId)` — dieta con `isActive: true`
   - `dietById(id, tenantId)` — dieta por ID con meals e items

4. Implementar `src/modules/diets/diets.resolver.ts`:
   - `dietsByPatient(patientId)` — query (requiere auth)
   - `activeDietByPatient(patientId)` — query (requiere auth)
   - `dietById(id)` — query (requiere auth)

5. Registrar servicio y resolver en `diets.module.ts` e importar `PrismaModule`.

#### App móvil (`vitalBite-movil-app`)

1. Crear `src/services/diets.service.ts`:
   ```ts
   export const GET_ACTIVE_DIET = gql`...`
   export const GET_DIET_BY_ID  = gql`...`
   ```

2. `DietScreen.tsx`: reemplazar `mockDiet` con `useQuery(GET_ACTIVE_DIET, { variables: { patientId } })`.

3. `DietMealDetailScreen.tsx`: recibir datos reales vía route params o query.

4. `HomeScreen.tsx`: reemplazar tarjeta de dieta con datos de `GET_ACTIVE_DIET`.

---

### Prioridad 2 — Registro de paciente (SignUp)

El handler de `SignUpScreen.tsx` está vacío (`onPress={() => {}}`). El formulario recoge: `firstName`, `lastName`, `email`, `password`, `officeCode`.

#### Backend (`vitalBite-backend-core`)

- Verificar `auth.service.ts` → `register()`:
  - Si solo crea `User` (nutricionista), agregar una mutation separada `joinTenant(email, password, firstName, lastName, officeCode)` que crea un `Patient` vinculado al tenant identificado por `officeCode`.
  - Alternativamente, el `register` existente puede recibir un flag `role: PACIENTE` y `tenantCode`.
- Confirmar que la respuesta incluye `accessToken` para que el móvil pueda hacer auto-login.

#### App móvil (`vitalBite-movil-app`)

1. Crear o extender `src/services/auth.service.ts` con `REGISTER_PATIENT` mutation.
2. Implementar `handleSignUp()` en `SignUpScreen.tsx`:
   - Llamar mutation con los datos del formulario.
   - En éxito: guardar token en `AuthContext` y navegar a `BiometricAuthScreen` o `Main`.
   - En error: mostrar mensaje (email duplicado, código inválido).

---

### Prioridad 3 — Edición de perfil del paciente

`EditProfileScreen.tsx` tiene el formulario completo pero el botón "Guardar" no hace ninguna llamada. La mutation `UPDATE_PATIENT` ya existe en `profile.service.ts`.

#### App móvil (solo)

1. Inicializar el formulario con datos de `GET_MY_PATIENT_PROFILE` (query ya existe).
2. Conectar "Guardar" a `useMutation(UPDATE_PATIENT)` con las variables del formulario.
3. Tras éxito: invalidar caché de `GET_MY_PATIENT_PROFILE` y navegar atrás.

---

### Prioridad 4 — Perfil del nutricionista asignado

`NutritionistProfileScreen.tsx` usa `mockNutritionist`. El paciente necesita ver a su nutricionista real.

#### Backend (`vitalBite-backend-core`)

1. Agregar query `myNutritionist` en `patients.resolver.ts` que resuelva el `User` (nutricionista) vinculado al paciente autenticado.
2. El tipo de retorno puede reutilizar el tipo `User` existente.

#### App móvil (`vitalBite-movil-app`)

1. Crear `src/services/nutritionist.service.ts` con `GET_MY_NUTRITIONIST`.
2. Reemplazar `mockNutritionist` en `NutritionistProfileScreen.tsx` con la query real.
3. `NutritionistScheduleScreen` puede mantener el CTA de WhatsApp (no hay modelo de disponibilidad en el backend).

---

### Prioridad 5 — Módulo Notificaciones

`NotificationsScreen.tsx` usa `mockNotifications`. No existe ningún backend para notificaciones.

#### Backend (`vitalBite-backend-core`)

1. Agregar modelo en `prisma/schema.prisma`:
   ```prisma
   model Notification {
     id        String   @id @default(cuid())
     tenantId  String
     patientId String
     type      String
     title     String
     body      String
     isRead    Boolean  @default(false)
     createdAt DateTime @default(now())
     patient   Patient  @relation(fields: [patientId], references: [id])
   }
   ```

2. Migración: `npx prisma migrate dev --name agregar-notificaciones`.

3. Crear módulo `notifications` con:
   - `myNotifications()` — query: notificaciones del paciente autenticado
   - `markNotificationRead(id)` — mutation
   - `markAllNotificationsRead()` — mutation

4. Crear notificaciones automáticamente (en el servicio de citas) cuando:
   - Se crea una nueva cita → notificación al paciente
   - Se cancela una cita → notificación al paciente
   - Se asigna una dieta nueva → notificación al paciente *(cuando módulo dietas esté listo)*

#### App móvil (`vitalBite-movil-app`)

1. Crear `src/services/notifications.service.ts` con las queries/mutations.
2. Reemplazar mock en `NotificationsScreen.tsx`.
3. Conectar "Marcar todo como leído" a `markAllNotificationsRead`.
4. Mostrar badge de no leídas en el ícono de notificaciones en `HomeScreen`.

---

### Prioridad 6 — Autenticación biométrica

`BiometricAuthScreen.tsx` tiene la animación pero sin integración real con el sensor.

#### App móvil (solo)

1. Verificar que `expo-local-authentication` esté instalado (disponible en Expo SDK 54).
2. Implementar en `BiometricAuthScreen.tsx`:
   ```ts
   const result = await LocalAuthentication.authenticateAsync({
     promptMessage: 'Confirma tu identidad',
     fallbackLabel: 'Usar contraseña',
   });
   if (result.success) {
     // leer token de AsyncStorage y restaurar sesión
     await authContext.restoreSession();
   }
   ```
3. Manejar `LocalAuthentication.hasHardwareAsync()` y `isEnrolledAsync()` para mostrar fallback si el dispositivo no tiene biometría.
4. Agregar configuración en `app.json`:
   ```json
   "ios": { "infoPlist": { "NSFaceIDUsageDescription": "..." } }
   ```

---

### Prioridad 7 — Recuperación de contraseña

`ForgotPasswordScreen.tsx` simula éxito sin llamada real al backend.

#### Backend (`vitalBite-backend-core`)

1. Agregar en `auth.resolver.ts`:
   - `requestPasswordReset(email: String!)` — genera token y envía email
   - `resetPassword(token: String!, newPassword: String!)` — valida token y actualiza contraseña
2. Implementar envío de email (Supabase Auth magic link o `nodemailer`).

#### App móvil (`vitalBite-movil-app`)

1. Conectar `ForgotPasswordScreen` a `REQUEST_PASSWORD_RESET` mutation.
2. Mostrar el mensaje de éxito/error real del servidor (no simulado).

---

### Prioridad 8 — Historial de citas con datos reales

`AppointmentHistoryScreen.tsx` usa mock data a pesar de que `GET_MY_APPOINTMENTS` ya retorna citas completadas.

#### App móvil (solo)

1. Reemplazar `pastAppointments` mock con `useQuery(GET_MY_APPOINTMENTS)` filtrando por estado `COMPLETED` y `NO_SHOW`.
2. Eliminar el `DATE_MAP` hardcodeado; formatear fechas desde los datos de la query.
3. El link a PDF puede quedarse como placeholder hasta que el módulo documental esté disponible.

---

### Prioridad 9 — Gráfica de progreso con datos reales

`ProgressChartScreen.tsx` usa `mockMeasurements` aunque `GET_BODY_MEASUREMENTS` ya soporta filtro por rango de fechas.

#### App móvil (solo)

1. Reemplazar `mockMeasurements` con `useQuery(GET_BODY_MEASUREMENTS, { variables: { patientId, from, to } })`.
2. Conectar los selectores de métrica (peso, IMC, grasa, músculo, agua) y rango de tiempo (1m, 3m, 6m, 1a) a las variables de la query.
3. Alimentar el componente de gráfica con los datos reales.

---

### Prioridad 10 — Pagos — flujo completo

`PaymentPlansScreen` ya consume `GET_SUBSCRIPTION_PLANS` pero el formulario y la confirmación son skeleton.

#### App móvil

1. En `PaymentPlansScreen`: consultar `GET_CURRENT_SUBSCRIPTION` para marcar el plan activo del paciente.
2. En `PaymentFormScreen`: conectar "Pagar ahora" a `REQUEST_PLAN_CHANGE` mutation del Core.
3. En `PaymentConfirmScreen`: mostrar datos reales del objeto de respuesta (no mock transaction ref).

---

## Resumen de esfuerzo

| # | Tarea | Lado | Esfuerzo |
|---|---|---|---|
| 1 | Módulo Dietas completo | Ambos | Alto |
| 2 | Registro de paciente | Ambos | Medio |
| 3 | Edición de perfil | Solo móvil | Bajo |
| 4 | Perfil del nutricionista | Ambos | Medio |
| 5 | Módulo Notificaciones | Ambos | Medio-Alto |
| 6 | Autenticación biométrica | Solo móvil | Medio |
| 7 | Recuperación de contraseña | Ambos | Medio |
| 8 | Historial de citas real | Solo móvil | Bajo |
| 9 | Gráfica de progreso real | Solo móvil | Bajo |
| 10 | Pagos flujo completo | Ambos | Medio |

**Solo móvil (sin tocar backend):** prioridades 3, 6, 8, 9  
**Requieren trabajo en ambos lados:** prioridades 1, 2, 4, 5, 7, 10
