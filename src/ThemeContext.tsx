// Hypertrofit · esquema de color activo (oscuro / claro).
// El modo lo decide SettingsContext (`system` | `light` | `dark`, persistido):
//   - `system` sigue el esquema del dispositivo
//   - `light` / `dark` lo fuerzan
// El toggle de la barra de marca alterna a un modo explícito opuesto al actual.
import React, {createContext, useContext} from 'react';
import {useColorScheme} from 'react-native';
import {Palette, Scheme, PALETTES, DARK} from './theme';
import {useSettings} from './SettingsContext';

type ThemeCtx = {
  scheme: Scheme;
  t: Palette;
  toggle: () => void;
  setScheme: (s: Scheme) => void;
};

const Ctx = createContext<ThemeCtx>({
  scheme: 'dark',
  t: DARK,
  toggle: () => {},
  setScheme: () => {},
});

export function ThemeProvider({children}: {children: React.ReactNode}) {
  const system = useColorScheme();
  const {settings, setThemeMode} = useSettings();
  const scheme: Scheme =
    settings.themeMode === 'system'
      ? system === 'light'
        ? 'light'
        : 'dark'
      : settings.themeMode;
  const t = PALETTES[scheme];
  const toggle = () => setThemeMode(scheme === 'dark' ? 'light' : 'dark');
  const setScheme = (s: Scheme) => setThemeMode(s);
  return (
    <Ctx.Provider value={{scheme, t, toggle, setScheme}}>{children}</Ctx.Provider>
  );
}

export const useTheme = () => useContext(Ctx);
