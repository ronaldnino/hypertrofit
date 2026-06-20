// Hypertrofit · persistencia ligera sobre AsyncStorage (JSON por clave).
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function saveJSON<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // best-effort: si falla el guardado, la app sigue con el estado en memoria
  }
}

export const KEYS = {
  sessions: 'ht.sessions.v1',
  routines: 'ht.routines.v1',
  settings: 'ht.settings.v1',
} as const;
