// Hypertrofit · pictogramas de ejercicio por patrón de movimiento (line icons, stroke 1.6).
// Esquemáticos y on-brand; dan una idea rápida del gesto. El nombre + la etiqueta de patrón
// (PATTERN_LABEL) completan el significado.
import React from 'react';
import Svg, {Path, Circle} from 'react-native-svg';

export type Pattern =
  | 'pushH'
  | 'pushV'
  | 'pullV'
  | 'pullH'
  | 'squat'
  | 'hinge'
  | 'hipext'
  | 'curl'
  | 'ext'
  | 'lateral'
  | 'fly'
  | 'legcurl'
  | 'calf';

export const PATTERN_LABEL: Record<Pattern, string> = {
  pushH: 'EMPUJE HORIZONTAL',
  pushV: 'EMPUJE VERTICAL',
  pullV: 'TIRÓN VERTICAL',
  pullH: 'TIRÓN HORIZONTAL',
  squat: 'SENTADILLA',
  hinge: 'BISAGRA DE CADERA',
  hipext: 'EXTENSIÓN DE CADERA',
  curl: 'FLEXIÓN DE CODO',
  ext: 'EXTENSIÓN DE CODO',
  lateral: 'ELEVACIÓN LATERAL',
  fly: 'APERTURA',
  legcurl: 'CURL FEMORAL',
  calf: 'GEMELO',
};

const sw = 1.6;

const GLYPH: Record<Pattern, React.ReactNode> = {
  // banca / press horizontal — barra sobre banco
  pushH: (
    <>
      <Path d="M5 16h14M7 16v4M17 16v4" />
      <Path d="M3 9h18M3 7v4M21 7v4M8 9v3M16 9v3" />
    </>
  ),
  // press militar — figura empujando hacia arriba
  pushV: (
    <>
      <Circle cx="12" cy="17.5" r="2" />
      <Path d="M12 19v-5M12 14l-4-4M12 14l4-4" />
      <Path d="M5 9h14M5 7v4M19 7v4" />
    </>
  ),
  // dominada / jalón — barra alta y cuerpo colgando
  pullV: (
    <>
      <Path d="M3 4h18M9 4v3M15 4v3" />
      <Circle cx="12" cy="10" r="2" />
      <Path d="M12 12v5M12 17l-3 4M12 17l3 4" />
    </>
  ),
  // remo — torso inclinado tirando
  pullH: (
    <>
      <Circle cx="5" cy="8" r="2" />
      <Path d="M6.5 9l6.5 4M11 12h7M13 13l-1 7" />
      <Path d="M18 9v8" />
    </>
  ),
  // sentadilla — barra en hombros, piernas flexionadas
  squat: (
    <>
      <Circle cx="12" cy="5" r="2" />
      <Path d="M6 9h12M6 7v4M18 7v4" />
      <Path d="M12 9v3M12 12l-4 3 1 6M12 12l4 3-1 6" />
    </>
  ),
  // peso muerto / RDL — bisagra de cadera con barra baja
  hinge: (
    <>
      <Circle cx="6" cy="6" r="2" />
      <Path d="M7.5 7.5L15 11M15 11v6M14 11v9" />
      <Path d="M9 18h11M9 16v4M20 16v4" />
    </>
  ),
  // hip thrust — puente con barra en cadera
  hipext: (
    <>
      <Path d="M3 13l7-4 5 4M15 13v6" />
      <Circle cx="10" cy="7" r="1.6" />
      <Path d="M7 7h6" />
    </>
  ),
  // curl — brazo flexionando con mancuerna
  curl: (
    <>
      <Circle cx="9" cy="5" r="1.6" />
      <Path d="M9 6.5V13l5-4" />
      <Path d="M13 7l3 4M14.5 6l1.5 2M14.5 12l1.5-2" />
    </>
  ),
  // tríceps en polea — cable arriba, antebrazos extendiendo
  ext: (
    <>
      <Path d="M12 3v5M8 8h8" />
      <Path d="M9 8v6M15 8v6M9 14h-1M15 14h1" />
    </>
  ),
  // elevación lateral — brazos en cruz con peso
  lateral: (
    <>
      <Circle cx="12" cy="6" r="2" />
      <Path d="M12 8v8M12 10H4M12 10h8" />
      <Circle cx="4" cy="10" r="1.4" />
      <Circle cx="20" cy="10" r="1.4" />
    </>
  ),
  // apertura en polea — arco de brazos hacia el frente
  fly: (
    <>
      <Circle cx="12" cy="5" r="2" />
      <Path d="M12 7v8" />
      <Path d="M5 10q7 6 14 0" />
      <Circle cx="5" cy="10" r="1.4" />
      <Circle cx="19" cy="10" r="1.4" />
    </>
  ),
  // curl femoral — máquina, pierna flexionando
  legcurl: (
    <>
      <Path d="M3 10h9M3 10v6" />
      <Path d="M12 10q7 0 3 7" />
      <Circle cx="15" cy="17" r="1.6" />
    </>
  ),
  // gemelo — pie en punta sobre el suelo
  calf: (
    <>
      <Path d="M11 3v12M11 15h7M18 15v-4" />
      <Path d="M5 20h14" />
    </>
  ),
};

export function ExerciseIcon({
  pattern,
  color = '#C0C0C0',
  size = 22,
}: {
  pattern: Pattern;
  color?: string;
  size?: number;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round">
      {GLYPH[pattern]}
    </Svg>
  );
}
