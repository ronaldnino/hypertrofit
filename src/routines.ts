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

// URL de técnica: si la prescripción trae un ID de YouTube, enlace directo;
// si no, búsqueda en YouTube por nombre del ejercicio (siempre resuelve algo).
export const youtubeUrl = (ex: Prescription) =>
  ex.video
    ? `https://www.youtube.com/watch?v=${ex.video}`
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(
        `${ex.name} técnica ejecución`,
      )}`;

// Helpers de resumen
export const routineById = (id: string) => ROUTINES.find(r => r.id === id);
export const countExercises = (r: Routine) =>
  r.blocks.reduce((n, b) => n + b.items.length, 0);
export const countSets = (r: Routine) =>
  r.blocks.reduce((n, b) => n + b.items.reduce((s, it) => s + it.sets, 0), 0);
