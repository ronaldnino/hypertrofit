// Hypertrofit · Plan — 12-week program overview. Ported from ui_kits/mobile/PlanYouScreens.jsx.
import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {Palette, AccentKey, DARK, LIGHT} from '../theme';
import {useTheme} from '../ThemeContext';
import {Screen, Pad, Eyebrow, H1, Meta, Card, Button} from '../components/ui';
import {Icon} from '../components/Icon';

const PHASES: {name: string; weeks: number; done: number; color: AccentKey; current: boolean}[] = [
  {name: 'ACUMULACIÓN', weeks: 4, done: 4, color: 'fg3', current: false},
  {name: 'INTENSIFICACIÓN', weeks: 4, done: 3, color: 'cyan', current: true},
  {name: 'REALIZACIÓN', weeks: 3, done: 0, color: 'fg3', current: false},
  {name: 'DESCARGA', weeks: 1, done: 0, color: 'fg3', current: false},
];

type Status = 'done' | 'rest' | 'today' | 'planned';
const SESSIONS: {day: string; name: string; status: Status; focus: string}[] = [
  {day: 'LUN', name: 'Tirón · A', status: 'done', focus: 'ESPALDA / BÍCEPS'},
  {day: 'MAR', name: 'Descanso', status: 'rest', focus: 'CAMINATA · 40 MIN'},
  {day: 'MIÉ', name: 'Pierna · A', status: 'done', focus: 'SENTADILLA / BISAGRA'},
  {day: 'JUE', name: 'Descanso', status: 'rest', focus: 'MOVILIDAD'},
  {day: 'VIE', name: 'Empuje · A', status: 'today', focus: 'BANCA / MILITAR'},
  {day: 'SÁB', name: 'Pierna · B', status: 'planned', focus: 'DEADLIFT'},
  {day: 'DOM', name: 'Descanso', status: 'rest', focus: 'DESCANSO TOTAL'},
];

export function Plan({onOpenSession}: {onOpenSession: () => void}) {
  const {scheme, t} = useTheme();
  const styles = SS[scheme];
  return (
    <Screen>
      <Pad y={6}>
        <Eyebrow>BLOQUE 02 · 12 SEMANAS</Eyebrow>
        <H1 style={{marginTop: 8}}>{'HIPERTROFIA\n+ FUERZA'}</H1>
      </Pad>

      {/* Block progression */}
      <Pad y={18}>
        <Card style={{padding: 18}}>
          <View style={styles.blockHead}>
            <Eyebrow color={t.fg2}>BLOQUE · PROGRESIÓN</Eyebrow>
            <Meta color={t.cyan}>SEMANA 07 / 12</Meta>
          </View>
          <View style={styles.phaseBar}>
            {PHASES.map((p, i) => (
              <View key={i} style={[styles.phaseGroup, {flex: p.weeks}]}>
                {Array.from({length: p.weeks}).map((_, j) => {
                  const filled = j < p.done;
                  const cur = p.current && j === p.done;
                  return (
                    <View
                      key={j}
                      style={[
                        styles.phaseCell,
                        {backgroundColor: cur ? t.fg : filled ? t[p.color] : t.surface2},
                      ]}
                    />
                  );
                })}
              </View>
            ))}
          </View>
          <View style={styles.phaseLabels}>
            {PHASES.map((p, i) => (
              <View key={i} style={{flex: p.weeks}}>
                <Eyebrow color={p.current ? t.cyan : t.fg3} style={{fontSize: 8}}>
                  {p.name}
                </Eyebrow>
              </View>
            ))}
          </View>
        </Card>
      </Pad>

      {/* This week */}
      <Pad y={6}>
        <Eyebrow style={{marginBottom: 12}}>ESTA · SEMANA</Eyebrow>
        <Card style={{padding: 0}}>
          {SESSIONS.map((s, i) => {
            const isToday = s.status === 'today';
            const isRest = s.status === 'rest';
            const isDone = s.status === 'done';
            const dayColor = isToday ? t.cyan : isDone ? t.fg : t.fg3;
            const nameColor = isRest ? t.fg3 : isToday ? t.fg : t.fg1;
            return (
              <Pressable
                key={i}
                onPress={isToday ? onOpenSession : undefined}
                style={[
                  styles.sessionRow,
                  i < SESSIONS.length - 1 ? styles.rowBorder : null,
                  {backgroundColor: isToday ? t.activeRow : 'transparent'},
                ]}>
                {isToday ? <View style={styles.activeAccent} /> : null}
                <Text style={[styles.day, {color: dayColor}]} allowFontScaling={false}>
                  {s.day}
                </Text>
                <View style={{flex: 1}}>
                  <Text style={[styles.sessionName, {color: nameColor}]} allowFontScaling={false}>
                    {s.name}
                  </Text>
                  <Meta color={t.fg3} style={{marginTop: 4}}>
                    {s.focus}
                  </Meta>
                </View>
                <View style={styles.rowEnd}>
                  {isDone ? Icon.check({color: t.mint, size: 18}) : null}
                  {isToday ? Icon.next({color: t.cyan, size: 18}) : null}
                  {isRest ? <Meta color={t.fg3}>—</Meta> : null}
                  {s.status === 'planned' ? Icon.next({color: t.fg3, size: 18}) : null}
                </View>
              </Pressable>
            );
          })}
        </Card>
      </Pad>

      <Pad y={20}>
        <Button kind="ghost" full>
          Ver Programa Completo
        </Button>
      </Pad>
    </Screen>
  );
}

const makeStyles = (t: Palette) =>
  StyleSheet.create({
  blockHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  phaseBar: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 14,
    height: 22,
  },
  phaseGroup: {
    flexDirection: 'row',
    gap: 2,
  },
  phaseCell: {
    flex: 1,
  },
  phaseLabels: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 8,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: t.line,
  },
  activeAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: t.cyan,
  },
  day: {
    width: 40,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  sessionName: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.9,
  },
  rowEnd: {
    minWidth: 20,
    alignItems: 'flex-end',
  },
});

const SS = {dark: makeStyles(DARK), light: makeStyles(LIGHT)};
