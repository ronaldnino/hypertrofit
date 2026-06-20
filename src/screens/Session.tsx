// Hypertrofit · Session — entrenamiento en vivo: recorre los ejercicios de una rutina,
// registra series (carga/reps/RPE) con timer de descanso y, al terminar, devuelve la
// sesión completada para persistirla. Precarga la carga desde la última sesión del mismo
// ejercicio (progresión).
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Vibration,
} from 'react-native';
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
import {ExerciseIcon, PATTERN_LABEL, Pattern} from '../components/ExerciseIcon';
import {Routine, Prescription} from '../routines';
import {useWorkouts} from '../WorkoutContext';
import {useRoutines} from '../RoutinesContext';
import {useSettings} from '../SettingsContext';
import {fromKg, toKg, unitLabel, stepFor, roundToStep} from '../units';
import {
  CompletedSession,
  LoggedSet,
  SessionEntry,
  flattenExercises,
  repsLow,
  lastLoadForExercise,
} from '../workout';

export function Session({
  routine,
  onClose,
  onComplete,
}: {
  routine: Routine;
  onClose: () => void;
  onComplete: (s: CompletedSession) => void;
}) {
  const {scheme, t} = useTheme();
  const styles = SS[scheme];
  const {sessions} = useWorkouts();
  const {settings} = useSettings();
  const {routines} = useRoutines();
  const units = settings.units;
  const restTarget = settings.restDefault;
  const accent = routine.kind === 'upper' ? t.cyan : t.mint;

  // Lista de ejercicios en vivo (mutable: se pueden añadir sobre la marcha).
  const [exercises, setExercises] = useState<Prescription[]>(() =>
    flattenExercises(routine),
  );
  const [adding, setAdding] = useState(false);

  // Catálogo de ejercicios (de todas las rutinas) para el añadido en vivo.
  const catalog = useMemo(() => {
    const m = new Map<string, Pattern>();
    routines.forEach(r =>
      r.blocks.forEach(b =>
        b.items.forEach(it => {
          if (!m.has(it.name)) m.set(it.name, it.pattern);
        }),
      ),
    );
    return [...m.entries()].map(([name, pattern]) => ({name, pattern}));
  }, [routines]);

  const [exIdx, setExIdx] = useState(0);
  const ex = exercises[exIdx];
  // Series registradas por ejercicio (una lista por ejercicio).
  const [logged, setLogged] = useState<LoggedSet[][]>(() =>
    exercises.map(() => []),
  );

  // Entradas del registro actual.
  const [load, setLoad] = useState(20);
  const [reps, setReps] = useState(8);
  const [rpe, setRpe] = useState(8);

  // Al cambiar de ejercicio: precargar valores objetivo (y última carga si existe).
  // Internamente las cargas se guardan en kg; aquí se muestran en la unidad elegida.
  useEffect(() => {
    const prevKg = lastLoadForExercise(sessions, ex.name);
    setLoad(roundToStep(fromKg(prevKg ?? 20, units), units));
    setReps(repsLow(ex.reps));
    setRpe(ex.rpe ? Number(ex.rpe) : 8);
    setResting(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exIdx]);

  // Timer de descanso (vibra al llegar a 0).
  const [resting, setResting] = useState(false);
  const [restLeft, setRestLeft] = useState(restTarget);
  useEffect(() => {
    if (!resting) return;
    if (restLeft <= 0) {
      Vibration.vibrate([0, 300, 150, 300]);
      setResting(false);
      return;
    }
    const id = setTimeout(() => setRestLeft(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [resting, restLeft]);

  // Reloj de sesión.
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);
  elapsedRef.current = elapsed;
  useEffect(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  function logSet() {
    // logged[] guarda en unidad de display; se convierte a kg al terminar.
    setLogged(all => {
      const copy = all.map(a => a.slice());
      copy[exIdx].push({reps, load, rpe});
      return copy;
    });
    setResting(true);
    setRestLeft(restTarget);
  }

  function finish() {
    const entries: SessionEntry[] = exercises
      .map((e, i) => ({
        name: e.name,
        pattern: e.pattern,
        target: `${e.sets} × ${e.reps}`,
        sets: logged[i].map(st => ({...st, load: toKg(st.load, units)})),
      }))
      .filter(e => e.sets.length > 0);
    if (entries.length === 0) {
      onClose();
      return;
    }
    onComplete({
      id: String(Date.now()),
      routineId: routine.id,
      routineTitle: routine.title,
      kind: routine.kind,
      date: Date.now(),
      durationSec: elapsedRef.current,
      entries,
    });
  }

  const doneHere = logged[exIdx].length;
  const targetHere = ex.sets;
  const complete = doneHere >= targetHere;
  const totalSetsDone = logged.reduce((n, a) => n + a.length, 0);
  const totalSetsTarget = exercises.reduce((n, e) => n + e.sets, 0);
  const remaining = Math.max(0, targetHere - doneHere - 1);
  const isLast = exIdx === exercises.length - 1;

  const goPrev = () => setExIdx(i => Math.max(0, i - 1));
  const goNext = () => setExIdx(i => Math.min(exercises.length - 1, i + 1));

  // Añade un ejercicio extra a la sesión en vivo y salta a él.
  const addLive = (c: {name: string; pattern: Pattern}) => {
    setExercises(xs => [...xs, {name: c.name, sets: 3, reps: '10', pattern: c.pattern}]);
    setLogged(l => [...l, []]);
    setExIdx(exercises.length);
    setAdding(false);
  };

  const hhmmss = (s: number) =>
    `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(
      Math.floor((s % 3600) / 60),
    ).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const mmss = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <View style={{flex: 1, backgroundColor: t.bg}}>
      {/* Cabecera fija de sesión */}
      <View style={styles.header}>
        <Pad y={14}>
          <View style={styles.headTop}>
            <IconButton onPress={onClose} size={36} borderColor={t.line}>
              {Icon.back({color: t.fg1, size: 18})}
            </IconButton>
            <View style={styles.liveWrap}>
              <View style={[styles.liveDot, {backgroundColor: accent}]} />
              <Eyebrow color={accent}>EN VIVO</Eyebrow>
              <Text style={styles.clock} allowFontScaling={false}>
                {hhmmss(elapsed)}
              </Text>
            </View>
            <IconButton size={36} borderColor={t.line}>
              {Icon.more({color: t.fg1, size: 18})}
            </IconButton>
          </View>

          {/* Barra segmentada por ejercicio */}
          <View style={styles.segBar}>
            {exercises.map((e, i) => {
              const cnt = logged[i].length;
              const complete = cnt >= e.sets;
              const cur = i === exIdx;
              return (
                <View
                  key={i}
                  style={[
                    styles.seg,
                    {
                      backgroundColor: cur
                        ? t.fg
                        : complete
                        ? accent
                        : cnt > 0
                        ? t.fg3
                        : t.surface2,
                    },
                  ]}
                />
              );
            })}
          </View>
          <View style={styles.segLabels}>
            <Meta color={t.fg2}>
              EJ {String(exIdx + 1).padStart(2, '0')} / {String(exercises.length).padStart(2, '0')}
            </Meta>
            <Meta color={t.fg}>{routine.short}</Meta>
            <Meta color={t.fg2}>
              {Math.round((totalSetsDone / Math.max(1, totalSetsTarget)) * 100)}%
            </Meta>
          </View>
        </Pad>
      </View>

      <Screen padTop={0} padBottom={140}>
        {/* Ejercicio actual */}
        <Pad y={20}>
          <View style={styles.heroRow}>
            <View style={[styles.heroThumb, {borderColor: t.lineStrong}]}>
              <ExerciseIcon pattern={ex.pattern} color={accent} size={26} />
            </View>
            <View style={{flex: 1}}>
              <Eyebrow color={complete ? accent : t.fg3}>
                {complete ? 'EJERCICIO COMPLETO ✓' : 'EJECUTANDO AHORA'}
              </Eyebrow>
              <H1 style={{marginTop: 6}}>{ex.name}</H1>
            </View>
          </View>
          <Meta style={{marginTop: 12}}>
            {ex.sets} × {ex.reps}
            {ex.rpe ? ` · RPE ${ex.rpe}` : ''} · {PATTERN_LABEL[ex.pattern]}
          </Meta>
        </Pad>

        {/* Registro de serie */}
        <Pad y={6}>
          <Card style={{padding: 18}}>
            <View style={styles.logHead}>
              <Eyebrow color={accent}>
                SERIE {String(doneHere + 1).padStart(2, '0')} · REGISTRO
              </Eyebrow>
              <Meta color={t.fg3}>
                {doneHere} DE {targetHere} HECHAS
              </Meta>
            </View>

            <View style={{marginTop: 18}}>
              <Field label={`CARGA · ${unitLabel(units)}`}>
                <Stepper value={load} onChange={setLoad} step={stepFor(units)} decimals={1} />
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
              <Button
                kind={routine.kind === 'upper' ? 'primary' : 'mint'}
                full
                onPress={logSet}>
                {`REGISTRAR SERIE · ${load.toFixed(1)} × ${reps}`}
              </Button>
            </View>
          </Card>
        </Pad>

        {/* Timer de descanso */}
        {resting ? (
          <Pad y={16}>
            <Card style={{padding: 18, borderColor: accent}}>
              <Eyebrow color={accent}>DESCANSO · OBJETIVO {restTarget} SEG</Eyebrow>
              <View style={styles.restRow}>
                <Num size={48} color={accent}>
                  {mmss(restLeft)}
                </Num>
                <View style={{flex: 1}}>
                  <Bar value={(restLeft / restTarget) * 100} color={accent} height={2} />
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

        {/* Tabla de series del ejercicio actual */}
        <Pad y={20}>
          <Eyebrow style={{marginBottom: 12}}>SERIES · {ex.name.toUpperCase()}</Eyebrow>
          <Card style={{padding: 0}}>
            <SetHeaderRow />
            {logged[exIdx].map((s, i) => (
              <SetRow key={i} n={i + 1} reps={s.reps} load={s.load} rpe={s.rpe} unit={unitLabel(units)} done accent={accent} />
            ))}
            <SetRow n={doneHere + 1} reps={reps} load={load} rpe={rpe} unit={unitLabel(units)} active accent={accent} />
            {Array.from({length: remaining}).map((_, i) => (
              <SetRow key={`empty-${i}`} n={doneHere + 2 + i} unit={unitLabel(units)} planned accent={accent} />
            ))}
          </Card>
        </Pad>

        {/* Navegación entre ejercicios */}
        <Pad y={6}>
          {!isLast ? (
            <Button
              kind={complete ? 'mint' : 'ghost'}
              full
              onPress={goNext}
              style={styles.nextBtn}>
              {complete ? 'Siguiente ejercicio ✓' : 'Saltar ejercicio →'}
            </Button>
          ) : null}
          <View style={styles.navRow}>
            <Button kind="ghost" onPress={goPrev} style={styles.navBtn}>
              ← Anterior
            </Button>
            <Button kind="ghost" onPress={() => setAdding(true)} style={styles.navBtn}>
              + Añadir ejercicio
            </Button>
          </View>
        </Pad>

        <Pad y={10}>
          <Button kind={isLast ? 'mint' : 'secondary'} full onPress={finish}>
            {`Terminar entrenamiento · ${totalSetsDone} series`}
          </Button>
        </Pad>
      </Screen>

      {/* Modal · añadir ejercicio en vivo desde el catálogo */}
      <Modal
        visible={adding}
        transparent
        animationType="slide"
        onRequestClose={() => setAdding(false)}
        statusBarTranslucent>
        <Pressable style={styles.backdrop} onPress={() => setAdding(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.grabber} />
            <Eyebrow color={accent}>AÑADIR · EJERCICIO</Eyebrow>
            <ScrollView
              style={styles.catScroll}
              showsVerticalScrollIndicator={false}>
              {catalog.map(c => (
                <Pressable
                  key={c.name}
                  onPress={() => addLive(c)}
                  style={({pressed}) => [
                    styles.catRow,
                    {borderColor: t.line, opacity: pressed ? 0.6 : 1},
                  ]}>
                  <View style={[styles.catThumb, {borderColor: t.lineStrong}]}>
                    <ExerciseIcon pattern={c.pattern} color={accent} size={18} />
                  </View>
                  <Text style={styles.catName} allowFontScaling={false}>
                    {c.name}
                  </Text>
                  <Text style={[styles.catAdd, {color: accent}]} allowFontScaling={false}>
                    +
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <Button kind="ghost" full onPress={() => setAdding(false)} style={styles.catClose}>
              Cerrar
            </Button>
          </Pressable>
        </Pressable>
      </Modal>
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
  unit,
  done,
  active,
  planned,
  accent,
}: {
  n: number;
  reps?: number;
  load?: number;
  rpe?: number;
  unit: string;
  done?: boolean;
  active?: boolean;
  planned?: boolean;
  accent: string;
}) {
  const {scheme, t} = useTheme();
  const styles = SS[scheme];
  const txt = planned ? t.fg3 : active ? accent : t.fg;
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
      <Text style={[styles.td, styles.tCol, {color: txt, fontWeight: fw}]} allowFontScaling={false}>
        {planned ? '—' : reps}
      </Text>
      <Text style={[styles.td, styles.tCol, {color: txt, fontWeight: fw}]} allowFontScaling={false}>
        {planned ? '—' : `${load} ${unit.toLowerCase()}`}
      </Text>
      <Text style={[styles.td, styles.tCol, {color: txt, fontWeight: fw}]} allowFontScaling={false}>
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
    heroRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    heroThumb: {
      width: 46,
      height: 46,
      borderWidth: 1,
      borderRadius: 2,
      alignItems: 'center',
      justifyContent: 'center',
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
    nextBtn: {
      marginBottom: 10,
    },
    navRow: {
      flexDirection: 'row',
      gap: 10,
    },
    navBtn: {
      flex: 1,
    },
    backdrop: {
      flex: 1,
      backgroundColor: t.bg === '#0A0A0A' ? '#000000CC' : '#0A0A0A66',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: t.surface1,
      borderTopWidth: 1,
      borderColor: t.lineStrong,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 28,
    },
    grabber: {
      alignSelf: 'center',
      width: 36,
      height: 4,
      borderRadius: 999,
      backgroundColor: t.lineStrong,
      marginBottom: 18,
    },
    catScroll: {
      maxHeight: 380,
      marginTop: 14,
    },
    catRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 12,
      borderBottomWidth: 1,
    },
    catThumb: {
      width: 34,
      height: 34,
      borderWidth: 1,
      borderRadius: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    catName: {
      flex: 1,
      color: t.fg,
      fontSize: 14,
      fontWeight: '600',
      letterSpacing: 0.3,
    },
    catAdd: {
      fontSize: 20,
      fontWeight: '700',
    },
    catClose: {
      marginTop: 14,
    },
    // tabla
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
