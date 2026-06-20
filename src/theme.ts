// Hypertrofit · design tokens. Two schemes from the same flat, technical language:
//   DARK  → carbon canvas (#0A0A0A) + bright cyan/mint signal (the original system)
//   LIGHT → paper canvas + deeper cyan/mint signal tuned for contrast on white
// No gradients, no shadows. Accents are referenced by name so data stays theme-agnostic.

export type Palette = {
  bg: string;
  surface1: string;
  surface2: string;
  surface3: string;
  line: string;
  lineStrong: string;
  fg: string;
  fg1: string;
  fg2: string;
  fg3: string;
  fgMute: string;
  cyan: string;
  mint: string;
  blue: string;
  warn: string;
  danger: string;
  activeRow: string;
  // text/icon color that sits on top of a filled accent (buttons, active chips)
  onAccent: string;
};

export const DARK: Palette = {
  bg: '#0A0A0A',
  surface1: '#111111',
  surface2: '#1A1A1A',
  surface3: '#232323',
  line: '#1F1F1F',
  lineStrong: '#2E2E2E',
  fg: '#FFFFFF',
  fg1: '#C0C0C0',
  fg2: '#8A8A8A',
  fg3: '#5A5A5A',
  fgMute: '#3A3A3A',
  cyan: '#00FFFF',
  mint: '#98FF98',
  blue: '#00E5FF',
  warn: '#FFCC00',
  danger: '#FF4040',
  activeRow: '#0D1717',
  onAccent: '#0A0A0A',
};

export const LIGHT: Palette = {
  bg: '#F5F5F3',
  surface1: '#FFFFFF',
  surface2: '#ECECE9',
  surface3: '#E0E0DC',
  line: '#E3E3DF',
  lineStrong: '#CBCBC4',
  fg: '#0A0A0A',
  fg1: '#272727',
  fg2: '#565656',
  fg3: '#8C8C8C',
  fgMute: '#BEBEB8',
  cyan: '#0094A8',
  mint: '#1F9D57',
  blue: '#0077C2',
  warn: '#A8780A',
  danger: '#D23B3B',
  activeRow: '#E3F6F8',
  onAccent: '#FFFFFF',
};

export type Scheme = 'dark' | 'light';
export const PALETTES: Record<Scheme, Palette> = {dark: DARK, light: LIGHT};

// Accent keys usable from theme-agnostic data (rosters, dashboards…).
export type AccentKey = keyof Palette;

// Backward-compatible default (dark). New code should use useTheme() instead.
export const HT = DARK;

// Geometric sans. Montserrat isn't bundled yet, so we fall back to the system
// font (System on iOS, sans-serif on Android).
export const FONT = undefined;

// 4pt spacing scale
export const S = {
  s0: 0,
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 20,
  s6: 24,
  s8: 32,
  s10: 40,
  s12: 48,
  s16: 64,
  s20: 80,
} as const;

// Radii — surgical. Max 4px or zero.
export const R = {
  r0: 0,
  r1: 2,
  r2: 4,
  full: 999,
} as const;
