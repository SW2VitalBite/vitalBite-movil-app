# Plan de Diseño — VitalBite App Móvil (Mockups)

> **Fecha de creación:** 03 de Junio, 2026  
> **Stack:** React Native (Expo) · TypeScript  
> **Fuente de diseño:** [Medical App UI Kit — Figma](https://www.figma.com/design/j2BTIhEXHfbde7aIrFayGJ/)  
> **Audiencia de la app:** Pacientes vinculados a una nutricionista

---

## 1. Sistema de diseño

### 1.1 Paleta de colores

| Token | Valor | Uso |
|---|---|---|
| `primary-gradient-start` | `#33E4DB` | Encabezados, botones primarios, gradiente inicio |
| `primary-gradient-end` | `#00BBD3` | Gradiente fin |
| `white` | `#FFFFFF` | Fondo de pantallas |
| `surface-light` | `#E9F6FE` | Cards, fondos secundarios |
| `text-primary` | `#252525` | Texto principal |
| `text-dark` | `#070707` | Texto de cuerpo oscuro |
| `text-black` | `#000000` | Etiquetas, timestamps |

### 1.2 Tipografía

| Rol | Fuente | Peso | Tamaño |
|---|---|---|---|
| Título de pantalla (Headboard) | League Spartan | SemiBold 600 | 24px |
| Subtítulo / Label botón | League Spartan | Medium 500 | 18–24px |
| Cuerpo de texto | League Spartan | Regular / Light | 12–14px |
| Logo de marca | Inter | Black / SemiBold | 32px |

### 1.3 Componentes reutilizables de Figma

Todos los siguientes componentes ya existen en el archivo Figma y se deben importar directamente:

| Componente Figma | Uso en VitalBite | Props clave |
|---|---|---|
| `Main Button (gradient)` | CTA primarios: "Iniciar sesión", "Guardar", "Agendar" | `property1: Activate` |
| `Main Button (outline)` | CTA secundarios: "Registrarse", "Cancelar" | `property1: Inactive` |
| `Square Button (gradient)` | Iconos de acción en listas | `property1: Booking / Document / Message` |
| `Header (gradient)` | Encabezado de pantalla con título blanco | `height: 99px` |
| `Back #2` | Botón de retroceso en headers | Flecha izquierda |
| `Bottom Nav Bar` | Navegación principal (Home, Mensajes, Perfil, Citas) | 4 tabs activos/inactivos |
| `Notification Item` | Filas de lista (citas, dietas, progreso) | Icono + título + descripción + tiempo |
| `Date Chip (Active)` | Filtros por fecha / categoría activos | Gradiente |
| `Date Chip (Inactive)` | Filtros inactivos | Outline |

### 1.4 Branding: HealthTrack → VitalBite

El kit de UI usa el nombre "HealthTrack" y un ícono de corazón con cruz médica.  
**Adaptación requerida:**
- Reemplazar texto "HealthTrack" → **"VitalBite"**
- Conservar el gradiente teal como identidad visual
- Reemplazar el ícono del corazón con cruz → ícono de hoja/nutrición (o mantener el corazón resignificado como bienestar nutricional)
- El tagline de la pantalla de registro debe cambiar a texto relacionado con nutrición personalizada

---

## 2. Arquitectura de navegación

```
App
├── Stack: Auth
│   ├── SplashScreen           (A-01)
│   ├── OnboardingScreen       (A-02, A-03, A-04)  ← slides del onboarding
│   ├── AuthChoiceScreen       (A-05)
│   ├── LoginScreen            (B-01)
│   ├── SignUpScreen           (B-02)
│   ├── ForgotPasswordScreen   (B-03)
│   └── BiometricAuthScreen    (B-04)
│
└── Stack: Main (Bottom Tab Navigator)
    ├── Tab: Home
    │   └── HomeScreen         (C-01)
    │
    ├── Tab: Citas
    │   ├── AppointmentsScreen (D-01)
    │   ├── AppointmentDetailScreen (D-02)
    │   └── AppointmentHistoryScreen (D-03)
    │
    ├── Tab: Perfil
    │   ├── ProfileScreen      (I-01)
    │   └── EditProfileScreen  (I-02)
    │
    └── Screens del Stack Principal (sin tab directo)
        ├── DietScreen         (E-01)
        ├── DietDetailScreen   (E-02)
        ├── ScannerScreen      (F-01)
        ├── ScannerResultScreen (F-02)
        ├── ProgressScreen     (G-01)
        ├── ProgressDetailScreen (G-02)
        ├── NotificationScreen (H-01)
        ├── NutritionistProfileScreen (J-01)
        └── PaymentScreen      (K-01)
```

---

## 3. Inventario de pantallas

### 3.1 Onboarding — Mantener tal como están en Figma

Estas pantallas se usan literalmente del kit, solo cambiando el nombre de la marca.

---

#### A-01 · Splash Screen

- **Nodo Figma:** `2279:1229` — "01 - A - First Screen"
- **Estado:** Usar tal cual, solo cambiar "HealthTrack" → "VitalBite"
- **Descripción:** Pantalla de bienvenida con gradiente teal de fondo, logo VitalBite centrado y breve animación de entrada.
- **Componentes:** Logo vectorial, texto de marca, fondo gradiente

```
┌─────────────────────────┐
│                         │
│   [Fondo teal gradiente]│
│                         │
│         [Logo]          │
│       VitalBite         │
│                         │
└─────────────────────────┘
```

---

#### A-02 · Onboarding — Slide 1: Tu nutrición personalizada

- **Nodo Figma:** Pantallas de onboarding del kit (adaptar slides existentes)
- **Estado:** Adaptar ilustraciones y texto para nutrición
- **Descripción:** Primer slide del carrusel de onboarding. Ilustración de dieta saludable. Título: "Tu nutrición personalizada". Texto explicativo. Indicadores de progreso (dots).
- **Componentes:** Ilustración, texto Body, dots indicadores, botón "Siguiente"

---

#### A-03 · Onboarding — Slide 2: Seguimiento corporal inteligente

- **Estado:** Adaptar de slide existente en Figma
- **Descripción:** Segundo slide. Ilustración de métricas corporales. Título: "Seguimiento inteligente de tu cuerpo". Dots de progreso.
- **Componentes:** Ilustración, texto Body, dots indicadores, botón "Siguiente"

---

#### A-04 · Onboarding — Slide 3: Escanea lo que consumes

- **Estado:** Adaptar de slide existente en Figma
- **Descripción:** Tercer slide. Ilustración de la cámara escaneando un producto. Título: "Escanea lo que consumes". Dots de progreso. Botón "Comenzar".
- **Componentes:** Ilustración cámara/OCR, texto Body, dots indicadores, botón "Comenzar"

---

#### A-05 · Auth Choice Screen

- **Nodo Figma:** `2279:1230` — "02 - A - Register"
- **Estado:** Usar tal cual, adaptar texto descriptivo
- **Descripción:** Pantalla de elección entre Login y Sign Up. Logo centrado. Texto: "Conecta con tu nutricionista y lleva el control de tu alimentación." Dos botones: "Iniciar Sesión" (gradiente activo) y "Registrarse" (outline).
- **Adaptación:** Cambiar texto lorem ipsum → frase de valor de la app

---

### 3.2 Autenticación — Mantener tal como están en Figma

---

#### B-01 · Login Screen

- **Nodo Figma:** Buscar pantalla de Login del kit (sección "Login, Sign Up")
- **Estado:** Usar tal cual, adaptar labels
- **Descripción:** Header gradiente teal con título "Iniciar Sesión". Formulario: campo email, campo contraseña (con ojo para mostrar/ocultar). Link "¿Olvidaste tu contraseña?". Botón primario "Iniciar Sesión". Separator "o" + opción de autenticación biométrica (huella).
- **Componentes:** Header, Input fields, Primary Button, Link text, Fingerprint icon button

---

#### B-02 · Sign Up Screen

- **Nodo Figma:** Buscar pantalla de Sign Up del kit (sección "Login, Sign Up")
- **Estado:** Usar tal cual, adaptar campos
- **Descripción:** Header gradiente con "Crear cuenta". Formulario: nombre, apellido, email, contraseña, confirmar contraseña. Botón "Registrarse". Link a Login.
- **Nota de adaptación:** El registro incluye vinculación al consultorio via `tenant_id`. Agregar campo "Código de consultorio" (código que entrega la nutricionista al paciente).

---

#### B-03 · Forgot Password Screen

- **Nodo Figma:** Pantalla de recuperación de contraseña del kit
- **Estado:** Usar tal cual
- **Descripción:** Header + campo email + botón "Enviar enlace de recuperación". Confirmación de envío.
- **Componentes:** Header, Input, Primary Button, Success state

---

#### B-04 · Biometric Auth Screen

- **Nodo Figma:** Pantalla de autenticación biométrica (si existe en kit, o adaptar)
- **Estado:** Adaptar o crear con componentes del kit
- **Descripción:** Pantalla de desbloqueo rápido con huella digital. Logo VitalBite arriba. Ícono de huella grande centrado. Texto "Toca el sensor para ingresar". Link "Usar contraseña en su lugar".
- **Componentes:** Logo, Fingerprint icon (grande), texto, link secundario
- **Nota técnica:** Usa `expo-local-authentication` para la autenticación nativa

---

### 3.3 Pantallas de Perfil — Mantener tal como están en Figma

---

#### I-01 · Profile Screen

- **Nodo Figma:** Sección "Profile Screens" del kit
- **Estado:** Usar tal cual
- **Descripción:** Header gradiente con foto de perfil del paciente. Nombre completo. Email. Sección de información: altura, peso actual, fecha de nacimiento, alergias. Botón "Editar perfil". Links: Mi nutricionista, Documentos, Cerrar sesión.
- **Componentes:** Header gradient, Avatar, Info rows, List items, Button, Dividers

---

#### I-02 · Edit Profile Screen

- **Nodo Figma:** Pantalla de edición de perfil del kit
- **Estado:** Usar tal cual
- **Descripción:** Header con título "Editar perfil" y botón guardar. Formulario: nombre, apellido, teléfono, fecha nacimiento, altura (cm). Botón "Guardar cambios".
- **Componentes:** Header, Input fields, Date picker, Save button

---

#### I-03 · Settings / Preferences Screen

- **Nodo Figma:** Pantalla de configuración del kit
- **Estado:** Usar tal cual (adaptar opciones)
- **Descripción:** Lista de preferencias: notificaciones push, autenticación biométrica, idioma, tema. Toggle switches. Sección de cuenta: cambiar contraseña, eliminar cuenta.
- **Componentes:** Settings rows, Toggle switches, Chevrons

---

### 3.4 Notificaciones — Mantener tal como está en Figma

---

#### H-01 · Notification Screen

- **Nodo Figma:** `2112:1667` — "09 - A - Notification"
- **Estado:** Usar tal cual, adaptar textos de notificaciones
- **Descripción:** Header gradiente con "Notificaciones". Filtros chips: Hoy / Ayer / [fechas]. Lista de notificaciones agrupadas por fecha. Cada ítem: ícono cuadrado (cita/dieta/mensaje), título, descripción breve, tiempo relativo. Link "Marcar todo como leído". Barra de búsqueda.
- **Adaptación de contenido:** 
  - "Scheduled Appointment" → "Cita programada"
  - "Scheduled Change" → "Cambio de cita"
  - "Medical Notes" → "Nueva dieta asignada"
  - "Medical History Update" → "Nuevo reporte disponible"
- **Componentes:** Header, Date chips (activo/inactivo), Notification rows (Square Button + texto + tiempo), Bottom Nav

---

### 3.5 Perfil de Nutricionista — Adaptar de "Doctor Profile"

---

#### J-01 · Nutritionist Profile Screen

- **Nodo Figma:** Sección "Doctor Profile" del kit
- **Estado:** Adaptar — reusar componentes, cambiar labels
- **Descripción:** Header gradiente con foto de la nutricionista. Nombre y credenciales. Rating / años de experiencia. Especialidades (nutrición clínica, deportiva, pediátrica). Sección "Sobre mí". Horarios de atención. Botón "Agendar cita" (gradiente). Botón "Enviar mensaje" (WhatsApp).
- **Adaptaciones:**
  - "Doctor" → "Nutricionista"
  - "Specialty: Cardiology" → "Especialidad: Nutrición Clínica"
  - "Years exp" → "Años de experiencia"
  - Remover campo de Hospital → agregar "Consultorio"
  - Mantener stats: pacientes activos, años de exp, calificación
- **Componentes reutilizados:** Doctor profile avatar/header, Stats row, About section, Schedule section, Action buttons

---

#### J-02 · Nutritionist Contact / Schedule Screen

- **Nodo Figma:** Pantalla de agenda/horario del Doctor Profile del kit
- **Estado:** Adaptar
- **Descripción:** Calendario de disponibilidad de la nutricionista. Slots de hora disponibles. CTA: "Solicitar cita vía WhatsApp" (redirige al bot).
- **Componentes:** Calendar widget, Time slot chips, WhatsApp CTA button

---

### 3.6 Mis Citas — Adaptar de sección de Appointments

---

#### D-01 · Appointments List Screen

- **Nodo Figma:** Sección de "Appointments" del kit (mis citas)
- **Estado:** Adaptar — reusar componentes
- **Descripción:** Header "Mis Citas" gradiente. Tabs: "Próximas" / "Historial". Lista de citas: cada card incluye foto de nutricionista, nombre, fecha/hora, estado (Confirmada / Pendiente / Completada). Botón flotante "+" o CTA "Agendar nueva cita".
- **Adaptaciones:**
  - Reemplazar "Dr." → "Nut." o nombre completo
  - Estados: Confirmada (verde), Pendiente (amarillo), Completada (gris)
  - "Agendar nueva cita" → redirige al bot de WhatsApp
- **Componentes reutilizados:** Appointment card (foto + info + estado), Tab selector, Header, Bottom nav

---

#### D-02 · Appointment Detail Screen

- **Nodo Figma:** Detalle de cita del kit
- **Estado:** Adaptar
- **Descripción:** Detalle de una cita específica. Foto de nutricionista + nombre. Fecha, hora, duración estimada. Estado de la cita. Notas de la cita (si existe). Botón "Cancelar cita" (solo si está pendiente o confirmada con 24h de anticipación). Botón "Ver dieta asociada".
- **Componentes:** Profile card, Info rows, Status badge, Action buttons

---

#### D-03 · Appointment History Screen

- **Nodo Figma:** Lista de consultas anteriores del kit
- **Estado:** Adaptar
- **Descripción:** Lista de todas las consultas pasadas con: fecha, peso registrado, medidas tomadas, dieta generada (link a PDF). Cada card es colapsable/expandible.
- **Componentes:** History list items, Expand/collapse rows, PDF download link

---

### 3.7 Mi Dieta — Pantallas nuevas adaptando componentes del kit

---

#### E-01 · My Diet — Overview Screen

- **Nodo Figma:** No existe directamente. Crear con componentes del kit.
- **Estado:** Nueva pantalla creada con componentes reutilizados
- **Descripción:** Header gradiente "Mi Dieta". Tarjeta con info de la dieta activa: nombre de la dieta, nutricionista asignadora, fecha de inicio. Cuatro tarjetas de tiempo de comida: Desayuno, Almuerzo, Cena, Meriendas (cada una con ícono, cantidad de alimentos, macros resumen). Botón "Descargar PDF".
- **Componentes reutilizados del kit:**
  - Header gradient (reutilizar de cualquier pantalla con header)
  - Square Buttons (iconos de comida)
  - Cards con fondo `#E9F6FE` (reutilizar de Medical Records)
  - Primary Button (Descargar PDF)
  - Bottom Nav

```
┌─────────────────────────┐
│  [Header: Mi Dieta]     │
├─────────────────────────┤
│  Dieta: Plan Balance    │
│  Asignada: 28 May 2026  │
│  Por: Nut. Ana García   │
├──────────┬──────────────┤
│ 🌅 Desay │ 🌞 Almuerzo  │
│ 3 items  │ 4 items      │
├──────────┼──────────────┤
│ 🌙 Cena  │ 🍎 Merienda  │
│ 2 items  │ 2 items      │
├─────────────────────────┤
│  [ Descargar PDF ]      │
└─────────────────────────┘
```

---

#### E-02 · Diet Meal Detail Screen

- **Estado:** Nueva pantalla con componentes reutilizados
- **Descripción:** Header con nombre del tiempo de comida (ej: "Desayuno"). Lista de alimentos: cada ítem muestra nombre del alimento, cantidad/porción, calorías, macros (proteína/carbohidrato/grasa). Información total del tiempo de comida al final.
- **Componentes reutilizados:** Header, List rows con íconos, Info cells, Totals card

---

### 3.8 Escáner Nutricional — Pantallas nuevas (exclusivas móvil)

---

#### F-01 · Scanner Home Screen

- **Estado:** Nueva pantalla creada con componentes del kit
- **Descripción:** Pantalla de inicio del escáner. Header "Escáner Nutricional". Ilustración de cámara/etiqueta. Texto explicativo: "Apunta al código o etiqueta nutricional del producto para obtener su información". Botón primario "Abrir cámara". Historial de escaneos recientes (cards con nombre del producto + fecha).
- **Componentes reutilizados:** Header, Illustration frame, Primary Button, Notification-style rows (para historial)

```
┌─────────────────────────┐
│  [Header: Escáner]      │
├─────────────────────────┤
│                         │
│   [Ilustración cámara]  │
│                         │
│  Apunta a la etiqueta   │
│  nutricional del        │
│  producto               │
│                         │
│  [ Abrir Cámara ]       │
├─────────────────────────┤
│  Escaneos recientes     │
│  ┌──────────────────┐   │
│  │ Yogur Natural    │   │
│  │ 2 Jun 2026       │   │
│  └──────────────────┘   │
└─────────────────────────┘
```

---

#### F-02 · Camera / Scan Screen

- **Estado:** Nueva pantalla (nativa, viewfinder de cámara)
- **Descripción:** Vista de cámara a pantalla completa. Overlay con recuadro de guía para enfocar la etiqueta. Botón de captura centrado abajo. Botón de linterna. Texto de ayuda "Enfoca la etiqueta nutricional". Cancelar (X) arriba izquierda.
- **Componentes reutilizados del kit:** Botones de acción del kit como overlay sobre la cámara. Usar `expo-camera`.

---

#### F-03 · Scan Result Screen

- **Estado:** Nueva pantalla con componentes del kit
- **Descripción:** Header "Resultado del Escáner". Card del producto detectado: nombre del producto, imagen. Métricas principales: calorías totales (grande), proteínas, carbohidratos, grasas (chips/badges). Lista de ingredientes. Sección de advertencias de alérgenos. Botón "Guardar escaneo". Botón "Escanear otro".
- **Componentes reutilizados:** Header, Metric cards (`#E9F6FE`), Tag chips (Date Chip del kit), List rows, Action buttons

```
┌─────────────────────────┐
│  [Header: Resultado]    │
├─────────────────────────┤
│  🥛 Yogur Natural Yoplait│
│                         │
│     🔥 127 kcal / 100g  │
│                         │
│ [Prot:5g][Carb:15g][Fat:│
│ 3g]                     │
├─────────────────────────┤
│  Ingredientes           │
│  - Leche descremada     │
│  - Cultivos vivos       │
├─────────────────────────┤
│  ⚠️ Contiene lactosa    │
├─────────────────────────┤
│  [ Guardar ]  [ Otro ]  │
└─────────────────────────┘
```

---

### 3.9 Mi Progreso — Adaptar de "Medical Records"

---

#### G-01 · Progress Overview Screen

- **Nodo Figma:** Adaptar sección "Medical Records" del kit para registros de composición corporal
- **Estado:** Adaptar — reusar componentes, cambiar contexto médico → nutricional
- **Descripción:** Header "Mi Progreso". Card de resumen del último control: fecha, peso, IMC. Mini gráfica de evolución de peso (últimas 6 sesiones). Cuatro tarjetas métricas: Grasa corporal %, Masa muscular kg, Agua corporal %, Masa ósea kg. Botón "Ver historial completo". Botón "Descargar reporte PDF".
- **Adaptaciones de Medical Records:**
  - "Blood Pressure", "Sugar Level" → métricas de composición corporal
  - Gráficas de línea → evolución de IMC/peso
  - "Prescription" → "Dieta activa"
  - "Lab Results" → "Mediciones corporales"
- **Componentes reutilizados:** Header, Metric cards, Progress chart widget, Action buttons, Bottom nav

```
┌─────────────────────────┐
│  [Header: Mi Progreso]  │
├─────────────────────────┤
│  Último control: 28 May │
│  Peso: 68 kg | IMC: 24.5│
│                         │
│  [📈 Gráfica evolución]  │
├──────────┬──────────────┤
│ Grasa    │ Músculo      │
│ 22.5%    │ 28.3 kg      │
├──────────┼──────────────┤
│ Agua     │ Masa ósea    │
│ 55.2%    │ 2.8 kg       │
├─────────────────────────┤
│ [ Ver historial ]       │
│ [ Descargar PDF ]       │
└─────────────────────────┘
```

---

#### G-02 · Body Measurements History Screen

- **Nodo Figma:** Historial de registros médicos del kit
- **Estado:** Adaptar
- **Descripción:** Lista cronológica de todas las sesiones de medición. Cada card: fecha de sesión, peso registrado, indicadores clave. Expandible para ver todas las circunferencias (brazo, pierna, abdomen, antebrazo). Link a PDF de cada sesión.
- **Componentes reutilizados:** Record history rows, Expand/collapse, PDF link rows

---

#### G-03 · Progress Chart Detail Screen

- **Estado:** Nueva pantalla con componentes del kit
- **Descripción:** Gráfica interactiva a pantalla completa de un indicador seleccionado (IMC, % grasa, kg músculo, etc). Selector de indicador arriba (chips horizontales). Selector de rango temporal (1 mes / 3 meses / 6 meses / 1 año). Tabla de datos debajo de la gráfica. Interpretación textual: "Tu IMC mejoró un 3% este mes".
- **Componentes reutilizados:** Header, Chip selectors (Date Chips adaptados), Chart widget, Data table rows

---

### 3.10 Dashboard — Nueva pantalla con componentes del kit

---

#### C-01 · Home Dashboard Screen

- **Estado:** Nueva pantalla — Combinar elementos de Home, Appointments y Medical Records del kit
- **Descripción:** Pantalla principal del paciente. Header especial: foto de perfil a la izquierda, saludo "Hola, [Nombre]", icono de notificaciones a la derecha. Card principal: próxima cita (foto nutricionista, nombre, fecha, hora, estado). Card de progreso: peso actual vs objetivo, barra de progreso hacia el objetivo. Card de acceso rápido a la dieta activa (nombre dieta + un ítem de ejemplo). Botón flotante del escáner (ícono de cámara, gradiente). Bottom nav.
- **Componentes reutilizados:**
  - Header adaptado (saludo + avatar + notif icon)
  - Appointment card (próxima cita)
  - Progress card (adaptar de Medical Records)
  - Diet preview card (adaptar de Records)
  - FAB (Floating Action Button) del escáner
  - Bottom Nav

```
┌─────────────────────────┐
│ 👤 Hola, María    🔔    │
├─────────────────────────┤
│  📅 PRÓXIMA CITA        │
│  Nut. Ana García        │
│  Miércoles 10 Jun       │
│  10:00 AM  [Confirmada] │
├─────────────────────────┤
│  📊 MI PROGRESO         │
│  68 kg → 62 kg (objetivo)│
│  ████████░░░░ 60%       │
├─────────────────────────┤
│  🥗 MI DIETA ACTIVA     │
│  Plan Balance           │
│  Próx: Almuerzo >       │
├─────────────────────────┤
│  [🏠] [💬] [👤] [📅]  │
│                    [📷] │ ← FAB escáner
└─────────────────────────┘
```

---

### 3.11 Pagos — Mantener tal como están en Figma

---

#### K-01 · Plans & Pricing Screen

- **Nodo Figma:** Sección "Payment" del kit
- **Estado:** Usar tal cual
- **Descripción:** Listado de planes SaaS disponibles (Básico, Profesional, Enterprise). Cards de planes con precio mensual, features incluidos. Indicador de plan activo. Botón "Seleccionar plan".
- **Nota:** Esta pantalla es para la nutricionista, no para el paciente. En la app del paciente, esta pantalla se muestra solo si se intenta acceder y la nutricionista tiene suscripción vencida.

---

#### K-02 · Payment Form Screen

- **Nodo Figma:** Formulario de pago del kit
- **Estado:** Usar tal cual
- **Descripción:** Formulario de datos de tarjeta: número, titular, fecha de vencimiento, CVV. Selector de método de pago (tarjeta / PayPal). Resumen del plan seleccionado. Botón "Pagar".
- **Componentes:** Header, Input fields de tarjeta, Payment method selector, Summary card, CTA button

---

#### K-03 · Payment Confirmation Screen

- **Nodo Figma:** Pantalla de confirmación de pago del kit
- **Estado:** Usar tal cual
- **Descripción:** Ícono de éxito (check gradiente). Texto "¡Pago exitoso!". Resumen de transacción. Botón "Volver al inicio".

---

## 4. Flujo de navegación completo

```
[Splash] → [Onboarding 1] → [Onboarding 2] → [Onboarding 3] → [Auth Choice]
                                                                      │
                           ┌──────────────────────┬───────────────────┘
                           ▼                      ▼
                       [Login]              [Sign Up]
                           │                      │
                           └──────────┬───────────┘
                                      ▼
                                  [Dashboard]
                                      │
              ┌───────────────────────┼───────────────────────────┐
              ▼                       ▼                           ▼
        [Mis Citas]            [Mi Progreso]               [Perfil]
              │                       │                           │
              ├── [Detalle cita]      ├── [Historial mediciones]  ├── [Editar perfil]
              └── [Historial citas]   └── [Gráfica detalle]       └── [Configuración]
              
        Desde Dashboard:
        ├── [Mi Dieta] → [Detalle comida]
        ├── [Escáner] → [Cámara] → [Resultado]
        ├── [Perfil Nutricionista]
        └── [Notificaciones]
```

---

## 5. Fases de implementación de mockups

### Fase 1 — Fundamentos y flujo crítico (semana 1)

Prioridad: pantallas que permiten ejecutar el flujo completo de usuario.

| # | Pantalla | ID | Tipo | Prioridad |
|---|---|---|---|---|
| 1 | Splash Screen | A-01 | Figma directo | 🔴 Alta |
| 2 | Auth Choice | A-05 | Figma directo | 🔴 Alta |
| 3 | Login | B-01 | Figma directo | 🔴 Alta |
| 4 | Sign Up | B-02 | Figma directo | 🔴 Alta |
| 5 | Home Dashboard | C-01 | Nueva / adaptada | 🔴 Alta |
| 6 | Bottom Nav | — | Componente | 🔴 Alta |

### Fase 2 — Módulos núcleo del paciente (semana 2)

| # | Pantalla | ID | Tipo |
|---|---|---|---|
| 7 | Mis Citas — Lista | D-01 | Adaptada |
| 8 | Detalle de Cita | D-02 | Adaptada |
| 9 | Mi Dieta — Overview | E-01 | Nueva con componentes |
| 10 | Detalle Tiempo de Comida | E-02 | Nueva con componentes |
| 11 | Notificaciones | H-01 | Figma directo |

### Fase 3 — Funcionalidades avanzadas (semana 3)

| # | Pantalla | ID | Tipo |
|---|---|---|---|
| 12 | Mi Progreso — Overview | G-01 | Adaptada |
| 13 | Historial de mediciones | G-02 | Adaptada |
| 14 | Gráfica detalle | G-03 | Nueva con componentes |
| 15 | Escáner — Home | F-01 | Nueva con componentes |
| 16 | Escáner — Cámara | F-02 | Nueva (nativa) |
| 17 | Escáner — Resultado | F-03 | Nueva con componentes |

### Fase 4 — Perfiles, configuración y pagos (semana 4)

| # | Pantalla | ID | Tipo |
|---|---|---|---|
| 18 | Onboarding slides (3) | A-02–A-04 | Adaptadas |
| 19 | Biometric Auth | B-04 | Adaptada |
| 20 | Profile Screen | I-01 | Figma directo |
| 21 | Edit Profile | I-02 | Figma directo |
| 22 | Perfil Nutricionista | J-01 | Adaptada (Doctor Profile) |
| 23 | Agenda Nutricionista | J-02 | Adaptada |
| 24 | Historial de Citas | D-03 | Adaptada |
| 25 | Payment Plans | K-01 | Figma directo |
| 26 | Payment Form | K-02 | Figma directo |
| 27 | Payment Confirmation | K-03 | Figma directo |

---

## 6. Guía de adaptación de componentes

### 6.1 Pantallas Figma → React Native: reglas de conversión

| Figma (Tailwind/Web) | React Native |
|---|---|
| `div` con `className` | `View` con `StyleSheet` |
| Gradiente `bg-gradient-to-b` | `LinearGradient` de `expo-linear-gradient` |
| `text` con `font-['League_Spartan']` | `Text` con `fontFamily: 'LeagueSpartan'` |
| `button` con `onClick` | `TouchableOpacity` con `onPress` |
| `img` con `src` | `Image` con `source={{ uri }}` |
| `rounded-[30px]` | `borderRadius: 30` |
| `overflow-clip` | `overflow: 'hidden'` |
| Absolute positioning | `position: 'absolute'` en `StyleSheet` |
| Bottom nav (`h-[67px]`) | `View` fija + `height: 67` |

### 6.2 Mapeo de colores al sistema de tokens

```typescript
// src/constants/theme.ts
export const colors = {
  gradientStart: '#33E4DB',
  gradientEnd: '#00BBD3',
  white: '#FFFFFF',
  surfaceLight: '#E9F6FE',
  textPrimary: '#252525',
  textDark: '#070707',
  textBlack: '#000000',
};

export const gradientProps = {
  colors: [colors.gradientStart, colors.gradientEnd],
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
};
```

### 6.3 Estructura de archivos recomendada para mockups

```
src/
├── components/
│   ├── common/
│   │   ├── GradientHeader.tsx       ← Header reutilizable
│   │   ├── GradientButton.tsx       ← Botón primario gradiente
│   │   ├── OutlineButton.tsx        ← Botón secundario outline
│   │   ├── SquareIconButton.tsx     ← Botón cuadrado con ícono
│   │   ├── BottomTabBar.tsx         ← Barra de navegación inferior
│   │   ├── DateChip.tsx             ← Chip activo/inactivo
│   │   └── NotificationItem.tsx     ← Fila de notificación/lista
│   ├── home/
│   │   ├── AppointmentCard.tsx
│   │   ├── ProgressCard.tsx
│   │   └── DietPreviewCard.tsx
│   ├── diet/
│   │   ├── MealCard.tsx
│   │   └── FoodItem.tsx
│   └── progress/
│       ├── MetricCard.tsx
│       └── ProgressChart.tsx
│
├── screens/
│   ├── auth/
│   │   ├── SplashScreen.tsx         (A-01)
│   │   ├── OnboardingScreen.tsx     (A-02 a A-04)
│   │   ├── AuthChoiceScreen.tsx     (A-05)
│   │   ├── LoginScreen.tsx          (B-01)
│   │   ├── SignUpScreen.tsx         (B-02)
│   │   ├── ForgotPasswordScreen.tsx (B-03)
│   │   └── BiometricAuthScreen.tsx  (B-04)
│   ├── home/
│   │   └── HomeScreen.tsx           (C-01)
│   ├── appointments/
│   │   ├── AppointmentsScreen.tsx   (D-01)
│   │   ├── AppointmentDetailScreen.tsx (D-02)
│   │   └── AppointmentHistoryScreen.tsx (D-03)
│   ├── diet/
│   │   ├── DietScreen.tsx           (E-01)
│   │   └── DietMealDetailScreen.tsx (E-02)
│   ├── scanner/
│   │   ├── ScannerHomeScreen.tsx    (F-01)
│   │   ├── ScannerCameraScreen.tsx  (F-02)
│   │   └── ScannerResultScreen.tsx  (F-03)
│   ├── progress/
│   │   ├── ProgressScreen.tsx       (G-01)
│   │   ├── MeasurementsHistoryScreen.tsx (G-02)
│   │   └── ProgressChartScreen.tsx  (G-03)
│   ├── notifications/
│   │   └── NotificationScreen.tsx   (H-01)
│   ├── profile/
│   │   ├── ProfileScreen.tsx        (I-01)
│   │   ├── EditProfileScreen.tsx    (I-02)
│   │   └── SettingsScreen.tsx       (I-03)
│   ├── nutritionist/
│   │   ├── NutritionistProfileScreen.tsx (J-01)
│   │   └── NutritionistScheduleScreen.tsx (J-02)
│   └── payment/
│       ├── PaymentPlansScreen.tsx   (K-01)
│       ├── PaymentFormScreen.tsx    (K-02)
│       └── PaymentConfirmScreen.tsx (K-03)
│
├── navigation/
│   ├── AppNavigator.tsx             ← Root navigator
│   ├── AuthNavigator.tsx            ← Stack auth
│   └── MainNavigator.tsx            ← Bottom tabs + main stack
│
└── constants/
    └── theme.ts                     ← Colores, fuentes, espaciado
```

---

## 7. Resumen de pantallas: conteo total

| Grupo | Nombre | Total | Tipo |
|---|---|---|---|
| A | Onboarding | 5 | 2 Figma directo + 3 adaptadas |
| B | Autenticación | 4 | 3 Figma directo + 1 adaptada |
| C | Dashboard | 1 | Nueva con componentes |
| D | Mis Citas | 3 | Adaptadas de Doctor Appointments |
| E | Mi Dieta | 2 | Nuevas con componentes |
| F | Escáner Nutricional | 3 | Nuevas (exclusivas móvil) |
| G | Mi Progreso | 3 | Adaptadas de Medical Records |
| H | Notificaciones | 1 | Figma directo |
| I | Perfil | 3 | Figma directo |
| J | Perfil Nutricionista | 2 | Adaptadas de Doctor Profile |
| K | Pagos | 3 | Figma directo |
| **Total** | | **30 pantallas** | |

---

## 8. Notas de implementación para mockups

1. **Solo mockups en esta fase:** No conectar a API real. Usar datos mockeados/estáticos hardcodeados en pantallas.

2. **Expo Linear Gradient:** Instalar `expo-linear-gradient` para todos los headers y botones gradiente.

3. **Fuentes:** Descargar e incorporar `League Spartan` desde Google Fonts usando `expo-font` o `@expo-google-fonts/league-spartan`.

4. **Navegación:** Usar `@react-navigation/native` + `@react-navigation/stack` + `@react-navigation/bottom-tabs`.

5. **Mockup de datos:** Crear archivo `src/mocks/data.ts` con fixtures de citas, dietas, mediciones y notificaciones para mostrar en todas las pantallas.

6. **Sin Pharmacy:** El kit incluye pantallas de farmacia que se omiten por completo. No implementar ninguna pantalla relacionada.

7. **Cámara (scanner):** Para el mockup, mostrar la pantalla de cámara con un overlay estático (sin activar OCR real). El resultado puede ser un scan pre-definido mockeado.

8. **Iconos:** Usar `@expo/vector-icons` (Ionicons / MaterialCommunityIcons) como fallback mientras se ajustan los SVG assets del kit de Figma.

---

## 9. Rediseño: reutilización real de componentes de Figma

> **Fecha:** 03 de Junio, 2026 — Segunda iteración  
> Objetivo: dejar de usar placeholders (íconos `leaf` / `person`) y **reutilizar los assets reales del Design System de Figma** (logo, avatares fotográficos, tarjeta de pago y métodos de pago).

### 9.1 Nodos de Figma consultados

| Sección Figma | Node ID | Uso en la app |
|---|---|---|
| Components & Variants | `2399:1481` | Inputs, botones, toggles, radios, search, bottom nav |
| Iconos | `2064:101` | Iconografía de especialidades / acciones |
| Elementos adicionales | `2064:842` | **Payment Method**, Profile cards, Doctor Profile, Appointment |
| App Logo | `2470:1661` (gradiente), `2470:1719` (blanco) | Marca VitalBite |
| Avatar | `2249:xxxx` / `2267:xxxx` | Fotos de pacientes y nutricionista |

### 9.2 Assets descargados a `assets/figma/`

```
assets/figma/
├── logo-gradient.svg        ← marca (corazón+hoja) en gradiente teal
├── logo-white.svg           ← marca en blanco (para fondos con gradiente)
└── avatars/
    ├── emma.png   (214x214) ← nutricionista Ana García
    ├── sarah.png            ← paciente María González
    ├── megan.png            ← pool de avatares
    ├── sophia.png
    ├── david.png
    └── jacob.png
```

> Los avatares son **PNG fotográficos** del UI Kit. El logo es **SVG vectorial** auto-contenido (incluye el gradiente del kit), renderizado con `react-native-svg` (`SvgXml`), librería incluida en Expo Go.

### 9.3 Nuevos componentes reutilizables

| Componente | Archivo | Origen Figma | Descripción |
|---|---|---|---|
| `Logo` | `src/components/common/Logo.tsx` | App Logo | Marca VitalBite (variantes `gradient`/`white`) + wordmark. Usa el SVG real. |
| `Avatar` | `src/components/common/Avatar.tsx` | Avatar | Avatar circular con foto real + fallback con ícono, soporta `ring`. |
| `PaymentCard` | `src/components/payment/PaymentCard.tsx` | Payment Method (tarjeta teal) | Tarjeta de crédito con chip, número, titular y vencimiento. |
| `PaymentMethodRow` | `src/components/payment/PaymentMethodRow.tsx` | Payment Method (botones) | Filas Add New Card / Apple Pay / Paypal / Google Pay con radio. |

Soporte:
- `src/assets/logoSvg.ts` — XML del logo embebido (fuente para `SvgXml`).
- `src/constants/assets.ts` — registro de avatares (`require`) y pool de asignación.

### 9.4 Pantallas actualizadas

| Pantalla | Cambio |
|---|---|
| `SplashScreen` | Ícono `leaf` → **Logo** real (variante blanca) |
| `AuthChoiceScreen` | Ícono `leaf` → **Logo** real (variante gradiente) |
| `HomeScreen` | Avatar del header → foto real del paciente (`mockUser.avatar`), navega a Perfil |
| `ProfileScreen` | Avatar de perfil → foto real del paciente |
| `NutritionistProfileScreen` | Avatar → foto real de la nutricionista (Emma) |
| `AppointmentCard` | Fallback `person` → **Avatar** con foto (prop `avatar`, default nutricionista) |
| `AppointmentDetailScreen` | Avatar de la nutricionista → foto real |
| `PaymentFormScreen` | Añade **PaymentCard** + **PaymentMethodRow** (Add New Card, Apple Pay, Paypal, Google Pay) |

### 9.5 Datos mock

`src/mocks/data.ts` ahora referencia avatares reales:
- `mockUser.avatar = avatars.sarah`
- `mockNutritionist.avatar = avatars.emma`

### 9.6 Dependencia añadida

- `react-native-svg` (vía `npx expo install`) — necesaria para renderizar el logo SVG del Design System. Compatible con Expo Go.

> **Nota:** las URLs de assets del MCP de Figma expiran a los 7 días; por eso los archivos se descargaron localmente a `assets/figma/` y quedan versionados con el proyecto.
