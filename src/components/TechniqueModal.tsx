// Hypertrofit · modal de técnica con dos pestañas:
//   VÍDEO → reproductor de YouTube incrustado (IFrame API vía WebView, sin salir de la app)
//   GUÍA  → imagen profesional del ejercicio (free-exercise-db) + pasos de técnica en español
// Cabecera compartida (nombre, patrón, esquema). Fallbacks si falta vídeo o guía.
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Linking,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';
import {Palette, DARK, LIGHT, R} from '../theme';
import {useTheme} from '../ThemeContext';
import {Button, Eyebrow, Meta} from './ui';
import {ExerciseIcon, PATTERN_LABEL} from './ExerciseIcon';
import {Prescription, youtubeId, youtubeSearchUrl, guideFor} from '../routines';

type Tab = 'video' | 'guide';

// Reproductor de YouTube incrustado (IFrame Player API oficial vía
// react-native-youtube-iframe, reproducción inline dentro de la app).
function YouTubePlayer({
  id,
  width,
  onReady,
  onError,
}: {
  id: string;
  width: number;
  onReady: () => void;
  onError: () => void;
}) {
  const height = Math.round((width * 9) / 16);
  return (
    <YoutubePlayer
      videoId={id}
      width={width}
      height={height}
      play={false}
      onReady={onReady}
      onError={onError}
      initialPlayerParams={{modestbranding: true, rel: false}}
      webViewProps={{allowsInlineMediaPlayback: true}}
    />
  );
}

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
  const {width: winW} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const styles = SS[scheme];
  const open = !!exercise;
  const id = exercise ? youtubeId(exercise) : undefined;
  const guide = exercise ? guideFor(exercise) : undefined;
  const mediaW = winW - 40 - 2; // ancho del sheet (padding 20×2) menos los bordes
  const mediaH = Math.round((mediaW * 9) / 16);

  // Pestaña activa + estado del reproductor; se reinician al abrir otro ejercicio.
  const [tab, setTab] = useState<Tab>('video');
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  useEffect(() => {
    if (exercise) {
      setTab(youtubeId(exercise) ? 'video' : 'guide');
      setVideoReady(false);
      setVideoError(false);
    }
  }, [exercise]);

  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* El contenido captura sus propios toques para no cerrar el modal */}
        <Pressable
          style={[styles.sheet, {paddingBottom: 36 + insets.bottom}]}
          onPress={() => {}}>
          {exercise ? (
            <>
              <View style={styles.grabber} />

              {/* Cabecera compartida */}
              <View style={styles.head}>
                <View style={styles.headText}>
                  <Eyebrow color={accent} style={styles.headEyebrow}>
                    {PATTERN_LABEL[exercise.pattern]}
                  </Eyebrow>
                  <Text style={styles.name} allowFontScaling={false}>
                    {exercise.name}
                  </Text>
                </View>
                <View style={styles.schemeBox}>
                  <Text style={styles.schemeVal} allowFontScaling={false}>
                    {exercise.sets} × {exercise.reps}
                  </Text>
                  {exercise.rpe ? (
                    <Text style={[styles.schemeRpe, {color: accent}]} allowFontScaling={false}>
                      RPE {exercise.rpe}
                    </Text>
                  ) : null}
                </View>
              </View>

              {/* Selector de pestañas */}
              <View style={[styles.tabs, {borderColor: t.lineStrong}]}>
                <TabButton
                  label="Vídeo"
                  active={tab === 'video'}
                  accent={accent}
                  onPress={() => setTab('video')}
                />
                <TabButton
                  label="Guía"
                  active={tab === 'guide'}
                  accent={accent}
                  onPress={() => setTab('guide')}
                />
              </View>

              {/* Contenido de la pestaña */}
              {tab === 'video' ? (
                id && !videoError ? (
                  <View style={[styles.media, {borderColor: t.line, height: mediaH}]}>
                    <YouTubePlayer
                      id={id}
                      width={mediaW}
                      onReady={() => setVideoReady(true)}
                      onError={() => setVideoError(true)}
                    />
                    {!videoReady ? (
                      <View style={[styles.loading, {backgroundColor: t.surface2}]}>
                        <ActivityIndicator color={accent} />
                      </View>
                    ) : null}
                  </View>
                ) : (
                  <View style={[styles.placeholder, {borderColor: t.line, height: mediaH}]}>
                    <ExerciseIcon pattern={exercise.pattern} color={accent} size={48} />
                    <Meta color={t.fg3} style={styles.phText}>
                      {videoError
                        ? 'No se pudo cargar el vídeo'
                        : 'Sin vídeo para este ejercicio'}
                    </Meta>
                  </View>
                )
              ) : guide ? (
                <ScrollView
                  style={[styles.guideScroll, {maxHeight: winW * 1.15}]}
                  showsVerticalScrollIndicator={false}>
                  <Image
                    source={{uri: guide.image}}
                    style={[styles.guideImg, {width: mediaW, height: mediaH, borderColor: t.line}]}
                    resizeMode="contain"
                  />
                  <View style={styles.steps}>
                    {guide.steps.map((s, i) => (
                      <View key={i} style={styles.step}>
                        <Text style={[styles.stepNum, {color: accent, borderColor: accent}]} allowFontScaling={false}>
                          {i + 1}
                        </Text>
                        <Text style={[styles.stepText, {color: t.fg1}]} allowFontScaling={false}>
                          {s}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <Meta color={t.fgMute} style={styles.credit}>
                    Imagen · free-exercise-db
                  </Meta>
                </ScrollView>
              ) : (
                <View style={[styles.placeholder, {borderColor: t.line, height: mediaH}]}>
                  <ExerciseIcon pattern={exercise.pattern} color={accent} size={48} />
                  <Meta color={t.fg3} style={styles.phText}>
                    Sin guía para este ejercicio
                  </Meta>
                </View>
              )}

              {/* Acción de fallback (si no hay vídeo incrustado o falló la carga) */}
              {!id || videoError ? (
                <Button
                  kind="secondary"
                  full
                  onPress={() => {
                    Linking.openURL(youtubeSearchUrl(exercise));
                  }}
                  style={styles.searchBtn}>
                  Buscar en YouTube ▶
                </Button>
              ) : null}

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

function TabButton({
  label,
  active,
  accent,
  onPress,
}: {
  label: string;
  active: boolean;
  accent: string;
  onPress: () => void;
}) {
  const {scheme, t} = useTheme();
  const styles = SS[scheme];
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tab, active ? {borderBottomColor: accent} : styles.tabInactive]}>
      <Text
        style={[styles.tabLabel, {color: active ? t.fg : t.fg3}]}
        allowFontScaling={false}>
        {label}
      </Text>
    </Pressable>
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
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 14,
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
    schemeBox: {
      alignItems: 'flex-end',
    },
    schemeVal: {
      color: t.fg,
      fontSize: 15,
      fontWeight: '700',
      letterSpacing: 0.6,
      fontVariant: ['tabular-nums'],
    },
    schemeRpe: {
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1.2,
      marginTop: 4,
    },
    tabs: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      marginTop: 18,
      marginBottom: 16,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderBottomWidth: 2,
      marginBottom: -1,
    },
    tabInactive: {
      borderBottomColor: 'transparent',
    },
    tabLabel: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 2,
      textTransform: 'uppercase',
    },
    media: {
      alignSelf: 'center',
      width: '100%',
      borderWidth: 1,
      borderRadius: R.r2,
      overflow: 'hidden',
      backgroundColor: '#000000',
    },
    loading: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeholder: {
      width: '100%',
      borderWidth: 1,
      borderRadius: R.r2,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      backgroundColor: t.surface2,
    },
    phText: {
      textAlign: 'center',
    },
    guideScroll: {
      alignSelf: 'stretch',
    },
    guideImg: {
      alignSelf: 'center',
      borderWidth: 1,
      borderRadius: R.r2,
      backgroundColor: '#FFFFFF',
    },
    steps: {
      gap: 12,
      marginTop: 18,
    },
    step: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    stepNum: {
      width: 20,
      height: 20,
      borderWidth: 1,
      borderRadius: R.full,
      textAlign: 'center',
      lineHeight: 19,
      fontSize: 11,
      fontWeight: '800',
      fontVariant: ['tabular-nums'],
    },
    stepText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 19,
      letterSpacing: 0.2,
    },
    credit: {
      fontSize: 9,
      marginTop: 16,
    },
    searchBtn: {
      marginTop: 18,
    },
    closeBtn: {
      marginTop: 10,
    },
  });

const SS = {dark: makeStyles(DARK), light: makeStyles(LIGHT)};
