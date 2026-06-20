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

const sw = 1.7;

// Implementos reutilizables (devuelven el atributo "d" de un <Path>).
// barbell: barra horizontal con dos discos cerca de los extremos.
const barbell = (y: number, x1: number, x2: number) => {
  const p1 = x1 + 1.6;
  const p2 = x2 - 1.6;
  return `M${x1} ${y}H${x2}M${p1} ${y - 2.4}v4.8M${p2} ${y - 2.4}v4.8M${x1} ${
    y - 1.4
  }v2.8M${x2} ${y - 1.4}v2.8`;
};
// dumbbell: mancuerna corta centrada en (cx,cy), inclinada `ang` grados.
const dumbbell = (cx: number, cy: number, ang = 0, half = 3.2, t = 1.6) => {
  const a = (ang * Math.PI) / 180;
  const dx = Math.cos(a) * half;
  const dy = Math.sin(a) * half;
  const x1 = cx - dx;
  const y1 = cy - dy;
  const x2 = cx + dx;
  const y2 = cy + dy;
  const px = Math.cos(a + Math.PI / 2) * t;
  const py = Math.sin(a + Math.PI / 2) * t;
  const f = (n: number) => n.toFixed(1);
  return `M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}M${f(x1 - px)} ${f(
    y1 - py,
  )}l${f(2 * px)} ${f(2 * py)}M${f(x2 - px)} ${f(y2 - py)}l${f(2 * px)} ${f(
    2 * py,
  )}`;
};

const GLYPH: Record<Pattern, React.ReactNode> = {
  // press de banca — figura tumbada en banco empujando la barra hacia arriba
  pushH: (
    <>
      <Circle cx="5" cy="14.5" r="1.8" />
      <Path d="M6.5 15.5h9" />
      <Path d="M4 19h13M6 19v2M15 19v2" />
      <Path d="M12 15.5V10" />
      <Path d={barbell(9, 7, 18)} />
    </>
  ),
  // press militar — de pie empujando la barra sobre la cabeza
  pushV: (
    <>
      <Circle cx="12" cy="9" r="2" />
      <Path d="M12 11v6M12 17l-3 4M12 17l3 4" />
      <Path d="M10 10l-2-5M14 10l2-5" />
      <Path d={barbell(4, 6, 18)} />
    </>
  ),
  // dominada / jalón — colgado de una barra fija alta
  pullV: (
    <>
      <Path d="M4 3h16" />
      <Path d="M9.5 3.5l1 4.5M14.5 3.5l-1 4.5" />
      <Circle cx="12" cy="10" r="2" />
      <Path d="M12 12v6M12 18l-2 4M12 18l2 4" />
    </>
  ),
  // remo — torso inclinado, codo tirando la barra al abdomen
  pullH: (
    <>
      <Circle cx="4" cy="8" r="1.8" />
      <Path d="M5.5 8.6l7 1.2" />
      <Path d="M12.8 10l1.5 9M12.3 10l4.5 8.8" />
      <Path d="M8.2 9l2 4.6" />
      <Path d="M10 13.6h5M14 12.1v3M15.4 12.6v2" />
    </>
  ),
  // sentadilla — barra en hombros, rodillas flexionadas
  squat: (
    <>
      <Circle cx="12" cy="6.5" r="2" />
      <Path d={barbell(9.5, 6, 18)} />
      <Path d="M12 9.5v3M12 12.5l-3.5 3 .5 5.5M12 12.5l3.5 3-.5 5.5" />
    </>
  ),
  // peso muerto / RDL — bisagra de cadera con la barra en el suelo
  hinge: (
    <>
      <Circle cx="6" cy="6" r="2" />
      <Path d="M7.5 7.5L15 11.5" />
      <Path d="M15 11.5l-.5 9M15 11.5l3 9" />
      <Path d="M10 9l1 9" />
      <Path d={barbell(20, 6, 16)} />
    </>
  ),
  // hip thrust — hombros en banco, puente con disco en la cadera
  hipext: (
    <>
      <Path d="M3 11v5" />
      <Circle cx="5" cy="11" r="1.5" />
      <Path d="M6.3 10.8l6.5 -1" />
      <Circle cx="14" cy="10" r="1.7" />
      <Path d="M14.2 11.6l1.6 4.4M15.8 16v3" />
      <Path d="M5 19h13" />
    </>
  ),
  // curl — brazo flexionando con mancuerna
  curl: (
    <>
      <Circle cx="9" cy="4.5" r="1.8" />
      <Path d="M9 6.5v7" />
      <Path d="M9 9l5 1.5" />
      <Path d={dumbbell(15, 13, 70, 2.8, 1.5)} />
    </>
  ),
  // tríceps — extensión con mancuerna por encima de la cabeza
  ext: (
    <>
      <Circle cx="10" cy="5.5" r="2" />
      <Path d="M10 7.5v7M10 14.5l-2 6M10 14.5l2 6" />
      <Path d="M10 8.5l3.5 -4.5" />
      <Path d="M13.5 4l-1.5 4" />
      <Path d={dumbbell(11.7, 8.5, 75, 2.2, 1.3)} />
    </>
  ),
  // elevación lateral — brazos en cruz con mancuernas
  lateral: (
    <>
      <Circle cx="12" cy="5.5" r="2" />
      <Path d="M12 7.5v7M12 14.5l-2 6M12 14.5l2 6" />
      <Path d="M12 10H6M12 10h6" />
      <Path d={dumbbell(5, 10, 90, 2.6, 1.5)} />
      <Path d={dumbbell(19, 10, 90, 2.6, 1.5)} />
    </>
  ),
  // apertura — brazos en arco hacia el frente con mancuernas
  fly: (
    <>
      <Circle cx="12" cy="5" r="2" />
      <Path d="M12 7v8" />
      <Path d="M12 10q-6 -1 -7 4M12 10q6 -1 7 4" />
      <Path d={dumbbell(5, 14.5, 90, 2.4, 1.4)} />
      <Path d={dumbbell(19, 14.5, 90, 2.4, 1.4)} />
    </>
  ),
  // curl femoral — tumbado, espinilla subiendo con rodillo en el tobillo
  legcurl: (
    <>
      <Circle cx="3.5" cy="14" r="1.6" />
      <Path d="M5 14h7" />
      <Path d="M12 14q3.5 0 2.5 -6" />
      <Path d="M13 8.5l3 1" />
      <Path d="M4 16h9" />
    </>
  ),
  // gemelo — de puntillas en el canto de un escalón (flecha de subida)
  calf: (
    <>
      <Circle cx="10.5" cy="4" r="1.9" />
      <Path d="M10.5 6v8" />
      <Path d="M10.5 14l-1.5 3M10.5 14l1.5 3" />
      <Path d="M6 19h8" />
      <Path d="M14 19v-2" />
      <Path d="M8 17v2M12 17v2" />
      <Path d="M19 13V6M16.5 8.5L19 6l2.5 2.5" />
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
