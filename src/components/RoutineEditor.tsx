// Hypertrofit · editor de rutinas. Modal para modificar la rutina seleccionada:
// editar nombre/series/reps/RPE/patrón de cada ejercicio, añadir o eliminar ejercicios
// por grupo muscular, y restablecer a la rutina por defecto. Persiste vía RoutinesContext.
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Palette, DARK, LIGHT, R} from '../theme';
import {useTheme} from '../ThemeContext';
import {Button, Eyebrow, Stepper} from './ui';
import {ExerciseIcon, PATTERN_LABEL, Pattern} from './ExerciseIcon';
import {useRoutines} from '../RoutinesContext';

const PATTERNS = Object.keys(PATTERN_LABEL) as Pattern[];

export function RoutineEditor({
  routineId,
  onClose,
}: {
  routineId: string | null;
  onClose: () => void;
}) {
  const {scheme, t} = useTheme();
  const {height} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const styles = SS[scheme];
  const {byId, updateExercise, addExercise, removeExercise, reset} = useRoutines();
  const routine = routineId ? byId(routineId) : undefined;
  const accent = routine?.kind === 'upper' ? t.cyan : t.mint;

  // Selector de patrón abierto para un ejercicio concreto.
  const [picker, setPicker] = useState<{b: number; i: number} | null>(null);

  return (
    <Modal
      visible={!!routineId}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            {maxHeight: height * 0.9, paddingBottom: 28 + insets.bottom},
          ]}
          onPress={() => {}}>
          {routine ? (
            <>
              <View style={styles.grabber} />
              <View style={styles.head}>
                <View style={{flex: 1}}>
                  <Eyebrow color={accent}>EDITAR RUTINA</Eyebrow>
                  <Text style={styles.title} allowFontScaling={false}>
                    {routine.title}
                  </Text>
                </View>
                <Button kind="ghost" onPress={reset}>
                  Restablecer
                </Button>
              </View>

              <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
                {routine.blocks.map((block, bi) => (
                  <View key={block.group} style={styles.block}>
                    <View style={styles.blockHead}>
                      <View style={[styles.dot, {backgroundColor: accent}]} />
                      <Eyebrow color={t.fg2}>{block.group}</Eyebrow>
                    </View>

                    {block.items.map((ex, ii) => {
                      const picking = picker?.b === bi && picker?.i === ii;
                      return (
                        <View key={ii} style={[styles.exCard, {borderColor: t.line}]}>
                          <View style={styles.exTop}>
                            <Pressable
                              onPress={() => setPicker(picking ? null : {b: bi, i: ii})}
                              style={[styles.exThumb, {borderColor: picking ? accent : t.lineStrong}]}>
                              <ExerciseIcon pattern={ex.pattern} color={accent} size={20} />
                            </Pressable>
                            <TextInput
                              value={ex.name}
                              onChangeText={txt =>
                                updateExercise(routine.id, bi, ii, {name: txt})
                              }
                              placeholder="Nombre del ejercicio"
                              placeholderTextColor={t.fg3}
                              style={[styles.nameInput, {color: t.fg, borderColor: t.line}]}
                              allowFontScaling={false}
                            />
                            <Pressable
                              onPress={() => removeExercise(routine.id, bi, ii)}
                              hitSlop={8}
                              style={styles.del}>
                              <Text style={[styles.delX, {color: t.danger}]} allowFontScaling={false}>
                                ✕
                              </Text>
                            </Pressable>
                          </View>

                          {/* Selector de patrón (desplegable) */}
                          {picking ? (
                            <View style={styles.patternWrap}>
                              {PATTERNS.map(p => (
                                <Pressable
                                  key={p}
                                  onPress={() => {
                                    updateExercise(routine.id, bi, ii, {pattern: p});
                                    setPicker(null);
                                  }}
                                  style={[
                                    styles.patternCell,
                                    {borderColor: ex.pattern === p ? accent : t.line},
                                  ]}>
                                  <ExerciseIcon
                                    pattern={p}
                                    color={ex.pattern === p ? accent : t.fg2}
                                    size={20}
                                  />
                                </Pressable>
                              ))}
                            </View>
                          ) : null}

                          <View style={styles.exFields}>
                            <View style={styles.setField}>
                              <Eyebrow color={t.fg3} style={styles.fieldLbl}>
                                SERIES
                              </Eyebrow>
                              <Stepper
                                value={ex.sets}
                                onChange={v =>
                                  updateExercise(routine.id, bi, ii, {sets: Math.max(1, Math.round(v))})
                                }
                                step={1}
                                decimals={0}
                                compact
                              />
                            </View>
                            <View style={styles.smallField}>
                              <Eyebrow color={t.fg3} style={styles.fieldLbl}>
                                REPS
                              </Eyebrow>
                              <TextInput
                                value={ex.reps}
                                onChangeText={txt =>
                                  updateExercise(routine.id, bi, ii, {reps: txt})
                                }
                                placeholder="8-10"
                                placeholderTextColor={t.fg3}
                                style={[styles.miniInput, {color: t.fg, borderColor: t.lineStrong}]}
                                allowFontScaling={false}
                              />
                            </View>
                            <View style={styles.smallField}>
                              <Eyebrow color={t.fg3} style={styles.fieldLbl}>
                                RPE
                              </Eyebrow>
                              <TextInput
                                value={ex.rpe ?? ''}
                                onChangeText={txt =>
                                  updateExercise(routine.id, bi, ii, {rpe: txt || undefined})
                                }
                                placeholder="—"
                                placeholderTextColor={t.fg3}
                                keyboardType="numeric"
                                style={[styles.miniInput, {color: t.fg, borderColor: t.lineStrong}]}
                                allowFontScaling={false}
                              />
                            </View>
                          </View>
                        </View>
                      );
                    })}

                    <Pressable
                      onPress={() =>
                        addExercise(routine.id, bi, {
                          name: 'Nuevo ejercicio',
                          sets: 3,
                          reps: '10',
                          pattern: block.items[0]?.pattern ?? 'pushH',
                        })
                      }
                      style={[styles.addRow, {borderColor: t.lineStrong}]}>
                      <Text style={[styles.addTxt, {color: accent}]} allowFontScaling={false}>
                        + Añadir ejercicio
                      </Text>
                    </Pressable>
                  </View>
                ))}
              </ScrollView>

              <Button kind="primary" full onPress={onClose} style={styles.doneBtn}>
                Listo
              </Button>
            </>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const makeStyles = (t: Palette) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: t.bg === '#0A0A0A' ? '#000000CC' : '#0A0A0A66',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: t.surface1,
      borderTopWidth: 1,
      borderColor: t.lineStrong,
      borderTopLeftRadius: R.r2,
      borderTopRightRadius: R.r2,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 28,
    },
    grabber: {
      alignSelf: 'center',
      width: 36,
      height: 4,
      borderRadius: R.full,
      backgroundColor: t.lineStrong,
      marginBottom: 18,
    },
    head: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 12,
    },
    title: {
      color: t.fg,
      fontSize: 17,
      fontWeight: '700',
      letterSpacing: 0.5,
      marginTop: 6,
    },
    scroll: {
      alignSelf: 'stretch',
    },
    block: {
      marginTop: 16,
    },
    blockHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 999,
    },
    exCard: {
      borderWidth: 1,
      borderRadius: R.r2,
      padding: 12,
      marginBottom: 10,
    },
    exTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    exThumb: {
      width: 38,
      height: 38,
      borderWidth: 1,
      borderRadius: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    nameInput: {
      flex: 1,
      fontSize: 14,
      fontWeight: '600',
      letterSpacing: 0.3,
      borderBottomWidth: 1,
      paddingVertical: 6,
    },
    del: {
      padding: 4,
    },
    delX: {
      fontSize: 16,
      fontWeight: '700',
    },
    patternWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 12,
    },
    patternCell: {
      width: 40,
      height: 40,
      borderWidth: 1,
      borderRadius: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    exFields: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 14,
      alignItems: 'flex-end',
    },
    setField: {
      flex: 1.4,
      gap: 6,
    },
    smallField: {
      flex: 1,
      gap: 6,
    },
    fieldLbl: {
      fontSize: 9,
    },
    miniInput: {
      borderWidth: 1,
      borderRadius: R.r1,
      paddingVertical: 10,
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '700',
      fontVariant: ['tabular-nums'],
    },
    addRow: {
      borderWidth: 1,
      borderStyle: 'dashed',
      borderRadius: R.r2,
      paddingVertical: 12,
      alignItems: 'center',
      marginBottom: 4,
    },
    addTxt: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1.4,
    },
    doneBtn: {
      marginTop: 16,
    },
  });

const SS = {dark: makeStyles(DARK), light: makeStyles(LIGHT)};
