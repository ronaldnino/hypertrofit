// Hypertrofit · Stats — performance trends. Theme-aware. Ported from StatsScreen.jsx.
import React, {useState} from 'react';
import {View, Text, StyleSheet, useWindowDimensions} from 'react-native';
import Svg, {Line, Path, Circle} from 'react-native-svg';
import {Palette, AccentKey, DARK, LIGHT} from '../theme';
import {useTheme} from '../ThemeContext';
import {
  Screen,
  Pad,
  Eyebrow,
  H1,
  Meta,
  Num,
  Unit,
  Card,
  Chip,
} from '../components/ui';
import {Icon} from '../components/Icon';
import {DashHeader, FeedSection, MiniBars} from '../components/Dashboard';
import {ExerciseIcon} from '../components/ExerciseIcon';
import {useRole} from '../RoleContext';
import {useWorkouts} from '../WorkoutContext';
import {useSettings} from '../SettingsContext';
import {fromKg, unitLabel} from '../units';
import {
  e1rmSeries,
  bestPRs,
  avgRpe,
  totalSetsAll,
  exercisesByFrequency,
  sessionVolume,
} from '../workout';
import {STATS_DASH} from '../dashboards';

const DOW = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
const MON = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
const fmtDate = (ms: number) => {
  const d = new Date(ms);
  return `${DOW[d.getDay()]} · ${MON[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`;
};

// Despacha la vista de Progreso según el tipo de usuario.
export function Stats() {
  const {role} = useRole();
  const {scheme, t} = useTheme();
  const styles = SS[scheme];
  const dash = STATS_DASH[role];
  if (dash) {
    return (
      <Screen>
        <DashHeader eyebrow={dash.eyebrow} title={dash.title} />
        <Pad y={16}>
          <View style={styles.grid}>
            {dash.tiles.map(tile => (
              <Card key={tile.label} style={styles.tile}>
                <Eyebrow color={t.fg3}>{tile.label}</Eyebrow>
                <Num size={28} style={{marginTop: 8}}>
                  {tile.val}
                  {tile.unit ? <Unit>{tile.unit}</Unit> : null}
                </Num>
                <Meta color={t[tile.deltaColor]} style={{marginTop: 6}}>
                  {tile.delta}
                </Meta>
              </Card>
            ))}
          </View>
        </Pad>
        <Pad y={4}>
          <Card style={{padding: 18}}>
            <View style={styles.chartHead}>
              <Eyebrow color={t.fg2}>{dash.chartTitle}</Eyebrow>
              <Meta color={t[dash.chartColor]}>{dash.chartNote}</Meta>
            </View>
            <View style={{marginTop: 16}}>
              <MiniBars data={dash.bars} peakColor={t[dash.chartColor]} />
            </View>
          </Card>
        </Pad>
        {dash.sections.map(s => (
          <FeedSection key={s.title} section={s} />
        ))}
      </Screen>
    );
  }
  return <AthleteStats />;
}

function AthleteStats() {
  const {scheme, t} = useTheme();
  const styles = SS[scheme];
  const {width} = useWindowDimensions();
  const {sessions} = useWorkouts();
  const {settings} = useSettings();
  const units = settings.units;
  const u = unitLabel(units);

  // Ejercicios disponibles (por frecuencia) y el seleccionado para el gráfico.
  const freq = exercisesByFrequency(sessions);
  const [lift, setLift] = useState<string | undefined>(undefined);
  const selected = lift && freq.some(f => f.name === lift) ? lift : freq[0]?.name;
  const series = selected ? e1rmSeries(sessions, selected) : [];
  const pts = series.map(p => p.value);

  const prs = bestPRs(sessions).slice(0, 6);
  const sets = totalSetsAll(sessions);
  const rpe = avgRpe(sessions);
  const lastVol = sessions.length ? sessionVolume(sessions[0]) : 0; // [0] = más reciente
  const prevVol = sessions.length > 1 ? sessionVolume(sessions[1]) : 0;
  const volDelta = lastVol - prevVol;

  // Estado vacío
  if (sessions.length === 0) {
    return (
      <Screen>
        <Pad y={6}>
          <Eyebrow>ENTRENAMIENTO · INTELIGENCIA</Eyebrow>
          <H1 style={{marginTop: 8}}>PROGRESO</H1>
        </Pad>
        <Pad y={24}>
          <Card style={styles.empty}>
            {Icon.stats({color: t.fg3, size: 28})}
            <Text style={styles.emptyTitle} allowFontScaling={false}>
              SIN ENTRENAMIENTOS AÚN
            </Text>
            <Meta color={t.fg3} style={{textAlign: 'center', marginTop: 8}}>
              Inicia un entrenamiento desde Plan o Hoy y aquí verás tu 1RM
              estimado, tonelaje, RPE y récords.
            </Meta>
          </Card>
        </Pad>
      </Screen>
    );
  }

  // Geometría del gráfico (espacio viewBox)
  const W = 350;
  const H = 140;
  const pad = 16;
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const span = Math.max(1, max + 4 - (min - 4));
  const x = (i: number) =>
    pts.length > 1 ? pad + (i * (W - pad * 2)) / (pts.length - 1) : W / 2;
  const y = (v: number) => pad + (H - pad * 2) * (1 - (v - (min - 4)) / span);
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(p)}`).join(' ');
  const chartW = width - 40 - 36; // screen padding + card padding
  const latest = pts[pts.length - 1];
  const first = pts[0];
  const pct = first > 0 ? ((latest - first) / first) * 100 : 0;

  const tiles = [
    {
      label: 'TONELAJE · ÚLT',
      value: (lastVol / 1000).toFixed(1),
      unit: 'T',
      delta:
        sessions.length > 1
          ? `${volDelta >= 0 ? '+' : '−'}${Math.abs(volDelta / 1000).toFixed(1)}T vs ANT`
          : '1ª SESIÓN',
      deltaColor: (volDelta >= 0 ? 'mint' : 'warn') as AccentKey,
    },
    {label: 'SESIONES', value: String(sessions.length), unit: '', delta: 'REGISTRADAS', deltaColor: 'fg2' as AccentKey},
    {label: 'SERIES', value: String(sets), unit: '', delta: 'TOTAL', deltaColor: 'fg2' as AccentKey},
    {label: 'RPE PROM', value: rpe.toFixed(1), unit: '', delta: 'PROMEDIO', deltaColor: 'fg2' as AccentKey},
  ];

  return (
    <Screen>
      <Pad y={6}>
        <Eyebrow>ENTRENAMIENTO · INTELIGENCIA</Eyebrow>
        <H1 style={{marginTop: 8}}>PROGRESO</H1>
      </Pad>

      {/* Selector de ejercicio */}
      <Pad y={16}>
        <View style={styles.chips}>
          {freq.slice(0, 5).map(f => (
            <Chip key={f.name} active={selected === f.name} onPress={() => setLift(f.name)}>
              {f.name}
            </Chip>
          ))}
        </View>
      </Pad>

      {/* Gráfico principal · 1RM estimado del ejercicio */}
      <Pad y={4}>
        <Card style={{padding: 18}}>
          <View style={styles.chartHead}>
            <Eyebrow color={t.fg2}>{(selected ?? '').toUpperCase()} · 1RM EST</Eyebrow>
            <Meta color={pct >= 0 ? t.mint : t.warn}>
              {pct >= 0 ? '+' : ''}
              {pct.toFixed(1)}%
            </Meta>
          </View>
          <View style={styles.chartValue}>
            <Num size={44}>{Math.round(fromKg(latest, units))}</Num>
            <Meta>{u}</Meta>
          </View>
          {pts.length > 1 ? (
            <Svg width={chartW} height={140} viewBox={`0 0 ${W} ${H}`} style={{marginTop: 10}}>
              {[0, 1, 2, 3].map(i => {
                const gy = pad + ((H - pad * 2) * i) / 3;
                return (
                  <Line key={i} x1={pad} x2={W - pad} y1={gy} y2={gy} stroke={t.line} strokeWidth={1} />
                );
              })}
              <Path d={d} fill="none" stroke={t.cyan} strokeWidth={1.5} />
              <Circle cx={x(pts.length - 1)} cy={y(latest)} r={3} fill={t.cyan} />
            </Svg>
          ) : (
            <Meta color={t.fg3} style={{marginTop: 14}}>
              Registra otra sesión de este ejercicio para ver la tendencia.
            </Meta>
          )}
          {pts.length > 1 ? (
            <View style={styles.chartAxis}>
              <Meta color={t.fg3}>{fmtDate(series[0].date)}</Meta>
              <Meta color={t.fg3}>{fmtDate(series[series.length - 1].date)}</Meta>
            </View>
          ) : null}
        </Card>
      </Pad>

      {/* Tiles */}
      <Pad y={16}>
        <View style={styles.grid}>
          {tiles.map(tile => (
            <Card key={tile.label} style={styles.tile}>
              <Eyebrow color={t.fg3}>{tile.label}</Eyebrow>
              <Num size={28} style={{marginTop: 8}}>
                {tile.value}
                {tile.unit ? <Unit>{tile.unit}</Unit> : null}
              </Num>
              <Meta color={t[tile.deltaColor]} style={{marginTop: 6}}>
                {tile.delta}
              </Meta>
            </Card>
          ))}
        </View>
      </Pad>

      {/* Récords personales (mejor 1RM estimado por ejercicio) */}
      <Pad y={20}>
        <Eyebrow style={{marginBottom: 12}}>RÉCORDS · PERSONALES</Eyebrow>
        <Card style={{padding: 0}}>
          {prs.map((pr, i) => (
            <View
              key={pr.name}
              style={[styles.prRow, i < prs.length - 1 ? styles.prBorder : null]}>
              <View style={[styles.prThumb, {borderColor: t.lineStrong}]}>
                <ExerciseIcon pattern={pr.pattern} color={t.mint} size={18} />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.prLift} allowFontScaling={false}>
                  {pr.name}
                </Text>
                <Meta color={t.fg3} style={{marginTop: 4}}>
                  1RM EST · {fmtDate(pr.date)}
                </Meta>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Num size={18}>{Math.round(fromKg(pr.value, units))}</Num>
                <Meta color={t.mint} style={{marginTop: 4}}>
                  {u}
                </Meta>
              </View>
            </View>
          ))}
        </Card>
      </Pad>
    </Screen>
  );
}

const makeStyles = (t: Palette) =>
  StyleSheet.create({
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    empty: {
      padding: 28,
      alignItems: 'center',
    },
    emptyTitle: {
      color: t.fg,
      fontSize: 14,
      fontWeight: '700',
      letterSpacing: 1.6,
      marginTop: 14,
    },
    prThumb: {
      width: 30,
      height: 30,
      borderWidth: 1,
      borderRadius: 2,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    chartHead: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
    },
    chartValue: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 10,
      marginTop: 10,
    },
    chartAxis: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 6,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    tile: {
      width: '47.8%',
      flexGrow: 1,
      padding: 14,
    },
    prRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    prBorder: {
      borderBottomWidth: 1,
      borderBottomColor: t.line,
    },
    prLift: {
      color: t.fg,
      fontWeight: '700',
      fontSize: 14,
      letterSpacing: 1.1,
      textTransform: 'uppercase',
    },
  });

const SS = {dark: makeStyles(DARK), light: makeStyles(LIGHT)};
