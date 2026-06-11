/**
 * Contenido estático de las páginas informativas (Centro de ayuda, Términos y
 * condiciones, Política de privacidad). Se renderiza en `InfoPageScreen`.
 */

export type InfoPageKey = 'help' | 'terms' | 'privacy';

export interface InfoSection {
  heading: string;
  body: string;
}

export interface InfoPageContent {
  title: string;
  updated?: string;
  intro?: string;
  sections: InfoSection[];
  /** Email de contacto (solo se muestra el botón en la página de ayuda). */
  contactEmail?: string;
}

export const SUPPORT_EMAIL = 'soporte@vitalbite.com';

export const INFO_PAGES: Record<InfoPageKey, InfoPageContent> = {
  help: {
    title: 'Centro de ayuda',
    intro:
      'Resolvemos las dudas más frecuentes sobre el uso de VitalBite. Si no encuentras lo que buscas, escríbenos y te ayudamos.',
    contactEmail: SUPPORT_EMAIL,
    sections: [
      {
        heading: '¿Cómo escaneo un alimento o una etiqueta?',
        body:
          'Desde el inicio, abre el escáner y elige "Etiqueta" para una tabla nutricional o "Plato" para una comida. Centra la imagen, con buena luz y sin reflejos, y toma la foto. Verás el análisis, la alineación con tu plan y recomendaciones.',
      },
      {
        heading: 'El escaneo no detecta algunos valores',
        body:
          'Acércate a la tabla nutricional para que el texto se vea grande y nítido, evita sombras y ángulos. Si un valor sigue sin aparecer, vuelve a tomar la foto; el reconocimiento mejora con imágenes más claras.',
      },
      {
        heading: '¿Dónde veo mi plan de alimentación?',
        body:
          'Tu nutricionista asigna tu plan activo. Lo encuentras en el inicio y en la sección de dieta, con tus comidas, porciones y calorías objetivo por tiempo de comida.',
      },
      {
        heading: '¿Cómo activo el ingreso con huella?',
        body:
          'Ve a Perfil → Configuración → Seguridad y activa "Autenticación biométrica". Necesitas tener una huella o rostro registrados en tu dispositivo.',
      },
      {
        heading: 'No recibo notificaciones',
        body:
          'Revisa que las notificaciones estén activadas en Perfil → Configuración y que hayas concedido el permiso del sistema a VitalBite en los ajustes de tu teléfono.',
      },
    ],
  },
  terms: {
    title: 'Términos y condiciones',
    updated: 'Junio 2026',
    intro:
      'Al usar VitalBite aceptas estos términos. Léelos con atención; describen tus derechos y responsabilidades dentro de la aplicación.',
    sections: [
      {
        heading: '1. Objeto del servicio',
        body:
          'VitalBite es una plataforma de apoyo al seguimiento nutricional que conecta a pacientes con profesionales de la nutrición. La información mostrada es de carácter orientativo y no sustituye el criterio de tu nutricionista ni una consulta médica.',
      },
      {
        heading: '2. Uso de la cuenta',
        body:
          'Eres responsable de mantener la confidencialidad de tus credenciales y de la actividad realizada desde tu cuenta. Debes proporcionar información veraz y actualizada en tu perfil.',
      },
      {
        heading: '3. Análisis de imágenes',
        body:
          'El escaneo de alimentos y etiquetas usa modelos automáticos que pueden contener imprecisiones. Las recomendaciones generadas son sugerencias y deben validarse con tu profesional de salud antes de tomar decisiones.',
      },
      {
        heading: '4. Propiedad intelectual',
        body:
          'El contenido, la marca y el software de VitalBite pertenecen a sus titulares. No está permitido copiar, redistribuir ni realizar ingeniería inversa de la aplicación sin autorización.',
      },
      {
        heading: '5. Limitación de responsabilidad',
        body:
          'VitalBite no se hace responsable de decisiones tomadas únicamente con base en la información de la app. El servicio se ofrece "tal cual", sin garantías de disponibilidad ininterrumpida.',
      },
    ],
  },
  privacy: {
    title: 'Política de privacidad',
    updated: 'Junio 2026',
    intro:
      'Tu privacidad es importante. Aquí explicamos qué datos tratamos, con qué fin y cómo los protegemos.',
    sections: [
      {
        heading: 'Datos que recopilamos',
        body:
          'Datos de tu perfil (nombre, contacto, fecha de nacimiento, objetivo), medidas corporales, plan de alimentación e imágenes que decides escanear. La biometría se procesa en tu dispositivo: VitalBite nunca recibe tu huella ni tu rostro.',
      },
      {
        heading: 'Cómo usamos tus datos',
        body:
          'Para mostrar tu plan, generar análisis y recomendaciones, coordinar tus citas y mejorar tu experiencia. Tu nutricionista accede a la información necesaria para tu seguimiento.',
      },
      {
        heading: 'Almacenamiento y seguridad',
        body:
          'La sesión y tus preferencias se guardan de forma local y cifrada en tránsito hacia nuestros servidores. Aplicamos controles de acceso por organización (multi-tenant) para aislar la información de cada clínica.',
      },
      {
        heading: 'Tus derechos',
        body:
          'Puedes acceder, corregir o solicitar la eliminación de tus datos desde la app o escribiéndonos. Atenderemos tu solicitud conforme a la normativa de protección de datos aplicable.',
      },
      {
        heading: 'Contacto',
        body:
          `Para ejercer tus derechos o resolver dudas sobre privacidad, escríbenos a ${SUPPORT_EMAIL}.`,
      },
    ],
  },
};
