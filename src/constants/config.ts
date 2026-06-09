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
 * Para dispositivo físico: usar la IP de la PC en la red local (misma Wi-Fi).
 * Para emulador Android: 10.0.2.2 · Para simulador iOS: localhost.
 */

// IP de la PC servidora en la red local (misma para Core e IA).
const LAN_HOST = '192.168.1.148';

export const GRAPHQL_URL = `http://${LAN_HOST}:3000/graphql`;

export const IA_BASE_URL = `http://${LAN_HOST}:8001`;
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
