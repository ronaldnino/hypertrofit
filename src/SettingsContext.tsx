// Hypertrofit · preferencias de la app (tema, unidades, descanso), persistidas.
// Se sitúa POR ENCIMA de ThemeProvider para poder dirigir el esquema de color.
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {Units} from './units';
import {loadJSON, saveJSON, KEYS} from './storage';

export type ThemeMode = 'system' | 'light' | 'dark';

export type Settings = {
  themeMode: ThemeMode;
  units: Units;
  restDefault: number; // segundos
};

const DEFAULTS: Settings = {
  themeMode: 'system',
  units: 'kg',
  restDefault: 90,
};

type SettingsCtx = {
  ready: boolean;
  settings: Settings;
  setThemeMode: (m: ThemeMode) => void;
  setUnits: (u: Units) => void;
  setRestDefault: (s: number) => void;
};

const Ctx = createContext<SettingsCtx | null>(null);

export function SettingsProvider({children}: {children: React.ReactNode}) {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  useEffect(() => {
    let alive = true;
    loadJSON<Partial<Settings>>(KEYS.settings, {}).then(data => {
      if (alive) {
        setSettings({...DEFAULTS, ...data});
        setReady(true);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (ready) saveJSON(KEYS.settings, settings);
  }, [settings, ready]);

  const setThemeMode = useCallback(
    (themeMode: ThemeMode) => setSettings(s => ({...s, themeMode})),
    [],
  );
  const setUnits = useCallback(
    (units: Units) => setSettings(s => ({...s, units})),
    [],
  );
  const setRestDefault = useCallback(
    (restDefault: number) => setSettings(s => ({...s, restDefault})),
    [],
  );

  return (
    <Ctx.Provider value={{ready, settings, setThemeMode, setUnits, setRestDefault}}>
      {children}
    </Ctx.Provider>
  );
}

export function useSettings(): SettingsCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useSettings debe usarse dentro de SettingsProvider');
  return v;
}
