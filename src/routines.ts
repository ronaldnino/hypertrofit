// Hypertrofit · rutinas de musculatura — split Tren Superior / Tren Inferior (4 días/sem).
// Cada tren se entrena 2x por semana (variantes A y B). Solo prescripción (series × reps · RPE
// + patrón de movimiento para la ayuda visual); el registro real vive en el logger (Session).
import {Pattern} from './components/ExerciseIcon';

export type Prescription = {
  name: string;
  sets: number;
  reps: string; // "8", "6-8", "10-12"…
  rpe?: string; // "8"
  pattern: Pattern; // patrón de movimiento → pictograma + etiqueta
  video?: string; // ID de YouTube (técnica). Si falta, el modal cae a búsqueda en YouTube.
};

export type MuscleBlock = {
  group: string; // PECHO, ESPALDA, CUÁDRICEPS…
  items: Prescription[];
};

export type Routine = {
  id: string;
  short: string; // "SUP · A"
  title: string; // "Tren Superior · A"
  kind: 'upper' | 'lower';
  focus: string;
  blocks: MuscleBlock[];
};

export const ROUTINES: Routine[] = [
  {
    id: 'supA',
    short: 'SUP · A',
    title: 'Tren Superior · A',
    kind: 'upper',
    focus: 'Pecho · Espalda · Hombro · Brazos',
    blocks: [
      {
        group: 'PECHO',
        items: [
          {name: 'Press de Banca', sets: 4, reps: '6-8', rpe: '8', pattern: 'pushH'},
          {name: 'Press Inclinado con Mancuerna', sets: 3, reps: '8-10', pattern: 'pushH'},
        ],
      },
      {
        group: 'ESPALDA',
        items: [
          {name: 'Dominadas', sets: 4, reps: '6-8', pattern: 'pullV'},
          {name: 'Remo con Barra', sets: 3, reps: '8-10', pattern: 'pullH'},
        ],
      },
      {
        group: 'HOMBRO',
        items: [{name: 'Press Militar', sets: 3, reps: '8-10', pattern: 'pushV'}],
      },
      {
        group: 'BRAZOS',
        items: [
          {name: 'Curl con Barra', sets: 3, reps: '10-12', pattern: 'curl'},
          {name: 'Fondos en Paralelas', sets: 3, reps: '10-12', pattern: 'pushV'},
        ],
      },
    ],
  },
  {
    id: 'infA',
    short: 'INF · A',
    title: 'Tren Inferior · A',
    kind: 'lower',
    focus: 'Cuádriceps · Isquios · Glúteos · Gemelos',
    blocks: [
      {
        group: 'CUÁDRICEPS',
        items: [
          {name: 'Sentadilla', sets: 4, reps: '6-8', rpe: '8', pattern: 'squat'},
          {name: 'Prensa de Pierna', sets: 3, reps: '10-12', pattern: 'squat'},
        ],
      },
      {
        group: 'ISQUIOS',
        items: [{name: 'Deadlift Rumano', sets: 3, reps: '8-10', pattern: 'hinge'}],
      },
      {
        group: 'GLÚTEOS',
        items: [{name: 'Hip Thrust', sets: 3, reps: '10-12', pattern: 'hipext'}],
      },
      {
        group: 'GEMELOS',
        items: [{name: 'Elevación de Talones de Pie', sets: 4, reps: '12-15', pattern: 'calf'}],
      },
    ],
  },
  {
    id: 'supB',
    short: 'SUP · B',
    title: 'Tren Superior · B',
    kind: 'upper',
    focus: 'Espalda · Pecho · Hombro · Brazos',
    blocks: [
      {
        group: 'ESPALDA',
        items: [
          {name: 'Remo en Polea Baja', sets: 4, reps: '8-10', pattern: 'pullH'},
          {name: 'Jalón al Pecho', sets: 3, reps: '10-12', pattern: 'pullV'},
        ],
      },
      {
        group: 'PECHO',
        items: [
          {name: 'Press Inclinado con Barra', sets: 4, reps: '8', pattern: 'pushH'},
          {name: 'Aperturas en Polea', sets: 3, reps: '12-15', pattern: 'fly'},
        ],
      },
      {
        group: 'HOMBRO',
        items: [
          {name: 'Elevaciones Laterales', sets: 4, reps: '12-15', pattern: 'lateral'},
          {name: 'Face Pull', sets: 3, reps: '15', pattern: 'pullH'},
        ],
      },
      {
        group: 'BRAZOS',
        items: [
          {name: 'Curl Martillo', sets: 3, reps: '10-12', pattern: 'curl'},
          {name: 'Extensión de Tríceps en Polea', sets: 3, reps: '12-15', pattern: 'ext'},
        ],
      },
    ],
  },
  {
    id: 'infB',
    short: 'INF · B',
    title: 'Tren Inferior · B',
    kind: 'lower',
    focus: 'Isquios · Cuádriceps · Glúteos · Gemelos',
    blocks: [
      {
        group: 'ISQUIOS',
        items: [
          {name: 'Deadlift', sets: 4, reps: '5', rpe: '8', pattern: 'hinge'},
          {name: 'Curl Femoral', sets: 3, reps: '10-12', pattern: 'legcurl'},
        ],
      },
      {
        group: 'CUÁDRICEPS',
        items: [
          {name: 'Sentadilla Frontal', sets: 4, reps: '8', pattern: 'squat'},
          {name: 'Zancadas', sets: 3, reps: '10', pattern: 'squat'},
        ],
      },
      {
        group: 'GLÚTEOS',
        items: [{name: 'Hip Thrust', sets: 4, reps: '8-10', pattern: 'hipext'}],
      },
      {
        group: 'GEMELOS',
        items: [{name: 'Gemelo Sentado', sets: 4, reps: '15-20', pattern: 'calf'}],
      },
    ],
  },
];

// Distribución semanal del split (4 sesiones · cada tren 2x).
export const WEEK_SPLIT: {day: string; routineId: string | null}[] = [
  {day: 'LUN', routineId: 'supA'},
  {day: 'MAR', routineId: 'infA'},
  {day: 'MIÉ', routineId: null},
  {day: 'JUE', routineId: 'supB'},
  {day: 'VIE', routineId: 'infB'},
  {day: 'SÁB', routineId: null},
  {day: 'DOM', routineId: null},
];

// Videos de técnica por ejercicio (ID de YouTube de canales fiables, verificados vía
// oEmbed). Centralizado por NOMBRE para no repetir el ID cuando un ejercicio aparece en
// varias rutinas. `Prescription.video` puede sobrescribir puntualmente.
export const EXERCISE_VIDEOS: Record<string, string> = {
  'Press de Banca': 'rT7DgCr-3pg', // ScottHermanFitness
  'Press Inclinado con Mancuerna': 'hChjZQhX1Ls', // ScottHermanFitness
  Dominadas: 'vw5Xmu5CIew', // Buff Dudes
  'Remo con Barra': 'rqTOAM8WoeM',
  'Press Militar': 'F3QY5vMz_6I', // Buff Dudes
  'Curl con Barra': 'JJB8XgKltA8', // Buff Dudes
  'Fondos en Paralelas': 'bd-eYgKJUdc',
  Sentadilla: 'T_t85kQEDWk', // Women's Health
  'Prensa de Pierna': 'CHPHn-OnTqE', // Colossus Fitness
  'Deadlift Rumano': 'uhghy9pFIPY', // E3 Rehab
  'Hip Thrust': 'Zp26q4BY5HE', // Girls Gone Strong
  'Elevación de Talones de Pie': '97NbelB5yvQ',
  'Remo en Polea Baja': '7BkgqzC6WsM', // Colossus Fitness
  'Jalón al Pecho': 'CAwf7n6Luuc', // ScottHermanFitness
  'Press Inclinado con Barra': 'jPLdzuHckI8', // Buff Dudes
  'Aperturas en Polea': 'QcTcWpkn_bw', // PureGym
  'Elevaciones Laterales': 'nnH63icHYXY',
  'Face Pull': 'eTCBSFlCJ_s', // NASM
  'Curl Martillo': 'zC3nLlEvin4', // ScottHermanFitness
  'Extensión de Tríceps en Polea': '_w-HpW70nSQ', // ScottHermanFitness
  Deadlift: 'GxsLrTzyGUU', // PureGym
  'Curl Femoral': '3gZm9wGTsEo',
  'Sentadilla Frontal': '0ect9ETE6t0', // Fit Father Project
  Zancadas: 'I34ysEkPK7w', // Bobby Maximus
  'Gemelo Sentado': 'smyXy_dhXo8', // Fitness Lab
};

// ID del video de técnica para un ejercicio (override de la prescripción o mapa central).
export const youtubeId = (ex: Prescription): string | undefined =>
  ex.video ?? EXERCISE_VIDEOS[ex.name];

// URL de búsqueda en YouTube (fallback cuando no hay video incrustable).
export const youtubeSearchUrl = (ex: Prescription) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${ex.name} técnica ejecución`,
  )}`;

// Guía visual: imagen profesional del ejercicio (free-exercise-db, licencia abierta,
// imágenes raw verificadas) + pasos de técnica en español. Por NOMBRE de ejercicio.
const GUIDE_BASE =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

type Guide = {img: string; steps: string[]};

export const EXERCISE_GUIDE: Record<string, Guide> = {
  'Press de Banca': {
    img: 'Barbell_Bench_Press_-_Medium_Grip/0.jpg',
    steps: [
      'Acuéstate con los ojos bajo la barra; agarre algo más ancho que los hombros.',
      'Retrae las escápulas, pecho alto y pies firmes en el suelo.',
      'Baja la barra controlada hasta la línea del pecho.',
      'Empuja hacia arriba hasta extender los codos sin rebotar.',
    ],
  },
  'Press Inclinado con Mancuerna': {
    img: 'Incline_Dumbbell_Press/0.jpg',
    steps: [
      'Banco a 30-45°; mancuernas a la altura del pecho, muñecas firmes.',
      'Escápulas retraídas y pecho alto.',
      'Empuja arriba juntando levemente las mancuernas sin chocarlas.',
      'Baja controlado hasta sentir estiramiento en el pecho superior.',
    ],
  },
  Dominadas: {
    img: 'Pullups/0.jpg',
    steps: [
      'Agarre prono algo más ancho que los hombros; cuelga con brazos extendidos.',
      'Deprime los hombros y tira llevando el pecho hacia la barra.',
      'Sube hasta que la barbilla supere la barra.',
      'Baja controlado hasta la extensión completa.',
    ],
  },
  'Remo con Barra': {
    img: 'Bent_Over_Barbell_Row/0.jpg',
    steps: [
      'Bisagra de cadera ~45°, espalda neutra, barra colgando.',
      'Tira la barra hacia el abdomen bajo llevando los codos atrás.',
      'Aprieta las escápulas arriba.',
      'Baja controlado sin redondear la espalda.',
    ],
  },
  'Press Militar': {
    img: 'Standing_Military_Press/0.jpg',
    steps: [
      'De pie, barra a la altura de las clavículas, agarre a la anchura de los hombros.',
      'Glúteos y core apretados; empuja la barra recta hacia arriba.',
      'Mete la cabeza al pasar la barra y extiende los codos.',
      'Baja controlada a las clavículas.',
    ],
  },
  'Curl con Barra': {
    img: 'Barbell_Curl/0.jpg',
    steps: [
      'De pie, agarre supino a la anchura de los hombros, codos pegados al torso.',
      'Flexiona los codos subiendo la barra sin balancear.',
      'Aprieta el bíceps arriba.',
      'Baja controlado hasta extender los brazos.',
    ],
  },
  'Fondos en Paralelas': {
    img: 'Dips_-_Chest_Version/0.jpg',
    steps: [
      'Sujétate en las paralelas con los brazos extendidos.',
      'Inclina ligeramente el torso al frente para enfatizar el pecho.',
      'Baja hasta que los hombros queden a la altura de los codos.',
      'Empuja hacia arriba hasta extender los codos.',
    ],
  },
  Sentadilla: {
    img: 'Barbell_Squat/0.jpg',
    steps: [
      'Barra sobre los trapecios, pies a la anchura de los hombros, puntas algo abiertas.',
      'Core apretado; baja flexionando cadera y rodillas a la vez.',
      'Desciende hasta que la cadera quede bajo la rodilla (o tu rango).',
      'Empuja con todo el pie hasta erguirte.',
    ],
  },
  'Prensa de Pierna': {
    img: 'Leg_Press/0.jpg',
    steps: [
      'Espalda y glúteos apoyados; pies a la anchura de los hombros en la plataforma.',
      'Baja la plataforma flexionando las rodillas hacia el pecho.',
      'Llega a ~90° sin despegar la zona lumbar del respaldo.',
      'Empuja sin bloquear bruscamente las rodillas.',
    ],
  },
  'Deadlift Rumano': {
    img: 'Romanian_Deadlift/0.jpg',
    steps: [
      'De pie con la barra, rodillas ligeramente flexionadas.',
      'Lleva la cadera atrás bajando la barra pegada a las piernas.',
      'Baja hasta sentir estiramiento en los isquios, espalda neutra.',
      'Empuja la cadera al frente para subir.',
    ],
  },
  'Hip Thrust': {
    img: 'Barbell_Hip_Thrust/0.jpg',
    steps: [
      'Espalda alta apoyada en un banco, barra sobre la cadera.',
      'Pies firmes con los talones bajo las rodillas.',
      'Empuja con los talones hasta alinear torso y muslos.',
      'Aprieta los glúteos arriba y baja controlado.',
    ],
  },
  'Elevación de Talones de Pie': {
    img: 'Standing_Calf_Raises/0.jpg',
    steps: [
      'De pie, puntas sobre un escalón con los talones libres.',
      'Baja los talones para estirar el gemelo.',
      'Sube de puntillas lo máximo posible.',
      'Aprieta arriba y baja lento.',
    ],
  },
  'Remo en Polea Baja': {
    img: 'Seated_Cable_Rows/0.jpg',
    steps: [
      'Sentado, rodillas algo flexionadas, agarra el maneral.',
      'Torso erguido; tira hacia el abdomen llevando los codos atrás.',
      'Aprieta las escápulas.',
      'Extiende los brazos controlado sin redondear la espalda.',
    ],
  },
  'Jalón al Pecho': {
    img: 'Wide-Grip_Lat_Pulldown/0.jpg',
    steps: [
      'Sentado, muslos fijos bajo el rodillo, agarre ancho prono.',
      'Lleva la barra a la parte alta del pecho deprimiendo los hombros.',
      'Aprieta la espalda abajo.',
      'Sube controlado hasta extender los brazos.',
    ],
  },
  'Press Inclinado con Barra': {
    img: 'Barbell_Incline_Bench_Press_-_Medium_Grip/0.jpg',
    steps: [
      'Banco a 30-45°; agarre algo más ancho que los hombros.',
      'Escápulas retraídas; baja la barra a la clavícula/pecho alto.',
      'Empuja arriba hasta extender los codos.',
      'Controla la bajada.',
    ],
  },
  'Aperturas en Polea': {
    img: 'Cable_Crossover/0.jpg',
    steps: [
      'De pie entre las poleas, codos ligeramente flexionados.',
      'Junta las manos al frente en arco apretando el pecho.',
      'Controla la apertura hasta sentir estiramiento.',
      'Mantén los codos fijos durante todo el recorrido.',
    ],
  },
  'Elevaciones Laterales': {
    img: 'Side_Lateral_Raise/0.jpg',
    steps: [
      'De pie, mancuernas a los lados, codos ligeramente flexionados.',
      'Eleva los brazos a los lados hasta la altura de los hombros.',
      'Lidera con los codos, sin encoger los trapecios.',
      'Baja lento controlando.',
    ],
  },
  'Face Pull': {
    img: 'Face_Pull/0.jpg',
    steps: [
      'Polea a la altura de la cara con cuerda.',
      'Tira hacia la frente separando las manos.',
      'Rota los hombros hacia afuera con los codos altos.',
      'Aprieta los deltoides posteriores y vuelve controlado.',
    ],
  },
  'Curl Martillo': {
    img: 'Hammer_Curls/0.jpg',
    steps: [
      'De pie, mancuernas con agarre neutro (palmas enfrentadas).',
      'Flexiona los codos manteniéndolos pegados al torso.',
      'Aprieta arriba sin girar la muñeca.',
      'Baja controlado.',
    ],
  },
  'Extensión de Tríceps en Polea': {
    img: 'Triceps_Pushdown/0.jpg',
    steps: [
      'De pie frente a la polea alta, codos pegados al torso.',
      'Extiende los codos empujando hacia abajo.',
      'Aprieta el tríceps abajo.',
      'Sube controlado sin despegar los codos.',
    ],
  },
  Deadlift: {
    img: 'Barbell_Deadlift/0.jpg',
    steps: [
      'Pies a la anchura de cadera, barra sobre el medio del pie.',
      'Flexiona para agarrar; pecho alto y espalda neutra.',
      'Empuja el suelo extendiendo cadera y rodillas a la vez.',
      'Bloquea la cadera arriba; baja con control.',
    ],
  },
  'Curl Femoral': {
    img: 'Lying_Leg_Curls/0.jpg',
    steps: [
      'Boca abajo, rodillo sobre los tobillos.',
      'Flexiona las rodillas llevando los talones a los glúteos.',
      'Aprieta los isquios arriba.',
      'Baja lento sin soltar la tensión.',
    ],
  },
  'Sentadilla Frontal': {
    img: 'Front_Barbell_Squat/0.jpg',
    steps: [
      'Barra sobre los deltoides frontales, codos altos.',
      'Torso erguido; baja flexionando rodillas y cadera.',
      'Mantén los codos arriba en todo el recorrido.',
      'Empuja con todo el pie hasta erguirte.',
    ],
  },
  Zancadas: {
    img: 'Dumbbell_Lunges/0.jpg',
    steps: [
      'De pie con mancuernas, da un paso largo al frente.',
      'Baja flexionando ambas rodillas (la trasera hacia el suelo).',
      'Mantén la rodilla delantera alineada con el pie.',
      'Empuja con el talón delantero para volver/avanzar.',
    ],
  },
  'Gemelo Sentado': {
    img: 'Seated_Calf_Raise/0.jpg',
    steps: [
      'Sentado, rodillas a 90° con la almohadilla sobre los muslos.',
      'Baja los talones estirando el gemelo.',
      'Sube de puntillas al máximo.',
      'Aprieta arriba y baja lento.',
    ],
  },
};

// Guía (imagen + pasos) para un ejercicio, o undefined si no hay.
export const guideFor = (
  ex: Prescription,
): {image: string; steps: string[]} | undefined => {
  const g = EXERCISE_GUIDE[ex.name];
  return g ? {image: `${GUIDE_BASE}/${g.img}`, steps: g.steps} : undefined;
};

// Helpers de resumen
export const routineById = (id: string) => ROUTINES.find(r => r.id === id);

// Rutina asignada a HOY según el split semanal (o undefined si es día de descanso).
export const todaysRoutine = (): Routine | undefined => {
  const idx = (new Date().getDay() + 6) % 7; // JS: 0=Dom → WEEK_SPLIT empieza en LUN
  const slot = WEEK_SPLIT[idx];
  return slot?.routineId ? routineById(slot.routineId) : undefined;
};
export const countExercises = (r: Routine) =>
  r.blocks.reduce((n, b) => n + b.items.length, 0);
export const countSets = (r: Routine) =>
  r.blocks.reduce((n, b) => n + b.items.reduce((s, it) => s + it.sets, 0), 0);
