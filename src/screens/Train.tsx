// Hypertrofit · Entrenar (in-shell). Despacha por rol:
//   atleta    → preparación de la sesión de hoy + Iniciar Sesión (abre el logger fullscreen)
//   entrenador → seguimiento de sesiones de sus atletas (en vivo / programadas / completadas)
//   gym        → actividad en vivo del centro
import React from 'react';
import {View, StyleSheet} from 'react-native';
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
  Button,
  Hairline,
} from '../components/ui';
import {DashHeader, KpiRow, FeedSection} from '../components/Dashboard';
import {useRole} from '../RoleContext';
import {TRAIN_DASH, FeedItem} from '../dashboards';

const PREP = [
  {name: 'Press de Banca', scheme: '3 × 8 · RPE 8'},
  {name: 'Press Inclinado', scheme: '3 × 10'},
  {name: 'Press Militar', scheme: '4 × 8'},
  {name: 'Fondos', scheme: '3 × 12'},
  {name: 'Extensión Tríceps', scheme: '3 × 15'},
];

export function Train({onStart}: {onStart: () => void}) {
  const {role} = useRole();
  const dash = TRAIN_DASH[role];

  if (dash) {
    // Entrenador / gym: al tocar una sesión en vivo se abre el logger (vista de esa sesión).
    const openLive = (item: FeedItem) => {
      if (item.live) onStart();
    };
    return (
      <Screen>
        <DashHeader eyebrow={dash.eyebrow} title={dash.title} />
        <KpiRow kpis={dash.kpis} />
        {dash.sections.map(s => (
          <FeedSection key={s.title} section={s} onItemPress={openLive} />
        ))}
      </Screen>
    );
  }

  return <AthleteTrain onStart={onStart} />;
}

function AthleteTrain({onStart}: {onStart: () => void}) {
  const {scheme, t} = useTheme();
  const styles = SS[scheme];
  return (
    <Screen>
      <Pad y={6}>
        <Eyebrow>VIERNES · WEEK 03 · PHASE 02</Eyebrow>
        <H1 style={{marginTop: 8}}>ENTRENAR</H1>
      </Pad>

      <Pad y={18}>
        <Card style={{padding: 22}}>
          <Eyebrow color={t.cyan}>SESIÓN DE HOY</Eyebrow>
          <H2 style={{marginTop: 10}}>Día de Empuje · A</H2>
          <Meta style={{marginTop: 8}}>5 EJERCICIOS · 64 MIN</Meta>
          <Hairline style={{marginVertical: 18}} />
          <View style={styles.foot}>
            <View>
              <Eyebrow color={t.fg3}>CARGA OBJETIVO</Eyebrow>
              <Num size={28} style={{marginTop: 6}}>
                4,260 <Unit>KG</Unit>
              </Num>
            </View>
            <Button kind="primary" onPress={onStart}>
              Iniciar Sesión
            </Button>
          </View>
        </Card>
      </Pad>

      <Pad y={6}>
        <Eyebrow style={{marginBottom: 12}}>PLAN · DE HOY</Eyebrow>
        <Card style={{padding: 0}}>
          {PREP.map((e, i) => (
            <View
              key={e.name}
              style={[styles.exRow, i < PREP.length - 1 ? styles.rowBorder : null]}>
              <View style={styles.exNum}>
                <Eyebrow color={t.fg3}>{String(i + 1).padStart(2, '0')}</Eyebrow>
              </View>
              <View style={{flex: 1}}>
                <H2 style={{fontSize: 15}}>{e.name}</H2>
                <Meta color={t.fg3} style={{marginTop: 4}}>
                  {e.scheme}
                </Meta>
              </View>
            </View>
          ))}
        </Card>
      </Pad>

      <Pad y={20}>
        <Button kind="primary" full onPress={onStart}>
          Iniciar Sesión
        </Button>
      </Pad>
    </Screen>
  );
}

const makeStyles = (t: Palette) =>
  StyleSheet.create({
  foot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: t.line,
  },
  exNum: {
    width: 28,
    alignItems: 'center',
  },
});

const SS = {dark: makeStyles(DARK), light: makeStyles(LIGHT)};
