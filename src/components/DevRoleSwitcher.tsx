// Hypertrofit · DEV ONLY — selector temporal de tipo de usuario. Theme-aware.
// Permite switchear entre atleta / entrenador / gym para revisar los cambios.
// TODO: quitar antes de producción (se reemplaza por login/roles reales).
import React, {useState} from 'react';
import {View, Text, Pressable, Modal, StyleSheet} from 'react-native';
import {Palette, DARK, LIGHT, R} from '../theme';
import {useTheme} from '../ThemeContext';
import {useRole} from '../RoleContext';
import {Role, ROLE_ORDER, ROLE_META} from '../roles';
import {Eyebrow, Meta} from './ui';

export function DevRoleSwitcher() {
  const {role, setRole} = useRole();
  const {scheme, t} = useTheme();
  const styles = SS[scheme];
  const [open, setOpen] = useState(false);
  const meta = ROLE_META[role];

  const pick = (r: Role) => {
    setRole(r);
    setOpen(false);
  };

  return (
    <>
      {/* Botón flotante */}
      <Pressable
        onPress={() => setOpen(true)}
        style={({pressed}) => [styles.fab, {opacity: pressed ? 0.8 : 1}]}>
        <View style={styles.devTag}>
          <Text style={styles.devTagText} allowFontScaling={false}>
            DEV
          </Text>
        </View>
        <View style={[styles.dot, {backgroundColor: t[meta.color]}]} />
        <Text style={styles.fabLabel} allowFontScaling={false}>
          {meta.label}
        </Text>
      </Pressable>

      {/* Menú de tipos de usuario */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHead}>
              <Eyebrow color={t.fg3}>DEV · TIPO DE USUARIO</Eyebrow>
              <Meta color={t.fg3}>SWITCH DE PERFIL</Meta>
            </View>
            {ROLE_ORDER.map(r => {
              const m = ROLE_META[r];
              const mc = t[m.color];
              const on = r === role;
              return (
                <Pressable
                  key={r}
                  onPress={() => pick(r)}
                  style={({pressed}) => [
                    styles.option,
                    {
                      borderColor: on ? mc : t.line,
                      backgroundColor: on ? t.activeRow : 'transparent',
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}>
                  <View style={[styles.optDot, {backgroundColor: mc}]} />
                  <View style={{flex: 1}}>
                    <Text style={styles.optLabel} allowFontScaling={false}>
                      {m.label}
                    </Text>
                    <Meta color={t.fg3} style={{marginTop: 4}}>
                      {m.desc}
                    </Meta>
                  </View>
                  {on ? <Eyebrow color={mc}>ACTIVO</Eyebrow> : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const makeStyles = (t: Palette) =>
  StyleSheet.create({
    fab: {
      position: 'absolute',
      right: 16,
      bottom: 84,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: t.surface2,
      borderWidth: 1,
      borderColor: t.lineStrong,
      borderRadius: R.full,
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    devTag: {
      backgroundColor: t.warn,
      borderRadius: R.r1,
      paddingHorizontal: 5,
      paddingVertical: 2,
    },
    devTagText: {
      color: t.onAccent,
      fontSize: 8,
      fontWeight: '800',
      letterSpacing: 1.5,
    },
    dot: {
      width: 7,
      height: 7,
      borderRadius: R.full,
    },
    fabLabel: {
      color: t.fg,
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1.6,
    },
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: t.surface1,
      borderTopWidth: 1,
      borderTopColor: t.lineStrong,
      padding: 20,
      paddingBottom: 36,
      gap: 10,
    },
    sheetHead: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      borderWidth: 1,
      borderRadius: R.r2,
      padding: 16,
    },
    optDot: {
      width: 10,
      height: 10,
      borderRadius: R.full,
    },
    optLabel: {
      color: t.fg,
      fontSize: 14,
      fontWeight: '700',
      letterSpacing: 1.4,
      textTransform: 'uppercase',
    },
  });

const SS = {dark: makeStyles(DARK), light: makeStyles(LIGHT)};
