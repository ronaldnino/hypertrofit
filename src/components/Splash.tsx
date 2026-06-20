// Hypertrofit · pantalla de carga con la marca. Se muestra mientras los contextos
// (ajustes, rutinas, entrenamientos) cargan desde disco. Toma el relevo de la
// LaunchScreen nativa sin flash, con la marca vectorial y un indicador sutil.
import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {useTheme} from '../ThemeContext';
import {Brand} from './Brand';
import {Eyebrow} from './ui';

export function Splash() {
  const {t} = useTheme();
  return (
    <View style={[styles.root, {backgroundColor: t.bg}]}>
      <Brand size={26} tagline />
      <ActivityIndicator color={t.cyan} style={styles.spinner} />
      <Eyebrow color={t.fg3} style={styles.tag}>
        CARGANDO
      </Eyebrow>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  spinner: {
    marginTop: 44,
  },
  tag: {
    marginTop: 16,
    fontSize: 9,
  },
});
