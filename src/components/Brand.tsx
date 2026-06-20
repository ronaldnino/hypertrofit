// Hypertrofit · brand mark. Vector lockup faithful to preview/brand-logo.html:
// ascending-bars glyph + "HYPERTRO·FIT" wordmark (FIT in cyan), wide uppercase tracking.
// Theme-aware so it reads on both carbon and paper canvases.
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Svg, {Rect} from 'react-native-svg';
import {useTheme} from '../ThemeContext';

// Ascending bars — "SURGICAL · ASCENDING · LUCID". Last two bars carry the signal.
export function BrandGlyph({size = 24}: {size?: number}) {
  const {t} = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="15" width="3.6" height="7" fill={t.fg2} />
      <Rect x="7.4" y="11" width="3.6" height="11" fill={t.fg1} />
      <Rect x="12.8" y="6" width="3.6" height="16" fill={t.cyan} />
      <Rect x="18.2" y="2" width="3.6" height="20" fill={t.mint} />
    </Svg>
  );
}

export function Wordmark({size = 18}: {size?: number}) {
  const {t} = useTheme();
  return (
    <Text
      style={[styles.word, {color: t.fg, fontSize: size, letterSpacing: size * 0.14}]}
      allowFontScaling={false}>
      HYPERTRO<Text style={{color: t.cyan}}>FIT</Text>
    </Text>
  );
}

// Full lockup: glyph + wordmark (+ optional tagline).
export function Brand({
  size = 18,
  tagline = false,
}: {
  size?: number;
  tagline?: boolean;
}) {
  const {t} = useTheme();
  return (
    <View style={styles.lockup}>
      <BrandGlyph size={size + 6} />
      <View>
        <Wordmark size={size} />
        {tagline ? (
          <Text style={[styles.tag, {color: t.fg2}]} allowFontScaling={false}>
            QUIRÚRGICO · ASCENDENTE · LÚCIDO
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lockup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  word: {
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  tag: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 4,
  },
});
