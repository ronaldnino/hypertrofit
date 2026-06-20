// Hypertrofit · line icon set — ported from Components.jsx Icon map to react-native-svg.
import React from 'react';
import Svg, {Path, Rect, Circle} from 'react-native-svg';
import {HT} from '../theme';

type IconProps = {color?: string; size?: number};

const sw = 1.6;

export const Icon = {
  home: ({color = HT.fg1, size = 22}: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw}>
      <Path d="M3 12 12 4l9 8" />
      <Path d="M5 10v10h14V10" />
    </Svg>
  ),
  plan: ({color = HT.fg1, size = 22}: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw}>
      <Rect x="3" y="5" width="18" height="14" />
      <Path d="M3 9h18M8 5v14" />
    </Svg>
  ),
  timer: ({color = HT.fg1, size = 22}: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw}>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 7v5l3 3" />
    </Svg>
  ),
  stats: ({color = HT.fg1, size = 22}: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw}>
      <Path d="M4 19V9M10 19V5M16 19v-7M22 19v-3" />
    </Svg>
  ),
  user: ({color = HT.fg1, size = 22}: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw}>
      <Circle cx="12" cy="8" r="4" />
      <Path d="M4 20c1-4 5-6 8-6s7 2 8 6" />
    </Svg>
  ),
  back: ({color = HT.fg1, size = 20}: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw}>
      <Path d="M19 12H5M12 5l-7 7 7 7" />
    </Svg>
  ),
  next: ({color = HT.fg1, size = 20}: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw}>
      <Path d="M5 12h14M12 5l7 7-7 7" />
    </Svg>
  ),
  check: ({color = HT.fg1, size = 18}: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M4 12l5 5L20 6" />
    </Svg>
  ),
  more: ({color = HT.fg1, size = 20}: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw}>
      <Circle cx="5" cy="12" r="1.4" />
      <Circle cx="12" cy="12" r="1.4" />
      <Circle cx="19" cy="12" r="1.4" />
    </Svg>
  ),
  star: ({color = HT.fg1, size = 16}: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw}>
      <Path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
    </Svg>
  ),
  sun: ({color = HT.fg1, size = 20}: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw}>
      <Circle cx="12" cy="12" r="4" />
      <Path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
    </Svg>
  ),
  moon: ({color = HT.fg1, size = 20}: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw}>
      <Path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </Svg>
  ),
};

export type IconName = keyof typeof Icon;
