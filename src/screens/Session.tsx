// Hypertrofit · Session — active workout, set logging + rest timer.
// Ported from ui_kits/mobile/SessionScreen.jsx.
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Palette, DARK, LIGHT} from '../theme';
import {useTheme} from '../ThemeContext';
import {
  Screen,
  Pad,
  Eyebrow,
  H1,
  Meta,
  Num,
  Card,
  Button,
  IconButton,
  Stepper,
  Bar,
} from '../components/ui';
import {Icon} from '../components/Icon';

type LoggedSet = {reps: number; load: number; rpe: number};

const TOTAL_SETS = 4;
const REST_TARGET = 90;

export function Session({
  onClose,
  onComplete,
}: {
  onClose: () => void;
  onComplete: () => void;
}) {
  const {scheme, t} = useTheme();
  const styles = SS[scheme];
  const [load, setLoad] = useState(142.5);
  const [reps, setReps] = useState(8);
  const [rpe, setRpe] = useState(8.5);
  const [setIdx, setSetIdx] = useState(2); // working on set 3
  const [logged, setLogged] = useState<LoggedSet[]>([
    {reps: 8, load: 142.5, rpe: 7.5},
    {reps: 8, load: 142.5, rpe: 8.0},
  ]);
  const [resting, setResting] = useState(false);
  const [restLeft, setRestLeft] = useState(REST_TARGET);

  // Rest countdown
  useEffect(() => {
    if (!resting) return;
    const id = setInterval(
      () => setRestLeft(t => Math.max(0, t - 1)),
      1000,
    );
    return () => clearInterval(id);
  }, [resting]);

  // Live elapsed session clock (starts at 00:23:48)
  const [elapsed, setElapsed] = useState(23 * 60 + 48);
  const elapsedRef = useRef(elapsed);
  elapsedRef.current = elapsed;
  useEffect(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  function logSet() {
    setLogged(l => [...l, {reps, load, rpe}]);
    setSetIdx(i => i + 1);
    setResting(true);
    setRestLeft(REST_TARGET);
  }

  const done = logged.length;
  const hhmmss = (s: number) =>
    `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(
      Math.floor((s % 3600) / 60),
    ).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const mmss = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const remaining = Math.max(0, TOTAL_SETS - logged.length - 1);

  return (
    <View style={{flex: 1, backgroundColor: t.bg}}>
      {/* Sticky session header (outside scroll) */}
      <View style={styles.header}>
        <Pad y={14}>
          <View style={styles.headTop}>
            <IconButton onPress={onClose} size={36} borderColor={t.line}>
              {Icon.back({color: t.fg1, size: 18})}
            </IconButton>
            <View style={styles.liveWrap}>
              <View style={styles.liveDot} />
              <Eyebrow color={t.cyan}>EN VIVO</Eyebrow>
              <Text style={styles.clock} allowFontScaling={false}>
                {hhmmss(elapsed)}
              </Text>
            </View>
            <IconButton size={36} borderColor={t.line}>
              {Icon.more({color: t.fg1, size: 18})}
            </IconButton>
          </View>

          {/* Segmented session bar */}
          <View style={styles.segBar}>
            {Array.from({length: 18}).map((_, i) => {
              const filled = i < 7;
              const cur = i === 7;
              return (
                <View
                  key={i}
                  style={[
                    styles.seg,
                    {backgroundColor: cur ? t.fg : filled ? t.cyan : t.surface2},
                  ]}
                />
              );
            })}
          </View>
          <View style={styles.segLabels}>
            <Meta color={t.fg2}>EJ 02 / 05</Meta>
            <Meta color={t.fg}>PRESS DE BANCA</Meta>
            <Meta color={t.fg2}>40%</Meta>
          </View>
        </Pad>
      </View>

      <Screen padTop={0} padBottom={120}>
        {/* Current exercise hero */}
        <Pad y={20}>
          <Eyebrow color={t.fg3}>EJECUTANDO AHORA</Eyebrow>
          <H1 style={{marginTop: 8}}>PRESS DE BANCA</H1>
          <Meta style={{marginTop: 10}}>3 × 8 · TEMPO 3-0-1-0 · RPE 8</Meta>
        </Pad>

        {/* Set logger */}
        <Pad y={6}>
          <Card style={{padding: 18}}>
            <View style={styles.logHead}>
              <Eyebrow color={t.cyan}>
                SERIE {String(setIdx + 1).padStart(2, '0')} · REGISTRO
              </Eyebrow>
              <Meta color={t.fg3}>
                {done} DE {TOTAL_SETS} HECHAS
              </Meta>
            </View>

            <View style={{marginTop: 18}}>
              <Field label="CARGA · KG">
                <Stepper value={load} onChange={setLoad} step={2.5} decimals={1} />
              </Field>
            </View>

            <View style={styles.fieldRow}>
              <Field label="REPS" style={{flex: 1}}>
                <Stepper value={reps} onChange={setReps} step={1} decimals={0} compact />
              </Field>
              <Field label="RPE" style={{flex: 1}}>
                <Stepper value={rpe} onChange={setRpe} step={0.5} decimals={1} compact />
              </Field>
            </View>

            <View style={{marginTop: 18}}>
              <Button kind="primary" full onPress={logSet}>
                {`REGISTRAR SERIE · ${load.toFixed(1)} × ${reps}`}
              </Button>
            </View>
          </Card>
        </Pad>

        {/* Rest timer block */}
        {resting ? (
          <Pad y={16}>
            <Card style={{padding: 18, borderColor: t.cyan}}>
              <Eyebrow color={t.cyan}>DESCANSO · OBJETIVO 90 SEG</Eyebrow>
              <View style={styles.restRow}>
                <Num size={48} color={t.cyan}>
                  {mmss(restLeft)}
                </Num>
                <View style={{flex: 1}}>
                  <Bar value={(restLeft / REST_TARGET) * 100} color={t.cyan} height={2} />
                  <Meta color={t.fg2} style={{marginTop: 8}}>
                    RESPIRA · 4 INHALA · 6 EXHALA
                  </Meta>
                </View>
                <IconButton size={42} onPress={() => setResting(false)}>
                  <Eyebrow color={t.fg}>OMITIR</Eyebrow>
                </IconButton>
              </View>
            </Card>
          </Pad>
        ) : null}

        {/* Completed sets table */}
        <Pad y={20}>
          <Eyebrow style={{marginBottom: 12}}>SERIES · COMPLETAS</Eyebrow>
          <Card style={{padding: 0}}>
            <SetHeaderRow />
            {logged.map((s, i) => (
              <SetRow key={i} n={i + 1} reps={s.reps} load={s.load} rpe={s.rpe} done />
            ))}
            <SetRow n={logged.length + 1} reps={reps} load={load} rpe={rpe} active />
            {Array.from({length: remaining}).map((_, i) => (
              <SetRow key={`empty-${i}`} n={logged.length + 2 + i} planned />
            ))}
          </Card>
        </Pad>

        <Pad y={6}>
          <Button kind="secondary" full onPress={onComplete}>
            Terminar Ejercicio
          </Button>
        </Pad>
      </Screen>
    </View>
  );
}

function Field({
  label,
  children,
  style,
}: {
  label: string;
  children: React.ReactNode;
  style?: object;
}) {
  const {t} = useTheme();
  return (
    <View style={[{gap: 8}, style]}>
      <Eyebrow color={t.fg3}>{label}</Eyebrow>
      {children}
    </View>
  );
}

function SetHeaderRow() {
  const {scheme} = useTheme();
  const styles = SS[scheme];
  return (
    <View style={[styles.tRow, styles.tBorder]}>
      <Text style={[styles.th, styles.tColN]} allowFontScaling={false}>
        Nº
      </Text>
      <Text style={[styles.th, styles.tCol]} allowFontScaling={false}>
        REPS
      </Text>
      <Text style={[styles.th, styles.tCol]} allowFontScaling={false}>
        CARGA
      </Text>
      <Text style={[styles.th, styles.tCol]} allowFontScaling={false}>
        RPE
      </Text>
      <View style={styles.tColCheck} />
    </View>
  );
}

function SetRow({
  n,
  reps,
  load,
  rpe,
  done,
  active,
  planned,
}: {
  n: number;
  reps?: number;
  load?: number;
  rpe?: number;
  done?: boolean;
  active?: boolean;
  planned?: boolean;
}) {
  const {scheme, t} = useTheme();
  const styles = SS[scheme];
  const txt = planned ? t.fg3 : active ? t.cyan : t.fg;
  const fw = active || done ? '700' : '500';
  return (
    <View
      style={[
        styles.tRow,
        styles.tBorder,
        {backgroundColor: active ? t.activeRow : 'transparent'},
      ]}>
      <Text style={[styles.tdN, styles.tColN]} allowFontScaling={false}>
        {String(n).padStart(2, '0')}
      </Text>
      <Text
        style={[styles.td, styles.tCol, {color: txt, fontWeight: fw}]}
        allowFontScaling={false}>
        {planned ? '—' : reps}
      </Text>
      <Text
        style={[styles.td, styles.tCol, {color: txt, fontWeight: fw}]}
        allowFontScaling={false}>
        {planned ? '—' : `${load} kg`}
      </Text>
      <Text
        style={[styles.td, styles.tCol, {color: txt, fontWeight: fw}]}
        allowFontScaling={false}>
        {planned ? '—' : rpe}
      </Text>
      <View style={styles.tColCheck}>
        {done ? Icon.check({color: t.mint, size: 16}) : null}
      </View>
    </View>
  );
}

const makeStyles = (t: Palette) =>
  StyleSheet.create({
  header: {
    backgroundColor: t.bg,
    borderBottomWidth: 1,
    borderBottomColor: t.line,
  },
  headTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  liveWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: t.cyan,
  },
  clock: {
    color: t.fg,
    fontSize: 13,
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
    fontWeight: '600',
  },
  segBar: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 14,
  },
  seg: {
    flex: 1,
    height: 4,
  },
  segLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  logHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  restRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginTop: 12,
  },
  // table
  tRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tBorder: {
    borderBottomWidth: 1,
    borderBottomColor: t.line,
  },
  th: {
    color: t.fg3,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2.2,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  td: {
    fontSize: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontVariant: ['tabular-nums'],
  },
  tdN: {
    color: t.fg3,
    fontSize: 11,
    fontWeight: '600',
    paddingVertical: 14,
    paddingHorizontal: 14,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  tCol: {
    flex: 1,
  },
  tColN: {
    width: 40,
    textAlign: 'center',
    flexGrow: 0,
    flexShrink: 0,
  },
  tColCheck: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const SS = {dark: makeStyles(DARK), light: makeStyles(LIGHT)};
