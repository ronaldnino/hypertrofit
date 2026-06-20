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
import {useRole} from '../RoleContext';
import {STATS_DASH} from '../dashboards';

const PTS = [128, 130, 132, 131, 134, 136, 138, 140, 139, 142, 145, 148];
const RANGES = ['4S', '12S', '6M', '1A', 'TODO'];

const TILES: {label: string; value: string; unit: string; delta: string; deltaColor: AccentKey}[] = [
  {label: 'TONELAJE · S', value: '24.8', unit: 'T', delta: '+1.2T vs S02', deltaColor: 'mint'},
  {label: 'ADHERENCIA', value: '92', unit: '%', delta: '11 DE 12 SESIONES', deltaColor: 'mint'},
  {label: 'RPE PROM', value: '8.1', unit: '', delta: 'EN OBJETIVO', deltaColor: 'fg2'},
  {label: 'SUEÑO · PROM', value: '7.4', unit: 'H', delta: '−0.3H vs ANT', deltaColor: 'warn'},
];

const PRS = [
  {lift: 'Deadlift', val: '202.5 KG', delta: '+5.0 KG', date: 'MAR · MAY 12'},
  {lift: 'Sentadilla Trasera', val: '170.0 KG', delta: '+2.5 KG', date: 'LUN · MAY 04'},
  {lift: 'Press de Banca', val: '142.5 KG', delta: '+2.5 KG', date: 'VIE · ABR 24'},
];

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
  const [range, setRange] = useState('12W');
  const {width} = useWindowDimensions();

  // Chart geometry (viewBox space)
  const W = 350;
  const H = 140;
  const pad = 16;
  const max = Math.max(...PTS);
  const min = Math.min(...PTS);
  const x = (i: number) => pad + (i * (W - pad * 2)) / (PTS.length - 1);
  const y = (v: number) =>
    pad + (H - pad * 2) * (1 - (v - (min - 4)) / (max + 4 - (min - 4)));
  const d = PTS.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(p)}`).join(' ');
  const chartW = width - 40 - 36; // screen padding + card padding

  return (
    <Screen>
      <Pad y={6}>
        <Eyebrow>ENTRENAMIENTO · INTELIGENCIA</Eyebrow>
        <H1 style={{marginTop: 8}}>PROGRESO</H1>
      </Pad>

      {/* Range chips */}
      <Pad y={16}>
        <View style={styles.chips}>
          {RANGES.map(r => (
            <Chip key={r} active={range === r} onPress={() => setRange(r)}>
              {r}
            </Chip>
          ))}
        </View>
      </Pad>

      {/* Hero chart */}
      <Pad y={4}>
        <Card style={{padding: 18}}>
          <View style={styles.chartHead}>
            <Eyebrow color={t.fg2}>PRESS DE BANCA · 1RM EST</Eyebrow>
            <Meta color={t.cyan}>+15.6%</Meta>
          </View>
          <View style={styles.chartValue}>
            <Num size={44}>148.0</Num>
            <Meta>KG</Meta>
          </View>
          <Svg
            width={chartW}
            height={140}
            viewBox={`0 0 ${W} ${H}`}
            style={{marginTop: 10}}>
            {[0, 1, 2, 3].map(i => {
              const gy = pad + ((H - pad * 2) * i) / 3;
              return (
                <Line
                  key={i}
                  x1={pad}
                  x2={W - pad}
                  y1={gy}
                  y2={gy}
                  stroke={t.line}
                  strokeWidth={1}
                />
              );
            })}
            <Path d={d} fill="none" stroke={t.cyan} strokeWidth={1.5} />
            <Line
              x1={x(PTS.length - 1)}
              x2={x(PTS.length - 1)}
              y1={pad}
              y2={H - pad}
              stroke={t.cyan}
              strokeDasharray="2 3"
              strokeWidth={0.8}
              opacity={0.5}
            />
            <Circle cx={x(PTS.length - 1)} cy={y(PTS[PTS.length - 1])} r={3} fill={t.cyan} />
          </Svg>
          <View style={styles.chartAxis}>
            <Meta color={t.fg3}>S01</Meta>
            <Meta color={t.fg3}>S06</Meta>
            <Meta color={t.fg3}>S12</Meta>
          </View>
        </Card>
      </Pad>

      {/* Tile grid */}
      <Pad y={16}>
        <View style={styles.grid}>
          {TILES.map(tile => (
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

      {/* PR feed */}
      <Pad y={20}>
        <Eyebrow style={{marginBottom: 12}}>RÉCORDS · PERSONALES</Eyebrow>
        <Card style={{padding: 0}}>
          {PRS.map((pr, i) => (
            <View
              key={pr.lift}
              style={[styles.prRow, i < PRS.length - 1 ? styles.prBorder : null]}>
              <View style={{marginRight: 14}}>{Icon.star({color: t.mint, size: 16})}</View>
              <View style={{flex: 1}}>
                <Text style={styles.prLift} allowFontScaling={false}>
                  {pr.lift}
                </Text>
                <Meta color={t.fg3} style={{marginTop: 4}}>
                  {pr.date}
                </Meta>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Num size={18}>{pr.val}</Num>
                <Meta color={t.mint} style={{marginTop: 4}}>
                  {pr.delta}
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
      gap: 6,
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
