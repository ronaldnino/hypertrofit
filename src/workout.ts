// Hypertrofit · modelo de entrenamientos registrados + utilidades de estadística.
import {Pattern} from './components/ExerciseIcon';
import {Routine, Prescription} from './routines';

// Una serie registrada (lo que de verdad se hizo).
export type LoggedSet = {reps: number; load: number; rpe: number};

// Un ejercicio dentro de una sesión completada.
export type SessionEntry = {
  name: string;
  pattern: Pattern;
  target: string; // "4 × 6-8"
  sets: LoggedSet[];
};

// Una sesión de entrenamiento completada.
export type CompletedSession = {
  id: string;
  routineId: string;
  routineTitle: string;
  kind: 'upper' | 'lower';
  date: number; // epoch ms
  durationSec: number;
  entries: SessionEntry[];
};

// Aplana los ejercicios de una rutina (sin agrupar por músculo).
export const flattenExercises = (r: Routine): Prescription[] =>
  r.blocks.flatMap(b => b.items);

// Extremo bajo del rango de reps de una prescripción ("6-8" → 6, "8" → 8).
export const repsLow = (reps: string): number => {
  const n = parseInt(reps, 10);
  return Number.isFinite(n) ? n : 8;
};

// Volumen de una sesión (Σ carga × reps).
export const sessionVolume = (s: CompletedSession): number =>
  s.entries.reduce(
    (tot, e) => tot + e.sets.reduce((v, st) => v + st.load * st.reps, 0),
    0,
  );

// Series totales registradas en una sesión.
export const sessionSets = (s: CompletedSession): number =>
  s.entries.reduce((n, e) => n + e.sets.length, 0);

// 1RM estimado (Epley) de una serie.
export const e1rm = (load: number, reps: number): number =>
  Math.round(load * (1 + reps / 30));

// Mejor 1RM estimado de un ejercicio dentro de una sesión.
export const bestE1rmForExercise = (
  s: CompletedSession,
  name: string,
): number => {
  const e = s.entries.find(x => x.name === name);
  if (!e) return 0;
  return e.sets.reduce((m, st) => Math.max(m, e1rm(st.load, st.reps)), 0);
};

// Última carga registrada para un ejercicio (para precargar/progresión).
export const lastLoadForExercise = (
  sessions: CompletedSession[],
  name: string,
): number | undefined => {
  for (const s of [...sessions].sort((a, b) => b.date - a.date)) {
    const e = s.entries.find(x => x.name === name);
    if (e && e.sets.length) return e.sets[e.sets.length - 1].load;
  }
  return undefined;
};
