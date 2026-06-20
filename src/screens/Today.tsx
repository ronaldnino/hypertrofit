// Hypertrofit · Today — daily dashboard. Ported from ui_kits/mobile/TodayScreen.jsx.
import React from 'react';
import {View, StyleSheet} from 'react-native';
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
  Ring,
  Bar,
  Button,
  IconButton,
  Hairline,
} from '../components/ui';
import {Icon} from '../components/Icon';
import {DashHeader, KpiRow, FeedSection} from '../components/Dashboard';
import {useRole} from '../RoleContext';
import {TODAY_DASH} from '../dashboards';

const WEEK = ['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'];

// Despacha la vista de Hoy según el tipo de usuario.
export function Today({onStart}: {onStart: () => void}) {
  const {role} = useRole();
  const dash = TODAY_DASH[role];
  if (dash) {
    return (
      <Screen>
        <DashHeader eyebrow={dash.eyebrow} title={dash.title} />
        <KpiRow kpis={dash.kpis} />
        {dash.sections.map(s => (
          <FeedSection key={s.title} section={s} />
        ))}
      </Screen>
    );
  }
  return <AthleteToday onStart={onStart} />;
}

function AthleteToday({onStart}: {onStart: () => void}) {
  const {t} = useTheme();
  return (
    <Screen>
      <Pad y={6}>
        <View style={styles.headRow}>
          <View>
            <Eyebrow>VIERNES · SEMANA 03 · FASE 02</Eyebrow>
            <H1 style={{marginTop: 8}}>{'DÍA\nEMPUJE · A'}</H1>
          </View>
          <IconButton size={36}>{Icon.more({color: t.fg1, size: 16})}</IconButton>
        </View>
      </Pad>

      {/* Session hero */}
      <Pad y={20}>
        <Card style={{padding: 22}}>
          <View style={styles.heroRow}>
            <Ring value={62} label="62%" sub="READINESS" color={t.cyan} />
            <View style={{flex: 1}}>
              <Eyebrow color={t.fg3}>SESIÓN 04 DE 16</Eyebrow>
              <H2 style={{marginTop: 10}}>Banca · Inclinado · Press</H2>
              <Meta style={{marginTop: 8}}>5 EJERCICIOS · 64 MIN</Meta>
            </View>
          </View>
          <Hairline style={{marginVertical: 18}} />
          <View style={styles.heroFoot}>
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

      {/* Week overview */}
      <Pad y={4}>
        <Eyebrow style={{marginBottom: 12}}>SEMANA · RESUMEN</Eyebrow>
        <View style={styles.weekRow}>
          {WEEK.map((d, i) => {
            const state = i < 3 ? 'done' : i === 4 ? 'today' : 'planned';
            const bg =
              state === 'done' ? t.cyan : state === 'today' ? t.fg : t.surface2;
            const fg = state === 'planned' ? t.fg3 : t.bg;
            return (
              <View key={d} style={[styles.weekPill, {backgroundColor: bg}]}>
                <Eyebrow color={fg} style={styles.weekPillText}>
                  {d}
                </Eyebrow>
              </View>
            );
          })}
        </View>
      </Pad>

      {/* Recovery signals */}
      <Pad y={4}>
        <Eyebrow style={{marginBottom: 12}}>RECUPERACIÓN · SEÑALES</Eyebrow>
        <Card style={{padding: 16}}>
          <SignalRow label="SUEÑO" value={84} color={t.mint} suffix="7H 48M" />
          <Hairline style={{marginVertical: 14}} />
          <SignalRow label="VFC" value={71} color={t.cyan} suffix="64 MS" />
          <Hairline style={{marginVertical: 14}} />
          <SignalRow label="AGUJETAS" value={28} color={t.warn} suffix="BAJAS" />
        </Card>
      </Pad>

      {/* Coach note */}
      <Pad y={20}>
        <Eyebrow style={{marginBottom: 12}}>NOTAS · RECIENTES</Eyebrow>
        <Card style={{padding: 16}}>
          <Eyebrow color={t.blue}>ENTRENADOR · D. ORTEGA</Eyebrow>
          <Meta color={t.fg1} style={styles.note}>
            Mantén el tempo 3-0-1-0 en banca. Para dos reps antes del fallo.
            Esta semana manda la velocidad de la barra.
          </Meta>
        </Card>
      </Pad>
    </Screen>
  );
}

function SignalRow({
  label,
  value,
  color,
  suffix,
}: {
  label: string;
  value: number;
  color: string;
  suffix: string;
}) {
  const {t} = useTheme();
  return (
    <View style={styles.signalRow}>
      <Meta color={t.fg2} style={{width: 90}}>
        {label}
      </Meta>
      <View style={{flex: 1}}>
        <Bar value={value} color={color} />
      </View>
      <Meta color={t.fg} style={styles.signalSuffix}>
        {suffix}
      </Meta>
    </View>
  );
}

const styles = StyleSheet.create({
  headRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
  },
  heroFoot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    gap: 6,
  },
  weekPill: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 2,
  },
  weekPillText: {
    fontSize: 11,
    letterSpacing: 2,
  },
  signalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  signalSuffix: {
    width: 64,
    textAlign: 'right',
  },
  note: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
    textTransform: 'none',
    fontWeight: '400',
  },
});
