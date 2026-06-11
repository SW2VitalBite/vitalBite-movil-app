import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Preferencias locales de la app (notificaciones, seguridad). Se persisten en
 * AsyncStorage para que sobrevivan a reinicios y las consuman otras pantallas
 * (p. ej. el gate biométrico de ingreso).
 */
export interface AppSettings {
  notifAppointments: boolean;
  notifDiet: boolean;
  notifReport: boolean;
  biometricEnabled: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  notifAppointments: true,
  notifDiet: true,
  notifReport: false,
  biometricEnabled: false,
};

const STORAGE_KEY = 'appSettings';

/** Lee las preferencias directamente (útil fuera de React, p. ej. en el gate). */
export async function loadSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

interface SettingsContextValue {
  settings: AppSettings;
  ready: boolean;
  setSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      setSettings(await loadSettings());
      setReady(true);
    })();
  }, []);

  const setSetting = async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Persistencia best-effort; el estado en memoria ya quedó actualizado.
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, ready, setSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
