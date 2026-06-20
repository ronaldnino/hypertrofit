// Hypertrofit · piezas reutilizables para los paneles de entrenador / gym. Theme-aware.
// KPIs, secciones tipo feed (atletas/entrenadores en seguimiento) y mini-gráfica de barras.
import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {Palette, DARK, LIGHT} from '../theme';
import {useTheme} from '../ThemeContext';
import {Pad, Eyebrow, H1, Meta, Num, Card} from './ui';
import {Icon} from './Icon';
import {Kpi, FeedItem, FeedSectionData} from '../dashboards';

export function DashHeader({eyebrow, title}: {eyebrow: string; title: string}) {
  return (
    <Pad y={6}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <H1 style={{marginTop: 8}}>{title}</H1>
    </Pad>
  );
}

export function KpiRow({kpis}: {kpis: Kpi[]}) {
  const {scheme, t} = useTheme();
  const styles = SS[scheme];
  return (
    <Pad y={18}>
      <View style={styles.kpiRow}>
        {kpis.map(k => (
          <Card key={k.label} style={styles.kpiCard}>
            <Eyebrow color={t.fg3}>{k.label}</Eyebrow>
            <View style={styles.kpiValue}>
              <Num size={26}>{k.val}</Num>
              {k.unit ? <Meta color={t.fg2}>{k.unit}</Meta> : null}
            </View>
            {k.delta ? (
              <Meta color={k.up ? t.mint : t.warn} style={{marginTop: 6}}>
                {k.delta}
              </Meta>
            ) : null}
          </Card>
        ))}
      </View>
    </Pad>
  );
}

export function FeedSection({
  section,
  onItemPress,
}: {
  section: FeedSectionData;
  onItemPress?: (item: FeedItem) => void;
}) {
  const {t} = useTheme();
  return (
    <Pad y={6}>
      <View style={baseStyles.sectionHead}>
        <Eyebrow>{section.title}</Eyebrow>
        {section.note ? <Meta color={t.fg3}>{section.note}</Meta> : null}
      </View>
      <Card style={{padding: 0}}>
        {section.items.map((it, i) => (
          <FeedRow
            key={it.id}
            item={it}
            border={i < section.items.length - 1}
            onPress={onItemPress ? () => onItemPress(it) : undefined}
          />
        ))}
      </Card>
    </Pad>
  );
}

function FeedRow({
  item,
  border,
  onPress,
}: {
  item: FeedItem;
  border: boolean;
  onPress?: () => void;
}) {
  const {scheme, t} = useTheme();
  const styles = SS[scheme];
  const accent = t[item.accent];
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.row,
        border ? styles.rowBorder : null,
        {opacity: pressed && onPress ? 0.7 : 1},
      ]}>
      <View style={[styles.avatar, {borderColor: accent}]}>
        <Text style={[styles.initials, {color: accent}]} allowFontScaling={false}>
          {item.initials}
        </Text>
      </View>
      <View style={{flex: 1}}>
        <View style={styles.titleRow}>
          {item.live ? <View style={styles.liveDot} /> : null}
          <Text style={styles.title} allowFontScaling={false}>
            {item.title}
          </Text>
        </View>
        <Meta color={t.fg3} style={{marginTop: 3}}>
          {item.sub}
        </Meta>
      </View>
      <View style={styles.right}>
        <Num size={16} color={accent}>
          {item.right}
        </Num>
        {item.rightLabel ? (
          <Meta color={t.fg3} style={styles.rightLabel}>
            {item.rightLabel}
          </Meta>
        ) : null}
      </View>
      {Icon.next({color: t.fg3, size: 16})}
    </Pressable>
  );
}

// Mini-gráfica de barras (tendencias agregadas: adherencia, volumen, etc.)
export function MiniBars({
  data,
  peakColor,
}: {
  data: {label: string; value: number}[];
  peakColor?: string;
}) {
  const {scheme, t} = useTheme();
  const styles = SS[scheme];
  const peak = Math.max(...data.map(d => d.value));
  return (
    <View style={styles.chart}>
      {data.map(d => {
        const h = (d.value / peak) * 100;
        const top = d.value === peak;
        return (
          <View key={d.label} style={styles.col}>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {height: `${h}%`, backgroundColor: top ? peakColor ?? t.cyan : t.surface3},
                ]}
              />
            </View>
            <Text style={styles.colLabel} allowFontScaling={false}>
              {d.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const baseStyles = StyleSheet.create({
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});

const makeStyles = (t: Palette) =>
  StyleSheet.create({
    kpiRow: {
      flexDirection: 'row',
      gap: 10,
    },
    kpiCard: {
      flex: 1,
      padding: 14,
    },
    kpiValue: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 4,
      marginTop: 8,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      padding: 14,
    },
    rowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: t.line,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 4,
      backgroundColor: t.surface2,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    initials: {
      fontWeight: '800',
      fontSize: 13,
      letterSpacing: 1,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },
    liveDot: {
      width: 6,
      height: 6,
      borderRadius: 999,
      backgroundColor: t.cyan,
    },
    title: {
      color: t.fg,
      fontWeight: '600',
      fontSize: 14,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    right: {
      alignItems: 'flex-end',
      marginRight: 10,
    },
    rightLabel: {
      marginTop: 2,
      fontSize: 9,
    },
    chart: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      height: 140,
      gap: 6,
    },
    col: {
      flex: 1,
      alignItems: 'center',
    },
    barTrack: {
      width: '100%',
      height: 120,
      backgroundColor: t.surface1,
      justifyContent: 'flex-end',
      overflow: 'hidden',
    },
    barFill: {
      width: '100%',
    },
    colLabel: {
      color: t.fg3,
      fontSize: 9,
      fontWeight: '600',
      letterSpacing: 1,
      marginTop: 8,
      textTransform: 'uppercase',
    },
  });

const SS = {dark: makeStyles(DARK), light: makeStyles(LIGHT)};
