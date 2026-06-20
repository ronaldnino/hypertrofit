// Hypertrofit · Plan — split Tren Superior / Tren Inferior (4 días/sem).
// Muestra la distribución de la semana, un selector de día y el detalle de la rutina
// por grupo muscular (series × reps · RPE). Solo visualización (sin logger todavía).
import React, {useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {Palette, DARK, LIGHT} from '../theme';
import {useTheme} from '../ThemeContext';
import {Screen, Pad, Eyebrow, H1, H2, Meta, Card, Hairline} from '../components/ui';
import {ExerciseIcon, PATTERN_LABEL} from '../components/ExerciseIcon';
import {TechniqueModal} from '../components/TechniqueModal';
import {
  ROUTINES,
  WEEK_SPLIT,
  routineById,
  countExercises,
  countSets,
  Prescription,
} from '../routines';

export function Plan() {
  const {scheme, t} = useTheme();
  const styles = SS[scheme];
  const [selected, setSelected] = useState(ROUTINES[0].id);
  const [active, setActive] = useState<Prescription | null>(null);
  const routine = routineById(selected) ?? ROUTINES[0];
  const kindColor = routine.kind === 'upper' ? t.cyan : t.mint;
  const exercises = countExercises(routine);
  const sets = countSets(routine);
  const minutes = Math.round(sets * 3.2); // estimación: ~3 min por serie (trabajo + descanso)

  return (
    <Screen>
      <Pad y={6}>
        <Eyebrow>MESOCICLO · HIPERTROFIA</Eyebrow>
        <H1 style={{marginTop: 8}}>PLAN</H1>
        <Meta color={t.fg2} style={{marginTop: 6}}>
          TREN SUPERIOR / INFERIOR · 4 DÍAS
        </Meta>
      </Pad>

      {/* Distribución de la semana */}
      <Pad y={18}>
        <Eyebrow style={{marginBottom: 12}}>ESTA · SEMANA</Eyebrow>
        <View style={styles.weekRow}>
          {WEEK_SPLIT.map(slot => {
            const r = slot.routineId ? routineById(slot.routineId) : null;
            const on = !!r && r.id === selected;
            const accent = r ? (r.kind === 'upper' ? t.cyan : t.mint) : t.fg3;
            return (
              <Pressable
                key={slot.day}
                disabled={!r}
                onPress={() => r && setSelected(r.id)}
                style={[
                  styles.weekCell,
                  {borderColor: on ? accent : t.line, backgroundColor: on ? t.activeRow : 'transparent'},
                ]}>
                <Text style={[styles.weekDay, {color: r ? t.fg2 : t.fg3}]} allowFontScaling={false}>
                  {slot.day}
                </Text>
                <Text style={[styles.weekTag, {color: r ? accent : t.fgMute}]} allowFontScaling={false}>
                  {r ? r.short.replace(' · ', '·') : '—'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Pad>

      {/* Selector de día (rutinas) */}
      <Pad y={4}>
        <View style={styles.chips}>
          {ROUTINES.map(r => {
            const on = r.id === selected;
            const accent = r.kind === 'upper' ? t.cyan : t.mint;
            return (
              <Pressable
                key={r.id}
                onPress={() => setSelected(r.id)}
                style={[
                  styles.chip,
                  {backgroundColor: on ? accent : 'transparent', borderColor: on ? accent : t.lineStrong},
                ]}>
                <Text
                  style={[styles.chipText, {color: on ? t.onAccent : t.fg1}]}
                  allowFontScaling={false}>
                  {r.short}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Pad>

      {/* Resumen de la rutina seleccionada */}
      <Pad y={14}>
        <Card accent={kindColor}>
          <Eyebrow color={kindColor}>
            {routine.kind === 'upper' ? 'TREN SUPERIOR' : 'TREN INFERIOR'}
          </Eyebrow>
          <H2 style={{marginTop: 10}}>{routine.title}</H2>
          <Meta color={t.fg2} style={{marginTop: 6}}>
            {routine.focus}
          </Meta>
          <Hairline style={{marginVertical: 16}} />
          <View style={styles.summary}>
            <SummaryStat t={t} val={`${exercises}`} label="EJERCICIOS" />
            <SummaryStat t={t} val={`${sets}`} label="SERIES" />
            <SummaryStat t={t} val={`~${minutes}`} label="MIN" />
            <SummaryStat t={t} val={`${routine.blocks.length}`} label="GRUPOS" />
          </View>
        </Card>
      </Pad>

      {/* Detalle por grupo muscular */}
      <Pad y={4}>
        <View style={{gap: 16}}>
          {routine.blocks.map(block => (
            <View key={block.group}>
              <View style={styles.blockHead}>
                <View style={styles.blockHeadLeft}>
                  <View style={[styles.dot, {backgroundColor: kindColor}]} />
                  <Eyebrow color={t.fg2}>{block.group}</Eyebrow>
                </View>
                <Meta color={t.fg3}>{block.items.length} EJ</Meta>
              </View>
              <Card style={{padding: 0}}>
                {block.items.map((ex, i) => (
                  <Pressable
                    key={ex.name}
                    onPress={() => setActive(ex)}
                    style={({pressed}) => [
                      styles.exRow,
                      i < block.items.length - 1 ? styles.exBorder : null,
                      pressed ? {backgroundColor: t.activeRow} : null,
                    ]}>
                    <View style={[styles.exThumb, {borderColor: t.lineStrong}]}>
                      <ExerciseIcon pattern={ex.pattern} color={kindColor} size={22} />
                    </View>
                    <View style={styles.exMid}>
                      <Text style={styles.exName} allowFontScaling={false}>
                        {ex.name}
                      </Text>
                      <Text style={[styles.exTag, {color: t.fg3}]} allowFontScaling={false}>
                        {PATTERN_LABEL[ex.pattern]}
                      </Text>
                    </View>
                    <Text style={styles.exScheme} allowFontScaling={false}>
                      {ex.sets} × {ex.reps}
                      {ex.rpe ? <Text style={{color: kindColor}}>{`\n RPE ${ex.rpe}`}</Text> : null}
                    </Text>
                    <Text style={[styles.exPlay, {color: kindColor}]} allowFontScaling={false}>
                      ▶
                    </Text>
                  </Pressable>
                ))}
              </Card>
            </View>
          ))}
        </View>
      </Pad>

      <Pad y={20}>
        <Hairline />
        <Meta color={t.fg3} style={{marginTop: 14, textAlign: 'center'}}>
          Cada tren 2× por semana · sobrecarga progresiva +2.5% / sem
        </Meta>
      </Pad>

      <TechniqueModal
        exercise={active}
        accent={kindColor}
        onClose={() => setActive(null)}
      />
    </Screen>
  );
}

function SummaryStat({t, val, label}: {t: Palette; val: string; label: string}) {
  return (
    <View style={{alignItems: 'center'}}>
      <Text style={{color: t.fg, fontSize: 20, fontWeight: '800', fontVariant: ['tabular-nums']}} allowFontScaling={false}>
        {val}
      </Text>
      <Text style={{color: t.fg3, fontSize: 8, fontWeight: '600', letterSpacing: 1.6, marginTop: 4}} allowFontScaling={false}>
        {label}
      </Text>
    </View>
  );
}

const makeStyles = (t: Palette) =>
  StyleSheet.create({
    weekRow: {
      flexDirection: 'row',
      gap: 5,
    },
    weekCell: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 2,
      paddingVertical: 10,
      alignItems: 'center',
      gap: 6,
    },
    weekDay: {
      fontSize: 9,
      fontWeight: '700',
      letterSpacing: 1,
    },
    weekTag: {
      fontSize: 8,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    chips: {
      flexDirection: 'row',
      gap: 8,
    },
    chip: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 2,
      paddingVertical: 10,
      alignItems: 'center',
    },
    chipText: {
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1.6,
    },
    summary: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    blockHead: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    blockHeadLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 999,
    },
    exRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 12,
      paddingHorizontal: 14,
    },
    exBorder: {
      borderBottomWidth: 1,
      borderBottomColor: t.line,
    },
    exThumb: {
      width: 38,
      height: 38,
      borderWidth: 1,
      borderRadius: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    exMid: {
      flex: 1,
    },
    exName: {
      color: t.fg,
      fontSize: 14,
      fontWeight: '600',
      letterSpacing: 0.4,
    },
    exTag: {
      fontSize: 8,
      fontWeight: '600',
      letterSpacing: 1.4,
      marginTop: 3,
    },
    exScheme: {
      color: t.fg2,
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 0.6,
      textAlign: 'right',
      fontVariant: ['tabular-nums'],
    },
    exPlay: {
      fontSize: 9,
      marginLeft: 10,
      opacity: 0.7,
    },
  });

const SS = {dark: makeStyles(DARK), light: makeStyles(LIGHT)};
