// Hypertrofit · roles y jerarquía.
//   GYM      → administra y hace seguimiento a ENTRENADORES y ATLETAS
//   ENTRENADOR → hace seguimiento a sus ATLETAS, pertenece a un GYM
//   ATLETA    → su propio entrenamiento, pertenece a un ENTRENADOR y un GYM
import {AccentKey} from './theme';

export type Role = 'athlete' | 'coach' | 'gym';

// Orden jerárquico ascendente (para el switcher de desarrollo).
export const ROLE_ORDER: Role[] = ['athlete', 'coach', 'gym'];

export const ROLE_META: Record<
  Role,
  {label: string; color: AccentKey; desc: string}
> = {
  athlete: {label: 'ATLETA', color: 'cyan', desc: 'Tu entrenamiento y progreso'},
  coach: {label: 'ENTRENADOR', color: 'blue', desc: 'Seguimiento de tus atletas'},
  gym: {label: 'GIMNASIO', color: 'mint', desc: 'Entrenadores y atletas'},
};

export type Stat = {label: string; val: string; unit?: string};
export type Setting = {label: string; value: string};

// Fila de roster: alguien a quien este usuario administra / sigue.
export type RosterEntry = {
  id: string;
  initials: string;
  name: string;
  sub: string;
  metric: string;
  metricLabel: string;
  accent: AccentKey;
};

// Relación hacia arriba en la jerarquía (mi entrenador, mi gym).
export type Relation = {
  label: string;
  initials: string;
  name: string;
  sub: string;
};

export type LiftEntry = {lift: string; val: string; unit: string; delta: string};

// ── Rosters compartidos ──
const ATHLETES: RosterEntry[] = [
  {id: 'a1', initials: 'AT', name: 'A. Torres', sub: 'Hipertrofia · Sem 08', metric: '92%', metricLabel: 'ADHERENCIA', accent: 'mint'},
  {id: 'a2', initials: 'MR', name: 'M. Reyes', sub: 'Fuerza · Sem 04', metric: '78%', metricLabel: 'ADHERENCIA', accent: 'warn'},
  {id: 'a3', initials: 'LV', name: 'L. Vega', sub: 'Recomp · Sem 12', metric: '95%', metricLabel: 'ADHERENCIA', accent: 'mint'},
  {id: 'a4', initials: 'JS', name: 'J. Solís', sub: 'Hipertrofia · Sem 02', metric: '64%', metricLabel: 'ADHERENCIA', accent: 'danger'},
  {id: 'a5', initials: 'CM', name: 'C. Mora', sub: 'Fuerza · Sem 06', metric: '88%', metricLabel: 'ADHERENCIA', accent: 'mint'},
];

const COACHES: RosterEntry[] = [
  {id: 'c1', initials: 'DO', name: 'D. Ortega', sub: 'Fuerza · Hipertrofia', metric: '14', metricLabel: 'ATLETAS', accent: 'cyan'},
  {id: 'c2', initials: 'SL', name: 'S. Lima', sub: 'Powerlifting', metric: '9', metricLabel: 'ATLETAS', accent: 'cyan'},
  {id: 'c3', initials: 'VC', name: 'V. Castro', sub: 'Acondicionamiento', metric: '7', metricLabel: 'ATLETAS', accent: 'cyan'},
  {id: 'c4', initials: 'RB', name: 'R. Bravo', sub: 'Movilidad · Rehab', metric: '5', metricLabel: 'ATLETAS', accent: 'cyan'},
];

const KEY_LIFTS: LiftEntry[] = [
  {lift: 'Sentadilla', val: '170.0', unit: 'KG', delta: '+12.5'},
  {lift: 'Press Banca', val: '142.5', unit: 'KG', delta: '+7.5'},
  {lift: 'Deadlift', val: '202.5', unit: 'KG', delta: '+15.0'},
  {lift: 'Press Militar', val: '82.5', unit: 'KG', delta: '+5.0'},
];

// ── Perfil por rol ──
export type ProfileData = {
  eyebrow: string;
  initials: string;
  name: string;
  meta: string;
  color: AccentKey;
  stats: Stat[];
  // secciones propias de cada rol
  lifts?: LiftEntry[];
  relations?: Relation[];
  athletes?: RosterEntry[];
  coaches?: RosterEntry[];
  settings: Setting[];
};

export const PROFILES: Record<Role, ProfileData> = {
  athlete: {
    eyebrow: 'ATLETA · PERFIL',
    initials: 'AT',
    name: 'ALEX · TORRES',
    meta: 'INTERMEDIO · 142 SESIONES',
    color: 'cyan',
    stats: [
      {label: 'PESO', val: '82.4', unit: 'KG'},
      {label: 'EXPERIENCIA', val: '3.4', unit: 'AÑOS'},
      {label: 'RACHA', val: '14', unit: 'SEM'},
    ],
    lifts: KEY_LIFTS,
    relations: [
      {label: 'MI ENTRENADOR', initials: 'DO', name: 'D. ORTEGA', sub: 'Fuerza · Hipertrofia'},
      {label: 'MI GIMNASIO', initials: 'HL', name: 'HYPERTROFIT · LAB', sub: 'Centro · Sede Norte'},
    ],
    settings: [
      {label: 'UNIDADES', value: 'KG'},
      {label: 'DESCANSO · POR DEFECTO', value: '90 SEG'},
      {label: 'ENTRENADOR', value: 'D. ORTEGA'},
      {label: 'NOTIFICACIONES', value: 'ACTIVO'},
      {label: 'EXPORTAR DATOS', value: 'CSV'},
    ],
  },
  coach: {
    eyebrow: 'ENTRENADOR · PERFIL',
    initials: 'DO',
    name: 'DANIEL · ORTEGA',
    meta: 'ENTRENADOR · 6 AÑOS',
    color: 'blue',
    stats: [
      {label: 'ATLETAS', val: '14'},
      {label: 'ACTIVOS', val: '12'},
      {label: 'ADHERENCIA', val: '86', unit: '%'},
    ],
    athletes: ATHLETES,
    relations: [
      {label: 'MI GIMNASIO', initials: 'HL', name: 'HYPERTROFIT · LAB', sub: 'Centro · Sede Norte'},
    ],
    settings: [
      {label: 'UNIDADES', value: 'KG'},
      {label: 'CERTIFICACIÓN', value: 'NSCA-CSCS'},
      {label: 'VISIBILIDAD ATLETAS', value: 'TODOS'},
      {label: 'NOTIFICACIONES', value: 'ACTIVO'},
      {label: 'EXPORTAR DATOS', value: 'CSV'},
    ],
  },
  gym: {
    eyebrow: 'GIMNASIO · PERFIL',
    initials: 'HL',
    name: 'HYPERTROFIT · LAB',
    meta: 'CENTRO · DESDE 2019',
    color: 'mint',
    stats: [
      {label: 'ENTRENADORES', val: '5'},
      {label: 'ATLETAS', val: '142'},
      {label: 'ADHERENCIA', val: '88', unit: '%'},
    ],
    coaches: COACHES,
    athletes: ATHLETES,
    settings: [
      {label: 'ZONA HORARIA', value: 'GMT-5'},
      {label: 'FACTURACIÓN', value: 'ACTIVA'},
      {label: 'ROLES Y PERMISOS', value: 'GESTIONAR'},
      {label: 'NOTIFICACIONES', value: 'ACTIVO'},
      {label: 'EXPORTAR DATOS', value: 'CSV'},
    ],
  },
};
