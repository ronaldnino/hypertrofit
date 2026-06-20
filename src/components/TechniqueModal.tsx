// Hypertrofit · modal de técnica. Se abre al tocar un ejercicio del Plan: muestra el
// pictograma del patrón, nombre, etiqueta de patrón y esquema, y un botón que abre la
// demostración en YouTube (vídeo directo si la prescripción trae ID, o búsqueda si no).
import React from 'react';
import {View, Text, Modal, Pressable, StyleSheet, Linking} from 'react-native';
import {Palette, DARK, LIGHT, R} from '../theme';
import {useTheme} from '../ThemeContext';
import {Button, Eyebrow, Meta} from './ui';
import {ExerciseIcon, PATTERN_LABEL} from './ExerciseIcon';
import {Prescription, youtubeUrl} from '../routines';

export function TechniqueModal({
  exercise,
  accent,
  onClose,
}: {
  exercise: Prescription | null;
  accent: string;
  onClose: () => void;
}) {
  const {scheme, t} = useTheme();
  const styles = SS[scheme];
  const open = !!exercise;

  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* El contenido captura sus propios toques para no cerrar el modal */}
        <Pressable style={styles.sheet} onPress={() => {}}>
          {exercise ? (
            <>
              <View style={styles.grabber} />

              <View style={styles.head}>
                <View style={[styles.thumb, {borderColor: accent}]}>
                  <ExerciseIcon pattern={exercise.pattern} color={accent} size={44} />
                </View>
                <View style={styles.headText}>
                  <Eyebrow color={accent} style={styles.headEyebrow}>
                    {PATTERN_LABEL[exercise.pattern]}
                  </Eyebrow>
                  <Text style={styles.name} allowFontScaling={false}>
                    {exercise.name}
                  </Text>
                </View>
              </View>

              <View style={styles.schemeRow}>
                <SchemeStat t={t} val={`${exercise.sets}`} label="SERIES" />
                <View style={[styles.divider, {backgroundColor: t.line}]} />
                <SchemeStat t={t} val={exercise.reps} label="REPS" />
                <View style={[styles.divider, {backgroundColor: t.line}]} />
                <SchemeStat
                  t={t}
                  val={exercise.rpe ? exercise.rpe : '—'}
                  label="RPE"
                  color={exercise.rpe ? accent : t.fg3}
                />
              </View>

              <Meta color={t.fg3} style={styles.hint}>
                Demostración de la técnica en YouTube
              </Meta>

              <Button
                kind="primary"
                full
                onPress={() => {
                  Linking.openURL(youtubeUrl(exercise));
                  onClose();
                }}>
                Ver técnica ▶
              </Button>
              <Button kind="ghost" full onPress={onClose} style={styles.closeBtn}>
                Cerrar
              </Button>
            </>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function SchemeStat({
  t,
  val,
  label,
  color,
}: {
  t: Palette;
  val: string;
  label: string;
  color?: string;
}) {
  return (
    <View style={schemeStatStyle.wrap}>
      <Text
        style={[schemeStatStyle.val, {color: color ?? t.fg}]}
        allowFontScaling={false}>
        {val}
      </Text>
      <Text style={[schemeStatStyle.label, {color: t.fg3}]} allowFontScaling={false}>
        {label}
      </Text>
    </View>
  );
}

const schemeStatStyle = StyleSheet.create({
  wrap: {flex: 1, alignItems: 'center'},
  val: {fontSize: 22, fontWeight: '800', fontVariant: ['tabular-nums']},
  label: {fontSize: 8, fontWeight: '600', letterSpacing: 1.6, marginTop: 5},
});

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
      paddingBottom: 36,
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
      gap: 14,
    },
    thumb: {
      width: 64,
      height: 64,
      borderWidth: 1,
      borderRadius: R.r2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headText: {
      flex: 1,
    },
    headEyebrow: {
      fontSize: 9,
    },
    name: {
      color: t.fg,
      fontSize: 18,
      fontWeight: '700',
      letterSpacing: 0.5,
      marginTop: 6,
    },
    schemeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: t.line,
      borderRadius: R.r2,
      paddingVertical: 16,
      marginTop: 22,
    },
    divider: {
      width: 1,
      height: 28,
    },
    hint: {
      textAlign: 'center',
      marginTop: 18,
      marginBottom: 14,
    },
    closeBtn: {
      marginTop: 10,
    },
  });

const SS = {dark: makeStyles(DARK), light: makeStyles(LIGHT)};
