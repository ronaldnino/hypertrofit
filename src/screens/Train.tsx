// Hypertrofit · Entrenar (in-shell). Despacha por rol:
//   atleta    → preparación de la sesión de hoy + Iniciar Sesión (abre el logger fullscreen)
//   entrenador → seguimiento de sesiones de sus atletas (en vivo / programadas / completadas)
//   gym        → actividad en vivo del centro
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Palette, DARK, LIGHT} from '../theme';
import {useTheme} from '../ThemeContext';
import {
  Screen,
  Pad,
  Eyebrow,
  H1,
  H2,
  Meta,
  Num,
  Card,
  Button,
  Hairline,
} from '../components/ui';
import {DashHeader, KpiRow, FeedSection} from '../components/Dashboard';
import {useRole} from '../RoleContext';
import {useRoutines} from '../RoutinesContext';
import {countExercises, countSets} from '../routines';
import {flattenExercises} from '../workout';
import {TRAIN_DASH, FeedItem} from '../dashboards';

export function Train({onStart}: {onStart: () => void}) {
  const {role} = useRole();
  const dash = TRAIN_DASH[role];

  if (dash) {
    // Entrenador / gym: al tocar una sesión en vivo se abre el logger (vista de esa sesión).
    const openLive = (item: FeedItem) => {
      if (item.live) onStart();
    };
    return (
      <Screen>
        <DashHeader eyebrow={dash.eyebrow} title={dash.title} />
        <KpiRow kpis={dash.kpis} />
        {dash.sections.map(s => (
          <FeedSection key={s.title} section={s} onItemPress={openLive} />
        ))}
      </Screen>
    );
  }

  return <AthleteTrain onStart={onStart} />;
}

function AthleteTrain({onStart}: {onStart: () => void}) {
  const {scheme, t} = useTheme();
  const styles = SS[scheme];
  const {todays} = useRoutines();
  const routine = todays();
  const accent = routine ? (routine.kind === 'upper' ? t.cyan : t.mint) : t.cyan;
  const exercises = routine ? flattenExercises(routine) : [];
  const minutes = routine ? Math.round(countSets(routine) * 3.2) : 0;

  return (
    <Screen>
      <Pad y={6}>
        <Eyebrow>{routine ? routine.short : 'DESCANSO'} · MESOCICLO · HIPERTROFIA</Eyebrow>
        <H1 style={{marginTop: 8}}>ENTRENAR</H1>
      </Pad>

      <Pad y={18}>
        <Card style={{padding: 22}}>
          <Eyebrow color={accent}>{routine ? 'SESIÓN DE HOY' : 'DÍA DE DESCANSO'}</Eyebrow>
          <H2 style={{marginTop: 10}}>{routine ? routine.title : 'Recuperación'}</H2>
          <Meta style={{marginTop: 8}}>
            {routine
              ? `${countExercises(routine)} EJERCICIOS · ~${minutes} MIN`
              : 'Sin sesión programada'}
          </Meta>
          <Hairline style={{marginVertical: 18}} />
          <View style={styles.foot}>
            <View>
              <Eyebrow color={t.fg3}>SERIES</Eyebrow>
              <Num size={28} style={{marginTop: 6}}>
                {routine ? countSets(routine) : 0}
              </Num>
            </View>
            <Button kind={routine ? (routine.kind === 'upper' ? 'primary' : 'mint') : 'ghost'} onPress={() => onStart()}>
              {routine ? 'Iniciar Sesión' : 'Entrenar igual'}
            </Button>
          </View>
        </Card>
      </Pad>

      {routine ? (
        <Pad y={6}>
          <Eyebrow style={{marginBottom: 12}}>PLAN · DE HOY</Eyebrow>
          <Card style={{padding: 0}}>
            {exercises.map((e, i) => (
              <View
                key={e.name}
                style={[styles.exRow, i < exercises.length - 1 ? styles.rowBorder : null]}>
                <View style={styles.exNum}>
                  <Eyebrow color={t.fg3}>{String(i + 1).padStart(2, '0')}</Eyebrow>
                </View>
                <View style={{flex: 1}}>
                  <H2 style={{fontSize: 15}}>{e.name}</H2>
                  <Meta color={t.fg3} style={{marginTop: 4}}>
                    {e.sets} × {e.reps}
                    {e.rpe ? ` · RPE ${e.rpe}` : ''}
                  </Meta>
                </View>
              </View>
            ))}
          </Card>
        </Pad>
      ) : null}

      <Pad y={20}>
        <Button
          kind={routine ? (routine.kind === 'upper' ? 'primary' : 'mint') : 'ghost'}
          full
          onPress={() => onStart()}>
          {routine ? 'Iniciar Sesión' : 'Entrenar igual'}
        </Button>
      </Pad>
    </Screen>
  );
}

const makeStyles = (t: Palette) =>
  StyleSheet.create({
  foot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: t.line,
  },
  exNum: {
    width: 28,
    alignItems: 'center',
  },
});

const SS = {dark: makeStyles(DARK), light: makeStyles(LIGHT)};
