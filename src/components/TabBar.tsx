// Hypertrofit · bottom navigation — 5 flat tabs, cyan active signal. Theme-aware.
import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Palette, DARK, LIGHT} from '../theme';
import {useTheme} from '../ThemeContext';
import {Icon, IconName} from './Icon';

export type TabKey = 'today' | 'plan' | 'session' | 'stats' | 'you';

const TABS: {key: TabKey; icon: IconName; label: string}[] = [
  {key: 'today', icon: 'home', label: 'Hoy'},
  {key: 'plan', icon: 'plan', label: 'Plan'},
  {key: 'session', icon: 'timer', label: 'Entrenar'},
  {key: 'stats', icon: 'stats', label: 'Progreso'},
  {key: 'you', icon: 'user', label: 'Tú'},
];

export function TabBar({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (k: TabKey) => void;
}) {
  const insets = useSafeAreaInsets();
  const {scheme, t} = useTheme();
  const styles = SS[scheme];
  return (
    <View style={[styles.bar, {paddingBottom: Math.max(insets.bottom, 8)}]}>
      {TABS.map(tab => {
        const on = tab.key === active;
        const color = on ? t.cyan : t.fg3;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={styles.tab}>
            {on ? <View style={styles.activeMark} /> : null}
            {Icon[tab.icon]({color, size: 22})}
            <Text style={[styles.label, {color}]} allowFontScaling={false}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const makeStyles = (t: Palette) =>
  StyleSheet.create({
    bar: {
      flexDirection: 'row',
      backgroundColor: t.surface1,
      borderTopWidth: 1,
      borderTopColor: t.line,
      paddingTop: 10,
      paddingHorizontal: 8,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      paddingVertical: 2,
    },
    activeMark: {
      position: 'absolute',
      top: -10,
      width: 28,
      height: 2,
      backgroundColor: t.cyan,
    },
    label: {
      fontSize: 9,
      fontWeight: '700',
      letterSpacing: 1.4,
      textTransform: 'uppercase',
    },
  });

const SS = {dark: makeStyles(DARK), light: makeStyles(LIGHT)};
