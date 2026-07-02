// Hypertrofit · Today — daily dashboard. Ported from ui_kits/mobile/TodayScreen.jsx.
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
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
  Unit,
  Card,
  Ring,
  Button,
  Hairline,
} from '../components/ui';
import {DashHeader, KpiRow, FeedSection} from '../components/Dashboard';
import {useRole} from '../RoleContext';
import {useWorkouts} from '../WorkoutContext';
import {useRoutines} from '../RoutinesContext';
import {WEEK_SPLIT, countExercises, countSets} from '../routines';
import {sessionVolume, sessionSets} from '../workout';
import {TODAY_DASH} from '../dashboards';

const WEEK = ['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'];
const DOW_FULL = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
const MON = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const fmtDate = (ms: number) => {
  const d = new Date(ms);
  return `${DOW_FULL[d.getDay()].slice(0, 3)} · ${MON[d.getMonth()]} ${d.getDate()}`;
};

// Racha de días consecutivos con sesión (cuenta hacia atrás desde hoy o ayer).
const computeStreak = (dates: number[], now: Date): number => {
  const trained = (d: Date) => dates.some(ms => sameDay(new Date(ms), d));
  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);
  if (!trained(cursor)) cursor.setDate(cursor.getDate() - 1);
  let n = 0;
  while (trained(cursor)) {
    n += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return n;
};

// Despacha la vista de Hoy según el tipo de usuario.
export function Today({onStart}: {onStart: () => void}) {
  const {role} = useRole();
  const dash = TODAY_DASH[role];
  if (dash) {
    const now = new Date();
    const eyebrow = `${DOW_FULL[now.getDay()].slice(0, 3)} · ${MON[now.getMonth()]} ${now.getDate()} · ${dash.eyebrow}`;
    return (
      <Screen>
        <DashHeader eyebrow={eyebrow} title={dash.title} />
        <KpiRow kpis={dash.kpis} />
        {dash.sections.map(s => (
          <FeedSection key={s.title} section={s} />
        ))}
      </Screen>
    );
  }
  return <AthleteToday onStart={onStart} />;
}

function AthleteToday({onStart}: {onStart: () => void}) {
  const {scheme, t} = useTheme();
  const styles = SS[scheme];
  const {sessions} = useWorkouts();
  const {todays} = useRoutines();

  const now = new Date();
  const routine = todays();
  const accent = routine ? (routine.kind === 'upper' ? t.cyan : t.mint) : t.cyan;

  // Lunes 00:00 de la semana actual.
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((now.getDay() + 6) % 7));

  const dates = sessions.map(s => s.date);
  const doneWeek = sessions.filter(s => s.date >= monday.getTime()).length;
  const planned = WEEK_SPLIT.filter(s => s.routineId).length;
  const trainedToday = sessions.some(s => sameDay(new Date(s.date), now));
  const streak = computeStreak(dates, now);
  const last = sessions[0]; // más reciente

  const minutes = routine ? Math.round(countSets(routine) * 3.2) : 0;
  const note = trainedToday
    ? 'Sesión de hoy completada. Recupera, hidrátate y duerme bien — ahí crece el músculo.'
    : routine
    ? `Hoy toca ${routine.title}: ${countSets(routine)} series por delante. A por ello.`
    : 'Día de descanso. La recuperación también construye — vuelve mañana con todo.';

  return (
    <Screen>
      <Pad y={6}>
        <Eyebrow>
          {DOW_FULL[now.getDay()]} · {MON[now.getMonth()]} {now.getDate()}
        </Eyebrow>
        <H1 style={{marginTop: 8}}>{routine ? routine.title.toUpperCase() : 'DÍA DE DESCANSO'}</H1>
      </Pad>

      {/* Hero · adherencia semanal + entrenamiento de hoy */}
      <Pad y={20}>
        <Card style={{padding: 22}}>
          <View style={styles.heroRow}>
            <Ring
              value={planned ? (doneWeek / planned) * 100 : 0}
              label={`${doneWeek}/${planned}`}
              sub="SEMANA"
              color={accent}
            />
            <View style={{flex: 1}}>
              <Eyebrow color={t.fg3}>{routine ? 'ENTRENAMIENTO DE HOY' : 'RECUPERACIÓN'}</Eyebrow>
              <H2 style={{marginTop: 10}}>{routine ? routine.title : 'Descanso'}</H2>
              <Meta style={{marginTop: 8}}>
                {routine ? `${countExercises(routine)} EJERCICIOS · ~${minutes} MIN` : 'Sin sesión programada'}
              </Meta>
            </View>
          </View>
          <Hairline style={{marginVertical: 18}} />
          <View style={styles.heroFoot}>
            <View>
              <Eyebrow color={t.fg3}>{routine ? 'SERIES' : 'RACHA'}</Eyebrow>
              <Num size={28} style={{marginTop: 6}}>
                {routine ? countSets(routine) : streak}
                {routine ? null : <Unit> DÍAS</Unit>}
              </Num>
            </View>
            {routine ? (
              <Button
                kind={trainedToday ? 'secondary' : routine.kind === 'upper' ? 'primary' : 'mint'}
                onPress={() => onStart()}>
                {trainedToday ? 'Entrenar otra vez' : 'Iniciar entrenamiento'}
              </Button>
            ) : (
              <Button kind="ghost" onPress={() => onStart()}>
                Entrenar igual
              </Button>
            )}
          </View>
        </Card>
      </Pad>

      {/* Semana real (sesiones completadas / hoy / descanso) */}
      <Pad y={4}>
        <Eyebrow style={{marginBottom: 12}}>SEMANA · RESUMEN</Eyebrow>
        <View style={styles.weekRow}>
          {WEEK.map((d, i) => {
            const dayDate = new Date(monday);
            dayDate.setDate(monday.getDate() + i);
            const trained = sessions.some(s => sameDay(new Date(s.date), dayDate));
            const isToday = sameDay(dayDate, now);
            const rest = !WEEK_SPLIT[i].routineId;
            const bg = trained ? accent : isToday ? t.fg : t.surface2;
            const fg = trained || isToday ? t.bg : t.fg3;
            return (
              <View
                key={d}
                style={[
                  styles.weekPill,
                  {backgroundColor: bg, opacity: rest && !trained && !isToday ? 0.4 : 1},
                ]}>
                <Eyebrow color={fg} style={styles.weekPillText}>
                  {d}
                </Eyebrow>
              </View>
            );
          })}
        </View>
      </Pad>

      {/* Métricas reales */}
      <Pad y={16}>
        <View style={styles.tiles}>
          <Tile t={t} styles={styles} val={String(sessions.length)} label="SESIONES" />
          <Tile t={t} styles={styles} val={`${doneWeek}/${planned}`} label="ESTA SEMANA" />
          <Tile t={t} styles={styles} val={String(streak)} label="RACHA · DÍAS" />
        </View>
      </Pad>

      {/* Última sesión (real) */}
      {last ? (
        <Pad y={4}>
          <Eyebrow style={{marginBottom: 12}}>ÚLTIMA · SESIÓN</Eyebrow>
          <Card style={{padding: 16}}>
            <View style={styles.lastHead}>
              <Text style={styles.lastTitle} allowFontScaling={false}>
                {last.routineTitle}
              </Text>
              <Meta color={t.fg3}>{fmtDate(last.date)}</Meta>
            </View>
            <Hairline style={{marginVertical: 14}} />
            <View style={styles.lastStats}>
              <LastStat t={t} val={`${sessionSets(last)}`} label="SERIES" />
              <LastStat t={t} val={`${(sessionVolume(last) / 1000).toFixed(1)}`} label="TONELAJE · T" />
              <LastStat t={t} val={`${Math.round(last.durationSec / 60)}`} label="MINUTOS" />
            </View>
          </Card>
        </Pad>
      ) : null}

      {/* Estado dinámico */}
      <Pad y={20}>
        <Card style={{padding: 16}}>
          <Eyebrow color={trainedToday ? t.mint : accent}>
            {trainedToday ? 'HECHO ✓' : 'HYPERTROFIT'}
          </Eyebrow>
          <Meta color={t.fg1} style={styles.note}>
            {note}
          </Meta>
        </Card>
      </Pad>
    </Screen>
  );
}

function Tile({
  t,
  styles,
  val,
  label,
}: {
  t: Palette;
  styles: ReturnType<typeof makeStyles>;
  val: string;
  label: string;
}) {
  return (
    <Card style={styles.tile}>
      <Num size={26}>{val}</Num>
      <Eyebrow color={t.fg3} style={{marginTop: 6, fontSize: 9}}>
        {label}
      </Eyebrow>
    </Card>
  );
}

function LastStat({t, val, label}: {t: Palette; val: string; label: string}) {
  return (
    <View style={{alignItems: 'center'}}>
      <Num size={20}>{val}</Num>
      <Eyebrow color={t.fg3} style={{marginTop: 5, fontSize: 8}}>
        {label}
      </Eyebrow>
    </View>
  );
}

const makeStyles = (t: Palette) =>
  StyleSheet.create({
    heroRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 22,
    },
    heroFoot: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    weekRow: {
      flexDirection: 'row',
      gap: 6,
    },
    weekPill: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 2,
    },
    weekPillText: {
      fontSize: 11,
      letterSpacing: 2,
    },
    tiles: {
      flexDirection: 'row',
      gap: 10,
    },
    tile: {
      flex: 1,
      padding: 14,
      alignItems: 'center',
    },
    lastHead: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    lastTitle: {
      color: t.fg,
      fontSize: 14,
      fontWeight: '700',
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      flex: 1,
    },
    lastStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    note: {
      marginTop: 10,
      fontSize: 14,
      lineHeight: 21,
      letterSpacing: 0,
      textTransform: 'none',
      fontWeight: '400',
    },
  });

const SS = {dark: makeStyles(DARK), light: makeStyles(LIGHT)};
