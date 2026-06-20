// Hypertrofit · UI kit primitives. Theme-aware: styles are precomputed per scheme
// (dark/light) at module load and selected at render — no per-render StyleSheet cost.
import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import {Palette, DARK, LIGHT, R} from '../theme';
import {useTheme} from '../ThemeContext';

type Children = {children?: React.ReactNode};

// ────────── Type helpers ──────────

export function Eyebrow({
  children,
  color,
  style,
}: Children & {color?: string; style?: StyleProp<TextStyle>}) {
  const {scheme, t} = useTheme();
  return (
    <Text style={[SS[scheme].eyebrow, {color: color ?? t.fg2}, style]} allowFontScaling={false}>
      {children}
    </Text>
  );
}

export function H1({children, style}: Children & {style?: StyleProp<TextStyle>}) {
  const {scheme} = useTheme();
  return (
    <Text style={[SS[scheme].h1, style]} allowFontScaling={false}>
      {children}
    </Text>
  );
}

export function H2({
  children,
  color,
  style,
}: Children & {color?: string; style?: StyleProp<TextStyle>}) {
  const {scheme, t} = useTheme();
  return (
    <Text style={[SS[scheme].h2, {color: color ?? t.fg}, style]} allowFontScaling={false}>
      {children}
    </Text>
  );
}

export function Meta({
  children,
  color,
  style,
}: Children & {color?: string; style?: StyleProp<TextStyle>}) {
  const {scheme, t} = useTheme();
  return (
    <Text style={[SS[scheme].meta, {color: color ?? t.fg2}, style]} allowFontScaling={false}>
      {children}
    </Text>
  );
}

export function Num({
  children,
  size = 56,
  color,
  style,
}: Children & {size?: number; color?: string; style?: StyleProp<TextStyle>}) {
  const {scheme, t} = useTheme();
  return (
    <Text
      style={[
        SS[scheme].num,
        {fontSize: size, color: color ?? t.fg, letterSpacing: size * -0.01},
        style,
      ]}
      allowFontScaling={false}>
      {children}
    </Text>
  );
}

// Inline unit suffix used inside <Num> (e.g. 4,260 KG)
export function Unit({children}: Children) {
  const {scheme} = useTheme();
  return <Text style={SS[scheme].unit}>{children}</Text>;
}

// ────────── Surfaces ──────────

export function Screen({
  children,
  padTop = 12,
  padBottom = 112,
}: Children & {padTop?: number; padBottom?: number}) {
  const {t} = useTheme();
  return (
    <ScrollView
      style={{backgroundColor: t.bg}}
      contentContainerStyle={{paddingTop: padTop, paddingBottom: padBottom}}
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

export function Pad({
  children,
  x = 20,
  y = 0,
  style,
}: Children & {x?: number; y?: number; style?: StyleProp<ViewStyle>}) {
  return (
    <View style={[{paddingHorizontal: x, paddingVertical: y}, style]}>
      {children}
    </View>
  );
}

export function Hairline({
  color,
  style,
}: {color?: string; style?: StyleProp<ViewStyle>}) {
  const {t} = useTheme();
  return <View style={[{height: 1, backgroundColor: color ?? t.line}, style]} />;
}

// ────────── Buttons ──────────

type ButtonKind = 'primary' | 'mint' | 'secondary' | 'ghost' | 'danger';

function buttonVariant(t: Palette, kind: ButtonKind) {
  switch (kind) {
    case 'mint':
      return {bg: t.mint, fg: t.onAccent, border: t.mint};
    case 'secondary':
      return {bg: 'transparent', fg: t.blue, border: t.blue};
    case 'ghost':
      return {bg: 'transparent', fg: t.fg1, border: t.lineStrong};
    case 'danger':
      return {bg: 'transparent', fg: t.danger, border: t.danger};
    case 'primary':
    default:
      return {bg: t.cyan, fg: t.onAccent, border: t.cyan};
  }
}

export function Button({
  children,
  kind = 'primary',
  full,
  onPress,
  style,
}: Children & {
  kind?: ButtonKind;
  full?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const {scheme, t} = useTheme();
  const v = buttonVariant(t, kind);
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        SS[scheme].button,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          alignSelf: full ? 'stretch' : 'flex-start',
          width: full ? '100%' : undefined,
          opacity: pressed ? 0.75 : 1,
        },
        style,
      ]}>
      <Text style={[SS[scheme].buttonLabel, {color: v.fg}]} allowFontScaling={false}>
        {children}
      </Text>
    </Pressable>
  );
}

export function IconButton({
  children,
  onPress,
  size = 40,
  borderColor,
  style,
}: Children & {
  onPress?: () => void;
  size?: number;
  borderColor?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const {scheme, t} = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        SS[scheme].iconButton,
        {width: size, height: size, borderColor: borderColor ?? t.lineStrong, opacity: pressed ? 0.6 : 1},
        style,
      ]}>
      {children}
    </Pressable>
  );
}

// ────────── Card ──────────

export function Card({
  children,
  accent,
  onPress,
  style,
}: Children & {
  accent?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const {scheme} = useTheme();
  const styles = SS[scheme];
  const inner = (
    <>
      {accent ? (
        <View style={[styles.cardAccent, {backgroundColor: accent}]} />
      ) : null}
      {children}
    </>
  );
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({pressed}) => [styles.card, {opacity: pressed ? 0.85 : 1}, style]}>
        {inner}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{inner}</View>;
}

// ────────── Progress ──────────

export function Bar({
  value = 0,
  color,
  height = 4,
}: {value?: number; color?: string; height?: number}) {
  const {t} = useTheme();
  return (
    <View style={{height, backgroundColor: t.surface2, borderRadius: 2, overflow: 'hidden'}}>
      <View
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          height: '100%',
          backgroundColor: color ?? t.cyan,
        }}
      />
    </View>
  );
}

export function Ring({
  value = 0,
  size = 90,
  color,
  label,
  sub,
}: {
  value?: number;
  size?: number;
  color?: string;
  label?: string;
  sub?: string;
}) {
  const {scheme, t} = useTheme();
  const r = 42;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(100, value)) / 100);
  return (
    <View style={{width: size, height: size, alignItems: 'center', justifyContent: 'center'}}>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{position: 'absolute', transform: [{rotate: '-90deg'}]}}>
        <Circle cx="50" cy="50" r={r} stroke={t.surface2} strokeWidth={6} fill="none" />
        <Circle
          cx="50"
          cy="50"
          r={r}
          stroke={color ?? t.cyan}
          strokeWidth={6}
          fill="none"
          strokeDasharray={`${c}`}
          strokeDashoffset={off}
          strokeLinecap="butt"
        />
      </Svg>
      <Text style={SS[scheme].ringLabel} allowFontScaling={false}>
        {label}
      </Text>
      {sub ? (
        <Eyebrow color={t.fg2} style={{fontSize: 9, marginTop: 4}}>
          {sub}
        </Eyebrow>
      ) : null}
    </View>
  );
}

// ────────── Chip ──────────

export function Chip({
  children,
  active,
  color,
  onPress,
}: Children & {active?: boolean; color?: string; onPress?: () => void}) {
  const {scheme, t} = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        SS[scheme].chip,
        {
          backgroundColor: active ? t.cyan : 'transparent',
          borderColor: active ? t.cyan : t.lineStrong,
        },
      ]}>
      <Text
        style={[SS[scheme].chipLabel, {color: active ? t.onAccent : color ?? t.fg1}]}
        allowFontScaling={false}>
        {children}
      </Text>
    </Pressable>
  );
}

// ────────── Stepper ──────────

export function Stepper({
  value,
  onChange,
  step = 2.5,
  decimals = 1,
  suffix,
  compact,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  decimals?: number;
  suffix?: string;
  compact?: boolean;
}) {
  const {scheme} = useTheme();
  const styles = SS[scheme];
  const v = decimals ? Number(value).toFixed(decimals) : String(value);
  const btnW = compact ? 34 : 44;
  return (
    <View style={styles.stepper}>
      <Pressable
        onPress={() => onChange(value - step)}
        style={({pressed}) => [styles.stepperBtn, {width: btnW, opacity: pressed ? 0.5 : 1}]}>
        <Text style={[styles.stepperSign, {fontSize: compact ? 18 : 22}]} allowFontScaling={false}>
          −
        </Text>
      </Pressable>
      <View style={styles.stepperValue}>
        <Text style={[styles.stepperValueText, {fontSize: compact ? 15 : 17}]} allowFontScaling={false}>
          {v}
          {suffix ? <Text style={styles.stepperSuffix}>{` ${suffix}`}</Text> : null}
        </Text>
      </View>
      <Pressable
        onPress={() => onChange(value + step)}
        style={({pressed}) => [styles.stepperBtn, {width: btnW, opacity: pressed ? 0.5 : 1}]}>
        <Text style={[styles.stepperSign, {fontSize: compact ? 18 : 22}]} allowFontScaling={false}>
          +
        </Text>
      </Pressable>
    </View>
  );
}

const makeStyles = (t: Palette) =>
  StyleSheet.create({
    eyebrow: {
      fontSize: 10,
      fontWeight: '600',
      letterSpacing: 2.2,
      textTransform: 'uppercase',
    },
    h1: {
      fontSize: 28,
      fontWeight: '800',
      color: t.fg,
      letterSpacing: 2,
      textTransform: 'uppercase',
      lineHeight: 30,
    },
    h2: {
      fontSize: 18,
      fontWeight: '700',
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      lineHeight: 22,
    },
    meta: {
      fontSize: 11,
      fontWeight: '500',
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },
    num: {
      fontWeight: '800',
      fontVariant: ['tabular-nums'],
    },
    unit: {
      fontSize: 13,
      color: t.fg2,
      fontWeight: '500',
    },
    button: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderWidth: 1,
      borderRadius: R.r2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonLabel: {
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 1.8,
      textTransform: 'uppercase',
    },
    iconButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderRadius: R.r2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      backgroundColor: t.surface1,
      borderWidth: 1,
      borderColor: t.line,
      borderRadius: R.r2,
      padding: 18,
      position: 'relative',
      overflow: 'hidden',
    },
    cardAccent: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 2,
    },
    ringLabel: {
      color: t.fg,
      fontWeight: '800',
      fontSize: 22,
      fontVariant: ['tabular-nums'],
    },
    chip: {
      borderWidth: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: R.r1,
    },
    chipLabel: {
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 2.2,
      textTransform: 'uppercase',
    },
    stepper: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: t.lineStrong,
      borderRadius: R.r1,
      alignItems: 'stretch',
      width: '100%',
      overflow: 'hidden',
    },
    stepperBtn: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
    },
    stepperSign: {
      color: t.fg,
      fontWeight: '600',
    },
    stepperValue: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: t.lineStrong,
    },
    stepperValueText: {
      color: t.fg,
      fontWeight: '700',
      fontVariant: ['tabular-nums'],
    },
    stepperSuffix: {
      color: t.fg3,
      fontSize: 11,
      letterSpacing: 1.4,
    },
  });

const SS = {dark: makeStyles(DARK), light: makeStyles(LIGHT)};
