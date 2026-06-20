// Hypertrofit · esquema de color activo (oscuro / claro).
// Arranca siguiendo el sistema y se puede alternar manualmente desde la barra de marca.
import React, {createContext, useContext, useState} from 'react';
import {useColorScheme} from 'react-native';
import {Palette, Scheme, PALETTES, DARK} from './theme';

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
  const [scheme, setScheme] = useState<Scheme>(system === 'light' ? 'light' : 'dark');
  const t = PALETTES[scheme];
  const toggle = () => setScheme(s => (s === 'dark' ? 'light' : 'dark'));
  return (
    <Ctx.Provider value={{scheme, t, toggle, setScheme}}>{children}</Ctx.Provider>
  );
}

export const useTheme = () => useContext(Ctx);
