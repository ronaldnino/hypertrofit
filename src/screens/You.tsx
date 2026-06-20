// Hypertrofit · Tú — perfil concentrado, adaptado al tipo de usuario activo.
//   atleta    → su perfil + levantamientos clave + su equipo (entrenador / gym)
//   entrenador → su perfil + roster de atletas que sigue + su gym
//   gym        → su perfil + roster de entrenadores + roster de atletas
import React from 'react';
import {View, Text, Pressable, StyleSheet, Share, Alert} from 'react-native';
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
  Card,
  Hairline,
} from '../components/ui';
import {Icon} from '../components/Icon';
import {useRole} from '../RoleContext';
import {useSettings, ThemeMode} from '../SettingsContext';
import {useWorkouts} from '../WorkoutContext';
import {useRoutines} from '../RoutinesContext';
import {unitLabel} from '../units';
import {PROFILES, RosterEntry, Relation, LiftEntry} from '../roles';

const THEME_OPTS: {mode: ThemeMode; label: string}[] = [
  {mode: 'system', label: 'SISTEMA'},
  {mode: 'light', label: 'CLARO'},
  {mode: 'dark', label: 'OSCURO'},
];
const REST_OPTS = [60, 90, 120, 150];

export function You() {
  const {role} = useRole();
  const {scheme, t} = useTheme();
  const styles = SS[scheme];
  const p = PROFILES[role];
  const {settings, setThemeMode, setUnits, setRestDefault} = useSettings();
  const {sessions, clearSessions} = useWorkouts();
  const {reset: resetRoutines} = useRoutines();

  // Avanza al siguiente valor de una lista (selector cíclico).
  const next = <T,>(arr: T[], cur: T) => arr[(arr.indexOf(cur) + 1) % arr.length];
  const themeLabel =
    THEME_OPTS.find(o => o.mode === settings.themeMode)?.label ?? 'SISTEMA';

  const cycleTheme = () =>
    setThemeMode(next(THEME_OPTS.map(o => o.mode), settings.themeMode));
  const cycleUnits = () => setUnits(settings.units === 'kg' ? 'lb' : 'kg');
  const cycleRest = () => setRestDefault(next(REST_OPTS, settings.restDefault));

  const exportData = async () => {
    if (sessions.length === 0) {
      Alert.alert('Sin datos', 'Aún no tienes entrenamientos para exportar.');
      return;
    }
    try {
      await Share.share({
        title: 'Hypertrofit · entrenamientos',
        message: JSON.stringify(sessions, null, 2),
      });
    } catch {
      // el usuario canceló el diálogo de compartir
    }
  };

  const confirmClear = () =>
    Alert.alert(
      'Borrar datos',
      'Se eliminarán tus entrenamientos registrados y se restablecerán las rutinas a las de fábrica. Esta acción no se puede deshacer.',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: () => {
            clearSessions();
            resetRoutines();
          },
        },
      ],
    );

  return (
    <Screen>
      <Pad y={6}>
        <Eyebrow>{p.eyebrow}</Eyebrow>
        <H1 style={{marginTop: 8}}>TÚ</H1>
      </Pad>

      {/* Identidad */}
      <Pad y={18}>
        <Card style={{padding: 20}}>
          <View style={styles.profile}>
            <View style={[styles.avatar, {borderColor: t[p.color]}]}>
              <Text style={[styles.avatarText, {color: t[p.color]}]} allowFontScaling={false}>
                {p.initials}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <H2>{p.name}</H2>
              <Meta color={t.fg2} style={{marginTop: 6}}>
                {p.meta}
              </Meta>
            </View>
          </View>

          <Hairline style={{marginVertical: 18}} />

          <View style={styles.statsRow}>
            {p.stats.map(s => (
              <View key={s.label}>
                <Eyebrow color={t.fg3}>{s.label}</Eyebrow>
                <View style={styles.statValue}>
                  <Num size={22}>{s.val}</Num>
                  {s.unit ? <Meta color={t.fg2}>{s.unit}</Meta> : null}
                </View>
              </View>
            ))}
          </View>
        </Card>
      </Pad>

      {/* ── Entrenador: roster de atletas ── */}
      {p.athletes && role === 'coach' ? (
        <RosterSection title="MIS · ATLETAS" count={p.athletes.length} entries={p.athletes} />
      ) : null}

      {/* ── Gym: entrenadores + atletas ── */}
      {p.coaches && role === 'gym' ? (
        <RosterSection title="ENTRENADORES" count={p.coaches.length} entries={p.coaches} />
      ) : null}
      {p.athletes && role === 'gym' ? (
        <RosterSection title="ATLETAS" count={p.athletes.length} entries={p.athletes} />
      ) : null}

      {/* ── Atleta: levantamientos clave ── */}
      {p.lifts ? <LiftsSection lifts={p.lifts} /> : null}

      {/* Relaciones hacia arriba (mi entrenador / mi gym) */}
      {p.relations ? <RelationsSection relations={p.relations} /> : null}

      {/* Ajustes (funcionales) */}
      <Pad y={20}>
        <Eyebrow style={{marginBottom: 12}}>AJUSTES</Eyebrow>
        <Card style={{padding: 0}}>
          <SettingRow label="APARIENCIA" value={themeLabel} onPress={cycleTheme} />
          <SettingRow label="UNIDADES" value={unitLabel(settings.units)} onPress={cycleUnits} />
          <SettingRow
            label="DESCANSO · POR DEFECTO"
            value={`${settings.restDefault} SEG`}
            onPress={cycleRest}
            last
          />
        </Card>
        <Meta color={t.fg3} style={{marginTop: 10}}>
          Toca para cambiar · se aplica al instante en toda la app
        </Meta>
      </Pad>

      {/* Datos */}
      <Pad y={6}>
        <Eyebrow style={{marginBottom: 12}}>DATOS</Eyebrow>
        <Card style={{padding: 0}}>
          <SettingRow
            label="EXPORTAR ENTRENAMIENTOS"
            value={`${sessions.length}`}
            onPress={exportData}
          />
          <SettingRow label="BORRAR DATOS" onPress={confirmClear} danger last />
        </Card>
      </Pad>
    </Screen>
  );
}

function SettingRow({
  label,
  value,
  onPress,
  danger,
  last,
}: {
  label: string;
  value?: string;
  onPress: () => void;
  danger?: boolean;
  last?: boolean;
}) {
  const {scheme, t} = useTheme();
  const styles = SS[scheme];
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.settingRow,
        !last ? styles.rowBorder : null,
        {opacity: pressed ? 0.6 : 1},
      ]}>
      <Meta color={danger ? t.danger : t.fg2} style={{flex: 1}}>
        {label}
      </Meta>
      {value ? <Meta color={danger ? t.danger : t.fg}>{value}</Meta> : null}
      <View style={{marginLeft: 12}}>
        {Icon.next({color: danger ? t.danger : t.fg3, size: 16})}
      </View>
    </Pressable>
  );
}

function RosterSection({
  title,
  count,
  entries,
}: {
  title: string;
  count: number;
  entries: RosterEntry[];
}) {
  const {scheme, t} = useTheme();
  const styles = SS[scheme];
  return (
    <Pad y={6}>
      <View style={styles.sectionHead}>
        <Eyebrow>{title}</Eyebrow>
        <Meta color={t.fg3}>{count} TOTAL</Meta>
      </View>
      <Card style={{padding: 0}}>
        {entries.map((e, i) => (
          <Pressable
            key={e.id}
            style={({pressed}) => [
              styles.rosterRow,
              i < entries.length - 1 ? styles.rowBorder : null,
              {opacity: pressed ? 0.7 : 1},
            ]}>
            <View style={[styles.rosterAvatar, {borderColor: t[e.accent]}]}>
              <Text style={[styles.rosterInitials, {color: t[e.accent]}]} allowFontScaling={false}>
                {e.initials}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.rosterName} allowFontScaling={false}>
                {e.name}
              </Text>
              <Meta color={t.fg3} style={{marginTop: 3}}>
                {e.sub}
              </Meta>
            </View>
            <View style={{alignItems: 'flex-end', marginRight: 10}}>
              <Num size={16} color={t[e.accent]}>
                {e.metric}
              </Num>
              <Meta color={t.fg3} style={{marginTop: 2, fontSize: 9}}>
                {e.metricLabel}
              </Meta>
            </View>
            {Icon.next({color: t.fg3, size: 16})}
          </Pressable>
        ))}
      </Card>
    </Pad>
  );
}

function LiftsSection({lifts}: {lifts: LiftEntry[]}) {
  const {scheme, t} = useTheme();
  const styles = SS[scheme];
  return (
    <Pad y={6}>
      <Eyebrow style={{marginBottom: 12}}>LEVANTAMIENTOS · CLAVE</Eyebrow>
      <Card style={{padding: 0}}>
        {lifts.map((l, i) => (
          <View
            key={l.lift}
            style={[styles.liftRow, i < lifts.length - 1 ? styles.rowBorder : null]}>
            <Text style={styles.liftName} allowFontScaling={false}>
              {l.lift}
            </Text>
            <Num size={18} style={{marginRight: 8}}>
              {l.val}
            </Num>
            <Meta color={t.fg2} style={{width: 28}}>
              {l.unit}
            </Meta>
            <Meta color={t.mint} style={styles.liftDelta}>
              {l.delta}
            </Meta>
          </View>
        ))}
      </Card>
    </Pad>
  );
}

function RelationsSection({relations}: {relations: Relation[]}) {
  const {scheme, t} = useTheme();
  const styles = SS[scheme];
  return (
    <Pad y={6}>
      <Eyebrow style={{marginBottom: 12}}>JERARQUÍA</Eyebrow>
      <View style={{gap: 10}}>
        {relations.map(r => (
          <Card key={r.label}>
            <Eyebrow color={t.fg3} style={{marginBottom: 12}}>
              {r.label}
            </Eyebrow>
            <View style={styles.relationRow}>
              <View style={styles.relAvatar}>
                <Text style={styles.relInitials} allowFontScaling={false}>
                  {r.initials}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.relName} allowFontScaling={false}>
                  {r.name}
                </Text>
                <Meta color={t.fg3} style={{marginTop: 3}}>
                  {r.sub}
                </Meta>
              </View>
              {Icon.next({color: t.fg3, size: 16})}
            </View>
          </Card>
        ))}
      </View>
    </Pad>
  );
}

const makeStyles = (t: Palette) =>
  StyleSheet.create({
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 4,
    backgroundColor: t.surface2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontWeight: '800',
    fontSize: 22,
    letterSpacing: 1.5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 6,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rosterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
  },
  rosterAvatar: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: t.surface2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rosterInitials: {
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },
  rosterName: {
    color: t.fg,
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: t.line,
  },
  liftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  liftName: {
    flex: 1,
    color: t.fg,
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  liftDelta: {
    width: 64,
    textAlign: 'right',
  },
  relationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  relAvatar: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: t.surface2,
    borderWidth: 1,
    borderColor: t.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  relInitials: {
    color: t.fg1,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },
  relName: {
    color: t.fg,
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
});

const SS = {dark: makeStyles(DARK), light: makeStyles(LIGHT)};
