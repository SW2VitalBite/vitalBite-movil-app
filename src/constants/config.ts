/**
 * Configuración de red de la app.
 *
 * - GRAPHQL_URL: API GraphQL del Core empresarial (NestJS).
 * - IA_BASE_URL: microservicio de IA (FastAPI, REST). Se invoca directamente
 *   desde el móvil para el escáner nutricional (CU9); REST es válido aquí por
 *   ser un servicio interno de inferencia (ver AGENTS.md).
 * - IA_API_KEY: clave que viaja en la cabecera `X-API-Key` (debe coincidir con
 *   `API_KEY` del `.env` del backend de IA).
 *
 * ── Cómo cambiar entre desarrollo y producción ──────────────────────────────
 * Prioridad de selección del entorno:
 *   1. Variable de entorno  EXPO_PUBLIC_APP_ENV=production|development
 *      → p.ej.  EXPO_PUBLIC_APP_ENV=production npx expo start
 *      (también se inyecta por perfil de build en eas.json).
 *   2. La constante FORCE_ENV de abajo (cámbiala a mano para fijar un entorno).
 *   3. 'auto' (default): usa __DEV__ → dev server = development,
 *      build de release = production.
 *
 * Dev (LAN): para dispositivo físico usar la IP de la PC en la red local (misma
 * Wi-Fi). Emulador Android: 10.0.2.2 · Simulador iOS: localhost.
 *
 * ⚠️ El Core de producción es HTTP en claro (http://18.188.25.170). Android e
 * iOS bloquean cleartext en builds de release: ya se habilitó la excepción en
 * app.json (android.usesCleartextTraffic / iOS NSAllowsArbitraryLoads).
 */

// type AppEnv = 'development' | 'production';
type AppEnv = 'development' | 'production';
// Fija un entorno a mano ('development' | 'production') o deja 'auto'.
// Forzado a 'production' para repartir el APK a compañeros: garantiza que
// apunte a los microservicios desplegados (EC2 / Cloud Run) sin depender del
// perfil de build ni de __DEV__. Volver a 'auto' para desarrollo local.
const FORCE_ENV: AppEnv | 'auto' = 'production';


function resolveEnv(): AppEnv {
  const fromVar = process.env.EXPO_PUBLIC_APP_ENV;
  if (fromVar === 'development' || fromVar === 'production') return fromVar;
  if (FORCE_ENV !== 'auto') return FORCE_ENV;
  return __DEV__ ? 'development' : 'production';
}

export const APP_ENV: AppEnv = resolveEnv();

// IP de la PC servidora en la red local (dev: Core e IA en la misma máquina).
const LAN_HOST = '192.168.1.148';

const ENVIRONMENTS: Record<AppEnv, { GRAPHQL_URL: string; IA_BASE_URL: string }> = {
  development: {
    GRAPHQL_URL: `http://${LAN_HOST}:3000/graphql`,
    IA_BASE_URL: `http://${LAN_HOST}:8001`,
  },
  production: {
    // Core NestJS en EC2 — HTTP en claro (requiere cleartext en app.json).
    GRAPHQL_URL: 'http://18.188.25.170/graphql',
    // Backend IA en Cloud Run — HTTPS.
    IA_BASE_URL: 'https://vitalbite-ia-808502475421.us-central1.run.app',
  },
};

const active = ENVIRONMENTS[APP_ENV];

export const GRAPHQL_URL = active.GRAPHQL_URL;

export const IA_BASE_URL = active.IA_BASE_URL;
export const IA_API_V1 = `${IA_BASE_URL}/api/v1`;

// Debe coincidir con API_KEY del .env del backend de IA.
export const IA_API_KEY = 'vitalbite_ia_secret_key_dev_change_in_prod';

// Tamaño máximo de imagen aceptado por el backend de IA (5 MB).
export const IA_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

// ─── Agendamiento de citas vía WhatsApp ────────────────────────────────────────
// Número de la recepción/consultorio al que el paciente puede escribir para
// coordinar una cita manualmente como alternativa al agendamiento in-app.
// `WHATSAPP_BOOKING_NUMBER` se usa para mostrar; `WHATSAPP_BOOKING_E164` (solo
// dígitos, con código de país) es el que arma el enlace https://wa.me/.
export const WHATSAPP_BOOKING_NUMBER = '+1 (555) 151-2577';
export const WHATSAPP_BOOKING_E164 = '15551512577';
